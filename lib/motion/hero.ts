// Scène Hero (C2) : révélation du titre au premier chargement, reflet or synchronisé sur la boucle
// vidéo, sortie au scroll (la vidéo recule, les fibres « décrochent »), indicateur de scroll.

import { HERO_PORTRAIT_QUERY, heroMedia } from "../hero-media";
import { isMobile, prefersReducedMotion } from "./env";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
// Classe posée sur <html> par le script inline du layout quand l'intro doit jouer (1re visite de la session).
import { HERO_INTRO_CLASS, HERO_INTRO_STORAGE_KEY } from "./hero-intro";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";


export function createHeroMotion(root: HTMLElement): MotionModule {
  let ctx: gsap.Context | null = null;
  let split: SplitText | null = null;
  let observer: IntersectionObserver | null = null;
  let tick: (() => void) | null = null;
  let destroyed = false;

  const html = document.documentElement;
  const endIntro = () => {
    html.classList.remove(HERO_INTRO_CLASS);
    try {
      sessionStorage.setItem(HERO_INTRO_STORAGE_KEY, "1");
    } catch {
      // stockage indisponible (navigation privée) : l'intro rejouera, sans gravité
    }
  };

  return {
    init() {
      const t = tokens();
      const mobile = isMobile();
      const media = root.querySelector<HTMLElement>("[data-hero-media]");
      const video = root.querySelector<HTMLVideoElement>("video[data-hero-video]");
      const title = root.querySelector<HTMLElement>("[data-hero-title]");
      const copy = root.querySelector<HTMLElement>("[data-hero-copy]");
      const indicator = root.querySelector<HTMLElement>("[data-hero-indicator]");
      const dot = indicator?.querySelector<HTMLElement>("[data-hero-indicator-dot]");

      if (video?.dataset.posterMobile && window.matchMedia(HERO_PORTRAIT_QUERY).matches) {
        video.poster = video.dataset.posterMobile;
      }

      // Reduced motion : poster fixe, titre lisible d'emblée, aucun mouvement.
      if (prefersReducedMotion()) {
        endIntro();
        video?.pause();
        return;
      }

      ctx = gsap.context(() => {
        // 1. Lecture vidéo uniquement quand le hero est visible.
        if (video) {
          observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => undefined);
            else video.pause();
          });
          observer.observe(root);
        }

        // 2. Reflet or : traverse les mots or une fois par boucle, quand la signature apparaît et que les 3 ports respirent.
        const words = [...root.querySelectorAll<HTMLElement>("[data-gold-word]")];
        const glint = () => {
          const tl = gsap.timeline();
          words.forEach((word, i) => {
            const band = word.querySelector<HTMLElement>(".gold-word__glint");
            const text = band?.firstElementChild as HTMLElement | null;
            if (!band || !text) return;
            const proxy = { x: -band.offsetWidth };
            tl.to(
              proxy,
              {
                x: word.offsetWidth,
                duration: t.dur.major,
                ease: t.ease.breath,
                onStart: () => gsap.set(band, { opacity: 1 }),
                onUpdate: () => {
                  // La fenêtre avance, le texte du reflet reste calé sur le mot.
                  gsap.set(band, { x: proxy.x });
                  gsap.set(text, { x: -proxy.x });
                },
                onComplete: () => gsap.set(band, { opacity: 0 }),
              },
              i * t.dur.micro,
            );
          });
        };

        if (video) {
          let last = 0;
          tick = () => {
            const current = video.currentTime;
            if (last < heroMedia.glintAt && current >= heroMedia.glintAt) glint();
            last = current;
          };
          gsap.ticker.add(tick);
        } else {
          // Repli sans vidéo : même rythme que la boucle.
          gsap.timeline({ repeat: -1, delay: heroMedia.glintAt }).call(glint).to({}, { duration: heroMedia.loopDuration });
        }

        // 3. Titre révélé par lignes masquées, au premier chargement de la session seulement.
        if (title && html.classList.contains(HERO_INTRO_CLASS)) {
          document.fonts.ready.then(() => {
            if (destroyed || !ctx) return;
            ctx.add(() => {
              split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "hero-title__line" });
              gsap.set(title, { visibility: "visible" });
              gsap.from(split.lines, {
                yPercent: 100,
                duration: mobile ? t.dur.reveal : t.dur.major,
                ease: t.ease.in,
                stagger: t.stagger,
                onComplete: () => {
                  split?.revert();
                  split = null;
                },
              });
              endIntro();
            });
          });
        } else {
          endIntro();
        }

        // 4. Sortie au scroll sur les 60 premiers % du viewport (mobile : simple fondu).
        const exit = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * 0.6}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });
        if (media) exit.to(media, mobile ? { opacity: 0.35 } : { scale: 0.94, opacity: 0.35 }, 0);
        if (copy) exit.to(copy, { y: () => -window.innerHeight * 0.08, opacity: 0 }, 0);

        // 5. Indicateur de scroll : un point or descend le long d'une ligne pointillée, masqué au premier scroll.
        if (indicator && dot) {
          const loop = gsap
            .timeline({ repeat: -1 })
            .fromTo(dot, { y: 0 }, { y: 40, duration: 2, ease: t.ease.breath }, 0)
            .fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 1, ease: t.ease.breath, yoyo: true, repeat: 1 }, 0);
          const hide = () => {
            gsap.to(indicator, { opacity: 0, duration: t.dur.micro, ease: t.ease.transition, onComplete: () => loop.kill() });
          };
          if (window.scrollY > 8) hide();
          else ScrollTrigger.create({ start: 8, end: "max", once: true, onEnter: hide });
        }
      }, root);
    },

    destroy() {
      destroyed = true;
      if (tick) gsap.ticker.remove(tick);
      tick = null;
      observer?.disconnect();
      observer = null;
      split?.revert();
      split = null;
      ctx?.revert();
      ctx = null;
    },
  };
}
