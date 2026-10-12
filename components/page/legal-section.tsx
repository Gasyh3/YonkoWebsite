import type { ReactNode } from "react";

// Pages légales : une section par rubrique, titre serif et texte courant sur une colonne lisible.
export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="legal-section">
      <h2 className="font-display text-2xl text-silver-light md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}
