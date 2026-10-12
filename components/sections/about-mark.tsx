"use client";

import { useId, useRef } from "react";

import { createAboutScene } from "@/lib/motion/about";
import { useMotionModule } from "@/lib/motion/use-motion-module";

// Repère du SVG : 240 × 300. A et C arrivent à 45°, B à la verticale ; jonction en (120, 150), puis un seul fil.
const J = { x: 120, y: 150 };
const BRANCHES = [
  `M30 60L${J.x} ${J.y}`, // A
  `M${J.x} 30V${J.y}`, // B
  `M210 60L${J.x} ${J.y}`, // C
];
const STEM = `M${J.x} ${J.y}V280`;

// Marque de l'agence : trois fibres convergent en Y, « trois expertises, une seule équipe ».
// Animée par lib/motion/about.ts, branché sur la section qui la contient (ou par AboutMarkAnimated).
export function AboutMark() {
  const uid = useId().replace(/:/g, "");
  return (
    <figure data-about-mark="" className="about-mark">
      <svg viewBox="0 0 240 300" className="about-mark__svg" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className="maps-stop-1" />
            <stop offset="0.52" className="maps-stop-2" />
            <stop offset="1" className="maps-stop-3" />
          </linearGradient>
          {[...BRANCHES, STEM].map((d, i) => (
            <mask key={i} id={`${uid}-mask-${i}`} maskUnits="userSpaceOnUse" x="-20" y="-20" width="280" height="340">
              <path
                {...(i < BRANCHES.length ? { "data-about-branch-mask": "" } : { "data-about-stem-mask": "" })}
                className="about-mark__mask"
                d={d}
              />
            </mask>
          ))}
        </defs>
        {BRANCHES.map((d, i) => (
          <path key={i} d={d} mask={`url(#${uid}-mask-${i})`} className="about-mark__fiber" />
        ))}
        <path d={STEM} mask={`url(#${uid}-mask-${BRANCHES.length})`} className="about-mark__fiber about-mark__fiber--stem" />
        <path data-about-pulse="" d={STEM} className="about-mark__pulse" stroke={`url(#${uid}-gold)`} />
        <circle data-about-ring="" cx={J.x} cy={J.y} r="7" className="about-mark__ring" />
        <circle data-about-node="" cx={J.x} cy={J.y} r="6" fill={`url(#${uid}-gold)`} />
      </svg>
      <figcaption className="mt-6 text-center text-xs uppercase tracking-[0.24em] text-silver">
        Trois expertises, une seule équipe
      </figcaption>
    </figure>
  );
}

// La marque seule, avec sa propre animation (ex. en-tête de la page À propos).
export function AboutMarkAnimated({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useMotionModule(ref, createAboutScene);
  return (
    <div ref={ref} className={className}>
      <AboutMark />
    </div>
  );
}
