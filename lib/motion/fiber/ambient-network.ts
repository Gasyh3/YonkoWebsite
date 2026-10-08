// Réseau secondaire de fibres dans les marges latérales (hors conteneur), complémentaire des fibres A/B/C.
// - Section [data-ambient] : plusieurs départs et arrivées, même grammaire que les fibres principales
//   (pointillés argent, 90°, coudes arrondis, couloirs parallèles à 14px).
//     gauche : arrivées depuis le bord de page jusqu'aux titres de la section ([data-ambient-target] ou h1/h2/h3)
//     droite : départs du contenu vers le bord de page, et liaisons vers la section suivante
// - Animation automatique (pas liée au scroll) : à la première apparition d'une section, ses câbles se dessinent
//   l'un après l'autre, puis des impulsions argent les parcourent en boucle, à intervalles décalés, tant que la
//   section est visible. L'or reste réservé aux fibres principales.
// - Pas de croisement : les portées verticales des câbles d'un même côté sont disjointes, et le réseau reste
//   hors du conteneur, là où passent les fibres principales.
// - Mobile, marges trop étroites : pas de réseau. Reduced motion : câbles dessinés, aucune impulsion.

import { debounce, isMobile, prefersReducedMotion } from "../env";
import { gsap } from "../gsap";
import { tokens } from "../tokens";
import { roundedPath, type Vec } from "./fiber-router";
import { measureAtRest } from "./measure";

const SVG_NS = "http://www.w3.org/2000/svg";

const AMBIENT = {
  radius: 18,
  gap: 14,
  minMargin: 38, // px de marge latérale minimum pour tracer un câble (écran de 1280px : 40px)
  edgeInset: 22, // distance du premier couloir au bord du conteneur (réduite si la marge est étroite)
  terminalGap: 6, // le câble s'arrête à 6px du conteneur
  maxLanes: 3,
  pulseLength: 72,
  pulseSpeed: 420, // px/s : lent, pour se lire sans attirer l'œil comme les fibres principales
  drawStagger: 0.35, // s entre deux câbles d'une même section
} as const;

type Side = "left" | "right";
type Cable = { side: Side; points: Vec[]; section: number; order: number; seed: number };

type SectionInfo = { el: HTMLElement; top: number; bottom: number; targets: number[] };

// Pseudo-aléatoire stable (mêmes rythmes d'un chargement à l'autre).
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------------------
// Géométrie

function lanes(side: Side, width: number, containerLeft: number, containerRight: number) {
  const margin = side === "left" ? containerLeft : width - containerRight;
  if (margin < AMBIENT.minMargin) return [];
  const inset = Math.min(AMBIENT.edgeInset, margin / 2);
  const count = clamp(Math.floor((margin - inset - AMBIENT.radius) / AMBIENT.gap) + 1, 1, AMBIENT.maxLanes);
  return Array.from({ length: count }, (_, k) =>
    side === "left" ? containerLeft - inset - k * AMBIENT.gap : containerRight + inset + k * AMBIENT.gap,
  );
}

