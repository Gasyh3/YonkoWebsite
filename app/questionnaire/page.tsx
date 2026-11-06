import Link from "next/link";

import { PageHeader } from "@/components/page/page-header";
import { QuestionnaireForm } from "@/components/questionnaire/questionnaire-form";
import { QuestionnaireRequestForm } from "@/components/questionnaire/request-form";
import { getDb } from "@/lib/db";
import { INTRO } from "@/lib/questionnaire/definition";
import { currentIntake, isEditable } from "@/lib/questionnaire/service";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Questionnaire de cadrage",
  description:
    "Décrivez votre projet de site web, de logiciel de gestion ou d'outil sur mesure : recevez votre lien personnel par e-mail et préparez un devis précis avec Yonko Tech Consulting.",
  path: "/questionnaire",
});

export const dynamic = "force-dynamic";

const dateFr = (date: Date) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Indian/Antananarivo" }).format(date);

// Questionnaire de cadrage : sans session, demande du lien par e-mail ; avec session, le questionnaire (ou la
// confirmation s'il a déjà été envoyé).
export default async function QuestionnairePage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const { lien } = await searchParams;
  const available = Boolean(getDb());
  const intake = available ? await currentIntake() : null;

  if (intake && isEditable(intake)) {
    return (
      <div>
        <PageHeader eyebrow="Questionnaire de cadrage" title="Parlez-nous de votre projet" lead={INTRO.lead} />
        <section className="container pb-24 pt-8 md:pb-32" aria-label="Questionnaire">
          <QuestionnaireForm
            email={intake.email}
            initialAnswers={intake.answers}
            initialSavedAt={intake.status === "en_cours" ? intake.updatedAt.toISOString() : null}
          />
        </section>
      </div>
    );
  }

  if (intake) {
    return (
      <div>
        <PageHeader eyebrow="Questionnaire de cadrage" title="Merci, c'est bien reçu." />
        <section className="container max-w-3xl pb-24 pt-8 md:pb-32">
          <div className="panel contact-done">
            <span className="contact-done__node" aria-hidden="true" />
            <p className="md:text-lg">
              Votre questionnaire a été envoyé le {dateFr(intake.submittedAt ?? intake.updatedAt)}. Un récapitulatif vous a
              été adressé par e-mail. Nous revenons vers vous sous 24h pour convenir d&apos;un appel de cadrage.
            </p>
            <Link href="/" className="link-dotted mt-8 inline-block text-sm text-silver">
              Retour à l&apos;accueil
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Questionnaire de cadrage" title="Décrivez votre projet, à votre rythme" lead={INTRO.lead} />
      <section className="container pb-24 pt-8 md:pb-32" aria-label="Recevoir le questionnaire">
        <div className="grid gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-silver">Comment ça marche</p>
            <ul className="dot-list mt-8">
              <li>Indiquez votre adresse e-mail : vous recevez un lien personnel vers le questionnaire.</li>
              {INTRO.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            {lien === "invalide" ? (
              <p className="panel text-sm" role="alert">
                Ce lien n&apos;est plus valable (il a expiré ou un lien plus récent a été envoyé). Demandez-en un nouveau :
                vos réponses déjà enregistrées sont conservées.
              </p>
            ) : null}
            {available ? (
              <QuestionnaireRequestForm />
            ) : (
              <div className="panel">
                <p>
                  Le questionnaire en ligne n&apos;est pas encore disponible. En attendant, décrivez votre projet via le{" "}
                  <Link href="/contact" className="link-dotted text-silver-light">
                    formulaire de contact
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
