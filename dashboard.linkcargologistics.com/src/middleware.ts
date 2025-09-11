import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Comprueba si el usuario está accediendo a la raíz del dominio
  if (request.nextUrl.pathname === '/') {
    // Redirige a la ruta /auth
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  // Si no es la raíz, continúa con la solicitud normal
  return NextResponse.next();
}

// Configura las rutas en las que se aplica el middleware
export const config = {
  matcher: '/', // Solo se aplica en la raíz del dominio
};
