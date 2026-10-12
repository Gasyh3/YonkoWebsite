import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode; // actions
  aside?: ReactNode; // visuel à droite (desktop)
  className?: string;
};

// En-tête commun des pages intérieures : surtitre argent, titre serif (révélé par lignes lors d'une transition
// de page), chapeau et actions.
export function PageHeader({ eyebrow, title, lead, children, aside, className }: Props) {
  return (
    <header className={cn("container pb-8 pt-16 md:pt-24", className)}>
      <div className={aside ? "grid items-center gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-20" : undefined}>
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-silver">{eyebrow}</div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.02] md:text-7xl">{title}</h1>
          {lead ? <div className="page-lead mt-6 max-w-2xl md:text-lg">{lead}</div> : null}
          {children ? <div className="mt-10 flex flex-wrap items-center gap-8">{children}</div> : null}
        </div>
        {aside}
      </div>
    </header>
  );
}

// Titre de section des pages intérieures.
export function SectionTitle({ eyebrow, children, id }: { eyebrow?: string; children: ReactNode; id?: string }) {
  return (
    <div>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-silver">{eyebrow}</p> : null}
      <h2 id={id} className={cn("font-display text-3xl leading-[1.05] md:text-5xl", eyebrow && "mt-4")}>
        {children}
      </h2>
    </div>
  );
}
