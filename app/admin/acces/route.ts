import { NextResponse } from "next/server";

import { consumeLoginToken } from "@/lib/admin/auth";
import { appUrl } from "@/lib/server/config";

// Lien de connexion reçu par e-mail → session admin, puis tableau de bord. Lien invalide : retour à la connexion.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ok = await consumeLoginToken(new URL(request.url).searchParams.get("jeton"));
  return NextResponse.redirect(`${appUrl()}${ok ? "/admin" : "/admin/connexion?lien=invalide"}`, 303);
}
