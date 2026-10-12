"use client";

import Link from "next/link";

import { useRef } from "react";

import { ButtonGlint, DottedLink } from "@/components/motion/dotted-link";

import { createContactScene } from "@/lib/motion/contact";
import { useMotionModule } from "@/lib/motion/use-motion-module";

// Contact (C10) : la conclusion du récit. La ligne unique du Process s'est redivisée en 3 fibres, qui convergent
// vers un seul point, le bouton « Démarrer un projet » (terminus). Quand les 3 impulsions arrivent, il s'allume.
// Le bouton est un lien normal, cliquable et lisible dès le premier rendu (voir lib/motion/contact.ts).
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useMotionModule(ref, createContactScene);

  return (
    <section ref={ref} id="contact" className="contact py-28 md:py-44" aria-labelledby="contact-title">
      <div className="container flex flex-col items-start md:items-center md:text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-silver">Contact</p>
        <h2 id="contact-title" data-contact-title="" className="contact-title mt-4 font-display">
          Connectons votre entreprise.
        </h2>
        <p className="mt-6 max-w-md">
          [à adapter] Un premier échange de 30 minutes, sans engagement, pour parler de votre activité et de vos
          priorités.
        </p>

        <div className="contact-cta mt-14 md:mt-16">
          {/* Halo statique : seule son opacité varie, une fois, à l'allumage. */}
          <span data-contact-halo="" className="contact-halo" aria-hidden="true" />
          <Link href="/contact" data-contact-button="" data-fiber-ignore="" data-magnetic="" className="contact-button">
            <span data-contact-fill="" className="contact-button__fill" aria-hidden="true" />
            <ButtonGlint />
            <svg className="contact-button__outline" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="contact-gold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" className="maps-stop-1" />
                  <stop offset="0.52" className="maps-stop-2" />
                  <stop offset="1" className="maps-stop-3" />
                </linearGradient>
              </defs>
              <rect
                data-contact-outline=""
                className="contact-button__outline-rect"
                width="100%"
                height="100%"
                rx="28"
                pathLength="1"
                stroke="url(#contact-gold)"
              />
            </svg>
            <span className="contact-button__label">Démarrer un projet</span>
            <span data-contact-lit-label="" className="contact-button__label contact-button__label--lit" aria-hidden="true">
              Démarrer un projet
            </span>
          </Link>

          {/* Terminus des fibres. Desktop : couloir à droite du bouton où les 3 fibres convergent à 45° sur un
              seul point, son bord droit. Mobile : la fibre composite se termine sur son bord gauche. */}
          <span
            data-fiber-anchor="contact-in"
            data-fiber="all"
            data-fiber-mode="end"
            data-fiber-axis="x"
            data-fiber-merge=""
            className="contact-fiber-in"
            aria-hidden="true"
          />
          <span
            data-fiber-anchor="contact-in-mobile"
            data-fiber="all"
            data-fiber-mode="end"
            className="contact-fiber-in-mobile"
            aria-hidden="true"
          />
        </div>

        <p className="mt-10 text-sm text-silver">
          ou écrivez-nous :{" "}
          <DottedLink href="mailto:contact@yonkotech.com" className="text-silver-light">
            contact@yonkotech.com
          </DottedLink>
        </p>
      </div>
    </section>
  );
}
