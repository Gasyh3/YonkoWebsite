"use client";

import Link from "next/link";
import { useRef } from "react";

import { GoldWord } from "@/components/motion/gold-word";
import { heroMedia } from "@/lib/hero-media";
import { createHeroMotion } from "@/lib/motion/hero";
import heroPorts from "@/lib/motion/hero-ports.json";
import { useMotionModule } from "@/lib/motion/use-motion-module";

// Repère statique (silhouette de l'ordinateur + ports) tant que la vidéo HyperFrames n'est pas rendue.
// Même cadrage que la vidéo (cover), donc les fibres partent exactement des ports dessinés.
function HeroPlaceholder() {
  const sets = [
    { key: "desktop", className: "hidden md:block", cfg: heroPorts.desktop, monitor: { w: 576, y: 210, h: 330 }, foot: { w: 220, h: 30 } },
    { key: "mobile", className: "md:hidden", cfg: heroPorts.mobile, monitor: { w: 500, y: 300, h: 290 }, foot: { w: 220, h: 34 } },
  ];
  return (
    <>
      {sets.map(({ key, className, cfg, monitor, foot }) => {
        const { width, height } = cfg.media;
        const ports = Object.values(cfg.ports).map(([x, y]) => ({ x: (x / 100) * width, y: (y / 100) * height }));
        const cx = ports[1].x; // l'ordinateur est centré sur le port B
        const footY = ports[0].y - foot.h / 2;
        return (
          <svg
            key={key}
            className={`hero-placeholder absolute inset-0 h-full w-full ${className}`}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <rect className="hero-placeholder__screen" x={cx - monitor.w / 2} y={monitor.y} width={monitor.w} height={monitor.h} rx="10" />
            <line className="hero-placeholder__frame" x1={cx} y1={monitor.y + monitor.h} x2={cx} y2={footY} />
            <rect className="hero-placeholder__frame" x={cx - foot.w / 2} y={footY} width={foot.w} height={foot.h} rx="6" />
            {ports.map((p, i) => (
              <circle key={i} className="hero-placeholder__port" cx={p.x} cy={p.y} r="5" />
            ))}
          </svg>
        );
      })}
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createHeroMotion);

  return (
    <section
      ref={ref}
      className="hero relative flex min-h-[calc(100svh-4rem)] flex-col justify-end overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Vidéo : sans fibres (elles sont en SVG, sous la vidéo, révélées par mix-blend lighten). */}
      <div data-hero-media="" data-fiber-origin="" className="hero-media absolute inset-0">
        {heroMedia.ready ? (
          <video
            data-hero-video=""
            className="hero-media__video h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroMedia.desktop.poster}
            data-poster-mobile={heroMedia.mobile.poster}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={heroMedia.mobile.webm} type="video/webm" media="(max-width: 767px)" />
            <source src={heroMedia.mobile.mp4} type="video/mp4" media="(max-width: 767px)" />
            <source src={heroMedia.desktop.webm} type="video/webm" />
            <source src={heroMedia.desktop.mp4} type="video/mp4" />
          </video>
        ) : (
          <HeroPlaceholder />
        )}
      </div>

      <div className="container relative pb-14 pt-[55svh] md:pb-16 md:pt-0">
        <div data-hero-copy="" className="max-w-[min(40rem,46vw)] max-md:max-w-none">
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
