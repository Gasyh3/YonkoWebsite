// Questionnaire de cadrage client, décrit comme des données : la même définition sert à l'affichage (étapes,
// conditions), à la validation (navigateur et serveur) et aux récapitulatifs (e-mails, administration).
// Texte fourni par Yonko Tech Consulting (docs : questionnaire de cadrage), sans l'annexe interne de chiffrage,
// qui n'existe que côté administration (lib/questionnaire/pricing.ts).
//
// Modifier une question existante : garder son id (les réponses déjà enregistrées y sont rattachées).
// Changement de structure important : incrémenter QUESTIONNAIRE_VERSION.

export const QUESTIONNAIRE_VERSION = 1;

export type Option = { value: string; label: string };

export type Condition = { field: string; includes?: string; equals?: string };

type Base = { id: string; label: string; hint?: string; required?: boolean };

export type Field =
  | (Base & { kind: "text"; inputType?: "text" | "tel" | "url"; max?: number })
  | (Base & { kind: "textarea"; max?: number })
  | (Base & { kind: "choices"; multiple: boolean; options: Option[]; other?: string });

export type Group = { title?: string; intro?: string; showIf?: Condition; fields: Field[] };

export type Section = { id: string; title: string; intro?: string; showIf?: Condition; groups: Group[] };

export const TEXT_MAX = 300;
export const TEXTAREA_MAX = 3000;
export const otherKey = (fieldId: string) => `${fieldId}__other`;

const text = (id: string, label: string, extra: Partial<Extract<Field, { kind: "text" }>> = {}): Field => ({
  id,
  label,
  kind: "text",
  ...extra,
});
const area = (id: string, label: string, extra: Partial<Extract<Field, { kind: "textarea" }>> = {}): Field => ({
  id,
  label,
  kind: "textarea",
  ...extra,
});
const many = (id: string, label: string, options: Option[], extra: Partial<Extract<Field, { kind: "choices" }>> = {}): Field => ({
  id,
  label,
  kind: "choices",
  multiple: true,
  options,
  ...extra,
});
const one = (id: string, label: string, options: Option[], extra: Partial<Extract<Field, { kind: "choices" }>> = {}): Field => ({
  id,
  label,
  kind: "choices",
  multiple: false,
  options,
  ...extra,
});

export const INTRO = {
  title: "Questionnaire de cadrage",
  lead: "Ce questionnaire nous permet de comprendre votre projet et de vous remettre un devis précis, sans aller-retour inutile. Comptez 15 à 25 minutes.",
  points: [
    "Les étapes s'adaptent aux services que vous cochez : seules les questions utiles s'affichent.",
    "Vos réponses sont enregistrées au fur et à mesure : vous pouvez vous arrêter et reprendre plus tard avec le même lien.",
    "« Je ne sais pas » est une réponse valable : nous en parlerons ensemble lors de l'appel de cadrage.",
    "Vos réponses restent confidentielles et ne servent qu'à préparer notre proposition.",
  ],
};

