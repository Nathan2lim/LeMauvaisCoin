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

start_with_watcher() {
    echo "Starting PHP server with file watcher..."
    
    # inotify-tools should now be available from Dockerfile
    if ! command -v inotifywait &> /dev/null; then
        echo "Error: inotify-tools not found. Please rebuild the Docker image."
        exit 1
    fi
    
    # Function to start the PHP server
    start_server() {
        echo "Starting PHP development server on 0.0.0.0:8000..."
        php -S 0.0.0.0:8000 -t public &
        SERVER_PID=$!
        echo "Server started with PID: $SERVER_PID"
    }
    
    # Function to stop the server
    stop_server() {
        if [ ! -z "$SERVER_PID" ] && kill -0 $SERVER_PID 2>/dev/null; then
            echo "Stopping server with PID: $SERVER_PID"
            kill $SERVER_PID 2>/dev/null || true
            wait $SERVER_PID 2>/dev/null || true
        fi
    }
    
    # Trap to ensure server is stopped on script exit
    trap stop_server EXIT
    
    # Start the server initially
    start_server
    
    # Watch for changes in relevant directories
    while true; do
        echo "Watching for file changes in src/, config/, templates/, public/..."
        
        # Watch multiple directories and file types
        inotifywait -r -e modify,create,delete,move,attrib \
            --include '\.(php|yaml|yml|twig|env)$' \
            src/ config/ templates/ public/ 2>/dev/null || true
        
        echo "File change detected, restarting server..."
        stop_server
        sleep 2
        start_server
    done
}


# Check if we're in development mode
if [ "$APP_ENV" = "dev" ]; then
    start_with_watcher
else
    # Original command for production
    echo "Starting PHP server..."
    exec php -S 0.0.0.0:8000 -t public
fi
