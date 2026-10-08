"use client";

import { useRef } from "react";

import { createManifestoScene } from "@/lib/motion/manifesto";
import { useMotionModule } from "@/lib/motion/use-motion-module";

const LINES = [
  { fiber: "A", anchor: "manifesto-a", text: "Être vu." },
  { fiber: "B", anchor: "manifesto-b", text: "Être trouvé." },
  { fiber: "C", anchor: "manifesto-c", text: "Être efficace." },
] as const;

// Manifeste (C3) : chaque fibre passe derrière sa ligne et l'allume (voir lib/motion/manifesto.ts).
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createManifestoScene);

  return (
    <section ref={ref} data-ambient="" className="manifesto py-28 md:py-40" aria-labelledby="manifesto-title">
      <div className="container relative pb-16 md:pb-20">
        <h2
          id="manifesto-title"
          aria-label={LINES.map((l) => l.text).join(" ")}
          className="manifesto-phrase font-display text-center"
        >
          {LINES.map((line, i) => (
            <span
              key={line.anchor}
              className="manifesto-line"
              data-manifesto-line={line.anchor}
              data-fiber-through=""
              data-ambient-target={i !== 1 ? "" : undefined}
            >
              {/* La fibre traverse toute la largeur du conteneur, derrière le texte. */}
              <span
                data-fiber-anchor={line.anchor}
                data-fiber={line.fiber}
                data-fiber-axis="x"
                className="manifesto-line__anchor"
                aria-hidden="true"
              />
              <span className="manifesto-line__text" aria-hidden="true">
                <span className="manifesto-line__base">{line.text}</span>
                <span data-manifesto-lit="" className={`manifesto-line__lit manifesto-line__lit--${line.fiber}`}>
                  {line.text}
                </span>
              </span>
            </span>
          ))}
        </h2>

        <p data-manifesto-paragraph="" className="mx-auto mt-14 max-w-md text-center text-base md:text-lg">
          [à adapter] Trois promesses, une seule stratégie : on construit votre présence en ligne pour qu&apos;elle
          vous amène des clients, pas seulement des visiteurs.
        </p>

        {/* Les 3 fibres repartent par la gauche vers les rails de la Stratégie. */}
      </div>
    </section>
  );
}
