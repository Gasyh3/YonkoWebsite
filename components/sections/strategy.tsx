"use client";

import { useRef } from "react";

import { createStrategyScene } from "@/lib/motion/strategy";
import { useMotionModule } from "@/lib/motion/use-motion-module";

const STEPS = [
  {
    id: "strategy-audit",
    index: "01",
    title: "Audit",
    text: "[à adapter] On regarde où vous en êtes : site, fiche Google, outils, concurrents. Ce qui marche, ce qui freine.",
  },
  {
    id: "strategy-plan",
    index: "02",
    title: "Plan",
    text: "[à adapter] Une feuille de route claire : quoi construire, dans quel ordre, pour quel résultat attendu.",
  },
  {
    id: "strategy-pilotage",
    index: "03",
    title: "Pilotage",
    text: "[à adapter] On mesure, on ajuste, on vous rend compte chaque mois. La stratégie vit avec votre activité.",
  },
] as const;

// Stratégie (C4) : les 3 fibres deviennent les rails parallèles d'un plan d'architecte ; chaque étape
// s'allume quand l'impulsion passe sous elle (voir lib/motion/strategy.ts).
export function Strategy() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createStrategyScene);

  return (
    <section ref={ref} data-ambient="" className="strategy relative py-24 md:py-36" aria-labelledby="strategy-title">
      <div className="strategy-grid" aria-hidden="true" />

      {/* Le texte est décalé de 56px (md) : les fibres descendent le long du bord gauche du conteneur. */}
      <div className="container relative">
        <div className="max-w-2xl md:pl-14">
          <p className="text-xs uppercase tracking-[0.24em] text-silver">La méthode</p>
          <h2
            id="strategy-title"
            data-ambient-target=""
            className="mt-4 font-display text-4xl leading-[1.04] md:text-6xl"
          >
            [à adapter] Une <span className="text-gold">stratégie</span> d&apos;abord, les outils ensuite.
          </h2>
          <p className="mt-6 max-w-lg">
            [à adapter] Avant de construire quoi que ce soit, on pose le plan. Chaque site, chaque fiche, chaque
            logiciel en découle.
          </p>
        </div>

        <ol data-ambient-target="" className="strategy-steps mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10 md:pl-14">
          {STEPS.map((step) => (
            <li key={step.id} data-strategy-step={step.id} className="strategy-step">
              {/* Nœud sur le rail central (desktop) ou sur la fibre composite (mobile). */}
              <span
                data-strategy-node=""
                data-fiber-checkpoint={step.id}
                data-fiber="B"
                className="strategy-node"
                aria-hidden="true"
              >
                <span className="strategy-node__lit" />
              </span>
              <div data-strategy-copy="">
                <p className="text-xs tracking-[0.24em] text-silver">{step.index}</p>
                <h3 className="mt-3 font-display text-3xl text-silver-light md:text-4xl">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm md:text-base">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Les 3 rails : les fibres entrent par la gauche (sortie du Manifeste) et traversent le plan. */}
        <div className="strategy-rails" aria-hidden="true">
          <span data-fiber-anchor="strategy-rails" data-fiber="all" data-fiber-axis="x" className="strategy-rails__anchor" />
        </div>

        {/* Puis rejoignent la marge droite pour la suite de la page. */}
        <span data-fiber-anchor="strategy-out" data-fiber="all" className="strategy-fiber-out" />
      </div>
    </section>
  );
}
