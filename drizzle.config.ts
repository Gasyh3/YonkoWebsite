import { defineConfig } from "drizzle-kit";

// drizzle-kit : génération des migrations SQL (make db-generate) et explorateur de données (make db-studio).
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "postgres://yonko:yonko@localhost:5432/yonko" },
});
