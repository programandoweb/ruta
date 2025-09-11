#!/bin/bash

# Asegúrate de que el script se ejecute con permisos de superusuario
if [ "$EUID" -ne 0 ]; then 
  echo "Por favor, ejecute el script como root"
  exit 1
fi

echo "Ejecutando docker system prune -a..."
docker system prune -a -f

echo "Dando permisos de ejecución al script..."
chmod +x start.sh

echo "Ejecutando npm run build..."
npm run build

echo "Construyendo la imagen Docker..."
docker build -t programandoweb/evolve:ivoolve-inmuebles-demo:dashboard .

echo "Pusheando la imagen al repositorio Docker..."
docker push programandoweb/evolve:ivoolve-inmuebles-demo:dashboard

echo "Deteniendo el contenedor anterior si está corriendo..."
docker stop ivoolve-inmuebles-demo-dashboard || true

echo "Eliminando el contenedor anterior si existe..."
docker rm ivoolve-inmuebles-demo-dashboard || true

echo "Desplegando el nuevo contenedor..."
docker run -d --name ivoolve-inmuebles-demo-dashboard -p5001:3000 --restart=always programandoweb/ivoolve-inmuebles-demo:dashboard

echo "Reiniciando el servicio de MariaDB..."
sudo systemctl restart mariadb

echo "Despliegue completado exitosamente."
