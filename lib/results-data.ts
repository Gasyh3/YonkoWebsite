// Section Résultats (C8). Tant qu'il n'y a pas de client, les chiffres sont des engagements vérifiables (pas des
// statistiques) et aucun projet n'est montré. Les vraies réalisations (cartes, pages /projets/[slug], morph de
// page) se réactiveront depuis l'historique git dès qu'elles existeront.

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
