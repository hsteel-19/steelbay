import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { isKnownMix, isMissingSchema } from '@/lib/mix-stats';

export const dynamic = 'force-dynamic';

/**
 * One press of play is one play. The browser fires this and forgets — the
 * number on screen comes from the next page load, so a slow or failed write
 * must never interrupt playback.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { slug } = (body ?? {}) as { slug?: unknown };

  if (!isKnownMix(slug)) {
    return NextResponse.json({ error: 'unknown mix' }, { status: 400 });
  }

  const { data, error } = await supabaseServer.rpc('bump_mix_play', { p_slug: slug });

  if (error) {
    if (isMissingSchema(error.code)) return NextResponse.json({ enabled: false });
    console.error('mix play failed', error);
    return NextResponse.json({ error: 'could not record that' }, { status: 500 });
  }

  return NextResponse.json({ plays: data as number, enabled: true });
}
