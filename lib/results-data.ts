// Section Résultats et projets (C8). Contenus provisoires : chiffres, projets et visuels sont [à remplacer].

export type ResultStat = {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
};

export const resultStats: ResultStat[] = [
  { prefix: "+", value: 240, suffix: " %", label: "d'appels entrants [à remplacer]" },
  { prefix: "Top ", value: 3, label: "sur Google, dans sa ville [à remplacer]" },
  { value: 12, suffix: " h", label: "gagnées par semaine [à remplacer]" },
];

export const formatStat = (stat: ResultStat, value = stat.value) =>
  `${stat.prefix ?? ""}${value}${stat.suffix ?? ""}`;

export type Project = {
  title: string;
  sector: string;
  service: string;
  result: string;
  image: { src: string; alt: string; width: number; height: number };
};

export const projects: Project[] = [
  {
    title: "[à remplacer] Boulangerie artisanale",
    sector: "Commerce de proximité",
    service: "Site vitrine et SEO",
    result: "[à remplacer] 1re page Google en 3 mois",
    image: { src: "/media/projects/project-seo.svg", alt: "Visuel provisoire : page de résultats de recherche", width: 1200, height: 900 },
  },
  {
    title: "[à remplacer] Garage automobile",
    sector: "Artisan",
    service: "Google Maps et visibilité locale",
    result: "[à remplacer] 2× plus d'itinéraires demandés",
    image: { src: "/media/projects/project-maps.svg", alt: "Visuel provisoire : plan local et fiche établissement", width: 1200, height: 900 },
  },
  {
    title: "[à remplacer] Cabinet de kinésithérapie",
    sector: "Profession libérale",
    service: "Logiciel interne sur mesure",
    result: "[à remplacer] Planning et facturation centralisés",
    image: { src: "/media/projects/project-software.svg", alt: "Visuel provisoire : tableau de bord en quatre modules", width: 1200, height: 900 },
  },
  {
    title: "[à remplacer] Institut de beauté",
    sector: "Commerce de proximité",
    service: "Site vitrine et réservation",
    result: "[à remplacer] 40 % de réservations en ligne",
    image: { src: "/media/projects/project-mobile.svg", alt: "Visuel provisoire : site vitrine sur ordinateur et mobile", width: 1200, height: 900 },
  },
];
