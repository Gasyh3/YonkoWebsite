// Contrôle de santé (HEALTHCHECK de l'image Docker, Dokploy, surveillance de disponibilité) : répond 200 tant que
// le serveur tourne. Jamais mis en cache.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
