// Validation et mise en forme des réponses, générées depuis la définition du questionnaire. Utilisé par le
// navigateur (erreurs immédiates) et par le serveur (qui revalide tout).

import {
  ALL_FIELDS,
  TEXTAREA_MAX,
  TEXT_MAX,
  otherKey,
  visibleFields,
  visibleSections,
  type Answers,
  type Field,
  type Section,
} from "./definition";

const SINGLE_LINE_CONTROL = /[\u0000-\u001F\u007F\u2028\u2029]+/g;
const MULTILINE_CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]+/g;

const maxFor = (field: Field) => (field.kind === "textarea" ? (field.max ?? TEXTAREA_MAX) : field.kind === "text" ? (field.max ?? TEXT_MAX) : TEXT_MAX);

const cleanLine = (value: unknown, max: number) =>
  typeof value === "string" ? value.replace(SINGLE_LINE_CONTROL, " ").trim().slice(0, max) : "";

const cleanText = (value: unknown, max: number) =>
  typeof value === "string" ? value.replace(/\r\n?/g, "\n").replace(MULTILINE_CONTROL, "").trim().slice(0, max) : "";

// Ne garde que les questions connues, au bon type, aux bonnes valeurs et à la bonne longueur. Tout le reste
// (champs inventés, options inexistantes, texte démesuré) est écarté sans erreur.
export function sanitizeAnswers(raw: unknown): Answers {
  const source = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const out: Answers = {};
  for (const field of ALL_FIELDS) {
    const value = source[field.id];
    if (field.kind === "text") {
      const v = cleanLine(value, maxFor(field));
      if (v) out[field.id] = v;
    } else if (field.kind === "textarea") {
      const v = cleanText(value, maxFor(field));
      if (v) out[field.id] = v;
    } else {
      const allowed = new Set(field.options.map((o) => o.value));
      if (field.multiple) {
        const list = Array.isArray(value) ? [...new Set(value.filter((v): v is string => typeof v === "string" && allowed.has(v)))] : [];
        if (list.length) out[field.id] = list;
      } else if (typeof value === "string" && allowed.has(value)) {
        out[field.id] = value;
      }
      if (field.other) {
        const other = cleanLine(source[otherKey(field.id)], TEXT_MAX);
        if (other) out[otherKey(field.id)] = other;
      }
    }
  }
  return out;
}

// Retire les réponses des étapes ou blocs devenus invisibles (ex. section ERP décochée) : on ne conserve que ce
// qui concerne le projet décrit.
export function pruneHidden(answers: Answers): Answers {
  const keep = new Set<string>();
  for (const section of visibleSections(answers)) {
    for (const field of visibleFields(section, answers)) {
      keep.add(field.id);
      if (field.kind === "choices" && field.other) keep.add(otherKey(field.id));
    }
  }
  return Object.fromEntries(Object.entries(answers).filter(([key]) => keep.has(key)));
}

const isEmpty = (field: Field, answers: Answers) => {
  const value = answers[field.id];
  const other = field.kind === "choices" && field.other ? answers[otherKey(field.id)] : undefined;
  return (Array.isArray(value) ? value.length === 0 : !value) && !other;
};

export type FieldErrors = Record<string, string>;

export function validateSection(section: Section, answers: Answers): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of visibleFields(section, answers)) {
    if (field.required && isEmpty(field, answers)) {
      errors[field.id] = field.kind === "choices" ? "Choisissez au moins une option." : "Cette réponse est nécessaire.";
    }
  }
  return errors;
}

export function validateAll(answers: Answers): FieldErrors {
  return Object.assign({}, ...visibleSections(answers).map((s) => validateSection(s, answers)));
}

// Réponse à une question, en texte lisible (libellés des options, « Autre » compris) ; "" si sans réponse.
export function answerText(field: Field, answers: Answers): string {
  const value = answers[field.id];
  if (field.kind !== "choices") return typeof value === "string" ? value : "";
  const labels = (Array.isArray(value) ? value : value ? [value] : []).map(
    (v) => field.options.find((o) => o.value === v)?.label ?? v,
  );
  const other = answers[otherKey(field.id)];
  if (typeof other === "string" && other) labels.push(`${field.other} : ${other}`);
  return labels.join("\n");
}

export const answerById = (id: string, answers: Answers) => {
  const field = ALL_FIELDS.find((f) => f.id === id);
  return field ? answerText(field, answers) : "";
};

// Récapitulatif lisible (e-mails, administration) : sections visibles, questions répondues seulement.
export type Summary = { title: string; items: [string, string][] }[];

export function summarize(answers: Answers): Summary {
  return visibleSections(answers)
    .map((section) => ({
      title: section.title,
      items: visibleFields(section, answers).flatMap((field): [string, string][] => {
        const display = answerText(field, answers);
        return display ? [[field.label, display]] : [];
      }),
    }))
    .filter((s) => s.items.length > 0);
}
