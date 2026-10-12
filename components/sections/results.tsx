"use client";

import { useRef } from "react";

import { ProjectCards } from "@/components/sections/project-cards";
import { createResultsScene } from "@/lib/motion/results";
import { useMotionModule } from "@/lib/motion/use-motion-module";
import { formatStat, resultStats } from "@/lib/results-data";

// Résultats et projets (C8) : les fibres s'effacent (50 % d'opacité, marge droite), le travail parle.
// Chiffres clés comptés puis passés en or ; projets révélés par leur image ; contour pointillé or au survol.
export function Results() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createResultsScene);

  return (
    <section ref={ref} id="projets" data-fiber-dim="" className="results py-24 md:py-36" aria-labelledby="results-title">
      {/* Grille et chiffres en retrait de 24px à droite : la marge reste aux fibres. */}
      <div className="container md:pr-[calc(2.75rem+1.5rem)]">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-silver">Résultats</p>
          <h2 id="results-title" className="mt-4 font-display text-4xl leading-[1.04] md:text-6xl">
            [à adapter] Le travail parle de lui-même.
          </h2>
        </div>

        <dl className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
          {resultStats.map((stat) => (
            <div key={stat.label} data-results-stat="" className="results-stat">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="results-stat__number font-display">
                  {/* Couche or : valeur finale (lue par les lecteurs d'écran, réserve la largeur). */}
                  <span data-results-gold="" className="results-stat__gold text-gold">
                    {formatStat(stat)}
                  </span>
                  {/* Couche argent : le compteur, de 0 à la valeur. */}
                  <span
                    data-results-count=""
                    data-value={stat.value}
                    data-prefix={stat.prefix ?? ""}
                    data-suffix={stat.suffix ?? ""}
                    className="results-stat__count"
                    aria-hidden="true"
                  >
                    {formatStat(stat)}
                  </span>
                </span>
                <span className="mt-3 block text-sm text-silver" aria-hidden="true">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-xs text-silver">[à remplacer] Chiffres d&apos;exemple, en attente des résultats clients.</p>

        <ProjectCards className="mt-20 md:mt-28" />
      </div>
    </section>
  );
}
