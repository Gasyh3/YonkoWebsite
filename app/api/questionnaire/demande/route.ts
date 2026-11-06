import { HONEYPOT_FIELD, MIN_FILL_MS, STARTED_FIELD, TURNSTILE_FIELD } from "@/lib/contact";
import { getDb } from "@/lib/db";
import { sendMail, mailConfigured } from "@/lib/mail";
import { json, unavailable } from "@/lib/questionnaire/api";
import { invitationMail } from "@/lib/questionnaire/emails";
import { requestAccess } from "@/lib/questionnaire/service";
import { clientIp, readJsonObject, sameOrigin } from "@/lib/server/http";
import { createRateLimiter } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";

// Demande de lien d'accès au questionnaire. La réponse est la même que l'adresse ait déjà un dossier ou non (on
// ne révèle pas qui est client). Protections : origine, champ piège, durée minimale, débit par IP et par adresse,
// Turnstile si configuré.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const byIp = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });
const byEmail = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 3 });

const SENT = { ok: true as const, message: "Si l'adresse est valide, un e-mail vient de partir avec votre lien personnel." };

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non autorisée." }, 403);
  if (!getDb() || !mailConfigured()) return unavailable();

  const body = await readJsonObject(request, 4_000);
  if (body === "too-large" || body === "invalid") return json({ ok: false, message: "Requête invalide." }, 400);

  const honeypot = body[HONEYPOT_FIELD];
  const startedAt = Number(body[STARTED_FIELD]);
  if ((typeof honeypot === "string" && honeypot.trim() !== "") || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return json(SENT); // robot : même réponse, rien n'est envoyé
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, 100) : "";
  if (!EMAIL.test(email) || email.length > 200) {
    return json({ ok: false, message: "Cette adresse e-mail ne semble pas valide.", errors: { email: "Cette adresse e-mail ne semble pas valide." } }, 422);
  }

  const ip = clientIp(request);
  if (byIp.limited(ip)) return json({ ok: false, message: "Trop de demandes en peu de temps. Réessayez plus tard." }, 429);
  if (!(await verifyTurnstile(body[TURNSTILE_FIELD], ip))) {
    return json({ ok: false, message: "La vérification anti-robot a échoué. Réessayez." }, 400);
  }
  if (byEmail.limited(email)) return json(SENT); // déjà plusieurs liens envoyés à cette adresse : on n'en renvoie pas

  try {
    const { link, expiresAt } = await requestAccess(email, name);
    await sendMail({ to: email, ...invitationMail(name, link, expiresAt) });
  } catch (error) {
    console.error("[questionnaire] Demande d'accès impossible :", error);
    return json({ ok: false, message: "L'envoi n'a pas abouti. Réessayez dans un instant." }, 502);
  }
  return json(SENT);
}
