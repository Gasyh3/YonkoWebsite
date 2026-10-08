// Scène Expertises 02 — Google Maps : géométrie du quadrillage dessiné par la fibre B.
// Coordonnées dans un repère 560 × 400 (viewBox du SVG). Uniquement 90° / 45°, coudes arrondis
// au rayon des fibres (roundedPath). Aucun fond de carte réel.

import { roundedPath, type Vec } from "../fiber/fiber-router";

export const MAPS_VIEW = { width: 560, height: 400 } as const;

// Point d'entrée : la fibre B arrive par la gauche, sur l'avenue principale.
export const MAPS_ENTRY: Vec = { x: 0, y: 200 };

type StreetDef = { points: [number, number][]; main?: boolean };

const STREETS: StreetDef[] = [
  { points: [[0, 200], [560, 200]], main: true }, // avenue : prolonge la fibre B
  { points: [[300, 0], [300, 400]], main: true }, // boulevard
  { points: [[0, 300], [470, 300], [470, 400]], main: true },
  { points: [[60, 400], [60, 90], [560, 90]] },
  { points: [[140, 0], [140, 400]] },
  { points: [[440, 0], [440, 250], [300, 250]] },
  { points: [[220, 0], [220, 150], [300, 150]] },
  { points: [[370, 200], [370, 400]] },
  { points: [[470, 300], [560, 210]] }, // rue à 45°
  { points: [[140, 360], [300, 360]] },
];

export type Street = { d: string; main: boolean; distance: number };

const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

// Chaque rue se dessine depuis son extrémité la plus proche de l'entrée, dans l'ordre de proximité.
export const MAPS_STREETS: Street[] = STREETS.map(({ points, main = false }) => {
  let pts = points.map(([x, y]) => ({ x, y }));
  if (dist(pts[pts.length - 1], MAPS_ENTRY) < dist(pts[0], MAPS_ENTRY)) pts = [...pts].reverse();
  const distance = Math.min(...pts.map((p) => dist(p, MAPS_ENTRY)));
  return { d: roundedPath(pts), main, distance };
}).sort((a, b) => a.distance - b.distance);

// Épingles argent (carrefours) et épingle or au croisement des deux axes principaux.
export const MAPS_SILVER_PINS: Vec[] = [
  { x: 140, y: 90 },
  { x: 440, y: 90 },
  { x: 60, y: 300 },
  { x: 220, y: 150 },
  { x: 370, y: 300 },
  { x: 140, y: 200 },
  { x: 440, y: 250 },
  { x: 370, y: 360 },
];

export const MAPS_GOLD_PIN: Vec = { x: 300, y: 200 };

// Fiche établissement (en % du repère) : à droite de l'épingle or en desktop,
// centrée sous l'épingle en mobile (le plan est trop étroit pour l'accueillir à côté).
export const MAPS_CARD_POSITION = {
  left: ((MAPS_GOLD_PIN.x + 26) / MAPS_VIEW.width) * 100,
  top: ((MAPS_GOLD_PIN.y - 96) / MAPS_VIEW.height) * 100,
  mobileLeft: (MAPS_GOLD_PIN.x / MAPS_VIEW.width) * 100,
  mobileTop: ((MAPS_GOLD_PIN.y + 34) / MAPS_VIEW.height) * 100,
};
