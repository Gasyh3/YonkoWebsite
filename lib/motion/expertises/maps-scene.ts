// Scène Expertises 02 — Google Maps et visibilité locale (C6), fibre B, or.
// Timeline en unités de progression (0 → 1), pilotable par le scroll :
//   0 – 40 %   la fibre B se démultiplie en quadrillage de rues, dessiné en pointillés argent
//   40 – 60 %  6 à 8 épingles argent tombent
//   60 – 85 %  l'épingle or tombe (back.out(1.4)), ondes radar en boucle ; épingles argent à 40 %
//   85 – 100 % la fiche « Votre entreprise » s'ouvre
// Autonome : scrub sur le défilement de la section (desktop) ou lecture courte à l'entrée (mobile).
// Dans le conteneur Expertises épinglé (C5) : `driven: true`, puis setProgress(p).

import { isMobile, prefersReducedMotion } from "../env";
import { gsap, ScrollTrigger } from "../gsap";
import { tokens } from "../tokens";
import type { MotionModule } from "../use-motion-module";

export type MapsScene = MotionModule & { setProgress: (progress: number) => void };

const RADAR_FROM = 0.72; // les ondes ne tournent qu'une fois l'épingle or posée
const MOBILE_PLAY_DURATION = 2.6; // s : version raccourcie déclenchée à l'entrée dans le viewport

export function createMapsScene(root: HTMLElement, options: { driven?: boolean } = {}): MapsScene {
  let ctx: gsap.Context | null = null;
  let tl: gsap.core.Timeline | null = null;
  let radar: gsap.core.Timeline | null = null;
  let observer: IntersectionObserver | null = null;
  let visible = false;

  // Les ondes tournent seulement quand la scène est visible et l'épingle or posée (2 ondes max).
  const syncRadar = () => {
    if (!radar || !tl) return;
    const on = visible && tl.progress() >= RADAR_FROM;
    if (on && !radar.isActive()) radar.play();
    if (!on && radar.isActive()) radar.pause(0);
  };

  return {
    init() {
      const svg = root.querySelector<SVGSVGElement>("[data-maps-svg]");
      if (!svg) return;
      const masks = [...svg.querySelectorAll<SVGPathElement>("[data-maps-street-mask]")];
      const silverPins = [...svg.querySelectorAll<SVGGElement>("[data-maps-pin='silver'] [data-maps-drop]")];
      const goldPin = svg.querySelector<SVGGElement>("[data-maps-pin='gold'] [data-maps-drop]");
      const rings = [...svg.querySelectorAll<SVGCircleElement>("[data-maps-radar]")];
      const card = root.querySelector<HTMLElement>("[data-maps-card]");

      // Masques : un trait plein par rue, révélé par stroke-dashoffset (les pointillés eux-mêmes ne bougent pas).
      const lengths = masks.map((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = "0";
        return length;
      });

      // Reduced motion : état final statique, sans ondes (épingles argent déjà en retrait).
      if (prefersReducedMotion()) {
        gsap.set(silverPins, { opacity: 0.4 });
        return;
      }

      const t = tokens();
      ctx = gsap.context(() => {
        tl = gsap.timeline({ paused: true, onUpdate: syncRadar });

        // 0 – 40 % : les rues se dessinent depuis l'entrée de la fibre, par ordre de proximité.
        const count = masks.length;
        masks.forEach((path, i) => {
          const start = count > 1 ? (i / (count - 1)) * 0.28 : 0;
          tl!.fromTo(
            path,
            { strokeDashoffset: lengths[i] },
            { strokeDashoffset: 0, duration: 0.12, ease: "none" },
            start,
          );
        });

        // 40 – 60 % : épingles argent.
        tl.fromTo(
          silverPins,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.07, ease: t.ease.in, stagger: 0.016 },
          0.42,
        );

        // 60 – 85 % : épingle or (seul rebond de la scène), les argent s'effacent à 40 %.
        if (goldPin) {
          tl.fromTo(goldPin, { y: -46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.1, ease: "back.out(1.4)" }, 0.62);
        }
        tl.fromTo(silverPins, { opacity: 1 }, { opacity: 0.4, duration: 0.06, ease: t.ease.breath, immediateRender: false }, 0.66);

        // 85 – 100 % : fiche établissement.
        if (card) tl.fromTo(card, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.08, ease: t.ease.in }, 0.86);
        tl.to({}, { duration: 0.0001 }, 1); // borne la timeline à 1

        // Ondes radar : 1,2s chacune, décalées de 0,6s → jamais plus de 2 à l'écran.
        radar = gsap.timeline({ paused: true, repeat: -1 });
        rings.forEach((ring, i) => {
          radar!.fromTo(
            ring,
            { scale: 0, opacity: 0.6, transformOrigin: "50% 50%" },
            { scale: 3, opacity: 0, duration: t.dur.major, ease: t.ease.breath },
            i * (t.dur.major / 2),
          );
        });

        observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          syncRadar();
        });
        observer.observe(root);

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

    destroy() {
      observer?.disconnect();
      observer = null;
      radar?.kill();
      radar = null;
      tl?.kill();
      tl = null;
      ctx?.revert();
      ctx = null;
      visible = false;
    },
  };
}
