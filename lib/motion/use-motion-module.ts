"use client";

import { type RefObject, useEffect } from "react";

// Contrat de tout module d'animation : init() installe, destroy() nettoie tout
// (ScrollTriggers, timelines, listeners, nœuds créés).
export type MotionModule = {
  init: () => void;
  destroy: () => void;
};

export type MotionModuleFactory<E extends HTMLElement = HTMLElement> = (root: E) => MotionModule;

// Branche un module motion sur le cycle de vie d'un composant React.
export function useMotionModule<E extends HTMLElement>(
  ref: RefObject<E | null>,
  factory: MotionModuleFactory<E>,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const motionModule = factory(root);
    motionModule.init();
    return () => motionModule.destroy();
  }, [ref, factory]);
}
