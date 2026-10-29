"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { ButtonGlint } from "@/components/motion/dotted-link";
import { TURNSTILE_SITE_KEY, Turnstile } from "@/components/pages/turnstile";
import {
  CONTACT_FIELDS,
  CONTACT_MAX_LENGTH,
  HONEYPOT_FIELD,
  STARTED_FIELD,
  TURNSTILE_FIELD,
  readPayload,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactResponse,
} from "@/lib/contact";
import { orWriteUs } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

const FIELDS: {
  name: ContactField;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required: boolean;
  multiline?: boolean;
}[] = [
  { name: "name", label: "Nom", placeholder: "Votre nom", autoComplete: "name", required: true },
  { name: "company", label: "Société", placeholder: "Votre entreprise", autoComplete: "organization", required: false },
  { name: "email", label: "Email", placeholder: "vous@entreprise.com", type: "email", autoComplete: "email", required: true },
  { name: "subject", label: "Sujet", placeholder: "Site vitrine, fiche Google, logiciel…", required: true },
  {
    name: "message",
    label: "Message",
    placeholder: "Détaillez le contexte, les objectifs et le délai souhaité.",
    required: true,
    multiline: true,
  },
];

// Formulaire de contact : validation immédiate (mêmes règles que /api/contact), erreurs sous chaque champ
// (aria-invalid + aria-describedby, focus sur le premier champ en erreur), état d'envoi, confirmation qui
// remplace le formulaire et reçoit le focus. Anti-spam : champ piège invisible, heure d'ouverture du formulaire et,
// si configuré, Cloudflare Turnstile.
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [message, setMessage] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const restart = useRef(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaRound, setCaptchaRound] = useState(0);
  const onCaptchaToken = useCallback((token: string) => setCaptchaToken(token), []);

  // Le focus suit l'état : sur la confirmation après l'envoi, sur le premier champ pour une nouvelle demande.
  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
    else if (status === "idle" && restart.current) {
      restart.current = false;
      formRef.current?.querySelector<HTMLElement>("input")?.focus();
    }
  }, [status]);

  const markStarted = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  const focusField = (field: ContactField) => {
    formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
  };

  const showErrors = (next: ContactErrors) => {
    setErrors(next);
    const first = CONTACT_FIELDS.find((field) => next[field]);
    if (first) focusField(first);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const payload = readPayload(data);
    const invalid = validateContact(payload);
    setMessage("");
    if (Object.keys(invalid).length > 0) {
      showErrors(invalid);
      return;
    }
    setErrors({});
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setStatus("error");
      setMessage("Vérification anti-robot en cours : réessayez dans un instant.");
      return;
    }
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] ?? "",
          [STARTED_FIELD]: startedAt.current || Date.now(),
          [TURNSTILE_FIELD]: captchaToken,
        }),
      });
      // Un jeton Turnstile ne sert qu'une fois : nouveau défi pour un éventuel nouvel envoi.
      if (TURNSTILE_SITE_KEY) setCaptchaRound((n) => n + 1);
      const result = (await res.json().catch(() => null)) as ContactResponse | null;
      if (res.ok && result?.ok) {
        setStatus("sent");
        return;
      }
      setStatus("error");
      if (result && !result.ok && result.errors) showErrors(result.errors);
      setMessage(
        (result && !result.ok && result.message) ||
          (result && !result.ok && result.errors
            ? "Certains champs sont à corriger."
            : `L'envoi n'a pas abouti. Réessayez dans un instant${orWriteUs()}.`),
      );
    } catch {
      setStatus("error");
      setMessage(`Connexion impossible. Vérifiez votre réseau et réessayez${orWriteUs()}.`);
    }
  };

  const clearError = (field: ContactField) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (status === "sent") {
    return (
      <div className="panel contact-done self-start" role="status">
        <span className="contact-done__node" aria-hidden="true" />
        <h2 ref={doneRef} tabIndex={-1} className="font-display text-3xl text-silver-light outline-none md:text-4xl">
          Merci, votre demande est bien partie.
        </h2>
        <p className="mt-4">Nous revenons vers vous sous 24h avec une première lecture de votre besoin.</p>
        <button
          type="button"
          className="link-dotted mt-8 text-sm text-silver"
          onClick={() => {
            startedAt.current = 0;
            restart.current = true;
            setStatus("idle");
          }}
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      className="panel space-y-6"
      onSubmit={onSubmit}
      onFocus={markStarted}
      onPointerDown={markStarted}
      noValidate
      aria-busy={sending}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const error = errors[field.name];
          const errorId = `${field.name}-error`;
          const common = {
            id: field.name,
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
            maxLength: CONTACT_MAX_LENGTH[field.name],
            autoComplete: field.autoComplete,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? errorId : undefined,
            disabled: sending,
            onChange: () => clearError(field.name),
          };
          return (
            <div key={field.name} className={field.multiline ? "space-y-2 sm:col-span-2" : "space-y-2"}>
              <label htmlFor={field.name} className="form-label">
                {field.label}
                {field.required ? null : <span className="text-silver/60"> (facultatif)</span>}
              </label>
              {field.multiline ? (
                <textarea {...common} className="form-field min-h-[160px] resize-y" />
              ) : (
                <input {...common} type={field.type ?? "text"} className="form-field" />
              )}
              {error ? (
                <p id={errorId} className="form-error">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Champ piège : invisible et hors du parcours clavier ; un humain ne le remplit jamais. */}
      <div className="form-trap" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Ne pas remplir</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Turnstile onToken={onCaptchaToken} resetKey={captchaRound} />

      <p className="text-xs text-silver">
        Nous répondons sous 24h. En envoyant ce formulaire, vous acceptez le suivi par email pour ce projet.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          data-magnetic=""
          disabled={sending}
          className="btn-primary relative inline-flex h-12 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full px-6 text-sm font-medium disabled:opacity-60 sm:w-auto"
        >
          <ButtonGlint />
          <span className="relative">{sending ? "Envoi..." : "Envoyer ma demande"}</span>
        </button>
        <p role="status" aria-live="polite" className="form-status text-sm">
          {sending ? "Envoi en cours…" : message}
        </p>
      </div>
    </form>
  );
}
