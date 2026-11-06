# Image de production du site Yonko Tech Consulting (Next.js standalone), utilisée par Dokploy (type de build
# « Dockerfile ») et par docker-compose.yml en local. Voir docs/deploiement-dokploy.md.
#
# Variables lues AU BUILD (arguments) : NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_TURNSTILE_SITE_KEY. Elles sont inscrites
# dans le site (URL canoniques, redirection www, CSP, clé Turnstile) : les changer impose de reconstruire l'image.
# Variables lues AU DÉMARRAGE (environnement) : CONTACT_WEBHOOK_URL, TURNSTILE_SECRET_KEY, RESEND_API_KEY,
# CONTACT_FROM, CONTACT_TO. Aucune clé n'est copiée dans l'image (.env exclu par .dockerignore).

ARG NODE_IMAGE=node:22-alpine

# 1. Dépendances (couche mise en cache tant que package-lock.json ne change pas).
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# 2. Build (le build télécharge les polices Google : accès réseau requis).
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL=https://yonkotech.com
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY} \
    NEXT_TELEMETRY_DISABLED=1 \
    BUILD_STANDALONE=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Exécution : serveur Node autonome, utilisateur non root, sans les sources ni les dépendances de build.
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health > /dev/null || exit 1
CMD ["node", "server.js"]
