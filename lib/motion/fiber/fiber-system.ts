// FiberSystem : les 3 fibres optiques qui parcourent toute la page.
// - SVG en position absolue sous le contenu, tracés calculés depuis les ancres [data-fiber-anchor]
// - révélation au scroll (masque + stroke-dashoffset, scrub 0.6), ~30 % sous le bas du viewport
// - impulsion lumineuse liée au scroll, respiration après 2s d'inactivité
// - événement window "fiber:arrive" { fiber, anchorId, mode } quand une impulsion atteint une ancre
// API : FiberSystem.setLit(fiber, bool), FiberSystem.pulse(fiber, fromAnchor, toAnchor, duration)

import heroPorts from "../hero-ports.json";
import { debounce, isMobile, onReducedMotionChange, prefersReducedMotion } from "../env";
import { gsap } from "../gsap";
import { measureAtRest } from "./measure";
import { tokens } from "../tokens";
import {
  type AnchorAxis,
  type AnchorMode,
  type AnchorSpec,
  type ArrivalMarker,
  type FiberId,
  FIBERS,
  type Rect,
  type RouteResult,
  routeFibers,
  type Vec,
} from "./fiber-router";

export type { FiberId } from "./fiber-router";

export type FiberArriveDetail = { fiber: FiberId; anchorId: string; mode: AnchorMode; direction?: "ltr" | "rtl" };

declare global {
  interface WindowEventMap {
    "fiber:arrive": CustomEvent<FiberArriveDetail>;
  }
}

const SVG_NS = "http://www.w3.org/2000/svg";

const CONFIG = {
  revealAhead: 1.3, // la fibre est dessinée jusqu'à 130 % de la hauteur du viewport
  headAt: 0.62, // position de la tête d'impulsion liée au scroll, en fraction du viewport
  headStagger: 0.05, // flux décalés : B puis C suivent A avec un léger retard (fraction du viewport)
  breathStagger: 0.45, // s : décalage de départ des respirations A → B → C
  scrub: 0.6,
  sampleStep: 6, // px de tracé entre deux échantillons
  horizontalPace: 0.35, // px de scroll par px de tracé sur les passages horizontaux
  idleBeforeBreath: 2,
  breathDuration: 2.4,
  scrollPulseLinger: 0.25, // s avant extinction de l'impulsion quand le scroll s'arrête
  rebuildDebounce: 150,
  // Impulsion : traînée en paliers le long du trait (un dégradé SVG ne peut pas suivre un chemin).
  pulseSegments: [120, 72, 36, 12],
} as const;

const OBSTACLE_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,label,input,textarea,select,button,a,img,picture,video,svg:not(.fiber-svg),[data-fiber-avoid]";

type FiberState = {
  id: FiberId;
  length: number;
  lens: Float32Array;
  xs: Float32Array;
  ys: Float32Array;
  revealYs: Float32Array; // max cumulé de y : longueur révélée pour une hauteur donnée
  keys: Float32Array; // clé de scroll strictement croissante (passages horizontaux étalés)
  offPath: SVGPathElement;
  maskPath: SVGPathElement;
  glowPath: SVGPathElement;
  pulseGroup: SVGGElement;
  pulsePaths: SVGPathElement[];
  head: number;
  owner: "scroll" | "breath" | "api" | null;
  pulseTween: gsap.core.Animation | null;
  lit: boolean;
};

type Instance = {
  stage: HTMLElement;
  layer: HTMLElement;
  svg: SVGSVGElement;
  glowSvg: SVGSVGElement;
  debugGroup: SVGGElement;
  fibers: Record<FiberId, FiberState>;
  markers: (ArrivalMarker & { len: number })[];
  anchors: Map<string, { el: HTMLElement; spec: AnchorSpec }>;
  route: RouteResult | null;
  reduced: boolean;
  mobile: boolean;
  stageTop: number;
  proxy: { scroll: number };
  scrollTween: gsap.core.Tween | null;
  idleCall: gsap.core.Tween | null;
  lingerCall: gsap.core.Tween | null;
  stopObserving: (() => void) | null;
  reducedEmitted: Set<string>; // ancres déjà annoncées en reduced motion (survit aux recalculs)
  cleanups: (() => void)[];
};

