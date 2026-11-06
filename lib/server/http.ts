import "server-only";

// Outils HTTP communs aux routes API (contact, questionnaire, administration).

// Adresse du visiteur derrière le proxy (Traefik sous Dokploy, Vercel…) : X-Real-IP est écrit par le proxy ; à
// défaut, la DERNIÈRE entrée de X-Forwarded-For (ajoutée par le proxy). La première peut être forgée par le client.
export function clientIp(request: Request) {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return forwarded?.at(-1) || "unknown";
}

// Requête venue d'une page du site (protection CSRF des routes qui modifient des données). Sans en-tête Origin
// (outils en ligne de commande), on laisse passer : les autres protections s'appliquent.
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

// Corps JSON lu en flux et coupé à maxBytes, que content-length soit présent ou non (transfert « chunked »).
// « too-large » si la limite est dépassée, « invalid » si ce n'est pas un objet JSON.
export async function readJsonObject(
  request: Request,
  maxBytes: number,
): Promise<Record<string, unknown> | "too-large" | "invalid"> {
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) return "too-large";
  if (!request.body) return "invalid";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return "too-large";
    }
    chunks.push(value);
  }
  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "invalid";
    return parsed as Record<string, unknown>;
  } catch {
    return "invalid";
  }
}
