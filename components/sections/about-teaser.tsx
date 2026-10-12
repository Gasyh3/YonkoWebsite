"use client";

import Link from "next/link";
import { useRef } from "react";

import { ButtonGlint } from "@/components/motion/dotted-link";
import { AboutMark } from "@/components/sections/about-mark";
import { createAboutScene } from "@/lib/motion/about";
import { useMotionModule } from "@/lib/motion/use-motion-module";

const FACTS = [
  "[à adapter] Basés à [ville], on se déplace chez vous",
  "[à adapter] Un seul interlocuteur, du premier appel au suivi",
  "[à adapter] Depuis [année], pour des PME et indépendants",
];

// À propos (accueil) : l'agence en quelques lignes, entre les Résultats et le Process, et un bouton vers /about.
// Animation : les trois fibres convergent en un Y, « trois expertises, une seule équipe » (lib/motion/about.ts).
export function AboutTeaser() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createAboutScene);

  return (
    <section ref={ref} id="agence" className="about-teaser py-24 md:py-36" aria-labelledby="about-title">
      {/* Retrait de 24px à droite (desktop) : la marge reste aux fibres. */}
      <div className="container grid items-center gap-14 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-20 md:pr-[calc(2.75rem+1.5rem)]">
        <div data-about-copy="">
          <p className="text-xs uppercase tracking-[0.24em] text-silver">L&apos;agence</p>
          <h2 id="about-title" className="mt-4 font-display text-4xl leading-[1.04] md:text-6xl">
            [à adapter] Une équipe à taille humaine, à côté de chez vous.
          </h2>
          <p className="mt-6 max-w-xl md:text-lg">
            [à adapter] Yonko Tech Consulting, c&apos;est une équipe qui parle votre langue : pas de jargon, des
            résultats que vous pouvez mesurer, et quelqu&apos;un qui décroche quand vous appelez.
          </p>
          <ul className="about-facts mt-8">
            {FACTS.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <div className="mt-10">
            <Link
              href="/about"
              data-magnetic=""
              className="relative inline-flex items-center rounded-full border border-silver px-6 py-3 text-sm text-silver-light"
            >
              <ButtonGlint />
              Découvrir l&apos;agence
            </Link>
          </div>
        </div>

        <AboutMark />
      </div>
    </section>
  );
}
