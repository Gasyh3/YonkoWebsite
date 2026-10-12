import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonGlint, DottedLink } from "@/components/motion/dotted-link";
import { getProject, projects } from "@/lib/results-data";

// Page projet (C11) : son visuel d'en-tête reçoit l'image de la carte cliquée (View Transition « project-media »,
// voir lib/motion/page-transitions.ts). Contenus provisoires : [à remplacer].
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title} · Yonko Tech Consulting` : "Projet · Yonko Tech Consulting" };
}

const SECTIONS = [
  {
    title: "Le contexte",
    text: "[à remplacer] Qui est le client, ce qui le freinait, ce qu'il attendait de nous.",
  },
  {
    title: "Ce que nous avons fait",
    text: "[à remplacer] Les choix de stratégie, ce qui a été construit et pourquoi, dans les mots du client.",
  },
  {
    title: "Le résultat",
    text: "[à remplacer] Les chiffres mesurés après la mise en ligne, et ce qu'ils changent au quotidien.",
  },
];

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="container py-16 md:py-24">
      <DottedLink href="/#projets" className="text-xs uppercase tracking-[0.24em] text-silver">
        ← Tous les projets
      </DottedLink>

      <header className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver">
            {project.service} · {project.sector}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.02] md:text-7xl">{project.title}</h1>
        </div>
        <p className="text-sm md:max-w-xs md:text-right">{project.result}</p>
      </header>

      <div className="project-hero__media mt-12">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          sizes="(min-width: 1200px) 1112px, 100vw"
          unoptimized
          priority
        />
      </div>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-3xl">{section.title}</h2>
            <p className="mt-4">{section.text}</p>
          </section>
        ))}
      </div>

      <div className="mt-20 flex flex-wrap items-center gap-8 md:mt-28">
        <Link
          href="/contact"
          data-magnetic=""
          className="relative inline-flex items-center rounded-full border border-silver px-6 py-3 text-sm text-silver-light"
        >
          <ButtonGlint />
          Démarrer un projet
        </Link>
        <DottedLink href="/#projets" className="text-sm text-silver">
          Voir les autres projets
        </DottedLink>
      </div>
    </article>
  );
}
