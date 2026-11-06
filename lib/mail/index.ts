import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

import { SITE } from "@/lib/site";

// Envoi d'e-mails par SMTP (SMTP_URL) : Resend ou Brevo en production (domaine yonko.tech vérifié chez le
// fournisseur), Mailpit en local (intercepte tout, rien ne part). Sans SMTP_URL : e-mail écrit dans le journal
// en développement, erreur en production.

export type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

let transporter: Transporter | null = null;

export const mailConfigured = () => Boolean(process.env.SMTP_URL) || process.env.NODE_ENV !== "production";

export async function sendMail(mail: Mail) {
  const url = process.env.SMTP_URL;
  const from = process.env.MAIL_FROM || `${SITE.name} <bonjour@${new URL(SITE.url).hostname}>`;
  if (!url) {
    if (process.env.NODE_ENV === "production") throw new Error("SMTP_URL non défini : envoi d'e-mails impossible.");
    console.info(`[mail] (aucun SMTP_URL, e-mail non envoyé) À : ${mail.to}\nSujet : ${mail.subject}\n\n${mail.text}`);
    return;
  }
  transporter ??= nodemailer.createTransport(url);
  await transporter.sendMail({
    from,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: mail.replyTo || process.env.MAIL_REPLY_TO || undefined,
  });
}
