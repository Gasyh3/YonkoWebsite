"use client";

import { type CSSProperties, useId, useRef } from "react";

import { GoldWord } from "@/components/motion/gold-word";
import { SceneShell } from "@/components/sections/expertises/scene-shell";
import { SCENE_VIEW } from "@/lib/motion/expertises/geometry";
import { SEO_BAR, SEO_CLIENT_INDEX, SEO_DOTS, SEO_OUTLINE, SEO_RESULTS } from "@/lib/motion/expertises/seo-data";
import { createSeoScene } from "@/lib/motion/expertises/seo-scene";
import { noMotion, useMotionModule } from "@/lib/motion/use-motion-module";

// Scène Expertises 01 — Site vitrine et SEO (fibre A).
// La fibre A dessine une fenêtre de navigateur ; le résultat du client monte en 1re position
// (voir lib/motion/expertises/seo-scene.ts).
// embedded : dans le conteneur Expertises (C5), qui pilote la scène et prolonge lui-même la fibre.
export function SeoScene({ embedded = false, vizOnly = false }: { embedded?: boolean; vizOnly?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");
  useMotionModule(ref, embedded ? noMotion : createSeoScene);

  return (
    <SceneShell
      ref={ref}
      scene="seo"
      index="01"
      titleId={`${uid}-title`}
      title={
        <>
          Être <span className="text-gold">vu</span>.
        </>
      }
      subtitle="Site vitrine et SEO"
      embedded={embedded}
      vizOnly={vizOnly}
      viz={
        <div
          data-expertise-viz=""
          className="seo-viz relative"
          role="img"
          aria-label="Page de résultats Google stylisée : votre entreprise passe de la 4e à la 1re position"
        >
          <svg
            data-seo-svg=""
            viewBox={`0 0 ${SCENE_VIEW.width} ${SCENE_VIEW.height}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              {[...SEO_OUTLINE, SEO_BAR].map((d, i) => (
                <mask
                  key={i}
                  id={`${uid}-line-${i}`}
                  maskUnits="userSpaceOnUse"
                  x="-20"
                  y="-20"
                  width={SCENE_VIEW.width + 40}
                  height={SCENE_VIEW.height + 40}
                >
                  <path
                    {...(i < SEO_OUTLINE.length ? { "data-seo-outline-mask": "" } : { "data-seo-bar-mask": "" })}
                    className="seo-line-mask"
                    d={d}
                  />
                </mask>
              ))}
            </defs>

            {/* Contour de la fenêtre : prolonge la fibre A (pointillés de la même grammaire). */}
            {SEO_OUTLINE.map((d, i) => (
              <path key={i} d={d} mask={`url(#${uid}-line-${i})`} className="seo-outline" />
            ))}
            <path d={SEO_BAR} mask={`url(#${uid}-line-${SEO_OUTLINE.length})`} className="seo-bar" />
            {SEO_DOTS.map((dot, i) => (
              <circle key={i} data-seo-dot="" className="seo-dot" cx={dot.x} cy={dot.y} r="3.5" />
            ))}
          </svg>

          {/* Contenu de la page : lignes argent stylisées, positionnées en % du cadre. */}
          <div className="seo-page" aria-hidden="true">
            <div data-seo-search="" className="seo-search">
              <span className="seo-search__icon" />
              <span className="seo-line seo-line--query" />
            </div>

            <ol className="seo-results">
              {SEO_RESULTS.map((result, i) => {
                const isClient = i === SEO_CLIENT_INDEX;
                return (
                  <li
                    key={i}
                    data-seo-row={isClient ? "client" : ""}
                    data-seo-slot={i}
                    className={isClient ? "seo-row seo-row--client" : "seo-row"}
                    style={{ "--slot": i } as CSSProperties}
                  >
                    {isClient ? (
                      <span className="seo-row__name">
                        <span className="seo-row__name-base">Votre entreprise</span>
                        <span data-seo-gold="" className="seo-row__name-gold">
                          <GoldWord>Votre entreprise</GoldWord>
                        </span>
                        <span data-seo-label="" className="seo-label">
                          Position 1
                        </span>
                      </span>
                    ) : (
                      <span className="seo-line seo-line--title" style={{ width: `${result.title}%` }} />
                    )}
                    <span className="seo-line seo-line--url" style={{ width: `${result.url}%` }} />
                    <span className="seo-line seo-line--text" style={{ width: `${result.text}%` }} />
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      }
    >
      Un site rapide, clair et pensé pour Google : quand un client cherche votre métier, il arrive sur une page qui
      lui répond et lui donne envie d&apos;appeler.
    </SceneShell>
  );
}
