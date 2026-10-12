// Micro-interactions globales (C11), en délégation d'événements : valables sur toutes les pages, y compris
// après une navigation, sans câbler chaque composant.
// - Liens texte (.link-dotted) : soulignement pointillé argent dessiné de gauche à droite au survol ou au focus
//   clavier (0.3s, expo.out), effacé vers la droite à la sortie.
// - Boutons principaux ([data-magnetic]) : effet magnétique léger (6px max vers le curseur, retour en 0.7s
//   expo.out) et reflet or qui traverse le bouton une fois au survol (.btn-glint). Pointeur fin uniquement.
// Aucune micro-interaction ne dépasse 0.7s. Reduced motion : soulignement affiché sans mouvement, ni aimant
// ni reflet.

import { prefersReducedMotion } from "./env";
import { gsap } from "./gsap";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const MAGNET = 6; // px : déplacement maximal vers le curseur
const GLINT_TRAVEL = 250; // xPercent : le reflet (40 % du bouton) le traverse de part en part

export function createMicroInteractions(): MotionModule {
  const cleanups: (() => void)[] = [];

  return {
    init() {
      const reduced = prefersReducedMotion();
      const t = tokens();
      const on = <K extends keyof DocumentEventMap>(type: K, fn: (e: DocumentEventMap[K]) => void) => {
        document.addEventListener(type, fn);
        cleanups.push(() => document.removeEventListener(type, fn));
      };

      // --- Liens texte -------------------------------------------------------------------------
      const lineOf = (target: EventTarget | null) => {
        const link = target instanceof Element ? target.closest<HTMLElement>(".link-dotted") : null;
        return link ? { link, line: link.querySelector<HTMLElement>(".link-dotted__line") } : null;
      };
      const draw = (line: HTMLElement) =>
        gsap.fromTo(
          line,
          { x: 0, xPercent: -101 }, // x: 0 neutralise la translation CSS de départ (lue en px par GSAP)
          { xPercent: 0, duration: reduced ? 0 : t.dur.micro, ease: t.ease.in, overwrite: true },
        );
      const erase = (line: HTMLElement) =>
        gsap.to(line, { x: 0, xPercent: 101, duration: reduced ? 0 : t.dur.micro, ease: t.ease.in, overwrite: true });

      const enterLink = (e: Event & { relatedTarget?: EventTarget | null }) => {
        const hit = lineOf(e.target);
        if (!hit?.line || (e.relatedTarget instanceof Node && hit.link.contains(e.relatedTarget))) return;
        draw(hit.line);
      };
      const leaveLink = (e: Event & { relatedTarget?: EventTarget | null }) => {
        const hit = lineOf(e.target);
        if (!hit?.line || (e.relatedTarget instanceof Node && hit.link.contains(e.relatedTarget))) return;
        if (hit.link.matches(":focus-visible") && e.type === "pointerout") return; // le focus garde le trait
        erase(hit.line);
      };
      on("pointerover", enterLink);
      on("pointerout", leaveLink);
      on("focusin", enterLink);
      on("focusout", leaveLink);

      // --- Boutons principaux ------------------------------------------------------------------
      if (reduced || !window.matchMedia(HOVER_QUERY).matches) return;
      let current: HTMLElement | null = null;
      const movers = new WeakMap<HTMLElement, { x: gsap.QuickToFunc; y: gsap.QuickToFunc }>();
      const moverOf = (el: HTMLElement) => {
        let mover = movers.get(el);
        if (!mover) {
          mover = {
            x: gsap.quickTo(el, "x", { duration: t.dur.micro, ease: t.ease.in }),
            y: gsap.quickTo(el, "y", { duration: t.dur.micro, ease: t.ease.in }),
          };
          movers.set(el, mover);
        }
        return mover;
      };
      const release = (el: HTMLElement) => {
        movers.delete(el);
        gsap.to(el, { x: 0, y: 0, duration: t.dur.reveal, ease: t.ease.in, overwrite: true });
      };
      const glint = (el: HTMLElement) => {
        const band = el.querySelector<HTMLElement>(".btn-glint__band");
        if (band) gsap.fromTo(band, { x: 0, xPercent: -100 }, { xPercent: GLINT_TRAVEL, duration: t.dur.reveal, ease: t.ease.breath, overwrite: true });
      };

      on("pointermove", (e) => {
        const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-magnetic]") : null;
        if (el !== current) {
          if (current) release(current);
          current = el;
          if (el) glint(el);
        }
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        const clamp = (v: number) => Math.max(-1, Math.min(1, v));
        const mover = moverOf(el);
        mover.x(clamp(dx) * MAGNET);
        mover.y(clamp(dy) * MAGNET);
      });
      const leaveWindow = () => {
        if (current) release(current);
        current = null;
      };
      on("pointerleave", leaveWindow);
      cleanups.push(() => {
        if (current) gsap.set(current, { x: 0, y: 0 });
        current = null;
      });
    },

    destroy() {
      cleanups.splice(0).forEach((fn) => fn());
    },
  };
}
