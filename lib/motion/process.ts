// Process (C9) : les 3 fibres fusionnent en une ligne verticale centrée qui devient la timeline.
// - Chaque étape est une jonction : quand l'impulsion atteint son nœud (point de passage, fiber:arrive), le nœud
//   de 10px s'allume en or et un anneau s'étend une fois (scale 1 → 2, opacity 0.5 → 0, 0.7s).
// - Le contenu glisse depuis la ligne (translateX ±24px → 0, opacity, 0.7s, expo.out) : depuis la droite pour les
//   étapes de gauche, depuis la gauche pour celles de droite (et pour toutes en mobile, où la ligne est à gauche).
// - Lecture garantie en scroll rapide : une étape passée au tiers haut du viewport est révélée.
// - Reduced motion : nœuds allumés et contenus affichés d'emblée, sans anneau.

import type { FiberArriveDetail } from "./fiber/fiber-system";
import { isMobile, prefersReducedMotion } from "./env";
import { gsap, ScrollTrigger } from "./gsap";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

const SHIFT = 24; // px : glissement depuis la ligne

type Step = { id: string; el: HTMLElement; lit: HTMLElement; ring: HTMLElement; copy: HTMLElement; done: boolean };

export function createProcessScene(root: HTMLElement): MotionModule {
  let ctx: gsap.Context | null = null;
  let onArrive: ((event: CustomEvent<FiberArriveDetail>) => void) | null = null;

  return {
    init() {
      const steps: Step[] = [...root.querySelectorAll<HTMLElement>("[data-process-step]")].map((el) => ({
        id: el.dataset.processStep ?? "",
        el,
        lit: el.querySelector<HTMLElement>("[data-process-lit]")!,
        ring: el.querySelector<HTMLElement>("[data-process-ring]")!,
        copy: el.querySelector<HTMLElement>("[data-process-copy]")!,
        done: false,
      }));

      if (prefersReducedMotion()) {
        root.classList.add("is-lit");
        return;
      }

      const t = tokens();
      const mobile = isMobile();
      // Côté de la ligne : le contenu d'une étape de gauche arrive depuis la droite (+24px), et inversement.
      const from = (step: Step) => (!mobile && step.el.classList.contains("process-step--left") ? SHIFT : -SHIFT);

      ctx = gsap.context(() => {
        steps.forEach((step) => {
          gsap.set(step.lit, { opacity: 0 });
          gsap.set(step.ring, { opacity: 0, scale: 1 });
          gsap.set(step.copy, { opacity: 0, x: from(step) });
        });

        // fiber:arrive peut revenir (respiration) : idempotent.
        const reveal = (step: Step, delay = 0) => {
          if (step.done) return;
          step.done = true;
          // Pendant la création du contexte, les tweens y sont enregistrés directement ; ensuite via add().
          const run = (fn: () => void) => (ctx ? ctx.add(fn) : fn());
          run(() => {
            gsap
              .timeline({ delay })
              .to(step.lit, { opacity: 1, duration: t.dur.micro, ease: t.ease.in }, 0)
              .fromTo(step.ring, { scale: 1, opacity: 0.5 }, { scale: 2, opacity: 0, duration: t.dur.reveal, ease: t.ease.breath }, 0)
              .to(step.copy, { opacity: 1, x: 0, duration: t.dur.reveal, ease: t.ease.in }, t.dur.micro * 0.5);
          });
        };

        onArrive = (event: CustomEvent<FiberArriveDetail>) => {
          const step = steps.find((s) => s.id === event.detail.anchorId);
          if (step) reveal(step);
        };
        window.addEventListener("fiber:arrive", onArrive);

        // Filet de lecture : une étape dont le haut passe au tiers haut du viewport est révélée.
        steps.forEach((step) => {
          const st = ScrollTrigger.create({ trigger: step.el, start: "top 30%", onEnter: () => reveal(step) });
          if (st.scroll() > st.start) reveal(step);
        });
      }, root);
    },

    destroy() {
      if (onArrive) window.removeEventListener("fiber:arrive", onArrive);
      onArrive = null;
      ctx?.revert();
      ctx = null;
      root.classList.remove("is-lit");
    },
  };
}
