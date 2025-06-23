#!/bin/sh
# Script pour démarrer votre environnement en une seule commande

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérification si fichier .env existe sinon le copier depuis .env.example
if [ ! -f .env ]; then
    echo "${BLUE}Fichier .env non trouvé, création à partir du modèle...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "${GREEN}Fichier .env créé. Vous pouvez le personnaliser selon vos besoins.${NC}"
    else
        echo "${RED}Erreur: Fichier .env.example introuvable.${NC}"
        exit 1
    fi
fi

# Vérification de la présence de Docker
if ! command -v docker &> /dev/null; then
    echo "${RED}Docker n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    exit 1
fi

# Lancement du projet avec make
echo "${BLUE}Démarrage de l'environnement...${NC}"
make start

# Vérification du démarrage des conteneurs
if [ $? -eq 0 ]; then
    echo "${GREEN}==================================================${NC}"
    echo "${GREEN}L'environnement a été démarré avec succès !${NC}"
    echo "${GREEN}==================================================${NC}"
    echo "${YELLOW}Symfony (Backend):${NC} http://localhost:8000"
    echo "${YELLOW}Angular (Frontend):${NC} http://localhost:4200"
    echo "${YELLOW}Base de données:${NC} localhost:3308"
    echo ""
    echo "${BLUE}Commandes utiles:${NC}"
    echo "  make help         - Afficher l'aide"
    echo "  make logs         - Afficher les logs"
    echo "  make bash         - Accéder au terminal Symfony"
    echo "  make down         - Arrêter l'environnement"
    echo ""
    echo "${GREEN}==================================================${NC}"
else
    echo "${RED}Erreur lors du démarrage de l'environnement.${NC}"
fi
