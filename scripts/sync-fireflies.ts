import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { format, getDay } from 'date-fns';

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

async function fetchTodaysTranscripts(dateStr: string) {
  // Fetch recent transcripts and filter client-side by date
  // (Fireflies DateTime API type is ms timestamps — simpler to filter locally)
  const data = await firefliesQuery(
    `query { transcripts(limit: 20) {
      id title date duration organizer_email participants
      sentences { raw_text speaker_name }
    }}`,
    {}
  );
  const all = (data?.transcripts as Record<string, unknown>[]) ?? [];

  // date field is Unix timestamp in milliseconds
  const dayStart = new Date(dateStr + 'T00:00:00').getTime();
  const dayEnd = new Date(dateStr + 'T23:59:59').getTime();

  return all.filter(t => {
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

    // Also catch solo short recordings that talk about the day rating
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
    // Strip markdown code blocks if present
    const raw = content.text.replace(/```(?:json)?\n?/g, '').trim();
    const parsed = JSON.parse(raw) as { rating: string; summary: string };
    const rating = ['green', 'yellow', 'red'].includes(parsed.rating) ? parsed.rating : 'gray';
    return { rating: rating as 'green' | 'yellow' | 'red', summary: parsed.summary };
  } catch {
    console.error('Claude parse failed, raw:', content.text.substring(0, 200));
    return { rating: 'gray' as const, summary: text.substring(0, 400) };
  }
}

async function main() {
  const today = new Date();
  const dayOfWeek = getDay(today);

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    console.log('Weekend — skipping sync');
    return;
  }

  const dateStr = process.env.SYNC_DATE ?? format(today, 'yyyy-MM-dd');
  console.log(`Syncing vibe check for ${dateStr}...`);

  const transcripts = await fetchTodaysTranscripts(dateStr);
  console.log(`Found ${transcripts.length} transcript(s)`);

  const vibeCheck = findVibeCheck(transcripts);

  if (!vibeCheck) {
    console.log('No vibe check found — marking as gray');
    await supabase.from('vibe_checks').upsert(
      { date: dateStr, rating: 'gray', raw_transcript: null, reflection_summary: null, fireflies_id: null, updated_at: new Date().toISOString() },
      { onConflict: 'date' }
    );
    return;
  }

  const title = vibeCheck.title as string;
  const duration = vibeCheck.duration as number;
  console.log(`Found vibe check: "${title}" (${duration.toFixed(1)} min)`);

  const { rating, summary } = await parseRatingAndSummary(vibeCheck);
  const sentences = (vibeCheck.sentences as Array<{ raw_text: string }>) ?? [];
  const rawText = sentences.map(s => s.raw_text).join('\n');

  console.log(`Parsed rating: ${rating}`);

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
    console.error('Supabase error:', error);
    process.exit(1);
  }

  console.log(`Done: ${dateStr} = ${rating}`);
}

main().catch(e => { console.error(e); process.exit(1); });
