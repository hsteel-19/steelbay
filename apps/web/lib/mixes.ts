import fs from 'fs';
import path from 'path';

const PEAKS_DIR = path.join(process.cwd(), 'content/mixes');

/**
 * Public Supabase Storage origin for the `mixes` bucket.
 *
 * Hardcoded rather than read from SUPABASE_URL because this is the one Supabase
 * value that is public by definition — it ends up in an <audio src> either way.
 * Reading it from an env var would make a fully static page fail to build the
 * moment that var is missing, for no security gained.
 */
const AUDIO_BASE = 'https://nzwwaqttkvvsbwzsiegk.supabase.co/storage/v1/object/public/mixes';

interface MixSource {
  slug: string;
  title: string;
  /** When it was recorded, ISO. Taken from the master's timestamp. */
  recorded: string;
  /** Seconds, measured off the source WAV by scripts/mix-peaks.mjs. */
  duration: number;
  /** Optional one-liner. Left off rather than filled with invented copy. */
  note?: string;
  /** Henrik's own label for the set. Not derived from anything. */
  genre: string;
}

export interface Mix extends MixSource {
  /** Chronological rank, oldest = 01. Derived, never written by hand. */
  n: string;
  audio: string;
  cover: string;
  /** 480 values, 0-100. See scripts/mix-peaks.mjs. */
  peaks: number[];
}

export interface MixGroup {
  label: string;
  mixes: Mix[];
}

// Add a mix: ./scripts/add-mix.sh <slug> <master.wav> <cover.png> encodes,
// uploads and prints the row to paste in here. Nothing else to touch.
const mixes: MixSource[] = [
  {
    slug: 'at-the-hotel-pt-ii',
    title: 'At the Hotel pt II',
    recorded: '2025-08-02',
    duration: 8711,
    genre: 'House',
    note: 'Live @ Lydmar',
  },
  {
    slug: 'at-the-hotel-pt-i',
    title: 'At the Hotel pt I',
    recorded: '2025-07-30',
    duration: 6473,
    genre: 'Lounge',
    note: 'Live @ Lydmar',
  },
  {
    slug: 'djungle',
    title: 'Djungle',
    recorded: '2025-10-05',
    duration: 3791,
    genre: 'Driving Techno',
  },
  {
    slug: 'view',
    title: 'VIEW',
    recorded: '2025-07-05',
    duration: 5130,
    genre: 'Tech House',
  },
  {
    slug: 'diza-drift',
    title: 'Diza Drift',
    recorded: '2025-06-09',
    duration: 3856,
    genre: 'Acid House',
  },
  {
    slug: 'tekno',
    title: 'Tekno',
    recorded: '2025-02-08',
    duration: 3622,
    genre: 'Peak-Time / Driving',
  },
  {
    slug: 'pucken',
    title: 'Pucken',
    recorded: '2025-01-05',
    duration: 4626,
    genre: 'Afro House',
  },
  {
    slug: 'stolen',
    title: 'Stolen',
    recorded: '2024-12-07',
    duration: 5159,
    genre: 'Deep House',
  },
  {
    slug: 'sten',
    title: 'Sten',
    recorded: '2024-11-23',
    duration: 3599,
    genre: 'Tech House',
  },
];

/**
 * The three that go at the top, in this order. Henrik picks these by hand —
 * they are not "most recent" or "longest" and should not be derived from
 * anything. A featured mix is listed once, up here, and not repeated below:
 * two rows sharing a slug would both light up as playing, because the player
 * tracks the active mix by slug.
 */
const FEATURED = ['at-the-hotel-pt-ii', 'pucken', 'diza-drift'];

function readPeaks(slug: string): number[] {
  const file = path.join(PEAKS_DIR, `${slug}.peaks.json`);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Chronological rank by slug, oldest = 1, so numbering survives regrouping. */
function chronology(): Map<string, string> {
  return new Map(
    [...mixes]
      .sort((a, b) => a.recorded.localeCompare(b.recorded))
      .map((m, i) => [m.slug, String(i + 1).padStart(2, '0')]),
  );
}

function hydrate(m: MixSource, n: string): Mix {
  return {
    ...m,
    n,
    audio: `${AUDIO_BASE}/${m.slug}.m4a`,
    cover: `/mixes/${m.slug}.jpg`,
    peaks: readPeaks(m.slug),
  };
}

/** Featured first in Henrik's order, then everything else newest first. */
export function getMixGroups(): MixGroup[] {
  const n = chronology();
  const bySlug = new Map(mixes.map(m => [m.slug, m]));

  // flatMap, not map: a slug in FEATURED that no longer exists in the manifest
  // drops out quietly rather than rendering a row with no audio behind it.
  const featured = FEATURED.flatMap(slug => {
    const m = bySlug.get(slug);
    return m ? [hydrate(m, n.get(slug)!)] : [];
  });

  const rest = mixes
    .filter(m => !FEATURED.includes(m.slug))
    .sort((a, b) => b.recorded.localeCompare(a.recorded))
    .map(m => hydrate(m, n.get(m.slug)!));

  return [
    { label: 'Featured', mixes: featured },
    { label: 'More', mixes: rest },
  ].filter(g => g.mixes.length > 0);
}

/** Every mix, for counts and totals. */
export function getAllMixes(): Mix[] {
  return getMixGroups().flatMap(g => g.mixes);
}
