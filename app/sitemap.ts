import type { MetadataRoute } from "next";

import { expertises } from "@/lib/expertises-data";
import { absoluteUrl } from "@/lib/site";

// Plan du site (/sitemap.xml) : pages fixes, puis pages générées depuis les données (expertises).
// Les pages /lab et /api en sont exclues (voir aussi app/robots.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/expertises", 0.9),
    ...expertises.map((item) => entry(`/expertises/${item.slug}`, 0.9)),
    entry("/about", 0.7),
    entry("/contact", 0.8, "yearly"),
    entry("/faqs", 0.6),
    entry("/mentions-legales", 0.2, "yearly"),
    entry("/confidentialite", 0.2, "yearly"),
  ];
}
