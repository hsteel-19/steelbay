'use client';

import { useState } from 'react';
import { format, startOfYear, eachDayOfInterval, getDay, isWeekend, isFuture, isToday } from 'date-fns';
import { sv } from 'date-fns/locale';
import type { VibeCheck, Rating } from '@/lib/types';
import DayModal from './DayModal';

const RATING_COLORS: Record<Rating, string> = {
  green: '#16a34a',
  yellow: '#ca8a04',
  red: '#dc2626',
  gray: '#374151',
};

const RATING_LABELS: Record<Rating, string> = {
  green: 'Grön — bra dag',
  yellow: 'Gul — okej dag',
  red: 'Röd — dålig dag',
  gray: 'Grå — inget registrerat',
};

const DAY_LABELS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];

interface Props {
  vibeChecks: VibeCheck[];
  year: number;
}

export default function HeatmapCalendar({ vibeChecks, year }: Props) {
  const [selectedDay, setSelectedDay] = useState<VibeCheck | null>(null);

  const checkMap = new Map(vibeChecks.map(v => [v.date, v]));

  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = new Date(year, 11, 31);
  const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });

  // Build week columns: each column = one week, rows = Mon(1)-Fri(5)
  // weekIndex starts at 0. dayOfWeek: Mon=1,Tue=2,Wed=3,Thu=4,Fri=5
  const weeks: Array<Array<{ date: Date; dateStr: string } | null>> = [];
  let currentWeek: Array<{ date: Date; dateStr: string } | null> = [];

  // Start the first week: pad Mon if year doesn't start on Monday
  const firstWeekday = getDay(yearStart); // 0=Sun, 1=Mon, ..., 6=Sat
  const mondayOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;
  for (let i = 0; i < mondayOffset; i++) currentWeek.push(null);

  for (const day of allDays) {
    if (isWeekend(day)) continue;
    const dow = getDay(day); // 1=Mon ... 5=Fri
    const slot = dow === 0 ? 6 : dow - 1; // 0=Mon ... 4=Fri

    if (slot === 0 && currentWeek.length > 0) {
      while (currentWeek.length < 5) currentWeek.push(null);
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push({ date: day, dateStr: format(day, 'yyyy-MM-dd') });
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 5) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  // Month label positions: which week index each month first appears
  const monthLabels: Array<{ weekIdx: number; label: string }> = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIdx) => {
    const firstDay = week.find(d => d !== null);
    if (!firstDay) return;
    const month = firstDay.date.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ weekIdx, label: format(firstDay.date, 'MMM', { locale: sv }) });
      lastMonth = month;
    }
  });

  const cellSize = 13;
  const gap = 3;
  const rowLabelWidth = 28;

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'inline-block', minWidth: 'max-content' }}>
          {/* Month labels */}
          <div style={{ display: 'flex', marginLeft: rowLabelWidth, marginBottom: 4, position: 'relative', height: 16 }}>
            {monthLabels.map(({ weekIdx, label }) => (
              <span
                key={label}
                style={{
                  position: 'absolute',
                  left: weekIdx * (cellSize + gap),
                  fontSize: 11,
                  color: '#9ca3af',
                  whiteSpace: 'nowrap',
                  textTransform: 'capitalize',
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'flex', gap: gap }}>
            {/* Row labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap, width: rowLabelWidth - gap }}>
              {DAY_LABELS.map(label => (
                <div
                  key={label}
                  style={{
                    height: cellSize,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 10,
                    color: '#6b7280',
                    justifyContent: 'flex-end',
                    paddingRight: 4,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap }}>
                {week.map((day, rowIdx) => {
                  if (!day) {
                    return <div key={rowIdx} style={{ width: cellSize, height: cellSize }} />;
                  }

                  const check = checkMap.get(day.dateStr);
                  const future = isFuture(day.date) && !isToday(day.date);
                  const today = isToday(day.date);

                  let bg = '#1f2937'; // no data yet (future/unrecorded)
                  if (check) bg = RATING_COLORS[check.rating];
                  else if (!future) bg = RATING_COLORS.gray;

                  return (
                    <div
                      key={rowIdx}
                      title={
                        check
                          ? `${day.dateStr} — ${RATING_LABELS[check.rating]}`
                          : `${day.dateStr}${future ? ' (framtida)' : ' (inget registrerat)'}`
                      }
                      onClick={() => check && setSelectedDay(check)}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        borderRadius: 2,
                        backgroundColor: bg,
                        cursor: check ? 'pointer' : 'default',
                        opacity: future ? 0.2 : 1,
                        outline: today ? '2px solid white' : undefined,
                        outlineOffset: today ? 1 : undefined,
                        transition: 'transform 0.1s',
                      }}
                      onMouseEnter={e => { if (check) (e.target as HTMLElement).style.transform = 'scale(1.3)'; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, marginLeft: rowLabelWidth }}>
            {Object.entries(RATING_COLORS).map(([rating, color]) => (
              <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color }} />
                <span style={{ fontSize: 10, color: '#9ca3af' }}>
                  {RATING_LABELS[rating as Rating].split(' — ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDay && (
        <DayModal vibeCheck={selectedDay} onClose={() => setSelectedDay(null)} />
      )}
    </>
  );
}
