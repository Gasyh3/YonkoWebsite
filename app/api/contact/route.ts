import { NextResponse } from "next/server";

import {
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  STARTED_FIELD,
  readPayload,
  validateContact,
  type ContactPayload,
  type ContactResponse,
} from "@/lib/contact";
import { SITE } from "@/lib/site";

// Réception du formulaire de contact. Revalide tout côté serveur, filtre les robots (champ piège, durée de
// remplissage, origine, débit par adresse IP), puis transmet la demande :
// - par e-mail via Resend si RESEND_API_KEY est défini ;
// - à un webhook (Make, Zapier, n8n, CRM…) si CONTACT_WEBHOOK_URL est défini ;
// - les deux si les deux sont configurés (succès dès qu'un canal aboutit).
// Sans configuration : journal serveur en développement, erreur 503 explicite en production.

const MAX_BODY = 20_000; // octets
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

// Limite de débit en mémoire : suffisante pour un site vitrine sur un serveur ; sur une plateforme à instances
// multiples, chaque instance compte de son côté (le champ piège et la durée restent les filtres principaux).
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, list] of hits) if (list.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
  }
  return recent.length > RATE_MAX;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

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
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY)
    return reply({ ok: false, message: "Message trop long." }, 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return reply({ ok: false, message: "Requête invalide." }, 400);
  }

  // Robots : réponse de succès sans rien transmettre (ne pas leur apprendre ce qui les trahit).
  const honeypot = body[HONEYPOT_FIELD];
  const startedAt = Number(body[STARTED_FIELD]);
  if ((typeof honeypot === "string" && honeypot.trim() !== "") || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return reply({ ok: true });
  }

  if (rateLimited(clientIp(request))) {
    return reply(
      { ok: false, message: `Trop de demandes en peu de temps. Réessayez plus tard ou écrivez-nous à ${SITE.email}.` },
      429,
    );
  }

  const payload = readPayload(body);
  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) return reply({ ok: false, errors }, 422);

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
      { ok: false, message: `L'envoi est momentanément indisponible. Écrivez-nous directement à ${SITE.email}.` },
      503,
    );
  }

  const results = await Promise.allSettled(channels);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  for (const failure of failures) console.error("[contact] Échec d'un canal d'envoi :", failure.reason);
  if (failures.length === results.length) {
    return reply(
      { ok: false, message: `L'envoi n'a pas abouti. Réessayez dans un instant ou écrivez-nous à ${SITE.email}.` },
      502,
    );
  }
  return reply({ ok: true });
}
