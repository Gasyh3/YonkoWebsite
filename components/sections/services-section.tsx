import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/services-data";

export function ServicesSection() {
  return (
    <section className="container space-y-6 py-16" id="services">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Nos offres
        </p>
        <h2 className="section-heading text-foreground/90">
          Des solutions digitales B2B pour structurer, lancer et faire croître votre activité
        </h2>
        <p className="text-lg text-muted-foreground">
          Nous concevons des <strong>ERP modulaires pour PME</strong> et des{" "}
          <strong>SaaS clé en main</strong> basés sur Next.js, tout en accompagnant
          votre <strong>visibilité digitale</strong> grâce au SEO, au rebranding et à
          la gestion de vos réseaux sociaux.
          De la stratégie à l’exécution, nous livrons des solutions cohérentes,
          performantes et orientées croissance.
        </p>
      </div>


      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <Card
            key={service.title}
            className="flex h-full flex-col border-border/80 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                {service.title}
              </CardTitle>
              <CardDescription className="text-base">
                {service.shortDescription}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary/70" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant="outline" className="w-fit gap-2 text-foreground">
                <Link href={`/services/${service.slug}`}>
                  En savoir plus
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
