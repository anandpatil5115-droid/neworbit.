import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If user visits root, redirect to login or subjects (handled mostly via client-side check, 
  // but let's just let root be a redirect to /subjects for now, or /auth/login)
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/subjects', request.url));
  }

  // We could check a simple cookie here for basic protection, but our refresh token is httpOnly.
  // Next.js middleware doesn't easily verify custom JWTs without Edge-compatible libs.
  // Since we rely on client-side fetching with Axios interceptors that will kick us out 
  // if unauthorized, and our backend protects the APIs, we can do a soft redirect here if refresh_token cookie is totally missing.
  // Note: the `refresh_token` cookie is httpOnly and sent to the backend. Next middleware CAN read it to verify its presence.
  
  const hasRefreshToken = request.cookies.has('refresh_token');

  // Protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/subjects') || request.nextUrl.pathname.startsWith('/profile');
  
  if (isProtectedRoute && !hasRefreshToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If going to auth but already has a refresh token, we can try redirecting to subjects.
  // Although the token might be expired, this is just an optimistic UX redirect.
  if (request.nextUrl.pathname.startsWith('/auth') && hasRefreshToken) {
    return NextResponse.redirect(new URL('/subjects', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/subjects/:path*', '/profile', '/auth/:path*'],
};
