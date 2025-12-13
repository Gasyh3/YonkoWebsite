import { type ReactNode } from "react";

export type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
  category: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "what-is-erp",
    category: "ERP PME",
    question: "Qu’est-ce qu’un ERP ?",
    answer: (
      <p>
        Un ERP centralise vos opérations (ventes, facturation, paiements, achats, stocks, reporting) dans un
        seul outil. Résultat : moins de doubles saisies, moins d’erreurs, une donnée fiable, et une vision
        claire de l’activité.
      </p>
    ),
  },
  {
    id: "erp-for-who",
    category: "ERP PME",
    question: "À qui s’adresse votre ERP pour PME ?",
    answer: (
      <p>
        Aux PME qui veulent structurer leur gestion et gagner du temps : quand Excel devient fragile,
        que les outils ne communiquent pas, ou que le suivi (factures, stocks, paiements) est trop manuel.
      </p>
    ),
  },
  {
    id: "erp-standard-modules",
    category: "ERP PME",
    question: "Quels modules l’ERP inclut en standard ?",
    answer: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Clients : CRM léger, devis, factures, avoirs, paiements.</li>
        <li>Produits/Services : catalogue, tarifs, TVA, statuts.</li>
        <li>Achats : fournisseurs, commandes, réception (selon besoin).</li>
        <li>Stocks : entrées/sorties, alertes, mouvements, inventaire (option si nécessaire).</li>
        <li>Pilotage : tableaux de bord, exports (PDF/CSV/Excel selon ton implémentation).</li>
        <li>Gouvernance : rôles/permissions et traçabilité (audit log).</li>
      </ul>
    ),
  },
  {
    id: "erp-customization",
    category: "ERP PME",
    question: "Peut-on personnaliser l’ERP et le faire évoluer ?",
    answer: (
      <p>
        Oui. L’ERP est modulaire : nous adaptons les champs, statuts, workflows, rôles, rapports et
        automatisations. Vous pouvez démarrer “simple” (facturation + suivi) puis ajouter des modules au fil
        de la croissance.
      </p>
    ),
  },
  {
    id: "erp-automation",
    category: "ERP PME",
    question: "Pouvez-vous automatiser des tâches (relances, validations, alertes) ?",
    answer: (
      <p>
        Oui : relances de factures, alertes de seuil de stock, notifications internes, validation de devis,
        conversion devis → facture, exports comptables, etc. On automatise ce qui fait gagner du temps et
        réduit les erreurs.
      </p>
    ),
  },
  {
    id: "erp-migration",
    category: "ERP PME",
    question: "Gérez-vous la migration depuis Excel ou des outils existants ?",
    answer: (
      <p>
        Oui. Nous préparons des gabarits d’import, nettoyons les données, alignons les référentiels (clients,
        produits, stocks) et validons un test complet (dry-run) avant la bascule.
      </p>
    ),
  },
  {
    id: "erp-multi-users",
    category: "ERP PME",
    question: "Peut-on gérer plusieurs rôles et accès (admin, manager, employé) ?",
    answer: (
      <p>
        Oui. Nous mettons en place une gestion des permissions (RBAC) pour contrôler qui peut voir, créer,
        modifier ou supprimer certaines informations (factures, stocks, utilisateurs, etc.).
      </p>
    ),
  },
  {
    id: "erp-mobile",
    category: "ERP PME",
    question: "L’ERP est-il accessible sur mobile ?",
    answer: (
      <p>
        Oui, l’interface peut être responsive. Si vous avez des usages terrain (consultation rapide,
        saisie simplifiée), nous pouvons prévoir des vues adaptées.
      </p>
    ),
  },

  {
    id: "what-is-saas",
    category: "SaaS Next.js",
    question: "Qu’est-ce qu’un SaaS clé en main ?",
    answer: (
      <p>
        Un SaaS est un logiciel accessible en ligne (souvent par abonnement). Notre “SaaS clé en main”
        fournit une base produit prête à lancer : auth, paiements, base de données, analytics et les pages
        marketing essentielles.
      </p>
    ),
  },
  {
    id: "saas-package",
    category: "SaaS Next.js",
    question: "Que comprend l’offre SaaS clé en main ?",
    answer: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Next.js full stack (architecture prête à scaler).</li>
        <li>Authentification Better Auth + rôles/permissions.</li>
        <li>Stripe : paiements, abonnements, portail client, webhooks.</li>
        <li>Base de données + modèle propre à votre produit.</li>
        <li>Analytics : suivi de l’usage, KPI, événements (selon stack).</li>
        <li>Landing page, blog, documentation.</li>
        <li>Emails automatisés (onboarding, notifications, paiement, etc.).</li>
      </ul>
    ),
  },
  {
    id: "saas-stripe",
    category: "SaaS Next.js",
    question: "Gérez-vous les abonnements Stripe et la logique d’accès par plan ?",
    answer: (
      <p>
        Oui. Nous intégrons Stripe (plans, upgrades/downgrades, annulations, webhooks) et mettons en place la
        logique d’accès côté app (features verrouillées, quotas, permissions, etc.).
      </p>
    ),
  },
  {
    id: "saas-auth",
    category: "SaaS Next.js",
    question: "Pourquoi Better Auth pour l’authentification ?",
    answer: (
      <p>
        Better Auth permet de construire une authentification moderne et sécurisée. Nous configurons aussi
        les permissions et la protection des routes/API en fonction de votre produit (admin, user, etc.).
      </p>
    ),
  },
  {
    id: "saas-emails",
    category: "SaaS Next.js",
    question: "Quels emails automatisés mettez-vous en place ?",
    answer: (
      <p>
        Typiquement : bienvenue, confirmation, reset password, notifications d’abonnement/paiement,
        onboarding, relances, alertes produit. Les triggers et contenus sont adaptés à votre parcours.
      </p>
    ),
  },
  {
    id: "saas-marketing-pages",
    category: "SaaS Next.js",
    question: "Pourquoi inclure landing page, blog et documentation ?",
    answer: (
      <p>
        Parce qu’un SaaS doit aussi convertir et être adopté. La landing clarifie la proposition de valeur,
        le blog aide le SEO, et la documentation réduit le support et accélère l’onboarding.
      </p>
    ),
  },

  {
    id: "erp-vs-saas",
    category: "Positionnement",
    question: "ERP vs SaaS : quelle différence ?",
    answer: (
      <p>
        L’ERP structure votre gestion interne (process, opérations, reporting). Le SaaS est un produit
        destiné à vos utilisateurs finaux, généralement monétisé par abonnement. Les deux peuvent coexister :
        ERP interne + SaaS client.
      </p>
    ),
  },
  {
    id: "which-to-choose",
    category: "Positionnement",
    question: "Comment choisir entre ERP et SaaS ?",
    answer: (
      <p>
        Si votre objectif est d’optimiser l’exécution interne (facturation, suivi, stocks, achats), partez
        sur l’ERP. Si vous voulez lancer une plateforme vendue à des clients/utilisateurs, partez sur le SaaS.
        On valide le choix lors du cadrage.
      </p>
    ),
  },

  {
    id: "seo-branding-social",
    category: "Acquisition",
    question: "Proposez-vous aussi SEO, rebranding et réseaux sociaux ?",
    answer: (
      <p>
        Oui. Nous pouvons accompagner votre visibilité digitale : audit SEO, optimisation des pages,
        rebranding (positionnement + messages), et stratégie/gestion de réseaux sociaux (calendrier, contenus,
        suivi KPI).
      </p>
    ),
  },

  {
    id: "ownership",
    category: "Gouvernance",
    question: "Qui possède le code et les données ?",
    answer: (
      <p>
        Vous êtes propriétaire du code et des données. Le dépôt peut être sur votre organisation, et la base
        peut être hébergée sur votre compte (ou opérée par nous avec export possible à tout moment).
      </p>
    ),
  },
  {
    id: "hosting",
    category: "Ops & sécurité",
    question: "Qui gère l’hébergement ?",
    answer: (
      <p>
        Au choix : nous opérons l’hébergement (sur un compte au nom du client) ou nous vous accompagnons pour
        héberger vous-même. Déploiements, logs, sauvegardes et supervision sont documentés.
      </p>
    ),
  },
  {
    id: "security",
    category: "Ops & sécurité",
    question: "Sécurité : auth, permissions, sauvegardes, audit log ?",
    answer: (
      <p>
        Authentification sécurisée, rôles/permissions, audit log des actions clés, sauvegardes planifiées,
        chiffrement en transit, et bonnes pratiques OWASP. L’objectif : une base saine, maintenable, et
        adaptée à vos risques.
      </p>
    ),
  },
  {
    id: "timeline",
    category: "Pilotage",
    question: "Combien de temps dure un projet ?",
    answer: (
      <p>
        Cela dépend du périmètre. En pratique, un MVP SaaS se fait souvent en quelques semaines, et un ERP
        peut aller de quelques semaines à quelques mois selon modules, migration et intégrations. Les jalons
        sont définis lors du cadrage (ateliers + backlog priorisé).
      </p>
    ),
  },
  {
    id: "maintenance",
    category: "Pilotage",
    question: "Comment fonctionnent maintenance et support ?",
    answer: (
      <p>
        Contrat de run optionnel : correctifs, mises à jour, surveillance, sauvegardes, assistance
        produit/technique, et évolutions planifiées. Le niveau de service (SLA) est adapté à vos enjeux.
      </p>
    ),
  },
  {
    id: "integrations",
    category: "Intégrations",
    question: "Pouvez-vous intégrer des outils tiers (CRM, compta, paiement, email) ?",
    answer: (
      <p>
        Oui. Nous intégrons des outils via API (CRM, compta, emailing, analytics, paiements, webhooks).
        Nous priorisons les intégrations utiles, stables et maintenables pendant le cadrage.
      </p>
    ),
  },
];
