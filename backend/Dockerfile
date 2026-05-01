FROM php:8.2-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy backend source
COPY . /var/www/html/

# Configure Apache to use /var/www/html as root and allow .htaccess
RUN echo '<Directory /var/www/html>\n\
    Options -Indexes +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/tiles.conf \
    && a2enconf tiles

# Create storage directory
RUN mkdir -p /var/www/html/storage/kyc \
    && chown -R www-data:www-data /var/www/html/storage

EXPOSE 80
