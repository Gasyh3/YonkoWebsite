import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import logoPng from "@/public/assets/images/icon.png";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-secondary text-foreground">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg border border-border/60 p-1.5">
              <Image
                src={logoPng}
                alt="Yonko Tech Consulting"
                width={36}
                height={36}
                className="h-6 w-6 object-contain"
                priority={false}
              />
            </div>
            <p className="text-sm font-semibold">
              Yonko Tech Consulting
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} Yonko Tech Consulting. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-primary">
              Politique de confidentialité
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Link href="#" aria-label="Lien LinkedIn" className="hover:text-primary">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="#" aria-label="Lien GitHub" className="hover:text-primary">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="mailto:contact@yonkotech.com" className="hover:text-primary">
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
