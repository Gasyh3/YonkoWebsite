"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

// Inviter un client : il reçoit le même lien que s'il l'avait demandé sur /questionnaire.
export function AdminInviteForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    const res = await fetch("/api/admin/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), name: data.get("name") }),
    }).catch(() => null);
    const result = (await res?.json().catch(() => null)) as { message?: string } | null;
    setBusy(false);
    setMessage(result?.message ?? "Invitation impossible.");
    if (res?.ok) {
      form.reset();
      router.refresh();
    }
  };

  return (
    <form className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label htmlFor="invite-email" className="form-label">
          E-mail du client
        </label>
        <input id="invite-email" name="email" type="email" required maxLength={200} className="form-field" />
      </div>
      <div className="space-y-2">
        <label htmlFor="invite-name" className="form-label">
          Nom (facultatif)
        </label>
        <input id="invite-name" name="name" type="text" maxLength={100} className="form-field" />
      </div>
      <button type="submit" disabled={busy} className="btn-primary h-12 rounded-full px-6 text-sm font-medium disabled:opacity-60">
        {busy ? "Envoi..." : "Inviter"}
      </button>
      <p role="status" aria-live="polite" className="form-status text-sm sm:col-span-3">
        {message}
      </p>
    </form>
  );
}
