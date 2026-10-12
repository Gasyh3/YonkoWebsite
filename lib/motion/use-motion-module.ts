"use client";

import { type RefObject, useEffect } from "react";

import { onReducedMotionChange } from "./env";

// Contrat de tout module d'animation : init() installe, destroy() nettoie tout
// (ScrollTriggers, timelines, listeners, nœuds créés).
export type MotionModule = {
  init: () => void;
  destroy: () => void;
};

export type MotionModuleFactory<E extends HTMLElement = HTMLElement> = (root: E) => MotionModule;

// Branche un module motion sur le cycle de vie d'un composant React. Au changement de prefers-reduced-motion,
// le module est recréé : chaque scène passe d'elle-même à son état final statique (ou revient à l'animation).
export function useMotionModule<E extends HTMLElement>(
  ref: RefObject<E | null>,
  factory: MotionModuleFactory<E>,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let motionModule = factory(root);
    motionModule.init();
    const unsubscribe = onReducedMotionChange(() => {
      motionModule.destroy();
      motionModule = factory(root);
      motionModule.init();
    });
    return () => {
      unsubscribe();
      motionModule.destroy();
    };
  }, [ref, factory]);
}

// Module vide : pour un composant dont l'animation est pilotée par un conteneur parent.
export const noMotion: MotionModuleFactory = () => ({ init() {}, destroy() {} });
