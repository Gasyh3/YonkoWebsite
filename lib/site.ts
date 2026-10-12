import type { Metadata } from "next";

// Informations de l'entreprise, partagées par les métadonnées, le sitemap, les données structurées et le
// formulaire. Les champs vides seront remplis avec docs/contenu-a-remplir.txt : ils ne sont publiés que
// renseignés (adresse et téléphone activent le balisage d'établissement local).
export const SITE = {
  name: "Yonko Tech Consulting",
  shortName: "Yonko",
  // Domaine de production : NEXT_PUBLIC_SITE_URL (voir .env.example), sans barre finale.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://yonkotech.com").replace(/\/+$/, ""),
  locale: "fr_FR",
  email: "contact@yonkotech.com",
  description:
    "Agence web et communication pour PME, commerçants, artisans et professions libérales : stratégie, site vitrine et SEO, visibilité sur Google Maps, logiciel sur mesure.",
  logo: "/assets/images/logo.png",
  telephone: "", // format international, ex. +33 1 23 45 67 89
  address: {
    streetAddress: "",
    postalCode: "",
    addressLocality: "",
    addressCountry: "FR",
  },
  areaServed: [] as string[], // villes ou départements couverts
  sameAs: [] as string[], // URL des profils (LinkedIn, Instagram, fiche Google…)
} as const;

export const absoluteUrl = (path = "/") => `${SITE.url}${path === "/" ? "" : path}`;

type PageMeta = {
  title?: string; // sans le nom du site : le modèle du layout l'ajoute (« Titre · Yonko Tech Consulting »)
  description?: string;
  path: string;
};

// Image de partage générée par app/opengraph-image.tsx (à répéter : une page qui définit son openGraph
// ne l'hérite plus).
const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: SITE.name };

// Métadonnées d'une page : titre, description, URL canonique et partage.
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const shareTitle = title ? `${title} · ${SITE.name}` : SITE.name;
  return {
    ...(title ? { title } : {}),
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
