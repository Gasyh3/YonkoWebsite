"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { STATUS_LABELS } from "@/lib/admin/labels";
import { INTAKE_STATUSES, type IntakeStatus } from "@/lib/questionnaire/statuses";

// Suivi d'un dossier : statut, notes internes, impression / PDF, suppression (droit à l'effacement).
export function IntakeControls({ id, status, notes }: { id: string; status: IntakeStatus; notes: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [text, setText] = useState(notes);
  const [message, setMessage] = useState("");

  const patch = async (body: Record<string, string>, done: string) => {
    const res = await fetch(`/api/admin/dossiers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    setMessage(res?.ok ? done : "Enregistrement impossible.");
    if (res?.ok) router.refresh();
  };

  const remove = async () => {
    if (!window.confirm("Supprimer définitivement ce dossier et toutes ses réponses ?")) return;
    const res = await fetch(`/api/admin/dossiers/${id}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) {
      router.push("/admin");
      router.refresh();
    } else setMessage("Suppression impossible.");
  };

  return (
    <div className="panel space-y-6 print:hidden">
      <div className="space-y-2">
        <label htmlFor="intake-status" className="form-label">
          Statut
        </label>
        <select
          id="intake-status"
          className="form-field"
          value={value}
          onChange={(e) => {
            const next = e.target.value as IntakeStatus;
            setValue(next);
            void patch({ status: next }, `Statut : ${STATUS_LABELS[next]}.`);
          }}
        >
          {INTAKE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="intake-notes" className="form-label">
          Notes internes
        </label>
        <textarea
          id="intake-notes"
          className="form-field min-h-[140px] resize-y"
          maxLength={10_000}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="button" className="link-dotted text-sm text-silver" onClick={() => patch({ notes: text }, "Notes enregistrées.")}>
          Enregistrer les notes
        </button>
      </div>
      <div className="flex flex-wrap gap-6 text-sm">
        <button type="button" className="link-dotted text-silver" onClick={() => window.print()}>
          Imprimer / PDF
        </button>
        <button type="button" className="link-dotted text-silver" onClick={remove}>
          Supprimer le dossier
        </button>
      </div>
      <p role="status" aria-live="polite" className="form-status text-sm">
        {message}
      </p>
    </div>
  );
}
