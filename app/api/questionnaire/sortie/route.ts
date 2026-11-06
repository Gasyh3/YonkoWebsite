import { json } from "@/lib/questionnaire/api";
import { closeSession } from "@/lib/questionnaire/service";
import { sameOrigin } from "@/lib/server/http";

// Fermer la session sur cet appareil (ordinateur partagé) : le lien reçu par e-mail reste valable.
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non autorisée." }, 403);
  await closeSession();
  return json({ ok: true });
}
