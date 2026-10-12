"use client";

import { useRef } from "react";

import { ProjectCards } from "@/components/sections/project-cards";
import { createResultsScene } from "@/lib/motion/results";
import { useMotionModule } from "@/lib/motion/use-motion-module";

// Grille de la page Réalisations : même comportement que sur l'accueil (révélation des images, contour or au
// survol / focus, morph vers la page projet).
export function ProjectsIndex() {
  const ref = useRef<HTMLDivElement>(null);
  useMotionModule(ref, createResultsScene);
  return (
    <div ref={ref}>
      <ProjectCards eagerFirst />
    </div>
  );
}
