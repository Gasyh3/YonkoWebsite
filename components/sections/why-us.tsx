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

export function WhyUs() {
  return (
    <section className="bg-secondary text-foreground py-16">
      <div className="container space-y-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Pourquoi Yonko ?
          </p>
          <h2 className="section-heading text-foreground">
            Des partenaires qui alignent stratégie produit et excellence tech
          </h2>
          <p className="text-lg text-muted-foreground">
            Nous travaillons main dans la main avec vos équipes pour apporter de
            la clarté, accélérer les roadmaps et livrer des expériences fiables.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="group rounded-xl border border-border/80 bg-black/60 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
