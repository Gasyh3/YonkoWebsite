import { notFound } from "next/navigation";

import { ServiceDetail } from "@/app/services/service-detail";
import { getServiceBySlug } from "@/lib/services-data";
import { pageMetadata } from "@/lib/site";

const slug = "communication-reseaux-sociaux";

export const metadata = pageMetadata({
  title: "Communication & réseaux sociaux",
  description:
    "Stratégie éditoriale, calendrier, production de contenus et suivi de performances pour vos réseaux.",
  path: `/services/${slug}`,
});

export default function CommunicationPage() {
  const service = getServiceBySlug(slug);
  if (!service) {
    return notFound();
  }
  return <ServiceDetail service={service} showBackLink={false} />;
}
