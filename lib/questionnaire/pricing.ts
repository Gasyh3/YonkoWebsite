import "server-only";

// Annexe interne du questionnaire : grille de chiffrage. Uniquement pour l'administration : ce module est marqué
// « server-only », il ne peut pas être envoyé au navigateur d'un client.
// Les montants ne sont pas encore fixés (« le modèle de prix n'est pas encore tranché ») : à compléter ici.

import type { Answers } from "./definition";
import { answerById } from "./validate";

export type Offer = { id: string; label: string; library: string; setup: string; monthly: string };

export const OFFERS: Offer[] = [
  { id: "erp", label: "ERP — cœur (auth, rôles, tiers, catalogue, factures PDF, e-mail, encaissements, KPI)", library: "template_erp", setup: "", monthly: "" },
  { id: "erp_pack", label: "ERP — pack sectoriel existant (transport/colis)", library: "template_erp + pack", setup: "", monthly: "" },
  { id: "outil", label: "Outil interne / dashboard", library: "template_admin_dashboard", setup: "", monthly: "" },
  { id: "site_vitrine", label: "Site vitrine / landing / portfolio", library: "Famille B (starter non commencé)", setup: "", monthly: "" },
  { id: "site_mariage", label: "Site de mariage", library: "Famille B", setup: "", monthly: "" },
  { id: "boutique", label: "Boutique en ligne", library: "E-commerce (~40 %)", setup: "", monthly: "" },
  { id: "blog", label: "Blog / CMS léger", library: "CMS (~25 %)", setup: "", monthly: "" },
  { id: "devops", label: "Hébergement + déploiement seul", library: "template_devops", setup: "", monthly: "" },
];

const list = (a: Answers, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : []);
const has = (a: Answers, id: string) => {
  const v = a[id];
  return Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.trim() !== "";
};
const text = (a: Answers, ...ids: string[]) => ids.map((id) => answerById(id, a)).filter(Boolean).join(" · ");

// Offres de base correspondant aux services et au type de site cochés.
export function suggestedOffers(a: Answers): Offer[] {
  const services = list(a, "services");
  const ids = new Set<string>();
  if (services.includes("erp")) {
    const metier = `${a.erp_fonctions__other ?? ""}`.toLowerCase();
    ids.add(/colis|transport|livraison/.test(metier) ? "erp_pack" : "erp");
  }
  if (services.includes("outil")) ids.add("outil");
  if (services.includes("site")) {
    const type = a.site_type;
    ids.add(type === "mariage" ? "site_mariage" : type === "boutique" ? "boutique" : type === "blog" ? "blog" : "site_vitrine");
  }
  if (services.includes("hebergement")) ids.add("devops");
  return OFFERS.filter((o) => ids.has(o.id));
}

export type Factor = { label: string; effect: string; detected: boolean; evidence: string };

const OUTSIDE_LIBRARY = ["stock", "planning", "import_excel", "sms", "rh", "compta"];

