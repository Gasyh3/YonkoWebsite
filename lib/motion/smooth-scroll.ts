import Lenis from "lenis";

import { isTouch, prefersReducedMotion } from "./env";
import { gsap, ScrollTrigger } from "./gsap";
import type { MotionModule } from "./use-motion-module";

let lenis: Lenis | null = null;

// Instance Lenis courante (null en reduced motion, sur tactile ou avant init).
export const getLenis = () => lenis;

// Smooth scroll Lenis synchronisé avec le ticker GSAP et ScrollTrigger.
// Désactivé en reduced motion et sur appareils tactiles (scroll natif).
export function createSmoothScroll(): MotionModule {
  const raf = (time: number) => lenis?.raf(time * 1000);

  return {
    init() {
      if (lenis || prefersReducedMotion() || isTouch()) return;
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    },
    destroy() {
      if (!lenis) return;
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenis = null;
    },
  };
}
