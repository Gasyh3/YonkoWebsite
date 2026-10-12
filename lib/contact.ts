// Formulaire de contact : champs, limites et validation, partagés par le navigateur (messages immédiats) et la
// route /api/contact (qui revalide tout). Aucune dépendance : utilisable des deux côtés.

export const CONTACT_FIELDS = ["name", "company", "email", "subject", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactPayload = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

// Anti-spam : champ piège invisible (rempli = robot) et durée minimale de remplissage.
export const HONEYPOT_FIELD = "website";
export const STARTED_FIELD = "startedAt";
export const MIN_FILL_MS = 3000;

const LIMITS: Record<ContactField, { min: number; max: number }> = {
  name: { min: 2, max: 100 },
  company: { min: 0, max: 120 },
  email: { min: 5, max: 200 },
  subject: { min: 3, max: 150 },
  message: { min: 20, max: 5000 },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function readPayload(source: Record<string, unknown>): ContactPayload {
  const payload = {} as ContactPayload;
  for (const field of CONTACT_FIELDS) {
    const value = source[field];
    payload[field] = typeof value === "string" ? value.trim() : "";
  }
  return payload;
}

export function validateContact(payload: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  const { name, company, email, subject, message } = payload;

  if (!name) errors.name = "Indiquez votre nom.";
  else if (name.length < LIMITS.name.min) errors.name = "Votre nom semble incomplet.";
  else if (name.length > LIMITS.name.max) errors.name = `${LIMITS.name.max} caractères maximum.`;

  if (company.length > LIMITS.company.max) errors.company = `${LIMITS.company.max} caractères maximum.`;

  if (!email) errors.email = "Indiquez votre adresse e-mail.";
  else if (email.length > LIMITS.email.max || !EMAIL.test(email))
    errors.email = "Cette adresse e-mail ne semble pas valide.";

  if (!subject) errors.subject = "Précisez le sujet de votre demande.";
  else if (subject.length < LIMITS.subject.min) errors.subject = "Un sujet un peu plus précis, s'il vous plaît.";
  else if (subject.length > LIMITS.subject.max) errors.subject = `${LIMITS.subject.max} caractères maximum.`;

  if (!message) errors.message = "Décrivez votre besoin en quelques lignes.";
  else if (message.length < LIMITS.message.min)
    errors.message = `Quelques mots de plus (${LIMITS.message.min} caractères minimum).`;
  else if (message.length > LIMITS.message.max) errors.message = `${LIMITS.message.max} caractères maximum.`;

  return errors;
}

export const CONTACT_MAX_LENGTH: Record<ContactField, number> = {
  name: LIMITS.name.max,
  company: LIMITS.company.max,
  email: LIMITS.email.max,
  subject: LIMITS.subject.max,
  message: LIMITS.message.max,
};

// Réponse de la route : succès, erreurs par champ, ou message général.
export type ContactResponse = { ok: true } | { ok: false; errors?: ContactErrors; message?: string };
