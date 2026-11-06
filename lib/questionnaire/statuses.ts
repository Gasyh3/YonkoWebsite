// Statuts d'un dossier : module sans dépendance, utilisable par le schéma de base et par le navigateur.
export const INTAKE_STATUSES = ["invite", "en_cours", "soumis", "devis_envoye", "gagne", "perdu", "archive"] as const;
export type IntakeStatus = (typeof INTAKE_STATUSES)[number];
