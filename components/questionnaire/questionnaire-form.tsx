"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ButtonGlint } from "@/components/motion/dotted-link";
import { QuestionField } from "@/components/questionnaire/question-field";
import { visibleGroups, visibleSections, type Answers } from "@/lib/questionnaire/definition";
import { validateAll, validateSection, type FieldErrors } from "@/lib/questionnaire/validate";

type SaveState = "idle" | "pending" | "saving" | "saved" | "error";

type Props = { email: string; initialAnswers: Answers; initialSavedAt: string | null };

const SAVE_DELAY = 1200; // ms après la dernière frappe
const timeFr = (iso: string) => new Intl.DateTimeFormat("fr-FR", { timeStyle: "short" }).format(new Date(iso));

// Questionnaire de cadrage : une étape par section visible (les sections 3 à 6 n'apparaissent que si le service
// correspondant est coché), puis une étape d'envoi. Le brouillon est enregistré automatiquement.
export function QuestionnaireForm({ email, initialAnswers, initialSavedAt }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saveState, setSaveState] = useState<SaveState>(initialSavedAt ? "saved" : "idle");
  const [savedAt, setSavedAt] = useState<string | null>(initialSavedAt);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [expired, setExpired] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dirty = useRef(false);
  const latest = useRef(answers);

  const sections = useMemo(() => visibleSections(answers), [answers]);
  const steps = useMemo(() => [...sections.map((s) => s.title), "Relecture et envoi"], [sections]);
  // Une section masquée (service décoché) peut raccourcir le parcours : l'étape affichée reste dans les bornes.
  const stepIndex = Math.min(step, sections.length);
  const isReview = stepIndex >= sections.length;
  const current = isReview ? null : sections[stepIndex];

  const save = useCallback(async () => {
    if (!dirty.current) return;
    dirty.current = false;
    setSaveState("saving");
    try {
      const res = await fetch("/api/questionnaire/brouillon", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: latest.current }),
      });
      if (res.status === 401) {
        setExpired(true);
        setSaveState("error");
        return;
      }
      const result = (await res.json().catch(() => null)) as { ok: boolean; savedAt?: string } | null;
      if (!res.ok || !result?.ok) throw new Error("save failed");
      setSavedAt(result.savedAt ?? new Date().toISOString());
      setSaveState("saved");
    } catch {
      dirty.current = true;
      setSaveState("error");
    }
  }, []);

  // Enregistrement automatique, un court instant après la dernière modification.
  useEffect(() => {
    latest.current = answers;
    if (!dirty.current) return;
    setSaveState("pending");
    const timer = window.setTimeout(save, SAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [answers, save]);

  // Avant de quitter la page avec des modifications non enregistrées : enregistrement immédiat.
  useEffect(() => {
    const flush = () => {
      if (!dirty.current) return;
      navigator.sendBeacon?.(
        "/api/questionnaire/brouillon",
        new Blob([JSON.stringify({ answers: latest.current })], { type: "application/json" }),
      );
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, []);

  const onChange = (key: string, value: string | string[]) => {
    dirty.current = true;
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key)));
  };

  const goTo = (index: number) => {
    setStep(index);
    setMessage("");
    void save();
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  };

  const next = () => {
    if (current) {
      const found = validateSection(current, answers);
      if (Object.keys(found).length) {
        setErrors(found);
        requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
        return;
      }
    }
    goTo(stepIndex + 1);
  };

  const submit = async () => {
    const found = validateAll(answers);
    if (Object.keys(found).length) {
      setErrors(found);
      const firstSection = sections.findIndex((s) => Object.keys(validateSection(s, answers)).length > 0);
      setMessage("Quelques réponses sont nécessaires : nous vous ramenons à l'étape concernée.");
      if (firstSection >= 0) goTo(firstSection);
      return;
    }
    if (!consent) {
      setMessage("Merci de cocher la case de consentement pour envoyer vos réponses.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/questionnaire/envoi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, consent }),
      });
      const result = (await res.json().catch(() => null)) as { ok: boolean; message?: string; errors?: FieldErrors } | null;
      if (res.status === 401) setExpired(true);
      if (res.ok && result?.ok) {
        dirty.current = false;
        router.refresh();
        return;
      }
      if (result?.errors) setErrors(result.errors);
      setMessage(result?.message || "L'envoi n'a pas abouti. Réessayez dans un instant.");
    } catch {
      setMessage("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeSession = async () => {
    await save();
    await fetch("/api/questionnaire/sortie", { method: "POST" }).catch(() => null);
    router.refresh();
  };

  const saveLabel =
    saveState === "saving" || saveState === "pending"
      ? "Enregistrement…"
      : saveState === "error"
        ? "Brouillon non enregistré : vérifiez votre connexion."
        : savedAt
          ? `Brouillon enregistré à ${timeFr(savedAt)}`
          : "Vos réponses seront enregistrées automatiquement.";

  if (expired) {
    return (
      <div className="panel" role="alert">
        <h2 className="font-display text-3xl text-silver-light">Votre session a expiré</h2>
        <p className="mt-4">Vos réponses déjà enregistrées sont conservées. Demandez un nouveau lien pour reprendre.</p>
        <Link href="/questionnaire" className="link-dotted mt-6 inline-block text-sm text-silver" onClick={() => router.refresh()}>
          Recevoir un nouveau lien
        </Link>
      </div>
    );
  }

  const progress = (stepIndex + 1) / steps.length;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-16">
      <aside className="md:sticky md:top-24 md:self-start">
        <p className="text-xs uppercase tracking-[0.24em] text-silver">
          Étape {stepIndex + 1} sur {steps.length}
        </p>
        <div className="q-progress mt-4" aria-hidden="true">
          <span className="q-progress__on" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <ol className="mt-6 hidden space-y-1 md:block">
          {steps.map((title, i) => (
            <li key={title}>
              <button
                type="button"
                className="q-step"
                data-current={i === stepIndex ? "" : undefined}
                aria-current={i === stepIndex ? "step" : undefined}
                onClick={() => goTo(i)}
              >
                <span className="q-step__node" aria-hidden="true" />
                {title}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-xs text-silver" role="status" aria-live="polite">
          {saveLabel}
        </p>
        <p className="mt-2 text-xs text-silver">
          Connecté avec {email}.{" "}
          <button type="button" className="link-dotted" onClick={closeSession}>
            Fermer la session
          </button>
        </p>
      </aside>

      <div>
        <h2 ref={headingRef} tabIndex={-1} className="scroll-mt-28 font-display text-3xl text-silver-light outline-none md:text-5xl">
          {isReview ? "Relecture et envoi" : current?.title}
        </h2>

        {current ? (
          <div className="mt-10 space-y-12">
            {visibleGroups(current, answers).map((group, gi) => (
              <div key={group.title ?? gi} className="space-y-8">
                {group.title ? <h3 className="font-display text-2xl text-silver-light">{group.title}</h3> : null}
                {group.fields.map((field) => (
                  <QuestionField key={field.id} field={field} answers={answers} error={errors[field.id]} onChange={onChange} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            <p>
              Vérifiez vos réponses étape par étape si besoin (vous pouvez revenir à n&apos;importe quelle étape), puis
              envoyez le questionnaire. Une fois envoyé, il ne sera plus modifiable : vous recevrez un récapitulatif par
              e-mail.
            </p>
            <ul className="dot-list">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button type="button" className="link-dotted" onClick={() => goTo(i)}>
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
            <label className="q-choice">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span className="q-choice__box" aria-hidden="true" />
              <span>
                J&apos;accepte que mes réponses soient utilisées pour préparer une proposition, dans les conditions de la{" "}
                <Link href="/confidentialite" className="link-dotted text-silver-light" target="_blank">
                  politique de confidentialité
                </Link>
                .
              </span>
            </label>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          {stepIndex > 0 ? (
            <button type="button" className="link-dotted text-sm text-silver sm:order-first" onClick={() => goTo(stepIndex - 1)}>
              ← Étape précédente
            </button>
          ) : null}
          <button
            type="button"
            data-magnetic=""
            disabled={submitting}
            onClick={isReview ? submit : next}
            className="btn-primary relative inline-flex h-12 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full px-6 text-sm font-medium disabled:opacity-60 sm:ml-auto sm:w-auto"
          >
            <ButtonGlint />
            <span className="relative">{isReview ? (submitting ? "Envoi..." : "Envoyer le questionnaire") : "Étape suivante →"}</span>
          </button>
        </div>
        <p role="status" aria-live="polite" className="form-status mt-4 text-sm">
          {message}
        </p>
      </div>
    </div>
  );
}
