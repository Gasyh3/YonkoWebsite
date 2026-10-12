// Expertises (C5) : conteneur épinglé sur 300vh, 3 scènes de 100vh (SEO → fibre A, Maps → B, Logiciel → C).
//
// Desktop (≥ 768px, mouvement autorisé) :
// - Le cadre [data-expertises-frame] (opaque, au-dessus du calque des fibres) est épinglé pendant 300vh de scroll.
//   Les fibres globales s'arrêtent à son bord haut (ancre expertises-in) et reprennent sous lui (expertises-out) :
//   le tronçon qui relie les deux reste toujours caché derrière le cadre.
// - Dans le cadre, un SVG local prolonge les 3 fibres : elles descendent en couloirs parallèles entre le texte et
//   la visualisation, se séparent (C en haut, B au milieu, A en bas), entrent chacune dans la visualisation par la
//   gauche, en ressortent à droite et rejoignent la sortie. Seule la fibre de la scène en cours est allumée.
// - Une seule scène visible à la fois ; changement de scène en power3.inOut 1.2s (temporel, pas scrubé).
//   La progression de la scène en cours, elle, suit le scroll (scrub 0.6).
// Mobile / reduced motion : pas de pin, les scènes s'empilent et gèrent leur propre version (lecture courte à
// l'entrée en mobile, état final statique en reduced motion).

import type { FiberId } from "../fiber/fiber-router";
import { OFFSET, roundedPath, type Vec } from "../fiber/fiber-router";
import { measureAtRest } from "../fiber/measure";
import { debounce } from "../env";
import { gsap, ScrollTrigger } from "../gsap";
import { tokens } from "../tokens";
import type { MotionModule } from "../use-motion-module";
import type { DrivenScene, DrivenSceneFactory } from "./driven-scene";
import { SCENE_ENTRY, SCENES, type SceneId } from "./geometry";
import { createMapsScene } from "./maps-scene";
import { createSeoScene } from "./seo-scene";
import { createSoftwareScene } from "./software-scene";

const SVG_NS = "http://www.w3.org/2000/svg";
const PINNED_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const STACKED_QUERY = "(max-width: 767px), (prefers-reduced-motion: reduce)";

const CONFIG = {
  pinLength: 3, // en hauteurs de viewport : 100vh par scène
  sceneSpan: 0.82, // une scène joue sur 82 % de son créneau, puis tient son état final
  scrub: 0.6,
  pulse: [64, 14], // impulsion locale : traînée puis tête
  slideShift: 24, // px : glissement vertical d'une scène qui entre ou sort
} as const;

const FACTORIES: Record<SceneId, DrivenSceneFactory> = {
  seo: createSeoScene,
  maps: createMapsScene,
  software: createSoftwareScene,
};

type Slide = { id: SceneId; fiber: FiberId; el: HTMLElement; scene: DrivenScene | null };

type LocalFiber = {
  fiber: FiberId;
  group: SVGGElement;
  off: SVGPathElement[];
  lit: SVGPathElement[];
  pulse: SVGPathElement[];
  entryLength: number;
};

