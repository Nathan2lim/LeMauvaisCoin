#!/bin/bash
set -e

# Variables
JWT_DIR=/var/www/html/config/jwt
JWT_PASSPHRASE=${JWT_PASSPHRASE:-lemauvaiscoin}
APP_ENV=${APP_ENV:-dev}

# Installer les dépendances
echo "Installing PHP dependencies..."
composer install --no-interaction

# Créer les clés JWT si elles n'existent pas
if [ ! -f "$JWT_DIR/private.pem" ] || [ ! -f "$JWT_DIR/public.pem" ]; then
    echo "Generating JWT keys..."
    mkdir -p $JWT_DIR
    
    # Générer les clés avec openssl
    openssl genrsa -out $JWT_DIR/private.pem -aes256 -passout pass:$JWT_PASSPHRASE 4096
    openssl rsa -pubout -in $JWT_DIR/private.pem -out $JWT_DIR/public.pem -passin pass:$JWT_PASSPHRASE
    
    # Corriger les permissions
    chown -R www-data:www-data $JWT_DIR
    chmod 644 $JWT_DIR/public.pem
    chmod 600 $JWT_DIR/private.pem
fi

# Vider le cache
if [ "$APP_ENV" != "prod" ]; then
    echo "Clearing Symfony cache..."
    php bin/console cache:clear
fi

# Exécuter les migrations si en dev
if [ "$APP_ENV" = "dev" ]; then
    echo "Running database migrations..."
    php bin/console doctrine:migrations:migrate --no-interaction || true
fi

# Démarrer le serveur PHP
echo "Starting PHP server..."
exec php -S 0.0.0.0:8000 -t public
