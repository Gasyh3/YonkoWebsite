import { type ReactNode } from "react";

// Questions fréquentes : page /faqs (par thème), FAQ express de l'accueil (FAQ_HOME) et bas de chaque page
// expertise (Expertise.faqCategory). Réponses volontairement générales : aucune garantie de position, aucun chiffre.

export type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
  category: string;
};

export const FAQ_CATEGORIES = {
  start: "Démarrer un projet",
  site: "Site et référencement",
  maps: "Google Maps",
  software: "Logiciel sur mesure",
  ownership: "Propriété et suivi",
} as const;

const C = FAQ_CATEGORIES;

export const faqItems: FaqItem[] = [
  // Démarrer un projet
  {
    id: "how-to-make-a-website",
    category: C.start,
    question: "Comment faire un site web pour mon entreprise ?",
    answer: (
      <p>
        Tout part de trois questions : à qui s&apos;adresse le site, ce qu&apos;il doit inciter le visiteur à faire, et
        comment vous joindre. Viennent ensuite la structure des pages, les textes et le design, puis la construction
        et la mise en ligne. Nous vous accompagnons à chaque étape, sans jargon : vous validez, nous construisons.
      </p>
    ),
  },
  {
    id: "where",
    category: C.start,
    question: "Vous êtes à Antananarivo : travaillez-vous ailleurs ?",
    answer: (
      <p>
        Oui. Nous sommes basés à Antananarivo et travaillons à distance avec des entreprises partout à Madagascar et
        au-delà. Les échanges se font en visio, par téléphone ou par e-mail, et chaque étape se valide en ligne.
      </p>
    ),
  },
  {
    id: "where-to-start",
    category: C.start,
    question: "Par où commencer si je ne sais pas de quoi j'ai besoin ?",
    answer: (
      <p>
        Par un échange. On regarde ensemble votre activité, vos clients et vos objectifs, et on vous dit honnêtement
        ce qui sera utile en premier, même si c&apos;est peu.
      </p>
    ),
  },
  {
    id: "price",
    category: C.start,
    question: "Combien coûte un site vitrine ?",
    answer: (
      <p>
        Cela dépend du nombre de pages, des contenus à produire et des fonctions attendues (prise de rendez-vous,
        catalogue, formulaire…). Après un premier échange, vous recevez une proposition écrite et détaillée, sans
        surprise.
      </p>
    ),
  },
  {
    id: "timeline",
    category: C.start,
    question: "Combien de temps dure un projet ?",
    answer: (
      <p>
        Cela dépend du périmètre. Un calendrier est fixé avec vous dès le départ, avec des étapes de validation, et
        tenu à jour pendant tout le projet.
      </p>
    ),
  },

  // Site et référencement
  {
    id: "first-place",
    category: C.site,
    question: "Pouvez-vous garantir la première place sur Google ?",
    answer: (
      <p>
        Non, et méfiez-vous de ceux qui le promettent : personne ne contrôle le classement de Google. Nous mettons en
        place ce qui compte (technique, contenus, présence locale) et suivons l&apos;évolution dans la durée.
      </p>
    ),
  },
  {
    id: "indexing-delay",
    category: C.site,
    question: "Combien de temps faut-il pour apparaître sur Google ?",
    answer: (
      <p>
        Un site peut être indexé peu après sa mise en ligne, mais sa position se construit avec le temps : elle dépend
        de la concurrence, de la qualité des contenus et de leur régularité.
      </p>
    ),
  },
  {
    id: "redesign",
    category: C.site,
    question: "Pouvez-vous refaire mon site actuel ?",
    answer: (
      <p>
        Oui. On part de l&apos;existant : ce qui fonctionne est conservé, et les anciennes adresses sont redirigées vers
        les nouvelles pour ne pas perdre le référencement déjà acquis.
      </p>
    ),
  },
  {
    id: "mobile-site",
    category: C.site,
    question: "Mon site sera-t-il adapté aux téléphones ?",
    answer: (
      <p>
        Oui. Il est pensé d&apos;abord pour le mobile, où se font une grande partie des recherches, puis adapté aux
        écrans plus grands. Les pages restent légères pour se charger vite, même avec une connexion modeste.
      </p>
    ),
  },

  // Google Maps
  {
    id: "maps-without-premises",
    category: C.maps,
    question: "Je n'ai pas de local : puis-je apparaître sur Google Maps ?",
    answer: (
      <p>
        Oui. Google permet de déclarer une zone desservie sans afficher d&apos;adresse : c&apos;est le cas de nombreux
        artisans et prestataires qui se déplacent chez leurs clients.
      </p>
    ),
  },
  {
    id: "site-vs-listing",
    category: C.maps,
    question: "Quelle différence entre un site et une fiche Google ?",
    answer: (
      <p>
        La fiche Google répond vite : où, quand, comment vous joindre. Le site explique en détail ce que vous faites et
        pourquoi vous choisir. Les deux se renforcent : la fiche renvoie vers le site, le site confirme la fiche.
      </p>
    ),
  },
  {
    id: "negative-reviews",
    category: C.maps,
    question: "Pouvez-vous supprimer les avis négatifs ?",
    answer: (
      <p>
        Non : un avis ne peut être retiré que s&apos;il enfreint les règles de Google. En revanche, une réponse calme et
        précise rassure souvent davantage qu&apos;une note parfaite, et nous vous aidons à la formuler.
      </p>
    ),
  },

  // Logiciel sur mesure
  {
    id: "excel-import",
    category: C.software,
    question: "Pouvez-vous reprendre nos fichiers Excel ?",
    answer: (
      <p>
        Oui. On analyse vos fichiers, on nettoie ce qui doit l&apos;être, puis on les importe dans l&apos;outil : vous ne
        repartez pas de zéro et vous gardez une copie de l&apos;existant.
      </p>
    ),
  },
  {
    id: "automation",
    category: C.software,
    question: "Peut-on automatiser des relances ou des alertes ?",
    answer: (
      <p>
        Oui : relances de factures, alertes de stock bas, rappels de rendez-vous… Elles se règlent selon vos propres
        règles, et vous pouvez les ajuster.
      </p>
    ),
  },
  {
    id: "roles",
    category: C.software,
    question: "Peut-on gérer plusieurs rôles et accès ?",
    answer: (
      <p>
        Oui : responsable, employé, comptable… Chacun accède à ce qui le concerne, et les actions importantes sont
        conservées dans un historique.
      </p>
    ),
  },
  {
    id: "software-mobile",
    category: C.software,
    question: "L'outil fonctionne-t-il sur téléphone ?",
    answer: (
      <p>
        Oui. Il s&apos;utilise dans le navigateur, sur ordinateur, tablette ou téléphone, sans installation.
      </p>
    ),
  },
  {
    id: "integrations",
    category: C.software,
    question: "Pouvez-vous le connecter à d'autres outils ?",
    answer: (
      <p>
        Souvent, oui : paiement, e-mail, comptabilité… selon ce que ces outils permettent. La faisabilité est vérifiée
        au moment du cadrage, avant tout engagement.
      </p>
    ),
  },

  // Propriété et suivi
  {
    id: "ownership",
    category: C.ownership,
    question: "Qui possède le site, le code et les données ?",
    answer: (
      <p>
        Vous. Le nom de domaine, le site, le code et les données vous appartiennent, et vous pouvez les récupérer à
        tout moment.
      </p>
    ),
  },
  {
    id: "hosting",
    category: C.ownership,
    question: "Qui s'occupe de l'hébergement ?",
    answer: (
      <p>
        Au choix : nous gérons l&apos;hébergement sur un compte à votre nom, ou nous vous accompagnons pour
        l&apos;héberger vous-même. Dans les deux cas, les accès et les sauvegardes sont documentés.
      </p>
    ),
  },
  {
    id: "after-launch",
    category: C.ownership,
    question: "Que se passe-t-il après la mise en ligne ?",
    answer: (
      <p>
        Nous restons disponibles : corrections, mises à jour, évolutions et conseils. La forme du suivi, ponctuel ou
        régulier, est définie avec vous.
      </p>
    ),
  },
  {
    id: "response-time",
    category: C.ownership,
    question: "En combien de temps répondez-vous ?",
    answer: <p>Sous 24h, à chaque demande, par e-mail ou par le formulaire de contact.</p>,
  },
];

// FAQ express de l'accueil : les questions qu'on pose avant de prendre contact.
const HOME_IDS = ["how-to-make-a-website", "where", "first-place", "maps-without-premises", "ownership"];
export const faqHome = HOME_IDS.map((id) => faqItems.find((item) => item.id === id)).filter(
  (item): item is FaqItem => Boolean(item),
);

export const faqByCategory = (category: string) => faqItems.filter((item) => item.category === category);
