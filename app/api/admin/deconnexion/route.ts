import { logout } from "@/lib/admin/auth";
import { json } from "@/lib/questionnaire/api";
import { sameOrigin } from "@/lib/server/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non autorisée." }, 403);
  await logout();
  return json({ ok: true });
}
