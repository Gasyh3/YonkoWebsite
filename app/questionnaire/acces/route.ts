import { NextResponse } from "next/server";

import { findByToken, openSession, touch } from "@/lib/questionnaire/service";
import { appUrl } from "@/lib/server/config";

// Ouverture par le lien reçu par e-mail : le jeton est vérifié, placé dans un cookie de session (httpOnly), puis
// retiré de l'adresse (redirection vers /questionnaire). Lien inconnu ou expiré : retour à la demande de lien.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("jeton");
  const intake = await findByToken(token);
  if (!intake || !token) return NextResponse.redirect(`${appUrl()}/questionnaire?lien=invalide`, 303);
  await openSession(token, intake.tokenExpiresAt);
  await touch(intake);
  return NextResponse.redirect(`${appUrl()}/questionnaire`, 303);
}
