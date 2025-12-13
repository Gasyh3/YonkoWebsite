import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const values = [
  {
    title: "Transparence",
    description:
      "Communication claire, jalons visibles et décisions partagées — sans jargon inutile.",
  },
  {
    title: "Exigence",
    description:
      "Qualité, sécurité, performance et UX intégrées dès le départ (pas en “phase 2”).",
  },
  {
    title: "Impact",
    description:
      "Chaque livraison est reliée à un indicateur métier : temps gagné, erreurs réduites, meilleure conversion.",
  },
];

const approach = [
  {
    title: "Découverte",
    description:
      "Comprendre vos opérations, vos objectifs business et vos contraintes terrain (process, équipes, outils).",
  },
  {
    title: "Conception",
    description:
      "Cadrage clair, architecture, UX, choix techniques et plan d’exécution pragmatique.",
  },
  {
    title: "Livraison & suivi",
    description:
      "Delivery incrémental, mesure des gains et amélioration continue (qualité, performance, adoption).",
  },
];

export default function AboutPage() {
  return (
    <div className="container space-y-12 py-12">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          À propos
        </p>

        <h1 className="section-heading">Yonko Tech Consulting</h1>

        <p className="text-lg text-muted-foreground">
          Fondé en <strong>2025</strong>, Yonko accompagne les entreprises dans la
          création de <strong>solutions digitales B2B</strong> : ERP modulaires,
          SaaS clé en main (Next.js), et outils internes orientés productivité.
        </p>

        <p className="text-sm text-muted-foreground">
          Notre point de départ : un constat très concret à Madagascar — beaucoup
          d’entreprises perdent du temps et de la marge à cause de processus
          manuels, d’outils non connectés et d’un manque de visibilité sur
          l’activité. Notre mission : <strong>améliorer la production</strong> en
          digitalisant ce qui compte vraiment (opérations, vente, facturation,
          pilotage).
        </p>
      </div>

      <Card className="border-primary/30 bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">
            Mission, vision, valeurs
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Notre expertise</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              - <strong>ERP PME</strong> : clients, devis, facturation, paiements,
              produits & stocks, achats, reporting, rôles & traçabilité.
            </p>
            <p>
              - <strong>SaaS Next.js clé en main</strong> : Stripe (paiements &
              abonnements), Better Auth, base de données, analytics, emails automatisés,
              landing, blog et documentation.
            </p>
            <p>
              - <strong>SEO & rebranding</strong> : audit, repositionnement, optimisation
              du contenu et des pages pour gagner en visibilité et conversion.
            </p>
            <p>
              - <strong>Réseaux sociaux</strong> : stratégie éditoriale, calendrier,
              création de contenus et suivi des performances.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Notre approche</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            {approach.map((step, index) => (
              <div key={step.title} className="space-y-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <h4 className="text-base font-semibold text-foreground">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-secondary via-black to-secondary p-10 shadow-sm">
        <p className="text-2xl font-semibold text-primary">
          Des gains mesurables grâce au digital
        </p>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          En digitalisant les processus clés (vente, facturation, pilotage, opérations),
          on réduit les frictions, on fiabilise la donnée, et on libère du temps pour la production.
          Notre approche : livrer vite, mesurer, itérer.
        </p>

        {/* Stats cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-dashed border-primary/30 bg-secondary/40 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
              Productivité
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">+18%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gains observés sur l’efficacité opérationnelle avec des outils type ERP et workflows standardisés.
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-primary/30 bg-secondary/40 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
              Coûts & pertes
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">-10 à -30%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Réduction des coûts opérationnels via automatisation, centralisation et meilleure traçabilité.
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-primary/30 bg-secondary/40 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
              Reporting
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">x1.6</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Production de rapports et suivi d’activité accélérés grâce à une donnée fiable et accessible.
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
          Ces chiffres varient selon le secteur et l’existant, mais ils donnent un ordre de grandeur.
          Notre objectif : obtenir des résultats comparables dans votre contexte (PME, contraintes terrain, équipes).
        </p>
      </div>

    </div>
  );
}
