// Pages Expertises (/expertises, /expertises/[slug]) : une page par service du concept (voir CLAUDE.md).
// Contenus fictifs, tous [à adapter] : ils posent la structure en attendant les textes définitifs.
// Les pages v1 (/services, lib/services-data.ts) restent inchangées.

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
  steps: { title: string; duration: string; text: string }[];
};

export const expertises: Expertise[] = [
  {
    slug: "strategie-de-communication",
    index: "00",
    title: "Stratégie de communication",
    promise: "Le pilier qui pilote tout.",
    summary: "[à adapter] Un plan clair avant d'investir dans le moindre outil.",
    lead: "[à adapter] Avant de construire un site ou un logiciel, on pose le plan : qui sont vos clients, où vous cherchent-ils, et quel message les fait venir. Tout le reste en découle.",
    scene: null,
    includes: [
      { title: "Audit de présence", text: "[à adapter] Site, fiche Google, réseaux, concurrents : ce qui marche et ce qui freine." },
      { title: "Positionnement et message", text: "[à adapter] Ce que vous dites, à qui, et pourquoi on doit vous choisir." },
      { title: "Plan d'action priorisé", text: "[à adapter] Les chantiers dans l'ordre, avec le résultat attendu pour chacun." },
      { title: "Pilotage mensuel", text: "[à adapter] Un point régulier, des chiffres simples, des ajustements concrets." },
    ],
    audiences: [
      { title: "Commerçants", text: "[à adapter] Vous voulez plus de passage en boutique, sans multiplier les dépenses." },
      { title: "Artisans", text: "[à adapter] Vous êtes débordés de travail ou de devis non signés : il faut mieux choisir." },
      { title: "Professions libérales", text: "[à adapter] Votre réputation se joue en ligne avant le premier rendez-vous." },
    ],
    steps: [
      { title: "Audit", duration: "[à adapter] 1 semaine", text: "[à adapter] Entretien, état des lieux, premiers constats." },
      { title: "Plan", duration: "[à adapter] 1 semaine", text: "[à adapter] Feuille de route chiffrée et priorisée." },
      { title: "Pilotage", duration: "[à adapter] Mensuel", text: "[à adapter] Mesure, ajustements, compte rendu." },
    ],
  },
  {
    slug: "site-vitrine-et-seo",
    index: "01",
    title: "Site vitrine et SEO",
    promise: "Être vu.",
    summary: "[à adapter] Un site rapide et bien référencé, en haut des résultats.",
    lead: "[à adapter] Un site clair, rapide et pensé pour Google : quand un client cherche votre métier dans votre ville, c'est vous qu'il trouve en premier, et il sait tout de suite comment vous contacter.",
    scene: "seo",
    includes: [
      { title: "Site sur mesure", text: "[à adapter] Design soigné, textes qui parlent à vos clients, mobile d'abord." },
      { title: "Référencement local", text: "[à adapter] Pages optimisées pour vos services et votre zone." },
      { title: "Performance", text: "[à adapter] Chargement rapide, scores Google au vert." },
      { title: "Suivi des contacts", text: "[à adapter] Appels, formulaires, itinéraires : on mesure ce qui compte." },
    ],
    audiences: [
      { title: "Commerçants", text: "[à adapter] Horaires, produits, accès : l'essentiel visible en un coup d'œil." },
      { title: "Artisans", text: "[à adapter] Vos réalisations mises en valeur, des demandes de devis qualifiées." },
      { title: "Professions libérales", text: "[à adapter] Une présence sérieuse, conforme, rassurante." },
    ],
    steps: [
      { title: "Maquette", duration: "[à adapter] 2 semaines", text: "[à adapter] Structure, textes, design validés ensemble." },
      { title: "Construction", duration: "[à adapter] 3 semaines", text: "[à adapter] Développement, référencement, tests." },
      { title: "Mise en ligne", duration: "[à adapter] 1 semaine", text: "[à adapter] Lancement, suivi des premières positions." },
    ],
  },
  {
    slug: "google-maps-et-visibilite-locale",
    index: "02",
    title: "Google Maps et visibilité locale",
    promise: "Être trouvé.",
    summary: "[à adapter] Votre établissement en tête de la carte, près de chez vos clients.",
    lead: "[à adapter] Quand un client cherche « près de moi », la carte décide. On soigne votre fiche Google, vos avis et vos informations pour que votre établissement ressorte en premier.",
    scene: "maps",
    includes: [
      { title: "Fiche Google optimisée", text: "[à adapter] Catégories, photos, horaires, services : complets et à jour." },
      { title: "Avis clients", text: "[à adapter] Une méthode simple pour en obtenir plus, et y répondre." },
      { title: "Annuaires locaux", text: "[à adapter] Des informations cohérentes partout où l'on vous cherche." },
      { title: "Suivi des appels et itinéraires", text: "[à adapter] Les demandes générées par la carte, chaque mois." },
    ],
    audiences: [
      { title: "Commerçants", text: "[à adapter] Boulangerie, fleuriste, restaurant : être le premier choix du quartier." },
      { title: "Artisans", text: "[à adapter] Plombier, électricien, garage : être appelé en priorité." },
      { title: "Professions libérales", text: "[à adapter] Cabinet, étude, agence : être trouvé et bien noté." },
    ],
    steps: [
      { title: "Diagnostic", duration: "[à adapter] 3 jours", text: "[à adapter] Position actuelle, concurrents, mots recherchés." },
      { title: "Optimisation", duration: "[à adapter] 2 semaines", text: "[à adapter] Fiche, photos, avis, annuaires." },
      { title: "Suivi", duration: "[à adapter] Mensuel", text: "[à adapter] Positions, appels, itinéraires." },
    ],
  },
  {
    slug: "logiciel-sur-mesure",
    index: "03",
    title: "Logiciel interne sur mesure",
    promise: "Être efficace.",
    summary: "[à adapter] Un outil taillé pour votre activité, qui fait gagner des heures.",
    lead: "[à adapter] Devis, planning, clients, facturation, stock : un seul outil, simple, conçu autour de votre façon de travailler. Moins de ressaisies, moins d'oublis, plus de temps pour votre métier.",
    scene: "software",
    includes: [
      { title: "Modules à la carte", text: "[à adapter] Planning, clients, facturation, stock : seulement ce qui vous sert." },
      { title: "Accès partout", text: "[à adapter] Sur ordinateur, tablette et téléphone, au bureau ou sur le chantier." },
      { title: "Reprise de vos données", text: "[à adapter] Vos fichiers existants importés, sans repartir de zéro." },
      { title: "Accompagnement", text: "[à adapter] Prise en main, formation, évolutions au fil du temps." },
    ],
    audiences: [
      { title: "Commerçants", text: "[à adapter] Stock et ventes suivis sans tableur." },
      { title: "Artisans", text: "[à adapter] Devis et factures faits en quelques minutes, même sur le chantier." },
      { title: "Professions libérales", text: "[à adapter] Rendez-vous, dossiers et facturation au même endroit." },
    ],
    steps: [
      { title: "Cadrage", duration: "[à adapter] 1 semaine", text: "[à adapter] Vos tâches du quotidien, ce qui fait perdre du temps." },
      { title: "Prototype", duration: "[à adapter] 3 semaines", text: "[à adapter] Une première version utilisable, testée avec vous." },
      { title: "Déploiement", duration: "[à adapter] 2 semaines", text: "[à adapter] Mise en service, formation, ajustements." },
    ],
  },
];

export const getExpertise = (slug: string) => expertises.find((e) => e.slug === slug);

// Expertise suivante (bas de page) : boucle sur la liste.
export const nextExpertise = (slug: string) => {
  const i = expertises.findIndex((e) => e.slug === slug);
  return expertises[(i + 1) % expertises.length];
};
