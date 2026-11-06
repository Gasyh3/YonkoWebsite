import "server-only";

import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { cookies } from "next/headers";

import { getDb } from "@/lib/db";
import { intakes, type Intake } from "@/lib/db/schema";
import { appUrl, secureCookies } from "@/lib/server/config";
import { createToken, hashToken, isTokenShape } from "@/lib/server/tokens";

import { QUESTIONNAIRE_VERSION, type Answers } from "./definition";
import { pruneHidden } from "./validate";

// Dossiers de cadrage : un lien d'accès personnel (envoyé par e-mail) ouvre le questionnaire ; il est ensuite
// conservé dans un cookie de session (httpOnly) et ne reste pas dans l'adresse de la page.

export const LINK_VALID_DAYS = 14;
export const SESSION_COOKIE = "yk_questionnaire";
const DAY = 24 * 60 * 60 * 1000;

export const accessLink = (token: string) => `${appUrl()}/questionnaire/acces?jeton=${encodeURIComponent(token)}`;

// Nouvelle demande d'accès : reprend le dossier encore ouvert de cette adresse (les réponses déjà saisies sont
// gardées, l'ancien lien cesse de fonctionner) ou en crée un. Renvoie le nouveau lien (jamais stocké en clair).
export async function requestAccess(email: string, name: string) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL non défini");
  const token = createToken();
  const tokenHash = hashToken(token);
  const tokenExpiresAt = new Date(Date.now() + LINK_VALID_DAYS * DAY);

  const [open] = await db
    .select({ id: intakes.id, name: intakes.name })
    .from(intakes)
    .where(and(eq(intakes.email, email), inArray(intakes.status, ["invite", "en_cours"])))
    .orderBy(desc(intakes.updatedAt))
    .limit(1);

  if (open) {
    await db
      .update(intakes)
      .set({ tokenHash, tokenExpiresAt, name: name || open.name, updatedAt: new Date() })
      .where(eq(intakes.id, open.id));
  } else {
    await db.insert(intakes).values({ email, name, tokenHash, tokenExpiresAt, questionnaireVersion: QUESTIONNAIRE_VERSION });
  }
  return { link: accessLink(token), expiresAt: tokenExpiresAt };
}

export async function findByToken(token: unknown): Promise<Intake | null> {
  const db = getDb();
  if (!db || !isTokenShape(token)) return null;
  const [intake] = await db
    .select()
    .from(intakes)
    .where(and(eq(intakes.tokenHash, hashToken(token)), gt(intakes.tokenExpiresAt, new Date())))
    .limit(1);
  return intake ?? null;
}

// Dossier de la personne connectée (cookie de session), ou null.
export async function currentIntake(): Promise<Intake | null> {
  const store = await cookies();
  return findByToken(store.get(SESSION_COOKIE)?.value);
}

export async function openSession(token: string, expiresAt: Date) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookies(),
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function closeSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function touch(intake: Intake) {
  const db = getDb();
  if (!db) return;
  await db.update(intakes).set({ lastSeenAt: new Date() }).where(eq(intakes.id, intake.id));
}

export const isEditable = (intake: Intake) => intake.status === "invite" || intake.status === "en_cours";

export async function saveDraft(intake: Intake, answers: Answers) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL non défini");
  const now = new Date();
  await db
    .update(intakes)
    .set({ answers, status: "en_cours", updatedAt: now, lastSeenAt: now })
    .where(and(eq(intakes.id, intake.id), inArray(intakes.status, ["invite", "en_cours"])));
  return now;
}

export async function submit(intake: Intake, answers: Answers) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL non défini");
  const now = new Date();
  const [updated] = await db
    .update(intakes)
    .set({
      answers: pruneHidden(answers),
      status: "soumis",
      consentAt: now,
      submittedAt: now,
      updatedAt: now,
      lastSeenAt: now,
      questionnaireVersion: QUESTIONNAIRE_VERSION,
    })
    .where(and(eq(intakes.id, intake.id), inArray(intakes.status, ["invite", "en_cours"])))
    .returning();
  return updated ?? null;
}
