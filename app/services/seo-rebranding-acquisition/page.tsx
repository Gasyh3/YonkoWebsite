import { notFound } from "next/navigation";

import { ServiceDetail } from "@/app/services/service-detail";
import { getServiceBySlug } from "@/lib/services-data";

const slug = "seo-rebranding-acquisition";

export const metadata = {
  title: "SEO, rebranding & acquisition | Yonko Tech Consulting",
  description:
    "Audit SEO, repositionnement de marque et plan d’acquisition pour accroître visibilité et conversion.",
};

export default function SeoRebrandingPage() {
  const service = getServiceBySlug(slug);
  if (!service) {
    return notFound();
  }
  return <ServiceDetail service={service} showBackLink={false} />;
}
