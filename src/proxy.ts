import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// In Next.js 16, this function must be named 'proxy'
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // 1. FIX: Check if we are already on the login page (prevents loop)
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // 2. Protect admin routes
  if (pathname.startsWith('/admin')) {
    // If no token, redirect to login
    if (!token) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // If user doesn't have admin role, redirect to homepage
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow all other routes to proceed
  return NextResponse.next();
}

// Config matches all admin routes
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};