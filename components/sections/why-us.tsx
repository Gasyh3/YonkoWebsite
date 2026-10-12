import { KeyRound, MessageCircle, Search, UserRound } from "lucide-react";

const reasons = [
  {
    title: "Un seul interlocuteur",
    description: "Du premier échange au suivi, la même personne connaît votre projet : rien ne se perd en route.",
    icon: UserRound,
  },
  {
    title: "Sans jargon",
    description: "Chaque choix est expliqué simplement, et vous validez avant que l'on construise.",
    icon: MessageCircle,
  },
  {
    title: "Pensé pour être trouvé",
    description: "Site, fiche Google et contenus sont conçus ensemble, autour des recherches de vos clients.",
    icon: Search,
  },
  {
    title: "Vous restez propriétaire",
    description: "Nom de domaine, site, code et données vous appartiennent, avec tous les accès.",
    icon: KeyRound,
  },
];

// Accueil : pourquoi Yonko. Quatre raisons sur un filet pointillé, chacune marquée d'un
// nœud or ; icônes en argent (l'or reste réservé à ce qui compte).
export function WhyUs() {
  return (
    <section className="container py-16 md:py-24 md:pr-[calc(2.75rem+1.5rem)]" aria-labelledby="why-title">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.24em] text-silver">Pourquoi Yonko ?</p>
        <h2 id="why-title" className="mt-4 font-display text-4xl leading-[1.04] md:text-6xl">
          Ce que vous pouvez attendre de nous.
        </h2>
        <p className="mt-6 md:text-lg">
          Pas de promesse intenable : un travail soigné, des étapes claires et un suivi après la mise en ligne.
        </p>
      </div>

      <ul className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason) => (
          <li key={reason.title} className="value-item">
            <span className="value-item__node" aria-hidden="true" />
            <reason.icon className="h-5 w-5 text-silver" aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl text-silver-light">{reason.title}</h3>
            <p className="mt-3 text-sm">{reason.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
