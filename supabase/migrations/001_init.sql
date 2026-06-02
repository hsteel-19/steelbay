-- Run this in Supabase SQL Editor to initialize the database

CREATE TABLE vibe_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  rating TEXT NOT NULL DEFAULT 'gray' CHECK (rating IN ('green', 'yellow', 'red', 'gray')),
  raw_transcript TEXT,
  reflection_summary TEXT,
  fireflies_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX vibe_checks_date_idx ON vibe_checks(date DESC);

CREATE TABLE weekly_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE NOT NULL UNIQUE,
  week_end DATE NOT NULL,
  summary TEXT NOT NULL,
  green_count INT NOT NULL DEFAULT 0,
  yellow_count INT NOT NULL DEFAULT 0,
  red_count INT NOT NULL DEFAULT 0,
  gray_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE monthly_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INT NOT NULL,
  month INT NOT NULL,
  summary TEXT NOT NULL,
  green_count INT NOT NULL DEFAULT 0,
  yellow_count INT NOT NULL DEFAULT 0,
  red_count INT NOT NULL DEFAULT 0,
  gray_count INT NOT NULL DEFAULT 0,
  UNIQUE(year, month),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE vibe_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_summaries ENABLE ROW LEVEL SECURITY;

-- Allow public reads (anon key can read the dashboard data)
CREATE POLICY "Allow public read" ON vibe_checks FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON weekly_summaries FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON monthly_summaries FOR SELECT USING (true);
-- Writes only via service_role key (GitHub Actions) which bypasses RLS
