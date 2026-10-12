import type { Metadata } from "next";

import { pageMetadata } from "@/lib/site";

import { ProjectsIndex } from "@/components/pages/projects-index";

export const metadata: Metadata = pageMetadata({
  title: "Cas d'usage",
  description:
    "Boulangerie, garage, cabinet, institut : quatre situations courantes à Madagascar et ce que nous mettons en place, du site vitrine à la fiche Google et au logiciel.",
  path: "/projets",
});

export default function ProjectsPage() {
  return (
    <div className="container py-16 md:py-24 md:pr-[calc(2.75rem+1.5rem)]">
      <p className="text-xs uppercase tracking-[0.24em] text-silver">Cas d&apos;usage</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] md:text-7xl">
        Ce que nous mettons en place, selon les métiers.
      </h1>
      <p className="mt-6 max-w-xl">
        Commerces, artisans, cabinets : chaque projet part d&apos;un besoin concret. Ces exemples décrivent des
        situations courantes et la façon dont nous y répondons.
      </p>
      <div className="mt-16 md:mt-24">
        <ProjectsIndex />
      </div>
    </div>
  );
}
