"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { faqItems as defaultItems, type FaqItem } from "@/lib/faq-data";

type Props = {
  className?: string;
  items?: FaqItem[];
  title?: string;
  subtitle?: string;
  id?: string;
};

export function FaqSection({
  className,
  items = defaultItems,
  title = "Questions fréquentes",
  subtitle = "Réponses claires sur l’ERP PME modulaire et le SaaS Next.js clé en main.",
  id = "faq",
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id={id} className={cn("container space-y-8 py-16", className)}>
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">FAQ</p>
        <h2 className="section-heading text-foreground">{title}</h2>
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-primary/20 bg-secondary/50 p-4 shadow-sm md:p-6">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-border/70 bg-card/60 px-4 py-3 transition hover:border-primary/40"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary/80">
                    {item.category}
                  </span>
                  <span className="text-base font-semibold text-foreground">{item.question}</span>
                </div>
                <ChevronDown
                  className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                />
              </button>
              {isOpen ? (
                <div className="mt-3 text-sm text-muted-foreground">{item.answer}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
