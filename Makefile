.PHONY: start down logs help bash shell shell-angular shell-nginx

# Variables
DC=cd deploy/docker && docker compose

# Commandes principales
start:
	$(DC) up -d --build

down:
	$(DC) down

restart:
	$(DC) restart

logs:
	$(DC) logs -f

# Commandes shell
bash: # Accès au terminal Symfony
	$(DC) exec symfony bash

shell: # Alias pour bash
	$(DC) exec symfony bash

shell-angular: # Accès au terminal Angular
	$(DC) exec angular sh

shell-nginx: # Accès au terminal Nginx
	$(DC) exec nginx sh

# Commandes pour base de données
db: # Accès au terminal MariaDB
	$(DC) exec db mariadb -uroot -proot symfony_db

db-migrate:
	$(DC) exec symfony php bin/console doctrine:migrations:migrate --no-interaction

db-refresh:
	$(DC) exec symfony php bin/console doctrine:schema:drop --force --full-database
	$(DC) exec symfony php bin/console doctrine:migrations:migrate --no-interaction

# Commandes pour le cache
cache-clear:
	$(DC) exec symfony php bin/console cache:clear

# Affichage de l'aide
help:
	@echo "Commandes disponibles:"
	@echo "  make start         - Démarrer l'environnement"
	@echo "  make down          - Arrêter l'environnement"
	@echo "  make restart       - Redémarrer l'environnement"
	@echo "  make logs          - Afficher les logs"
	@echo "  make bash/shell    - Accéder au terminal Symfony"
	@echo "  make shell-angular - Accéder au terminal Angular"
	@echo "  make shell-nginx   - Accéder au terminal Nginx"
	@echo "  make db            - Accéder à la base de données"
	@echo "  make db-migrate    - Exécuter les migrations"
	@echo "  make db-refresh    - Rafraîchir la base de données"
	@echo "  make cache-clear   - Vider le cache Symfony"
