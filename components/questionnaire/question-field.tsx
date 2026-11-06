"use client";

import { TEXTAREA_MAX, TEXT_MAX, otherKey, type Answers, type Field } from "@/lib/questionnaire/definition";

type Props = {
  field: Field;
  answers: Answers;
  error?: string;
  onChange: (key: string, value: string | string[]) => void;
};

// Une question du questionnaire, rendue d'après sa définition. Accessibilité : libellé lié au champ, groupe de
// choix en fieldset/legend, erreur reliée par aria-describedby.
export function QuestionField({ field, answers, error, onChange }: Props) {
  const id = `q-${field.id}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [field.hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;
  const label = (
    <>
      {field.label}
      {field.required ? <span className="text-silver/60"> (obligatoire)</span> : null}
    </>
  );
  const hint = field.hint ? (
    <p id={hintId} className="text-xs text-silver">
      {field.hint}
    </p>
  ) : null;
  const errorText = error ? (
    <p id={errorId} className="form-error">
      {error}
    </p>
  ) : null;

  if (field.kind === "choices") {
    const value = answers[field.id];
    const selected = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
    const toggle = (option: string) => {
      if (!field.multiple) return onChange(field.id, selected[0] === option ? "" : option);
      onChange(field.id, selected.includes(option) ? selected.filter((v) => v !== option) : [...selected, option]);
    };
    const other = answers[otherKey(field.id)];
    return (
      <fieldset className="space-y-3" aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
        <legend className="q-label mb-3">{label}</legend>
        {hint}
        <div className="grid gap-2">
          {field.options.map((option) => (
            <label key={option.value} className="q-choice">
              <input
                type={field.multiple ? "checkbox" : "radio"}
                name={field.id}
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                onClick={(e) => {
                  // Bouton radio : un second clic désélectionne (« je ne sais pas » reste possible).
                  if (!field.multiple && selected[0] === option.value) {
                    e.preventDefault();
                    toggle(option.value);
                  }
                }}
              />
              <span className={field.multiple ? "q-choice__box" : "q-choice__box q-choice__box--radio"} aria-hidden="true" />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {field.other ? (
          <div className="space-y-2 pt-1">
            <label htmlFor={`${id}-other`} className="text-sm text-silver">
              {field.other} :
            </label>
            <input
              id={`${id}-other`}
              type="text"
              className="form-field"
              maxLength={TEXT_MAX}
              value={typeof other === "string" ? other : ""}
              onChange={(e) => onChange(otherKey(field.id), e.target.value)}
            />
          </div>
        ) : null}
        {errorText}
      </fieldset>
    );
  }

  const value = answers[field.id];
  const common = {
    id,
    name: field.id,
    value: typeof value === "string" ? value : "",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": field.required ? true : undefined,
  } as const;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="q-label">
        {label}
      </label>
      {hint}
      {field.kind === "textarea" ? (
        <textarea
          {...common}
          maxLength={field.max ?? TEXTAREA_MAX}
          rows={4}
          className="form-field min-h-[120px] resize-y"
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      ) : (
        <input
          {...common}
          type={field.inputType ?? "text"}
          maxLength={field.max ?? TEXT_MAX}
          autoComplete={field.inputType === "tel" ? "tel" : "off"}
          className="form-field"
          onChange={(e) => onChange(field.id, e.target.value)}
        />
      )}
      {errorText}
    </div>
  );
}
