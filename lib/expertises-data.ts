// Pages Expertises (/expertises, /expertises/[slug]) : une page par service du concept (voir CLAUDE.md).
// Elles reprennent et remplacent les offres v1 (ERP, SaaS, SEO & rebranding, réseaux sociaux), redirigées
// dans next.config.ts. Processus décrits sans engagement de délai ni de résultat chiffré.

import { FAQ_CATEGORIES } from "./faq-data";
import type { SceneId } from "./motion/expertises/geometry";

export type Expertise = {
  slug: string;
  index: string;
  title: string;
  promise: string; // « Être vu. », etc.
  summary: string; // une phrase pour le menu et la page d'index
  lead: string;
  scene: SceneId | null; // visualisation animée réutilisée depuis l'accueil
  includes: { title: string; text: string }[];
  audiences: { title: string; text: string }[];
  steps: { title: string; moment: string; text: string }[];
  deliverables: string[]; // « Ce que vous recevez »
  faqCategory: string; // questions fréquentes affichées en bas de page (lib/faq-data.tsx)
  seo: { title: string; description: string };
};

export const expertises: Expertise[] = [
  {
    slug: "strategie-de-communication",
    index: "00",
    title: "Stratégie de communication",
    promise: "Le pilier qui pilote tout.",
    summary: "Un plan clair avant d'investir : message, canaux et priorités.",
    lead: "Avant de construire un site ou un logiciel, on pose le plan : à qui vous parlez, où ces personnes vous cherchent, et ce qui doit les décider. Votre site, votre fiche Google, vos réseaux et vos outils suivent ensuite la même direction.",
    scene: null,
    includes: [
      { title: "Audit de présence", text: "Site, fiche Google, réseaux, concurrents : un état des lieux de ce qui marche et de ce qui freine." },
      { title: "Positionnement et message", text: "Ce que vous dites, à qui, et pourquoi on doit vous choisir, en mots simples." },
      { title: "Ligne éditoriale", text: "Les sujets, le ton et un rythme de publication que vous pouvez tenir dans la durée." },
      { title: "Plan d'action priorisé", text: "Les chantiers dans l'ordre, chacun relié à l'objectif qu'il doit servir." },
    ],
    audiences: [
      { title: "Commerçants", text: "Faire venir plus de monde en boutique, sans multiplier les dépenses de communication." },
      { title: "Artisans", text: "Être contacté pour les chantiers qui vous intéressent, pas seulement pour des devis." },
      { title: "Professions libérales", text: "Inspirer confiance en ligne avant le premier rendez-vous, dans le respect de votre profession." },
    ],
    steps: [
      { title: "Écoute", moment: "Au démarrage", text: "Un échange pour comprendre votre activité, vos clients et vos objectifs." },
      { title: "Plan", moment: "Ensuite", text: "Une feuille de route écrite et priorisée, que vous gardez." },
      { title: "Suivi", moment: "Dans la durée", text: "Des points réguliers pour mesurer, ajuster et décider de la suite." },
    ],
    deliverables: [
      "Un état des lieux de votre présence en ligne",
      "Votre message et votre positionnement formulés noir sur blanc",
      "Une ligne éditoriale et un calendrier de publication",
      "Une feuille de route priorisée pour les mois à venir",
    ],
    faqCategory: FAQ_CATEGORIES.start,
    seo: {
      title: "Stratégie de communication à Madagascar",
      description:
        "Positionnement, message, ligne éditoriale et plan d'action : une stratégie de communication claire pour les PME, commerçants et artisans à Madagascar.",
    },
  },
  {
    slug: "site-vitrine-et-seo",
    index: "01",
    title: "Site vitrine et SEO",
    promise: "Être vu.",
    summary: "Un site clair et rapide, pensé pour être trouvé sur Google.",
    lead: "Un site vitrine qui dit ce que vous faites, où, et comment vous joindre, sans détour. Il est pensé pour Google dès le départ : structure, contenus et performance travaillent ensemble pour que les bons clients arrivent jusqu'à vous.",
    scene: "seo",
    includes: [
      { title: "Site sur mesure", text: "Un design à votre image, des textes qui parlent à vos clients, pensé d'abord pour le mobile." },
      { title: "Référencement naturel", text: "Structure, contenus et balisage travaillés pour les recherches qui comptent dans votre métier." },
      { title: "Performance", text: "Des pages légères et rapides, sur tous les écrans et toutes les connexions." },
      { title: "Contact facilité", text: "Appel, e-mail, formulaire, itinéraire : chaque page mène à une prise de contact." },
    ],
    audiences: [
      { title: "Commerçants", text: "Horaires, produits, accès : l'essentiel visible en un coup d'œil." },
      { title: "Artisans", text: "Vos réalisations mises en valeur, des demandes de devis plus précises." },
      { title: "Professions libérales", text: "Une présence sobre et rassurante, qui explique votre pratique." },
    ],
    steps: [
      { title: "Maquette", moment: "Au démarrage", text: "Structure, textes et design validés ensemble avant de construire." },
      { title: "Construction", moment: "En cours de projet", text: "Le site prend forme ; vous suivez et validez chaque étape." },
      { title: "Mise en ligne", moment: "À la livraison", text: "Lancement, vérifications et premiers réglages pour Google." },
    ],
    deliverables: [
      "Un site responsive, rapide et sécurisé (HTTPS)",
      "Des pages optimisées pour vos services et votre zone",
      "Le site déclaré à Google et ses outils de suivi en place",
      "Les accès complets : le site et le nom de domaine sont à vous",
    ],
    faqCategory: FAQ_CATEGORIES.site,
    seo: {
      title: "Création de site vitrine et SEO à Madagascar",
      description:
        "Création de site vitrine rapide et bien référencé, à Antananarivo et partout à Madagascar : design sur mesure, référencement naturel, pensé pour le mobile.",
    },
  },
  {
    slug: "google-maps-et-visibilite-locale",
    index: "02",
    title: "Google Maps et visibilité locale",
    promise: "Être trouvé.",
    summary: "Une fiche Google complète et soignée, pour être trouvé près de chez vous.",
    lead: "Quand un client cherche « près de moi », la carte décide souvent avant le site. On soigne votre fiche d'établissement, vos informations et vos avis pour que vous apparaissiez avec une présentation complète et digne de confiance.",
    scene: "maps",
    includes: [
      { title: "Fiche d'établissement", text: "Catégories, photos, horaires, services et zone desservie : complets et à jour." },
      { title: "Avis clients", text: "Une méthode simple pour en recevoir davantage, et pour y répondre avec soin." },
      { title: "Informations cohérentes", text: "Les mêmes nom, coordonnées et horaires partout où l'on vous cherche." },
      { title: "Suivi", text: "Les appels, visites du site et demandes d'itinéraire générés par la fiche." },
    ],
    audiences: [
      { title: "Commerçants", text: "Restaurant, boutique, salon : être visible quand on cherche autour de soi." },
      { title: "Artisans", text: "Même sans local ouvert au public, une zone desservie suffit pour exister sur la carte." },
      { title: "Professions libérales", text: "Cabinet, étude : des informations exactes et des avis qui rassurent." },
    ],
    steps: [
      { title: "Diagnostic", moment: "Au démarrage", text: "Votre fiche actuelle, vos concurrents proches et les recherches de vos clients." },
      { title: "Optimisation", moment: "En cours de projet", text: "Fiche complétée, photos, informations harmonisées, méthode pour les avis." },
      { title: "Suivi", moment: "Dans la durée", text: "Mises à jour, réponses aux avis et lecture des statistiques de la fiche." },
    ],
    deliverables: [
      "Une fiche Google créée ou reprise, puis complétée",
      "Des photos et des descriptions cohérentes avec votre site",
      "Des modèles de demande d'avis et de réponse",
      "Un point régulier sur les statistiques de la fiche",
    ],
    faqCategory: FAQ_CATEGORIES.maps,
    seo: {
      title: "Google Maps et visibilité locale à Madagascar",
      description:
        "Fiche Google complète, avis clients et informations cohérentes : soyez trouvé sur Google Maps par les clients qui vous cherchent, à Madagascar et ailleurs.",
    },
  },
  {
    slug: "logiciel-sur-mesure",
    index: "03",
    title: "Logiciel interne sur mesure",
    promise: "Être efficace.",
    summary: "Un outil simple, taillé pour votre activité, qui réduit les ressaisies.",
    lead: "Devis, planning, clients, facturation, stock : un seul outil, conçu autour de votre façon de travailler. On commence par l'essentiel, puis il évolue avec vous, module par module.",
    scene: "software",
    includes: [
      { title: "Modules à la carte", text: "Clients, devis et factures, paiements, stock, achats, planning : seulement ce qui vous sert." },
      { title: "Accès partout", text: "Sur ordinateur, tablette et téléphone, au bureau comme sur le terrain." },
      { title: "Reprise de vos données", text: "Vos fichiers existants importés, pour ne pas repartir de zéro." },
      { title: "Rôles et historique", text: "Chacun voit ce qui le concerne ; les actions importantes sont conservées." },
    ],
    audiences: [
      { title: "Commerçants", text: "Stock, ventes et commandes suivis sans tableur." },
      { title: "Artisans", text: "Devis et factures préparés rapidement, même en déplacement." },
      { title: "Professions libérales", text: "Rendez-vous, dossiers et facturation au même endroit." },
    ],
    steps: [
      { title: "Cadrage", moment: "Au démarrage", text: "Vos tâches du quotidien, et ce qui vous fait perdre du temps." },
      { title: "Première version", moment: "En cours de projet", text: "Un premier outil utilisable, testé avec vous sur des cas réels." },
      { title: "Mise en service", moment: "Dans la durée", text: "Prise en main, ajustements, puis de nouveaux modules si besoin." },
    ],
    deliverables: [
      "Un atelier de cadrage et la carte de vos façons de travailler",
      "Les modules choisis, réglés pour votre activité",
      "Des tableaux de bord pour suivre l'essentiel",
      "Une prise en main accompagnée",
    ],
    faqCategory: FAQ_CATEGORIES.software,
    seo: {
      title: "Logiciel de gestion sur mesure pour PME",
      description:
        "Devis, factures, stock, planning, clients : un logiciel de gestion sur mesure pour PME à Madagascar, utilisable sur mobile et conçu autour de votre activité.",
    },
  },
];

export const getExpertise = (slug: string) => expertises.find((e) => e.slug === slug);

// Expertise suivante (bas de page) : boucle sur la liste.
export const nextExpertise = (slug: string) => {
  const i = expertises.findIndex((e) => e.slug === slug);
  return expertises[(i + 1) % expertises.length];
};
