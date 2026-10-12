import type { Metadata } from "next";

import { pageMetadata } from "@/lib/site";

import { DottedLink } from "@/components/motion/dotted-link";
import { CtaBand } from "@/components/page/cta-band";
import { PageHeader, SectionTitle } from "@/components/page/page-header";
import { AboutMarkAnimated } from "@/components/sections/about-mark";
import { expertises } from "@/lib/expertises-data";

export const metadata: Metadata = pageMetadata({
  title: "À propos",
  description:
    "Yonko Tech Consulting, agence web basée à Antananarivo depuis 2025 : stratégie, site vitrine, Google Maps et logiciel sur mesure, avec un seul interlocuteur.",
  path: "/about",
});

const values = [
  {
    title: "Clarté",
    description: "Des mots simples, des choix expliqués, des étapes validées avec vous. Pas de jargon pour impressionner.",
  },
  {
    title: "Honnêteté",
    description: "On ne promet que ce qui peut être tenu : ni première place garantie, ni résultat magique.",
  },
  {
    title: "Utilité",
    description: "Chaque page, chaque fonction doit servir votre activité : être vu, être trouvé, être efficace.",
  },
];

const approach = [
  {
    title: "Comprendre",
    description: "Votre métier, vos clients, ce qui vous fait perdre du temps ou des opportunités.",
  },
  {
    title: "Construire",
    description: "Un plan priorisé, puis le site, la fiche Google ou l'outil, validés étape par étape.",
  },
  {
    title: "Accompagner",
    description: "Après la mise en ligne : mesures, ajustements et évolutions, à votre rythme.",
  },
];

// Les quatre expertises (lib/expertises-data.ts), en liste à points or.
const expertiseItems = expertises.map((item) => ({ title: item.title, text: item.summary, slug: item.slug }));

// À propos : l'agence, ses valeurs, ses expertises et son approche. La marque en Y (trois fibres, un seul
// interlocuteur) ouvre la page, comme sur l'accueil.
export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="À propos"
        title="Yonko Tech Consulting"
        lead={
          <>
            <p>
              Fondée en <strong>2025</strong> à Antananarivo, Yonko Tech Consulting aide les PME, commerçants, artisans et
              professions libérales à <strong>être vus, être trouvés et gagner du temps</strong> grâce au digital.
            </p>
            <p className="text-sm md:text-base">
              Notre point de départ : beaucoup d&apos;entreprises font du très bon travail mais restent invisibles en
              ligne, ou perdent un temps précieux dans des outils qui ne se parlent pas. Nous partons de votre
              activité, et construisons seulement ce qui vous sert.
            </p>
          </>
        }
        aside={<AboutMarkAnimated className="hidden md:block" />}
      />

      <section className="container py-16 md:py-24" aria-labelledby="values-title">
        <SectionTitle id="values-title" eyebrow="Ce qui nous guide">
          Ce qui nous guide au quotidien
        </SectionTitle>
        <ul className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3">
          {values.map((value) => (
            <li key={value.title} className="value-item">
              <span className="value-item__node" aria-hidden="true" />
              <h3 className="font-display text-2xl text-silver-light">{value.title}</h3>
              <p className="mt-3 text-sm md:text-base">{value.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container py-16 md:py-24" aria-labelledby="expertise-title">
        <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
          <div>
            <SectionTitle id="expertise-title" eyebrow="Ce que nous faisons">
              Notre expertise
            </SectionTitle>
            <DottedLink href="/expertises" className="mt-8 text-sm text-silver">
              Voir nos expertises →
            </DottedLink>
          </div>
          <ul className="dot-list">
            {expertiseItems.map((item) => (
              <li key={item.title}>
                <DottedLink href={`/expertises/${item.slug}`}>
                  <strong>{item.title}</strong>
                </DottedLink>{" "}
                : {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container py-16 md:py-24" aria-labelledby="approach-title">
        <SectionTitle id="approach-title" eyebrow="Comment nous travaillons">
          Notre approche
        </SectionTitle>
        <ol className="expertise-steps mt-10 md:mt-14">
          {approach.map((step, i) => (
            <li key={step.title} className="expertise-steps__item">
              <span className="expertise-steps__node" aria-hidden="true" />
              <p className="text-xs tracking-[0.24em] text-silver">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-2xl text-silver-light">{step.title}</h3>
              <p className="mt-2 text-sm md:text-base">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container py-16 md:py-24" aria-labelledby="remote-title">
        <div className="panel">
          <SectionTitle id="remote-title" eyebrow="Où nous travaillons">
            Basés à Antananarivo, disponibles partout
          </SectionTitle>
          <p className="mt-4 max-w-2xl">
            Nous travaillons à distance avec des entreprises à Madagascar et ailleurs : échanges en visio, par téléphone
            ou par e-mail, validations en ligne, et une réponse sous 24h à chaque demande.
          </p>
        </div>
      </section>

      <CtaBand title="Parlons de votre activité." text="Un premier échange pour comprendre votre contexte et vos priorités.">
        <DottedLink href="/expertises" className="text-sm text-silver">
          Voir nos expertises →
        </DottedLink>
      </CtaBand>
    </div>
  );
}
