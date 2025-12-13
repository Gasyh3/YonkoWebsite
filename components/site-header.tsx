"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import logoPng from "@/public/assets/images/icon.png";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/faqs", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-secondary/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 shadow-sm">
            <Image
              src={logoPng}
              alt="Yonko Tech Consulting"
              width={40}
              height={40}
              className="h-9 w-9 object-contain"
              priority
            />
          </span>
          <span className="hidden text-base md:inline">
            Yonko Tech Consulting
          </span>
          <span className="text-base md:hidden">Yonko Tech</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild className="transition-colors">
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-md px-4 py-2 text-sm font-medium text-foreground hover:text-primary",
                        pathname === link.href
                          ? "bg-primary/15 text-primary"
                          : "hover:bg-primary/10"
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button asChild size="sm">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button asChild variant="outline" size="sm">
            <Link href="/contact">Contact</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/70 bg-secondary md:hidden">
          <nav className="container flex flex-col gap-2 py-4 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-2 py-2 text-foreground hover:bg-primary/10 hover:text-primary",
                  pathname === link.href && "bg-primary/15 text-primary"
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