let instance: Instance | null = null;
let uid = 0;

// ---------------------------------------------------------------------------
// Construction du SVG

const svgEl = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}) => {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
};

function createLayer(layer: HTMLElement) {
  const prefix = `fiber-${++uid}`;
  const glowSvg = svgEl("svg", { class: "fiber-svg fiber-svg--glow", "aria-hidden": "true", focusable: "false" });
  const svg = svgEl("svg", { class: "fiber-svg", "aria-hidden": "true", focusable: "false" });

  const glowDefs = svgEl("defs");
  const blur = svgEl("filter", { id: `${prefix}-blur`, x: "-50%", y: "-50%", width: "200%", height: "200%" });
  blur.append(svgEl("feGaussianBlur", { stdDeviation: 4 }));
  glowDefs.append(blur);
  glowSvg.append(glowDefs);

  const defs = svgEl("defs");
  svg.append(defs);

  const fibers = {} as Record<FiberId, FiberState>;
  for (const id of FIBERS) {
    const mask = svgEl("mask", { id: `${prefix}-mask-${id}`, maskUnits: "userSpaceOnUse" });
    const maskPath = svgEl("path", { class: "fiber-mask-path" });
    mask.append(maskPath);
    defs.append(mask);

    const group = svgEl("g", { class: `fiber fiber--${id}`, "data-fiber": id });
    const offPath = svgEl("path", { class: "fiber-off", mask: `url(#${prefix}-mask-${id})` });
    const pulseGroup = svgEl("g", { class: "fiber-pulse" });
    const pulsePaths = CONFIG.pulseSegments.map((_, i) =>
      svgEl("path", { class: `fiber-pulse-seg fiber-pulse-seg--${i + 1}` }),
    );
    pulseGroup.append(...pulsePaths);
    group.append(offPath, pulseGroup);
    svg.append(group);

    const glowPath = svgEl("path", { class: `fiber-glow fiber-glow--${id}`, filter: `url(#${prefix}-blur)` });
    glowSvg.append(glowPath);

    fibers[id] = {
      id,
      length: 0,
      lens: new Float32Array(0),
      xs: new Float32Array(0),
      ys: new Float32Array(0),
      revealYs: new Float32Array(0),
      keys: new Float32Array(0),
      offPath,
      maskPath,
      glowPath,
      pulseGroup,
      pulsePaths,
      head: 0,
      owner: null,
      pulseTween: null,
      lit: false,
    };
  }

  const debugGroup = svgEl("g", { class: "fiber-debug" });
  svg.append(debugGroup);
  layer.append(glowSvg, svg);
  return { svg, glowSvg, fibers, debugGroup };
}

// ---------------------------------------------------------------------------
// Mesures DOM

const relRect = (el: Element, origin: DOMRect): Rect => {
  const r = el.getBoundingClientRect();
  return { left: r.left - origin.left, top: r.top - origin.top, right: r.right - origin.left, bottom: r.bottom - origin.top };
};

const isRendered = (el: HTMLElement) => el.getClientRects().length > 0;

function readAnchors(stage: HTMLElement, origin: DOMRect) {
  const anchors = new Map<string, { el: HTMLElement; spec: AnchorSpec }>();
  stage.querySelectorAll<HTMLElement>("[data-fiber-anchor]").forEach((el) => {
    if (!isRendered(el)) return;
    const id = el.dataset.fiberAnchor || `anchor-${anchors.size}`;
    const raw = (el.dataset.fiber || "all").toUpperCase();
    const fibers = raw === "ALL" ? [...FIBERS] : FIBERS.filter((f) => raw.split(/[\s,]+/).includes(f));
    const mode = (["pass", "plug", "end"].includes(el.dataset.fiberMode ?? "") ? el.dataset.fiberMode : "pass") as AnchorMode;
    const axis = (["x", "y"].includes(el.dataset.fiberAxis ?? "") ? el.dataset.fiberAxis : "point") as AnchorAxis;
    if (anchors.has(id) && process.env.NODE_ENV !== "production") {
      console.warn(`[FiberSystem] ancre en double : "${id}"`);
    }
    anchors.set(id, { el, spec: { id, fibers, mode, axis, rect: relRect(el, origin) } });
  });
  return anchors;
}

