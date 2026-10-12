// Géométrie commune aux 3 scènes Expertises (C5) : même cadre de visualisation (repère 560 × 400, ratio 7:5)
// et hauteurs d'entrée des fibres, partagées par les scènes et le conteneur épinglé.

import type { FiberId } from "../fiber/fiber-router";

export const SCENE_VIEW = { width: 560, height: 400 } as const;

// Hauteur (fraction du cadre) où chaque fibre entre dans sa scène par le bord gauche et en ressort par le bord
// droit. C en haut, A en bas : quittant des couloirs parallèles (A à gauche, C à droite), aucune ne croise les autres.
export const SCENE_ENTRY: Record<FiberId, number> = { A: 0.7, B: 0.5, C: 0.3 };

export type SceneId = "seo" | "maps" | "software";

export const SCENES: { id: SceneId; fiber: FiberId }[] = [
  { id: "seo", fiber: "A" },
  { id: "maps", fiber: "B" },
  { id: "software", fiber: "C" },
];
