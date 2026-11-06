# Déployer le site avec Dokploy

Le site est livré sous forme d'image Docker (`Dockerfile` à la racine). Dokploy la construit **sur ton serveur**
à chaque déploiement : aucune minute GitHub Actions n'est consommée. Le dépôt n'a d'ailleurs aucun workflow GitHub.

## Ce que contient l'image

| Élément | Détail |
|---|---|
| Base | `node:22-alpine`, en 3 étapes (dépendances, build, exécution) |
| Serveur | Next.js en mode *standalone* (`node server.js`), port **3000** |
| Sécurité | Utilisateur non root (`nextjs`), aucune clé dans l'image (`.env` exclu) |
| Santé | `GET /api/health` → `{"status":"ok"}`, utilisé par le `HEALTHCHECK` de l'image |
| Déjà dans le site | En-têtes de sécurité (CSP, HSTS…), redirection www → domaine nu, compression gzip, cache des médias |

## Variables

Deux familles, à ne pas confondre :

| Variable | Où la mettre dans Dokploy | Quand elle est lue | Obligatoire |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Build-time Arguments (« Build Args ») | Au build | Oui (ex. `https://yonko.tech`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Build-time Arguments | Au build | Avec Turnstile |
| `CONTACT_WEBHOOK_URL` | Environment | Au démarrage | Oui, pour recevoir les demandes |
| `TURNSTILE_SECRET_KEY` | Environment | Au démarrage | Avec Turnstile |
| `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` | Environment | Au démarrage | Seulement si envoi par Resend |

Les variables **de build** sont inscrites dans le site (URL canoniques, sitemap, redirection www, CSP, clé
Turnstile) : après les avoir changées, il faut **redéployer** (reconstruire), un simple redémarrage ne suffit pas.

## Procédure (une seule fois)

1. **Serveur** : un VPS avec Dokploy installé, au moins **2 Go de RAM** (le build Next.js en a besoin ; sinon,
   ajouter du swap). Le serveur doit accéder à Internet pendant le build (npm et polices Google).
2. **DNS** : chez le registraire, un enregistrement `A` pour `yonko.tech` **et** pour `www.yonko.tech`
   vers l'IP du serveur.
3. **Dokploy → Projects → Create Project** (ex. « Yonko »), puis **Create Service → Application**.
4. **Source** : *Provider* GitHub (connecter l'application GitHub de Dokploy si ce n'est pas fait), dépôt
   `YonkoWebsite`, branche de production.
5. **Build Type** : **Dockerfile**. Docker File : `Dockerfile` ; Docker Context Path : `.` ; Build Stage : vide.
6. **Environment** : coller les variables d'exécution (tableau ci-dessus) ; dans **Build-time Arguments**, mettre
   `NEXT_PUBLIC_SITE_URL=https://yonko.tech` (et la clé Turnstile publique si elle existe).
7. **Domains** : ajouter `yonko.tech`, *Path* `/`, *Container Port* **3000**, **HTTPS activé**, certificat
   **Let's Encrypt**. Ajouter de même `www.yonko.tech` (le site le redirige lui-même vers le domaine nu).
   Avec HTTPS activé, Dokploy (Traefik) redirige automatiquement http → https.
8. **Deploy**. Suivre l'onglet *Deployments* / *Logs* : le build prend quelques minutes la première fois.
9. **Auto Deploy** (onglet *General* ou *Deployments*) : l'activer pour redéployer à chaque push sur la branche.
   Le déclenchement passe par le webhook GitHub de Dokploy, pas par GitHub Actions.

Les libellés exacts peuvent varier légèrement selon la version de Dokploy.

## Vérifier après déploiement

```bash
curl -s https://yonko.tech/api/health                 # {"status":"ok"}
curl -sI http://yonko.tech | head -3                    # redirection vers https
curl -sI https://www.yonko.tech | grep -i location      # → https://yonko.tech/
curl -sI https://yonko.tech | grep -iE "strict-transport|content-security"
```

Puis un envoi test du formulaire, et les vérifications de `docs/mise-en-ligne.txt` (étape 13).

## Variante : déploiement « Compose »

`docker-compose.yml` sert surtout au lancement local (`make docker-up`). Dokploy peut aussi l'utiliser
(*Create Service → Compose*) : mettre alors les variables dans l'onglet *Environment* du service (Dokploy les
écrit dans un `.env`), et déclarer le domaine sur le service `web`, port 3000. La publication de port
(`ports:`) n'est pas nécessaire derrière Traefik ; la supprimer en cas de conflit avec un autre service.
Le type **Application + Dockerfile** ci-dessus reste le plus simple.

## En local

```bash
make env          # crée .env depuis .env.example (à compléter)
make docker-up    # construit l'image et lance le site sur http://localhost:3000
make docker-logs  # journaux
make docker-down  # arrêt
make docker-image && make docker-run   # même build que Dokploy (docker build + arguments)
```

`make help` liste toutes les commandes (projet sans Docker : `make dev`, `make check`…).

## Bon à savoir

- **Une seule instance** : la limite d'envois du formulaire (5 / 10 min par IP) est en mémoire ; avec plusieurs
  réplicas, chacune compte de son côté.
- **IP des visiteurs** : le formulaire lit `X-Real-IP`, renseigné par Traefik ; ne pas exposer le conteneur
  directement sur Internet sans proxy.
- **Mise à jour de sécurité** : `make audit` en local ; une version de Next.js vulnérable bloque le build
  (c'est voulu) : mettre à jour puis redéployer.
