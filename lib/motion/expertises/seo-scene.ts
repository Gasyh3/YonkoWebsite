// Scène Expertises 01 — Site vitrine et SEO (C5), fibre A, or.
// Timeline en unités de progression (0 → 1), pilotable par le scroll :
//   0 – 30 %   la fibre A dessine en pointillés le contour d'une fenêtre de navigateur (coins 12px, 3 points)
//   30 – 55 %  barre de recherche puis 5 résultats en lignes argent (seul le résultat du client est lisible)
//   55 – 85 %  le résultat du client remonte de la 4e à la 1re place, les autres descendent d'un cran
//              (power3.inOut), puis il passe en dégradé or avec un reflet
//   85 – 100 % le label « Position 1 » apparaît
// Autonome : scrub sur le défilement de la section (desktop) ou lecture courte à l'entrée (mobile).
// Dans le conteneur Expertises épinglé : `driven: true`, puis setProgress(p).
// Reduced motion : état final statique (client en 1re position, en or, label affiché).

import { isMobile, prefersReducedMotion } from "../env";
import { gsap, ScrollTrigger } from "../gsap";
import { tokens } from "../tokens";
import type { DrivenScene } from "./driven-scene";

const MOBILE_PLAY_DURATION = 2.6; // s : version raccourcie déclenchée à l'entrée dans le viewport
const GLINT_BAND = 0.45; // largeur du reflet, en fraction du texte (voir .gold-word__glint)

export function createSeoScene(root: HTMLElement, options: { driven?: boolean } = {}): DrivenScene {
  let ctx: gsap.Context | null = null;
  let tl: gsap.core.Timeline | null = null;

  return {
    init() {
      const svg = root.querySelector<SVGSVGElement>("[data-seo-svg]");
      if (!svg) return;
      const outline = [...svg.querySelectorAll<SVGPathElement>("[data-seo-outline-mask]")];
      const bar = svg.querySelector<SVGPathElement>("[data-seo-bar-mask]");
      const dots = [...svg.querySelectorAll<SVGCircleElement>("[data-seo-dot]")];
      const search = root.querySelector<HTMLElement>("[data-seo-search]");
      const rows = [...root.querySelectorAll<HTMLElement>("[data-seo-row]")];
      const client = root.querySelector<HTMLElement>("[data-seo-row='client']");
      const others = rows.filter((row) => row !== client);
      const above = others.filter((row) => Number(row.dataset.seoSlot) < Number(client?.dataset.seoSlot));
      const gold = root.querySelector<HTMLElement>("[data-seo-gold]");
      const band = root.querySelector<HTMLElement>("[data-seo-gold] .gold-word__glint");
      const bandText = band?.firstElementChild as HTMLElement | null;
      const label = root.querySelector<HTMLElement>("[data-seo-label]");
      const slots = Number(client?.dataset.seoSlot ?? 0);

      // Masques : un trait plein par tracé, révélé par stroke-dashoffset (les pointillés eux-mêmes ne bougent pas).
      const masks = bar ? [...outline, bar] : outline;
      const lengths = masks.map((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = "0";
        return length;
      });

      const t = tokens();
      ctx = gsap.context(() => {
        tl = gsap.timeline({ paused: true });

        // 0 – 30 % : les deux moitiés du contour partent de l'entrée de la fibre et se rejoignent à la sortie.
        outline.forEach((path, i) => {
          tl!.fromTo(path, { strokeDashoffset: lengths[i] }, { strokeDashoffset: 0, duration: 0.26, ease: "none" }, 0);
        });
        if (bar) {
          tl.fromTo(bar, { strokeDashoffset: lengths[lengths.length - 1] }, { strokeDashoffset: 0, duration: 0.08, ease: "none" }, 0.2);
        }
        tl.fromTo(dots, { opacity: 0 }, { opacity: 1, duration: 0.03, ease: t.ease.in, stagger: 0.012 }, 0.25);

        // 30 – 55 % : barre de recherche, puis les 5 résultats.
        if (search) tl.fromTo(search, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.06, ease: t.ease.in }, 0.3);
        tl.fromTo(rows, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.07, ease: t.ease.in, stagger: 0.035 }, 0.37);

        // 55 – 85 % : le client remonte en 1re position (chaque ligne mesure exactement un cran).
        if (client) {
          tl.to(client, { yPercent: -100 * slots, duration: 0.2, ease: t.ease.transition }, 0.57);
          tl.to(above, { yPercent: 100, duration: 0.2, ease: t.ease.transition }, 0.57);
        }
        if (gold) tl.fromTo(gold, { opacity: 0 }, { opacity: 1, duration: 0.06, ease: t.ease.transition }, 0.74);
        if (band && bandText) {
          // Le reflet traverse le nom ; son texte contre-glisse pour rester calé sur le mot.
          const end = 100 / GLINT_BAND;
          tl.set(band, { opacity: 1 }, 0.78);
          tl.fromTo(band, { xPercent: -100 }, { xPercent: end, duration: 0.07, ease: t.ease.breath }, 0.78);
          tl.fromTo(bandText, { xPercent: GLINT_BAND * 100 }, { xPercent: -100, duration: 0.07, ease: t.ease.breath }, 0.78);
          tl.set(band, { opacity: 0 }, 0.85);
        }

        // 85 – 100 % : « Position 1 ».
        if (label) tl.fromTo(label, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.06, ease: t.ease.in }, 0.87);
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
