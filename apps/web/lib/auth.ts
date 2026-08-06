export const AUTH_COOKIE = 'vc_auth';

// 30 days — long enough that Henrik isn't re-entering the code constantly.
export const AUTH_MAX_AGE = 60 * 60 * 24 * 30;

/** Constant-time string compare, so a wrong guess leaks nothing via timing. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Only allow same-origin relative redirects. Without this, ?next=https://evil.com
 * would turn the unlock form into an open redirect.
 */
export function safeNextPath(value: string | null | undefined): string {
  if (!value) return '/vibe-check';
  if (!value.startsWith('/') || value.startsWith('//')) return '/vibe-check';
  return value;
}
