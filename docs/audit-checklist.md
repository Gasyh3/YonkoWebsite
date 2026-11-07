# Audit : 20 bonnes pratiques d'un site vitrine

État au 7 novembre 2026, après corrections. Mesures sur le build de production (`npm run build && npx next start`),
avec curl, Playwright et axe-core 4.10 (WCAG 2 A/AA), sur 14 pages (dont le questionnaire et la connexion admin).

Légende : ✅ en place · 🔧 à configurer à la mise en ligne (procédure dans `docs/mise-en-ligne.txt`) · ➖ non applicable.

| N° | Point | Statut | Où / preuve |
|---|---|---|---|
| 1 | HTTPS + HSTS | ✅ + 🔧 | `next.config.ts` : `Strict-Transport-Security: max-age=63072000; includeSubDomains` sur toutes les routes. Redirection http → https : hébergeur (étape 2). |
| 2 | En-têtes de sécurité | ✅ | `next.config.ts` : CSP (sources du site uniquement, + Turnstile si activé), nosniff, Referrer-Policy, X-Frame-Options DENY + `frame-ancestors 'none'`, Permissions-Policy, COOP ; `X-Powered-By` retiré. 0 violation CSP en production et en dev. |
| 3 | Anti-spam | ✅ + 🔧 | Champ piège, durée minimale 3 s, origine, 5 envois / 10 min par IP, Cloudflare Turnstile (`components/pages/turnstile.tsx`, vérification serveur). Clés à créer (étape 5). |
| 4 | Validation / échappement serveur | ✅ | `lib/contact.ts` : mêmes règles client et serveur, caractères de contrôle (CR/LF) retirés des champs d'une ligne. `app/api/contact/route.ts` : corps limité à 20 Ko même sans content-length, JSON strict. Rendu React échappé, e-mail en texte brut. |
| 5 | Dépendances | ✅ | Next.js 16.4.3, React 19.3.0 : `npm audit --omit=dev` → 0 vulnérabilité. Restent des alertes de l'outillage de développement uniquement (braces sans correctif publié, chaîne Tailwind 3) : risque limité au poste de build. |
| 6 | Sauvegarde | 🔧 | Base PostgreSQL (questionnaire) : sauvegardes Dokploy vers S3 (`docs/deploiement-dokploy.md`, étape 3). Code : dépôt GitHub. Demandes du formulaire de contact : Google Sheets + Gmail. |
| 7 | Images | ✅ | `next/image` en AVIF puis WebP, `width`/`height`, lazy hors écran ; affiches du hero en WebP ; logo des données structurées allégé (40 Ko). |
| 8 | Core Web Vitals | ✅ | Mobile 390 px, mesures locales : CLS 0,000, LCP 168–204 ms (vidéo du hero). Polices `next/font` en `display: swap`. À confirmer en ligne (PageSpeed Insights). |
| 9 | Cache + compression | ✅ + 🔧 | JS/CSS `immutable` 1 an, `/media` et `/assets` 7 jours, gzip actif. Brotli : CDN de l'hébergeur (étape 2). |
| 10 | JS client | ✅ | ~224 Ko gzip au chargement : runtime Next/React (~127 Ko), GSAP + ScrollTrigger + SplitText (~46 Ko, couche motion globale : transitions, boutons magnétiques, défilement), code du site. Aucun import inutile ; polyfills en `noModule`. |
| 11 | Title, description, h1, Hn, lang | ✅ | Pages publiques : titres et descriptions uniques, un seul h1, aucun saut de niveau, `lang="fr"`. |
| 12 | sitemap.xml, robots.txt | ✅ | `app/sitemap.ts` (12 URL), `app/robots.ts` (exclut `/lab`, `/api/`, `/admin`, `/questionnaire/acces`). |
| 13 | Schema.org + Open Graph | ✅ | `Organization` (pas de `LocalBusiness` : aucun local ouvert au public), `WebSite`, `FAQPage`, `BreadcrumbList` ; Open Graph et Twitter Card sur toutes les pages, image générée. |
| 14 | URLs, canonical, www, 404 | ✅ | Canonical sur toutes les pages, `www` → 308 vers le domaine canonique (`next.config.ts`), 404 personnalisée avec vrai statut 404. |
| 15 | Pages légales | ✅ + 🔧 | `/mentions-legales`, `/confidentialite`, liées dans le pied de page. Champs `[À COMPLÉTER]` à remplir (étape 6). |
| 16 | Cookies | ✅ | Aucun cookie sur les pages publiques, aucun traceur ni script tiers ; un `sessionStorage` fonctionnel (intro du hero). Seuls cookies : sessions strictement nécessaires du questionnaire (`yk_questionnaire`) et de l'administration (`yk_admin`), httpOnly, déposés après ouverture d'un lien reçu par e-mail ; décrits dans `/confidentialite`. Turnstile, s'il est activé, ne dépose pas de cookie de suivi. |
| 17 | Responsive | ✅ | `meta viewport`, aucun débordement horizontal de 390 à 1440 px. |
| 18 | Accessibilité | ✅ | axe-core : 0 violation WCAG 2 A/AA sur 14 pages et sur les étapes du questionnaire (desktop et mobile) ; focus or 2 px ; labels et erreurs liés aux champs. Test manuel au lecteur d'écran conseillé. |
| 19 | Contact facile | ✅ + 🔧 | Formulaire de contact et questionnaire de cadrage, action « Démarrer un projet » partout ; e-mail (`mailto:`) affiché automatiquement dès que `SITE.email` est renseigné (vide aujourd'hui) ; lien `tel:` automatique dès que `SITE.telephone` est renseigné (`lib/site.ts`). |
| 20 | Monitoring, délivrabilité | 🔧 | Disponibilité, certificat, domaine, SPF / DKIM / DMARC : étapes 3 et 9. |

## Vérifier à nouveau

```bash
npm audit --omit=dev
npm run build && npx next start -p 3200
curl -I http://localhost:3200/            # en-têtes de sécurité
curl -sI -H "Host: www.yonko.tech" http://localhost:3200/   # 308 vers le domaine canonique
curl -sI http://localhost:3200/media/hero-computer.webm | grep -i cache-control
```
