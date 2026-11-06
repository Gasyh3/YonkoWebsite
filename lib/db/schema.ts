import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Schéma PostgreSQL (Drizzle). Après toute modification : make db-generate (crée la migration SQL dans drizzle/),
// appliquée automatiquement au démarrage du serveur (instrumentation.ts).

// Réponses du questionnaire : une valeur par question (texte, ou liste pour les cases à cocher). Stockées en JSON
// avec la version du questionnaire, pour qu'il puisse évoluer sans changer la base.
export type IntakeAnswers = Record<string, string | string[]>;

export const INTAKE_STATUSES = ["invite", "en_cours", "soumis", "devis_envoye", "gagne", "perdu", "archive"] as const;
export type IntakeStatus = (typeof INTAKE_STATUSES)[number];
export const intakeStatus = pgEnum("intake_status", INTAKE_STATUSES);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

// Un dossier = un questionnaire de cadrage, ouvert par un lien envoyé à l'adresse du client.
export const intakes = pgTable(
  "intakes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name").notNull().default(""),
    tokenHash: text("token_hash").notNull().unique(), // empreinte du lien d'accès (jamais le lien lui-même)
    tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }).notNull(),
    status: intakeStatus("status").notNull().default("invite"),
    answers: jsonb("answers").$type<IntakeAnswers>().notNull().default({}),
    questionnaireVersion: integer("questionnaire_version").notNull().default(1),
    notes: text("notes").notNull().default(""), // notes internes (administration uniquement)
    consentAt: timestamp("consent_at", { withTimezone: true }),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("intakes_email_idx").on(t.email), index("intakes_status_idx").on(t.status)],
);

// Connexion à l'administration : lien à usage unique envoyé à ADMIN_EMAIL, puis session.
export const adminLoginTokens = pgTable("admin_login_tokens", {
  tokenHash: text("token_hash").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  idHash: text("id_hash").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Intake = typeof intakes.$inferSelect;