export function planCables(width: number, containerLeft: number, containerRight: number, sections: SectionInfo[]) {
  const cables: Cable[] = [];
  const left = lanes("left", width, containerLeft, containerRight);
  const right = lanes("right", width, containerLeft, containerRight);
  const minSpan = AMBIENT.radius * 2 + 12;
  const innerLeft = containerLeft - AMBIENT.terminalGap;
  const innerRight = containerRight + AMBIENT.terminalGap;

  sections.forEach((s, i) => {
    const h = s.bottom - s.top;
    const t0 = s.targets[0] ?? s.top + h * 0.22;
    const t1 = s.targets[1] ?? s.top + h * 0.6;
    let order = 0;

    if (left.length) {
      // Arrivée principale : du bord de page jusqu'au titre, en descendant.
      const span = clamp(h * 0.28, 90, 280);
      const ys = Math.max(s.top + 16, t0 - span);
      if (t0 - ys >= minSpan) {
        const x = left[i % left.length];
        cables.push({ side: "left", section: i, order: order++, seed: i * 10 + 1, points: [{ x: -2, y: ys }, { x, y: ys }, { x, y: t0 }, { x: innerLeft, y: t0 }] });
      }
      // Seconde arrivée (sections hautes) : remonte jusqu'au second repère.
      const ye = Math.min(s.bottom - 16, t1 + clamp(h * 0.25, 90, 260));
      if (s.targets.length > 1 && h > 560 && ye - t1 >= minSpan && t1 > t0 + 40) {
        const x = left[(i + 1) % left.length];
        cables.push({ side: "left", section: i, order: order++, seed: i * 10 + 2, points: [{ x: -2, y: ye }, { x, y: ye }, { x, y: t1 }, { x: innerLeft, y: t1 }] });
      }
    }

    if (right.length) {
      // Départ : du contenu (second repère) vers le bord de page, en descendant.
      const yd = Math.min(s.bottom - h * 0.22, t1 + clamp(h * 0.3, 100, 320));
      if (yd - t1 >= minSpan) {
        const x = right[i % right.length];
        cables.push({ side: "right", section: i, order: order++, seed: i * 10 + 3, points: [{ x: innerRight, y: t1 }, { x, y: t1 }, { x, y: yd }, { x: width + 2, y: yd }] });
      }
      // Liaison vers la section suivante : quitte le bas de celle-ci, arrive en haut de la suivante.
      const next = sections[i + 1];
      if (next) {
        const ya = s.bottom - Math.min(h * 0.14, 110);
        const nextT1 = next.targets[1] ?? next.top + (next.bottom - next.top) * 0.6;
        const yb = Math.min(next.top + Math.min((next.bottom - next.top) * 0.1, 90), nextT1 - minSpan);
        if (yb - ya >= minSpan && ya > yd + 24) {
          const x = right[(i + 1) % right.length];
          cables.push({ side: "right", section: i, order: order++, seed: i * 10 + 4, points: [{ x: innerRight, y: ya }, { x, y: ya }, { x, y: yb }, { x: innerRight, y: yb }] });
        }
      }
    }
  });

  return cables;
}

// ---------------------------------------------------------------------------
// Rendu et animation

type CableView = {
  cable: Cable;
  length: number;
  mask: SVGPathElement;
  pulse: SVGPathElement;
  startNode: SVGCircleElement;
  endNode: SVGCircleElement;
  pulseTl: gsap.core.Timeline | null;
};

type Instance = {
  stage: HTMLElement;
  svg: SVGSVGElement;
  views: CableView[];
  sections: SectionInfo[];
  seen: Set<number>;
  visible: Set<number>;
  observer: IntersectionObserver | null;
  timelines: gsap.core.Animation[];
  cleanups: (() => void)[];
  reduced: boolean;
};

let instance: Instance | null = null;
let uid = 0;

const svgEl = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}) => {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
};

function readSections(stage: HTMLElement): { sections: SectionInfo[]; containerLeft: number; containerRight: number } | null {
  const origin = stage.getBoundingClientRect();
  const container = stage.querySelector<HTMLElement>(".container");
  if (!container) return null;
  const c = container.getBoundingClientRect();
  const sections = [...stage.querySelectorAll<HTMLElement>("[data-ambient]")]
    .filter((el) => el.getClientRects().length > 0)
    .map((el) => {
      const r = el.getBoundingClientRect();
      const explicit = [...el.querySelectorAll<HTMLElement>("[data-ambient-target]")];
      const candidates = explicit.length ? explicit : [...el.querySelectorAll<HTMLElement>("h1, h2, h3")];
      const targets = candidates
        .filter((t) => t.getClientRects().length > 0)
        .slice(0, 2)
        .map((t) => {
          const tr = t.getBoundingClientRect();
          // Titre : première ligne ; bloc haut (visuel) : son centre.
          return tr.top - origin.top + (tr.height > 160 ? tr.height / 2 : Math.min(tr.height / 2, 40));
        })
        .sort((a, b) => a - b);
      return { el, top: r.top - origin.top, bottom: r.bottom - origin.top, targets };
    });
  return { sections, containerLeft: c.left - origin.left, containerRight: c.right - origin.left };
}

