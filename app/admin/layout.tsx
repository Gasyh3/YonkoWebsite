import type { Metadata } from "next";
import type { ReactNode } from "react";

// Administration (dossiers de cadrage) : jamais indexée. L'accès est vérifié dans chaque page et chaque route.
export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="admin">{children}</div>;
}
