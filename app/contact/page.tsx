"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    console.log("Contact form payload", payload);
    toast.message("Merci !", {
      description: "Nous revenons vers vous sous 24h avec une première proposition.",
    });
    event.currentTarget.reset();
    setTimeout(() => setLoading(false), 700);
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Contact
        </p>
        <h1 className="section-heading text-foreground">Parlons de vos projets</h1>
        <p className="text-lg text-muted-foreground">
          Décrivez votre besoin : produit à lancer, refonte, audit technique,
          problématiques data ou cloud. Nous proposons un créneau rapide pour
          cadrer et recommander les premiers pas.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <Card className="shadow-sm border-primary/30 bg-secondary text-foreground">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">
              Formulaire de contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" name="name" placeholder="Votre nom" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Société</Label>
                  <Input id="company" name="company" placeholder="Yonko Tech" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
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
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Refonte app, audit tech..."
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Détaillez le contexte, les objectifs et le délai souhaité."
                  required
                  className="min-h-[150px]"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Nous répondons sous 24h. En envoyant ce formulaire, vous acceptez le suivi
                par email pour ce projet.
              </p>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer ma demande"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
