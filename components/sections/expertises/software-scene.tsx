"use client";

import { useId, useRef } from "react";

import { SceneShell } from "@/components/sections/expertises/scene-shell";
import { SCENE_VIEW } from "@/lib/motion/expertises/geometry";
import {
  SOFTWARE_BUS,
  SOFTWARE_CONNECTOR,
  SOFTWARE_DASHBOARD_STYLE,
  SOFTWARE_MODULES,
  type SoftwareModuleKind,
} from "@/lib/motion/expertises/software-data";
import { createSoftwareScene } from "@/lib/motion/expertises/software-scene";
import { noMotion, useMotionModule } from "@/lib/motion/use-motion-module";

// Aperçu stylisé de chaque module (lignes et barres argent, aucun vrai texte).
function ModulePreview({ kind }: { kind: SoftwareModuleKind }) {
  switch (kind) {
    case "planning":
      return (
        <span className="software-preview software-preview--planning">
          {[
            [0, 55],
            [25, 50],
            [45, 40],
          ].map(([offset, width], i) => (
            <span key={i} className="software-bar" style={{ marginLeft: `${offset}%`, width: `${width}%` }} />
          ))}
        </span>
      );
    case "clients":
      return (
        <span className="software-preview software-preview--clients">
          {[70, 55, 62].map((width, i) => (
            <span key={i} className="software-row">
              <span className="software-dot" />
              <span className="software-bar software-bar--thin" style={{ width: `${width}%` }} />
            </span>
          ))}
        </span>
      );
    case "billing":
      return (
        <span className="software-preview software-preview--billing">
          <span className="software-bar software-bar--strong" style={{ width: "48%" }} />
          <span className="software-bar software-bar--thin" style={{ width: "80%" }} />
          <span className="software-bar software-bar--thin" style={{ width: "64%" }} />
        </span>
      );
    case "stock":
      return (
        <span className="software-preview software-preview--stock">
          {[60, 85, 40, 70, 55].map((height, i) => (
            <span key={i} className="software-column" style={{ height: `${height}%` }} />
          ))}
        </span>
      );
  }
}

// Scène Expertises 03 — Logiciel interne sur mesure (fibre C).
// La fibre C se ramifie en 4 modules qui s'emboîtent en dashboard (voir lib/motion/expertises/software-scene.ts).
// embedded : dans le conteneur Expertises (C5), qui pilote la scène et prolonge lui-même la fibre.
export function SoftwareScene({ embedded = false }: { embedded?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");
  useMotionModule(ref, embedded ? noMotion : createSoftwareScene);

  const masks = [
    { key: "bus", d: SOFTWARE_BUS, attr: "data-software-bus-mask" },
    { key: "connector", d: SOFTWARE_CONNECTOR, attr: "data-software-connector-mask" },
    ...SOFTWARE_MODULES.map((m, i) => ({ key: `branch-${i}`, d: m.branch, attr: "data-software-branch-mask" })),
  ];

  return (
    <SceneShell
      ref={ref}
      scene="software"
      index="03"
      titleId={`${uid}-title`}
      title={
        <>
          Être <span className="text-silver-light">efficace</span>.
        </>
      }
      subtitle="Logiciel interne sur mesure"
      embedded={embedded}
      viz={
        <div
          data-expertise-viz=""
          className="software-viz relative"
          role="img"
          aria-label="Schéma : quatre modules (planning, clients, facturation, stock) assemblés en un tableau de bord"
        >
          <svg
            data-software-svg=""
            viewBox={`0 0 ${SCENE_VIEW.width} ${SCENE_VIEW.height}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              {masks.map((m) => (
                <mask
                  key={m.key}
                  id={`${uid}-${m.key}`}
                  maskUnits="userSpaceOnUse"
                  x="-20"
                  y="-20"
                  width={SCENE_VIEW.width + 40}
                  height={SCENE_VIEW.height + 40}
                >
                  <path {...{ [m.attr]: "" }} className="software-line-mask" d={m.d} />
                </mask>
              ))}
            </defs>

            {/* Bus, raccord et branches : pointillés de la fibre C. */}
            {masks.map((m) => (
              <path
                key={m.key}
                d={m.d}
                mask={`url(#${uid}-${m.key})`}
                className={m.key === "bus" ? "software-line software-line--bus" : "software-line"}
              />
            ))}
            {SOFTWARE_MODULES.map((m, i) => (
              <path key={i} data-software-pulse="" d={m.branch} className="software-pulse" />
            ))}
          </svg>

          {/* Cadre du dashboard, sous les 4 modules. */}
          <div data-software-panel="" className="software-panel" style={SOFTWARE_DASHBOARD_STYLE} aria-hidden="true" />

          {SOFTWARE_MODULES.map((m) => (
            <div key={m.kind} data-software-card="" className="software-card" style={m.style} aria-hidden="true">
              <span className="software-card__edge" />
              <span data-software-lit="" className="software-card__edge software-card__edge--lit" />
              <span className="software-card__name">{m.name}</span>
              <ModulePreview kind={m.kind} />
            </div>
          ))}

          {/* Reflet : au-dessus des modules, découpé au cadre du dashboard. */}
          <div className="software-sheen" style={SOFTWARE_DASHBOARD_STYLE} aria-hidden="true">
            <span data-software-glint="" className="software-glint" />
          </div>

          <p data-software-label="" className="software-label text-gold">
            Conçu pour votre entreprise
          </p>
        </div>
      }
    >
      [à adapter] Devis, planning, stock, facturation : un outil taillé pour votre activité, qui vous fait gagner
      des heures chaque semaine.
    </SceneShell>
  );
}
