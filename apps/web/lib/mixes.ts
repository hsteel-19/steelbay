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
  n: string;
  slug: string;
  title: string;
  /** When it was recorded, ISO. Sorting key — newest first. */
  recorded: string;
  /** Seconds, measured off the source WAV by scripts/mix-peaks.mjs. */
  duration: number;
  /** Optional one-liner. Left off rather than filled with invented copy. */
  note?: string;
}

export interface Mix extends MixSource {
  audio: string;
  cover: string;
  /** 480 values, 0-100. See scripts/mix-peaks.mjs. */
  peaks: number[];
}

// Add a mix: ./scripts/add-mix.sh <slug> <master.wav> <cover.png> encodes,
// uploads and prints the row to paste in here. Nothing else to touch.
const mixes: MixSource[] = [
  {
    n: '02',
    slug: 'pucken',
    title: 'Pucken',
    recorded: '2025-01-05',
    duration: 4626,
  },
  {
    n: '01',
    slug: 'sten',
    title: 'Sten',
    recorded: '2024-11-23',
    duration: 3599,
  },
];

function readPeaks(slug: string): number[] {
  const file = path.join(PEAKS_DIR, `${slug}.peaks.json`);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Newest first. A mix with no peaks file still lists — it just draws flat. */
export function getMixes(): Mix[] {
  return [...mixes]
    .sort((a, b) => b.recorded.localeCompare(a.recorded))
    .map(m => ({
      ...m,
      audio: `${AUDIO_BASE}/${m.slug}.m4a`,
      cover: `/mixes/${m.slug}.jpg`,
      peaks: readPeaks(m.slug),
    }));
}
