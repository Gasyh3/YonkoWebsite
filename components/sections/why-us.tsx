import { BarChart3, Clock3, ShieldCheck, Users } from "lucide-react";

const reasons = [
  {
    title: "Expertise senior",
    description: "Architectes et engineers expérimentés, habitués aux enjeux critiques.",
    icon: ShieldCheck,
  },
  {
    title: "Accompagnement sur-mesure",
    description: "Coaching, co-delivery ou squad dédiée selon votre contexte.",
    icon: Users,
  },
  {
    title: "Agilité pragmatique",
    description: "Sprints cadrés, décisions data-driven, priorisation business.",
    icon: Clock3,
  },
  {
    title: "Qualité et impact",
    description: "Design system, performances, sécurité et mesure ROI intégrées.",
    icon: BarChart3,
  },
];

// Accueil : pourquoi Yonko (contenu v1 inchangé). Quatre raisons sur un filet pointillé, chacune marquée d'un
// nœud or ; icônes en argent (l'or reste réservé à ce qui compte).
export function WhyUs() {
  return (
    <section className="container py-16 md:py-24 md:pr-[calc(2.75rem+1.5rem)]" aria-labelledby="why-title">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.24em] text-silver">Pourquoi Yonko ?</p>
        <h2 id="why-title" className="mt-4 font-display text-4xl leading-[1.04] md:text-6xl">
          Des partenaires qui alignent stratégie produit et excellence tech
        </h2>
        <p className="mt-6 md:text-lg">
          Nous travaillons main dans la main avec vos équipes pour apporter de la clarté, accélérer les roadmaps et
          livrer des expériences fiables.
        </p>
      </div>

      <ul className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason) => (
          <li key={reason.title} className="value-item">
            <span className="value-item__node" aria-hidden="true" />
            <reason.icon className="h-5 w-5 text-silver" aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl text-silver-light">{reason.title}</h3>
            <p className="mt-3 text-sm">{reason.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
