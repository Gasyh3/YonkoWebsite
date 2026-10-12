"use client";

import { useRef } from "react";

import { createProcessScene } from "@/lib/motion/process";
import { useMotionModule } from "@/lib/motion/use-motion-module";

const STEPS = [
  {
    id: "process-echange",
    title: "Échange",
    text: "[à adapter] Un premier rendez-vous pour comprendre votre activité, vos clients et ce qui vous fait perdre du temps.",
  },
  {
    id: "process-strategie",
    title: "Stratégie",
    text: "[à adapter] On fixe les priorités : ce qui sera construit, dans quel ordre, et comment on mesurera le résultat.",
  },
  {
    id: "process-creation",
    title: "Création",
    text: "[à adapter] Site, fiche Google, logiciel : on construit, vous validez à chaque étape, sans jargon.",
  },
  {
    id: "process-suivi",
    title: "Suivi",
    text: "[à adapter] Après la mise en ligne, on reste là : mesures, ajustements et un point régulier ensemble.",
  },
] as const;

// Process (C9) : les 3 fibres fusionnent en une ligne verticale centrée (ancre data-fiber-merge) qui devient
// la timeline. Chaque étape est une jonction : son nœud s'allume en or au passage de l'impulsion
// (voir lib/motion/process.ts). Mobile : la fibre composite à gauche, toutes les étapes à droite.
export function Process() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createProcessScene);

  return (
    <section ref={ref} className="process py-24 md:py-36" aria-labelledby="process-title">
      <div className="container relative">
        {/* En-tête à gauche, en retrait de la ligne centrale (couloir des fibres). */}
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.24em] text-silver">Process</p>
          <h2 id="process-title" className="mt-4 font-display text-4xl leading-[1.04] md:text-6xl">
            [à adapter] Quatre étapes, un seul interlocuteur.
          </h2>
        </div>

        <ol className="process-steps relative mt-16 md:mt-24">
          {/* La timeline : les fibres fusionnent ici en une seule ligne centrée. */}
          <span
            data-fiber-anchor="process-line"
            data-fiber="all"
            data-fiber-axis="y"
            data-fiber-merge=""
            className="process-line"
            aria-hidden="true"
          />
          {STEPS.map((step, i) => (
            <li
              key={step.id}
              data-process-step={step.id}
              className={`process-step ${i % 2 ? "process-step--right" : "process-step--left"}`}
            >
              {/* Jonction : nœud de 10px sur la ligne (desktop) ou sur la fibre composite (mobile). */}
              <span
                data-process-node=""
                data-fiber-checkpoint={step.id}
                data-fiber="A"
                className="process-node"
                aria-hidden="true"
              >
                <span data-process-ring="" className="process-node__ring" />
                <span data-process-lit="" className="process-node__lit" />
              </span>
              <div data-process-copy="" className="process-step__copy">
                <p className="text-xs tracking-[0.24em] text-silver">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-display text-3xl text-silver-light md:text-4xl">{step.title}</h3>
                <p className="mt-3 text-sm md:text-base">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Sous la timeline, les fibres se séparent et rejoignent la marge droite. */}
        <span data-fiber-anchor="process-out" data-fiber="all" className="process-fiber-out" aria-hidden="true" />
      </div>
    </section>
  );
}
