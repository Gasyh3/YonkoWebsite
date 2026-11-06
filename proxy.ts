import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE } from "@/lib/admin/constants";

// Défense en amont de l'administration : sans cookie de session, redirection HTTP vers la connexion avant tout
// rendu. La validité de la session reste vérifiée dans chaque page et chaque route (lib/admin/auth.ts).
export function proxy(request: NextRequest) {
  if (request.cookies.has(ADMIN_COOKIE)) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/connexion", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/((?!connexion|acces).*)"],
};
