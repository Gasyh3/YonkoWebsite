# Yonko Tech Consulting — Refonte motion

Ce fichier donne à Claude Code le contexte de la refonte. Lis-le en entier avant toute tâche.

## Ce qu'on fait

On explore un **nouveau design** pour le site vitrine de Yonko Tech Consulting, dans une branche dédiée partie de `v1` (le site existant). Le site actuel est partiellement construit : **réutilise ses composants, ses contenus et sa structure** chaque fois que c'est possible, ne recrée pas ce qui existe déjà.

Le travail se fait par étapes, une demande à la fois (prompts C1 à C11). Chaque étape doit laisser le site fonctionnel et faire l'objet d'un commit séparé.

## L'entreprise

Yonko Tech Consulting est une agence web et communication.
Cible : PME, commerçants, artisans, professions libérales. Le site doit impressionner, mais chaque animation doit **illustrer un bénéfice concret** pour ce public.

| Service | Promesse | Rôle dans le concept |
| --- | --- | --- |
| Stratégie de communication | Le pilier qui pilote tout | L'ordinateur du hero, la source |
| Site vitrine et SEO | Être vu | Fibre A, or |
| Indexation Google Maps et visibilité locale | Être trouvé | Fibre B, or |
| Logiciel interne sur mesure | Être efficace | Fibre C, argent |

## Le concept motion

Le hero montre un ordinateur en vidéo en boucle (la stratégie). **Trois fibres optiques en pointillés** sortent de ses ports et parcourent toute la page. Elles suivent un tracé ordonné de **cable management** : angles à 90° ou 45°, coudes arrondis de rayon identique, fibres parallèles à écart constant quand elles voyagent ensemble. Jamais de tracé chaotique.

Une fibre a deux états :
- **éteinte** : pointillés argent à 18 % d'opacité ;
- **parcourue** par une impulsion lumineuse (or ou argent clair) : la donnée qui circule.

Chaque section donne aux fibres un rôle différent, avec la même grammaire visuelle :

| Section | Ce que font les fibres | Intensité |
| --- | --- | --- |
| Hero | Sortent des 3 ports de l'ordinateur et décrochent au scroll | Forte |
| Manifeste | Passent derrière « Être vu. Être trouvé. Être efficace. » et allument chaque ligne | Moyenne |
| Stratégie | Rails parallèles d'un plan d'architecte, nœuds par étape | Calme |
| Expertises (pin 300vh) | Se séparent, une scène par fibre : SEO, Maps, Logiciel | **Pic** |
| → SEO | La fibre A dessine un navigateur, le résultat du client monte en position 1 | |
| → Google Maps | La fibre B devient un quadrillage de rues, une épingle or tombe | |
| → Logiciel | La fibre C se ramifie en modules qui forment un dashboard | |
| Résultats / projets | Se rejoignent et s'effacent en marge, le travail parle | Calme |
| Process | Fusionnent en une timeline, chaque étape est une jonction | Moyenne |
| Contact | Convergent vers le bouton « Démarrer un projet » qui s'allume | Résolution |

La vidéo du hero ne contient **pas** les fibres : elles sont toujours en code (SVG), pour pouvoir continuer dans la page.

## Direction artistique

Luxe, sobriété, précision. Noir mat, or, argent. Si tout brille, rien n'est précieux : l'or est réservé à ce qui compte.

```css
:root {
  --black: #0B0B0C;          /* fond global, jamais #000 */
  --surface: #141416;        /* cartes, panneaux */
  --gold-1: #8C6A2A;
  --gold-2: #E8C77A;
  --gold-3: #B8913E;         /* dégradé or : gold-1 → gold-2 → gold-3 */
  --gold-glint: #F6E3A8;     /* tête d'impulsion uniquement */
  --silver: #A8ADB4;
  --silver-light: #E3E6EA;
  --text: rgba(237, 234, 228, .72);
  --fiber-off: rgba(168, 173, 180, .18);

  --ease-in: expo.out;            /* GSAP : reveals */
  --ease-transition: power3.inOut;/* GSAP : changements d'état */
  --ease-breath: sine.inOut;      /* GSAP : boucles, pulsations */
  --dur-micro: .3s;
  --dur-reveal: .7s;
  --dur-major: 1.2s;
  --stagger: .06s;
}
```

