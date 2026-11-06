import { isAdmin } from "@/lib/admin/auth";
import { sendMail } from "@/lib/mail";
import { json } from "@/lib/questionnaire/api";
import { invitationMail } from "@/lib/questionnaire/emails";
import { requestAccess } from "@/lib/questionnaire/service";
import { readJsonObject, sameOrigin } from "@/lib/server/http";

// Inviter un client depuis l'administration (après un premier échange, par exemple) : même lien que s'il l'avait
// demandé lui-même.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non autorisée." }, 403);
  if (!(await isAdmin())) return json({ ok: false, message: "Session expirée." }, 401);
  const body = await readJsonObject(request, 2_000);
  if (body === "too-large" || body === "invalid") return json({ ok: false, message: "Requête invalide." }, 400);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, 100) : "";
  if (!EMAIL.test(email) || email.length > 200) return json({ ok: false, message: "Adresse e-mail invalide." }, 422);
  try {
    const { link, expiresAt } = await requestAccess(email, name);
    await sendMail({ to: email, ...invitationMail(name, link, expiresAt) });
  } catch (error) {
    console.error("[admin] Invitation non envoyée :", error);
    return json({ ok: false, message: "L'invitation n'a pas pu être envoyée." }, 502);
  }
  return json({ ok: true, message: `Invitation envoyée à ${email}.` });
}
