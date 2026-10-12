import type { ReactNode, Ref } from "react";

import type { SceneId } from "@/lib/motion/expertises/geometry";

type Props = {
  ref?: Ref<HTMLElement>;
  scene: SceneId;
  index: string;
  titleId: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  viz: ReactNode;
  // Ancre de la fibre devant la visualisation (scène autonome uniquement).
  fiberIn?: ReactNode;
  // Dans le conteneur Expertises : la colonne de droite laisse 56px pour les couloirs de sortie des fibres.
  embedded?: boolean;
  // Page d'une expertise : la visualisation seule (le texte est porté par la page), centrée.
  vizOnly?: boolean;
};

// Mise en page commune des scènes Expertises : texte à gauche, visualisation (cadre 7:5) à droite.
export function SceneShell(props: Props) {
  const { ref, scene, index, titleId, title, subtitle, children, viz, fiberIn, embedded, vizOnly } = props;
  if (vizOnly) {
    return (
      <section
        ref={ref}
        data-expertise-scene={scene}
        className={`expertise-scene expertise-scene--${scene} py-12 md:py-20`}
        aria-label={subtitle}
      >
        <div className="container">
          <div className="relative mx-auto max-w-3xl">{viz}</div>
        </div>
      </section>
    );
  }
  return (
    <section
      ref={ref}
      data-expertise-scene={scene}
      className={`expertise-scene expertise-scene--${scene} py-24 md:py-32`}
      aria-labelledby={titleId}
    >
      {/* Mobile : la marge gauche vient de la zone [data-fiber-split] parente (couloir des 3 fibres). */}
      <div className="container grid items-center gap-12 max-md:pl-0 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        <div className="max-w-md">
          <p data-scene-index="" className="text-xs uppercase tracking-[0.24em] text-silver">
            {index} / 03
          </p>
          <h2 id={titleId} className="mt-4 font-display text-5xl leading-[1.02] md:text-6xl">
            {title}
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-silver">{subtitle}</p>
          <p className="mt-6">{children}</p>
        </div>

        <div className={embedded ? "relative md:pr-14" : "relative"}>
          {fiberIn}
          {viz}
        </div>
      </div>
    </section>
  );
}
