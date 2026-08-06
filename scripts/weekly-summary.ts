import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { format, startOfWeek, endOfWeek, subWeeks, getDaysInMonth } from 'date-fns';
import { sv } from 'date-fns/locale';

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

  const withReflection = vibeChecks.filter(v => v.reflection_summary).length;
  const totalDays = green + yellow + red + gray;

  const reflections = vibeChecks
    .filter(v => v.reflection_summary)
    .map(v => `${v.date} (${v.rating}): ${v.reflection_summary}`)
    .join('\n');

  const response = await anthropic.messages.create({
    // Sonnet, not Haiku: this runs once a month, so the cost is negligible, and
    // the Swedish prose and pattern-finding are noticeably better.
    model: 'claude-sonnet-5',
    max_tokens: 1600,
    messages: [{
      role: 'user',
      content: `Generera en månadsanalys på svenska för Henrik baserat på hans daily vibe checks för ${monthName}.

Statistik: ${green} gröna, ${yellow} gula, ${red} röda, ${gray} gråa dagar (${green + yellow + red + gray} totalt)
Antal dagar med faktisk reflektion: ${withReflection} av ${totalDays}

Alla reflektioner:
${reflections || '(Inga reflektioner registrerade)'}

Använd exakt dessa fyra rubriker, var och en på egen rad, med brödtexten på raderna under:

Månaden i korthet
  Hur månaden såg ut överlag.
Det som lyfte
  Vad som konkret verkar ligga bakom de gröna dagarna. Referera till faktiska reflektioner.
Det som tyngde
  Vad som konkret verkar ligga bakom gula och röda dagar. Om det inte finns underlag, säg det rakt ut.
Inför nästa månad
  2-4 konkreta saker Henrik kan göra eller tänka på för att få fler gröna dagar. Ska följa av
  mönstren ovan, inte vara allmänna livsråd. Skriv varje punkt på egen rad inledd med "- ".

Regler:
- INGEN markdown. Använd aldrig #, *, ** eller liknande tecken. Rubrikerna skrivs som ren text
  på egen rad, exakt som de står ovan. Endast punktlistan under sista rubriken inleds med "- ".
- Bygg ENDAST på reflektionerna ovan. Hitta inte på mönster som inte finns i underlaget.
- ${withReflection < 8 ? `VIKTIGT: bara ${withReflection} dagar har reflektioner denna månad. Det är för lite för att dra säkra slutsatser. Säg det tydligt i "Månaden i korthet", håll analysen kort, och undvik att presentera svaga observationer som mönster.` : 'Underlaget räcker för att peka ut mönster, men var tydlig med vad som är observation och vad som är gissning.'}
- Gråa dagar betyder "ingen inspelning gjord", inte "dålig dag". Tolka dem aldrig som humör.
- Skriv direkt till Henrik, du-tilltal. Ingen peppig avslutningsfras.
- Totalt ca 250-350 ord.`,
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

function validateEnv() {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'ANTHROPIC_API_KEY'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
}

async function main() {
  validateEnv();
  await generateWeeklySummary();
  await generateMonthlySummaryIfNeeded();
  console.log('Done');
}

main().catch(e => { console.error(e); process.exit(1); });
