import { DottedLink } from "@/components/motion/dotted-link";
import { PageHeader } from "@/components/page/page-header";
import { ContactForm } from "@/components/pages/contact-form";
import { SITE, emailHref, pageMetadata, phoneHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Un projet de site web, de fiche Google Maps ou de logiciel à Madagascar ? Décrivez-le à Yonko Tech Consulting, à Antananarivo : réponse sous 24h.",
  path: "/contact",
});

// Ce qui suit l'envoi (repris des engagements de la v1 : réponse sous 24h, créneau de cadrage).
const NEXT_STEPS = [
  { title: "Vous décrivez votre besoin", text: "Quelques lignes suffisent : le contexte, l'objectif, le délai." },
  { title: "Nous répondons sous 24h", text: "Avec une première lecture de votre demande." },
  { title: "Un créneau pour cadrer", text: "On précise ensemble et on recommande les premiers pas." },
];

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Parlons de vos projets"
        lead="Site vitrine, référencement, fiche Google, logiciel de gestion ou simple question : décrivez votre besoin en quelques lignes. Nous répondons sous 24h et proposons un échange pour cadrer les premiers pas."
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
            {emailHref() ? (
              <p className="mt-12 text-sm text-silver">
                Vous préférez l&apos;e-mail ?{" "}
                <DottedLink href={emailHref() as string} className="text-silver-light">
                  {SITE.email}
                </DottedLink>
              </p>
            ) : null}
            {phoneHref() ? (
              <p className="mt-3 text-sm text-silver">
                Ou le téléphone :{" "}
                <DottedLink href={phoneHref() as string} className="text-silver-light">
                  {SITE.telephone}
                </DottedLink>
              </p>
            ) : null}
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
