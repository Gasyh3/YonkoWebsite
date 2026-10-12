// Transitions de page (C11), View Transitions API avec repli en fondu simple.
// - Clic sur un projet ([data-project-link]) : l'image de la carte ([data-transition-media]) devient le visuel
//   d'en-tête de la page projet (élément partagé « project-media », morph 1.2s power3.inOut, voir globals.css).
// - Autres navigations internes : une impulsion or descend l'écran le long d'une fibre (0.7s), la page sortante
//   passe à opacity 0, la page entrante révèle son titre par lignes.
// Les liens restent de vrais liens : on intercepte seulement le clic gauche simple vers une autre page du site
// (pas de modificateur, pas de cible, pas de téléchargement, pas d'ancre de la même page).
// Reduced motion : aucune interception, navigation native.

import { prefersReducedMotion } from "./env";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { getLenis } from "./smooth-scroll";
import { tokens } from "./tokens";
import type { MotionModule } from "./use-motion-module";

type Navigate = (href: string) => Promise<void>;

const NAVIGATION_TIMEOUT = 2000; // ms : au-delà, la transition se termine sans attendre la nouvelle page

export type PageTransitions = MotionModule & { navigated: () => void };

const ANCHOR_SETTLE = [0, 300, 800, 1500]; // ms : recalages sur l'ancre pendant que la page se met en place

// Défilement vers une ancre, sous le header collé (Lenis et le navigateur appliquent le scroll-margin-top).
function scrollToAnchor(target: HTMLElement, immediate: boolean) {
  const t = tokens();
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { immediate, force: immediate, duration: t.dur.major, easing: gsap.parseEase(t.ease.transition) });
  } else {
    target.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }
}

// Arrivée sur une ancre d'une autre page : la hauteur finale (pin des Expertises, fibres, polices) n'existe
// qu'après l'init des modules. On se recale tant que la section n'est pas en place, sauf si le visiteur a repris
// la main (molette, toucher, clavier).
function settleOnAnchor(id: string) {
  let interrupted = false;
  const stop = () => (interrupted = true);
  const events = ["wheel", "touchstart", "keydown"] as const;
  events.forEach((type) => window.addEventListener(type, stop, { once: true, passive: true }));
  ANCHOR_SETTLE.forEach((delay, i) =>
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!interrupted && target) {
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop || "0");
        if (Math.abs(target.getBoundingClientRect().top - margin) > 2) scrollToAnchor(target, true);
      }
      if (i === ANCHOR_SETTLE.length - 1) events.forEach((type) => window.removeEventListener(type, stop));
    }, delay),
  );
}

export function createPageTransitions(navigate: Navigate): PageTransitions {
  let onClick: ((e: MouseEvent) => void) | null = null;
  let busy = false;
  let pending = false; // une navigation interceptée attend son rendu (révélation par lignes à l'arrivée)
  let first = true;

  // Impulsion or le long d'une fibre verticale, du haut vers le bas de l'écran.
  const pulse = () => {
    const t = tokens();
    const el = document.createElement("div");
    el.className = "page-pulse";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<span class="page-pulse__fiber"></span><span class="page-pulse__head"></span>';
    document.body.append(el);
    const head = el.lastElementChild as HTMLElement;
    const tl = gsap
      .timeline({ onComplete: () => el.remove() })
      .fromTo(head, { y: 0, yPercent: -100 }, { y: () => window.innerHeight, yPercent: 0, duration: t.dur.reveal, ease: t.ease.transition })
      .to(el, { opacity: 0, duration: t.dur.micro, ease: t.ease.breath });
    return { el, tl };
  };

  const withTimeout = (promise: Promise<void>) =>
    Promise.race([promise, new Promise<void>((resolve) => setTimeout(resolve, NAVIGATION_TIMEOUT))]);

  const run = async (href: string, media: HTMLElement | null) => {
    busy = true;
    pending = true;
    const t = tokens();
    // Menus ouverts (panneau Expertises, menu mobile) masqués tout de suite : ils ne figent pas dans l'image
    // de la page sortante. Ils se referment d'eux-mêmes au changement de page.
    const root = document.documentElement;
    root.setAttribute("data-navigating", "");
    try {
      if (typeof document.startViewTransition === "function") {
        if (media) media.style.viewTransitionName = "project-media";
        else pulse();
        const transition = document.startViewTransition(async () => {
          await withTimeout(navigate(href));
          if (media) media.style.viewTransitionName = "";
        });
        await transition.finished.catch(() => undefined);
      } else {
        // Repli : fondu simple de la page sortante, puis navigation.
        const main = document.querySelector<HTMLElement>("main");
        if (!media) pulse();
        if (main) await gsap.to(main, { opacity: 0, duration: t.dur.micro, ease: t.ease.transition });
        await withTimeout(navigate(href));
        if (main) gsap.set(main, { clearProps: "opacity" });
      }
    } finally {
      root.removeAttribute("data-navigating");
      busy = false;
    }
  };

  return {
    init() {
      if (prefersReducedMotion()) return;
      onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href]") : null;
        if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname) {
          // Ancre de la même page : défilement fluide (Lenis), sans transition.
          const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
          if (!target) return;
          e.preventDefault();
          e.stopPropagation();
          scrollToAnchor(target, false);
          history.pushState(null, "", url.hash);
          return;
        }
        // Le clic ne doit pas atteindre le routeur de next/link : la navigation passe par la transition.
        e.preventDefault();
        e.stopPropagation();
        if (busy) return;
        const media = link.matches("[data-project-link]")
          ? link.querySelector<HTMLElement>("[data-transition-media]")
          : null;
        void run(url.pathname + url.search + url.hash, media);
      };
      document.addEventListener("click", onClick, true);
    },

    // Appelé quand la nouvelle page est rendue (changement de pathname).
    navigated() {
      if (!pending) {
        // Premier affichage avec une ancre (lien partagé /#expertises) : même recalage.
        if (first && location.hash) settleOnAnchor(decodeURIComponent(location.hash.slice(1)));
        first = false;
        return;
      }
      first = false;
      pending = false;
      const lenis = getLenis();
      if (!location.hash) {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
      }
      ScrollTrigger.refresh();
      // Ancre d'une autre page : la mise en page finale (pin, fibres) n'existe qu'après l'init des modules ;
      // on se recale sur la section une fois tout en place.
      if (location.hash) settleOnAnchor(decodeURIComponent(location.hash.slice(1)));
      // La page entrante révèle son titre par lignes (le hero gère le sien).
      const title = document.querySelector<HTMLElement>("main h1:not([data-hero-title])");
      if (!title) return;
      const t = tokens();
      const split = SplitText.create(title, { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 100,
        duration: t.dur.reveal,
        ease: t.ease.in,
        stagger: t.stagger,
        onComplete: () => split.revert(),
      });
    },

    destroy() {
      if (onClick) document.removeEventListener("click", onClick, true);
      onClick = null;
    },
  };
}
