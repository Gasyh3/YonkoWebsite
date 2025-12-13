export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  outcomes: string[];
  deliverables: string[];
  timeline: string;
  ctaLabel?: string;
};

export const services: Service[] = [
  {
    slug: "erp-pme-modulaire",
    title: "ERP PME modulaire",
    shortDescription:
      "Centralisez ventes, facturation, paiements, stocks, achats, reporting et audit log avec des modules activables.",
    description:
      "Un ERP pensé pour les PME qui veulent structurer leurs opérations sans lourdeur : CRM, devis/factures, paiements, inventaire, fournisseurs, RH léger, tâches/planification, dashboards et audit trail natif. Modules optionnels pour s’adapter à votre cadence.",
    benefits: [
      "Socle unique pour piloter ventes, finance et opérations",
      "Modules activables selon votre maturité",
      "Traçabilité et conformité (audit log, rôles, permissions)",
    ],
    outcomes: [
      "Processus fiables de la vente à l’encaissement",
      "Visibilité temps réel sur stocks et trésorerie",
      "Réduction des tâches manuelles via automatisations",
    ],
    deliverables: [
      "Ateliers métier, cartographie des flux et paramétrage initial",
      "Modules activés (sales, invoicing, paiements, inventaire, fournisseurs, HR-lite, tasks)",
      "Dashboards opérationnels et audit log configuré",
    ],
    timeline:
      "Mise en place progressive : 4 à 10 semaines selon le nombre de modules activés et les interfaces nécessaires.",
    ctaLabel: "Découvrir l’ERP PME",
  },
  {
    slug: "saas-cle-en-main-nextjs",
    title: "SaaS clé en main (Next.js)",
    shortDescription:
      "Base produit prête à lancer : Stripe paiements/abonnements, Better Auth, base de données, analytics, emails, landing, blog et docs.",
    description:
      "Un socle SaaS complet pour réduire le time-to-market : Next.js full stack, authentification Better Auth, Stripe pour paiements et abonnements, base de données intégrée, analytics, emails automatisés, landing page, blog et documentation.",
    benefits: [
      "Monétisation prête (paiements, abonnements, taxes)",
      "Sécurité et auth gérées (Better Auth, rôles, permissions)",
      "Content et support intégrés (landing, blog, docs, emails)",
    ],
    outcomes: [
      "MVP live rapidement avec tracking analytique",
      "Flux d’onboarding, upgrade/downgrade et facturation fiables",
      "Base de code maintenable et documentée",
    ],
    deliverables: [
      "Architecture Next.js full stack avec DB et auth configurées",
      "Intégration Stripe (checkout, billing portal, webhooks)",
      "Landing, blog, documentation et workflows email",
    ],
    timeline:
      "Lancement accéléré : 3 à 8 semaines selon le périmètre fonctionnel et les intégrations tierces.",
    ctaLabel: "Lancer mon SaaS",
  },
  {
    slug: "seo-rebranding-acquisition",
    title: "SEO, rebranding & acquisition",
    shortDescription:
      "Audit SEO, repositionnement de marque et plan d’acquisition pour gagner en visibilité et conversion.",
    description:
      "Nous analysons votre positionnement, le contenu et la technique pour bâtir une visibilité durable : audit SEO, refonte éditoriale, rebranding orienté conversion et plan d’acquisition priorisé.",
    benefits: [
      "Audit SEO complet et recommandations actionnables",
      "Narratif et identité cohérents avec vos cibles",
      "Pages optimisées pour la conversion (landing, blog, resources)",
    ],
    outcomes: [
      "Gains de visibilité organique sur vos requêtes clés",
      "Taux de conversion amélioré grâce au repositionnement",
      "Backlog d’optimisations avec priorisation business",
    ],
    deliverables: [
      "Audit technique et sémantique, plan d’actions SEO",
      "Guidelines de marque, ton éditorial, maquettes clés",
      "Calendrier éditorial et templates optimisés conversion",
    ],
    timeline:
      "Déploiement en vagues : 3 à 6 semaines pour l’audit et la refonte initiale, puis itérations mensuelles.",
    ctaLabel: "Booster ma visibilité",
  },
  {
    slug: "communication-reseaux-sociaux",
    title: "Communication & réseaux sociaux",
    shortDescription:
      "Stratégie éditoriale, calendrier de publication, contenus et suivi des performances sur vos canaux.",
    description:
      "Nous définissons une ligne éditoriale claire, produisons les contenus et animons vos réseaux avec un suivi serré des KPI pour itérer vite.",
    benefits: [
      "Ligne éditoriale alignée business",
      "Production continue de contenus",
      "Pilotage par la performance (KPI & itérations)",
    ],
    outcomes: [
      "Présence cohérente sur les canaux clés (LinkedIn, blog, newsletter)",
      "Engagement et reach en hausse grâce à des formats testés",
      "Boucle d’amélioration via reporting périodique",
    ],
    deliverables: [
      "Charte éditoriale, piliers de contenu et messaging",
      "Calendrier mensuel et production des posts/visuels",
      "Tableau de bord des performances et recommandations",
    ],
    timeline:
      "Phase de cadrage : 2 semaines. Animation et reporting sur des cycles mensuels avec revues hebdomadaires.",
    ctaLabel: "Structurer ma communication",
  },
];

export const getServiceBySlug = (slug: string) =>
  services.find((service) => service.slug === slug);
