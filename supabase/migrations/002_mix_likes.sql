-- Run this in Supabase SQL Editor. Adds real like counts to /music (SB-57).
--
-- Until this runs, the heart still works as a per-device toggle and the API
-- just reports no counts — the page degrades rather than breaking.

CREATE TABLE mix_likes (
  slug TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS on with NO policies: the service key bypasses RLS, everything else is
-- refused. Deliberately unlike the other three tables, which still carry a
-- USING (true) public-read policy (SB-11) — this one is not repeating that.
ALTER TABLE mix_likes ENABLE ROW LEVEL SECURITY;

-- One statement, so two people hearting the same mix at once cannot lose a
-- count the way read-modify-write in the API route would.
CREATE OR REPLACE FUNCTION bump_mix_like(p_slug TEXT, p_delta INT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO mix_likes (slug, count)
  VALUES (p_slug, GREATEST(0, p_delta))
  ON CONFLICT (slug) DO UPDATE
    SET count = GREATEST(0, mix_likes.count + p_delta),
        updated_at = NOW()
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

-- The anon role must not be able to call this directly; the API route holds the
-- service key and is the only caller.
REVOKE EXECUTE ON FUNCTION bump_mix_like(TEXT, INT) FROM anon, authenticated;
