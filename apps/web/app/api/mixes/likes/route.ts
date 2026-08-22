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
 * "The schema is not there yet", in the several dialects it arrives in.
 * Postgres raises 42P01/42883 for an undefined table/function, but PostgREST
 * usually answers from its schema cache first and never reaches Postgres:
 * PGRST205 for a missing table, PGRST202 for a missing function. Verified by
 * calling both against the live project before the migration was run.
 *
 * This is the expected state until 002_mix_likes.sql runs, and it should read
 * as "no counts yet", not as a broken page.
 */
const MISSING_SCHEMA = new Set(['42P01', '42883', 'PGRST202', 'PGRST205']);

function isMissingSchema(code?: string): boolean {
  return code !== undefined && MISSING_SCHEMA.has(code);
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
