"use client";

import Link from "next/link";
import { useRef } from "react";

import { SkeletonImage } from "@/components/ui/skeleton";
import { createResultsScene } from "@/lib/motion/results";
import { useMotionModule } from "@/lib/motion/use-motion-module";
import { formatStat, projects, resultStats } from "@/lib/results-data";

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

        <ul className="mt-20 grid gap-12 md:mt-28 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
          {projects.map((project, i) => (
            <li key={project.image.src}>
              <article data-results-card="" className="results-card" aria-labelledby={`project-${i}-title`}>
                {/* Contour pointillé or, dessiné au survol (masque révélé par stroke-dashoffset). */}
                <svg className="results-card__outline" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id={`project-${i}-gold`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" className="maps-stop-1" />
                      <stop offset="0.52" className="maps-stop-2" />
                      <stop offset="1" className="maps-stop-3" />
                    </linearGradient>
                    <mask id={`project-${i}-mask`}>
                      <rect
                        data-results-outline-mask=""
                        className="results-card__outline-mask"
                        width="100%"
                        height="100%"
                        rx="14"
                        pathLength="1"
                      />
                    </mask>
                  </defs>
                  <rect
                    className="results-card__outline-dots"
                    width="100%"
                    height="100%"
                    rx="14"
                    stroke={`url(#project-${i}-gold)`}
                    mask={`url(#project-${i}-mask)`}
                  />
                </svg>

                <Link href={`/projets/${project.slug}`} data-project-link="" className="results-card__link">
                  <div data-results-media="" data-transition-media="" className="results-card__media skeleton">
                    <div data-results-reveal="" className="results-card__reveal">
                      <SkeletonImage
                        data-results-image=""
                        src={project.image.src}
                        alt={project.image.alt}
                        width={project.image.width}
                        height={project.image.height}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        unoptimized
                        className="results-card__image"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-silver">{project.service}</p>
                    <p className="text-xs text-silver">{project.sector}</p>
                  </div>
                  <h3 id={`project-${i}-title`} className="mt-3 font-display text-2xl text-silver-light md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm">{project.result}</p>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
