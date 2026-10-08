"use client";

import { type CSSProperties, useId, useRef } from "react";

import {
  MAPS_CARD_POSITION,
  MAPS_GOLD_PIN,
  MAPS_SILVER_PINS,
  MAPS_STREETS,
  MAPS_VIEW,
} from "@/lib/motion/expertises/maps-data";
import { createMapsScene } from "@/lib/motion/expertises/maps-scene";
import { useMotionModule } from "@/lib/motion/use-motion-module";

// Scène Expertises 02 — Google Maps et visibilité locale (fibre B).
// La fibre B se branche sur l'avenue principale du plan et le dessine (voir lib/motion/expertises/maps-scene.ts).
export function MapsScene() {
  const ref = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");
  useMotionModule(ref, createMapsScene);

  return (
    <section ref={ref} className="maps-scene py-24 md:py-32" aria-labelledby={`${uid}-title`}>
      {/* Mobile : la marge gauche vient de la zone [data-fiber-split] parente (couloir des 3 fibres). */}
      <div className="container grid items-center gap-12 max-md:pl-0 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.24em] text-silver">02 / 03</p>
          <h2 id={`${uid}-title`} className="mt-4 font-display text-5xl leading-[1.02] md:text-6xl">
            Être <span className="text-gold">trouvé</span>.
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-silver">Google Maps et visibilité locale</p>
          <p className="mt-6">
            [à adapter] Quand un client cherche « boulangerie près de moi », c&apos;est votre établissement
            qu&apos;il voit en premier : fiche Google soignée, avis, horaires et itinéraire à jour.
          </p>
        </div>

        <div className="relative">
          {/* La fibre B arrive par la gauche et se branche sur l'avenue principale (milieu du plan). */}
          <span
            data-fiber-anchor="maps-in"
            data-fiber="B"
            data-fiber-mode="plug"
            data-fiber-axis="x"
            className="maps-fiber-in"
          />
          <div
            className="maps-viz relative"
            role="img"
            aria-label="Plan stylisé : votre établissement mis en avant, noté cinq étoiles et ouvert"
          >
            <svg
              data-maps-svg=""
              viewBox={`0 0 ${MAPS_VIEW.width} ${MAPS_VIEW.height}`}
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" className="maps-stop-1" />
                  <stop offset="0.52" className="maps-stop-2" />
                  <stop offset="1" className="maps-stop-3" />
                </linearGradient>
                {MAPS_STREETS.map((street, i) => (
                  <mask
                    key={i}
                    id={`${uid}-street-${i}`}
                    maskUnits="userSpaceOnUse"
                    x="-20"
                    y="-20"
                    width={MAPS_VIEW.width + 40}
                    height={MAPS_VIEW.height + 40}
                  >
                    <path data-maps-street-mask="" className="maps-street-mask" d={street.d} />
                  </mask>
                ))}
              </defs>

              <g className="maps-streets">
                {MAPS_STREETS.map((street, i) => (
                  <path
                    key={i}
                    d={street.d}
                    mask={`url(#${uid}-street-${i})`}
                    className={street.main ? "maps-street maps-street--main" : "maps-street"}
                  />
                ))}
              </g>

              {MAPS_SILVER_PINS.map((pin, i) => (
                <g key={i} data-maps-pin="silver" transform={`translate(${pin.x} ${pin.y})`}>
                  <g data-maps-drop="">
                    <line className="maps-pin-stem" x1="0" y1="-9" x2="0" y2="0" />
                    <circle className="maps-pin-head" cx="0" cy="-14" r="5" />
                  </g>
                </g>
              ))}

              <g data-maps-pin="gold" transform={`translate(${MAPS_GOLD_PIN.x} ${MAPS_GOLD_PIN.y})`}>
                <circle data-maps-radar="" className="maps-radar" r="14" />
                <circle data-maps-radar="" className="maps-radar" r="14" />
                <g data-maps-drop="">
                  <line className="maps-pin-stem maps-pin-stem--gold" x1="0" y1="-14" x2="0" y2="0" />
                  <circle cx="0" cy="-25" r="11" fill={`url(#${uid}-gold)`} />
                  <circle className="maps-pin-core" cx="0" cy="-25" r="3.5" />
                </g>
              </g>
            </svg>

            {/* Ancrage (positionné en CSS) + fiche (animée en transform) : deux nœuds pour ne pas mêler les transforms. */}
            <div
              className="maps-card-anchor"
              style={
                {
                  "--card-x": `${MAPS_CARD_POSITION.left}%`,
                  "--card-y": `${MAPS_CARD_POSITION.top}%`,
                  "--card-x-mobile": `${MAPS_CARD_POSITION.mobileLeft}%`,
                  "--card-y-mobile": `${MAPS_CARD_POSITION.mobileTop}%`,
                } as CSSProperties
              }
              aria-hidden="true"
            >
              <div data-maps-card="" className="maps-card">
                <p className="font-display text-lg leading-none text-silver-light md:text-xl">Votre entreprise</p>
                <p className="mt-2 text-xs tracking-[0.18em] md:text-sm">
                  <span className="text-gold">★★★★★</span>
                </p>
                <p className="mt-2 text-[0.6rem] uppercase tracking-[0.24em] text-silver md:text-[0.65rem]">Ouvert</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
