"use client";

import Link from "next/link";
import { useRef } from "react";

import { GoldWord } from "@/components/motion/gold-word";
import { heroMedia } from "@/lib/hero-media";
import { createHeroMotion } from "@/lib/motion/hero";
import { useMotionModule } from "@/lib/motion/use-motion-module";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createHeroMotion);

  return (
    <section
      ref={ref}
      data-ambient=""
      className="hero relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Intro (1re visite de la session) : la bande démo en plein écran, puis elle rentre dans l'écran
          de l'ordinateur. Affichée dès le premier rendu via la classe .hero-intro posée par le layout. */}
      <div data-hero-intro="" data-fiber-ignore="" className="hero-intro-overlay">
        <div data-hero-intro-bg="" className="hero-intro-overlay__bg" />
        <video
          data-hero-intro-video=""
          className="hero-intro-overlay__video"
          muted
          playsInline
          preload="none"
          poster={heroMedia.intro.poster}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={heroMedia.intro.webm} type="video/webm" />
          <source src={heroMedia.intro.mp4} type="video/mp4" />
        </video>
        <button type="button" data-hero-intro-skip="" className="hero-intro-overlay__skip">
          Passer l&apos;intro
        </button>
      </div>

      {/* Texte aligné sur le bord gauche du conteneur, ordinateur sur le bord droit, centrés verticalement. */}
      <div className="container relative grid items-center gap-10 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-12 md:py-16">
        <div data-hero-copy="" className="order-2 md:order-1">
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-silver">
            Agence web &amp; communication [à adapter]
          </p>
          <h1
            id="hero-title"
            data-hero-title=""
            data-ambient-target=""
            className="hero-title font-display text-[2.6rem] leading-[1.04] md:text-5xl lg:text-[4.25rem]"
          >
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

        {/* Vidéo HyperFrames de l'ordinateur (sans fibres : elles sont en SVG, sous la vidéo, mix-blend lighten).
            Le bord du moniteur est à 1,6 % du bord de la vidéo : la marge négative l'aligne sur le conteneur. */}
        <div className="hero-computer order-1 md:order-2">
          <div data-hero-media="" data-fiber-origin="" data-ambient-target="" className="hero-media">
            <video
              data-hero-video=""
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              preload="auto"
              poster={heroMedia.computer.poster}
              aria-hidden="true"
              tabIndex={-1}
            >
              <source src={heroMedia.computer.webm} type="video/webm" />
              <source src={heroMedia.computer.mp4} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Les 3 fibres quittent le hero par la marge droite du conteneur. */}
        <span data-fiber-anchor="hero-out" data-fiber="all" className="hero-fiber-out" />
      </div>
    </section>
  );
}
