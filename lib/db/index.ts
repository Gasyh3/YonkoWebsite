import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// Connexion PostgreSQL (DATABASE_URL). Sans cette variable, le questionnaire et l'administration sont désactivés
// (le reste du site fonctionne normalement) : getDb() renvoie null.
type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as { yonkoDb?: Db };

export function getDb(): Db | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!globalForDb.yonkoDb) {
    // Une seule connexion partagée (et conservée entre les rechargements à chaud en développement).
    // onnotice : les messages d'information de PostgreSQL (ex. migrations déjà appliquées) ne polluent pas les journaux.
    const client = postgres(url, { max: 5, idle_timeout: 30, connect_timeout: 10, onnotice: () => {} });
    globalForDb.yonkoDb = drizzle(client, { schema });
  }
  return globalForDb.yonkoDb;
}

export { schema };
