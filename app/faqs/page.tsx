import { DottedLink } from "@/components/motion/dotted-link";
import { CtaBand } from "@/components/page/cta-band";
import { PageHeader } from "@/components/page/page-header";
import { FaqSection } from "@/components/sections/faq-section";
import { faqItems, type FaqItem } from "@/lib/faq-data";

export const metadata = { title: "Questions fréquentes · Yonko Tech Consulting" };

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
  const categories = sortCategories(Array.from(new Set(faqItems.map((item) => item.category))));

  return (
    <div>
      <PageHeader
        eyebrow="Questions fréquentes"
        title="Toutes les questions"
        lead="ERP PME modulaire, SaaS Next.js clé en main, sécurité, hébergement, propriété : trouvez des réponses rapides par thématique."
      >
        {/* Accès direct aux thèmes. */}
        <nav aria-label="Thèmes" className="w-full">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-silver">
            {categories.map((category) => (
              <li key={category}>
                <DottedLink href={`#${slugify(category)}`}>{category}</DottedLink>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="pb-16">
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
              eyebrow="Thème"
              title={category}
              subtitle=""
              showCategory={false}
              items={itemsByCategory}
              className="faq-theme"
            />
          );
        })}
      </div>

      <CtaBand title="Vous ne trouvez pas votre réponse ?" text="Posez-nous la question directement : nous répondons sous 24h." />
    </div>
  );
}
