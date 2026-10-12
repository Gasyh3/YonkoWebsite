import type { Metadata, Viewport } from "next";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/seo/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MotionRoot } from "@/components/motion/motion-root";
import { PageTransitions } from "@/components/motion/page-transitions";
import { HERO_INTRO_CLASS, HERO_INTRO_STORAGE_KEY } from "@/lib/motion/hero-intro";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import "lenis/dist/lenis.css";
import "./globals.css";
import { fontDisplay, fontSans } from "./fonts";

// SEO par défaut : chaque page fournit son titre court (modèle « Titre · Yonko Tech Consulting »), sa description
// et son URL canonique via pageMetadata (lib/site.ts). Image de partage : app/opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: "website", locale: SITE.locale, siteName: SITE.name },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C", // --black
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(fontSans.variable, fontDisplay.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* Avant le premier rendu : l'intro du hero ne joue qu'à la première visite de la session. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("${HERO_INTRO_STORAGE_KEY}"))document.documentElement.classList.add("${HERO_INTRO_CLASS}")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <MotionRoot />
        <PageTransitions />
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          {/* #top : cible du focus après « Retour en haut ». */}
          <main id="top" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </div>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
