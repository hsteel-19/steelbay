# steelbay.io

Henrik Ståhle's personal site — a portfolio and home for the things he builds.
One Next.js app, one repo, one Vercel project. Each "project" on the site is a
**route, not a separate codebase**.

**Start every session by reading `BACKLOG.md`.** It is the prioritized source of
truth for what to work on, with stable ticket IDs (`SB-n`).

## Structure

```
apps/web/              — the site (Next.js App Router → Vercel)
  app/
    page.tsx           — landing page
    vibe-check/        — mood dashboard, gated
    unlock/            — six-digit code entry
    api/unlock/        — verifies the code, sets the cookie
  components/          — dashboard UI
  lib/                 — supabase clients, auth helpers
  middleware.ts        — gates /vibe-check
scripts/               — automation, run by GitHub Actions
  sync-fireflies.ts    — weekdays: fetch transcript, parse, upsert
  weekly-summary.ts    — Sundays: weekly + monthly AI analysis
supabase/migrations/   — database schema
transcripts/           — raw exported transcripts (reference/backup)
.github/workflows/     — cron jobs
BACKLOG.md             — epics and tickets
```

## Tech stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind
- **Database**: Supabase (PostgreSQL), project "Henriks daily vibe check", EU region
- **Hosting**: Vercel. Canonical domain is `www.steelbay.io` (apex 308-redirects to www).
  Domain registered at GoDaddy, DNS → `cname.vercel-dns.com`
- **Automation**: GitHub Actions cron
- **AI**: Claude API for parsing transcripts and generating summaries
- **Source**: Fireflies API (GraphQL), account henrik.stahle@stardustconsulting.se
- **Repo**: `github.com/hsteel-19/steelbay` (renamed from `vibe-check`, Aug 2026)

## Access control

`/vibe-check` is private. `middleware.ts` checks for a cookie holding
`VIBE_CHECK_SECRET`; without it, requests redirect to `/unlock`, where the
six-digit `VIBE_CHECK_CODE` is entered. The cookie holds the secret, never the
code, and is httpOnly + Secure + SameSite=lax, 30 days.

- **Fails closed** — returns 503 rather than serving the dashboard if either env
  var is missing. A 503 on `/vibe-check` almost always means the running deploy
  was built before the env vars were saved.
- Vercel bakes env vars into Edge Middleware **at build time**. After changing
  them, redeploy with **build cache disabled**, or the middleware keeps the old values.
- Rotating `VIBE_CHECK_SECRET` logs out every device.

## Vibe Check (the product)

Henrik records a short Fireflies reflection each weekday, rated green/yellow/red.

- **Trigger phrase**: "Daily Vibe Check" + rating (grön/gul/röd)
- Sync searches Fireflies for short (<10 min) solo recordings containing "vibe check"
- Rating spoken as "grön/grön plupp", "gul", "röd" — Claude extracts it
- A weekday with no transcript is stored explicitly as `gray`, not left absent
- Weekends are not tracked, by design

**Tables**: `vibe_checks` (date, rating, raw_transcript, reflection_summary,
fireflies_id), `weekly_summaries`, `monthly_summaries`.

**Dashboard**: heatmap calendar (weekdays only), day modal with the full
reflection, monthly chart, monthly AI summary, and seasonal trends that get more
useful as history accumulates.

## Automation schedule

- **Weekdays 22:00 CET** — `sync-fireflies.ts`, plus a 7-day catch-up every run
- **Sunday 21:00 CET** — `weekly-summary.ts`, triggers monthly if the month ended
- Each daily run commits `.github/heartbeat/last-run.txt`. **This is load-bearing:**
  GitHub auto-disables scheduled workflows after 60 days without repo activity, and
  it already happened once (Aug 2026, silently, for two days). Do not remove it.

## Environment variables

```
ANTHROPIC_API_KEY      SUPABASE_URL           SUPABASE_SERVICE_KEY
FIREFLIES_API_KEY      VIBE_CHECK_CODE        VIBE_CHECK_SECRET
```

`NEXT_PUBLIC_SUPABASE_*` still exist in Vercel but are **unused** — all reads are
server-side via the service key. Removing them is SB-37.

## Conventions and key decisions

- **All Supabase reads happen server-side.** Do not add a client-side Supabase
  query without first dropping the `USING (true)` public-read RLS policy (SB-11) —
  otherwise the anon key ships to the browser and every reflection becomes public.
- GitHub Actions over Vercel Cron — free tier, flexible scheduling, logs in GitHub.
- Gray days are explicit, not absent.
- Update `BACKLOG.md` when a ticket ships: tick the box, add `done YYYY-MM-DD · <sha>`.
- **Verify before claiming done.** The gate was confirmed with real HTTP checks
  against production, not by assuming a green deploy meant working.
