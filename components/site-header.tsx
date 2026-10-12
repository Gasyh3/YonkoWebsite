"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { ButtonGlint, DottedLink } from "@/components/motion/dotted-link";
import { expertises } from "@/lib/expertises-data";
import logoPng from "@/public/assets/images/icon.png";

// Pages du site (le header ne pointe plus vers les sections de l'accueil) : les expertises (sous-menu), les
// réalisations, l'agence, les questions fréquentes, et l'action principale « Démarrer un projet ».
const LINKS = [
  { href: "/projets", label: "Réalisations" },
  { href: "/about", label: "À propos" },
  { href: "/faqs", label: "FAQ" },
];

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const CLOSE_DELAY = 180; // ms : le pointeur peut passer du bouton au panneau sans le refermer

// Header translucide, collé en haut pendant tout le défilement : transparent en haut de page, voile flouté dès
// que le contenu passe dessous (seule l'opacité du voile change).
export function SiteHeader() {
  const pathname = usePathname();
  // Menus rattachés au chemin : ils se referment d'eux-mêmes à la navigation.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [panelPath, setPanelPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = menuPath === pathname;
  const panelOpen = panelPath === pathname;
  const closeTimer = useRef<number | undefined>(undefined);
  const trigger = useRef<HTMLButtonElement>(null);

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

  // Échap ferme le menu ouvert (et rend le focus au bouton du panneau Expertises).
  useEffect(() => {
    if (!menuOpen && !panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (panelOpen) trigger.current?.focus();
      setMenuPath(null);
      setPanelPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, panelOpen]);

  const openPanel = () => {
    window.clearTimeout(closeTimer.current);
    setPanelPath(pathname);
  };
  const closePanelSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPanelPath(null), CLOSE_DELAY);
  };
  // Survol à la souris uniquement (au toucher, le bouton s'ouvre au tap).
  const isMouseHover = (e: React.PointerEvent) => e.pointerType === "mouse" && window.matchMedia(HOVER_QUERY).matches;

  const expertisesActive = pathname.startsWith("/expertises");

  return (
    <header
      className="site-header sticky top-0 z-40"
      data-scrolled={scrolled || menuOpen || panelOpen ? "" : undefined}
    >
      <div className="site-header__veil" aria-hidden="true" />

      <div className="container flex h-16 items-center justify-between gap-6">
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
            <li
              onPointerEnter={(e) => {
                if (isMouseHover(e)) openPanel();
              }}
              onPointerLeave={(e) => {
                if (isMouseHover(e)) closePanelSoon();
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPanelPath(null);
              }}
            >
              <button
                ref={trigger}
                type="button"
                className="site-header__link site-header__trigger inline-flex items-center gap-1 text-sm"
                data-active={expertisesActive ? "" : undefined}
                aria-expanded={panelOpen}
                aria-controls="expertises-panel"
                onClick={() => (panelOpen ? setPanelPath(null) : openPanel())}
              >
                Expertises
                <ChevronDown className="site-header__chevron h-3.5 w-3.5" aria-hidden="true" />
              </button>

              {/* Panneau des expertises : sous le header, même voile ; apparition en opacité / transform. */}
              <div
                id="expertises-panel"
                data-close-on-navigate=""
                className="site-header__panel"
                data-open={panelOpen ? "" : undefined}
              >
                <div className="container grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-10 py-10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-silver">Expertises</p>
                    <p className="mt-3 font-display text-2xl text-silver-light">[à adapter] Une stratégie, trois leviers.</p>
                    <DottedLink
                      href="/expertises"
                      className="mt-6 text-sm text-silver"
                      tabIndex={panelOpen ? 0 : -1}
                      onClick={() => setPanelPath(null)}
                    >
                      Toutes les expertises →
                    </DottedLink>
                  </div>
                  <ul className="grid grid-cols-2 gap-x-10 gap-y-8">
                    {expertises.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/expertises/${item.slug}`}
                          tabIndex={panelOpen ? 0 : -1}
                          aria-current={pathname === `/expertises/${item.slug}` ? "page" : undefined}
                          className="site-header__panel-link block"
                          onClick={() => setPanelPath(null)}
                        >
                          <span className="text-xs tracking-[0.24em] text-silver">{item.index}</span>
                          <span className="mt-1 block font-display text-xl text-silver-light">{item.title}</span>
                          <span className="mt-1 block text-sm">{item.summary}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            {LINKS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <DottedLink
                    href={item.href}
                    data-active={active ? "" : undefined}
                    aria-current={active ? "page" : undefined}
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
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuPath(menuOpen ? null : pathname)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        // En superposition sous le header (la page ne bouge pas), même voile translucide.
        <nav
          id="mobile-nav"
          data-close-on-navigate=""
          aria-label="Navigation principale"
          className="site-header__menu lg:hidden"
        >
          <div className="container pb-8 pt-4">
            <p className="text-xs uppercase tracking-[0.24em] text-silver">Expertises</p>
            <ul className="mt-3 flex flex-col gap-1">
              {expertises.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/expertises/${item.slug}`}
                    aria-current={pathname === `/expertises/${item.slug}` ? "page" : undefined}
                    className="block py-1.5 font-display text-2xl text-silver-light"
                    onClick={() => setMenuPath(null)}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-col gap-1 border-t border-border/60 pt-4">
              {LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                    className="block py-1.5 font-display text-2xl text-silver-light"
                    onClick={() => setMenuPath(null)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
