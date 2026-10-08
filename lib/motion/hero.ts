// Scène Hero (C2).
// 1. Intro (1re visite de la session) : la bande démo joue en plein écran, puis rentre dans l'écran de
//    l'ordinateur (FLIP en transform) ; l'ordinateur reprend à la même image (heroMedia.handoffAt).
//    Passable à tout moment (bouton, molette, toucher, clavier) ; abandonnée si elle ne démarre pas en 800ms.
// 2. Titre révélé par lignes masquées après l'intro, reflet or synchronisé sur la boucle de l'ordinateur.
// 3. Sortie au scroll : l'ordinateur recule autour de la ligne des ports, les fibres « décrochent ».
// 4. Indicateur de scroll, masqué au premier défilement.

import { heroMedia } from "../hero-media";
import { isMobile, prefersReducedMotion } from "./env";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
// Classe posée sur <html> par le script inline du layout quand l'intro doit jouer (1re visite de la session).
import { HERO_INTRO_CLASS, HERO_INTRO_STORAGE_KEY } from "./hero-intro";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

const INTRO_START_TIMEOUT = 800; // ms : au-delà, pas d'intro (aucun préchargement visible)
const SKIP_KEYS = new Set(["ArrowDown", "PageDown", "End", " ", "Enter", "Escape"]);

export function createHeroMotion(root: HTMLElement): MotionModule {
  let ctx: gsap.Context | null = null;
  let split: SplitText | null = null;
  let observer: IntersectionObserver | null = null;
  let tick: (() => void) | null = null;
  let destroyed = false;
  const cleanups: (() => void)[] = [];

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
      const intro = root.querySelector<HTMLElement>("[data-hero-intro]");
      const introBg = intro?.querySelector<HTMLElement>("[data-hero-intro-bg]");
      const introVideo = intro?.querySelector<HTMLVideoElement>("[data-hero-intro-video]");
      const skip = intro?.querySelector<HTMLButtonElement>("[data-hero-intro-skip]");

      // L'ordinateur démarre toujours sur l'image de relais (signature) : même image que son poster
      // et que la dernière image de l'intro.
      if (video) {
        const seek = () => {
          video.currentTime = heroMedia.handoffAt;
        };
        if (video.readyState >= 1) seek();
        else video.addEventListener("loadedmetadata", seek, { once: true });
      }

      // Reduced motion : pas d'intro, poster fixe, titre lisible d'emblée, aucun mouvement.
      if (prefersReducedMotion()) {
        endIntro();
        video?.pause();
        return;
      }

      const introActive = html.classList.contains(HERO_INTRO_CLASS) && !!intro && !!introVideo && !!media;
      let introRunning = introActive;

      ctx = gsap.context(() => {
        // Lecture de l'ordinateur uniquement quand le hero est visible et l'intro terminée.
        const playComputer = () => {
          if (video && !introRunning) video.play().catch(() => undefined);
        };
        if (video) {
          observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) playComputer();
            else video.pause();
          });
          observer.observe(root);
        }

        // Reflet or : traverse les mots or une fois par boucle, quand la signature apparaît.
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
          let last = heroMedia.handoffAt;
          tick = () => {
            const current = video.currentTime;
            if (last < heroMedia.glintAt && current >= heroMedia.glintAt) glint();
            last = current;
          };
          gsap.ticker.add(tick);
        }

        // Titre révélé par lignes masquées (1re visite seulement), puis fin de l'intro.
        const revealTitle = () => {
          if (!title || !html.classList.contains(HERO_INTRO_CLASS)) return endIntro();
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
        };

        // Intro : la bande démo rentre dans l'écran de l'ordinateur.
        if (introActive && intro && introVideo && media) {
          let landed = false;

          const finish = () => {
            introRunning = false;
            playComputer();
            revealTitle();
          };

          const land = (duration: number) => {
            if (landed) return;
            landed = true;
            cleanups.forEach((fn) => fn());
            cleanups.length = 0;
            introVideo.pause();
            intro.style.pointerEvents = "none";

            // FLIP : du cadre plein écran vers l'écran de l'ordinateur (même format 16:9).
            const from = introVideo.getBoundingClientRect();
            const box = media.getBoundingClientRect();
            const target = {
              left: box.left + (box.width * heroMedia.screen.x) / 100,
              top: box.top + (box.height * heroMedia.screen.y) / 100,
              width: (box.width * heroMedia.screen.w) / 100,
            };
            const tl = gsap.timeline({ onComplete: finish });
            tl.to(
              introVideo,
              {
                x: target.left - from.left,
                y: target.top - from.top,
                scale: target.width / from.width,
                transformOrigin: "0 0",
                duration,
                ease: t.ease.transition,
              },
              0,
            );
            if (introBg) tl.to(introBg, { opacity: 0, duration: duration * 0.75, ease: t.ease.transition }, duration * 0.15);
            if (skip) tl.to(skip, { opacity: 0, duration: t.dur.micro, ease: t.ease.breath }, 0);
            // L'ordinateur, déjà sur l'image de relais, prend le relais sous la vidéo qui s'efface.
            tl.to(introVideo, { opacity: 0, duration: t.dur.micro, ease: t.ease.breath }, duration);
          };

          // Sans démarrage rapide (réseau lent, lecture bloquée), on passe directement au hero.
          const giveUp = () => {
            if (landed) return;
            landed = true;
            cleanups.forEach((fn) => fn());
            cleanups.length = 0;
            introVideo.pause();
            finish();
          };
          const startTimer = window.setTimeout(giveUp, INTRO_START_TIMEOUT);
          cleanups.push(() => window.clearTimeout(startTimer));

          introVideo.preload = "auto";
          introVideo.play().then(
            () => window.clearTimeout(startTimer),
            () => giveUp(),
          );

          const onEnded = () => land(t.dur.major);
          const onSkip = () => land(t.dur.reveal);
          const onKey = (event: KeyboardEvent) => {
            if (SKIP_KEYS.has(event.key) && document.activeElement !== skip) onSkip();
          };
          introVideo.addEventListener("ended", onEnded);
          skip?.addEventListener("click", onSkip);
          window.addEventListener("wheel", onSkip, { passive: true });
          window.addEventListener("touchmove", onSkip, { passive: true });
          window.addEventListener("keydown", onKey);
          cleanups.push(() => {
            introVideo.removeEventListener("ended", onEnded);
            skip?.removeEventListener("click", onSkip);
            window.removeEventListener("wheel", onSkip);
            window.removeEventListener("touchmove", onSkip);
            window.removeEventListener("keydown", onKey);
          });
        } else {
          revealTitle();
        }

        // Sortie au scroll sur les 60 premiers % du viewport (mobile : simple fondu).
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

        // Indicateur de scroll : un point or descend le long d'une ligne pointillée, masqué au premier scroll.
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
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
      if (tick) gsap.ticker.remove(tick);
      tick = null;
      observer?.disconnect();
      observer = null;
      split?.revert();
      split = null;
      ctx?.revert();
      ctx = null;
      // L'overlay d'intro fait partie du composant : démonté avec lui, il ne peut pas rester affiché.
    },
  };
}
