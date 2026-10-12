import { DottedLink } from "@/components/motion/dotted-link";
import { PrimaryButton } from "@/components/page/buttons";
import { CtaBand } from "@/components/page/cta-band";
import { PageHeader } from "@/components/page/page-header";
import type { Service } from "@/lib/services-data";

type Props = {
  service: Service;
  showBackLink?: boolean;
};

const COLUMNS = [
  { key: "benefits", title: "Bénéfices clés" },
  { key: "outcomes", title: "Résultats attendus" },
  { key: "deliverables", title: "Livrables" },
] as const;

// Page d'une offre (contenu v1 de lib/services-data.ts, inchangé) dans la direction artistique : en-tête, trois
// colonnes à points or, délai, puis bandeau d'action.
export function ServiceDetail({ service, showBackLink = true }: Props) {
  return (
    <article>
      <PageHeader
        eyebrow={
          showBackLink ? (
            <nav aria-label="Fil d'Ariane">
              <DottedLink href="/services">Offres</DottedLink>
              <span aria-hidden="true"> / </span>
              <span>{service.title}</span>
            </nav>
          ) : (
            "Offre"
          )
        }
        title={service.title}
        lead={service.description}
      >
        <PrimaryButton href="/contact">{service.ctaLabel ?? "Planifier un échange"}</PrimaryButton>
        <DottedLink href="/contact#contact" className="text-sm text-silver">
          Demander une démo →
        </DottedLink>
      </PageHeader>

      <section className="container py-16 md:py-24" aria-label="Détail de l'offre">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {COLUMNS.map((column) => (
            <div key={column.key}>
              <h2 className="text-xs uppercase tracking-[0.24em] text-silver">{column.title}</h2>
              <ul className="dot-list mt-6">
                {service[column.key].map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-16 md:pb-24" aria-labelledby="timeline-title">
        <div className="panel grid gap-6 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:items-center">
          <h2 id="timeline-title" className="text-xs uppercase tracking-[0.24em] text-silver">
            Délai indicatif
          </h2>
          <div>
            <p className="font-display text-2xl text-silver-light md:text-3xl">{service.timeline}</p>
            <p className="mt-3 text-sm text-silver">Planning affiné après un atelier de cadrage.</p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Prochaines étapes"
        text="Atelier de 30 minutes pour préciser le périmètre, aligner les objectifs et planifier les premiers livrables."
        action={<PrimaryButton href="/contact">Réserver un créneau</PrimaryButton>}
      >
        <DottedLink href="/services" className="text-sm text-silver">
          Voir toutes les offres →
        </DottedLink>
      </CtaBand>
    </article>
  );
}
