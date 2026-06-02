'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import type { VibeCheck } from '@/lib/types';

interface Props {
  vibeChecks: VibeCheck[];
  year: number;
}

const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2024, i, 1), 'MMM', { locale: sv })
);

export default function MonthlyChart({ vibeChecks, year }: Props) {
  const data = MONTH_NAMES.map((name, monthIdx) => {
    const monthChecks = vibeChecks.filter(v => {
      const date = new Date(v.date);
      return date.getFullYear() === year && date.getMonth() === monthIdx;
    });
    return {
      month: name,
      Grön: monthChecks.filter(v => v.rating === 'green').length,
      Gul: monthChecks.filter(v => v.rating === 'yellow').length,
      Röd: monthChecks.filter(v => v.rating === 'red').length,
      Grå: monthChecks.filter(v => v.rating === 'gray').length,
    };
  });

  const hasData = data.some(d => d.Grön + d.Gul + d.Röd + d.Grå > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
        Ingen data ännu
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="month"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#e5e7eb', fontWeight: 600 }}
          itemStyle={{ color: '#d1d5db' }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#9ca3af', paddingTop: 8 }}
        />
        <Bar dataKey="Grön" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Gul" stackId="a" fill="#ca8a04" />
        <Bar dataKey="Röd" stackId="a" fill="#dc2626" />
        <Bar dataKey="Grå" stackId="a" fill="#374151" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
