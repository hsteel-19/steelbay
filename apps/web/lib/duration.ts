/**
 * Kept out of lib/mixes.ts on purpose: that module imports `fs` at the top
 * level, and the player is a client component. Importing a duration formatter
 * should not drag Node's filesystem into the browser bundle.
 */

/** 3599 -> "59:59", 4626 -> "1:17:06". */
export function formatDuration(seconds: number): string {
  const s = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}
