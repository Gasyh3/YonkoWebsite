import type { IntakeStatus } from "@/lib/questionnaire/statuses";

// Libellés des statuts d'un dossier (administration).
export const STATUS_LABELS: Record<IntakeStatus, string> = {
  invite: "Invité",
  en_cours: "En cours",
  soumis: "Soumis",
  devis_envoye: "Devis envoyé",
  gagne: "Gagné",
  perdu: "Perdu",
  archive: "Archivé",
};
