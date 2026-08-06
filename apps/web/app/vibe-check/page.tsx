import { supabaseServer } from '@/lib/supabase-server';
import type { VibeCheck, MonthlySummary } from '@/lib/types';
import HeatmapCalendar from '@/components/HeatmapCalendar';
import MonthlyChart from '@/components/MonthlyChart';
import MonthlySummaryCard from '@/components/MonthlySummaryCard';

export const metadata = {
  title: 'Vibe Check',
  robots: { index: false, follow: false },
};

export const revalidate = 3600; // revalidate every hour

async function getData() {
  const year = new Date().getFullYear();

  const [{ data: vibeChecks }, { data: monthlySummaries }] = await Promise.all([
    supabaseServer
      .from('vibe_checks')
      .select('*')
      .gte('date', `${year}-01-01`)
      .lte('date', `${year}-12-31`)
      .order('date', { ascending: true }),
    supabaseServer
      .from('monthly_summaries')
      .select('*')
      .eq('year', year)
      .order('month', { ascending: true }),
  ]);

  return {
    vibeChecks: (vibeChecks ?? []) as VibeCheck[],
    monthlySummaries: (monthlySummaries ?? []) as MonthlySummary[],
    year,
  };
}

export default async function Dashboard() {
  const { vibeChecks, monthlySummaries, year } = await getData();

  // Summaries are generated for *completed* months, so looking up the current
  // month always misses — show the most recent one that actually exists.
  const latestSummary = monthlySummaries.length
    ? monthlySummaries.reduce((a, b) => (b.month > a.month ? b : a))
    : null;

  const greenCount = vibeChecks.filter(v => v.rating === 'green').length;
  const yellowCount = vibeChecks.filter(v => v.rating === 'yellow').length;
  const redCount = vibeChecks.filter(v => v.rating === 'red').length;
  const grayCount = vibeChecks.filter(v => v.rating === 'gray').length;
  const total = greenCount + yellowCount + redCount + grayCount;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Henrik&apos;s Vibe Check
        </h1>
        <p className="text-gray-400 mt-1 text-sm">{year} — daily mood tracking</p>
      </div>

      {/* Year stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Gröna', count: greenCount, color: 'text-green-500' },
          { label: 'Gula', count: yellowCount, color: 'text-yellow-500' },
          { label: 'Röda', count: redCount, color: 'text-red-500' },
          { label: 'Gråa', count: grayCount, color: 'text-gray-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
            <div className={`text-2xl font-bold ${color}`}>{count}</div>
            <div className="text-gray-400 text-xs mt-1">{label} {total > 0 ? `(${Math.round(count / total * 100)}%)` : ''}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <section className="mb-10">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Årsöversikt {year}
        </h2>
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5 overflow-x-auto">
          <HeatmapCalendar vibeChecks={vibeChecks} year={year} />
        </div>
      </section>

      {/* Monthly chart */}
      <section className="mb-10">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Månadsvis fördelning
        </h2>
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
          <MonthlyChart vibeChecks={vibeChecks} year={year} />
        </div>
      </section>

      {/* Monthly AI summary */}
      {latestSummary && (
        <section>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Månadsanalys — {new Date(year, latestSummary.month - 1).toLocaleString('sv-SE', { month: 'long' })}
          </h2>
          <MonthlySummaryCard summary={latestSummary} />
        </section>
      )}
    </main>
  );
}
