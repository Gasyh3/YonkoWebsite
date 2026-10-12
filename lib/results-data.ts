// Section Résultats (C8). Tant qu'il n'y a pas de résultats clients publiables, les chiffres sont des engagements
// vérifiables (pas des statistiques) et les projets sont des cas d'usage présentés comme tels : à remplacer par de
// vraies réalisations dès qu'elles existent (même structure).

export type ResultStat = {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
};

export const resultStats: ResultStat[] = [
  { value: 24, suffix: " h", label: "pour répondre à chaque demande" },
  { value: 1, label: "seul interlocuteur, du premier appel au suivi" },
  { value: 3, label: "leviers pilotés par une même stratégie" },
];

export const formatStat = (stat: ResultStat, value = stat.value) =>
  `${stat.prefix ?? ""}${value}${stat.suffix ?? ""}`;

export type Project = {
  slug: string;
  title: string;
  sector: string;
  service: string;
  result: string; // une ligne : l'objectif visé (cas d'usage) ou le résultat mesuré (réalisation)
  situation: string;
  approach: string;
  tracking: string;
  image: { src: string; alt: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    slug: "boulangerie-artisanale",
    title: "Boulangerie artisanale",
    sector: "Commerce de proximité",
    service: "Site vitrine et SEO",
    result: "Objectif : être trouvée par les gens du quartier",
    situation:
      "Une boulangerie connue de ses habitués, mais invisible en ligne : pas de site, des horaires introuvables, des commandes spéciales prises au téléphone, quand il sonne.",
    approach:
      "Un site vitrine simple et rapide sur mobile : produits, horaires, accès, commandes pour les occasions. Des pages pensées pour les recherches du quartier, et une fiche Google reliée au site.",
    tracking:
      "Les visites du site, les appels et les demandes de commande, pour savoir ce qui fonctionne et ajuster les contenus au fil des saisons.",
    image: { src: "/media/projects/project-seo.svg", alt: "Illustration : page de résultats de recherche", width: 1200, height: 900 },
  },
  {
    slug: "garage-automobile",
    title: "Garage automobile",
    sector: "Artisan",
    service: "Google Maps et visibilité locale",
    result: "Objectif : être appelé en priorité près de chez lui",
    situation:
      "Un garage sérieux, mais une fiche Google incomplète : peu de photos, des horaires datés, des avis sans réponse. Les clients pressés appellent le concurrent mieux présenté.",
    approach:
      "Une fiche complétée et vérifiée, des photos de l'atelier, des services clairement listés, des informations harmonisées partout, et une méthode simple pour demander des avis et y répondre.",
    tracking:
      "Les appels, les demandes d'itinéraire et les visites issues de la fiche, suivis dans le temps pour décider des prochaines actions.",
    image: { src: "/media/projects/project-maps.svg", alt: "Illustration : plan local et fiche établissement", width: 1200, height: 900 },
  },
  {
    slug: "cabinet-kinesitherapie",
    title: "Cabinet de kinésithérapie",
    sector: "Profession libérale",
    service: "Logiciel interne sur mesure",
    result: "Objectif : moins de ressaisies, plus de temps de soin",
    situation:
      "Des rendez-vous dans un agenda, des dossiers dans un autre outil, la facturation dans un tableur : chaque information est saisie deux ou trois fois.",
    approach:
      "Un outil unique, utilisable sur ordinateur et téléphone : planning, fiches patients, facturation. Les fichiers existants sont repris, et chacun n'accède qu'à ce qui le concerne.",
    tracking:
      "Le temps passé sur l'administratif et les oublis évités, observés avec l'équipe du cabinet pour ajuster l'outil.",
    image: { src: "/media/projects/project-software.svg", alt: "Illustration : tableau de bord en quatre modules", width: 1200, height: 900 },
  },
  {
    slug: "institut-de-beaute",
    title: "Institut de beauté",
    sector: "Commerce de proximité",
    service: "Site vitrine et SEO",
    result: "Objectif : simplifier la prise de rendez-vous",
    situation:
      "Des prestations bien notées, mais des rendez-vous pris uniquement par message ou téléphone, souvent en plein soin.",
    approach:
      "Un site vitrine qui présente les prestations et les tarifs, relié à une prise de rendez-vous en ligne, et une fiche Google cohérente avec le site.",
    tracking:
      "La part des rendez-vous pris en ligne et les demandes reçues hors horaires, pour mesurer le temps rendu à l'institut.",
    image: { src: "/media/projects/project-mobile.svg", alt: "Illustration : site vitrine sur ordinateur et mobile", width: 1200, height: 900 },
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
