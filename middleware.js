import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { env } from './lib/config/env.js';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Create a Supabase client for the request
  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      // We don't mutate cookies in this middleware, so setAll can be a noop
      setAll() {
        return;
      },
    },
  });

  // Refresh the session so that session.user is the most up-to-date.
  // This will automatically update the session if the user's tokens are stale.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Admin Route Protection ---
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) {
    if (!user) {
      // If the user is not authenticated, redirect to the login page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }

    // If the user is authenticated but not an admin, deny access (assuming roles are handled elsewhere or implicitly)
    // For this example, we assume only admins can access /admin.
    // If you have explicit roles in Supabase, you'd check them here.
    // For simplicity, we're only checking if a user exists for /admin routes.
    // A more robust check would involve fetching user roles from Supabase.
  }

  // --- Login Page Redirection ---
  const isLoginPage = pathname === '/login';
  if (isLoginPage && user) {
    // If the user is already logged in, redirect them to the admin dashboard
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Allow the request to proceed if no redirection or unauthorized response is needed
  return NextResponse.next();
}

// Configure the matcher to specify which paths the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for static files such as images,
     * following files can be ignored.
     * Notice that this includes images, posts, logos, etc.
     */
    '/admin/:path*',
    '/login',
    '/((?!_next/static|_next/image|favicon.ico).*)', // Exclude static assets and favicon
  ],
};
