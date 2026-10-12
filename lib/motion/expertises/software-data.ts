// Scène Expertises 03 — Logiciel sur mesure : géométrie du schéma dessiné par la fibre C.
// Repère SCENE_VIEW (560 × 400). La fibre C traverse le cadre à la hauteur SCENE_ENTRY.C (bus), un tronc en
// descend au centre et dessert 4 modules disposés en quadrant (schéma d'architecture, 90° uniquement).
// Les modules se resserrent ensuite vers le centre en une grille 2×2 (aucune trajectoire ne se croise) :
// les branches se rétractent et seul le raccord bus → dashboard reste.

import { roundedPath } from "../fiber/fiber-router";
import { SCENE_ENTRY, SCENE_VIEW } from "./geometry";

const { width: W, height: H } = SCENE_VIEW;
const Y = H * SCENE_ENTRY.C;
const HUB_X = W / 2;
const BRANCH_RADIUS = 16;

export const SOFTWARE_CARD = { width: 120, height: 86 } as const;
export const SOFTWARE_DASHBOARD = { x: 148, y: 172, width: 264, height: 196 } as const;

export const SOFTWARE_BUS = `M0 ${Y}H${W}`;
export const SOFTWARE_CONNECTOR = `M${HUB_X} ${Y}V${SOFTWARE_DASHBOARD.y}`;

export type SoftwareModuleKind = "planning" | "clients" | "billing" | "stock";

type ModuleDef = { name: string; kind: SoftwareModuleKind; spread: [number, number]; grid: [number, number] };

// Écartés en quadrant, puis emboîtés en 2×2 (gap 8) dans le cadre du dashboard.
const MODULES: ModuleDef[] = [
  { name: "Planning", kind: "planning", spread: [24, 160], grid: [156, 180] },
  { name: "Clients", kind: "clients", spread: [416, 160], grid: [284, 180] },
  { name: "Facturation", kind: "billing", spread: [24, 290], grid: [156, 274] },
  { name: "Stock", kind: "stock", spread: [416, 290], grid: [284, 274] },
];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export const SOFTWARE_MODULES = MODULES.map((m) => {
  const [sx, sy] = m.spread;
  const [gx, gy] = m.grid;
  const left = sx < HUB_X;
  const edge = left ? sx + SOFTWARE_CARD.width : sx; // bord intérieur de la carte, côté tronc
  const midY = sy + SOFTWARE_CARD.height / 2;
  return {
    name: m.name,
    kind: m.kind,
    // Branche : bus → tronc → bord intérieur de la carte (mode « plug »).
    branch: roundedPath(
      [
        { x: HUB_X, y: Y },
        { x: HUB_X, y: midY },
        { x: edge, y: midY },
      ],
      BRANCH_RADIUS,
    ),
    style: { left: pct(sx, W), top: pct(sy, H), width: pct(SOFTWARE_CARD.width, W), height: pct(SOFTWARE_CARD.height, H) },
    // Déplacement vers la grille, en % de la carte (transform uniquement).
    toGrid: { xPercent: ((gx - sx) / SOFTWARE_CARD.width) * 100, yPercent: ((gy - sy) / SOFTWARE_CARD.height) * 100 },
  };
});

export const SOFTWARE_DASHBOARD_STYLE = {
  left: pct(SOFTWARE_DASHBOARD.x, W),
  top: pct(SOFTWARE_DASHBOARD.y, H),
  width: pct(SOFTWARE_DASHBOARD.width, W),
  height: pct(SOFTWARE_DASHBOARD.height, H),
};
