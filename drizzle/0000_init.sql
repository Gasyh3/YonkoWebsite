CREATE TYPE "public"."intake_status" AS ENUM('invite', 'en_cours', 'soumis', 'devis_envoye', 'gagne', 'perdu', 'archive');--> statement-breakpoint
CREATE TABLE "admin_login_tokens" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"id_hash" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"token_hash" text NOT NULL,
	"token_expires_at" timestamp with time zone NOT NULL,
	"status" "intake_status" DEFAULT 'invite' NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"questionnaire_version" integer DEFAULT 1 NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"consent_at" timestamp with time zone,
	"submitted_at" timestamp with time zone,
	"last_seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "intakes_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE INDEX "intakes_email_idx" ON "intakes" USING btree ("email");--> statement-breakpoint
CREATE INDEX "intakes_status_idx" ON "intakes" USING btree ("status");