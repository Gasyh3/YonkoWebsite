# Yonko Tech Consulting – Site vitrine (Next.js + Tailwind + shadcn/ui)

Site vitrine moderne pour la société fictive Yonko Tech Consulting. Le projet est prêt pour expérimenter, personnaliser le design system et ajouter de nouvelles pages/sections.

## Description du projet
- Présentation des services de conseil tech, data, cloud et produits digitaux.
- Pages principales : accueil, services détaillés, à propos, contact.
- Composants réutilisables (hero, services, why us, formulaires) basés sur shadcn/ui et Tailwind.

## Stack technique
- Next.js (App Router) + TypeScript
- Tailwind CSS + tailwindcss-animate
- shadcn/ui (Button, Card, Input, Textarea, Navigation Menu, etc.)
- Sonner pour les toasts

## Installation & lancement
```bash
npm install
npm run dev
# ensuite ouvrir http://localhost:3000
```

## Structure du projet
- `app/` : pages App Router (`layout.tsx`, `page.tsx`, `about`, `services`, `contact`).
- `components/` : composants partagés (header/footer, sections, UI shadcn).
- `lib/` : utilitaires (ex : `cn` pour fusion de classes Tailwind).
- `public/` : assets statiques.
- Config : `tailwind.config.ts`, `postcss.config.mjs`, `components.json` (config shadcn).

## Personnalisation
- Couleurs : ajuster les variables HSL dans `app/globals.css` et, si besoin, l’`extend.colors` dans `tailwind.config.ts`.
- Typographie : changer la font importée dans `app/layout.tsx` (Inter par défaut).
- shadcn/ui : importer de nouveaux composants via la CLI `shadcn` (config prête dans `components.json`), ou créer vos variantes dans `components/ui/`.

## Évolutions possibles
- Connecter un backend ou un service d’email pour les formulaires.
- Ajouter un blog/ressources, FAQ ou études de cas.
- Optimisations SEO avancées (metadata, opengraph, sitemap).
- Internationalisation, dark mode et thèmes multiples.
