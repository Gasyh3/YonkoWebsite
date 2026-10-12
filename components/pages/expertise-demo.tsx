"use client";

import { MapsScene } from "@/components/sections/expertises/maps-scene";
import { SeoScene } from "@/components/sections/expertises/seo-scene";
import { SoftwareScene } from "@/components/sections/expertises/software-scene";
import type { SceneId } from "@/lib/motion/expertises/geometry";

// Visualisation animée d'une expertise, reprise de l'accueil (progression liée au défilement de la section,
// lecture courte en mobile, état final en reduced motion).
export function ExpertiseDemo({ scene }: { scene: SceneId }) {
  if (scene === "seo") return <SeoScene vizOnly />;
  if (scene === "maps") return <MapsScene vizOnly />;
  return <SoftwareScene vizOnly />;
}
