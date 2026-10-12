import type { NextConfig } from "next";

// Les offres v1 (/services) sont remplacées par les expertises : redirections permanentes (308) pour conserver
// les liens et le référencement existants. Les redirections passent avant les pages, qui ne sont plus servies.
const SERVICE_REDIRECTS: Record<string, string> = {
  "erp-pme-modulaire": "logiciel-sur-mesure",
  "saas-cle-en-main-nextjs": "logiciel-sur-mesure",
  "seo-rebranding-acquisition": "site-vitrine-et-seo",
  "communication-reseaux-sociaux": "strategie-de-communication",
};

const nextConfig: NextConfig = {
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
