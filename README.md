# Yonko Tech Consulting : site vitrine

Site de Yonko Tech Consulting, agence web et communication basée à Antananarivo (Madagascar) : stratégie de
communication, site vitrine et SEO, Google Maps et visibilité locale, logiciel sur mesure.

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3.4, GSAP + Lenis pour les animations.

## Démarrer

Prérequis : Node.js 22 (et Docker pour l'image de production). Toutes les commandes passent par `make` :

```bash
make help       # liste des commandes
make install    # dépendances
make env        # crée .env depuis .env.example (à compléter)
make dev        # développement : http://localhost:3000
make check      # lint + types + audit + build : à lancer avant chaque push
```

Questionnaire de cadrage et administration (PostgreSQL + e-mails) en développement :

```bash
make services-up    # PostgreSQL + Mailpit (e-mails interceptés : http://localhost:8025)
make dev            # avec DATABASE_URL, SMTP_URL, ADMIN_EMAIL, APP_URL dans .env.local (voir .env.example)
make db-generate    # après une modification de lib/db/schema.ts
```

Avec Docker (image identique à la production) :

```bash
make docker-up      # construit et lance sur http://localhost:3000
make docker-logs    # journaux
make docker-health  # contrôle de santé
make docker-down    # arrêt
```

Pas de GitHub Actions sur ce dépôt : les vérifications se font en local (`make check`).

## Déploiement

Image Docker déployée avec **Dokploy** : voir [`docs/deploiement-dokploy.md`](docs/deploiement-dokploy.md).
Les services à configurer à la mise en ligne (domaine, e-mail, formulaire, Turnstile, Search Console…) sont
listés dans [`docs/mise-en-ligne.txt`](docs/mise-en-ligne.txt).

## Documentation

| Fichier | Contenu |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Conventions du projet : concept motion, direction artistique, architecture, règles |
| [`docs/propos-du-site.md`](docs/propos-du-site.md) | Le fond du site : positionnement, ton, textes de chaque page |
| [`docs/deploiement-dokploy.md`](docs/deploiement-dokploy.md) | Image Docker et déploiement Dokploy |
| [`docs/mise-en-ligne.txt`](docs/mise-en-ligne.txt) | Étapes de mise en ligne |
| [`docs/audit-checklist.md`](docs/audit-checklist.md) | Sécurité, performance, SEO, conformité : état des 20 points |
| [`docs/contenu-a-remplir.txt`](docs/contenu-a-remplir.txt) | Contenus restant à fournir |

## Structure

- `app/` : pages (accueil, expertises, À propos, FAQ, contact, questionnaire, pages légales, administration), API (`/api/contact`, `/api/questionnaire/*`, `/api/admin/*`, `/api/health`), SEO (sitemap, robots, image de partage).
- `lib/questionnaire/`, `lib/db/`, `lib/mail/`, `lib/admin/`, `lib/server/` : questionnaire de cadrage, base de données, e-mails, administration, outils serveur.
- `drizzle/` : migrations SQL de la base.
- `components/` : en-tête, pied de page, sections de l'accueil, briques de pages, couche motion.
- `lib/` : données du site (`site.ts`, `expertises-data.ts`, `faq-data.tsx`…) et modules d'animation (`lib/motion/`).
- `public/` : médias (vidéos du hero, images).
- `video/` : sources des vidéos du hero (HyperFrames).
