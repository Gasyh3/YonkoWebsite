import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { IntakeControls } from "@/components/admin/intake-controls";
import { requireAdmin } from "@/lib/admin/auth";
import { STATUS_LABELS } from "@/lib/admin/labels";
import { getDb } from "@/lib/db";
import { intakes } from "@/lib/db/schema";
import { priceFactors, suggestedOffers, vigilance } from "@/lib/questionnaire/pricing";
import { answerById, summarize } from "@/lib/questionnaire/validate";

export const metadata = { title: "Dossier" };
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const dateFr = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Indian/Antananarivo" }).format(date)
    : "—";

// Détail d'un dossier : réponses par section, suivi (statut, notes) et grille de chiffrage interne.
export default async function IntakePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const [intake] = await getDb()!.select().from(intakes).where(eq(intakes.id, id)).limit(1);
  if (!intake) notFound();

  const a = intake.answers;
  const summary = summarize(a);
  const offers = suggestedOffers(a);
  const factors = priceFactors(a);
  const points = vigilance(a);

  return (
    <div className="container pb-24 pt-16 md:pt-24">
      <Link href="/admin" className="link-dotted text-xs uppercase tracking-[0.24em] text-silver print:hidden">
        ← Tous les dossiers
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display text-5xl md:text-6xl">{answerById("entreprise_nom", a) || "(sans nom)"}</h1>
        <span className="admin-status" data-status={intake.status}>
          {STATUS_LABELS[intake.status]}
        </span>
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] md:gap-16">
        <div className="space-y-12">
          <dl className="admin-meta">
            <div><dt>Contact</dt><dd>{[intake.name, intake.email].filter(Boolean).join(" · ")}</dd></div>
            <div><dt>Créé</dt><dd>{dateFr(intake.createdAt)}</dd></div>
            <div><dt>Envoyé</dt><dd>{dateFr(intake.submittedAt)}</dd></div>
            <div><dt>Dernière visite</dt><dd>{dateFr(intake.lastSeenAt)}</dd></div>
            <div><dt>Lien valable jusqu&apos;au</dt><dd>{dateFr(intake.tokenExpiresAt)}</dd></div>
            <div><dt>Consentement</dt><dd>{dateFr(intake.consentAt)}</dd></div>
          </dl>

          {summary.length === 0 ? (
            <p className="panel">Le client n&apos;a encore rien saisi.</p>
          ) : (
            summary.map((section) => (
              <section key={section.title} aria-label={section.title}>
                <h2 className="font-display text-3xl">{section.title}</h2>
                <dl className="admin-answers mt-6">
                  {section.items.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))
          )}
        </div>

        <aside className="space-y-10">
          <IntakeControls id={intake.id} status={intake.status} notes={intake.notes} />

          <section className="panel space-y-6" aria-labelledby="pricing-title">
            <h2 id="pricing-title" className="font-display text-2xl">
              Grille de chiffrage <span className="text-xs uppercase tracking-[0.2em] text-silver">interne</span>
            </h2>
            <div>
              <h3 className="form-label">Offres de base</h3>
              {offers.length ? (
                <ul className="mt-3 space-y-3 text-sm">
                  {offers.map((o) => (
                    <li key={o.id}>
                      <span className="text-silver-light">{o.label}</span>
                      <span className="block text-silver">
                        {o.library} · mise en place {o.setup || "à fixer"} · maintenance {o.monthly || "à fixer"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-silver">Aucune (le client souhaite être conseillé).</p>
              )}
            </div>
            <div>
              <h3 className="form-label">Facteurs détectés</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {factors
                  .filter((f) => f.detected)
                  .map((f) => (
                    <li key={f.label}>
                      <span className="text-silver-light">{f.label}</span>
                      <span className="block text-silver">{f.effect}</span>
                      {f.evidence ? <span className="mt-1 block whitespace-pre-line text-xs">{f.evidence}</span> : null}
                    </li>
                  ))}
                {factors.every((f) => !f.detected) ? <li className="text-silver">Aucun facteur particulier.</li> : null}
              </ul>
            </div>
            <div>
              <h3 className="form-label">Points de vigilance</h3>
              <ul className="dot-list mt-3 text-sm">
                {points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
