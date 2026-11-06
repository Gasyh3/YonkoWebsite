import "server-only";

// Limite de débit en mémoire, par clé (adresse IP, e-mail…) et par fenêtre glissante. Suffisante pour un seul
// serveur ; avec plusieurs instances, chacune compte de son côté.
export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const hits = new Map<string, number[]>();
  return {
    // true si la clé dépasse la limite (l'appel compte comme une tentative).
    limited(key: string) {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 5000) {
        for (const [k, list] of hits) if (list.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      return recent.length > max;
    },
  };
}
