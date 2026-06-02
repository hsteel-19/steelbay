import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { format, getDay } from 'date-fns';

const __dirname = dirname(fileURLToPath(import.meta.url));
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
  const data = await firefliesQuery(
    `query($fromDate: String, $toDate: String) {
      transcripts(fromDate: $fromDate, toDate: $toDate, limit: 20) {
        id title date duration organizer_email participants
        sentences { raw_text speaker_name }
      }
    }`,
    { fromDate: dateStr, toDate: dateStr }
  );
  return (data?.transcripts as Record<string, unknown>[]) ?? [];
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
      content: `This is a daily vibe check recording transcript from Henrik. Extract the rating and write a brief summary in Swedish.

Transcript:
${text}

Rating scale: green (grön = bra dag), yellow (gul = okej dag), red (röd = dålig dag).
Look for words like: grön, gul, röd, grön plupp, gul plupp, röd plupp, bra dag, okej dag, dålig dag.

Return JSON only:
{"rating": "green|yellow|red", "summary": "2-3 meningar på svenska om varför Henrik gav detta betyg"}`,
    }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  try {
    const parsed = JSON.parse(content.text) as { rating: string; summary: string };
    const rating = ['green', 'yellow', 'red'].includes(parsed.rating) ? parsed.rating : 'gray';
    return { rating: rating as 'green' | 'yellow' | 'red', summary: parsed.summary };
  } catch {
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

  const dateStr = format(today, 'yyyy-MM-dd');
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
