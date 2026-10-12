// Scène Expertises 01 — Site vitrine et SEO : géométrie de la fenêtre de navigateur dessinée par la fibre A.
// Repère SCENE_VIEW (560 × 400). La fibre entre à gauche à la hauteur SCENE_ENTRY.A et ressort à droite à la
// même hauteur : le contour se dessine en deux moitiés (par le haut, par le bas) qui se rejoignent à la sortie.

import { SCENE_ENTRY, SCENE_VIEW } from "./geometry";

const { width: W, height: H } = SCENE_VIEW;
const R = 12; // coins arrondis de la fenêtre
const Y = H * SCENE_ENTRY.A;

export const SEO_OUTLINE = [
  `M0 ${Y}V${R}A${R} ${R} 0 0 1 ${R} 0H${W - R}A${R} ${R} 0 0 1 ${W} ${R}V${Y}`,
  `M0 ${Y}V${H - R}A${R} ${R} 0 0 0 ${R} ${H}H${W - R}A${R} ${R} 0 0 0 ${W} ${H - R}V${Y}`,
];

// Barre de titre : séparateur et les 3 points en haut à gauche.
export const SEO_BAR = `M0 44H${W}`;
export const SEO_DOTS = [22, 38, 54].map((x) => ({ x, y: 22 }));

// 5 résultats en lignes stylisées (largeurs en %) ; le 4e est celui du client.
export const SEO_CLIENT_INDEX = 3;
export const SEO_RESULTS = [
  { title: 52, url: 30, text: 86 },
  { title: 44, url: 26, text: 78 },
  { title: 60, url: 34, text: 70 },
  { title: 0, url: 28, text: 82 },
  { title: 48, url: 24, text: 74 },
];
