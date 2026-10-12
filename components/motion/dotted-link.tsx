import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Lien texte : soulignement pointillé argent dessiné au survol / au focus (lib/motion/micro-interactions.ts).
export function DottedLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link className={cn("link-dotted", className)} {...props}>
      {children}
      <span className="link-dotted__line" aria-hidden="true" />
    </Link>
  );
}

// Reflet or d'un bouton principal ([data-magnetic]) : à placer dans le bouton, qui doit être positionné.
export function ButtonGlint() {
  return (
    <span className="btn-glint" aria-hidden="true">
      <span className="btn-glint__band" />
    </span>
  );
}