- Fibres éteintes : dots ronds de 2px, espacement 7px.
- Typographie : serif display fin pour les titres (type Canela, PP Editorial New), grotesque fine pour le texte (type Neue Montreal, Inter Tight).
  Polices retenues (gratuites, via `next/font/google`, déclarées dans `app/fonts.ts`) : **Instrument Serif** pour les titres (`font-display`), **Inter Tight** 300–500 pour le texte (`font-sans`). Changer de police = modifier uniquement `app/fonts.ts`.
- Grain : bruit statique à 3–4 % d'opacité sur toute la page (overlay CSS, jamais un canvas animé).
- Couleurs autorisées : uniquement celles ci-dessus. L'or n'est jamais une couleur plate, toujours le dégradé.

## Stack et architecture

- Framework : **Next.js 16 (App Router) + React 19 + TypeScript**, Tailwind CSS 3.4, composants shadcn/ui (`components/ui`). Build : `npm run build`, dev : `npm run dev`.
- Les tokens du `:root` ci-dessous vivent dans `app/globals.css` ; côté JS, `lib/motion/tokens.ts` les expose (easings, durées). Tailwind les mappe (`bg-black`, `text-silver`, `bg-gold`…).
- Modules motion : `lib/motion/*.ts` (TS pur, `init()` / `destroy()`), branchés dans React via `useMotionModule` (`lib/motion/use-motion-module.ts`). Lenis + ScrollTrigger sont pilotés par `components/motion/motion-root.tsx`.
- Vidéos (hero V1 / V1-M, clips annexes) : produites avec **HyperFrames** (HTML + GSAP rendu en MP4/WebM), sources dans `video/`, rendus exportés dans `public/media/`. Skills dans `.claude/skills` (`/hyperframes` pour démarrer). Les positions des 3 ports de l'ordinateur sont définies une seule fois dans `lib/motion/hero-ports.json` et partagées par la composition vidéo et le FiberSystem.
- GSAP 3 avec ScrollTrigger et SplitText ; Lenis pour le smooth scroll, synchronisé avec le ticker GSAP et ScrollTrigger.
- Fibres en **SVG inline unique**, en position absolue sur toute la page, `pointer-events: none`.
- Une animation = un module isolé avec `init()` et `destroy()`. `destroy()` nettoie tous les ScrollTriggers, timelines et listeners.
- Toutes les couleurs, easings et durées viennent des tokens, jamais en dur.

### Convention des ancres de fibres

Les tracés ne sont **jamais codés en pixels** : ils sont calculés à partir d'ancres dans le DOM et recalculés au resize (debounce 150ms) ainsi qu'après chargement des polices et images.

```html
<div data-fiber-anchor="manifesto-a" data-fiber="A" data-fiber-mode="pass"></div>
```

