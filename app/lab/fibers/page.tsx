import type { Metadata } from "next";

import { FiberStage } from "@/components/motion/fiber-stage";
import heroPorts from "@/lib/motion/hero-ports.json";

import { FiberLabHud } from "./fiber-lab-hud";

export const metadata: Metadata = {
  title: "Lab · FiberSystem",
  robots: { index: false, follow: false },
};

// Page de démo du FiberSystem (C1) : 6 sections vides et leurs ancres, pour tester le routage seul.
// ?debug=1 affiche obstacles, points d'ancrage et collisions.

type PortSet = { A: number[]; B: number[]; C: number[] };

function Ports({ ports, className }: { ports: PortSet; className: string }) {
  return (
    <div className={className}>
      {Object.entries(ports).map(([id, [x, y]]) => (
        <span
          key={id}
          className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-silver"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="text-sm uppercase tracking-[0.2em] text-silver">{children}</p>;
}

export default async function FiberLabPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { debug } = await searchParams;

  return (
    <>
      <FiberStage debug={debug === "1"}>
        {/* 1. Hero : l'origine des fibres = les 3 ports de la vidéo */}
        <section className="container pb-8 pt-10">
          <Placeholder>01 · Hero</Placeholder>
          <h1 className="section-heading mt-3 max-w-xl">Lab FiberSystem</h1>
          <div
            data-fiber-origin=""
            className="relative mx-auto mt-10 aspect-[9/16] w-3/4 max-w-xs rounded-md border border-dashed border-border md:aspect-video md:w-full md:max-w-4xl"
          >
            <Ports ports={heroPorts.desktop.ports} className="absolute inset-0 hidden md:block" />
            <Ports ports={heroPorts.mobile.ports} className="absolute inset-0 md:hidden" />
          </div>
          <div className="relative h-24">
            <span data-fiber-anchor="hero-out" data-fiber="all" className="absolute right-0 top-1/2 size-px" />
          </div>
        </section>

        {/* 2. Manifeste : chaque fibre passe derrière sa ligne */}
        <section className="container py-24">
          <Placeholder>02 · Manifeste</Placeholder>
          <div className="mt-10 space-y-4">
            {[
              ["A", "manifesto-a", "Être vu."],
              ["B", "manifesto-b", "Être trouvé."],
              ["C", "manifesto-c", "Être efficace."],
            ].map(([fiber, id, line]) => (
              <div key={id} className="relative py-4" data-fiber-through="">
                <span data-fiber-anchor={id} data-fiber={fiber} data-fiber-axis="x" className="absolute inset-x-0 top-1/2 h-px" />
                <p className="text-center font-display text-5xl text-silver-light md:text-7xl">{line}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-md text-center">
            [à adapter] Deux lignes de texte sous la phrase, pour vérifier que les fibres l&apos;évitent.
          </p>
        </section>

        {/* 3. Stratégie : 3 rails parallèles */}
        <section className="container py-24">
          <div className="relative h-16">
            <span data-fiber-anchor="strategy-rails" data-fiber="all" data-fiber-axis="x" className="absolute inset-x-0 top-1/2 h-px" />
          </div>
          <div className="mt-10">
            <Placeholder>03 · Stratégie</Placeholder>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:pr-14">
            {["Audit", "Plan", "Pilotage"].map((step) => (
              <div key={step}>
                <h3 className="font-display text-3xl">{step}</h3>
                <p className="mt-2 max-w-[16rem]">[à adapter] Description courte de l&apos;étape.</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Expertises : une scène par fibre ; zone de dédoublement sur mobile */}
        <section data-fiber-split="" className="py-24 pl-16 md:pl-0">
          <div className="container">
            <Placeholder>04 · Expertises</Placeholder>
            {[
              ["A", "expertise-seo", "Site vitrine et SEO", "md:left-[20%]"],
              ["B", "expertise-maps", "Google Maps", "md:left-[45%]"],
              ["C", "expertise-software", "Logiciel sur mesure", "md:left-[70%]"],
            ].map(([fiber, id, title, x], i) => (
              <div key={id} className="grid min-h-[60vh] items-center gap-10 py-10 md:grid-cols-2">
                <div>
                  <p className="text-sm text-silver">0{i + 1} / 03</p>
                  <h3 className="mt-2 font-display text-4xl">{title}</h3>
                  <p className="mt-3 max-w-sm">[à adapter] Texte de la scène.</p>
                </div>
                <div className="relative h-56 rounded-md border border-dashed border-border md:h-72">
                  <span
                    data-fiber-anchor={id}
                    data-fiber={fiber}
                    data-fiber-mode="plug"
                    className={`absolute left-1/2 top-1/2 size-px ${x}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Résultats : les fibres se rejoignent en marge droite */}
        <section className="container py-24">
          <div className="relative h-10">
            <span data-fiber-anchor="results" data-fiber="all" className="absolute right-0 top-1/2 size-px" />
          </div>
          <Placeholder>05 · Résultats</Placeholder>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {["+240 %", "Top 3", "12 h"].map((n) => (
              <div key={n}>
                <p className="font-display text-6xl text-silver-light">{n}</p>
                <p className="mt-2">[à remplacer] Chiffre clé</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 md:pr-16">
            {[1, 2].map((n) => (
              <div key={n} data-fiber-avoid="" className="aspect-[4/3] rounded-md border border-dashed border-border" />
            ))}
          </div>
        </section>

        {/* 6a. Process : timeline centrale */}
        <section className="container py-24">
          <Placeholder>06 · Process</Placeholder>
          <div className="relative mt-12">
            <span data-fiber-anchor="process" data-fiber="all" data-fiber-axis="y" className="absolute inset-y-0 left-1/2 w-px" />
            {["Échange", "Stratégie", "Création", "Suivi"].map((step, i) => (
              <div key={step} className="grid py-10 pl-16 md:grid-cols-2 md:pl-0">
                <div className={i % 2 ? "md:col-start-2 md:pl-16" : "md:pr-16 md:text-right"}>
                  <h3 className="font-display text-3xl">{step}</h3>
                  <p className="mt-2">[à adapter] Détail de l&apos;étape.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6b. Contact : convergence vers le bouton */}
        <section className="container pb-40 pt-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="section-heading">Connectons votre entreprise.</h2>
              <p className="mt-4 max-w-sm">[à adapter] Phrase d&apos;accompagnement.</p>
            </div>
            <div className="flex justify-start md:justify-center">
              <a
                href="#"
                data-fiber-anchor="contact-cta"
                data-fiber="all"
                data-fiber-mode="end"
                className="relative inline-flex rounded-full border border-silver bg-black px-8 py-4 text-silver-light"
              >
                Démarrer un projet
              </a>
            </div>
          </div>
        </section>
      </FiberStage>
      <FiberLabHud />
    </>
  );
}
