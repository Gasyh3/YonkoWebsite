"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import { faqItems as defaultItems, type FaqItem } from "@/lib/faq-data";

type Props = {
  className?: string;
  items?: FaqItem[];
  title?: string;
  subtitle?: string;
  id?: string;
  eyebrow?: string;
  showCategory?: boolean; // libellé de catégorie au-dessus de chaque question (inutile sur une page par thème)
};

// Questions fréquentes : accordéon (un bouton par question, réponse en région liée), questions en serif,
// séparateurs pointillés (grammaire des fibres), « + » qui pivote. Aucune hauteur animée : la réponse apparaît
// en fondu.
export function FaqSection({
  className,
  items = defaultItems,
  title = "Questions fréquentes",
  subtitle = "Réponses claires sur l’ERP PME modulaire et le SaaS Next.js clé en main.",
  id = "faq",
  eyebrow = "FAQ",
  showCategory = true,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const uid = useId().replace(/:/g, "");

  return (
    <section id={id} className={cn("container py-16 md:py-24", className)} aria-labelledby={`${uid}-title`}>
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.24em] text-silver">{eyebrow}</p>
        <h2 id={`${uid}-title`} className="mt-4 font-display text-3xl leading-[1.05] md:text-5xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-4 md:text-lg">{subtitle}</p> : null}
      </div>

      <div className="faq-list mt-10 md:mt-14">
        {items.map((item) => {
          const isOpen = openId === item.id;
          const buttonId = `${uid}-${item.id}-q`;
          const panelId = `${uid}-${item.id}-a`;
          return (
            <div key={item.id} className="faq-item" data-open={isOpen ? "" : undefined}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="faq-item__button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span className="flex flex-col gap-2">
                    {showCategory ? (
                      <span className="text-xs uppercase tracking-[0.2em] text-silver">{item.category}</span>
                    ) : null}
                    <span className="font-display text-xl leading-snug text-silver-light md:text-2xl">
                      {item.question}
                    </span>
                  </span>
                  <span className="faq-item__icon" aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="faq-item__answer">
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
