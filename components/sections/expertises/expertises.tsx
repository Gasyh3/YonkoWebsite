"use client";

import { useRef } from "react";

import { MapsScene } from "@/components/sections/expertises/maps-scene";
import { SeoScene } from "@/components/sections/expertises/seo-scene";
import { SoftwareScene } from "@/components/sections/expertises/software-scene";
import { createExpertises } from "@/lib/motion/expertises/expertises";
import { useMotionModule } from "@/lib/motion/use-motion-module";

const STEPS = ["01", "02", "03"];

// Expertises (C5) : conteneur épinglé sur 300vh, une scène par fibre (SEO, Maps, Logiciel).
// Desktop : le cadre opaque est épinglé ; les fibres globales s'arrêtent à son bord haut (expertises-in) et
// reprennent sous lui (expertises-out). Dans le cadre, un SVG local les prolonge jusqu'à leur scène.
// Mobile et reduced motion : pas de pin, les scènes s'empilent (voir lib/motion/expertises/expertises.ts).
export function Expertises() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createExpertises);

  return (
    <section ref={ref} id="expertises" className="expertises relative pt-16 md:pt-28" aria-label="Expertises">
      {/* Entrée des fibres : au-dessus de l'espace entre le texte et la visualisation (couloir des fibres). */}
      <div
        className="container hidden h-0 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20"
        aria-hidden="true"
      >
        <span />
        <span className="relative">
          <span data-fiber-anchor="expertises-in" data-fiber="all" className="expertises-fiber-in" />
        </span>
      </div>

      <div data-expertises-frame="" className="expertises-frame">
        <svg data-expertises-fibers="" className="expertises-fibers" aria-hidden="true" focusable="false" />

        <div className="expertises-indicator container" aria-hidden="true">
          <p className="text-xs uppercase tracking-[0.24em] text-silver">Expertises</p>
          <ol className="expertises-indicator__steps">
            {STEPS.map((step, i) => (
              <li key={step} data-expertises-step={i} className="expertises-indicator__step">
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div data-fiber-split="" className="expertises-slides pl-16 md:pl-0">
          <SeoScene embedded />
          <MapsScene embedded />
          <SoftwareScene embedded />
        </div>
      </div>

      {/* Sortie : les 3 fibres reprennent dans la marge droite, sous le cadre. */}
      <div className="container relative hidden h-0 md:block" aria-hidden="true">
        <span data-fiber-anchor="expertises-out" data-fiber="all" className="expertises-fiber-out" />
      </div>
    </section>
  );
}
