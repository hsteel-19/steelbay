'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Mix, MixGroup } from '@/lib/mixes';
import { formatDuration } from '@/lib/duration';

/**
 * One <audio> element for the whole list, not one per row. Two mixes must never
 * play at once, and swapping `src` on a single element is the only way to get
 * that for free — a per-row element leaves you reconciling N players by hand.
 */

const BARS = 480;

/**
 * Mastered DJ mixes are compressed to within an inch of their lives: the raw
 * peaks sit between 60 and 100 almost the whole way through, which draws as a
 * solid block. Squaring the normalised value pushes the quiet parts down far
 * enough that the shape of the set is actually visible. The stored peaks stay
 * honest; only the drawing is curved.
 */
function barHeight(peak: number): number {
  const v = Math.min(100, Math.max(0, peak)) / 100;
  return Math.max(2.5, v * v * 92);
}

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

const LIKES_KEY = 'steelbay:mix-likes';

function readLikes(): string[] {
  try {
    const raw = window.localStorage.getItem(LIKES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : [];
  } catch {
    // Private-mode Safari throws on localStorage. A broken heart button is not
    // worth taking the page down for.
    return [];
  }
}

export default function MixPlayer({ groups }: { groups: MixGroup[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [time, setTime] = useState(0);
  const [likes, setLikes] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Two different facts, stored in two different places. WHETHER YOU liked a
  // mix is localStorage, per device — there are no accounts here. HOW MANY
  // people liked it is a global count on the server. Neither can stand in for
  // the other.
  useEffect(() => setLikes(readLikes()), []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/mixes/likes')
      .then(r => r.json())
      .then(({ counts }) => {
        if (!cancelled && counts) setCounts(counts);
      })
      // A failed count fetch must not break playback, which is the point of the
      // page. The hearts simply show no number.
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleLike = useCallback(
    (slug: string) => {
      const liked = likes.includes(slug);
      const delta = liked ? -1 : 1;
      const next = liked ? likes.filter(s => s !== slug) : [...likes, slug];

      setLikes(next);
      try {
        window.localStorage.setItem(LIKES_KEY, JSON.stringify(next));
      } catch {
        /* private-mode Safari; the in-memory state still flips for this session */
      }

      // Move the number immediately, then let the server's answer replace it.
      // The count is authoritative, so a rejected write has to put it back.
      setCounts(prev => ({ ...prev, [slug]: Math.max(0, (prev[slug] ?? 0) + delta) }));

      fetch('/api/mixes/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, delta }),
      })
        .then(r => (r.ok ? r.json() : Promise.reject(new Error('rejected'))))
        .then(({ count }) => {
          if (typeof count === 'number') setCounts(prev => ({ ...prev, [slug]: count }));
        })
        .catch(() => {
          setCounts(prev => ({ ...prev, [slug]: Math.max(0, (prev[slug] ?? 0) - delta) }));
        });
    },
    [likes],
  );

  /** Start `mix` at `seek` seconds, switching source if it is not already loaded. */
  const play = useCallback(
    (mix: Mix, seek?: number) => {
      const el = audioRef.current;
      if (!el) return;

      if (activeSlug !== mix.slug) {
        el.src = mix.audio;
        setActiveSlug(mix.slug);
        setTime(seek ?? 0);
        setStatus('loading');
        // The source is not seekable until metadata lands, so the requested
        // offset has to wait for it rather than being set here.
        if (seek) {
          const onReady = () => {
            el.currentTime = seek;
            el.removeEventListener('loadedmetadata', onReady);
          };
          el.addEventListener('loadedmetadata', onReady);
        }
      } else if (seek !== undefined) {
        el.currentTime = seek;
        setTime(seek);
      }

      el.play().catch(() => setStatus('error'));
    },
    [activeSlug],
  );

  const toggle = useCallback(
    (mix: Mix) => {
      const el = audioRef.current;
      if (!el) return;
      if (activeSlug === mix.slug && !el.paused) {
        el.pause();
      } else {
        play(mix);
      }
    },
    [activeSlug, play],
  );

  const seek = useCallback(
    (mix: Mix, seconds: number) => {
      const target = Math.min(mix.duration, Math.max(0, seconds));
      if (activeSlug === mix.slug && audioRef.current) {
        audioRef.current.currentTime = target;
        setTime(target);
      } else {
        // Clicking the waveform of a mix that is not loaded starts it there,
        // which is what a scrub bar looks like it should do.
        play(mix, target);
      }
    },
    [activeSlug, play],
  );

  return (
    <div>
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => setStatus('playing')}
        onPause={() => setStatus(s => (s === 'error' ? s : 'paused'))}
        onWaiting={() => setStatus('loading')}
        onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
        onError={() => setStatus('error')}
        onEnded={() => {
          setStatus('paused');
          setTime(0);
        }}
      />

      {/* Groups are rendered here rather than as separate <MixPlayer>s per
          section, because a second player means a second <audio> and two mixes
          playing over each other. */}
      {groups.map((group, gi) => (
        <section key={group.label} className={gi > 0 ? 'mt-16' : undefined}>
          <h2 className="rail-label">{group.label}</h2>
          <div className="mt-4">
            {group.mixes.map(mix => (
              <MixRow
                key={mix.slug}
                mix={mix}
                active={activeSlug === mix.slug}
                status={activeSlug === mix.slug ? status : 'idle'}
                time={activeSlug === mix.slug ? time : 0}
                liked={likes.includes(mix.slug)}
                count={counts[mix.slug] ?? 0}
                onToggle={() => toggle(mix)}
                onSeek={s => seek(mix, s)}
                onLike={() => toggleLike(mix.slug)}
              />
            ))}
            <div className="rule" />
          </div>
        </section>
      ))}
    </div>
  );
}

interface RowProps {
  mix: Mix;
  active: boolean;
  status: Status;
  time: number;
  liked: boolean;
  count: number;
  onToggle: () => void;
  onSeek: (seconds: number) => void;
  onLike: () => void;
}

function MixRow({ mix, active, status, time, liked, count, onToggle, onSeek, onLike }: RowProps) {
  const playing = active && status === 'playing';
  const loading = active && status === 'loading';
  const failed = active && status === 'error';
  const progress = mix.duration > 0 ? Math.min(1, time / mix.duration) : 0;
  const peaks = mix.peaks.length ? mix.peaks : new Array(BARS).fill(0);

  const onWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek(((e.clientX - rect.left) / rect.width) * mix.duration);
  };

  const onWaveformKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 60 : 15;
    if (e.key === 'ArrowRight') onSeek(time + step);
    else if (e.key === 'ArrowLeft') onSeek(time - step);
    else if (e.key === 'Home') onSeek(0);
    else if (e.key === 'End') onSeek(mix.duration - 1);
    else if (e.key === ' ' || e.key === 'Enter') onToggle();
    else return;
    e.preventDefault();
  };

  const clipId = `played-${mix.slug}`;

  return (
    <article className="rule py-7">
      <div className="flex items-start gap-4 sm:gap-8">
        <span className="meta shrink-0 pt-1 hidden sm:block">{mix.n}</span>

        <Image
          src={mix.cover}
          alt={`Cover art for ${mix.title}`}
          width={800}
          height={800}
          sizes="(min-width: 640px) 8rem, 5rem"
          className="w-16 h-16 sm:w-32 sm:h-32 shrink-0 object-cover border border-[var(--rule)]"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="subdisplay">{mix.title}</h3>
            <span className="rail-label">Hempi</span>
          </div>

          <div className="mt-1 flex items-baseline gap-4 flex-wrap">
            <span className="meta">
              {new Date(mix.recorded).toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="meta">{formatDuration(mix.duration)}</span>
            {loading && <span className="rail-label">Loading</span>}
            {failed && <span className="rail-label text-[var(--color-red)]">Unavailable</span>}
          </div>

          {mix.note && (
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--muted)] max-w-[34rem]">
              {mix.note}
            </p>
          )}

          {/* One line on desktop. On mobile the waveform wraps to a line of its
              own — sharing the row with the buttons left it 111px wide, which is
              neither readable as a waveform nor usable as a scrub target. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
            <button
              type="button"
              onClick={onToggle}
              aria-label={`${playing ? 'Pause' : 'Play'} ${mix.title}`}
              className="shrink-0 w-11 h-11 flex items-center justify-center border border-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              style={
                playing
                  ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }
                  : undefined
              }
            >
              {playing ? (
                <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
                  <rect x="0" y="0" width="4" height="14" fill="var(--paper)" />
                  <rect x="8" y="0" width="4" height="14" fill="var(--paper)" />
                </svg>
              ) : (
                <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
                  <path d="M0 0 L12 7 L0 14 Z" fill="currentColor" />
                </svg>
              )}
            </button>

            {/* A slider, not a button: it has a position and arrow keys move it. */}
            <div
              role="slider"
              tabIndex={0}
              aria-label={`Seek within ${mix.title}`}
              aria-valuemin={0}
              aria-valuemax={mix.duration}
              aria-valuenow={Math.floor(time)}
              aria-valuetext={`${formatDuration(time)} of ${formatDuration(mix.duration)}`}
              onClick={onWaveformClick}
              onKeyDown={onWaveformKey}
              className="order-last basis-full sm:order-none sm:basis-0 sm:flex-1 min-w-0 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
            >
              <svg
                viewBox={`0 0 ${BARS} 100`}
                preserveAspectRatio="none"
                className="w-full h-12 sm:h-16 block"
                aria-hidden="true"
              >
                <defs>
                  <clipPath id={clipId}>
                    <rect x="0" y="0" width={BARS * progress} height="100" />
                  </clipPath>
                </defs>
                {/* --rule is for hairlines; at 1px-of-structure weight the waveform
                    vanished against the dark paper. The waveform is content, so it
                    gets --muted, which is the lightest thing on the page that still
                    reads as text-weight rather than as a border. */}
                <g fill="var(--muted)">
                  {peaks.map((p, i) => {
                    const h = barHeight(p);
                    return <rect key={i} x={i + 0.15} y={50 - h / 2} width={0.7} height={h} />;
                  })}
                </g>
                <g fill="var(--accent)" clipPath={`url(#${clipId})`}>
                  {peaks.map((p, i) => {
                    const h = barHeight(p);
                    return <rect key={i} x={i + 0.15} y={50 - h / 2} width={0.7} height={h} />;
                  })}
                </g>
              </svg>
            </div>

            <span className="meta shrink-0 tabular-nums ml-auto sm:ml-0">
              {active ? formatDuration(time) : '0:00'}
            </span>

            <button
              type="button"
              onClick={onLike}
              aria-pressed={liked}
              aria-label={
                liked ? `Unlike ${mix.title}` : `Like ${mix.title}`
              }
              className="shrink-0 h-11 pl-2 flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              style={liked ? { color: 'var(--accent)' } : undefined}
            >
              <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true">
                <path
                  d="M9 15 L1.9 8.2 A4.1 4.1 0 0 1 9 3.4 A4.1 4.1 0 0 1 16.1 8.2 Z"
                  fill={liked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              {/* A zero is not worth printing, and reads as a scoreboard nobody
                  is on. The number appears once there is one. */}
              <span className="meta tabular-nums w-3 text-left" style={{ color: 'inherit' }}>
                {count > 0 ? count : ''}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
