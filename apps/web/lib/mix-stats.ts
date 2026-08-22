import { supabaseServer } from '@/lib/supabase-server';
import { getAllMixes } from '@/lib/mixes';

/**
 * Shared plumbing for the /music counters.
 *
 * Everything here runs server-side against the service key. No Supabase
 * credential is ever handed to the browser — see CLAUDE.md.
 */

export interface MixStat {
  likes: number;
  plays: number;
}

/**
 * "The schema is not there yet", in the several dialects it arrives in.
 * Postgres raises 42P01/42883 for an undefined table/function, but PostgREST
 * usually answers from its schema cache first and never reaches Postgres:
 * PGRST205 for a missing table, PGRST202 for a missing function. Both were
 * confirmed against the live project before the migration was run.
 *
 * This is the expected state until 002_mix_stats.sql runs, and it should read
 * as "no counts yet", not as a broken page.
 */
const MISSING_SCHEMA = new Set(['42P01', '42883', 'PGRST202', 'PGRST205']);

export function isMissingSchema(code?: string): boolean {
  return code !== undefined && MISSING_SCHEMA.has(code);
}

/** Only slugs that are actually mixes, so nobody can seed arbitrary rows. */
export function isKnownMix(slug: unknown): slug is string {
  return typeof slug === 'string' && getAllMixes().some(m => m.slug === slug);
}

export async function readStats(): Promise<Record<string, MixStat> | null> {
  const { data, error } = await supabaseServer.from('mix_stats').select('slug, likes, plays');

  if (error) {
    if (!isMissingSchema(error.code)) console.error('mix_stats read failed', error);
    return null;
  }

  const stats: Record<string, MixStat> = {};
  for (const row of data ?? []) stats[row.slug] = { likes: row.likes, plays: row.plays };
  return stats;
}
