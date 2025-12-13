"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import contactIcon from "@/public/assets/images/icon.png";

export function QuickContact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    console.log("Quick contact payload", payload);
    toast.success("Message bien reçu ! Nous revenons vers vous rapidement.");
    setTimeout(() => setLoading(false), 600);
    event.currentTarget.reset();
  };

  return (
    <section className="container py-16" id="contact">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image
              src={contactIcon}
              alt="Icône contact"
              width={32}
              height={32}
              className="h-8 w-8 rounded-md object-contain"
            />
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Contact rapide
            </p>
          </div>
          <h2 className="section-heading text-foreground">
            Dites-nous en plus sur votre besoin, nous répondons sous 24h.
          </h2>
          <p className="text-lg text-muted-foreground">
            Un expert Yonko revient vers vous pour un échange de 30 minutes :
            alignement sur le contexte, les priorités et les premiers
            livrables.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>- Critères : impact business, faisabilité technique, délai.</p>
            <p>- Format : visio courte, équipe produit/tech bienvenue.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-primary/30 bg-secondary p-6 shadow-sm space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" name="name" placeholder="Votre nom" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@entreprise.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Parlez-nous du contexte, des objectifs, du délai..."
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer mon message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
