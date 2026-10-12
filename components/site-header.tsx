"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { ButtonGlint, DottedLink } from "@/components/motion/dotted-link";
import logoPng from "@/public/assets/images/icon.png";

// Parcours d'un visiteur (PME, artisan, commerçant) : ce que vous faites, la preuve, la façon de travailler,
// qui vous êtes. Le contact est l'action principale, toujours visible.
const NAV = [
  { href: "/#expertises", label: "Expertises", section: "expertises" },
  { href: "/#projets", label: "Réalisations", section: "projets" },
  { href: "/#methode", label: "Méthode", section: "methode" },
  { href: "/about", label: "À propos" },
] as const;

// Liens secondaires : dans le menu mobile et le footer.
const SECONDARY = [
  { href: "/services", label: "Toutes nos offres" },
  { href: "/faqs", label: "Questions fréquentes" },
];

// Header translucide, collé en haut pendant tout le défilement : transparent en haut de page, voile flouté dès
// que le contenu passe dessous (seule l'opacité du voile change). Sur l'accueil, le lien de la section en vue
// est marqué (point or).
export function SiteHeader() {
  const pathname = usePathname();
  // Menu et section en vue sont rattachés au chemin : ils se réinitialisent d'eux-mêmes à la navigation.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [spy, setSpy] = useState<{ path: string; id: string | null }>({ path: "", id: null });
  const [scrolled, setScrolled] = useState(false);
  const open = openPath === pathname;
  const section = spy.path === pathname ? spy.id : null;
  const close = () => setOpenPath(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Section en vue (accueil) : celle qui traverse le milieu de l'écran.
  // Échap ferme le menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (pathname !== "/") return;
    const targets = NAV.flatMap((item) => ("section" in item ? [document.getElementById(item.section)] : [])).filter(
      (el): el is HTMLElement => !!el,
    );
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target.id) : visible.delete(entry.target.id)));
        setSpy({ path: pathname, id: targets.find((el) => visible.has(el.id))?.id ?? null });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (item: (typeof NAV)[number]) =>
    "section" in item ? pathname === "/" && section === item.section : pathname.startsWith(item.href);

  return (
    <header className="site-header sticky top-0 z-40" data-scrolled={scrolled || open ? "" : undefined}>
      <div className="site-header__veil" aria-hidden="true" />

      <div className="container relative flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Yonko Tech Consulting, accueil">
          <Image src={logoPng} alt="" width={32} height={32} className="h-8 w-8 rounded-md object-contain" priority />
          <span className="flex items-baseline gap-2">
            <span className="font-display text-xl leading-none text-silver-light">Yonko</span>
            <span className="hidden text-[0.65rem] uppercase tracking-[0.24em] text-silver sm:inline">
              Tech Consulting
            </span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <DottedLink
                    href={item.href}
                    data-active={active ? "" : undefined}
                    aria-current={active ? ("section" in item ? "location" : "page") : undefined}
                    className="site-header__link text-sm"
                  >
                    {item.label}
                  </DottedLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            data-magnetic=""
            className="site-header__cta relative inline-flex h-10 items-center rounded-full px-5 text-sm font-medium"
          >
            <ButtonGlint />
            <span className="relative">
              <span className="hidden sm:inline">Démarrer un projet</span>
              <span className="sm:hidden">Contact</span>
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-silver-light lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        // En superposition sous le header (la page ne bouge pas), même voile translucide.
        <nav id="mobile-nav" aria-label="Navigation principale" className="site-header__menu lg:hidden">
          <ul className="container flex flex-col gap-1 pt-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item) ? "page" : undefined}
                  className="block py-2 font-display text-3xl text-silver-light"
                  onClick={close}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="container mt-4 flex flex-col gap-2 pb-8 text-sm">
            {SECONDARY.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-silver" onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
