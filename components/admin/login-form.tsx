"use client";

import { FormEvent, useState } from "react";

import { ButtonGlint } from "@/components/motion/dotted-link";

// Connexion à l'administration : un lien est envoyé à l'adresse autorisée (ADMIN_EMAIL).
export function AdminLoginForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    const res = await fetch("/api/admin/connexion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    const result = (await res?.json().catch(() => null)) as { message?: string } | null;
    setState(res?.ok ? "done" : "idle");
    setMessage(result?.message ?? "Connexion impossible. Réessayez.");
  };

  return (
    <form className="panel space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label htmlFor="admin-email" className="form-label">
          Adresse e-mail
        </label>
        <input id="admin-email" name="email" type="email" autoComplete="email" required maxLength={200} className="form-field" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          data-magnetic=""
          disabled={state === "sending"}
          className="btn-primary relative inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-6 text-sm font-medium disabled:opacity-60"
        >
          <ButtonGlint />
          <span className="relative">{state === "sending" ? "Envoi..." : "Recevoir un lien de connexion"}</span>
        </button>
        <p role="status" aria-live="polite" className="form-status text-sm">
          {message}
        </p>
      </div>
    </form>
  );
}
