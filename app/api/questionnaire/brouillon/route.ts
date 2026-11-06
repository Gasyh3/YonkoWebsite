import { getDb } from "@/lib/db";
import { json, unavailable } from "@/lib/questionnaire/api";
import { currentIntake, isEditable, saveDraft } from "@/lib/questionnaire/service";
import { sanitizeAnswers } from "@/lib/questionnaire/validate";
import { readJsonObject, sameOrigin } from "@/lib/server/http";
import { createRateLimiter } from "@/lib/server/rate-limit";

// Enregistrement automatique du brouillon (pendant la saisie). Seules les questions connues sont gardées.
const limiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 200 });

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non autorisée." }, 403);
  if (!getDb()) return unavailable();
  const intake = await currentIntake();
  if (!intake) return json({ ok: false, message: "Session expirée : demandez un nouveau lien." }, 401);
  if (!isEditable(intake)) return json({ ok: false, message: "Ce questionnaire a déjà été envoyé." }, 409);
  if (limiter.limited(intake.id)) return json({ ok: false, message: "Trop d'enregistrements : patientez un instant." }, 429);

  const body = await readJsonObject(request, 200_000);
  if (body === "too-large" || body === "invalid") return json({ ok: false, message: "Requête invalide." }, 400);
  const savedAt = await saveDraft(intake, sanitizeAnswers(body.answers));
  return json({ ok: true, savedAt: savedAt.toISOString() });
}

// navigator.sendBeacon (enregistrement en quittant la page) n'envoie que des POST.
export const POST = PUT;
