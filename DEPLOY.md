# Déploiement de LeMauvaisCoin avec nginx-proxy et acme-companion

Ce projet est configuré pour être déployé avec la configuration nginx-proxy et acme-companion déjà en place sur le serveur.

## Prérequis

- Serveur disposant déjà de nginx-proxy et acme-companion en fonctionnement
- Docker et Docker Compose installés
- Nom de domaine configuré (lemauvaiscoin.sherwheels.fr)

## Déploiement

1. **Cloner le dépôt sur le serveur**
   ```bash
   git clone [URL_DU_REPO] lemauvaiscoin
   cd lemauvaiscoin
   ```

2. **Vérification de la configuration**
   La configuration est déjà adaptée pour utiliser le réseau `sharewheels_default` et l'adresse email `contact@sherwheels.fr` pour Let's Encrypt.

3. **Lancer l'application**
   ```bash
   docker-compose up -d
   ```

4. **Vérifier le fonctionnement**
   - Le site frontend devrait être accessible à https://lemauvaiscoin.sherwheels.fr
   - L'API devrait être accessible à https://lemauvaiscoin.sherwheels.fr/api

## Structure

- **Frontend:** Angular servi sur le port 4201 dans le conteneur
- **Backend:** Laravel API servi sur le port 8000 dans le conteneur
- **Base de données:** MySQL 8.0

## Remarques

- Les certificats SSL sont gérés automatiquement par acme-companion
- Le proxy nginx-proxy gère le routage vers l'application
- L'application utilise un conteneur nginx interne pour router entre le frontend et le backend

## En cas de problème

Si vous rencontrez des problèmes de connexion, vérifiez:
1. Que le nom de domaine pointe vers le serveur
2. Que le container nginx-proxy est bien connecté au réseau "nginx-proxy-network"
3. Les logs avec `docker-compose logs -f`
