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

export default function ServicesPage() {
  return (
    <div className="container space-y-12 py-12">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Services
        </p>
        <h1 className="section-heading text-foreground">
          ERP PME, SaaS clé en main et visibilité digitale
        </h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          Nous construisons des ERP modulaires pour PME, des bases SaaS Next.js prêtes
          à être monétisées et des dispositifs marketing (SEO, rebranding,
          réseaux sociaux) pour soutenir la croissance. Chaque offre est livrée avec
          des jalons clairs, des livrables documentés et une équipe senior.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-secondary via-black/80 to-secondary p-10 text-primary-foreground shadow-sm">
        <h2 className="text-2xl font-semibold text-primary">Livraison end-to-end</h2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Cadrage, conception, build, intégrations (Stripe, Better Auth), analytics,
          SEO, CI/CD : une approche bout-en-bout pour livrer des produits fiables et
          mesurables.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <Card
            key={service.title}
            className="flex h-full flex-col justify-between border-border/80 bg-card shadow-sm"
          >
            <div>
              <CardHeader>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                <CardDescription className="text-base">
                  {service.shortDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Bénéfices
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/70" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            <div className="p-6 pt-0">
              <Button asChild variant="outline" className="w-full justify-between">
                <Link href={`/services/${service.slug}`}>
                  {service.ctaLabel ?? "En savoir plus"}
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