// Facteurs qui font varier le prix, avec ce que le client a répondu à leur sujet.
export function priceFactors(a: Answers): Factor[] {
  const erp = list(a, "erp_fonctions");
  const contraintes = list(a, "outil_contraintes");
  const outside = erp.filter((f) => OUTSIDE_LIBRARY.includes(f));
  const mobileMoney = /mvola|orange\s*money|airtel/i.test(`${a.erp_paiements ?? ""} ${a.boutique_paiements ?? ""}`);
  const langues = list(a, "langues").length + (has(a, "langues__other") ? 1 : 0);

  return [
    {
      label: "Fonction cochée hors bibliothèque (stock, planning, import Excel, SMS, RH, compta complète)",
      effect: "Fort : développement sur mesure, chiffrer chaque module à part",
      detected: outside.length > 0,
      evidence: outside.length ? answerById("erp_fonctions", { erp_fonctions: outside }) : "",
    },
    {
      label: "Fonction métier spécifique (pack sectoriel à créer)",
      effect: "Fort",
      detected: has(a, "erp_fonctions__other") || has(a, "outil_tache"),
      evidence: text(a, "outil_tache") || `${a.erp_fonctions__other ?? ""}`,
    },
    {
      label: "Reprise de données (volume, qualité des fichiers)",
      effect: "Moyen à fort",
      detected: has(a, "erp_reprise") || erp.includes("import_excel") || has(a, "heberg_reprise"),
      evidence: text(a, "erp_reprise", "heberg_reprise"),
    },
    {
      label: "Intégration avec un outil tiers ou paiement mobile (MVola, Orange Money)",
      effect: "Moyen à fort",
      detected: has(a, "erp_integrations") || contraintes.includes("connexion_outil") || mobileMoney,
      evidence: text(a, "erp_integrations", "erp_paiements", "boutique_paiements"),
    },
    {
      label: "Nombre de profils et de règles d'accès",
      effect: "Moyen",
      detected: erp.includes("roles") || has(a, "outil_profils"),
      evidence: text(a, "erp_utilisateurs", "outil_profils"),
    },
    {
      label: "Usage terrain, mobile ou hors connexion",
      effect: "Moyen à fort",
      detected: list(a, "erp_usage").some((u) => u !== "bureau") || contraintes.includes("hors_connexion"),
      evidence: text(a, "erp_usage", "erp_usage_precision"),
    },
    {
      label: "Données sensibles, authentification renforcée",
      effect: "Moyen",
      detected: contraintes.includes("donnees_sensibles") || contraintes.includes("auth_renforcee"),
      evidence: contraintes.length ? answerById("outil_contraintes", a) : "",
    },
    {
      label: "Textes et photos à créer, pas de charte graphique",
      effect: "Moyen",
      detected: has(a, "site_contenus") || has(a, "site_charte"),
      evidence: text(a, "site_contenus", "site_charte"),
    },
    {
      label: "Nombre de pages, de langues, de produits",
      effect: "Faible à moyen",
      detected: has(a, "site_pages") || has(a, "boutique_produits") || langues > 1,
      evidence: text(a, "site_pages", "boutique_produits", "langues"),
    },
    {
      label: "Date impérative et proche",
      effect: "Majoration urgence",
      detected: has(a, "date_imperative") || has(a, "mariage_date"),
      evidence: text(a, "date_souhaitee", "date_imperative", "mariage_date"),
    },
    {
      label: "Disponibilité 24 h/24, sauvegardes externes, assistance rapide",
      effect: "Se reporte sur l'abonnement mensuel",
      detected:
        has(a, "heberg_disponibilite") || has(a, "heberg_sauvegardes") || list(a, "apres_livraison").some((v) => ["assistance", "maintenance"].includes(v)),
      evidence: text(a, "heberg_disponibilite", "heberg_sauvegardes", "apres_livraison"),
    },
  ];
}

// Points de vigilance avant de s'engager : les généraux, plus ceux que les réponses déclenchent.
export function vigilance(a: Answers): string[] {
  const points: string[] = [];
  const erp = list(a, "erp_fonctions");
  const promised = erp.filter((f) => ["stock", "planning", "import_excel"].includes(f));
  if (promised.length) {
    points.push(
      `Ne jamais présenter comme « prêt » un module absent de la bibliothèque : ${answerById("erp_fonctions", { erp_fonctions: promised }).replace(/\n/g, ", ")} reste à construire.`,
    );
  }
  const familleB = ["vitrine", "landing", "portfolio", "mariage"];
  if (list(a, "services").includes("site") && (!a.site_type || familleB.includes(String(a.site_type)))) {
    points.push("Sites vitrines : le starter famille B n'existe pas encore ; ce projet servira à le construire, prévoir le temps en conséquence.");
  }
  if (a.budget === "moins_1m" || a.budget === "1m_3m") {
    points.push("Budget modeste : s'il est sous la base de l'offre, proposer un découpage en lots plutôt qu'une remise.");
  }
  points.push("Chiffrer la formation et la maintenance sur une ligne séparée, pour qu'elles restent visibles.");
  return points;
}
