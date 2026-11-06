"use client";

import { FormEvent, useCallback, useRef, useState } from "react";

import { ButtonGlint } from "@/components/motion/dotted-link";
import { TURNSTILE_SITE_KEY, Turnstile } from "@/components/pages/turnstile";
import { HONEYPOT_FIELD, STARTED_FIELD, TURNSTILE_FIELD } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error";

// Demande du lien d'accès : l'adresse e-mail (et le nom, facultatif). Le lien arrive par e-mail ; la réponse est
// la même que l'adresse soit connue ou non.
export function QuestionnaireRequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaRound, setCaptchaRound] = useState(0);
  const onCaptchaToken = useCallback((token: string) => setCaptchaToken(token), []);
  const startedAt = useRef(0);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const markStarted = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const email = String(data.email ?? "").trim();
    setMessage("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setEmailError("Cette adresse e-mail ne semble pas valide.");
      event.currentTarget.querySelector<HTMLInputElement>("#q-email")?.focus();
      return;
    }
    setEmailError("");
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setStatus("error");
      setMessage("Vérification anti-robot en cours : réessayez dans un instant.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/questionnaire/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: data.name ?? "",
          [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] ?? "",
          [STARTED_FIELD]: startedAt.current || Date.now(),
          [TURNSTILE_FIELD]: captchaToken,
        }),
      });
      if (TURNSTILE_SITE_KEY) setCaptchaRound((n) => n + 1);
      const result = (await res.json().catch(() => null)) as { ok: boolean; message?: string } | null;
      if (res.ok && result?.ok) {
        setStatus("sent");
        requestAnimationFrame(() => doneRef.current?.focus());
        return;
      }
      setStatus("error");
      setMessage(result?.message || "L'envoi n'a pas abouti. Réessayez dans un instant.");
    } catch {
      setStatus("error");
      setMessage("Connexion impossible. Vérifiez votre réseau et réessayez.");
    }
  };

  if (status === "sent") {
    return (
      <div className="panel contact-done self-start" role="status">
        <span className="contact-done__node" aria-hidden="true" />
        <h2 ref={doneRef} tabIndex={-1} className="font-display text-3xl text-silver-light outline-none md:text-4xl">
          Vérifiez votre boîte de réception.
        </h2>
        <p className="mt-4">
          Si l&apos;adresse est valide, un e-mail vient de partir avec votre lien personnel vers le questionnaire. Pensez
          à regarder dans les courriers indésirables.
        </p>
        <button type="button" className="link-dotted mt-8 text-sm text-silver" onClick={() => setStatus("idle")}>
          Utiliser une autre adresse
        </button>
      </div>
    );
  }

  const sending = status === "sending";
  return (
    <form className="panel space-y-6" onSubmit={onSubmit} onFocus={markStarted} onPointerDown={markStarted} noValidate aria-busy={sending}>
      <div className="space-y-2">
        <label htmlFor="q-email" className="form-label">
          Votre adresse e-mail
        </label>
        <input
          id="q-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="vous@entreprise.com"
          required
          maxLength={200}
          disabled={sending}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "q-email-error" : undefined}
          onChange={() => emailError && setEmailError("")}
          className="form-field"
        />
        {emailError ? (
          <p id="q-email-error" className="form-error">
            {emailError}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label htmlFor="q-name" className="form-label">
          Votre nom <span className="text-silver/60">(facultatif)</span>
        </label>
        <input id="q-name" name="name" type="text" autoComplete="name" maxLength={100} disabled={sending} className="form-field" />
      </div>

      <div className="form-trap" aria-hidden="true">
        <label htmlFor={`q-${HONEYPOT_FIELD}`}>Ne pas remplir</label>
        <input id={`q-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Turnstile onToken={onCaptchaToken} resetKey={captchaRound} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          data-magnetic=""
          disabled={sending}
          className="btn-primary relative inline-flex h-12 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full px-6 text-sm font-medium disabled:opacity-60 sm:w-auto"
        >
          <ButtonGlint />
          <span className="relative">{sending ? "Envoi..." : "Recevoir mon lien"}</span>
        </button>
        <p role="status" aria-live="polite" className="form-status text-sm">
          {sending ? "Envoi en cours…" : message}
        </p>
      </div>
    </form>
  );
}
