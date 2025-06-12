# Instructions pour configurer SSL sur votre VPS

## Prérequis
- Avoir Docker et Docker Compose installés sur votre VPS
- Avoir votre domaine lemauvaiscoin.sherwheels.fr configuré pour pointer vers votre VPS

## Étapes pour configurer SSL avec Let's Encrypt

1. **Installer Certbot sur votre VPS**
   ```bash
   sudo apt update
   sudo apt install certbot
   ```

2. **Générer les certificats SSL**
   ```bash
   sudo certbot certonly --standalone -d lemauvaiscoin.sherwheels.fr
   ```

3. **Copier les certificats dans le dossier nginx/ssl**
   ```bash
   sudo cp /etc/letsencrypt/live/lemauvaiscoin.sherwheels.fr/fullchain.pem ./nginx/ssl/
   sudo cp /etc/letsencrypt/live/lemauvaiscoin.sherwheels.fr/privkey.pem ./nginx/ssl/
   sudo chmod 755 -R ./nginx/ssl/
   ```

4. **Lancer les conteneurs**
   ```bash
   docker-compose up -d
   ```

5. **Renouvellement automatique des certificats**
   Ajoutez une tâche cron pour renouveler automatiquement vos certificats
   ```bash
   sudo crontab -e
   ```
   
   Ajoutez cette ligne:
   ```
   0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/lemauvaiscoin.sherwheels.fr/*.pem /chemin/vers/votre/projet/nginx/ssl/ && docker restart lmc-nginx
   ```

## Configuration d'environnement
Pour une meilleure sécurité en production, créez un fichier .env à la racine du projet et remplacez les valeurs sensibles dans docker-compose.yml par des variables d'environnement.
