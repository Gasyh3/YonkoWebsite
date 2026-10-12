// Résultats et projets (C8) : ici les fibres s'effacent pour laisser parler le travail. Aujourd'hui seuls les
// chiffres (engagements) sont affichés ; la partie projets reste prête pour de vraies réalisations.
// - Fibres : la section porte [data-fiber-dim] ; le FiberSystem y passe les fibres à 50 % (marge droite).
// - Chiffres clés : à l'entrée, chaque nombre compte de 0 à sa valeur en argent (1.2s, expo.out), puis passe
//   en dégradé or (fondu entre la couche argent et la couche or).
// - Projets : chaque image se révèle dans son cadre en overflow hidden (translateY 12 % et scale 1.08 → 0 et 1,
//   1.2s, expo.out).
// - Survol (pointeur fin) ou focus clavier : contour pointillé or dessiné autour de la carte (stroke-dashoffset,
//   0.7s), image à scale 1.03. Rien d'autre : pas de parallax. La carte mène à la page projet (C11).
// Reduced motion : chiffres en or, images en place ; au survol, contour affiché sans tracé animé.

import { prefersReducedMotion } from "./env";
import { gsap } from "./gsap";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

export function createResultsScene(root: HTMLElement): MotionModule {
  let ctx: gsap.Context | null = null;
  const cleanups: (() => void)[] = [];

  return {
    init() {
      const reduced = prefersReducedMotion();
      const t = tokens();
      const stats = [...root.querySelectorAll<HTMLElement>("[data-results-stat]")];
      const cards = [...root.querySelectorAll<HTMLElement>("[data-results-card]")];

      ctx = gsap.context(() => {
        if (!reduced) {
          // Chiffres : compteur argent, puis or.
          stats.forEach((stat, i) => {
            const count = stat.querySelector<HTMLElement>("[data-results-count]");
            const gold = stat.querySelector<HTMLElement>("[data-results-gold]");
            if (!count || !gold) return;
            const { value = "0", prefix = "", suffix = "" } = count.dataset;
            const proxy = { value: 0 };
            const write = () => {
              count.textContent = `${prefix}${Math.round(proxy.value)}${suffix}`;
            };
            gsap.set(count, { opacity: 1 });
            gsap.set(gold, { opacity: 0 });
            write();
            gsap
              .timeline({
                delay: i * t.stagger * 2,
                scrollTrigger: { trigger: stat, start: "top 85%", once: true },
              })
              .to(proxy, { value: Number(value), duration: t.dur.major, ease: t.ease.in, onUpdate: write })
              .to(gold, { opacity: 1, duration: t.dur.reveal, ease: t.ease.transition })
              .to(count, { opacity: 0, duration: t.dur.reveal, ease: t.ease.transition }, "<");
          });

          // Images : révélation dans leur cadre.
          cards.forEach((card) => {
            const reveal = card.querySelector<HTMLElement>("[data-results-reveal]");
            if (!reveal) return;
            gsap.fromTo(
              reveal,
              { yPercent: 12, scale: 1.08 },
              {
                yPercent: 0,
                scale: 1,
                duration: t.dur.major,
                ease: t.ease.in,
                scrollTrigger: { trigger: card, start: "top 85%", once: true },
              },
            );
          });
        }
      }, root);

      // Survol (pointeur fin) et focus clavier : contour pointillé or + image à 1.03.
      const hover = window.matchMedia(HOVER_QUERY).matches;
      cards.forEach((card) => {
        const mask = card.querySelector<SVGRectElement>("[data-results-outline-mask]");
        const image = card.querySelector<HTMLElement>("[data-results-image]");
        const duration = reduced ? 0 : t.dur.reveal;
        const enter = () => {
          if (mask) gsap.to(mask, { strokeDashoffset: 0, duration, ease: t.ease.in, overwrite: true });
          if (image && !reduced) gsap.to(image, { scale: 1.03, duration, ease: t.ease.in, overwrite: true });
        };
        const leave = () => {
          if (mask) gsap.to(mask, { strokeDashoffset: 1, duration, ease: t.ease.transition, overwrite: true });
          if (image && !reduced) gsap.to(image, { scale: 1, duration, ease: t.ease.transition, overwrite: true });
        };
        const focusIn = (e: FocusEvent) => {
          if ((e.target as Element).matches(":focus-visible")) enter();
        };
        if (hover) {
          card.addEventListener("pointerenter", enter);
          card.addEventListener("pointerleave", leave);
        }
        card.addEventListener("focusin", focusIn);
        card.addEventListener("focusout", leave);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointerleave", leave);
          card.removeEventListener("focusin", focusIn);
          card.removeEventListener("focusout", leave);
          gsap.killTweensOf([mask, image].filter(Boolean));
          gsap.set([mask, image].filter(Boolean), { clearProps: "all" });
        });
      });
    },

    destroy() {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
      ctx?.revert();
      ctx = null;
      // Les compteurs retrouvent leur texte final (le rendu React n'est pas rejoué).
      root.querySelectorAll<HTMLElement>("[data-results-count]").forEach((count) => {
        const { value = "", prefix = "", suffix = "" } = count.dataset;
        count.textContent = `${prefix}${value}${suffix}`;
      });
    },
  };
}
