# Henrik's Vibe Check

Personal mood tracking system. Henrik records a short daily Fireflies reflection each weekday, rated Green/Yellow/Red. This project automates capturing those recordings, storing them, and displaying them on a dashboard.

## What this is

- **Input**: Henrik speaks into Fireflies every weekday afternoon/evening
- **Trigger phrase**: "Daily Vibe Check" + rating (grön/gul/röd)
- **Output**: Dashboard at steelbay.io showing a heatmap calendar, monthly charts, and AI summaries

## Project structure

```
apps/web/          — Next.js dashboard (deployed to Vercel → steelbay.io)
scripts/           — Automation scripts (run via GitHub Actions)
  sync-fireflies.ts    Daily: fetch new Fireflies transcripts, parse, store in Supabase
  weekly-summary.ts    Sunday 21:00: generate weekly AI analysis
supabase/migrations/  — Database schema (SQL migrations)
transcripts/       — Raw exported transcript files (reference/backup)
.github/workflows/ — Cron jobs (daily weekday sync, weekly summary)
```

## Tech stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL), project "Henriks daily vibe check", region Europe
- **Hosting**: Vercel (steelbay.io domain via GoDaddy)
- **Automation**: GitHub Actions cron jobs
- **AI**: Claude API (claude-sonnet-4-6) for parsing transcripts and generating summaries
- **Source**: Fireflies API (GraphQL) — authenticated via henrik.stahle@stardustconsulting.se

## Database tables

- `vibe_checks` — one row per weekday: date, rating (green/yellow/red/gray), raw_transcript, reflection_summary, fireflies_id
- `weekly_summaries` — AI-generated weekly analysis
- `monthly_summaries` — AI-generated monthly analysis with pattern insights

## Fireflies integration

- Search for transcripts containing keyword "vibe check", short duration (< 10 min), solo recordings
- Rating is spoken as "grön/grön plupp", "gul", "röd" — Claude API extracts it
- If no transcript found for a weekday → day is marked "gray" (not reported)

## Automation schedule

- **Weekdays 22:00 CET**: `sync-fireflies.ts` — fetch today's transcript, parse, upsert to Supabase
- **Sunday 21:00 CET**: `weekly-summary.ts` — generate weekly + trigger monthly summary if month ended

## Environment variables needed

```
ANTHROPIC_API_KEY        — Claude API for parsing and summaries
SUPABASE_URL             — Supabase project URL
SUPABASE_SERVICE_KEY     — Supabase service role key (for server-side writes)
NEXT_PUBLIC_SUPABASE_URL — Same URL, exposed to frontend
NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon key for frontend reads
FIREFLIES_API_KEY        — Fireflies GraphQL API key
```

## Dashboard features

1. **Heatmap calendar** — GitHub-style grid, weekdays only, colored green/yellow/red/gray
2. **Day modal** — click any day to see the full reflection and summary
3. **Monthly bar/pie chart** — count of green/yellow/red/gray per month
4. **Monthly AI summary** — what drives good vs bad days
5. **Seasonal trends** — year-over-year pattern analysis (grows over time)

## Domain setup (steelbay.io)

- Registered at GoDaddy
- DNS pointed to Vercel (CNAME: cname.vercel-dns.com)
- steelbay.io = this dashboard (future: subpaths for other private projects)

## Key decisions

- No auth needed — this is a private personal dashboard, deploy with no public access or just obscurity
- GitHub Actions over Vercel Cron — free tier, more flexible scheduling, logs in GitHub
- Weekdays only in heatmap — weekends are not tracked (by design)
- Gray days are explicit — a missing entry for a weekday is stored as gray, not just absent
