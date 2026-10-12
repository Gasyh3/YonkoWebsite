import type { Metadata } from "next";
import Link from "next/link";

import { expertises } from "@/lib/expertises-data";

export const metadata: Metadata = {
  title: "Expertises · Yonko Tech Consulting",
  description: "[à adapter] Stratégie, site vitrine et SEO, Google Maps, logiciel sur mesure.",
};

// Index des expertises : une ligne par service, chacune mène à sa page.
export default function ExpertisesPage() {
  return (
    <div className="container py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.24em] text-silver">Expertises</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] md:text-7xl">
        [à adapter] Une stratégie, trois leviers.
      </h1>
      <p className="mt-6 max-w-xl">
        [à adapter] Être vu, être trouvé, être efficace : chaque expertise répond à un besoin concret de votre
        activité, et toutes sont pilotées par la même stratégie.
      </p>

      <ul className="expertise-index mt-16 md:mt-24">
        {expertises.map((item) => (
          <li key={item.slug}>
            <Link href={`/expertises/${item.slug}`} className="expertise-index__row group">
              <span className="text-xs tracking-[0.24em] text-silver">{item.index}</span>
              <span>
                <span className="block font-display text-3xl text-silver-light md:text-5xl">{item.title}</span>
                <span className="mt-2 block text-sm">{item.summary}</span>
              </span>
              <span className="expertise-index__promise font-display text-xl md:text-2xl">{item.promise}</span>
              <span className="expertise-index__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
