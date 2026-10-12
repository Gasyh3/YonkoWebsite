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

const nextConfig: NextConfig = {
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
