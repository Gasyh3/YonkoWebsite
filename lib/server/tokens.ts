import "server-only";

import { createHash, randomBytes } from "node:crypto";

// Jetons d'accès (lien du questionnaire, connexion admin, session) : 32 octets aléatoires, transmis au navigateur
// en base64url. Seule leur empreinte SHA-256 est stockée : une fuite de la base ne donne accès à rien.
export const createToken = () => randomBytes(32).toString("base64url");

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

// Format attendu d'un jeton reçu (évite de hacher n'importe quelle chaîne envoyée).
export const isTokenShape = (value: unknown): value is string =>
  typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value);
