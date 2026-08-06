// Vibe Check tracking began 2026-06-01. Days before that are not "unrecorded" —
// they predate the project, and rendering them as gray invents 5 months of
// missing data that never existed. Every chart clips to this date.
export const TRACKING_START = new Date(2026, 5, 1); // 1 June 2026

/**
 * The window a given year's charts should actually cover.
 * `start` never precedes the day tracking began; `end` is the end of the year
 * so the heatmap can still show the rest of the year as faded future days.
 */
export function trackingWindow(year: number) {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  return {
    start: TRACKING_START > yearStart ? TRACKING_START : yearStart,
    end: yearEnd,
  };
}

/** First month index (0-11) worth charting for a year. */
export function firstTrackedMonth(year: number) {
  return TRACKING_START.getFullYear() === year ? TRACKING_START.getMonth() : 0;
}
