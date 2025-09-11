import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Leer la cookie llamada 'token'
    const token = request.cookies.get('token');

    // Redirigir a la página de autenticación si no hay token
    if (!token || !token.value) {
        console.log('Token not found, redirecting to /auth');
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    try {
        const tokenData = JSON.parse(token.value);
        const now = new Date();
        
        if (new Date(tokenData.expires) > now) {
            console.log(`Token found and valid: ${tokenData.value}`);
            // Permitir el acceso a la página
            return NextResponse.next();
        } else {
            console.log('Token expired, redirecting to /auth');
            // Redirigir a la página de autenticación si la cookie ha expirado
            const response = NextResponse.redirect(new URL('/auth', request.url));
            response.cookies.set('token', '', { expires: new Date(0) }); // Eliminar la cookie
            return response;
        }
    } catch (error) {
        console.error('Error parsing token:', error);
        // Redirigir a la página de autenticación si hay un error al analizar la cookie
        return NextResponse.redirect(new URL('/auth', request.url));
    }
}

// Configuración del middleware para proteger rutas específicas
export const config = {
    matcher: [
        '/',           // Proteger la raíz
        '/dashboard',  // Proteger el dashboard
        '/settings',   // Proteger la configuración
        '/profile',    // Proteger el perfil
    ],
};
