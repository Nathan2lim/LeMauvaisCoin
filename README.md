# LeMauvaisCoin

## Description
LeMauvaisCoin est une plateforme de petites annonces développée avec Laravel (backend) et Angular (frontend).

## Architecture
Ce projet utilise une architecture conteneurisée avec Docker, composée des services suivants:
- **Laravel Backend**: API REST (PHP 8.1)
- **Angular Frontend**: Interface utilisateur (Angular 16+)
- **MySQL**: Base de données
- **PHPMyAdmin**: Interface d'administration de base de données

## Prérequis
- Docker et Docker Compose
- Git

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone [url_du_repo]
   cd LeMauvaisCoin
   ```

2. **Lancer l'application**
   ```bash
   ./rebuild.sh
   ```

   Ce script va:
   - Construire et démarrer tous les conteneurs Docker
   - Installer les dépendances
   - Exécuter les migrations et seeders de la base de données
   - Démarrer les serveurs de développement

3. **Accéder à l'application**
   - Frontend: http://localhost:4201
   - API Backend: http://localhost:9000
   - PHPMyAdmin: http://localhost:8081 (user: root, password: root)

## Structure de la base de données

### Table: listings
| Colonne        | Type        | Description                            |
|----------------|-------------|----------------------------------------|
| id             | bigint      | Identifiant unique                     |
| title          | varchar(255)| Titre de l'annonce                     |
| description    | text        | Description détaillée                  |
| price          | decimal     | Prix demandé                           |
| location       | varchar     | Localisation de l'article              |
| contact_email  | varchar     | Email de contact                       |
| contact_phone  | varchar     | Numéro de téléphone (optionnel)        |
| user_id        | bigint      | ID de l'utilisateur (optionnel)        |
| status         | varchar     | Statut (active, pending, sold)         |
| image_path     | varchar     | Chemin de l'image (optionnel)          |
| created_at     | timestamp   | Date de création                       |
| updated_at     | timestamp   | Date de mise à jour                    |

## API Endpoints

### Listings
- `GET /api/listings` - Récupérer toutes les annonces actives
- `GET /api/listings/{id}` - Récupérer une annonce spécifique
- `POST /api/listings` - Créer une nouvelle annonce
- `PUT /api/listings/{id}` - Mettre à jour une annonce
- `DELETE /api/listings/{id}` - Supprimer une annonce

### Statut
- `GET /api/status` - Vérifier l'état de l'API

## Développement

### Structure du projet
- `backend/` - API Laravel
- `frontend/` - Application Angular
- `docker-compose.yml` - Configuration Docker

### Commandes utiles
- Reconstruire les conteneurs: `./rebuild.sh`
- Logs: `docker-compose logs -f`
- Accéder au conteneur Laravel: `docker exec -it laravel-app bash`
- Accéder au conteneur Angular: `docker exec -it angular-app bash`

Une application web inspirée de LeBonCoin avec un backend Laravel et un frontend Angular, le tout containerisé avec Docker.

## Architecture

- **Frontend**: Application Angular 
- **Backend**: API Laravel
- **Base de données**: MySQL
- **PHPMyAdmin**: Interface d'administration de la base de données

## Prérequis

- Docker et Docker Compose
- Git

## Installation

1. Clonez le dépôt :

```bash
git clone <repository-url>
cd LeMauvaisCoin
```

2. Lancez l'application avec Docker Compose :

```bash
docker-compose up -d
```

3. L'application sera accessible aux URLs suivantes :

- **Frontend Angular**: http://localhost:4201
- **Backend Laravel API**: http://localhost:9000
- **PHPMyAdmin**: http://localhost:8081 (utilisateur: root, mot de passe: root)

## Structure du projet

```
LeMauvaisCoin/
├── docker-compose.yml
├── backend/               # Application Laravel
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/              # Application Angular
│   ├── src/
│   └── ...
```

## API Endpoints

- `GET /api/status` - Statut de l'API
- `GET /api/listings` - Liste des annonces

## Développement

### Backend Laravel

Pour exécuter des commandes Laravel à l'intérieur du conteneur :

```bash
docker exec -it laravel-app bash
cd /var/www
php artisan <commande>
```

Pour créer une migration :

```bash
docker exec -it laravel-app php /var/www/artisan make:migration create_xyz_table
```

### Frontend Angular

Pour générer un nouveau composant :

```bash
docker exec -it angular-app ng generate component xyz
```

## Tests

À implémenter...

## Déploiement

À implémenter...

## Auteurs

- Nathan Gilbert

## Licence

Ce projet est sous licence MIT.