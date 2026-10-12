import { DottedLink } from "@/components/motion/dotted-link";
import { OfferCards } from "@/components/sections/offer-cards";

// Accueil : les offres détaillées (contenu v1 inchangé), dans la direction artistique.
// Retrait de 24px à droite (desktop) : la marge reste aux fibres.
export function ServicesSection() {
  return (
    <section className="container py-16 md:py-24 md:pr-[calc(2.75rem+1.5rem)]" id="services" aria-labelledby="services-title">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.24em] text-silver">Nos offres</p>
        <h2 id="services-title" className="mt-4 font-display text-4xl leading-[1.04] md:text-6xl">
          Des solutions digitales B2B pour structurer, lancer et faire croître votre activité
        </h2>
        <p className="page-lead mt-6 md:text-lg">
          Nous concevons des <strong>ERP modulaires pour PME</strong> et des <strong>SaaS clé en main</strong> basés
          sur Next.js, tout en accompagnant votre <strong>visibilité digitale</strong> grâce au SEO, au rebranding et à
          la gestion de vos réseaux sociaux. De la stratégie à l’exécution, nous livrons des solutions cohérentes,
          performantes et orientées croissance.
        </p>
      </div>

      <div className="mt-12 md:mt-16">
        <OfferCards />
      </div>
      <DottedLink href="/services" className="mt-10 text-sm text-silver">
        Toutes les offres →
      </DottedLink>
    </section>
  );
}
