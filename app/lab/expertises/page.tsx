import type { Metadata } from "next";

import { FiberStage } from "@/components/motion/fiber-stage";
import { MapsScene } from "@/components/sections/expertises/maps-scene";

export const metadata: Metadata = {
  title: "Lab · Expertises",
  robots: { index: false, follow: false },
};

// Banc d'essai des scènes Expertises, hors conteneur épinglé (C5) : chaque scène est pilotée par
// le défilement de sa propre section. Seule la fibre B est câblée jusqu'à la scène Maps (C6).
// ?debug=1 affiche obstacles, ancres et collisions du FiberSystem.
export default async function ExpertisesLabPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { debug } = await searchParams;

  return (
    <FiberStage debug={debug === "1"}>
      <section className="container pb-10 pt-12">
        <p className="text-xs uppercase tracking-[0.24em] text-silver">Lab · Expertises</p>
        <h1 className="section-heading mt-3 max-w-xl">Scène 02 — Google Maps</h1>
        <p className="mt-4 max-w-md">Faites défiler : la fibre B rejoint le plan et le dessine.</p>
        <div
          data-fiber-origin=""
          className="relative mx-auto mt-10 aspect-[9/16] w-1/2 max-w-[12rem] rounded-md border border-dashed border-border md:landscape:aspect-video md:landscape:w-full md:landscape:max-w-xl"
        />
        <div className="relative h-24">
          {/* A et C s'arrêtent ici : seule la fibre B poursuit vers la scène. */}
          <span data-fiber-anchor="lab-out-ac" data-fiber="A C" data-fiber-mode="end" className="absolute right-0 top-1/2 size-px" />
        </div>
      </section>

      <div className="h-[40vh]" />

      <div data-fiber-split="" className="pl-16 md:pl-0">
        <MapsScene />
      </div>

      <section className="container pb-40 pt-24">
        <div className="flex justify-start md:justify-center">
          <a
            href="#"
            data-fiber-anchor="lab-end"
            data-fiber="B"
            data-fiber-mode="end"
            className="inline-flex rounded-full border border-silver px-8 py-4 text-silver-light"
          >
            Démarrer un projet
          </a>
        </div>
      </section>
    </FiberStage>
  );
}
