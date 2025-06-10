#!/bin/bash
set -e

cd /var/www

# Créer les répertoires essentiels s'ils n'existent pas
mkdir -p bootstrap/cache
mkdir -p storage/app/public
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Correction des permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Install dependencies if vendor directory doesn't exist or force reinstall
if [ ! -d "vendor" ] || [ "$FORCE_INSTALL" = "true" ]; then
    echo "Installing dependencies..."
    composer install --no-interaction --no-scripts
else
    echo "Dependencies already installed."
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env 2>/dev/null || echo "APP_KEY=
APP_NAME=LeMauvaisCoin
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:9000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=root" > .env
    echo ".env file created"
fi

# Generate application key if not already set
if ! grep -q "APP_KEY=" .env || grep -q "APP_KEY=\$" .env || grep -q "APP_KEY=$" .env; then
    echo "Generating app key..."
    php artisan key:generate --force || echo "Could not generate app key, will try again after vendor installation"
fi

# Run migrations only if DB is available
echo "Checking database connection..."
php -r "
\$host = 'mysql';
\$port = 3306;
\$waiting = 0;
while (!\$conn = @fsockopen(\$host, \$port, \$errno, \$errstr, 1) && \$waiting < 30) {
    echo \"Waiting for database connection... (\$waiting s)\n\";
    sleep(1);
    \$waiting++;
}
if (!\$conn) {
    echo \"Database is not available.\n\";
    exit(1);
} else {
    fclose(\$conn);
    echo \"Database is available.\n\";
    exit(0);
}
" && echo "Running migrations..." && php artisan migrate --force && echo "Running seeders..." && php artisan db:seed --force || echo "Skipping migrations due to database connection issues"

# Make artisan executable
chmod +x artisan 2>/dev/null || echo "Could not make artisan executable"

# Start Laravel development server
echo "Starting Laravel development server..."

# Try both methods to start the server
if [ -f "artisan" ]; then
    echo "Starting with artisan serve..."
    php artisan serve --host=0.0.0.0 --port=8000
else
    echo "Starting with built-in PHP server..."
    php -S 0.0.0.0:8000 -t public
fi
