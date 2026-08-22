-- Run this in Supabase SQL Editor. Adds like and play counts to /music.
-- Safe to re-run: every statement is idempotent.
--
-- One table for both counters rather than two, so this is a single migration
-- and a mix's stats are one row. Until it runs, /music degrades quietly —
-- hearts stay a per-device toggle and no counts are shown. Nothing errors and
-- nothing needs redeploying afterwards.

CREATE TABLE IF NOT EXISTS mix_stats (
  slug TEXT PRIMARY KEY,
  likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
  plays INTEGER NOT NULL DEFAULT 0 CHECK (plays >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS on with NO policies: the service key bypasses RLS and everything else is
-- refused. Deliberately unlike the three vibe-check tables, which still carry a
-- USING (true) public-read policy (SB-11) — this one does not repeat that.
ALTER TABLE mix_stats ENABLE ROW LEVEL SECURITY;

-- Both counters move in a single statement, so two people hearting or playing
-- the same mix at the same moment cannot lose a count the way a read-then-write
-- in the API route would.
CREATE OR REPLACE FUNCTION bump_mix_like(p_slug TEXT, p_delta INT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO mix_stats (slug, likes)
  VALUES (p_slug, GREATEST(0, p_delta))
  ON CONFLICT (slug) DO UPDATE
    SET likes = GREATEST(0, mix_stats.likes + p_delta),
        updated_at = NOW()
  RETURNING likes INTO new_count;
  RETURN new_count;
END;
$$;

CREATE OR REPLACE FUNCTION bump_mix_play(p_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO mix_stats (slug, plays)
  VALUES (p_slug, 1)
  ON CONFLICT (slug) DO UPDATE
    SET plays = mix_stats.plays + 1,
        updated_at = NOW()
  RETURNING plays INTO new_count;
  RETURN new_count;
END;
$$;

-- Only the API routes may call these, and they hold the service key. The
-- browser never gets a Supabase credential.
REVOKE EXECUTE ON FUNCTION bump_mix_like(TEXT, INT) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION bump_mix_play(TEXT) FROM anon, authenticated;
