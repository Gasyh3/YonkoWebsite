import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonGlint, DottedLink } from "@/components/motion/dotted-link";
import { SkeletonImage } from "@/components/ui/skeleton";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { getProject, projects } from "@/lib/results-data";
import { pageMetadata } from "@/lib/site";

// Page projet (C11) : son visuel d'en-tête reçoit l'image de la carte cliquée (View Transition « project-media »,
// voir lib/motion/page-transitions.ts). Cas d'usage présentés comme tels, en attendant de vraies réalisations.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projet" };
  return pageMetadata({
    title: project.title,
    description: project.situation,
    path: `/projets/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const sections = [
    { title: "La situation", text: project.situation },
    { title: "Ce que nous mettons en place", text: project.approach },
    { title: "Ce que l'on suit", text: project.tracking },
  ];

  return (
    <article className="container py-16 md:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Cas d'usage", path: "/projets" },
          { name: project.title, path: `/projets/${project.slug}` },
        ])}
      />
      <DottedLink href="/projets" className="text-xs uppercase tracking-[0.24em] text-silver">
        ← Tous les cas d&apos;usage
      </DottedLink>

      <header className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver">
            Cas d&apos;usage · {project.service} · {project.sector}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.02] md:text-7xl">{project.title}</h1>
        </div>
        <p className="text-sm md:max-w-xs md:text-right">{project.result}</p>
      </header>

      <div className="project-hero__media skeleton mt-12">
        <SkeletonImage
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
        {sections.map((section) => (
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
        <DottedLink href="/projets" className="text-sm text-silver">
          Voir les autres cas d&apos;usage
        </DottedLink>
      </div>
    </article>
  );
}