function animateSection(inst: Instance, index: number, immediate: boolean) {
  const t = tokens();
  const views = inst.views.filter((v) => v.cable.section === index);
  views.forEach((view) => {
    const { length, mask, startNode, endNode } = view;
    if (immediate || inst.reduced) {
      gsap.set(mask, { strokeDashoffset: 0 });
      gsap.set([startNode, endNode], { opacity: 1, scale: 1 });
    } else {
      const delay = view.cable.order * AMBIENT.drawStagger;
      const draw = 0.8 + length / 1400;
      const tl = gsap
        .timeline({ delay })
        .fromTo(startNode, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: t.dur.micro, ease: t.ease.in, transformOrigin: "50% 50%" }, 0)
        .fromTo(mask, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: draw, ease: t.ease.transition }, 0.1)
        .fromTo(endNode, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: t.dur.micro, ease: t.ease.in, transformOrigin: "50% 50%" }, 0.1 + draw - 0.1);
      inst.timelines.push(tl);
    }
    if (!inst.reduced) startPulses(inst, view, immediate ? 0 : view.cable.order * AMBIENT.drawStagger + 0.9 + length / 1400);
  });
}

// Impulsions en boucle, départs et intervalles décalés d'un câble à l'autre.
function startPulses(inst: Instance, view: CableView, after: number) {
  const t = tokens();
  const { length, pulse, endNode, cable } = view;
  const travel = length / AMBIENT.pulseSpeed;
  const head = { at: 0 };
  const setHead = () => {
    pulse.style.strokeDashoffset = String(AMBIENT.pulseLength - head.at);
  };
  view.pulseTl = gsap
    .timeline({
      repeat: -1,
      delay: after + rand(cable.seed) * 1.2,
      repeatDelay: 0.8 + rand(cable.seed + 0.5) * 1.6,
      paused: !inst.visible.has(cable.section),
    })
    .set(pulse, { opacity: 0 }, 0)
    .fromTo(head, { at: 0 }, { at: length + AMBIENT.pulseLength, duration: travel, ease: t.ease.breath, onUpdate: setHead }, 0)
    .to(pulse, { opacity: 1, duration: t.dur.micro, ease: t.ease.breath }, 0)
    .to(pulse, { opacity: 0, duration: t.dur.micro, ease: t.ease.breath }, travel - t.dur.micro)
    .fromTo(endNode, { opacity: 1 }, { opacity: 0.35, duration: t.dur.reveal, ease: t.ease.breath, yoyo: true, repeat: 1 }, travel - 0.1);
  inst.timelines.push(view.pulseTl);
}

