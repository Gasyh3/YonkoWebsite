"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { ButtonGlint, DottedLink } from "@/components/motion/dotted-link";
import { PageHeader } from "@/components/page/page-header";

// Ce qui suit l'envoi (repris des engagements de la v1 : réponse sous 24h, créneau de cadrage).
const NEXT_STEPS = [
  { title: "Vous décrivez votre besoin", text: "Quelques lignes suffisent : le contexte, l'objectif, le délai." },
  { title: "Nous répondons sous 24h", text: "Avec une première lecture de votre demande." },
  { title: "Un créneau pour cadrer", text: "On précise ensemble et on recommande les premiers pas." },
];

const FIELD = "form-field";

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
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Parlons de vos projets"
        lead="Décrivez votre besoin : produit à lancer, refonte, audit technique, problématiques data ou cloud. Nous proposons un créneau rapide pour cadrer et recommander les premiers pas."
      />

      <section id="contact" className="container pb-24 pt-8 md:pb-32" aria-label="Formulaire de contact">
        <div className="grid gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-silver">Ensuite</p>
            <ol className="expertise-steps contact-steps mt-8">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title} className="expertise-steps__item">
                  <span className="expertise-steps__node" aria-hidden="true" />
                  <p className="text-xs tracking-[0.24em] text-silver">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 font-display text-2xl text-silver-light">{step.title}</h2>
                  <p className="mt-2 text-sm">{step.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-12 text-sm text-silver">
              Vous préférez l&apos;e-mail ?{" "}
              <DottedLink href="mailto:contact@yonkotech.com" className="text-silver-light">
                contact@yonkotech.com
              </DottedLink>
            </p>
          </div>

          <form className="panel space-y-6" onSubmit={onSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="form-label">
                  Nom
                </label>
                <input id="name" name="name" placeholder="Votre nom" required autoComplete="name" className={FIELD} />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="form-label">
                  Société
                </label>
                <input id="company" name="company" placeholder="Votre entreprise" autoComplete="organization" className={FIELD} />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  required
                  autoComplete="email"
                  className={FIELD}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="form-label">
                  Sujet
                </label>
                <input id="subject" name="subject" placeholder="Refonte app, audit tech..." required className={FIELD} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Détaillez le contexte, les objectifs et le délai souhaité."
                required
                className={`${FIELD} min-h-[160px] resize-y`}
              />
            </div>
            <p className="text-xs text-silver">
              Nous répondons sous 24h. En envoyant ce formulaire, vous acceptez le suivi par email pour ce projet.
            </p>
            <button
              type="submit"
              data-magnetic=""
              disabled={loading}
              className="btn-primary relative inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-medium disabled:opacity-60 sm:w-auto"
            >
              <ButtonGlint />
              <span className="relative">{loading ? "Envoi..." : "Envoyer ma demande"}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
