import { GhostButton, PrimaryButton } from "@/components/page/buttons";

// 404 : la fibre s'interrompt. Visuel statique (pointillés, extrémité or), deux chemins pour repartir.
export default function NotFound() {
  return (
    <div className="container grid min-h-[70vh] items-center gap-12 py-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:py-24">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-silver">Erreur 404</p>
        <h1 className="mt-4 font-display text-5xl leading-[1.02] md:text-7xl">Cette page s&apos;est déconnectée.</h1>
        <p className="mt-6 max-w-xl md:text-lg">
          Le lien est peut-être ancien ou mal saisi. Reprenons depuis un point connu.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <PrimaryButton href="/">Retour à l&apos;accueil</PrimaryButton>
          <GhostButton href="/expertises">Nos expertises</GhostButton>
        </div>
      </div>
      <svg viewBox="0 0 240 200" className="not-found__fiber hidden md:block" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="not-found-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className="maps-stop-1" />
            <stop offset="0.52" className="maps-stop-2" />
            <stop offset="1" className="maps-stop-3" />
          </linearGradient>
        </defs>
        {/* Une fibre qui descend, tourne à 90° (coude arrondi) et s'interrompt. */}
        <path d="M40 0V76A24 24 0 0 0 64 100H128" className="not-found__line" />
        <path d="M168 100H240" className="not-found__line not-found__line--far" />
        <circle cx="132" cy="100" r="5" fill="url(#not-found-gold)" />
      </svg>
    </div>
  );
}
