import type { Metadata } from "next";

// Informations de l'entreprise, partagées par les métadonnées, le sitemap, les données structurées et le
// formulaire. Les champs vides ne sont publiés que renseignés. Pas de local ouvert au public : seules la ville et
// le pays sont déclarés ; une rue renseignée activerait le balisage d'établissement local (ProfessionalService).
export const SITE = {
  name: "Yonko Tech Consulting",
  shortName: "Yonko",
  // Domaine de production : NEXT_PUBLIC_SITE_URL (voir .env.example), sans barre finale.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://yonkotech.com").replace(/\/+$/, ""),
  locale: "fr_FR",
  email: "contact@yonkotech.com",
  description:
    "Agence web à Madagascar : création de site vitrine et SEO, visibilité sur Google Maps, logiciel sur mesure et stratégie de communication pour PME et artisans.",
  logo: "/assets/images/logo.png",
  telephone: "" as string, // format international, ex. +261 34 00 000 00 ; affiché (lien tel:) dès qu'il est renseigné
  address: {
    streetAddress: "",
    postalCode: "",
    addressLocality: "Antananarivo",
    addressCountry: "MG",
  },
  foundingDate: "2025",
  areaServed: ["Madagascar"] as string[], // zone prioritaire ; interventions à distance partout
  sameAs: [] as string[], // URL des profils (LinkedIn, Instagram, fiche Google…)
} as const;

// Lien d'appel (tel:) : chiffres et « + » seulement ; null tant qu'aucun numéro n'est renseigné.
export const phoneHref = (): string | null =>
  SITE.telephone ? `tel:${SITE.telephone.replace(/[^+\d]/g, "")}` : null;

export const absoluteUrl = (path = "/") => `${SITE.url}${path === "/" ? "" : path}`;

type PageMeta = {
  title?: string; // sans le nom du site : le modèle du layout l'ajoute (« Titre · Yonko Tech Consulting »)
  absoluteTitle?: boolean; // titre complet, sans le modèle (accueil)
  description?: string;
  path: string;
};

// Image de partage générée par app/opengraph-image.tsx (à répéter : une page qui définit son openGraph
// ne l'hérite plus).
const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: SITE.name };

// Métadonnées d'une page : titre, description, URL canonique et partage.
export function pageMetadata({ title, absoluteTitle, description, path }: PageMeta): Metadata {
  const shareTitle = title ? (absoluteTitle ? title : `${title} · ${SITE.name}`) : SITE.name;
  return {
    ...(title ? { title: absoluteTitle ? { absolute: title } : title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      url: path,
      title: shareTitle,
      description: description ?? SITE.description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: description ?? SITE.description,
      images: [SHARE_IMAGE],
    },
  };
}
