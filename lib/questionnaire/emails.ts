import "server-only";

import type { Intake } from "@/lib/db/schema";
import { renderMail } from "@/lib/mail/templates";
import { appUrl } from "@/lib/server/config";
import { SITE } from "@/lib/site";

import { answerById, summarize } from "./validate";

const dateFr = (date: Date) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Indian/Antananarivo" }).format(date);

const hello = (name: string) => (name ? `Bonjour ${name},` : "Bonjour,");

// Lien d'accès au questionnaire (demande depuis /questionnaire).
export function invitationMail(name: string, link: string, expiresAt: Date) {
  return {
    subject: `Votre questionnaire de cadrage · ${SITE.name}`,
    ...renderMail({
      preheader: "Votre lien personnel pour décrire votre projet.",
      title: "Votre questionnaire de cadrage",
      blocks: [
        { kind: "p", text: hello(name) },
        {
          kind: "p",
          text: "Voici votre lien personnel. Il ouvre un questionnaire qui nous permet de comprendre votre projet et de vous préparer une proposition précise.",
        },
        { kind: "button", label: "Ouvrir le questionnaire", href: link },
        {
          kind: "p",
          text: `Vos réponses sont enregistrées au fur et à mesure : vous pouvez vous arrêter et reprendre plus tard avec ce même lien, valable jusqu'au ${dateFr(expiresAt)}.`,
        },
        { kind: "small", text: "Vous n'êtes pas à l'origine de cette demande ? Ignorez simplement ce message : rien ne sera fait sans vous." },
      ],
    }),
  };
}

// Accusé de réception au client, avec le récapitulatif de ses réponses.
export function confirmationMail(intake: Intake) {
  const summary = summarize(intake.answers);
  return {
    subject: `Questionnaire bien reçu · ${SITE.name}`,
    ...renderMail({
      preheader: "Merci, nous revenons vers vous sous 24h.",
      title: "Merci, votre questionnaire est bien arrivé",
      blocks: [
        { kind: "p", text: hello(intake.name) },
        { kind: "p", text: "Nous avons bien reçu vos réponses et revenons vers vous sous 24h pour convenir d'un appel de cadrage." },
        { kind: "p", text: "Pour mémoire, voici ce que vous nous avez transmis :" },
        ...summary.flatMap((s) => [
          { kind: "p" as const, text: s.title.toUpperCase() },
          { kind: "list" as const, items: s.items },
        ]),
      ],
    }),
  };
}

// Notification à l'administration (ADMIN_EMAIL) : nouveau questionnaire envoyé.
export function adminNotificationMail(intake: Intake) {
  const pick = (id: string) => answerById(id, intake.answers);
  return {
    subject: `Nouveau questionnaire : ${pick("entreprise_nom") || intake.email}`,
    ...renderMail({
      preheader: `${pick("entreprise_nom") || intake.email} vient d'envoyer son questionnaire.`,
      title: "Nouveau questionnaire de cadrage",
      blocks: [
        {
          kind: "list",
          items: [
            ["Entreprise", pick("entreprise_nom") || "—"],
            ["Contact", [pick("contact_nom"), intake.email].filter(Boolean).join(" · ")],
            ["Services", pick("services") || "—"],
            ["Budget", pick("budget") || "—"],
          ],
        },
        { kind: "button", label: "Ouvrir le dossier", href: `${appUrl()}/admin/dossiers/${intake.id}` },
        { kind: "small", text: "À recontacter sous 24h (engagement affiché sur le site)." },
      ],
    }),
  };
}
