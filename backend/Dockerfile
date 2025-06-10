FROM php:8.2-fpm

# Install system deps
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    npm

# PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working dir
WORKDIR /var/www

# Copy Laravel files
COPY . .

# Expose port for Artisan serve
EXPOSE 8000

# Set permissions for the volume mount
RUN mkdir -p /var/www && chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www

# Set up entrypoint script to install dependencies and start server
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Start Laravel dev server
ENTRYPOINT ["entrypoint.sh"]