export const SECTIONS: Section[] = [
  {
    id: "entreprise",
    title: "Votre entreprise",
    groups: [
      {
        fields: [
          text("entreprise_nom", "Nom de l'entreprise / du projet", { required: true }),
          text("secteur", "Secteur d'activité"),
          text("ville_pays", "Ville et pays"),
          text("contact_nom", "Votre nom", { required: true }),
          text("contact_fonction", "Votre fonction"),
          text("contact_telephone", "Téléphone", { inputType: "tel" }),
          text("contact_whatsapp", "WhatsApp", { inputType: "tel", hint: "Si différent du téléphone." }),
          text("decideur", "Qui prend la décision finale ?"),
          text("employes", "Nombre d'employés"),
          text("sites_agences", "Nombre de sites ou d'agences"),
          area("liens_existants", "Site web ou réseaux sociaux existants (liens)", { max: 1000 }),
          text("source", "Comment nous avez-vous connus ?"),
          one("taille", "Taille de l'entreprise", [
            { value: "independant", label: "Indépendant / particulier" },
            { value: "tpe", label: "TPE (1 à 9 personnes)" },
            { value: "pme", label: "PME (10 à 49 personnes)" },
            { value: "grande", label: "Entreprise de 50 personnes et plus" },
          ]),
          many(
            "langues",
            "Langue(s) de travail souhaitées pour la solution",
            [
              { value: "fr", label: "Français" },
              { value: "mg", label: "Malagasy" },
              { value: "en", label: "Anglais" },
            ],
            { other: "Autre" },
          ),
        ],
      },
    ],
  },
  {
    id: "besoin",
    title: "Votre besoin",
    groups: [
      {
        fields: [
          area("probleme", "En deux ou trois phrases, quel problème voulez-vous résoudre ?", { required: true }),
          area("si_rien_change", "Que se passe-t-il aujourd'hui si rien ne change (temps perdu, erreurs, ventes manquées) ?"),
          area("gestion_actuelle", "Comment gérez-vous cela actuellement (papier, Excel, logiciel, rien) ?"),
          area("reussite", "À quoi reconnaîtrez-vous que le projet est réussi dans 6 mois ?"),
          area("inspirations", "Avez-vous des exemples de solutions ou de sites qui vous inspirent (liens) ?", { max: 1000 }),
          many(
            "services",
            "Quels services vous intéressent ?",
            [
              { value: "erp", label: "Logiciel de gestion d'entreprise (ERP : clients, devis, factures, encaissements…)" },
              { value: "outil", label: "Outil interne sur mesure (tableau de bord, application de suivi)" },
              { value: "site", label: "Site web (vitrine, portfolio, boutique en ligne, site de mariage, blog)" },
              { value: "hebergement", label: "Hébergement, mise en ligne et maintenance d'une application existante" },
              { value: "conseil", label: "Je ne sais pas encore, j'ai besoin d'être conseillé" },
            ],
            { required: true, hint: "Les étapes suivantes s'adaptent à votre choix." },
          ),
          one("avancement", "Quel est le niveau d'avancement de votre projet ?", [
            { value: "idee", label: "Simple idée" },
            { value: "besoin_clair", label: "Besoin clair mais rien d'écrit" },
            { value: "documents_prets", label: "Cahier des charges ou maquettes déjà prêts (vous pourrez nous les transmettre)" },
            { value: "existant", label: "Une solution existe déjà et doit être refaite ou améliorée" },
          ]),
        ],
      },
    ],
  },
  {
    id: "erp",
    title: "Logiciel de gestion (ERP)",
    showIf: { field: "services", includes: "erp" },
    groups: [
      {
        fields: [
          many(
            "erp_fonctions",
            "Quelles fonctions vous sont utiles ?",
            [
              { value: "roles", label: "Comptes utilisateurs avec rôles (administrateur, commercial, comptable…)" },
              { value: "tiers", label: "Fichier clients et fournisseurs" },
              { value: "catalogue", label: "Catalogue de produits ou de services, avec prix" },
              { value: "devis", label: "Devis" },
              { value: "factures", label: "Factures en PDF, envoyées par e-mail" },
              { value: "paiements", label: "Suivi des paiements et relances des impayés" },
              { value: "tableau_bord", label: "Tableau de bord (chiffre d'affaires, impayés, indicateurs clés)" },
              { value: "historique", label: "Historique des actions (qui a fait quoi, et quand)" },
              { value: "stock", label: "Gestion de stock" },
              { value: "planning", label: "Planning (équipes, rendez-vous, livraisons)" },
              { value: "import_excel", label: "Import de vos données depuis Excel" },
              { value: "sms", label: "Envoi de SMS" },
              { value: "rh", label: "Gestion du personnel (RH, congés, paie)" },
              { value: "compta", label: "Comptabilité complète" },
            ],
            { other: "Fonction propre à votre métier (colis, transport, école…)" },
          ),
          text("erp_utilisateurs", "Combien de personnes utiliseront le logiciel ?"),
          text("erp_factures_mois", "Combien de factures émettez-vous par mois, environ ?"),
          text("erp_volumes", "Combien de clients et de produits/services gérez-vous, environ ?"),
          area("erp_reprise", "Avez-vous des données à reprendre (fichiers Excel, ancien logiciel) ? Lesquelles et en quel volume ?"),
          text("erp_paiements", "Moyens de paiement à suivre (espèces, virement, MVola, Orange Money, Airtel Money, chèque…)"),
          text("erp_mentions", "Mentions légales obligatoires sur vos factures (NIF, STAT, TVA, RCS…)"),
          area("erp_integrations", "Le logiciel doit-il communiquer avec un autre outil (comptable, banque, site web) ? Lequel ?"),
          many("erp_usage", "Où sera utilisé le logiciel ?", [
            { value: "bureau", label: "Sur ordinateur, au bureau" },
            { value: "mobile", label: "Aussi sur téléphone ou tablette, sur le terrain" },
            { value: "connexion_instable", label: "Avec une connexion internet parfois instable" },
          ]),
          text("erp_usage_precision", "Précisions sur la connexion ou l'usage terrain"),
        ],
      },
    ],
  },
  {
    id: "outil",
    title: "Outil interne sur mesure",
    showIf: { field: "services", includes: "outil" },
    groups: [
      {
        fields: [
          area("outil_tache", "Décrivez la tâche que l'outil doit faciliter, étape par étape"),
          area("outil_donnees", "Quelles informations l'outil doit-il enregistrer (ex. : commandes, interventions, élèves) ?"),
          area("outil_indicateurs", "Quels chiffres ou graphiques voulez-vous voir d'un coup d'œil ?"),
          area("outil_profils", "Combien de profils d'utilisateurs différents, et que peut faire chacun ?"),
          area("outil_exports", "Faut-il des exports (Excel, PDF) ou des documents générés automatiquement ?"),
          area("outil_notifications", "Faut-il des notifications (e-mail, SMS) ? À quelle occasion ?"),
          area("outil_acces_externe", "Faut-il un accès pour vos clients ou partenaires extérieurs ?"),
          many("outil_contraintes", "Contraintes particulières", [
            { value: "donnees_sensibles", label: "Données sensibles (santé, finances, données personnelles de clients)" },
            { value: "auth_renforcee", label: "Connexion renforcée (double authentification, clé d'accès)" },
            { value: "connexion_outil", label: "Connexion avec un outil existant (logiciel, API, fichier partagé)" },
            { value: "hors_connexion", label: "Usage hors connexion nécessaire" },
          ]),
        ],
      },
    ],
  },
  {
    id: "site",
    title: "Site web",
    showIf: { field: "services", includes: "site" },
    groups: [
      {
        fields: [
          one(
            "site_type",
            "Type de site",
            [
              { value: "vitrine", label: "Site vitrine d'entreprise" },
              { value: "landing", label: "Page unique de présentation ou de campagne (landing page)" },
              { value: "portfolio", label: "Portfolio professionnel" },
              { value: "mariage", label: "Site de mariage ou d'événement" },
              { value: "boutique", label: "Boutique en ligne (e-commerce)" },
              { value: "blog", label: "Blog ou site d'actualités" },
            ],
            { hint: "Un seul choix principal." },
          ),
          text("site_pages", "Combien de pages environ (accueil, à propos, services, contact…) ?"),
          text("site_contenus", "Fournissez-vous les textes et les photos, ou faut-il les créer ?"),
          text("site_charte", "Avez-vous un logo et une charte graphique ?"),
          text("site_domaine", "Avez-vous déjà un nom de domaine (ex. monentreprise.mg) ? Lequel ?"),
          text("site_autonomie", "Souhaitez-vous modifier vous-même le contenu après la mise en ligne ?"),
          text("site_langues", "Langues du site"),
          area("site_references", "Sites que vous aimez, et pourquoi (liens)", { max: 1500 }),
          many("site_fonctions", "Fonctions souhaitées", [
            { value: "formulaire", label: "Formulaire de contact ou de devis" },
            { value: "whatsapp", label: "Bouton WhatsApp / Messenger" },
            { value: "rendez_vous", label: "Prise de rendez-vous ou réservation" },
            { value: "galerie", label: "Galerie photos ou vidéos" },
            { value: "carte", label: "Carte et adresse" },
            { value: "seo", label: "Référencement Google (SEO) de base" },
            { value: "statistiques", label: "Statistiques de visites" },
          ]),
        ],
      },
      {
        title: "Site de mariage ou d'événement",
        showIf: { field: "site_type", equals: "mariage" },
        fields: [
          many("mariage_fonctions", "Fonctions de l'événement", [
            { value: "programme", label: "Date et lieu, programme de la journée" },
            { value: "rsvp", label: "Confirmation de présence (RSVP) avec suivi des invités" },
            { value: "liste", label: "Liste de mariage ou cagnotte" },
            { value: "galerie_invites", label: "Galerie partagée pour les invités" },
          ]),
          text("mariage_invites", "Nombre d'invités prévu"),
          text("mariage_date", "Date de l'événement (le site doit être prêt avant)"),
        ],
      },
      {
        title: "Boutique en ligne",
        showIf: { field: "site_type", equals: "boutique" },
        fields: [
          text("boutique_produits", "Nombre de produits au lancement"),
          text("boutique_variantes", "Produits avec variantes (taille, couleur) ?"),
          text("boutique_paiements", "Paiements souhaités (MVola, Orange Money, carte bancaire, PayPal, paiement à la livraison)"),
          area("boutique_livraison", "Livraison : zones couvertes et mode de calcul des frais"),
          text("boutique_stock", "Gestion du stock en ligne nécessaire ?"),
          text("boutique_physique", "Vendez-vous aussi en boutique physique ?"),
        ],
      },
    ],
  },
  {
    id: "hebergement",
    title: "Hébergement, mise en ligne et maintenance",
    showIf: { field: "services", includes: "hebergement" },
    groups: [
      {
        fields: [
          one(
            "heberg_choix",
            "Hébergement",
            [
              { value: "yonkotech", label: "Je veux que Yonko Tech s'occupe de tout (serveur, nom de domaine, certificat de sécurité)" },
              { value: "existant", label: "J'ai déjà un hébergeur ou un serveur" },
              { value: "ne_sait_pas", label: "Je ne sais pas" },
            ],
          ),
          text("heberg_existant", "Si vous avez déjà un hébergeur ou un serveur : lequel ?"),
          text("heberg_visiteurs", "Nombre de visiteurs ou d'utilisateurs attendus par jour, environ"),
          area("heberg_disponibilite", "L'outil doit-il être disponible 24 h/24 ? Une coupure de quelques heures est-elle gênante ?"),
          area("heberg_sauvegardes", "Des sauvegardes externes (hors serveur) sont-elles nécessaires ? À quelle fréquence ?"),
          area("heberg_reprise", "Avez-vous une application existante à reprendre ? Technologie et accès au code ?"),
          many("apres_livraison", "Après la livraison, souhaitez-vous :", [
            { value: "formation", label: "Une formation à l'utilisation" },
            { value: "maintenance", label: "Une maintenance mensuelle (mises à jour, sauvegardes, surveillance)" },
            { value: "assistance", label: "Une assistance en cas de problème" },
            { value: "evolutions", label: "Des évolutions régulières (nouvelles fonctions)" },
            { value: "rien", label: "Rien, je gère moi-même" },
          ]),
          text("apres_precisions", "Précisions (nombre de personnes à former, délai d'assistance souhaité…)"),
        ],
      },
    ],
  },
  {
    id: "budget",
    title: "Budget, délais et décision",
    groups: [
      {
        fields: [
          one(
            "budget",
            "Budget envisagé",
            [
              { value: "moins_1m", label: "Moins de 1 000 000 Ar (environ 200 €)" },
              { value: "1m_3m", label: "1 000 000 à 3 000 000 Ar (environ 200 à 600 €)" },
              { value: "3m_10m", label: "3 000 000 à 10 000 000 Ar (environ 600 à 2 000 €)" },
              { value: "plus_10m", label: "Plus de 10 000 000 Ar (plus de 2 000 €)" },
              { value: "ne_sait_pas", label: "Je ne sais pas, j'attends votre proposition" },
            ],
            { hint: "Un ordre de grandeur suffit, il nous aide à proposer la bonne formule." },
          ),
          one("paiement_formule", "Formule de paiement préférée", [
            { value: "prix_fixe", label: "Prix fixe pour le projet, payé en plusieurs étapes" },
            { value: "abonnement", label: "Mise en place + abonnement mensuel (hébergement et maintenance inclus)" },
            { value: "lots", label: "Projet découpé en lots, payés au fur et à mesure" },
          ]),
          text("date_souhaitee", "Date de mise en ligne souhaitée"),
          text("date_imperative", "Cette date est-elle impérative (événement, lancement, salon) ?"),
          text("validation", "Qui validera les étapes de votre côté, et sous quel délai ?"),
          text("autres_prestataires", "Consultez-vous d'autres prestataires ?"),
          text("moyen_paiement", "Moyen de paiement préféré (virement, MVola, espèces, PayPal…)"),
          area("remarques", "Remarques ou questions pour nous"),
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------------------------------------------------------
// Conditions et parcours

export type Answers = Record<string, string | string[]>;

export function matches(condition: Condition | undefined, answers: Answers) {
  if (!condition) return true;
  const value = answers[condition.field];
  if (condition.includes !== undefined) return Array.isArray(value) && value.includes(condition.includes);
  if (condition.equals !== undefined) return value === condition.equals;
  return true;
}

export const visibleSections = (answers: Answers) => SECTIONS.filter((s) => matches(s.showIf, answers));

export const visibleGroups = (section: Section, answers: Answers) => section.groups.filter((g) => matches(g.showIf, answers));

export const visibleFields = (section: Section, answers: Answers) => visibleGroups(section, answers).flatMap((g) => g.fields);

export const ALL_FIELDS: Field[] = SECTIONS.flatMap((s) => s.groups.flatMap((g) => g.fields));
