import Link from "next/link";

import { services } from "@/lib/services-data";

// Cartes des offres v1 (lib/services-data.ts, inchangé) : accueil et page Offres. Chaque carte entière est un lien.
export function OfferCards() {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {services.map((service) => (
        <li key={service.slug}>
          <Link href={`/services/${service.slug}`} className="offer-card">
            <h3 className="font-display text-2xl text-silver-light md:text-3xl">{service.title}</h3>
            <p className="mt-3 text-sm md:text-base">{service.shortDescription}</p>
            <ul className="dot-list mt-6 text-sm">
              {service.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <span className="offer-card__more text-sm text-silver-light">
              {service.ctaLabel ?? "En savoir plus"} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
