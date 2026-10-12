"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { onReducedMotionChange } from "@/lib/motion/env";
import { createPageTransitions, type PageTransitions as Transitions } from "@/lib/motion/page-transitions";

// Branche les transitions de page sur le routeur de Next.js : la transition attend le rendu de la nouvelle page
// (changement de pathname) avant de se terminer (voir lib/motion/page-transitions.ts).
export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const waiters = useRef<(() => void)[]>([]);
  const transitions = useRef<Transitions | null>(null);

  useEffect(() => {
    const create = () => {
      transitions.current?.destroy();
      transitions.current = createPageTransitions(
        (href) =>
          new Promise<void>((resolve) => {
            waiters.current.push(resolve);
            router.push(href);
          }),
      );
      transitions.current.init();
    };
    create();
    const unsubscribe = onReducedMotionChange(create);
    return () => {
      unsubscribe();
      transitions.current?.destroy();
      transitions.current = null;
    };
  }, [router]);

  useEffect(() => {
    // Nouvelle page rendue : la transition peut se terminer (une image plus tard, le DOM est peint).
    requestAnimationFrame(() => {
      waiters.current.splice(0).forEach((resolve) => resolve());
      transitions.current?.navigated();
    });
  }, [pathname]);

  return null;
}
