import type { ReactNode } from "react";

import { PrimaryButton } from "@/components/page/buttons";

type Props = {
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode; // remplace l'action par défaut (« Démarrer un projet »)
  children?: ReactNode; // lien secondaire
};

// Bandeau de fin de page : une phrase, l'action principale, un lien secondaire.
export function CtaBand({ title, text, action, children }: Props) {
  return (
    <section className="container pb-24 pt-8 md:pb-32" aria-label="Pour aller plus loin">
      <div className="cta-band">
        <div className="max-w-xl">
          <p className="font-display text-3xl leading-[1.05] md:text-5xl">{title}</p>
          {text ? <p className="mt-4">{text}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-8">
          {action ?? <PrimaryButton href="/contact">Démarrer un projet</PrimaryButton>}
          {children}
        </div>
      </div>
    </section>
  );
}
