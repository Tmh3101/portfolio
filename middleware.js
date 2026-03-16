import { NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware.js';

export async function middleware(request) {
  // Use the updateSession logic to handle session refreshing and token management
  const { user, response } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // --- Admin Route Protection ---
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) {
    if (!user) {
      // If the user is not authenticated, redirect to the login page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // --- Login Page Redirection ---
  const isLoginPage = pathname === '/login';
  if (isLoginPage && user) {
    // If the user is already logged in, redirect them to the admin dashboard
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Return the synchronized response (potentially with new auth cookies)
  return response;
}

// Configure the matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for static files such as images,
     * following files can be ignored.
     */
    '/admin/:path*',
    '/login',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
