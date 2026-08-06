# Steelbay.io — Backlog

Last updated: 2026-08-06

Working backlog for everything being built on steelbay.io. Epics are ordered by
priority, top = most important. Tickets carry stable IDs (`SB-n`) so they can be
referenced unambiguously — "do SB-7" should never need clarification.

## Conventions

- `[ ]` open · `[~]` in progress · `[x]` done · `[-]` dropped
- Closed tickets stay in place, marked with the date and the commit that shipped them
- New tickets get the next free `SB-n` — never reuse an ID
- Epics are reordered as priorities change; tickets within an epic are in build order
- When a ticket ships: tick the box, add `done YYYY-MM-DD · <short-sha>`, update
  "Last updated" above

---

## EPIC-1 · Site foundation & restructure
**Status:** Next up · **Why:** everything else depends on the site having room for
more than one product.

- [ ] SB-2  Rename local folder `Henriks vibe check` → `Steelbay.io web`
- [ ] SB-3  Rename GitHub repo `vibe-check` → `steelbay` (GitHub auto-redirects; Vercel tracks repo ID, so no redeploy needed)
- [ ] SB-4  Move dashboard from `/` to `/vibe-check` route
- [ ] SB-5  Shared site shell — root layout, nav/menu, footer
- [ ] SB-6  Split `CLAUDE.md` into site-wide context + vibe-check product context
- [ ] SB-7  Remove stray untracked `apps/web/next-env.d.ts` (gitignore it — Next regenerates it)

## EPIC-2 · Access control
**Status:** Open · **Why:** the vibe check dashboard is currently live on a public
domain with no protection at all. See the note under Risks.

- [ ] SB-8   Six-digit code gate on `/vibe-check`
- [ ] SB-9   Decide storage for the code — env var vs Supabase (env var is simpler, no DB round-trip)
- [ ] SB-10  Persist unlock in a cookie/session so the code isn't re-entered on every visit
- [ ] SB-11  **Drop the public-read RLS policy and move all reads server-side.** Must ship
             with SB-8 or the gate is decorative — see Risks. Read with the service key in a
             server component / route handler that runs only after the gate passes, and stop
             shipping `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the browser.
- [ ] SB-12  Confirm `/vibe-check` is excluded from search engine indexing (`robots.txt` + `noindex`)
- [ ] SB-36  Rotate the Supabase anon key after SB-11 — the current one has been public

## EPIC-3 · Landing page
**Status:** Open · **Why:** steelbay.io becomes the portfolio front door.

- [ ] SB-13  Landing page design direction — decide the look/feel before building
- [ ] SB-14  Build `/` landing page
- [ ] SB-15  Project cards/index — Vibe Check, Articles, future projects
- [ ] SB-16  Short "about" / intro section
- [ ] SB-17  Responsive + dark mode pass

## EPIC-4 · Vibe Check dashboard v2
**Status:** Open · **Why:** Henrik has UX and analytics improvements in mind.
**Note:** details still to be captured — this epic is deliberately under-specified.

- [ ] SB-18  Capture the full list of UX improvements Henrik wants (session TBD)
- [ ] SB-19  Capture the analytics/AI-text improvements Henrik wants (session TBD)
- [ ] SB-20  Deeper AI analysis — what actually drives green vs red days
- [ ] SB-21  Seasonal / year-over-year trend view (grows more useful over time)
- [ ] SB-22  Streak and rolling-average indicators

## EPIC-5 · Articles
**Status:** Open · **Why:** Henrik writes articles and wants them published here.

- [ ] SB-23  Decide article source format — MDX files in repo vs Supabase (MDX is simpler, version-controlled, no DB needed)
- [ ] SB-24  Build `/articles` index page
- [ ] SB-25  Build `/articles/[slug]` article page
- [ ] SB-26  Migrate existing written articles into the site
- [ ] SB-27  RSS feed (optional, low priority)

## EPIC-6 · Automation & reliability
**Status:** Ongoing · **Why:** explicit goal — this must not need manual maintenance.

- [x] SB-1   Fix GitHub Actions 60-day auto-disable, add heartbeat commit — done 2026-08-06 · `86ac19b`
- [ ] SB-28  Alerting when a sync run fails (right now failures are silent)
- [ ] SB-29  Verify catch-up backfill actually filled Aug 4–5 gap from the disabled period
- [ ] SB-30  Loop: weekly automated check that the whole pipeline is still healthy
- [ ] SB-31  Document the "what breaks and how to fix it" runbook

## EPIC-7 · Loop engineering
**Status:** In progress · **Why:** Henrik wants to build and run agent loops well.

- [~] SB-32  Learn loop structure — goal, trigger, action, verification, stop condition
- [ ] SB-33  Run the EPIC-1 restructure as the first real worked-example loop
- [ ] SB-34  Set up a recurring loop that maintains this backlog as work ships
- [ ] SB-35  Identify which recurring site chores are genuinely worth looping

---

## Risks & open questions

- **The vibe check dashboard is publicly reachable right now.** It sits at the root
  of steelbay.io with no auth — current protection is obscurity only, and `CLAUDE.md`
  documents that as an accepted decision. Henrik has now said this data is too private,
  which makes EPIC-2 the first thing to ship after the restructure. If the domain has
  ever been indexed or shared, treat the past entries as already exposed.
- **CONFIRMED: a six-digit gate alone would be decorative.** Checked
  `supabase/migrations/001_init.sql` — RLS *is* enabled, but the policy is
  `FOR SELECT USING (true)` on all three tables, i.e. public read for anyone holding
  the anon key. That key ships to the browser as `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
  `apps/web/lib/supabase.ts` uses it client-side. So anyone who opens devtools on
  steelbay.io can read every row directly from the Supabase API — including
  `raw_transcript`, the full text of every daily reflection. A UI gate would not
  change that by even a little. SB-11 is therefore not optional polish; it is the
  actual fix, and SB-8 without SB-11 is false comfort.
- Article format decision (SB-23) blocks all of EPIC-5.
- Landing page design direction (SB-13) blocks the rest of EPIC-3.

## Parking lot

Ideas captured but not yet committed to an epic.

- Subpaths on steelbay.io for other private projects (mentioned in original CLAUDE.md)
- Other projects from `OUTPUT/` that might deserve a page — Bostadskalkyl, Elementskydd
