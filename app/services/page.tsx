import type { Metadata } from "next";

import { DottedLink } from "@/components/motion/dotted-link";
import { CtaBand } from "@/components/page/cta-band";
import { PageHeader } from "@/components/page/page-header";
import { FaqSection } from "@/components/sections/faq-section";
import { OfferCards } from "@/components/sections/offer-cards";
import { faqItems } from "@/lib/faq-data";

export const metadata: Metadata = { title: "Offres · Yonko Tech Consulting" };

// Offres (contenu v1 inchangé) dans la direction artistique.
export default function ServicesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Offres"
        title="ERP PME, SaaS clé en main et visibilité digitale"
        lead="Nous construisons des ERP modulaires pour PME, des bases SaaS Next.js prêtes à être monétisées et des dispositifs marketing (SEO, rebranding, réseaux sociaux) pour soutenir la croissance. Chaque offre est livrée avec des jalons clairs, des livrables documentés et une équipe senior."
      >
        <DottedLink href="/expertises" className="text-sm text-silver">
          Voir nos expertises →
        </DottedLink>
      </PageHeader>

      <section className="container py-12 md:py-16" aria-labelledby="end-to-end-title">
        <div className="panel">
          <h2 id="end-to-end-title" className="font-display text-3xl md:text-4xl">
            Livraison end-to-end
          </h2>
          <p className="mt-4 max-w-3xl">
            Cadrage, conception, build, intégrations (Stripe, Better Auth), analytics, SEO, CI/CD : une approche
            bout-en-bout pour livrer des produits fiables et mesurables.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16" aria-label="Nos offres">
        <OfferCards />
      </section>

      <FaqSection items={faqItems} />

      <CtaBand title="Un projet en tête ?" text="Décrivez votre besoin, nous revenons vers vous sous 24h." />
    </div>
  );
}
