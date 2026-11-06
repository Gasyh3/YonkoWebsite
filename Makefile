# Commandes du projet Yonko Tech Consulting. « make » (ou « make help ») affiche la liste.
# Les variables se surchargent à l'appel : make docker-up APP_PORT=8080

SHELL := /bin/bash
.DEFAULT_GOAL := help

IMAGE ?= yonkotech-web
TAG ?= latest
APP_PORT ?= 3000
NEXT_PUBLIC_SITE_URL ?= https://yonkotech.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY ?=
# --env-file seulement si .env existe (variables lues au démarrage du conteneur).
ENV_FILE := $(if $(wildcard .env),--env-file .env,)

.PHONY: help env install dev build start lint typecheck audit check clean \
	docker-build docker-up docker-down docker-restart docker-logs docker-ps docker-shell \
	docker-health docker-image docker-run docker-clean

help: ## Affiche cette aide
	@echo "Yonko Tech Consulting : commandes disponibles"
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*## "} {printf "  \033[33m%-15s\033[0m %s\n", $$1, $$2}'

## ---- Projet (sans Docker) ----

env: ## Crée .env à partir de .env.example (ne remplace jamais un .env existant)
	@if [ -f .env ]; then echo ".env existe déjà : rien à faire."; else cp .env.example .env && echo ".env créé : à compléter."; fi

install: ## Installe les dépendances (npm ci)
	npm ci

dev: ## Lance le serveur de développement (http://localhost:3000)
	npm run dev

build: ## Construit le site pour la production
	npm run build

start: ## Lance le site construit (après make build)
	npm run start

lint: ## Vérifie le code (ESLint)
	npm run lint

typecheck: ## Vérifie les types TypeScript
	npx tsc --noEmit -p .

audit: ## Cherche les vulnérabilités des dépendances de production
	npm audit --omit=dev

check: lint typecheck audit build ## Tout vérifier avant un push : lint, types, audit, build

clean: ## Supprime le build local (.next)
	rm -rf .next

## ---- Docker (image de production, identique à Dokploy) ----

docker-build: ## Construit l'image via docker compose (lit .env)
	docker compose build

docker-up: ## Construit puis lance le site en arrière-plan (http://localhost:$(APP_PORT))
	docker compose up -d --build
	@echo "Site lancé : http://localhost:$(APP_PORT)  (make docker-logs pour suivre)"

docker-down: ## Arrête et supprime le conteneur
	docker compose down

docker-restart: ## Redémarre le conteneur sans reconstruire
	docker compose restart

docker-logs: ## Affiche les journaux en continu
	docker compose logs -f

docker-ps: ## État du conteneur (dont le contrôle de santé)
	docker compose ps

docker-shell: ## Ouvre un shell dans le conteneur
	docker compose exec web sh

docker-health: ## Interroge le contrôle de santé (/api/health)
	@curl -fsS http://localhost:$(APP_PORT)/api/health && echo

docker-image: ## Construit l'image comme Dokploy (docker build + arguments de build)
	docker build \
		--build-arg NEXT_PUBLIC_SITE_URL=$(NEXT_PUBLIC_SITE_URL) \
		--build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=$(NEXT_PUBLIC_TURNSTILE_SITE_KEY) \
		-t $(IMAGE):$(TAG) .

docker-run: ## Lance l'image construite par docker-image, au premier plan
	docker run --rm --name $(IMAGE) -p $(APP_PORT):3000 $(ENV_FILE) $(IMAGE):$(TAG)

docker-clean: ## Arrête le conteneur et supprime l'image locale
	docker compose down --rmi local --remove-orphans
