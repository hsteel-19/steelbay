import type { MonthlySummary } from '@/lib/types';

interface Props {
  summary: MonthlySummary;
}

export default function MonthlySummaryCard({ summary }: Props) {
  const total = summary.green_count + summary.yellow_count + summary.red_count + summary.gray_count;

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
      <div className="flex gap-6 mb-5">
        {[
          { label: 'Gröna', count: summary.green_count, color: '#16a34a' },
          { label: 'Gula', count: summary.yellow_count, color: '#ca8a04' },
          { label: 'Röda', count: summary.red_count, color: '#dc2626' },
          { label: 'Gråa', count: summary.gray_count, color: '#374151' },
        ].map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color }} />
            <span className="text-sm text-gray-300">
              {count} {label.toLowerCase()}
              {total > 0 && (
                <span className="text-gray-500 ml-1">({Math.round(count / total * 100)}%)</span>
              )}
            </span>
          </div>
        ))}
      </div>
      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{summary.summary}</p>
    </div>
  );
}