const TEXT_BLOCKS = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "LI", "BLOCKQUOTE", "FIGCAPTION", "LABEL"]);

// Obstacles : lignes de texte réelles (pas le bloc pleine largeur) et éléments visuels / interactifs.
// Une ancre, ce qui la contient et ce qu'elle contient ne sont jamais des obstacles.
function readObstacles(stage: HTMLElement, layer: HTMLElement, origin: DOMRect) {
  const obstacles: Rect[] = [];
  const range = document.createRange();
  const push = (r: DOMRect) => {
    if (r.width < 1 || r.height < 1) return;
    obstacles.push({
      left: r.left - origin.left,
      top: r.top - origin.top,
      right: r.right - origin.left,
      bottom: r.bottom - origin.top,
    });
  };
  stage.querySelectorAll<HTMLElement>(OBSTACLE_SELECTOR).forEach((el) => {
    if (layer.contains(el)) return;
    if (el.closest("[data-fiber-through],[data-fiber-origin],[data-fiber-ignore],[data-fiber-anchor]")) return;
    if (el.querySelector("[data-fiber-anchor]")) return;
    if (el.parentElement?.closest(OBSTACLE_SELECTOR)) return; // le bloc parent suffit
    if (TEXT_BLOCKS.has(el.tagName)) {
      range.selectNodeContents(el);
      for (const r of range.getClientRects()) push(r);
    } else {
      push(el.getBoundingClientRect());
    }
  });
  range.detach();
  return obstacles;
}

// Points de départ : les 3 ports de l'ordinateur dans la vidéo (object-fit: cover pris en compte).
function readOrigins(stage: HTMLElement, origin: DOMRect, width: number) {
  const el = stage.querySelector<HTMLElement>("[data-fiber-origin]");
  // Une seule vidéo d'ordinateur (cadre 6:5) pour tous les écrans.
  const config = heroPorts;
  const origins = {} as Record<FiberId, Vec>;
  if (!el) {
    for (const f of FIBERS) origins[f] = { x: width / 2 + (f === "A" ? -14 : f === "C" ? 14 : 0), y: 0 };
    return origins;
  }
  const box = relRect(el, origin);
  const w = box.right - box.left;
  const h = box.bottom - box.top;
  const s = Math.max(w / config.media.width, h / config.media.height);
  const mw = config.media.width * s;
  const mh = config.media.height * s;
  const ox = box.left + (w - mw) / 2;
  const oy = box.top + (h - mh) / 2;
  for (const f of FIBERS) {
    const [px, py] = config.ports[f] as [number, number];
    origins[f] = { x: ox + (px / 100) * mw, y: oy + (py / 100) * mh };
  }
  return origins;
}

// ---------------------------------------------------------------------------
// Échantillonnage : longueur ↔ hauteur

function sample(state: FiberState, d: string) {
  state.offPath.setAttribute("d", d);
  const total = d ? state.offPath.getTotalLength() : 0;
  const n = Math.max(2, Math.ceil(total / CONFIG.sampleStep) + 1);
  const lens = new Float32Array(n);
  const xs = new Float32Array(n);
  const ys = new Float32Array(n);
  const revealYs = new Float32Array(n);
  const keys = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const len = Math.min(total, i * CONFIG.sampleStep);
    const p = total ? state.offPath.getPointAtLength(len) : { x: 0, y: 0 };
    lens[i] = len;
    xs[i] = p.x;
    ys[i] = p.y;
    revealYs[i] = i ? Math.max(revealYs[i - 1], p.y) : p.y;
    // Sur les passages horizontaux, la tête avance au rythme du scroll au lieu de sauter.
    keys[i] = i ? Math.max(p.y, keys[i - 1] + CONFIG.horizontalPace * (len - lens[i - 1]) + 1e-3) : p.y;
  }
  Object.assign(state, { length: total, lens, xs, ys, revealYs, keys });
}

