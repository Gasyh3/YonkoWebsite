import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

// /robots.txt : tout est indexable sauf le laboratoire et l'API. Sur un déploiement de prévisualisation (Vercel),
// rien n'est indexé pour ne pas concurrencer le site de production.
export default function robots(): MetadataRoute.Robots {
  const preview = process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== "production";
  return {
    rules: preview ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/", disallow: ["/lab", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
