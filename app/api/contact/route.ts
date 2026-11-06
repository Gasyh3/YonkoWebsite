import { NextResponse } from "next/server";

import {
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  STARTED_FIELD,
  TURNSTILE_FIELD,
  readPayload,
  validateContact,
  type ContactPayload,
  type ContactResponse,
} from "@/lib/contact";
import { clientIp, readJsonObject, sameOrigin } from "@/lib/server/http";
import { createRateLimiter } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { SITE, orWriteUs } from "@/lib/site";

// Réception du formulaire de contact. Revalide tout côté serveur, filtre les robots (champ piège, durée de
// remplissage, origine, débit par adresse IP, Cloudflare Turnstile si TURNSTILE_SECRET_KEY est défini), puis transmet la demande :
// - par e-mail via Resend si RESEND_API_KEY est défini ;
// - à un webhook (Make, Zapier, n8n, CRM…) si CONTACT_WEBHOOK_URL est défini ;
// - les deux si les deux sont configurés (succès dès qu'un canal aboutit).
// Sans configuration : journal serveur en développement, erreur 503 explicite en production.

const MAX_BODY = 20_000; // octets
const limiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

const reply = (body: ContactResponse, status = 200) => NextResponse.json(body, { status });

function emailText(p: ContactPayload) {
  return [
    `Nom : ${p.name}`,
    `Société : ${p.company || "—"}`,
    `E-mail : ${p.email}`,
    `Sujet : ${p.subject}`,
    "",
    p.message,
    "",
    `— Envoyé depuis le formulaire de ${SITE.url}`,
  ].join("\n");
}

async function sendWithResend(p: ContactPayload, apiKey: string) {
  const host = new URL(SITE.url).hostname.replace(/^www\./, "");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || `${SITE.name} <site@${host}>`,
      to: (process.env.CONTACT_TO || SITE.email).split(",").map((s) => s.trim()),
      reply_to: p.email,
      subject: `[Site] ${p.subject} — ${p.name}`,
      text: emailText(p),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function sendToWebhook(p: ContactPayload, url: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...p, source: SITE.url, receivedAt: new Date().toISOString() }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ ok: false, message: "Origine non autorisée." }, 403);
  const body = await readJsonObject(request, MAX_BODY);
  if (body === "too-large") return reply({ ok: false, message: "Message trop long." }, 413);
  if (body === "invalid") return reply({ ok: false, message: "Requête invalide." }, 400);

  // Robots : réponse de succès sans rien transmettre (ne pas leur apprendre ce qui les trahit).
  const honeypot = body[HONEYPOT_FIELD];
  const startedAt = Number(body[STARTED_FIELD]);
  if ((typeof honeypot === "string" && honeypot.trim() !== "") || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return reply({ ok: true });
  }

  if (limiter.limited(clientIp(request))) {
    return reply(
      { ok: false, message: `Trop de demandes en peu de temps. Réessayez plus tard${orWriteUs()}.` },
      429,
    );
  }

  const payload = readPayload(body);
  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) return reply({ ok: false, errors }, 422);

  if (!(await verifyTurnstile(body[TURNSTILE_FIELD], clientIp(request)))) {
    return reply(
      { ok: false, message: `La vérification anti-robot a échoué. Réessayez${orWriteUs()}.` },
      400,
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const channels: Promise<void>[] = [];
  if (resendKey) channels.push(sendWithResend(payload, resendKey));
  if (webhook) channels.push(sendToWebhook(payload, webhook));

  if (channels.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Aucun canal configuré (RESEND_API_KEY / CONTACT_WEBHOOK_URL). Demande reçue :", payload);
      return reply({ ok: true });
    }
    console.error("[contact] Aucun canal d'envoi configuré en production.");
    return reply(
      { ok: false, message: `L'envoi est momentanément indisponible. Réessayez un peu plus tard${orWriteUs()}.` },
      503,
    );
  }

  const results = await Promise.allSettled(channels);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  for (const failure of failures) console.error("[contact] Échec d'un canal d'envoi :", failure.reason);
  if (failures.length === results.length) {
    return reply(
      { ok: false, message: `L'envoi n'a pas abouti. Réessayez dans un instant${orWriteUs()}.` },
      502,
    );
  }
  return reply({ ok: true });
}
