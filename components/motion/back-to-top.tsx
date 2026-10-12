"use client";

import { ArrowUp } from "lucide-react";

import { backToTop } from "@/lib/motion/back-to-top";

// Bouton du footer : remontée animée et impulsion inverse dans les fibres (voir lib/motion/back-to-top.ts).
export function BackToTop() {
  return (
    <button type="button" onClick={backToTop} className="back-to-top">
      Retour en haut
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
