import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonGlint, DottedLink } from "@/components/motion/dotted-link";
import { CtaBand } from "@/components/page/cta-band";
import { ExpertiseDemo } from "@/components/pages/expertise-demo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { expertises, getExpertise, nextExpertise } from "@/lib/expertises-data";
import { pageMetadata } from "@/lib/site";

// Page d'une expertise (contenus fictifs [à adapter]) : promesse, visualisation animée reprise de l'accueil,
// contenu de l'offre, profils, déroulé, puis l'action « Démarrer un projet ».
export function generateStaticParams() {
  return expertises.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getExpertise(slug);
  if (!item) return { title: "Expertise" };
  return pageMetadata({ title: item.title, description: item.summary, path: `/expertises/${item.slug}` });
}

export default async function ExpertisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getExpertise(slug);
  if (!item) notFound();
  const next = nextExpertise(slug);

  return (
    <article>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Expertises", path: "/expertises" },
          { name: item.title, path: `/expertises/${item.slug}` },
        ])}
      />
      <header className="container pb-8 pt-16 md:pt-24">
        <nav aria-label="Fil d'Ariane" className="text-xs uppercase tracking-[0.24em] text-silver">
          <DottedLink href="/expertises">Expertises</DottedLink>
          <span aria-hidden="true"> / </span>
          <span>{item.index}</span>
        </nav>
        <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] md:text-7xl">{item.title}</h1>
        <p className="mt-4 font-display text-2xl md:text-3xl">
          <span className="text-gold">{item.promise}</span>
        </p>
        <p className="mt-8 max-w-2xl md:text-lg">{item.lead}</p>
        <div className="mt-10">
          <Link
            href="/contact"
            data-magnetic=""
            className="relative inline-flex items-center rounded-full border border-silver px-6 py-3 text-sm text-silver-light"
          >
            <ButtonGlint />
            Démarrer un projet
          </Link>
        </div>
      </header>

      {item.scene ? <ExpertiseDemo scene={item.scene} /> : null}

      <section className="container py-16 md:py-24" aria-labelledby="includes-title">
        <h2 id="includes-title" className="font-display text-3xl md:text-5xl">
          Ce que comprend l&apos;offre
        </h2>
        <ul className="expertise-grid mt-10 md:mt-14">
          {item.includes.map((entry) => (
            <li key={entry.title} className="expertise-grid__item">
              <h3 className="font-display text-2xl">{entry.title}</h3>
              <p className="mt-3 text-sm md:text-base">{entry.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container py-16 md:py-24" aria-labelledby="audiences-title">
        <h2 id="audiences-title" className="font-display text-3xl md:text-5xl">
          Pour qui
        </h2>
        <ul className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3">
          {item.audiences.map((entry) => (
            <li key={entry.title}>
              <p className="text-xs uppercase tracking-[0.24em] text-silver">{entry.title}</p>
              <p className="mt-3">{entry.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container py-16 md:py-24" aria-labelledby="steps-title">
        <h2 id="steps-title" className="font-display text-3xl md:text-5xl">
          Comment ça se passe
        </h2>
        <ol className="expertise-steps mt-10 md:mt-14">
          {item.steps.map((step, i) => (
            <li key={step.title} className="expertise-steps__item">
              <span className="expertise-steps__node" aria-hidden="true" />
              <p className="text-xs tracking-[0.24em] text-silver">
                {String(i + 1).padStart(2, "0")} · {step.duration}
              </p>
              <h3 className="mt-2 font-display text-2xl text-silver-light">{step.title}</h3>
              <p className="mt-2 text-sm md:text-base">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand title="[à adapter] On en parle ?">
        <DottedLink href={`/expertises/${next.slug}`} className="text-sm text-silver">
          Expertise suivante : {next.title} →
        </DottedLink>
      </CtaBand>
    </article>
  );
}
