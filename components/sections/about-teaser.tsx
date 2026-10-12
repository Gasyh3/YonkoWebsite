"use client";

import Link from "next/link";
import { useRef } from "react";

import { ButtonGlint } from "@/components/motion/dotted-link";
import { createAboutScene } from "@/lib/motion/about";
import { useMotionModule } from "@/lib/motion/use-motion-module";

const FACTS = [
  "[à adapter] Basés à [ville], on se déplace chez vous",
  "[à adapter] Un seul interlocuteur, du premier appel au suivi",
  "[à adapter] Depuis [année], pour des PME et indépendants",
];

// Repère du SVG : 240 × 300. A et C arrivent à 45°, B à la verticale ; jonction en (120, 150), puis un seul fil.
const J = { x: 120, y: 150 };
const BRANCHES = [
  `M30 60L${J.x} ${J.y}`, // A
  `M${J.x} 30V${J.y}`, // B
  `M210 60L${J.x} ${J.y}`, // C
];
const STEM = `M${J.x} ${J.y}V280`;

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

        <figure data-about-mark="" className="about-mark">
          <svg viewBox="0 0 240 300" className="about-mark__svg" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="about-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" className="maps-stop-1" />
                <stop offset="0.52" className="maps-stop-2" />
                <stop offset="1" className="maps-stop-3" />
              </linearGradient>
              {[...BRANCHES, STEM].map((d, i) => (
                <mask key={i} id={`about-mask-${i}`} maskUnits="userSpaceOnUse" x="-20" y="-20" width="280" height="340">
                  <path
                    {...(i < BRANCHES.length ? { "data-about-branch-mask": "" } : { "data-about-stem-mask": "" })}
                    className="about-mark__mask"
                    d={d}
                  />
                </mask>
              ))}
            </defs>
            {BRANCHES.map((d, i) => (
              <path key={i} d={d} mask={`url(#about-mask-${i})`} className="about-mark__fiber" />
            ))}
            <path d={STEM} mask={`url(#about-mask-${BRANCHES.length})`} className="about-mark__fiber about-mark__fiber--stem" />
            <path data-about-pulse="" d={STEM} className="about-mark__pulse" stroke="url(#about-gold)" />
            <circle data-about-ring="" cx={J.x} cy={J.y} r="7" className="about-mark__ring" />
            <circle data-about-node="" cx={J.x} cy={J.y} r="6" fill="url(#about-gold)" />
          </svg>
          <figcaption className="mt-6 text-center text-xs uppercase tracking-[0.24em] text-silver">
            Trois expertises, une seule équipe
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
