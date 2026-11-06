import { eq } from "drizzle-orm";

import { isAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";
import { INTAKE_STATUSES, intakes, type IntakeStatus } from "@/lib/db/schema";
import { json, unavailable } from "@/lib/questionnaire/api";
import { readJsonObject, sameOrigin } from "@/lib/server/http";

// Mise à jour d'un dossier (statut, notes internes) et suppression (droit à l'effacement).
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

async function guard(request: Request, id: string) {
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non autorisée." }, 403);
  if (!getDb()) return unavailable();
  if (!(await isAdmin())) return json({ ok: false, message: "Session expirée." }, 401);
  if (!UUID.test(id)) return json({ ok: false, message: "Dossier introuvable." }, 404);
  return null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const refused = await guard(request, id);
  if (refused) return refused;
  const body = await readJsonObject(request, 20_000);
  if (body === "too-large" || body === "invalid") return json({ ok: false, message: "Requête invalide." }, 400);

  const changes: { status?: IntakeStatus; notes?: string; updatedAt: Date } = { updatedAt: new Date() };
  if (typeof body.status === "string") {
    if (!(INTAKE_STATUSES as readonly string[]).includes(body.status)) return json({ ok: false, message: "Statut inconnu." }, 422);
    changes.status = body.status as IntakeStatus;
  }
  if (typeof body.notes === "string") changes.notes = body.notes.slice(0, 10_000);

  const [updated] = await getDb()!.update(intakes).set(changes).where(eq(intakes.id, id)).returning({ id: intakes.id });
  if (!updated) return json({ ok: false, message: "Dossier introuvable." }, 404);
  return json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const refused = await guard(request, id);
  if (refused) return refused;
  const [removed] = await getDb()!.delete(intakes).where(eq(intakes.id, id)).returning({ id: intakes.id });
  if (!removed) return json({ ok: false, message: "Dossier introuvable." }, 404);
  return json({ ok: true });
}
