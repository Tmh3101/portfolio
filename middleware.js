import { NextResponse } from 'next/server';
import { createRouteHandlerSupabaseClient } from './lib/supabase/route-client.js';
import { mapSupabaseUser } from './lib/auth/supabase-user.js';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminApi = pathname.startsWith('/api/admin');

  try {
    const { supabase } = createRouteHandlerSupabaseClient(request);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      if (isAdminApi) {
        return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
      }

      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const user = mapSupabaseUser(data.user);

    if (user.role !== 'admin') {
      if (isAdminApi) {
        return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
      }

      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    if (isAdminApi) {
      return NextResponse.json({ message: error?.message || 'Unauthorized.' }, { status: 401 });
    }

    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
