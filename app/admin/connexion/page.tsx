import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/login-form";
import { PageHeader } from "@/components/page/page-header";
import { isAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";

export const metadata = { title: "Connexion" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  if (await isAdmin()) redirect("/admin");
  const { lien } = await searchParams;
  return (
    <div>
      <PageHeader eyebrow="Administration" title="Connexion" lead="Un lien de connexion est envoyé à l'adresse de l'administrateur." />
      <section className="container max-w-2xl space-y-6 pb-24 pt-8">
        {lien === "invalide" ? (
          <p className="panel text-sm" role="alert">
            Ce lien de connexion n&apos;est plus valable (expiré ou déjà utilisé). Demandez-en un nouveau.
          </p>
        ) : null}
        {getDb() ? <AdminLoginForm /> : <p className="panel">Base de données non configurée (DATABASE_URL).</p>}
      </section>
    </div>
  );
}
