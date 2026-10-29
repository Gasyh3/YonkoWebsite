import { isValidElement, type ReactNode } from "react";

import { SITE, absoluteUrl } from "@/lib/site";

type Json = Record<string, unknown>;

// Données structurées (schema.org) en JSON-LD. « < » est échappé pour qu'aucun contenu ne ferme la balise.
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// L'entreprise : Organization (ville et pays seulement, pas de local ouvert au public), ProfessionalService
// (établissement local, utile au référencement Maps) dès qu'une rue est renseignée dans lib/site.ts.
export function organizationJsonLd(): Json {
  const local = SITE.address.streetAddress !== "";
  const address = Object.fromEntries(Object.entries(SITE.address).filter(([, v]) => v !== ""));
  return {
    "@context": "https://schema.org",
    "@type": local ? "ProfessionalService" : "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    ...(local ? { image: absoluteUrl(SITE.logo) } : {}),
    ...(SITE.email ? { email: SITE.email } : {}),
    description: SITE.description,
    ...(SITE.telephone ? { telephone: SITE.telephone } : {}),
    foundingDate: SITE.foundingDate,
    address: { "@type": "PostalAddress", ...address },
    ...(SITE.areaServed.length ? { areaServed: SITE.areaServed } : {}),
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "fr-FR",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

// Fil d'Ariane : l'accueil puis chaque niveau ({ name, path }).
export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// Texte brut d'une réponse JSX (paragraphes, listes, emphases), pour le balisage FAQPage.
export function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    const inner = nodeToText(node.props.children);
    return typeof node.type === "string" && ["p", "li", "ul", "ol", "div", "br"].includes(node.type)
      ? `${inner}\n`
      : inner;
  }
  return "";
}

export function faqJsonLd(items: { question: string; answer: ReactNode }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: nodeToText(item.answer).replace(/\n{2,}/g, "\n").replace(/[ \t]+/g, " ").trim(),
      },
    })),
  };
}
