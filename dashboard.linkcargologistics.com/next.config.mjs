/**
 * ---------------------------------------------------
 * Desarrollado por: Jorge Méndez - Programandoweb
 * Correo: lic.jorgemendez@gmail.com
 * Celular: 3115000926
 * Website: Programandoweb.net
 * Proyecto: Ivoolve
 * ---------------------------------------------------
 */
import withPWAInit from "@ducanh2912/next-pwa";

// Inicializa next-pwa
const withPWA = withPWAInit({
  dest: "public",
  // Aquí solo las configuraciones permitidas para next-pwa
});

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http',   hostname: 'localhost' },
      { protocol: 'https',  hostname: 'whats-link.com' },
      { protocol: 'https',  hostname: 'backend-juiao.kinsta.app' },
      { protocol: 'http',   hostname: '*.programandoweb.net' },
      { protocol: 'https',  hostname: 'programandoweb.net' },
    ],
  },  
};

// Aplica next-pwa siempre
const nextConfig = withPWA(baseConfig);

export default nextConfig;