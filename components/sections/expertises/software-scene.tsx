"use client";

import { useId } from "react";

import { SceneShell } from "@/components/sections/expertises/scene-shell";
import { SCENE_ENTRY, SCENE_VIEW } from "@/lib/motion/expertises/geometry";

// Scène Expertises 03 — Logiciel interne sur mesure (fibre C).
// Provisoire : la fibre C traverse le cadre ; la ramification en modules de dashboard arrive avec C7.
export function SoftwareScene({ embedded = false }: { embedded?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const y = SCENE_VIEW.height * SCENE_ENTRY.C;

  return (
    <SceneShell
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
        <div data-expertise-viz="" className="software-viz relative" aria-hidden="true">
          <svg
            viewBox={`0 0 ${SCENE_VIEW.width} ${SCENE_VIEW.height}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            focusable="false"
          >
            <path d={`M0 ${y}H${SCENE_VIEW.width}`} className="software-line" />
          </svg>
          <p className="software-placeholder">[à venir — C7 : modules du dashboard]</p>
        </div>
      }
    >
      [à adapter] Devis, planning, stock, facturation : un outil taillé pour votre activité, qui vous fait gagner
      des heures chaque semaine.
    </SceneShell>
  );
}
