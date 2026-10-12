// Scène Expertises 03 — Logiciel sur mesure (C7), fibre C, argent.
// Timeline en unités de progression (0 → 1), pilotable par le scroll :
//   0 – 35 %   la fibre C se ramifie : tronc central puis 4 branches orthogonales (schéma d'architecture)
//   35 – 65 %  un module se branche au bout de chaque branche (Planning, Clients, Facturation, Stock) ;
//              il s'allume (contour argent clair) quand l'impulsion de la fibre l'atteint
//   65 – 90 %  les modules glissent et s'emboîtent en grille 2×2 (transform, power3.inOut) ; les branches
//              se rétractent, seul le raccord bus → dashboard reste
//   90 – 100 % un reflet argent traverse le dashboard, label « Conçu pour votre entreprise » (seul or)
// Autonome : scrub sur le défilement de la section (desktop) ou lecture courte à l'entrée (mobile).
// Dans le conteneur Expertises épinglé : `driven: true`, puis setProgress(p).
// Reduced motion : état final statique (dashboard assemblé, label affiché).

import { isMobile, prefersReducedMotion } from "../env";
import { gsap, ScrollTrigger } from "../gsap";
import { tokens } from "../tokens";
import type { DrivenScene } from "./driven-scene";
import { SOFTWARE_MODULES } from "./software-data";

const MOBILE_PLAY_DURATION = 2.6; // s : version raccourcie déclenchée à l'entrée dans le viewport
const PULSE = 26; // longueur de l'impulsion (repère 560 × 400)
const GLINT_TRAVEL = 250; // xPercent : le reflet (40 % du dashboard) le traverse de part en part
const GLINT_OPACITY = 0.22; // reflet discret : argent clair voilé

export function createSoftwareScene(root: HTMLElement, options: { driven?: boolean } = {}): DrivenScene {
  let ctx: gsap.Context | null = null;
  let tl: gsap.core.Timeline | null = null;

  return {
    init() {
      const svg = root.querySelector<SVGSVGElement>("[data-software-svg]");
      if (!svg) return;
      const bus = svg.querySelector<SVGPathElement>("[data-software-bus-mask]");
      const connector = svg.querySelector<SVGPathElement>("[data-software-connector-mask]");
      const branches = [...svg.querySelectorAll<SVGPathElement>("[data-software-branch-mask]")];
      const pulses = [...svg.querySelectorAll<SVGPathElement>("[data-software-pulse]")];
      const cards = [...root.querySelectorAll<HTMLElement>("[data-software-card]")];
      const lit = cards.map((card) => card.querySelector<HTMLElement>("[data-software-lit]"));
      const panel = root.querySelector<HTMLElement>("[data-software-panel]");
      const glint = root.querySelector<HTMLElement>("[data-software-glint]");
      const label = root.querySelector<HTMLElement>("[data-software-label]");

      // Masques : un trait plein par tracé, révélé par stroke-dashoffset (les pointillés eux-mêmes ne bougent pas).
      const prepare = (path: SVGPathElement | null) => {
        if (!path) return 0;
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = "0";
        return length;
      };
      const busLength = prepare(bus);
      const connectorLength = prepare(connector);
      const branchLengths = branches.map(prepare);
      const pulseLengths = pulses.map((p) => {
        const length = p.getTotalLength();
        p.style.strokeDasharray = `${PULSE} ${length + PULSE}`;
        return length;
      });

      const t = tokens();
      ctx = gsap.context(() => {
        tl = gsap.timeline({ paused: true });

        // 0 – 35 % : la fibre traverse le cadre, puis le tronc et les 4 branches se déploient ensemble.
        if (bus) tl.fromTo(bus, { strokeDashoffset: busLength }, { strokeDashoffset: 0, duration: 0.12, ease: "none" }, 0);
        if (connector) {
          tl.fromTo(connector, { strokeDashoffset: connectorLength }, { strokeDashoffset: 0, duration: 0.05, ease: "none" }, 0.1);
        }
        branches.forEach((path, i) => {
          tl!.fromTo(path, { strokeDashoffset: branchLengths[i] }, { strokeDashoffset: 0, duration: 0.2, ease: "none" }, 0.13);
        });

        // 35 – 65 % : les modules se branchent, puis chacun s'allume au passage de l'impulsion.
        tl.fromTo(cards, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.06, ease: t.ease.in, stagger: 0.02 }, 0.35);
        pulses.forEach((pulse, i) => {
          const at = 0.42 + i * 0.05;
          tl!.fromTo(
            pulse,
            { strokeDashoffset: PULSE, opacity: 1 },
            { strokeDashoffset: PULSE - pulseLengths[i], duration: 0.05, ease: "none" },
            at,
          );
          tl!.to(pulse, { opacity: 0, duration: 0.01 }, at + 0.05);
          if (lit[i]) tl!.fromTo(lit[i], { opacity: 0 }, { opacity: 1, duration: 0.03, ease: t.ease.in }, at + 0.045);
        });

        // 65 – 90 % : emboîtement en dashboard ; les branches se rétractent vers le bus.
        cards.forEach((card, i) => {
          tl!.to(card, { ...SOFTWARE_MODULES[i].toGrid, duration: 0.2, ease: t.ease.transition }, 0.66);
        });
        branches.forEach((path, i) => {
          tl!.to(path, { strokeDashoffset: branchLengths[i], duration: 0.16, ease: t.ease.transition }, 0.66);
        });
        if (panel) tl.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: t.ease.transition }, 0.8);

        // 90 – 100 % : reflet argent, une fois ; label.
        if (glint) {
          tl.set(glint, { opacity: GLINT_OPACITY }, 0.9);
          tl.fromTo(glint, { xPercent: -100 }, { xPercent: GLINT_TRAVEL, duration: 0.08, ease: t.ease.breath }, 0.9);
          tl.set(glint, { opacity: 0 }, 0.98);
        }
        if (label) tl.fromTo(label, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.06, ease: t.ease.in }, 0.92);
        tl.to({}, { duration: 0.0001 }, 1); // borne la timeline à 1

        if (prefersReducedMotion()) {
          tl.progress(1); // état final, posé sans mouvement
          return;
        }
        if (options.driven) return;

        if (isMobile()) {
          // Mobile : pas de scrub, une lecture courte à l'entrée dans le viewport.
          ScrollTrigger.create({
            trigger: root,
            start: "top 75%",
            once: true,
            onEnter: () => {
              gsap.to(tl, { progress: 1, duration: MOBILE_PLAY_DURATION, ease: "none" });
            },
          });
        } else {
          gsap.to(tl, {
            progress: 1,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top 75%", end: "center 40%", scrub: 0.6 },
          });
        }
      }, root);
    },

    setProgress(progress: number) {
      tl?.progress(Math.min(1, Math.max(0, progress)));
    },

    setVisible() {
      // Aucune boucle dans cette scène.
    },

    destroy() {
      tl?.kill();
      tl = null;
      ctx?.revert();
      ctx = null;
    },
  };
}
