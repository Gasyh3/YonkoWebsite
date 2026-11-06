import "server-only";

// Cloudflare Turnstile : vérification du jeton côté serveur (jamais confiée au navigateur). Sans clé secrète, la
// vérification est désactivée (développement local). Service injoignable = échec : on ne laisse rien passer.
const TURNSTILE_VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: unknown, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || token === "" || token.length > 2048) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") form.set("remoteip", ip);
  try {
    const res = await fetch(TURNSTILE_VERIFY, { method: "POST", body: form, signal: AbortSignal.timeout(8000) });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] Vérification impossible :", error);
    return false;
  }
}
