# Archive : offres v1 (/services)

Trace écrite des offres de la première version du site, retirées en octobre 2026 : elles ont été
fondues dans les quatre expertises (lib/expertises-data.ts) et les adresses /services redirigent
en 308 vers l'expertise correspondante (next.config.ts).

| Ancienne page | Redirige vers |
| --- | --- |
| /services | /expertises |
| /services/erp-pme-modulaire | /expertises/logiciel-sur-mesure |
| /services/saas-cle-en-main-nextjs | /expertises/logiciel-sur-mesure |
| /services/seo-rebranding-acquisition | /expertises/site-vitrine-et-seo |
| /services/communication-reseaux-sociaux | /expertises/strategie-de-communication |

Le code (pages app/services, lib/services-data.ts, components/sections/offer-cards.tsx et
services-section.tsx) reste disponible dans l'historique git : dernier commit qui le contient,
913cbfc (`git show 913cbfc:lib/services-data.ts`).

## Page /services

**Titre :** ERP PME, SaaS clé en main et visibilité digitale

**Introduction :** Nous construisons des ERP modulaires pour PME, des bases SaaS Next.js prêtes à être
monétisées et des dispositifs marketing (SEO, rebranding, réseaux sociaux) pour soutenir la croissance.
Chaque offre est livrée avec des jalons clairs, des livrables documentés et une équipe senior.

**Livraison end-to-end :** Cadrage, conception, build, intégrations (Stripe, Better Auth), analytics, SEO,
CI/CD : une approche bout-en-bout pour livrer des produits fiables et mesurables.

**Section d'accueil « Nos offres » :** Des solutions digitales B2B pour structurer, lancer et faire croître
votre activité. Nous concevons des ERP modulaires pour PME et des SaaS clé en main basés sur Next.js, tout
en accompagnant votre visibilité digitale grâce au SEO, au rebranding et à la gestion de vos réseaux
sociaux. De la stratégie à l'exécution, nous livrons des solutions cohérentes, performantes et orientées
croissance.

## ERP PME modulaire (/services/erp-pme-modulaire)

**Résumé :** Centralisez ventes, facturation, paiements, stocks, achats, reporting et audit log avec des modules activables.

**Description :** Un ERP pensé pour les PME qui veulent structurer leurs opérations sans lourdeur : CRM, devis/factures, paiements, inventaire, fournisseurs, RH léger, tâches/planification, dashboards et audit trail natif. Modules optionnels pour s’adapter à votre cadence.

**Bénéfices**
- Socle unique pour piloter ventes, finance et opérations
- Modules activables selon votre maturité
- Traçabilité et conformité (audit log, rôles, permissions)

**Résultats attendus**
- Processus fiables de la vente à l’encaissement
- Visibilité temps réel sur stocks et trésorerie
- Réduction des tâches manuelles via automatisations

**Livrables**
- Ateliers métier, cartographie des flux et paramétrage initial
- Modules activés (sales, invoicing, paiements, inventaire, fournisseurs, HR-lite, tasks)
- Dashboards opérationnels et audit log configuré

**Délai :** Mise en place progressive : 4 à 10 semaines selon le nombre de modules activés et les interfaces nécessaires.

**Bouton :** Découvrir l’ERP PME

## SaaS clé en main (Next.js) (/services/saas-cle-en-main-nextjs)

**Résumé :** Base produit prête à lancer : Stripe paiements/abonnements, Better Auth, base de données, analytics, emails, landing, blog et docs.

**Description :** Un socle SaaS complet pour réduire le time-to-market : Next.js full stack, authentification Better Auth, Stripe pour paiements et abonnements, base de données intégrée, analytics, emails automatisés, landing page, blog et documentation.

**Bénéfices**
- Monétisation prête (paiements, abonnements, taxes)
- Sécurité et auth gérées (Better Auth, rôles, permissions)
- Content et support intégrés (landing, blog, docs, emails)

**Résultats attendus**
- MVP live rapidement avec tracking analytique
- Flux d’onboarding, upgrade/downgrade et facturation fiables
- Base de code maintenable et documentée

**Livrables**
- Architecture Next.js full stack avec DB et auth configurées
- Intégration Stripe (checkout, billing portal, webhooks)
- Landing, blog, documentation et workflows email

**Délai :** Lancement accéléré : 3 à 8 semaines selon le périmètre fonctionnel et les intégrations tierces.

**Bouton :** Lancer mon SaaS

## SEO, rebranding & acquisition (/services/seo-rebranding-acquisition)

**Résumé :** Audit SEO, repositionnement de marque et plan d’acquisition pour gagner en visibilité et conversion.

**Description :** Nous analysons votre positionnement, le contenu et la technique pour bâtir une visibilité durable : audit SEO, refonte éditoriale, rebranding orienté conversion et plan d’acquisition priorisé.

**Bénéfices**
- Audit SEO complet et recommandations actionnables
- Narratif et identité cohérents avec vos cibles
- Pages optimisées pour la conversion (landing, blog, resources)

**Résultats attendus**
- Gains de visibilité organique sur vos requêtes clés
- Taux de conversion amélioré grâce au repositionnement
- Backlog d’optimisations avec priorisation business

**Livrables**
- Audit technique et sémantique, plan d’actions SEO
- Guidelines de marque, ton éditorial, maquettes clés
- Calendrier éditorial et templates optimisés conversion

**Délai :** Déploiement en vagues : 3 à 6 semaines pour l’audit et la refonte initiale, puis itérations mensuelles.

**Bouton :** Booster ma visibilité

## Communication & réseaux sociaux (/services/communication-reseaux-sociaux)

**Résumé :** Stratégie éditoriale, calendrier de publication, contenus et suivi des performances sur vos canaux.

**Description :** Nous définissons une ligne éditoriale claire, produisons les contenus et animons vos réseaux avec un suivi serré des KPI pour itérer vite.

**Bénéfices**
- Ligne éditoriale alignée business
- Production continue de contenus
- Pilotage par la performance (KPI & itérations)

**Résultats attendus**
- Présence cohérente sur les canaux clés (LinkedIn, blog, newsletter)
- Engagement et reach en hausse grâce à des formats testés
- Boucle d’amélioration via reporting périodique

**Livrables**
- Charte éditoriale, piliers de contenu et messaging
- Calendrier mensuel et production des posts/visuels
- Tableau de bord des performances et recommandations

**Délai :** Phase de cadrage : 2 semaines. Animation et reporting sur des cycles mensuels avec revues hebdomadaires.

**Bouton :** Structurer ma communication

## Métadonnées SEO des pages v1

- **Communication & réseaux sociaux** : Stratégie éditoriale, calendrier, production de contenus et suivi de performances pour vos réseaux.
- **ERP PME modulaire** : ERP pour PME : CRM, devis/factures, paiements, inventaire, fournisseurs, HR-lite, tâches, dashboards et audit log.
- **SaaS clé en main Next.js** : Base SaaS Next.js prête : Stripe paiements/abonnements, Better Auth, base de données, analytics, emails, landing, blog et docs.
- **SEO, rebranding & acquisition** : Audit SEO, repositionnement de marque et plan d’acquisition pour accroître visibilité et conversion.