- `data-fiber` : `A`, `B`, `C` ou `all`
- `data-fiber-mode` : `pass` (la fibre passe), `plug` (elle s'y branche puis repart), `end` (terminus)

Attributs complémentaires (implémentés dans `lib/motion/fiber/`) :
- `data-fiber-axis="x" | "y"` : la fibre parcourt l'ancre sur toute sa largeur (x) ou hauteur (y) au lieu d'un point ; en `x`, elle entre par le côté le plus proche de sa provenance.
- `data-fiber-origin` : boîte de la vidéo hero ; les 3 départs sont calculés depuis `lib/motion/hero-ports.json` (object-fit: cover pris en compte).
- `data-fiber-through` : bloc que la fibre a le droit de traverser (ex. lignes du manifeste). `data-fiber-avoid` : élément à éviter en plus des textes, images et contrôles. `data-fiber-ignore` : jamais un obstacle.
- `data-fiber-split` : zone où la fibre composite mobile se divise en 3 (prévoir ≥ 64px de padding gauche en mobile).
- Couloirs : laisser ~56px libres à côté des ancres de bord (les 3 fibres occupent ±14px + marge de 10px). Le routeur signale en console (dev) tout segment qui traverse un texte ; `/lab/fibers?debug=1` affiche obstacles, ancres et collisions.
- `fiber:arrive` peut être émis plusieurs fois pour une même ancre (respiration) : les sections réagissent de façon idempotente.

Le module `FiberSystem` émet `window` → `CustomEvent("fiber:arrive", { detail: { fiber, anchorId, mode } })` quand une impulsion atteint une ancre. Les sections écoutent cet événement pour réagir, elles ne pilotent pas les fibres elles-mêmes.

API exposée : `FiberSystem.setLit(fiber, bool)`, `FiberSystem.pulse(fiber, fromAnchor, toAnchor, duration)`.

## Règles non négociables

**Performance**
- Animer uniquement `transform`, `opacity` et `stroke-dashoffset`. Pas de `filter`, `box-shadow`, `width/height` ou `top/left` animés.
- Glow : un second tracé flouté **statique** sous le tracé principal.
- Objectif 60 fps sur un Android milieu de gamme.

**Lisibilité et rythme**
- Un seul point focal en mouvement à la fois à l'écran.
- Aucun texte ne met plus d'une seconde à devenir lisible.
- Pas de scroll-jacking : le scroll reste libre, seule la section Expertises est épinglée.
- Pas de particules, de parallax décoratif ou d'effet non demandé. En cas de doute, faire moins.

**Mobile (< 768px)**
- Chaque module prévoit une version simplifiée.
- Une seule fibre composite à 20px du bord gauche, qui se divise en 3 uniquement dans Expertises.
- Pas de pin : les scènes Expertises s'empilent.

**Accessibilité**
- `prefers-reduced-motion` : chaque module fournit un état final statique et lisible. Fibres dessinées, mots or affichés, aucun mouvement, Lenis désactivé.
- Navigation clavier complète, focus visible (contour or 2px, offset 3px).
- Aucune animation ne bloque un clic.

## Façon de travailler

1. **Avant la première modification**, explore le repo et propose un plan d'intégration : quels composants existants réutiliser, où placer les modules motion, ce qui doit être créé. Attends validation.
2. Une demande à la fois. Ne commence pas la scène suivante sans qu'on le demande.
3. Ordre prévu : C1 (FiberSystem) → C2 (Hero) → C6 (Maps) pour valider la DA → les autres sections dans l'ordre de la page → C11 (finitions, transitions, reduced motion).
4. Pour chaque tâche, réponds avec : l'approche en une phrase, le code complet (pas de `...`), le markup et les ancres requis, comment tester.
5. Les textes marqués `[à adapter]` ou `[à remplacer]` sont des placeholders : ne les présente jamais comme définitifs.
6. Contenus : les textes définitifs viendront plus tard. Pour les nouvelles sections, utiliser des placeholders marqués `[à adapter]` ; ne pas réécrire `lib/services-data.ts` ni les pages `/services`, `/about`, `/faqs`, `/contact` sans demande explicite.

## Définition de « terminé » pour une tâche

- [ ] Seules les propriétés autorisées sont animées
- [ ] Tokens respectés, aucune couleur hors palette
- [ ] Version mobile présente et testée en responsive
- [ ] État reduced motion présent
- [ ] `destroy()` nettoie tout
- [ ] Aucun tracé de fibre ne traverse un texte, y compris après resize
- [ ] Le site build et fonctionne sans erreur console
