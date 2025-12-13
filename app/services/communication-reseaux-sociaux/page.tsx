import { notFound } from "next/navigation";

import { ServiceDetail } from "@/app/services/service-detail";
import { getServiceBySlug } from "@/lib/services-data";

const slug = "communication-reseaux-sociaux";

export const metadata = {
  title: "Communication & réseaux sociaux | Yonko Tech Consulting",
  description:
    "Stratégie éditoriale, calendrier, production de contenus et suivi de performances pour vos réseaux.",
};

export default function CommunicationPage() {
  const service = getServiceBySlug(slug);
  if (!service) {
    return notFound();
  }
  return <ServiceDetail service={service} showBackLink={false} />;
}
