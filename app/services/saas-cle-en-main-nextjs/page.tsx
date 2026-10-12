import { notFound } from "next/navigation";

import { ServiceDetail } from "@/app/services/service-detail";
import { getServiceBySlug } from "@/lib/services-data";
import { pageMetadata } from "@/lib/site";

const slug = "saas-cle-en-main-nextjs";

export const metadata = pageMetadata({
  title: "SaaS clé en main Next.js",
  description:
    "Base SaaS Next.js prête : Stripe paiements/abonnements, Better Auth, base de données, analytics, emails, landing, blog et docs.",
  path: `/services/${slug}`,
});

export default function SaasCleEnMainPage() {
  const service = getServiceBySlug(slug);
  if (!service) {
    return notFound();
  }
  return <ServiceDetail service={service} showBackLink={false} />;
}
