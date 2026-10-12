import Link from "next/link";

import { SkeletonImage } from "@/components/ui/skeleton";
import { projects } from "@/lib/results-data";
import { cn } from "@/lib/utils";

// Grille des projets (accueil et page Réalisations) : chaque carte mène à sa page projet ; révélation des images
// et contour or au survol / focus gérés par lib/motion/results.ts sur la section parente.
// eagerFirst : la première image est l'élément principal de la page (Réalisations) → chargée en priorité.
export function ProjectCards({ className, eagerFirst = false }: { className?: string; eagerFirst?: boolean }) {
  return (
    <ul className={cn("grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16", className)}>
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
                  priority={eagerFirst && i === 0}
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
  );
}
