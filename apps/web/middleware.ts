import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE, safeEqual } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const secret = process.env.VIBE_CHECK_SECRET;

  // Fail closed. If the gate isn't configured, deny rather than silently
  // serving the dashboard to everyone.
  if (!secret) {
    return new NextResponse(
      'Access control is not configured. Set VIBE_CHECK_SECRET and VIBE_CHECK_CODE.',
      { status: 503, headers: { 'content-type': 'text/plain' } }
    );
  }

  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (cookie && safeEqual(cookie, secret)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/unlock';
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Both entries on purpose: '/vibe-check/:path*' alone is not reliably
  // guaranteed to match the bare '/vibe-check' route, and missing it would
  // leave the dashboard itself wide open.
  matcher: ['/vibe-check', '/vibe-check/:path*'],
};
