// « Retour en haut » (C10) : Lenis remonte la page en 1.6s (power3.inOut) et une impulsion parcourt les fibres en
// sens inverse, du bas vers l'ordinateur, calée sur la remontée (FiberSystem.rewind).
// Sans Lenis (tactile) : même remontée, pilotée par GSAP. Reduced motion : saut direct en haut, sans impulsion.
// À l'arrivée, le focus revient en haut de la page (navigation clavier).

import { prefersReducedMotion } from "./env";
import { FiberSystem } from "./fiber/fiber-system";
import { gsap } from "./gsap";
import { getLenis } from "./smooth-scroll";
import { tokens } from "./tokens";

const DURATION = 1.6; // s (brief C10)

const focusTop = () => document.querySelector<HTMLElement>("#top")?.focus({ preventScroll: true });

export function backToTop() {
  if (prefersReducedMotion()) {
    window.scrollTo(0, 0);
    focusTop();
    return;
  }
  const t = tokens();
  const ease = gsap.parseEase(t.ease.transition);
  FiberSystem.rewind(DURATION);
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: DURATION, easing: ease, onComplete: focusTop });
    return;
  }
  const proxy = { y: window.scrollY };
  gsap.to(proxy, {
    y: 0,
    duration: DURATION,
    ease,
    onUpdate: () => window.scrollTo(0, proxy.y),
    onComplete: focusTop,
  });
}
