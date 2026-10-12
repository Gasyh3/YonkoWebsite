import { notFound } from "next/navigation";

import { ServiceDetail } from "@/app/services/service-detail";
import { getServiceBySlug } from "@/lib/services-data";
import { pageMetadata } from "@/lib/site";

const slug = "erp-pme-modulaire";

export const metadata = pageMetadata({
  title: "ERP PME modulaire",
  description:
    "ERP pour PME : CRM, devis/factures, paiements, inventaire, fournisseurs, HR-lite, tâches, dashboards et audit log.",
  path: `/services/${slug}`,
});

export default function ErpPmePage() {
  const service = getServiceBySlug(slug);
  if (!service) {
    return notFound();
  }
  return <ServiceDetail service={service} showBackLink={false} />;
}
