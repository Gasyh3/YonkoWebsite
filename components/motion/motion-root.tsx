"use client";

import { useEffect } from "react";

import { createCursor } from "@/lib/motion/cursor";
import { onReducedMotionChange, prefersReducedMotion } from "@/lib/motion/env";
import { createMicroInteractions } from "@/lib/motion/micro-interactions";
import { createSmoothScroll } from "@/lib/motion/smooth-scroll";

// Socle motion global : smooth scroll, micro-interactions, curseur et classe `motion-reduced` sur <html>.
// Reduced motion (module global) : au changement de préférence, chaque couche est recréée dans le bon état
// (Lenis et curseur coupés, micro-interactions sans mouvement) ; les modules de scène font de même via
// useMotionModule, et les transitions de page via components/motion/page-transitions.tsx.
export function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const layers = [createSmoothScroll(), createMicroInteractions(), createCursor()];

    const apply = (reduced: boolean) => {
      root.classList.toggle("motion-reduced", reduced);
      layers.forEach((layer) => {
        layer.destroy();
        layer.init();
      });
    };

    apply(prefersReducedMotion());
    const unsubscribe = onReducedMotionChange(apply);

    return () => {
      unsubscribe();
      layers.forEach((layer) => layer.destroy());
      root.classList.remove("motion-reduced");
    };
  }, []);

  return null;
}
