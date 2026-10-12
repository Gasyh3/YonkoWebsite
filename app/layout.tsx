import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MotionRoot } from "@/components/motion/motion-root";
import { PageTransitions } from "@/components/motion/page-transitions";
import { HERO_INTRO_CLASS, HERO_INTRO_STORAGE_KEY } from "@/lib/motion/hero-intro";
import { cn } from "@/lib/utils";
import "lenis/dist/lenis.css";
import "./globals.css";
import { fontDisplay, fontSans } from "./fonts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Yonko Tech Consulting",
  description:
    "Yonko Tech Consulting – Expert en solutions digitales, data et cloud. Construisez vos produits et plateformes avec une équipe senior.",
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
        <Toaster position="top-right" expand />
      </body>
    </html>
  );
}
