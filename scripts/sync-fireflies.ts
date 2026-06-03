import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { format, getDay, subDays } from 'date-fns';

config({ path: resolve(__dirname, '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const FIREFLIES_API = 'https://api.fireflies.ai/graphql';

async function firefliesQuery(query: string, variables: Record<string, unknown>) {
  const res = await fetch(FIREFLIES_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FIREFLIES_API_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json() as { data?: Record<string, unknown>; errors?: unknown[] };
  if (json.errors) console.error('Fireflies API errors:', json.errors);
  return json.data;
}

async function fetchTranscriptsForDate(dateStr: string, allTranscripts: Record<string, unknown>[]) {
  const dayStart = new Date(dateStr + 'T00:00:00Z').getTime();
  const dayEnd = new Date(dateStr + 'T23:59:59Z').getTime();

  return allTranscripts.filter(t => {
    const ts = t.date as number;
    return ts >= dayStart && ts <= dayEnd;
  });
}

function findVibeCheck(transcripts: Record<string, unknown>[]) {
  for (const t of transcripts) {
    const title = ((t.title as string) ?? '').toLowerCase();
    const sentences = (t.sentences as Array<{ raw_text: string }>) ?? [];
    const text = sentences.map(s => s.raw_text).join(' ').toLowerCase();
    const participants = (t.participants as string[]) ?? [];
    const duration = t.duration as number;

    const isVibe =
      title.includes('vibe check') ||
      text.includes('vibe check') ||
      text.includes('daily vibe');

    const isSoloShort =
      participants.length <= 1 &&
      duration < 15 &&
      (text.includes('grön') || text.includes('gul') || text.includes('röd'));

    if (isVibe || isSoloShort) return t;
  }
  return null;
}

async function parseRatingAndSummary(transcript: Record<string, unknown>) {
  const sentences = (transcript.sentences as Array<{ raw_text: string }>) ?? [];
  const text = sentences.map(s => s.raw_text).join(' ');

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `This is a daily vibe check recording from Henrik. Extract the rating and write a brief summary.

Transcript:
${text}

Rating scale: green (grön/grön plupp = bra dag), yellow (gul/gul plupp = okej dag), red (röd/röd plupp = dålig dag).

Respond with ONLY a raw JSON object (no markdown, no code blocks):
{"rating": "green", "summary": "2-3 meningar på svenska om varför Henrik gav detta betyg"}`,
    }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  try {
    const raw = content.text.replace(/```(?:json)?\n?/g, '').trim();
    const parsed = JSON.parse(raw) as { rating: string; summary: string };
    const rating = ['green', 'yellow', 'red'].includes(parsed.rating) ? parsed.rating : 'gray';
    return { rating: rating as 'green' | 'yellow' | 'red', summary: parsed.summary };
  } catch {
    console.error('Claude parse failed, raw:', content.text.substring(0, 200));
    return { rating: 'gray' as const, summary: text.substring(0, 400) };
  }
}

async function syncDate(dateStr: string, allTranscripts: Record<string, unknown>[]) {
  const transcripts = await fetchTranscriptsForDate(dateStr, allTranscripts);
  const vibeCheck = findVibeCheck(transcripts);

  if (!vibeCheck) {
    console.log(`${dateStr}: no vibe check found — marking gray`);
    await supabase.from('vibe_checks').upsert(
      { date: dateStr, rating: 'gray', raw_transcript: null, reflection_summary: null, fireflies_id: null, updated_at: new Date().toISOString() },
      { onConflict: 'date' }
    );
    return;
  }

  const title = vibeCheck.title as string;
  const duration = vibeCheck.duration as number;
  console.log(`${dateStr}: found "${title}" (${duration.toFixed(1)} min)`);

  const { rating, summary } = await parseRatingAndSummary(vibeCheck);
  const sentences = (vibeCheck.sentences as Array<{ raw_text: string }>) ?? [];
  const rawText = sentences.map(s => s.raw_text).join('\n');

  const { error } = await supabase.from('vibe_checks').upsert(
    {
      date: dateStr,
      rating,
      raw_transcript: rawText,
      reflection_summary: summary,
      fireflies_id: vibeCheck.id as string,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'date' }
  );

  if (error) {
    console.error(`${dateStr}: Supabase error:`, error);
    throw error;
  }

  console.log(`${dateStr}: saved as ${rating}`);
}

function validateEnv() {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'FIREFLIES_API_KEY', 'ANTHROPIC_API_KEY'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
}

async function main() {
  validateEnv();

  // Fetch last 30 transcripts once (covers ~2 weeks of daily recordings)
  const data = await firefliesQuery(
    `query { transcripts(limit: 30) {
      id title date duration organizer_email participants
      sentences { raw_text speaker_name }
    }}`,
    {}
  );
  const allTranscripts = (data?.transcripts as Record<string, unknown>[]) ?? [];
  console.log(`Fetched ${allTranscripts.length} recent transcripts from Fireflies`);

  // Check the last 7 calendar days and sync any missing weekdays
  const today = new Date();
  const datesToCheck: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = subDays(today, i);
    const dow = getDay(d);
    if (dow !== 0 && dow !== 6) {
      datesToCheck.push(format(d, 'yyyy-MM-dd'));
    }
  }

  // Find which of these dates are already in Supabase with a real rating
  const { data: existing } = await supabase
    .from('vibe_checks')
    .select('date, rating')
    .in('date', datesToCheck);

  const alreadySynced = new Set(
    (existing ?? [])
      .filter(r => r.rating !== 'gray')
      .map(r => r.date)
  );

  // Today is always re-synced (recording may have happened today after a gray was saved)
  const todayStr = format(today, 'yyyy-MM-dd');
  alreadySynced.delete(todayStr);

  const toSync = datesToCheck.filter(d => !alreadySynced.has(d));
  console.log(`Dates to sync: ${toSync.join(', ') || 'none'}`);

  for (const dateStr of toSync) {
    await syncDate(dateStr, allTranscripts);
  }

  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
