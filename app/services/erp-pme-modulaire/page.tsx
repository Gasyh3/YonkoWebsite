import { notFound } from "next/navigation";

import { ServiceDetail } from "@/app/services/service-detail";
import { getServiceBySlug } from "@/lib/services-data";

const slug = "erp-pme-modulaire";

export const metadata = {
  title: "ERP PME modulaire | Yonko Tech Consulting",
  description:
    "ERP pour PME : CRM, devis/factures, paiements, inventaire, fournisseurs, HR-lite, tâches, dashboards et audit log.",
};

export default function ErpPmePage() {
  const service = getServiceBySlug(slug);
  if (!service) {
    return notFound();
  }
  return <ServiceDetail service={service} showBackLink={false} />;
}
