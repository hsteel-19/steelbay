import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { format, startOfWeek, endOfWeek, subWeeks, getDaysInMonth } from 'date-fns';
import { sv } from 'date-fns/locale';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '.env.local') });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

type Rating = 'green' | 'yellow' | 'red' | 'gray';
interface VibeCheck { date: string; rating: Rating; reflection_summary: string | null; raw_transcript: string | null }

async function generateWeeklySummary() {
  const lastWeekEnd = subWeeks(new Date(), 1);
  const weekStart = format(startOfWeek(lastWeekEnd, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(lastWeekEnd, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  console.log(`Generating weekly summary for ${weekStart} to ${weekEnd}...`);

  const { data: checks } = await supabase
    .from('vibe_checks')
    .select('*')
    .gte('date', weekStart)
    .lte('date', weekEnd)
    .order('date');

  const vibeChecks = (checks ?? []) as VibeCheck[];
  const green = vibeChecks.filter(v => v.rating === 'green').length;
  const yellow = vibeChecks.filter(v => v.rating === 'yellow').length;
  const red = vibeChecks.filter(v => v.rating === 'red').length;
  const gray = vibeChecks.filter(v => v.rating === 'gray').length;

  const reflections = vibeChecks
    .filter(v => v.reflection_summary)
    .map(v => `${v.date} (${v.rating}): ${v.reflection_summary}`)
    .join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `Generera en kort veckosammanfattning (3-5 meningar) på svenska för Henrik baserat på hans daily vibe checks.

Vecka: ${weekStart} till ${weekEnd}
Betyg: ${green} gröna, ${yellow} gula, ${red} röda, ${gray} gråa (ej registrerade)

Reflektioner:
${reflections || '(Inga reflektioner registrerade denna vecka)'}

Fokusera på: vad som verkar driva bra dagar, mönster i vad som påverkat humöret, och en kort uppmuntrande avslutning.`,
    }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response');
  const summary = content.text;

  await supabase.from('weekly_summaries').upsert(
    { week_start: weekStart, week_end: weekEnd, summary, green_count: green, yellow_count: yellow, red_count: red, gray_count: gray },
    { onConflict: 'week_start' }
  );

  console.log(`Weekly summary saved for ${weekStart}`);
  return { green, yellow, red, gray };
}

async function generateMonthlySummaryIfNeeded() {
  const now = new Date();
  // Generate for last month if we're in the first week of a new month
  if (now.getDate() > 7) return;

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = lastMonth.getFullYear();
  const month = lastMonth.getMonth() + 1;
  const monthStart = format(lastMonth, 'yyyy-MM-dd');
  const monthEnd = format(new Date(year, month - 1, getDaysInMonth(lastMonth)), 'yyyy-MM-dd');
  const monthName = format(lastMonth, 'MMMM yyyy', { locale: sv });

  const { data: existing } = await supabase
    .from('monthly_summaries')
    .select('id')
    .eq('year', year)
    .eq('month', month)
    .single();

  if (existing) return;

  console.log(`Generating monthly summary for ${monthName}...`);

  const { data: checks } = await supabase
    .from('vibe_checks')
    .select('*')
    .gte('date', monthStart)
    .lte('date', monthEnd)
    .order('date');

  const vibeChecks = (checks ?? []) as VibeCheck[];
  const green = vibeChecks.filter(v => v.rating === 'green').length;
  const yellow = vibeChecks.filter(v => v.rating === 'yellow').length;
  const red = vibeChecks.filter(v => v.rating === 'red').length;
  const gray = vibeChecks.filter(v => v.rating === 'gray').length;

  const reflections = vibeChecks
    .filter(v => v.reflection_summary)
    .map(v => `${v.date} (${v.rating}): ${v.reflection_summary}`)
    .join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `Generera en månadsanalys på svenska för Henrik baserat på hans daily vibe checks för ${monthName}.

Statistik: ${green} gröna, ${yellow} gula, ${red} röda, ${gray} gråa dagar (${green + yellow + red + gray} totalt)

Alla reflektioner:
${reflections || '(Inga reflektioner registrerade)'}

Analysera:
1. Vad verkar göra att Henrik mår bra (gröna dagar)?
2. Vad verkar ligga bakom gula och röda dagar?
3. Mönster och trender under månaden
4. En kort uppmuntrande avslutning

Skriv ca 150-200 ord i löpande text.`,
    }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response');

  await supabase.from('monthly_summaries').upsert(
    { year, month, summary: content.text, green_count: green, yellow_count: yellow, red_count: red, gray_count: gray },
    { onConflict: 'year, month' }
  );

  console.log(`Monthly summary saved for ${monthName}`);
}

async function main() {
  await generateWeeklySummary();
  await generateMonthlySummaryIfNeeded();
  console.log('Done');
}

main().catch(e => { console.error(e); process.exit(1); });
