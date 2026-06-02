'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import type { VibeCheck, Rating } from '@/lib/types';

const RATING_EMOJI: Record<Rating, string> = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
  gray: '⬜',
};

const RATING_LABEL: Record<Rating, string> = {
  green: 'Bra dag',
  yellow: 'Okej dag',
  red: 'Dålig dag',
  gray: 'Inget registrerat',
};

const RATING_COLOR: Record<Rating, string> = {
  green: '#16a34a',
  yellow: '#ca8a04',
  red: '#dc2626',
  gray: '#6b7280',
};

interface Props {
  vibeCheck: VibeCheck;
  onClose: () => void;
}

export default function DayModal({ vibeCheck, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const date = new Date(vibeCheck.date + 'T12:00:00');
  const formattedDate = format(date, "EEEE d MMMM yyyy", { locale: sv });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-xl border border-white/10 max-w-lg w-full p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider capitalize">{formattedDate}</p>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ color: RATING_COLOR[vibeCheck.rating] }} className="font-semibold text-lg">
                {RATING_EMOJI[vibeCheck.rating]} {RATING_LABEL[vibeCheck.rating]}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {vibeCheck.reflection_summary && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Sammanfattning</p>
            <p className="text-gray-200 text-sm leading-relaxed">{vibeCheck.reflection_summary}</p>
          </div>
        )}

        {vibeCheck.raw_transcript && (
          <details className="group">
            <summary className="text-xs text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-400 select-none">
              Visa hela reflektionen
            </summary>
            <div className="mt-3 p-3 bg-black/30 rounded-lg border border-white/5">
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {vibeCheck.raw_transcript}
              </p>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
