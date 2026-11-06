import "server-only";

import path from "node:path";

import { and, inArray, lt, or } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { getDb } from "./index";
import { adminLoginTokens, adminSessions, intakes } from "./schema";

const DAY = 24 * 60 * 60 * 1000;

// Durées de conservation (RGPD, décrites dans /confidentialite) :
// - questionnaire jamais envoyé : supprimé après 90 jours sans activité ;
// - tout dossier : supprimé 3 ans après sa dernière mise à jour ;
// - liens de connexion et sessions admin : supprimés une fois expirés.
export const RETENTION = { abandonedDays: 90, maxDays: 3 * 365 };

// Migrations SQL du dossier drizzle/ (générées par drizzle-kit), appliquées au démarrage du serveur.
export async function runMigrations() {
  const db = getDb();
  if (!db) return;
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
}

export async function purgeExpiredData() {
  const db = getDb();
  if (!db) return;
  const now = Date.now();
  const abandonedBefore = new Date(now - RETENTION.abandonedDays * DAY);
  const maxBefore = new Date(now - RETENTION.maxDays * DAY);
  const removed = await db
    .delete(intakes)
    .where(
      or(
        and(inArray(intakes.status, ["invite", "en_cours"]), lt(intakes.updatedAt, abandonedBefore)),
        lt(intakes.updatedAt, maxBefore),
      ),
    )
    .returning({ id: intakes.id });
  await db.delete(adminLoginTokens).where(lt(adminLoginTokens.expiresAt, new Date(now)));
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date(now)));
  if (removed.length) console.info(`[db] ${removed.length} dossier(s) supprimé(s) (durée de conservation dépassée).`);
}
