import type { Metadata } from "next";

import { pageMetadata } from "@/lib/site";

import { DottedLink } from "@/components/motion/dotted-link";
import { CtaBand } from "@/components/page/cta-band";
import { PageHeader, SectionTitle } from "@/components/page/page-header";
import { AboutMarkAnimated } from "@/components/sections/about-mark";

export const metadata: Metadata = pageMetadata({
  title: "À propos",
  description:
    "L'agence Yonko Tech Consulting : une seule équipe pour la stratégie, le site, la visibilité locale et le logiciel sur mesure des PME.",
  path: "/about",
});

const values = [
  {
    title: "Transparence",
    description:
      "Communication claire, jalons visibles et décisions partagées — sans jargon inutile.",
  },
  {
    title: "Exigence",
    description:
      "Qualité, sécurité, performance et UX intégrées dès le départ (pas en “phase 2”).",
  },
  {
    title: "Impact",
    description:
      "Chaque livraison est reliée à un indicateur métier : temps gagné, erreurs réduites, meilleure conversion.",
  },
];

const approach = [
  {
    title: "Découverte",
    description:
      "Comprendre vos opérations, vos objectifs business et vos contraintes terrain (process, équipes, outils).",
  },
  {
    title: "Conception",
    description:
      "Cadrage clair, architecture, UX, choix techniques et plan d’exécution pragmatique.",
  },
  {
    title: "Livraison & suivi",
    description:
      "Delivery incrémental, mesure des gains et amélioration continue (qualité, performance, adoption).",
  },
];

// Expertises v1 (contenu inchangé), présentées en liste à points or.
const expertiseItems = [
  {
    title: "ERP PME",
    text: "clients, devis, facturation, paiements, produits & stocks, achats, reporting, rôles & traçabilité.",
  },
  {
    title: "SaaS Next.js clé en main",
    text: "Stripe (paiements & abonnements), Better Auth, base de données, analytics, emails automatisés, landing, blog et documentation.",
  },
  {
    title: "SEO & rebranding",
    text: "audit, repositionnement, optimisation du contenu et des pages pour gagner en visibilité et conversion.",
  },
  {
    title: "Réseaux sociaux",
    text: "stratégie éditoriale, calendrier, création de contenus et suivi des performances.",
  },
];

const stats = [
  {
    label: "Productivité",
    value: "+18%",
    text: "Gains observés sur l’efficacité opérationnelle avec des outils type ERP et workflows standardisés.",
  },
  {
    label: "Coûts & pertes",
    value: "-10 à -30%",
    text: "Réduction des coûts opérationnels via automatisation, centralisation et meilleure traçabilité.",
  },
  {
    label: "Reporting",
    value: "x1.6",
    text: "Production de rapports et suivi d’activité accélérés grâce à une donnée fiable et accessible.",
  },
];

// À propos : l'agence, ses valeurs, son approche et ses ordres de grandeur. La marque en Y (trois fibres, une
// seule équipe) ouvre la page, comme sur l'accueil.
export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="À propos"
        title="Yonko Tech Consulting"
        lead={
          <>
            <p>
              Fondé en <strong>2025</strong>, Yonko accompagne les entreprises dans la création de{" "}
              <strong>solutions digitales B2B</strong> : ERP modulaires, SaaS clé en main (Next.js), et outils internes
              orientés productivité.
            </p>
            <p className="text-sm md:text-base">
              Notre point de départ : un constat très concret à Madagascar — beaucoup d’entreprises perdent du temps et
              de la marge à cause de processus manuels, d’outils non connectés et d’un manque de visibilité sur
              l’activité. Notre mission : <strong>améliorer la production</strong> en digitalisant ce qui compte
              vraiment (opérations, vente, facturation, pilotage).
            </p>
          </>
        }
        aside={<AboutMarkAnimated className="hidden md:block" />}
      />

      <section className="container py-16 md:py-24" aria-labelledby="values-title">
        <SectionTitle id="values-title" eyebrow="Ce qui nous guide">
          Mission, vision, valeurs
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
                <strong>{item.title}</strong> : {item.text}
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

      <section className="container py-16 md:py-24" aria-labelledby="gains-title">
        <div className="panel">
          <SectionTitle id="gains-title" eyebrow="Ordres de grandeur">
            Des gains mesurables grâce au digital
          </SectionTitle>
          <p className="mt-4 max-w-2xl">
            En digitalisant les processus clés (vente, facturation, pilotage, opérations), on réduit les frictions, on
            fiabilise la donnée, et on libère du temps pour la production. Notre approche : livrer vite, mesurer, itérer.
          </p>
          <dl className="mt-10 grid gap-10 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs uppercase tracking-[0.2em] text-silver">{stat.label}</dt>
                <dd>
                  <span className="mt-2 block font-display text-5xl leading-none">
                    <span className="text-gold">{stat.value}</span>
                  </span>
                  <span className="mt-3 block text-sm">{stat.text}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-2xl text-sm text-silver">
            Ces chiffres varient selon le secteur et l’existant, mais ils donnent un ordre de grandeur. Notre objectif :
            obtenir des résultats comparables dans votre contexte (PME, contraintes terrain, équipes).
          </p>
        </div>
      </section>

      <CtaBand title="Parlons de votre activité." text="Un premier échange pour comprendre votre contexte et vos priorités.">
        <DottedLink href="/projets" className="text-sm text-silver">
          Voir nos réalisations →
        </DottedLink>
      </CtaBand>
    </div>
  );
}
