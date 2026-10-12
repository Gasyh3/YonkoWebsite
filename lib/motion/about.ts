// À propos (accueil) : « trois expertises, une seule équipe ».
// À l'entrée de la section, trois fibres pointillées convergent en Y (45° et verticale, la grammaire des
// fibres) ; la jonction s'allume en or avec un anneau qui s'étend une fois, puis un seul fil descend, parcouru
// par une impulsion. Une seule fois, ~1.7s, un seul point focal. Le texte reste lisible d'emblée (fondu court).
// Mobile : même animation, marque plus petite. Reduced motion : marque dessinée, jonction allumée.

import { prefersReducedMotion } from "./env";
import { gsap } from "./gsap";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

const PULSE = 26; // longueur de l'impulsion (repère du SVG)

export function createAboutScene(root: HTMLElement): MotionModule {
  let ctx: gsap.Context | null = null;

  return {
    init() {
      const branches = [...root.querySelectorAll<SVGPathElement>("[data-about-branch-mask]")];
      const stem = root.querySelector<SVGPathElement>("[data-about-stem-mask]");
      const pulse = root.querySelector<SVGPathElement>("[data-about-pulse]");
      const node = root.querySelector<SVGElement>("[data-about-node]");
      const ring = root.querySelector<SVGElement>("[data-about-ring]");
      const copy = root.querySelector<HTMLElement>("[data-about-copy]");
      const mark = root.querySelector<HTMLElement>("[data-about-mark]");
      if (!stem || !mark) return;

      const prepare = (path: SVGPathElement) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length} ${length}`;
        return length;
      };
      const branchLengths = branches.map(prepare);
      const stemLength = prepare(stem);
      if (prefersReducedMotion()) return; // état final : tout dessiné (dashoffset 0), jonction allumée (CSS)

      const t = tokens();
      ctx = gsap.context(() => {
        branches.forEach((path, i) => gsap.set(path, { strokeDashoffset: branchLengths[i] }));
        gsap.set(stem, { strokeDashoffset: stemLength });
        if (node) gsap.set(node, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
        if (ring) gsap.set(ring, { opacity: 0, transformOrigin: "50% 50%" });
        if (copy) gsap.set(copy, { opacity: 0, y: 16 });

        const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%", once: true } });
        if (copy) tl.to(copy, { opacity: 1, y: 0, duration: t.dur.reveal, ease: t.ease.in }, 0);
        // Les trois fibres convergent (A, B, C), légèrement décalées.
        branches.forEach((path, i) => {
          tl.to(path, { strokeDashoffset: 0, duration: t.dur.reveal, ease: t.ease.transition }, t.stagger * i);
        });
        const joined = t.dur.reveal + t.stagger * (branches.length - 1);
        if (node) tl.to(node, { opacity: 1, scale: 1, duration: t.dur.micro, ease: t.ease.in }, joined);
        if (ring) {
          tl.fromTo(ring, { scale: 1, opacity: 0.5 }, { scale: 2.4, opacity: 0, duration: t.dur.reveal, ease: t.ease.breath }, joined);
        }
        // Un seul fil descend, parcouru par l'impulsion.
        tl.to(stem, { strokeDashoffset: 0, duration: t.dur.reveal, ease: t.ease.transition }, joined + t.dur.micro * 0.5);
        if (pulse) {
          const length = pulse.getTotalLength();
          pulse.style.strokeDasharray = `${PULSE} ${length + PULSE}`;
          tl.fromTo(
            pulse,
            { strokeDashoffset: PULSE, opacity: 1 },
            { strokeDashoffset: PULSE - length, duration: t.dur.reveal, ease: t.ease.transition },
            joined + t.dur.micro * 0.5,
          ).to(pulse, { opacity: 0, duration: t.dur.micro, ease: t.ease.breath });
        }
      }, root);
    },

    destroy() {
      ctx?.revert();
      ctx = null;
    },
  };
}
