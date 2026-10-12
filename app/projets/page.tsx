import type { Metadata } from "next";

import { pageMetadata } from "@/lib/site";

import { ProjectsIndex } from "@/components/pages/projects-index";

export const metadata: Metadata = pageMetadata({
  title: "Réalisations",
  description: "[à adapter] Sites, fiches Google et logiciels réalisés pour des PME, commerçants et artisans.",
  path: "/projets",
});

export default function ProjectsPage() {
  return (
    <div className="container py-16 md:py-24 md:pr-[calc(2.75rem+1.5rem)]">
      <p className="text-xs uppercase tracking-[0.24em] text-silver">Réalisations</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] md:text-7xl">
        [à adapter] Ils nous ont confié leur visibilité.
      </h1>
      <p className="mt-6 max-w-xl">
        [à adapter] Commerces, artisans, cabinets : chaque projet part d&apos;un besoin concret et se mesure à ses
        résultats.
      </p>
      <div className="mt-16 md:mt-24">
        <ProjectsIndex />
      </div>
    </div>
  );
}
