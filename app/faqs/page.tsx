import { FaqSection } from "@/components/sections/faq-section";
import { faqItems, type FaqItem } from "@/lib/faq-data";

const CATEGORY_ORDER = [
  "ERP PME",
  "SaaS Next.js",
  "Positionnement",
  "Acquisition",
  "Gouvernance",
  "Ops & sécurité",
  "Pilotage",
  "Intégrations",
];

// Slug propre (accents, caractères spéciaux, espaces)
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function sortCategories(cats: string[]) {
  const ordered = cats
    .slice()
    .sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a);
      const ib = CATEGORY_ORDER.indexOf(b);

      // Categories not in the list go last, sorted alphabetically
      if (ia === -1 && ib === -1) return a.localeCompare(b, "fr");
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

  return ordered;
}

export default function FaqsPage() {
  const categories = sortCategories(
    Array.from(new Set(faqItems.map((item) => item.category)))
  );

  return (
    <div className="space-y-12 bg-background">
      <div className="container space-y-4 pt-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          FAQ
        </p>

        <h1 className="section-heading text-foreground">Toutes les questions</h1>

        <p className="max-w-3xl text-lg text-muted-foreground">
          ERP PME modulaire, SaaS Next.js clé en main, sécurité, hébergement,
          propriété : trouvez des réponses rapides par thématique.
        </p>
      </div>

      <div className="space-y-8 pb-16">
        {categories.map((category) => {
          const itemsByCategory: FaqItem[] = faqItems
            .filter((item) => item.category === category)
            .slice()
            .sort((a, b) => a.question.localeCompare(b.question, "fr"));

          if (itemsByCategory.length === 0) return null;

          return (
            <FaqSection
              key={category}
              id={slugify(category)}
              title={category}
              subtitle="Les points essentiels sur cette thématique."
              items={itemsByCategory}
              className="pt-0"
            />
          );
        })}
      </div>
    </div>
  );
}