const svgEl = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}) => {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function createExpertises(root: HTMLElement): MotionModule {
  let mm: gsap.MatchMedia | null = null;

  return {
    init() {
      const frame = root.querySelector<HTMLElement>("[data-expertises-frame]");
      const svg = root.querySelector<SVGSVGElement>("[data-expertises-fibers]");
      if (!frame || !svg) return;
      const slides: Slide[] = SCENES.map(({ id, fiber }) => ({
        id,
        fiber,
        el: root.querySelector<HTMLElement>(`[data-expertise-scene="${id}"]`)!,
        scene: null,
      })).filter((s) => s.el);
      const steps = [...root.querySelectorAll<HTMLElement>("[data-expertises-step]")];

      mm = gsap.matchMedia();

      // Empilé : chaque scène gère sa propre version (mobile ou reduced motion).
      mm.add(STACKED_QUERY, () => {
        const scenes = slides.map((s) => FACTORIES[s.id](s.el));
        scenes.forEach((scene) => scene?.init());
        return () => scenes.forEach((scene) => scene?.destroy());
      });

      // Épinglé.
      mm.add(PINNED_QUERY, () => {
        const t = tokens();
        const header = document.querySelector<HTMLElement>("header");
        const headerHeight = () => (header && getComputedStyle(header).position === "sticky" ? header.offsetHeight : 0);
        const setTop = () => frame.style.setProperty("--expertises-top", `${headerHeight()}px`);
        setTop();

        // Le cadre couvre les fibres globales : rien de ce qu'il contient n'est un obstacle pour elles.
        frame.setAttribute("data-fiber-ignore", "");
        root.classList.add("is-pinned");

        slides.forEach((s) => {
          s.scene = FACTORIES[s.id](s.el, { driven: true });
          s.scene?.init();
        });

        // --- Fibres locales -------------------------------------------------------------------
        const uid = `xp-${Math.random().toString(36).slice(2, 8)}`;
        const defs = svgEl("defs");
        const gradient = svgEl("linearGradient", { id: `${uid}-gold`, x1: 0, y1: 0, x2: 1, y2: 0 });
        [
          ["0", "--gold-1"],
          ["0.52", "--gold-2"],
          ["1", "--gold-3"],
        ].forEach(([offset, color]) => gradient.append(svgEl("stop", { offset, style: `stop-color: var(${color})` })));
        defs.append(gradient);
        svg.append(defs);

        const locals: LocalFiber[] = slides.map(({ fiber }) => {
          const group = svgEl("g", { class: `expertises-fiber expertises-fiber--${fiber}` });
          const make = (cls: string, extra: Record<string, string> = {}) => svgEl("path", { class: cls, ...extra });
          const litStroke: Record<string, string> = fiber === "C" ? {} : { stroke: `url(#${uid}-gold)` };
          const off = [make("fiber-off"), make("fiber-off")];
          const lit = [make("expertises-fiber__lit", litStroke), make("expertises-fiber__lit", litStroke)];
          const pulse = CONFIG.pulse.map((_, i) => make(`expertises-fiber__pulse expertises-fiber__pulse--${i}`));
          group.append(...off, ...lit, ...pulse);
          svg.append(group);
          return { fiber, group, off, lit, pulse, entryLength: 0 };
        });

        // Tracés recalculés depuis le DOM : couloirs sous l'ancre d'entrée, sortie sous l'ancre de sortie,
        // hauteurs d'entrée dans la visualisation (SCENE_ENTRY). Coordonnées locales au cadre (invariantes au pin).
        const layout = () => {
          const viz = slides[0]?.el.querySelector<HTMLElement>("[data-expertise-viz]");
          const inAnchor = root.querySelector<HTMLElement>("[data-fiber-anchor='expertises-in']");
          const outAnchor = root.querySelector<HTMLElement>("[data-fiber-anchor='expertises-out']");
          if (!viz || !inAnchor || !outAnchor) return;
          const m = measureAtRest(frame, () => ({
            frame: frame.getBoundingClientRect(),
            viz: viz.getBoundingClientRect(),
            in: inAnchor.getBoundingClientRect(),
            out: outAnchor.getBoundingClientRect(),
          }));
          const w = m.frame.width;
          const h = m.frame.height;
          svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
          gradient.setAttribute("gradientUnits", "userSpaceOnUse");
          gradient.setAttribute("x2", String(w));
          const left = m.viz.left - m.frame.left;
          const right = m.viz.right - m.frame.left;
          const inX = (m.in.left + m.in.right) / 2 - m.frame.left;
          const outX = (m.out.left + m.out.right) / 2 - m.frame.left;
          locals.forEach((local) => {
            const o = OFFSET[local.fiber];
            const y = m.viz.top - m.frame.top + m.viz.height * SCENE_ENTRY[local.fiber];
            const entry: Vec[] = [{ x: inX + o, y: 0 }, { x: inX + o, y }, { x: left, y }];
            const exit: Vec[] = [{ x: right, y }, { x: outX + o, y }, { x: outX + o, y: h }];
            const d = [roundedPath(entry), roundedPath(exit)];
            [local.off, local.lit].forEach((paths) => paths.forEach((p, i) => p.setAttribute("d", d[i])));
            local.pulse.forEach((p) => p.setAttribute("d", d[0]));
            local.entryLength = local.pulse[0].getTotalLength();
            local.pulse.forEach((p, i) => {
              const seg = CONFIG.pulse[i];
              p.style.strokeDasharray = `${seg} ${local.entryLength + seg}`;
              p.style.strokeDashoffset = String(seg); // hors tracé tant qu'aucune impulsion ne part
            });
          });
        };

        // --- Scènes ------------------------------------------------------------------------------
        let active = -1;
        const pulseTweens: gsap.core.Animation[] = [];

        const light = (index: number, immediate: boolean) => {
          locals.forEach((local, i) => {
            const on = i === index;
            gsap.to(local.lit, {
              opacity: on ? 1 : 0,
              duration: immediate ? 0 : t.dur.major,
              ease: t.ease.transition,
              overwrite: true,
            });
            if (!on || immediate) return;
            // L'impulsion descend le couloir et entre dans la scène qui s'ouvre.
            local.pulse.forEach((p, k) => {
              const seg = CONFIG.pulse[k];
              const tween = gsap.fromTo(
                p,
                { strokeDashoffset: seg, opacity: 1 },
                { strokeDashoffset: seg - local.entryLength, duration: t.dur.major, ease: t.ease.transition, overwrite: true },
              );
              pulseTweens.push(tween, gsap.to(p, { opacity: 0, duration: t.dur.micro, delay: t.dur.major, ease: t.ease.breath }));
            });
          });
        };

        const show = (index: number, immediate = false) => {
          if (index === active) return;
          const previous = active;
          const direction = index > previous ? 1 : -1;
          active = index;
          slides.forEach((s, i) => {
            s.scene?.setVisible(i === index);
            if (i === index) {
              gsap.fromTo(
                s.el,
                { autoAlpha: immediate ? 1 : 0, y: immediate ? 0 : CONFIG.slideShift * direction },
                { autoAlpha: 1, y: 0, duration: immediate ? 0 : t.dur.major, ease: t.ease.transition, overwrite: true },
              );
            } else if (i === previous && !immediate) {
              gsap.to(s.el, {
                autoAlpha: 0,
                y: -CONFIG.slideShift * direction,
                duration: t.dur.major,
                ease: t.ease.transition,
                overwrite: true,
              });
            } else {
              gsap.set(s.el, { autoAlpha: 0, y: 0, overwrite: true });
            }
          });
          steps.forEach((step, i) => {
            gsap.to(step, { opacity: i === index ? 1 : 0.4, duration: immediate ? 0 : t.dur.reveal, ease: t.ease.transition });
          });
          light(index, immediate);
        };

        const state = { progress: 0 };
        const update = () => {
          const p = state.progress * slides.length;
          slides.forEach((s, i) => s.scene?.setProgress(clamp01((p - i) / CONFIG.sceneSpan)));
          show(Math.min(slides.length - 1, Math.floor(p)));
        };

        layout();
        show(0, true);
        steps.forEach((step, i) => gsap.set(step, { opacity: i === 0 ? 1 : 0.4 }));

        const tween = gsap.to(state, {
          progress: 1,
          ease: "none",
          onUpdate: update,
          scrollTrigger: {
            trigger: frame,
            start: () => `top ${headerHeight()}`,
            end: () => `+=${window.innerHeight * CONFIG.pinLength}`,
            pin: true,
            scrub: CONFIG.scrub,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        // Chargement au milieu de la section : la scène affichée correspond tout de suite à la position.
        const st = tween.scrollTrigger;
        if (st) {
          state.progress = st.progress;
          slides.forEach((s, i) => s.scene?.setProgress(clamp01((state.progress * slides.length - i) / CONFIG.sceneSpan)));
          active = -1;
          show(Math.min(slides.length - 1, Math.floor(state.progress * slides.length)), true);
        }

        const onRefresh = () => {
          setTop();
          layout();
        };
        ScrollTrigger.addEventListener("refresh", onRefresh);
        const onResize = debounce(onRefresh, 150);
        window.addEventListener("resize", onResize);
        let alive = true;
        document.fonts?.ready.then(() => alive && layout());

        return () => {
          alive = false;
          ScrollTrigger.removeEventListener("refresh", onRefresh);
          onResize.cancel();
          window.removeEventListener("resize", onResize);
          tween.scrollTrigger?.kill();
          tween.kill();
          pulseTweens.forEach((tw) => tw.kill());
          locals.forEach((local) => gsap.killTweensOf([...local.lit, ...local.pulse]));
          gsap.killTweensOf([...slides.map((s) => s.el), ...steps]);
          gsap.set([...slides.map((s) => s.el), ...steps], { clearProps: "all" });
          slides.forEach((s) => {
            s.scene?.destroy();
            s.scene = null;
          });
          svg.replaceChildren();
          svg.removeAttribute("viewBox");
          frame.removeAttribute("data-fiber-ignore");
          frame.style.removeProperty("--expertises-top");
          root.classList.remove("is-pinned");
        };
      });
    },

    destroy() {
      mm?.revert();
      mm = null;
    },
  };
}
