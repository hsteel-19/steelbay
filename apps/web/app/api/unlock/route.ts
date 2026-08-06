import { NextResponse } from 'next/server';
import { AUTH_COOKIE, AUTH_MAX_AGE, safeEqual, safeNextPath } from '@/lib/auth';

export async function POST(request: Request) {
  const form = await request.formData();
  const code = String(form.get('code') ?? '');
  const next = safeNextPath(String(form.get('next') ?? ''));

  const expected = process.env.VIBE_CHECK_CODE;
  const secret = process.env.VIBE_CHECK_SECRET;

  if (!expected || !secret) {
    return new NextResponse('Access control is not configured.', { status: 503 });
  }

  // Blunt the edge off brute-forcing a 6-digit code. Not a substitute for real
  // rate limiting (SB-38), but it turns a fast enumeration into a slow one.
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!safeEqual(code, expected)) {
    const back = new URL('/unlock', request.url);
    back.searchParams.set('next', next);
    back.searchParams.set('error', '1');
    return NextResponse.redirect(back, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(AUTH_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_MAX_AGE,
  });
  return response;
}
