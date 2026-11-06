import { getDb } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { json, unavailable } from "@/lib/questionnaire/api";
import { adminNotificationMail, confirmationMail } from "@/lib/questionnaire/emails";
import { currentIntake, isEditable, submit } from "@/lib/questionnaire/service";
import { sanitizeAnswers, validateAll } from "@/lib/questionnaire/validate";
import { adminEmail } from "@/lib/server/config";
import { readJsonObject, sameOrigin } from "@/lib/server/http";
import { createRateLimiter } from "@/lib/server/rate-limit";

// Envoi final : validation complète, consentement obligatoire, réponses figées, accusé de réception au client et
// notification à l'administration. Un échec d'e-mail n'annule pas l'envoi (les réponses sont enregistrées).
const limiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 10 });

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non autorisée." }, 403);
  if (!getDb()) return unavailable();
  const intake = await currentIntake();
  if (!intake) return json({ ok: false, message: "Session expirée : demandez un nouveau lien." }, 401);
  if (!isEditable(intake)) return json({ ok: false, message: "Ce questionnaire a déjà été envoyé." }, 409);
  if (limiter.limited(intake.id)) return json({ ok: false, message: "Trop de tentatives : patientez un instant." }, 429);

  const body = await readJsonObject(request, 200_000);
  if (body === "too-large" || body === "invalid") return json({ ok: false, message: "Requête invalide." }, 400);
  if (body.consent !== true) {
    return json({ ok: false, message: "Merci de cocher la case de consentement.", errors: { consent: "Nécessaire pour envoyer." } }, 422);
  }
  const answers = sanitizeAnswers(body.answers);
  const errors = validateAll(answers);
  if (Object.keys(errors).length) return json({ ok: false, message: "Certaines réponses sont nécessaires.", errors }, 422);

  const submitted = await submit(intake, answers);
  if (!submitted) return json({ ok: false, message: "Ce questionnaire a déjà été envoyé." }, 409);

  const mails = [sendMail({ to: submitted.email, ...confirmationMail(submitted) })];
  if (adminEmail()) mails.push(sendMail({ to: adminEmail(), ...adminNotificationMail(submitted), replyTo: submitted.email }));
  const results = await Promise.allSettled(mails);
  for (const r of results) if (r.status === "rejected") console.error("[questionnaire] E-mail non envoyé :", r.reason);

  return json({ ok: true });
}
