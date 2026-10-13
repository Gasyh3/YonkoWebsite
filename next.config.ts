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

// Domaine unique : la variante www (ou sans www, selon NEXT_PUBLIC_SITE_URL) redirige en 308 vers l'URL canonique.
const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yonkotech.com");
const ALTERNATE_HOST = SITE_URL.hostname.startsWith("www.") ? SITE_URL.hostname.slice(4) : `www.${SITE_URL.hostname}`;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // next/image : AVIF en priorité (plus léger), WebP sinon.
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Vidéos et images de public/ : 7 jours en cache (+1 jour servi pendant la revalidation). Pas « immutable » :
      // les rendus vidéo gardent le même nom quand on les régénère (renommer les fichiers pour un cache d'un an).
      ...["/media/:path*", "/assets/:path*"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      })),
    ];
  },
  // Bancs d'essai /lab : développement uniquement. En production, réécrits vers une route inexistante (vraie 404).
  async rewrites() {
    if (process.env.NODE_ENV !== "production") return [];
    return { beforeFiles: [{ source: "/lab/:path*", destination: "/_lab-indisponible" }], afterFiles: [], fallback: [] };
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ALTERNATE_HOST }],
        destination: `${SITE_URL.origin}/:path*`,
        permanent: true,
      },
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
