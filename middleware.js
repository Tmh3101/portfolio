import { NextResponse } from 'next/server';
import { verifyAccessTokenEdge } from './lib/auth/edge.js';
import { ACCESS_TOKEN_COOKIE } from './lib/auth/cookies.js';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminApi = pathname.startsWith('/api/admin');
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const payload = await verifyAccessTokenEdge(token);

    if (payload?.type !== 'access') {
      if (isAdminApi) {
        return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
      }

      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (payload?.role !== 'admin') {
      if (isAdminApi) {
        return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
      }

      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    if (isAdminApi) {
      return NextResponse.json(
        { message: error?.message || 'Unauthorized.' },
        { status: error?.statusCode || 401 },
      );
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
