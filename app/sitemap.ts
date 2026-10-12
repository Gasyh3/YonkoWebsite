import type { MetadataRoute } from "next";

import { expertises } from "@/lib/expertises-data";
import { projects } from "@/lib/results-data";
import { services } from "@/lib/services-data";
import { absoluteUrl } from "@/lib/site";

// Plan du site (/sitemap.xml) : pages fixes, puis pages générées depuis les données (expertises, projets, offres).
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
    entry("/projets", 0.8, "weekly"),
    ...projects.map((project) => entry(`/projets/${project.slug}`, 0.6)),
    entry("/about", 0.7),
    entry("/contact", 0.8, "yearly"),
    entry("/faqs", 0.6),
    entry("/services", 0.5),
    ...services.map((service) => entry(`/services/${service.slug}`, 0.5)),
  ];
}
