import { createLoginLink, isAllowedAdmin, loginMail } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";
import { mailConfigured, sendMail } from "@/lib/mail";
import { json, unavailable } from "@/lib/questionnaire/api";
import { clientIp, readJsonObject, sameOrigin } from "@/lib/server/http";
import { createRateLimiter } from "@/lib/server/rate-limit";

// Demande de lien de connexion : envoyé seulement à ADMIN_EMAIL, réponse identique pour toute autre adresse.
const limiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });
const SENT = { ok: true as const, message: "Si cette adresse est autorisée, un lien de connexion vient de partir." };

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non autorisée." }, 403);
  if (!getDb() || !mailConfigured()) return unavailable();
  if (limiter.limited(clientIp(request))) return json({ ok: false, message: "Trop de tentatives. Réessayez plus tard." }, 429);
  const body = await readJsonObject(request, 2_000);
  if (body === "too-large" || body === "invalid") return json({ ok: false, message: "Requête invalide." }, 400);
  const email = typeof body.email === "string" ? body.email : "";
  if (isAllowedAdmin(email)) {
    try {
      await sendMail({ to: email.trim().toLowerCase(), ...loginMail(await createLoginLink()) });
    } catch (error) {
      console.error("[admin] Lien de connexion non envoyé :", error);
    }
  }
  return json(SENT);
}
