import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { getAllMixes } from '@/lib/mixes';

/**
 * Like counts for /music.
 *
 * The counts are global; whether *you* have liked something is localStorage in
 * the browser. That split is the whole design: a real total, without accounts,
 * without asking anyone to sign in for a heart.
 *
 * Everything here runs server-side against the service key. No Supabase
 * credential is ever handed to the browser — see CLAUDE.md.
 */

export const dynamic = 'force-dynamic';

/** Only slugs that are actually mixes, so nobody can seed arbitrary rows. */
function knownSlugs(): Set<string> {
  return new Set(getAllMixes().map(m => m.slug));
}

/**
 * Postgres reports an undefined table/function as 42P01/42883. That is the
 * expected state until 002_mix_likes.sql is run, and it should read as "no
 * counts yet" rather than as a broken page.
 */
function isMissingSchema(code?: string): boolean {
  return code === '42P01' || code === '42883' || code === 'PGRST202';
}

export async function GET() {
  const { data, error } = await supabaseServer.from('mix_likes').select('slug, count');

  if (error) {
    if (isMissingSchema(error.code)) return NextResponse.json({ counts: {}, enabled: false });
    console.error('mix_likes read failed', error);
    return NextResponse.json({ counts: {}, enabled: false }, { status: 200 });
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) counts[row.slug] = row.count;
  return NextResponse.json({ counts, enabled: true });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { slug, delta } = (body ?? {}) as { slug?: unknown; delta?: unknown };

  if (typeof slug !== 'string' || !knownSlugs().has(slug)) {
    return NextResponse.json({ error: 'unknown mix' }, { status: 400 });
  }
  // Only ever one at a time. Without this the endpoint is a "set the counter to
  // whatever you like" API.
  if (delta !== 1 && delta !== -1) {
    return NextResponse.json({ error: 'delta must be 1 or -1' }, { status: 400 });
  }

  const { data, error } = await supabaseServer.rpc('bump_mix_like', {
    p_slug: slug,
    p_delta: delta,
  });

  if (error) {
    if (isMissingSchema(error.code)) {
      return NextResponse.json({ enabled: false }, { status: 200 });
    }
    console.error('mix_likes bump failed', error);
    return NextResponse.json({ error: 'could not record that' }, { status: 500 });
  }

  return NextResponse.json({ count: data as number, enabled: true });
}
