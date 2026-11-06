import "server-only";

import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";
import { adminLoginTokens, adminSessions } from "@/lib/db/schema";
import { renderMail } from "@/lib/mail/templates";
import { adminEmail, appUrl, secureCookies } from "@/lib/server/config";
import { createToken, hashToken, isTokenShape } from "@/lib/server/tokens";
import { SITE } from "@/lib/site";

// Administration réservée à ADMIN_EMAIL : lien de connexion à usage unique (15 minutes) envoyé par e-mail, puis
// session de 7 jours dans un cookie httpOnly. Seules les empreintes des jetons sont stockées.

export const ADMIN_COOKIE = "yk_admin";
const LOGIN_VALID_MS = 15 * 60 * 1000;
const SESSION_VALID_MS = 7 * 24 * 60 * 60 * 1000;

export const isAllowedAdmin = (email: string) => Boolean(adminEmail()) && email.trim().toLowerCase() === adminEmail();

export async function createLoginLink() {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL non défini");
  const token = createToken();
  await db.insert(adminLoginTokens).values({ tokenHash: hashToken(token), expiresAt: new Date(Date.now() + LOGIN_VALID_MS) });
  return `${appUrl()}/admin/acces?jeton=${encodeURIComponent(token)}`;
}

export function loginMail(link: string) {
  return {
    subject: `Connexion à l'administration · ${SITE.name}`,
    ...renderMail({
      preheader: "Votre lien de connexion, valable 15 minutes.",
      title: "Connexion à l'administration",
      blocks: [
        { kind: "p", text: "Voici votre lien de connexion. Il est valable 15 minutes et ne fonctionne qu'une fois." },
        { kind: "button", label: "Se connecter", href: link },
        { kind: "small", text: "Vous n'avez rien demandé ? Ignorez ce message : sans ce lien, personne ne peut se connecter." },
      ],
    }),
  };
}

// Lien de connexion → session. false si le lien est inconnu, expiré ou déjà utilisé.
export async function consumeLoginToken(token: unknown) {
  const db = getDb();
  if (!db || !isTokenShape(token)) return false;
  const now = new Date();
  const [used] = await db
    .update(adminLoginTokens)
    .set({ usedAt: now })
    .where(and(eq(adminLoginTokens.tokenHash, hashToken(token)), isNull(adminLoginTokens.usedAt), gt(adminLoginTokens.expiresAt, now)))
    .returning();
  if (!used) return false;
  const sessionId = createToken();
  const expiresAt = new Date(now.getTime() + SESSION_VALID_MS);
  await db.insert(adminSessions).values({ idHash: hashToken(sessionId), expiresAt });
  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionId, { httpOnly: true, secure: secureCookies(), sameSite: "lax", path: "/", expires: expiresAt });
  return true;
}

export async function isAdmin() {
  const db = getDb();
  if (!db) return false;
  const store = await cookies();
  const id = store.get(ADMIN_COOKIE)?.value;
  if (!isTokenShape(id)) return false;
  const [session] = await db
    .select({ idHash: adminSessions.idHash })
    .from(adminSessions)
    .where(and(eq(adminSessions.idHash, hashToken(id)), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  return Boolean(session);
}

// Pages de l'administration : redirection vers la connexion si la session est absente ou expirée.
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/connexion");
}

export async function logout() {
  const db = getDb();
  const store = await cookies();
  const id = store.get(ADMIN_COOKIE)?.value;
  if (db && isTokenShape(id)) await db.delete(adminSessions).where(eq(adminSessions.idHash, hashToken(id)));
  store.delete(ADMIN_COOKIE);
}
