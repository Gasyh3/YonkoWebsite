import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";

import { AdminInviteForm } from "@/components/admin/invite-form";
import { AdminLogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/admin/auth";
import { STATUS_LABELS } from "@/lib/admin/labels";
import { getDb } from "@/lib/db";
import { INTAKE_STATUSES, intakes, type IntakeStatus } from "@/lib/db/schema";
import { answerById } from "@/lib/questionnaire/validate";

export const metadata = { title: "Dossiers" };
export const dynamic = "force-dynamic";

const dateFr = (date: Date | null) =>
  date ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Indian/Antananarivo" }).format(date) : "—";

// Tableau de bord : dossiers de cadrage, du plus récent au plus ancien, filtrables par statut.
export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await requireAdmin();
  const db = getDb()!;
  const { statut } = await searchParams;
  const filter = (INTAKE_STATUSES as readonly string[]).includes(statut) ? (statut as IntakeStatus) : null;

  const rows = await db
    .select()
    .from(intakes)
    .where(filter ? eq(intakes.status, filter) : undefined)
    .orderBy(desc(intakes.updatedAt))
    .limit(300);
  const counts = Object.fromEntries(
    (await db.select({ status: intakes.status, n: count() }).from(intakes).groupBy(intakes.status)).map((r) => [r.status, r.n]),
  ) as Partial<Record<IntakeStatus, number>>;
  const total = Object.values(counts).reduce((a, n) => a + (n ?? 0), 0);

  return (
    <div className="container pb-24 pt-16 md:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-silver">Administration</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Dossiers de cadrage</h1>
        </div>
        <AdminLogoutButton />
      </div>

      <nav aria-label="Filtrer par statut" className="mt-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <li>
            <Link href="/admin" className="admin-filter" aria-current={!filter ? "page" : undefined}>
              Tous ({total})
            </Link>
          </li>
          {INTAKE_STATUSES.map((s) => (
            <li key={s}>
              <Link href={`/admin?statut=${s}`} className="admin-filter" aria-current={filter === s ? "page" : undefined}>
                {STATUS_LABELS[s]} ({counts[s] ?? 0})
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="admin-table mt-8">
        {rows.length === 0 ? (
          <p className="panel">Aucun dossier pour l&apos;instant.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Entreprise</th>
                <th scope="col">Contact</th>
                <th scope="col">Services</th>
                <th scope="col">Budget</th>
                <th scope="col">Statut</th>
                <th scope="col">Mis à jour</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/admin/dossiers/${r.id}`} className="link-dotted text-silver-light">
                      {answerById("entreprise_nom", r.answers) || "(sans nom)"}
                    </Link>
                  </td>
                  <td>
                    {r.name ? <span className="block">{r.name}</span> : null}
                    <span className="text-silver">{r.email}</span>
                  </td>
                  <td className="whitespace-pre-line">{answerById("services", r.answers) || "—"}</td>
                  <td>{answerById("budget", r.answers) || "—"}</td>
                  <td>
                    <span className="admin-status" data-status={r.status}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td>{dateFr(r.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <section className="mt-16" aria-labelledby="invite-title">
        <h2 id="invite-title" className="font-display text-3xl">
          Inviter un client
        </h2>
        <p className="mt-3 text-sm text-silver">Le client reçoit son lien personnel vers le questionnaire.</p>
        <div className="panel mt-6">
          <AdminInviteForm />
        </div>
      </section>
    </div>
  );
}
