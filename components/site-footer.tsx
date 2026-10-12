import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

import { BackToTop } from "@/components/motion/back-to-top";
import { DottedLink } from "@/components/motion/dotted-link";
import { SITE } from "@/lib/site";
import logoPng from "@/public/assets/images/icon.png";

// Liens de pied de page (le header garde le parcours principal).
const FOOTER_LINKS = [
  { href: "/expertises", label: "Expertises" },
  { href: "/about", label: "L'agence" },
  { href: "/faqs", label: "Questions fréquentes" },
  { href: "/contact", label: "Contact" },
];

// Réseaux : à compléter avec les profils (et SITE.sameAs) quand ils existent.
const SOCIALS = [{ href: `mailto:${SITE.email}`, label: `Écrire à ${SITE.email}`, icon: Mail }];

// Footer : séparé de la page par une fibre pointillée ; marque, navigation, retour en haut et réseaux, puis
// mentions. Noir mat, argent, aucune couleur hors charte.
export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="fiber-rule" aria-hidden="true" />
      <div className="container grid gap-12 py-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20 md:py-20">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Yonko Tech Consulting, accueil">
            <Image src={logoPng} alt="" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
            <span className="font-display text-2xl leading-none text-silver-light">Yonko</span>
            <span className="text-[0.65rem] uppercase tracking-[0.24em] text-silver">Tech Consulting</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm">
            Agence web et communication basée à Antananarivo : stratégie, site vitrine, Google Maps et logiciel sur
            mesure pour les PME, commerçants, artisans et professions libérales.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-[minmax(0,1fr)_auto]">
          <nav aria-label="Liens utiles">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-silver">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <DottedLink href={link.href}>{link.label}</DottedLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col items-start gap-6 sm:items-end">
            <BackToTop />
            <ul className="flex items-center gap-4 text-silver">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <Link href={href} aria-label={label} className="site-footer__social">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container flex flex-col gap-3 pb-10 text-xs text-silver sm:flex-row sm:items-center sm:justify-between">
        <p>© {currentYear} Yonko Tech Consulting. Tous droits réservés.</p>
        <ul className="flex gap-6">
          <li>
            <DottedLink href="/mentions-legales">Mentions légales</DottedLink>
          </li>
          <li>
            <DottedLink href="/confidentialite">Politique de confidentialité</DottedLink>
          </li>
        </ul>
      </div>
    </footer>
  );
}
