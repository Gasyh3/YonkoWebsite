// Contact (C10) : la conclusion du récit.
// - Titre « Connectons votre entreprise. » révélé par lignes (masque, yPercent 100 → 0, 0.7s, expo.out).
// - Les 3 fibres finissent sur le bouton « Démarrer un projet » (terminus). Quand les impulsions A, B et C sont
//   arrivées (fiber:arrive), le bouton s'allume : contour or dessiné (stroke-dashoffset), fond qui passe de
//   transparent au dégradé or clair, texte en noir mat (fondu entre deux libellés), et un unique flash doux
//   (opacité d'un halo statique, 0.7s, sine.inOut).
// - Le bouton est un lien ordinaire : cliquable et lisible dès le premier rendu, l'allumage n'est qu'un habillage.
// - Reduced motion : titre affiché ; le bouton s'allume sans transition ni flash quand les fibres y arrivent.

import type { FiberArriveDetail, FiberId } from "./fiber/fiber-system";
import { prefersReducedMotion } from "./env";
import { gsap, SplitText } from "./gsap";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

const TERMINUS = ["contact-in", "contact-in-mobile"];
const HALO_PEAK = 0.35; // opacité maximale du flash (halo or, doux)

export function createContactScene(root: HTMLElement): MotionModule {
  let ctx: gsap.Context | null = null;
  let split: SplitText | null = null;
  let onArrive: ((event: CustomEvent<FiberArriveDetail>) => void) | null = null;
  let destroyed = false;

  return {
    init() {
      const reduced = prefersReducedMotion();
      const t = tokens();
      const title = root.querySelector<HTMLElement>("[data-contact-title]");
      const outline = root.querySelector<SVGRectElement>("[data-contact-outline]");
      const fill = root.querySelector<HTMLElement>("[data-contact-fill]");
      const litLabel = root.querySelector<HTMLElement>("[data-contact-lit-label]");
      const halo = root.querySelector<HTMLElement>("[data-contact-halo]");

      ctx = gsap.context(() => {}, root);

      // Titre par lignes, après chargement des polices (coupures exactes).
      if (title && !reduced) {
        gsap.set(title, { visibility: "hidden" });
        document.fonts.ready.then(() => {
          if (destroyed) return;
          ctx?.add(() => {
            split = SplitText.create(title, { type: "lines", mask: "lines" });
            gsap.set(title, { visibility: "visible" });
            gsap.from(split.lines, {
              yPercent: 100,
              duration: t.dur.reveal,
              ease: t.ease.in,
              stagger: t.stagger * 2,
              scrollTrigger: { trigger: title, start: "top 85%", once: true },
            });
          });
        });
      }

      // Allumage : une seule fois, quand les 3 impulsions sont arrivées (fiber:arrive peut revenir).
      const arrived = new Set<FiberId>();
      let lit = false;
      const light = () => {
        lit = true;
        ctx?.add(() => {
          const d = reduced ? 0 : 1;
          const tl = gsap.timeline();
          if (outline) tl.to(outline, { strokeDashoffset: 0, duration: t.dur.major * d, ease: t.ease.in }, 0);
          if (fill) tl.to(fill, { opacity: 1, duration: t.dur.reveal * d, ease: t.ease.transition }, t.dur.micro * d);
          if (litLabel) tl.to(litLabel, { opacity: 1, duration: t.dur.reveal * d, ease: t.ease.transition }, t.dur.micro * d);
          if (halo && !reduced) {
            // Un unique flash doux : 0 → pic → 0 sur 0.7s.
            tl.fromTo(halo, { opacity: 0 }, { opacity: HALO_PEAK, duration: t.dur.reveal / 2, ease: t.ease.breath }, t.dur.micro)
              .to(halo, { opacity: 0, duration: t.dur.reveal / 2, ease: t.ease.breath });
          }
        });
      };
      onArrive = (event: CustomEvent<FiberArriveDetail>) => {
        if (lit || !TERMINUS.includes(event.detail.anchorId)) return;
        arrived.add(event.detail.fiber);
        if (arrived.size === 3) light();
      };
      window.addEventListener("fiber:arrive", onArrive);
    },

    destroy() {
      destroyed = true;
      if (onArrive) window.removeEventListener("fiber:arrive", onArrive);
      onArrive = null;
      split?.revert();
      split = null;
      ctx?.revert();
      ctx = null;
    },
  };
}
