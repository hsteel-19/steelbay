import { createClient } from '@supabase/supabase-js';

// Server-side only — uses service role key for admin reads
export const supabaseServer = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
