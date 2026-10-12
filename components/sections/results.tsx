"use client";

import { useRef } from "react";

import { createResultsScene } from "@/lib/motion/results";
import { useMotionModule } from "@/lib/motion/use-motion-module";
import { formatStat, resultStats } from "@/lib/results-data";

// Résultats (C8) : les fibres s'effacent (50 % d'opacité, marge droite). Tant qu'il n'y a pas de client, la
// section ne montre que des engagements vérifiables, comptés puis passés en or ; aucun projet.
export function Results() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createResultsScene);

  return (
    <section ref={ref} id="engagements" data-fiber-dim="" className="results py-24 md:py-36" aria-labelledby="results-title">
      {/* Grille et chiffres en retrait de 24px à droite : la marge reste aux fibres. */}
      <div className="container md:pr-[calc(2.75rem+1.5rem)]">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-silver">Engagements</p>
          <h2 id="results-title" className="mt-4 font-display text-4xl leading-[1.04] md:text-6xl">
            Des engagements tenus.
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
      </div>
    </section>
  );
}
