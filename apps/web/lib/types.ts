export type Rating = 'green' | 'yellow' | 'red' | 'gray';

export interface VibeCheck {
  id: string;
  date: string;
  rating: Rating;
  raw_transcript: string | null;
  reflection_summary: string | null;
  fireflies_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonthlySummary {
  id: string;
  year: number;
  month: number;
  summary: string;
  green_count: number;
  yellow_count: number;
  red_count: number;
  gray_count: number;
  created_at: string;
}

export interface WeeklySummary {
  id: string;
  week_start: string;
  week_end: string;
  summary: string;
  green_count: number;
  yellow_count: number;
  red_count: number;
  gray_count: number;
  created_at: string;
}

export interface MonthStats {
  year: number;
  month: number;
  green: number;
  yellow: number;
  red: number;
  gray: number;
}
