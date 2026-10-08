import type { ReactNode } from "react";

// Mot en dégradé or + calque de reflet (animé uniquement en transform par lib/motion/hero.ts).
export function GoldWord({ children }: { children: ReactNode }) {
  return (
    <span className="gold-word" data-gold-word="">
      <span className="text-gold">{children}</span>
      <span className="gold-word__glint" aria-hidden="true">
        <span className="gold-word__glint-text">{children}</span>
      </span>
    </span>
  );
}
