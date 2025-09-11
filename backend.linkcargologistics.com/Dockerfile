# Usa la imagen oficial de PHP 8.3 con Apache
FROM php:8.3-apache

# Variables de entorno
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema, incluyendo GD con soporte para WebP
RUN apt-get update && apt-get install -y \
    supervisor \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    libjpeg-dev \
    libpng-dev \
    libwebp-dev \
    vsftpd \
    curl \
    wget \
    unzip \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install gd pdo_mysql mysqli intl zip \
    && a2enmod rewrite

# Configurar FTP
RUN useradd -m -d /var/www/html/inmobiliaria -s /bin/bash ftpuser \
    && echo "ftpuser:ftppassword" | chpasswd \
    && echo "ftpuser" | tee -a /etc/vsftpd.userlist \
    && mkdir -p /var/run/vsftpd/empty

COPY config/vsftpd.conf /etc/vsftpd.conf

# Ajustar el DocumentRoot para Laravel
RUN sed -ri -e 's!/var/www/html!/var/www/html/inmobiliaria/public!g' /etc/apache2/sites-available/000-default.conf

# Configurar el VirtualHost para phpMyAdmin
COPY config/phpmyadmin.conf /etc/apache2/sites-available/phpmyadmin.conf
RUN a2ensite phpmyadmin.conf

# Crear el directorio para el proyecto Laravel
WORKDIR /var/www/html/inmobiliaria

# Copiar el código del proyecto Laravel al contenedor
COPY . .

# Instalar las dependencias de Laravel con Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer
#RUN composer install --no-dev --optimize-autoloader

# Establecer permisos correctos para Laravel
RUN chown -R www-data:www-data /var/www/html/inmobiliaria \
    && chmod -R 775 /var/www/html/inmobiliaria/storage /var/www/html/inmobiliaria/bootstrap/cache

# Instalar phpMyAdmin
ENV PHPMYADMIN_VERSION=5.2.1
RUN wget https://files.phpmyadmin.net/phpMyAdmin/${PHPMYADMIN_VERSION}/phpMyAdmin-${PHPMYADMIN_VERSION}-english.tar.gz \
    && tar xzf phpMyAdmin-${PHPMYADMIN_VERSION}-english.tar.gz \
    && rm phpMyAdmin-${PHPMYADMIN_VERSION}-english.tar.gz \
    && mv phpMyAdmin-${PHPMYADMIN_VERSION}-english /var/www/html/phpmyadmin \
    && chown -R www-data:www-data /var/www/html/phpmyadmin

# Copiar el archivo config.inc.php a phpMyAdmin
COPY config/config.inc.php /var/www/html/phpmyadmin/config.inc.php

# Configurar Supervisor para manejar múltiples procesos
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Exponer puertos
EXPOSE 80 21

# Comando de arranque
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]


#docker system prune -a
#chmod +x deploy.sh
#npm run build
#sudo docker build -t programandoweb/ivoolve-inmuebles-demo:backend .
#sudo docker push programandoweb/ivoolve-inmuebles-demo:backend
#sudo docker run -d --name ivoolve-inmuebles-demo-backend -p5000:3000 --restart=always programandoweb/ivoolve-inmuebles-demo:backend
#docker run -d --name ivoolve-inmuebles-demo-backend -p 5000:80 --restart=always programandoweb/ivoolve-inmuebles-demo:backend

#sudo docker stop ivoolve-inmuebles-demo-backend
#sudo docker rm ivoolve-inmuebles-demo-backend