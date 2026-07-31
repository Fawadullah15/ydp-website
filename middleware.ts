import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'ydp-super-secret-key-for-jwt-signing-2024'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('ydp-session')?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify JWT
      const { payload } = await jwtVerify(sessionToken, SECRET);
      
      // If super admin route logic was needed, we could check payload.role === 'SUPER_ADMIN' here
      
      // Clone request and add user headers for backend usage if necessary
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-role', payload.role as string);
      requestHeaders.set('x-user-email', payload.email as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Middleware JWT verification failed:', error);
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('ydp-session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
