import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@/lib/services-data";

type Props = {
  service: Service;
  showBackLink?: boolean;
};

export function ServiceDetail({ service, showBackLink = true }: Props) {
  return (
    <div className="container space-y-10 py-12">
      {showBackLink && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link href="/services" className="inline-flex items-center gap-2 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Retour aux services
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-foreground">{service.title}</span>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Service</p>
        <h1 className="section-heading text-foreground">{service.title}</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{service.description}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/contact" className="gap-2">
              {service.ctaLabel ?? "Planifier un échange"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact#contact" className="gap-2">
              Demander une démo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-primary/30 bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Bénéfices clés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {service.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Résultats attendus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {service.outcomes.map((outcome) => (
              <div key={outcome} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{outcome}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Livrables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {service.deliverables.map((deliverable) => (
              <div key={deliverable} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{deliverable}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/40 bg-secondary/60">
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between py-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Délai indicatif
            </p>
            <p className="text-base text-foreground">{service.timeline}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>Planning affiné après un atelier de cadrage.</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/40 bg-card">
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Prochaines étapes</p>
            <p className="text-base text-foreground">
              Atelier de 30 minutes pour préciser le périmètre, aligner les objectifs et planifier les premiers livrables.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/contact" className="gap-2">
                Réserver un créneau
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services" className="gap-2">
                Voir toutes les offres
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
