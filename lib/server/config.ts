import "server-only";

import { SITE } from "@/lib/site";

// Réglages serveur lus au démarrage (variables d'environnement, voir .env.example).

// URL publique utilisée dans les liens envoyés par e-mail. APP_URL (lu à l'exécution) permet de tester en local ;
// par défaut, l'URL canonique du site.
export const appUrl = () => (process.env.APP_URL || SITE.url).replace(/\/+$/, "");

// Cookies « Secure » dès que le site est servi en HTTPS.
export const secureCookies = () => appUrl().startsWith("https://");

// Adresse qui reçoit les notifications et seule autorisée à se connecter à l'administration.
export const adminEmail = () => (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
