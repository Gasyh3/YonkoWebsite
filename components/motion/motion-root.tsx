"use client";

import { useEffect } from "react";

import { onReducedMotionChange, prefersReducedMotion } from "@/lib/motion/env";
import { createSmoothScroll } from "@/lib/motion/smooth-scroll";

// Socle motion global : smooth scroll et classe `motion-reduced` sur <html>.
export function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const smoothScroll = createSmoothScroll();

    const apply = (reduced: boolean) => {
      root.classList.toggle("motion-reduced", reduced);
      smoothScroll.destroy();
      if (!reduced) smoothScroll.init();
    };

    apply(prefersReducedMotion());
    const unsubscribe = onReducedMotionChange(apply);

    return () => {
      unsubscribe();
      smoothScroll.destroy();
      root.classList.remove("motion-reduced");
    };
  }, []);

  return null;
}
