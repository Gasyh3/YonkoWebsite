import { notFound } from "next/navigation";

import { ServiceDetail } from "@/app/services/service-detail";
import { getServiceBySlug } from "@/lib/services-data";
import { pageMetadata } from "@/lib/site";

const slug = "seo-rebranding-acquisition";

export const metadata = pageMetadata({
  title: "SEO, rebranding & acquisition",
  description:
    "Audit SEO, repositionnement de marque et plan d’acquisition pour accroître visibilité et conversion.",
  path: `/services/${slug}`,
});

export default function SeoRebrandingPage() {
  const service = getServiceBySlug(slug);
  if (!service) {
    return notFound();
  }
  return <ServiceDetail service={service} showBackLink={false} />;
}