// Plus grande longueur dont tous les points sont au-dessus de y.
function revealLength(state: FiberState, y: number) {
  const { revealYs, lens } = state;
  let lo = 0;
  let hi = revealYs.length - 1;
  if (!revealYs.length || revealYs[0] > y) return 0;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (revealYs[mid] <= y) lo = mid;
    else hi = mid - 1;
  }
  return lo === revealYs.length - 1 ? state.length : lens[lo];
}

// Longueur de tête pour une hauteur de scroll donnée (interpolée sur les clés croissantes).
function headLength(state: FiberState, y: number) {
  const { keys, lens } = state;
  if (!keys.length || y <= keys[0]) return 0;
  if (y >= keys[keys.length - 1]) return state.length;
  let lo = 0;
  let hi = keys.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (keys[mid] <= y) lo = mid;
    else hi = mid;
  }
  const t = (y - keys[lo]) / (keys[hi] - keys[lo]);
  return lens[lo] + t * (lens[hi] - lens[lo]);
}

function nearestLength(state: FiberState, point: Vec) {
  if (!state.length) return 0;
  // Recherche grossière sur les échantillons puis affinage local au pixel.
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < state.lens.length; i++) {
    const dist = (state.xs[i] - point.x) ** 2 + (state.ys[i] - point.y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = state.lens[i];
    }
  }
  for (let l = Math.max(0, best - CONFIG.sampleStep); l <= Math.min(state.length, best + CONFIG.sampleStep); l += 1) {
    const p = state.offPath.getPointAtLength(l);
    const dist = (p.x - point.x) ** 2 + (p.y - point.y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = l;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Rendu

function setHead(inst: Instance, state: FiberState, head: number) {
  const previous = state.head;
  state.head = head;
  CONFIG.pulseSegments.forEach((seg, i) => {
    state.pulsePaths[i].style.strokeDashoffset = String(seg - head);
  });
  if (head > previous) {
    for (const m of inst.markers) {
      if (m.carrier === state.id && m.len > previous && m.len <= head) emitArrive(m);
    }
  }
}

function emitArrive(m: ArrivalMarker) {
  window.dispatchEvent(
    new CustomEvent<FiberArriveDetail>("fiber:arrive", {
      detail: { fiber: m.fiber, anchorId: m.anchorId, mode: m.mode, direction: m.direction },
    }),
  );
}

function render(inst: Instance) {
  const vh = window.innerHeight;
  const top = inst.proxy.scroll - inst.stageTop;
  for (const f of FIBERS) {
    const state = inst.fibers[f];
    const reveal = revealLength(state, top + vh * CONFIG.revealAhead);
    state.maskPath.style.strokeDashoffset = String(state.length - reveal);
    if (state.owner === "scroll") setHead(inst, state, headLength(state, top + vh * headAt(f)));
  }
}

// Tête d'impulsion propre à chaque fibre : les trois flux ne se suivent pas en bloc.
const headAt = (f: FiberId) => CONFIG.headAt - FIBERS.indexOf(f) * CONFIG.headStagger;

const fadePulse = (state: FiberState, on: boolean, duration?: number) => {
  const t = tokens();
  return gsap.to(state.pulseGroup, {
    opacity: on ? 1 : 0,
    duration: duration ?? (on ? t.dur.micro : t.dur.reveal),
    ease: t.ease.breath,
    overwrite: "auto",
  });
};

// Scroll actif : l'impulsion suit le scroll. Inactif 2s : respiration.
function onScrollActivity(inst: Instance) {
  for (const f of FIBERS) {
    const state = inst.fibers[f];
    if (state.owner === "api") continue;
    if (state.owner !== "scroll") {
      state.pulseTween?.kill();
      state.pulseTween = null;
      state.owner = "scroll";
      fadePulse(state, true);
    }
  }
  inst.lingerCall?.kill();
  inst.lingerCall = gsap.delayedCall(CONFIG.scrollPulseLinger, () => {
    for (const f of FIBERS) {
      const state = inst.fibers[f];
      if (state.owner === "scroll") {
        state.owner = null;
        fadePulse(state, false);
      }
    }
  });
  scheduleBreath(inst);
}

function scheduleBreath(inst: Instance) {
  inst.idleCall?.kill();
  inst.idleCall = gsap.delayedCall(CONFIG.idleBeforeBreath, () => breathe(inst));
}

function breathe(inst: Instance) {
  if (document.hidden) return scheduleBreath(inst);
  const t = tokens();
  const top = window.scrollY - inst.stageTop;
  const vh = window.innerHeight;
  let longest = 0;

  FIBERS.forEach((f, index) => {
    const state = inst.fibers[f];
    if (state.owner) return;
    const from = headLength(state, top);
    const to = headLength(state, top + vh);
    if (to - from < 40) return; // fibre absente de l'écran
    state.owner = "breath";
    const proxy = { head: from };
    // Départs décalés : A, puis B, puis C.
    const tl = gsap.timeline({
      delay: index * CONFIG.breathStagger,
      onStart: () => setHead(inst, state, from),
      onComplete: () => {
        if (state.owner === "breath") state.owner = null;
        state.pulseTween = null;
      },
    });
    tl.to(state.pulseGroup, { opacity: 1, duration: t.dur.micro, ease: t.ease.breath }, 0)
      .to(proxy, {
        head: to,
        duration: CONFIG.breathDuration,
        ease: t.ease.breath,
        onUpdate: () => setHead(inst, state, proxy.head),
      }, 0)
      .to(state.pulseGroup, { opacity: 0, duration: t.dur.reveal, ease: t.ease.breath }, CONFIG.breathDuration - t.dur.reveal);
    state.pulseTween = tl;
    longest = Math.max(longest, tl.delay() + tl.duration());
  });

  inst.idleCall = gsap.delayedCall(longest + CONFIG.idleBeforeBreath, () => breathe(inst));
}

// ---------------------------------------------------------------------------
// Debug visuel : <div data-fiber-stage data-fiber-debug>

function drawDebug(inst: Instance, obstacles: Rect[]) {
  inst.debugGroup.replaceChildren();
  if (!("fiberDebug" in inst.stage.dataset) || !inst.route) return;
  for (const o of obstacles) {
    inst.debugGroup.append(
      svgEl("rect", { class: "fiber-debug-obstacle", x: o.left, y: o.top, width: o.right - o.left, height: o.bottom - o.top }),
    );
  }
  for (const c of inst.route.collisions) {
    const [p, q] = c.segment;
    inst.debugGroup.append(svgEl("line", { class: "fiber-debug-collision", x1: p.x, y1: p.y, x2: q.x, y2: q.y }));
  }
  for (const m of inst.route.markers) {
    inst.debugGroup.append(svgEl("circle", { class: "fiber-debug-marker", cx: m.point.x, cy: m.point.y, r: 4 }));
  }
}

// ---------------------------------------------------------------------------
// Cycle de vie

function rebuild(inst: Instance) {
  const origin = inst.stage.getBoundingClientRect();
  const width = inst.stage.clientWidth;
  const height = inst.stage.scrollHeight;
  inst.mobile = isMobile();
  inst.stageTop = origin.top + window.scrollY;

  for (const svg of [inst.svg, inst.glowSvg]) {
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  }

  // Mesures sur la mise en page au repos (sans les transformations des animations en cours).
  const { anchors, obstacles, splitRegions, origins } = measureAtRest(inst.stage, () => ({
    anchors: readAnchors(inst.stage, origin),
    obstacles: readObstacles(inst.stage, inst.layer, origin),
    splitRegions: [...inst.stage.querySelectorAll<HTMLElement>("[data-fiber-split]")]
      .filter(isRendered)
      .map((el) => relRect(el, origin)),
    origins: readOrigins(inst.stage, origin, width),
  }));
  inst.anchors = anchors;

  inst.route = routeFibers({
    width,
    height,
    mobile: inst.mobile,
    origins,
    anchors: [...inst.anchors.values()].map((a) => a.spec),
    obstacles,
    splitRegions,
  });

  for (const f of FIBERS) {
    const state = inst.fibers[f];
    const d = inst.route.paths[f];
    sample(state, d);
    state.maskPath.setAttribute("d", d);
    state.glowPath.setAttribute("d", d);
    state.maskPath.style.strokeDasharray = `${state.length} ${state.length + 1}`;
    state.pulsePaths.forEach((p, i) => {
      p.setAttribute("d", d);
      p.style.strokeDasharray = `${CONFIG.pulseSegments[i]} ${state.length + 240}`;
    });
  }

  inst.markers = inst.route.markers.map((m) => ({
    ...m,
    len: nearestLength(inst.fibers[m.carrier], m.point),
  }));

  if (process.env.NODE_ENV !== "production" && inst.route.collisions.length) {
    console.warn(`[FiberSystem] ${inst.route.collisions.length} segment(s) de fibre traversent un bloc de texte`, inst.route.collisions);
  }
  drawDebug(inst, obstacles);

  if (inst.reduced) {
    for (const f of FIBERS) inst.fibers[f].maskPath.style.strokeDashoffset = "0";
    observeAnchors(inst);
  } else {
    inst.scrollTween?.scrollTrigger?.refresh();
    render(inst);
    for (const f of FIBERS) {
      const state = inst.fibers[f];
      if (state.owner === "scroll" || !state.owner) setHead(inst, state, Math.min(state.head, state.length));
    }
  }
}

// Reduced motion : pas d'impulsion. Chaque ancre émet une seule fois son arrivée dès qu'elle passe
// la ligne de tête (62 % du viewport), y compris celles déjà dépassées après un saut de scroll.
function observeAnchors(inst: Instance) {
  inst.stopObserving?.();
  const emitted = inst.reducedEmitted;
  let frame = 0;
  const check = () => {
    frame = 0;
    const line = window.innerHeight * CONFIG.headAt;
    inst.anchors.forEach(({ el, spec }) => {
      if (emitted.has(spec.id) || el.getBoundingClientRect().top > line) return;
      emitted.add(spec.id);
      for (const fiber of spec.fibers) {
        emitArrive({ fiber, carrier: fiber, anchorId: spec.id, mode: spec.mode, point: { x: 0, y: 0 } });
      }
    });
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(check);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  check();
  inst.stopObserving = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
  };
}

function setup(stage: HTMLElement, layer: HTMLElement) {
  const { svg, glowSvg, fibers, debugGroup } = createLayer(layer);
  const inst: Instance = {
    stage,
    layer,
    svg,
    glowSvg,
    debugGroup,
    fibers,
    markers: [],
    anchors: new Map(),
    route: null,
    reduced: prefersReducedMotion(),
    mobile: isMobile(),
    stageTop: 0,
    proxy: { scroll: window.scrollY },
    scrollTween: null,
    idleCall: null,
    lingerCall: null,
    stopObserving: null,
    reducedEmitted: new Set(),
    cleanups: [],
  };
  layer.classList.toggle("is-reduced", inst.reduced);

  if (!inst.reduced) {
    let last = inst.proxy.scroll;
    inst.scrollTween = gsap.fromTo(inst.proxy, { scroll: 0 }, {
      scroll: () => document.documentElement.scrollHeight - window.innerHeight,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: CONFIG.scrub, invalidateOnRefresh: true },
      onUpdate: () => {
        if (Math.abs(inst.proxy.scroll - last) > 0.5) onScrollActivity(inst);
        last = inst.proxy.scroll;
        render(inst);
      },
    });
    scheduleBreath(inst);
  }

  rebuild(inst);

  const scheduleRebuild = debounce(() => rebuild(inst), CONFIG.rebuildDebounce);
  const resizeObserver = new ResizeObserver(() => scheduleRebuild());
  resizeObserver.observe(stage);
  window.addEventListener("resize", scheduleRebuild);
  window.addEventListener("load", scheduleRebuild);
  document.fonts?.ready.then(() => instance === inst && scheduleRebuild());
  const onImageLoad = (event: Event) => {
    if (event.target instanceof HTMLImageElement) scheduleRebuild();
  };
  stage.addEventListener("load", onImageLoad, true);

  inst.cleanups.push(() => {
    scheduleRebuild.cancel();
    resizeObserver.disconnect();
    window.removeEventListener("resize", scheduleRebuild);
    window.removeEventListener("load", scheduleRebuild);
    stage.removeEventListener("load", onImageLoad, true);
  });
  return inst;
}

function teardown(inst: Instance) {
  inst.cleanups.forEach((fn) => fn());
  inst.scrollTween?.scrollTrigger?.kill();
  inst.scrollTween?.kill();
  inst.idleCall?.kill();
  inst.lingerCall?.kill();
  inst.stopObserving?.();
  for (const f of FIBERS) {
    const state = inst.fibers[f];
    state.pulseTween?.kill();
    gsap.killTweensOf([state.pulseGroup, state.glowPath]);
  }
  inst.svg.remove();
  inst.glowSvg.remove();
  inst.layer.classList.remove("is-reduced");
}

// ---------------------------------------------------------------------------
// API publique

let unsubscribeReduced: (() => void) | null = null;

export const FiberSystem = {
  init(stage: HTMLElement, layer: HTMLElement) {
    if (instance) FiberSystem.destroy();
    instance = setup(stage, layer);
    unsubscribeReduced = onReducedMotionChange(() => {
      if (!instance) return;
      const { stage: s, layer: l } = instance;
      teardown(instance);
      instance = setup(s, l);
    });
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { FiberSystem: typeof FiberSystem }).FiberSystem = FiberSystem;
    }
  },

  destroy() {
    unsubscribeReduced?.();
    unsubscribeReduced = null;
    if (instance) teardown(instance);
    instance = null;
  },

  // Recalcule les tracés (à appeler si une section change de mise en page sans redimensionner le stage).
  refresh() {
    if (instance) rebuild(instance);
  },

  setLit(fiber: FiberId, lit: boolean) {
    const state = instance?.fibers[fiber];
    if (!instance || !state) return;
    state.lit = lit;
    const t = tokens();
    const glowSvg = instance.glowSvg;
    const anyLit = () => FIBERS.some((f) => instance?.fibers[f].lit);
    if (lit) glowSvg.style.visibility = "visible";
    gsap.to(state.glowPath, {
      opacity: lit ? 1 : 0,
      duration: instance.reduced ? 0 : t.dur.reveal,
      ease: t.ease.transition,
      overwrite: "auto",
      onComplete: () => {
        if (!anyLit()) glowSvg.style.visibility = "hidden";
      },
    });
  },

  // Envoie une impulsion d'une ancre à une autre (sens inverse autorisé). Résout à l'arrivée.
  pulse(fiber: FiberId, fromAnchor: string, toAnchor: string, duration: number = tokens().dur.major) {
    return new Promise<void>((resolve) => {
      const inst = instance;
      const state = inst?.fibers[fiber];
      if (!inst || !state || inst.reduced) return resolve();
      const find = (id: string) => inst.markers.find((m) => m.anchorId === id && m.fiber === fiber && m.carrier === fiber);
      const from = find(fromAnchor);
      const to = find(toAnchor);
      if (!from || !to) {
        if (process.env.NODE_ENV !== "production") console.warn(`[FiberSystem] pulse : ancre inconnue sur ${fiber}`);
        return resolve();
      }
      const t = tokens();
      state.pulseTween?.kill();
      state.owner = "api";
      setHead(inst, state, from.len);
      const proxy = { head: from.len };
      state.pulseTween = gsap
        .timeline({
          onComplete: () => {
            state.owner = null;
            state.pulseTween = null;
            resolve();
          },
        })
        .to(state.pulseGroup, { opacity: 1, duration: t.dur.micro, ease: t.ease.breath }, 0)
        .to(proxy, { head: to.len, duration, ease: t.ease.transition, onUpdate: () => setHead(inst, state, proxy.head) }, 0)
        .to(state.pulseGroup, { opacity: 0, duration: t.dur.micro, ease: t.ease.breath }, duration);
    });
  },

  // Diagnostic (dev) : segments qui traversent un bloc de texte.
  debug() {
    return { collisions: instance?.route?.collisions ?? [], markers: instance?.markers ?? [], mobile: instance?.mobile };
  },
};
