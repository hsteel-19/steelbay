import { NextResponse } from 'next/server';
import { isKnownMix, isMissingSchema, statsClient } from '@/lib/mix-stats';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { slug, delta } = (body ?? {}) as { slug?: unknown; delta?: unknown };

  if (!isKnownMix(slug)) {
    return NextResponse.json({ error: 'unknown mix' }, { status: 400 });
  }
  // Only ever one at a time. Without this the endpoint is a "set the counter to
  // whatever you like" API.
  if (delta !== 1 && delta !== -1) {
    return NextResponse.json({ error: 'delta must be 1 or -1' }, { status: 400 });
  }

  const { data, error } = await statsClient.rpc('bump_mix_like', {
    p_slug: slug,
    p_delta: delta,
  });

  if (error) {
    if (isMissingSchema(error.code)) return NextResponse.json({ enabled: false });
    console.error('mix like failed', error);
    return NextResponse.json({ error: 'could not record that' }, { status: 500 });
  }

  return NextResponse.json({ likes: data as number, enabled: true });
}