function build(inst: Instance) {
  inst.timelines.forEach((tl) => tl.kill());
  inst.timelines = [];
  inst.svg.replaceChildren();
  inst.views = [];
  inst.observer?.disconnect();
  inst.observer = null;

  const width = inst.stage.clientWidth;
  const height = inst.stage.scrollHeight;
  inst.svg.setAttribute("width", String(width));
  inst.svg.setAttribute("height", String(height));
  inst.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  if (isMobile()) return;

  const read = measureAtRest(inst.stage, () => readSections(inst.stage));
  if (!read) return;
  inst.sections = read.sections;
  const cables = planCables(width, read.containerLeft, read.containerRight, read.sections);
  if (!cables.length) return;

  const prefix = `ambient-${++uid}`;
  const defs = svgEl("defs");
  inst.svg.append(defs);
  cables.forEach((cable, i) => {
    const d = roundedPath(cable.points, AMBIENT.radius);
    const maskEl = svgEl("mask", { id: `${prefix}-${i}`, maskUnits: "userSpaceOnUse", x: 0, y: 0, width, height });
    const mask = svgEl("path", { d, class: "ambient-mask" });
    maskEl.append(mask);
    defs.append(maskEl);
    const group = svgEl("g", { class: `ambient-cable ambient-cable--${cable.side}` });
    const off = svgEl("path", { d, class: "ambient-off", mask: `url(#${prefix}-${i})` });
    const pulse = svgEl("path", { d, class: "ambient-pulse" });
    const start = cable.points[0];
    const end = cable.points[cable.points.length - 1];
    const startNode = svgEl("circle", { cx: start.x, cy: start.y, r: 2.5, class: "ambient-node ambient-node--start" });
    const endNode = svgEl("circle", { cx: end.x, cy: end.y, r: 3.5, class: "ambient-node ambient-node--end" });
    group.append(off, pulse, startNode, endNode);
    inst.svg.append(group);
    const length = mask.getTotalLength();
    mask.style.strokeDasharray = `${length} ${length + 1}`;
    mask.style.strokeDashoffset = String(length);
    pulse.style.strokeDasharray = `${AMBIENT.pulseLength} ${length + AMBIENT.pulseLength * 2}`;
    pulse.style.strokeDashoffset = String(AMBIENT.pulseLength);
    gsap.set([startNode, endNode], { opacity: 0 });
    inst.views.push({ cable, length, mask, pulse, startNode, endNode, pulseTl: null });
  });

  // Reduced motion : tout le réseau est dessiné d'emblée, sans impulsion.
  if (inst.reduced) {
    inst.sections.forEach((_, index) => animateSection(inst, index, true));
    return;
  }

  // Sections déjà vues : redessinées sans rejouer l'apparition (resize, polices, images).
  inst.seen.forEach((index) => animateSection(inst, index, true));

  inst.observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const index = inst.sections.findIndex((s) => s.el === entry.target);
        if (index < 0) continue;
        if (entry.isIntersecting) {
          inst.visible.add(index);
          if (!inst.seen.has(index)) {
            inst.seen.add(index);
            animateSection(inst, index, false);
          }
        } else {
          inst.visible.delete(index);
        }
        inst.views.filter((v) => v.cable.section === index).forEach((v) => {
          if (inst.visible.has(index)) v.pulseTl?.play();
          else v.pulseTl?.pause();
        });
      }
    },
    { threshold: 0.15 },
  );
  inst.sections.forEach((s) => inst.observer!.observe(s.el));
}

export const AmbientNetwork = {
  init(stage: HTMLElement, layer: HTMLElement) {
    if (instance) AmbientNetwork.destroy();
    const svg = svgEl("svg", { class: "fiber-svg fiber-svg--ambient", "aria-hidden": "true", focusable: "false" });
    layer.prepend(svg);
    const inst: Instance = {
      stage,
      svg,
      views: [],
      sections: [],
      seen: new Set(),
      visible: new Set(),
      observer: null,
      timelines: [],
      cleanups: [],
      reduced: prefersReducedMotion(),
    };
    instance = inst;
    build(inst);

    const rebuild = debounce(() => build(inst), 150);
    const resizeObserver = new ResizeObserver(() => rebuild());
    resizeObserver.observe(stage);
    window.addEventListener("resize", rebuild);
    document.fonts?.ready.then(() => instance === inst && rebuild());
    inst.cleanups.push(() => {
      rebuild.cancel();
      resizeObserver.disconnect();
      window.removeEventListener("resize", rebuild);
    });
  },

  destroy() {
    if (!instance) return;
    instance.cleanups.forEach((fn) => fn());
    instance.observer?.disconnect();
    instance.timelines.forEach((tl) => tl.kill());
    instance.svg.remove();
    instance = null;
  },
};
