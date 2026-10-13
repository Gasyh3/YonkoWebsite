import type { NextConfig } from "next";

// Les offres v1 (/services) sont remplacées par les expertises : redirections permanentes (308) pour conserver
// les liens et le référencement existants. Les pages v1 sont supprimées, leurs textes archivés dans
// docs/archive/offres-v1.md.
const SERVICE_REDIRECTS: Record<string, string> = {
  "erp-pme-modulaire": "logiciel-sur-mesure",
  "saas-cle-en-main-nextjs": "logiciel-sur-mesure",
  "seo-rebranding-acquisition": "site-vitrine-et-seo",
  "communication-reseaux-sociaux": "strategie-de-communication",
};

const isDev = process.env.NODE_ENV !== "production";
// Cloudflare Turnstile (formulaire de contact) : seule source externe, autorisée uniquement si la clé est définie.
const turnstile = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? " https://challenges.cloudflare.com" : "";

// Content-Security-Policy : uniquement les sources réellement chargées (relevé de l'audit) — le site lui-même, plus
// Turnstile s'il est activé. 'unsafe-inline' (scripts) : Next injecte les données de page en scripts inline et le hero
// en a deux ; un nonce rendrait toutes les pages dynamiques. 'unsafe-eval' et ws: : développement uniquement.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${turnstile}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  turnstile ? `frame-src${turnstile}` : "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  // HSTS : n'a d'effet que servi en HTTPS (ignoré en local). Pas de « preload » : engagement difficile à annuler.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // Bancs d'essai /lab : développement uniquement. En production, réécrits vers une route inexistante (vraie 404).
  async rewrites() {
    if (process.env.NODE_ENV !== "production") return [];
    return { beforeFiles: [{ source: "/lab/:path*", destination: "/_lab-indisponible" }], afterFiles: [], fallback: [] };
  },
  async redirects() {
    return [
      { source: "/services", destination: "/expertises", permanent: true },
      ...Object.entries(SERVICE_REDIRECTS).map(([from, to]) => ({
        source: `/services/${from}`,
        destination: `/expertises/${to}`,
        permanent: true,
      })),
      { source: "/services/:slug", destination: "/expertises", permanent: true },
    ];
  },
};

export default nextConfig;
