import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ServiceDetail } from "@/app/services/service-detail";
import { getServiceBySlug, services } from "@/lib/services-data";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return pageMetadata({ title: service.title, description: service.shortDescription, path: `/services/${service.slug}` });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return notFound();
  }

  return <ServiceDetail service={service} />;
}
