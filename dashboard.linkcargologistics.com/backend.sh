#!/bin/bash

# Guardar la ruta actual
CURRENT_DIR=$(pwd)

# Cambiar al directorio especificado
cd /var/www/html/ivoolve-inventory/

# Ejecutar el comando artisan con sudo
sudo php artisan migrate:fresh --seed

# Volver a la ruta original
cd "$CURRENT_DIR"
