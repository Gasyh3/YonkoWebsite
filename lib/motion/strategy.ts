// Scène Stratégie (C4) : « le pilier qui pilote tout ».
// - Les 3 fibres traversent la section en rails parallèles et horizontaux (ancre data-fiber-axis="x").
// - Trois étapes (Audit, Plan, Pilotage) posées sur les rails. Quand l'impulsion passe sous une étape
//   (point de passage data-fiber-checkpoint), son nœud de 6px s'allume, puis le titre et le texte se révèlent
//   (translateY 16px → 0, opacity, 0.7s, expo.out).
// - Scène calme : pas de pin, aucune autre animation. La grille de points du fond est statique (CSS).
// - Lecture garantie en scroll rapide : quand le bas des étapes atteint 15 % du viewport, tout est révélé.
// - Reduced motion : nœuds allumés et textes affichés d'emblée.

import type { FiberArriveDetail } from "./fiber/fiber-system";
import { prefersReducedMotion } from "./env";
import { gsap, ScrollTrigger } from "./gsap";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

type Step = { id: string; node: HTMLElement; copy: HTMLElement; done: boolean };

export function createStrategyScene(root: HTMLElement): MotionModule {
  let ctx: gsap.Context | null = null;
  let onArrive: ((event: CustomEvent<FiberArriveDetail>) => void) | null = null;

  return {
    init() {
      const steps: Step[] = [...root.querySelectorAll<HTMLElement>("[data-strategy-step]")].map((el) => ({
        id: el.dataset.strategyStep ?? "",
        node: el.querySelector<HTMLElement>(".strategy-node__lit")!,
        copy: el.querySelector<HTMLElement>("[data-strategy-copy]")!,
        done: false,
      }));

      if (prefersReducedMotion()) {
        root.classList.add("is-lit");
        return;
      }

      const t = tokens();
      ctx = gsap.context(() => {
        gsap.set(steps.map((s) => s.node), { opacity: 0, scale: 0.4 });
        gsap.set(steps.map((s) => s.copy), { opacity: 0, y: 16 });

        // Le nœud s'allume, puis l'étape se révèle. fiber:arrive peut revenir (respiration) : idempotent.
        const reveal = (step: Step, delay = 0) => {
          if (step.done) return;
          step.done = true;
          // Pendant la création du contexte, les tweens y sont enregistrés directement ; ensuite via add().
          const run = (fn: () => void) => (ctx ? ctx.add(fn) : fn());
          run(() => {
            gsap
              .timeline({ delay })
              .to(step.node, { opacity: 1, scale: 1, duration: t.dur.micro, ease: t.ease.in })
              .to(step.copy, { opacity: 1, y: 0, duration: t.dur.reveal, ease: t.ease.in }, t.dur.micro * 0.5);
          });
        };

        onArrive = (event: CustomEvent<FiberArriveDetail>) => {
          const step = steps.find((s) => s.id === event.detail.anchorId);
          if (step) reveal(step);
        };
        window.addEventListener("fiber:arrive", onArrive);

        // Filet de lecture : bas des étapes à 15 % du haut du viewport (l'impulsion est passée ou en retard).
        const revealAll = () => steps.filter((s) => !s.done).forEach((s, i) => reveal(s, i * t.stagger));
        const list = root.querySelector<HTMLElement>(".strategy-steps") ?? root;
        const st = ScrollTrigger.create({ trigger: list, start: "bottom 15%", onEnter: revealAll });
        if (st.scroll() > st.start) revealAll();
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
