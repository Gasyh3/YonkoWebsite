import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import logoAlt from "@/public/assets/images/icon.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary text-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-secondary to-black opacity-90" />
      <div className="container relative grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm">
            <Sparkles className="h-4 w-4" />
            ERP PME & SaaS sur mesure
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Yonko Tech Consulting
              <br />
              Solutions digitales B2B
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground">
              Nous concevons des <strong>ERP modulaires pour PME</strong> et des
              <strong> SaaS clé en main</strong> basés sur Next.js.
              De la stratégie à la mise en production, nous livrons des
              plateformes fiables, scalables et prêtes à générer de la valeur.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/services" className="flex items-center gap-2">
                Découvrir nos offres <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Parler de votre projet</Link>
            </Button>
          </div>


        </div>

        <div className="glow relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-secondary via-black to-secondary p-10 shadow-lg">
          {/* Top content */}
          <div className="flex flex-col gap-5 text-primary-foreground">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
              SaaS & ERP prêts à scaler
            </p>

            <p className="text-3xl font-bold leading-tight text-primary">
              Produits digitaux robustes
            </p>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              ERP PME, SaaS Next.js, paiements Stripe, authentification sécurisée,
              analytics, automatisations email et infrastructures cloud conçues
              pour durer.
            </p>
          </div>

          {/* Divider spacing */}
          <div className="my-8 h-px w-full bg-primary/20" />

          {/* Brand / identity */}
          <div className="flex items-center gap-4 rounded-xl border border-primary/50 bg-secondary/60 p-4 shadow-sm">
            <Image
              src={logoAlt}
              alt="Identité Yonko Tech Consulting"
              width={160}
              height={100}
              className="h-10 w-auto object-contain"
              priority
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              ERP, SaaS et plateformes B2B conçus pour la performance
              et la croissance.
            </p>
          </div>

          {/* Stats / proof points */}
          <div className="mt-8 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-lg border border-dashed border-primary/30 px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                ERP PME
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                Modulaire & évolutif
              </p>
            </div>

            <div className="rounded-lg border border-dashed border-primary/30 px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                SaaS Next.js
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                Stripe & Auth intégrés
              </p>
            </div>

            <div className="rounded-lg border border-dashed border-primary/30 px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                Delivery
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                Time-to-market rapide
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

