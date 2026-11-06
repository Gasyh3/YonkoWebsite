"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="link-dotted text-sm text-silver"
      onClick={async () => {
        await fetch("/api/admin/deconnexion", { method: "POST" }).catch(() => null);
        router.push("/admin/connexion");
        router.refresh();
      }}
    >
      Se déconnecter
    </button>
  );
}
