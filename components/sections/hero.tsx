"use client";

import Link from "next/link";
import { useRef } from "react";

import { GoldWord } from "@/components/motion/gold-word";
import { HERO_PORTRAIT_QUERY, heroMedia } from "@/lib/hero-media";
import { createHeroMotion } from "@/lib/motion/hero";
import { useMotionModule } from "@/lib/motion/use-motion-module";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createHeroMotion);

  return (
    <section
      ref={ref}
      className="hero relative flex min-h-[calc(100svh-4rem)] flex-col justify-end overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Vidéo HyperFrames (video/hero) : sans fibres, elles sont en SVG sous la vidéo (mix-blend lighten). */}
      <div data-hero-media="" data-fiber-origin="" className="hero-media absolute inset-0">
        <video
          data-hero-video=""
          className="hero-media__video h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
          poster={heroMedia.desktop.poster}
          data-poster-mobile={heroMedia.mobile.poster}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={heroMedia.mobile.webm} type="video/webm" media={HERO_PORTRAIT_QUERY} />
          <source src={heroMedia.mobile.mp4} type="video/mp4" media={HERO_PORTRAIT_QUERY} />
          <source src={heroMedia.desktop.webm} type="video/webm" />
          <source src={heroMedia.desktop.mp4} type="video/mp4" />
        </video>
      </div>

      <div className="container relative pb-14 pt-[55svh] md:pb-16 md:pt-0">
        <div data-hero-copy="" className="max-w-[min(38rem,40vw)] max-md:max-w-none">
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-silver">
            Agence web &amp; communication [à adapter]
          </p>
          <h1 id="hero-title" data-hero-title="" className="hero-title font-display text-[2.6rem] leading-[1.04] md:text-6xl lg:text-7xl">
            Votre <GoldWord>stratégie</GoldWord> digitale, du premier clic au premier{" "}
            <span className="whitespace-nowrap">
              <GoldWord>client</GoldWord>.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base md:text-lg">
            [à adapter] Site vitrine, Google Maps et logiciel sur mesure, pilotés par une seule stratégie.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-silver px-6 py-3 text-sm text-silver-light transition-colors hover:border-silver-light"
            >
              Démarrer un projet
            </Link>
            <div data-hero-indicator="" className="hero-indicator" aria-hidden="true">
              <span data-hero-indicator-dot="" className="hero-indicator__dot" />
            </div>
          </div>
        </div>
        {/* Les 3 fibres quittent le hero par la marge droite du conteneur. */}
        <span data-fiber-anchor="hero-out" data-fiber="all" className="hero-fiber-out" />
      </div>
    </section>
  );
}
