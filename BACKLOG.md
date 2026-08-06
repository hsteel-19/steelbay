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

- [x] SB-2  Rename local folder `Henriks vibe check` → `Steelbay.io web` — done 2026-08-06
- [x] SB-3  Rename GitHub repo `vibe-check` → `steelbay` — done 2026-08-06
            (note: `gh repo rename` silently rewrote the remote from SSH to HTTPS; restored)
- [x] SB-4  Move dashboard from `/` to `/vibe-check` route — done 2026-08-06
- [x] SB-5  Shared site shell — root layout, nav, footer — done 2026-08-06
- [ ] SB-6  Split `CLAUDE.md` into site-wide context + vibe-check product context
- [x] SB-7  Gitignore `apps/web/next-env.d.ts` — done 2026-08-06

## EPIC-2 · Access control
**Status:** Open · **Why:** the vibe check dashboard is currently live on a public
domain with no protection at all. See the note under Risks.

- [x] SB-8   Six-digit code gate on `/vibe-check` — done 2026-08-06. Edge middleware,
             fails closed if unconfigured. Verified: no cookie → redirect, wrong code →
             error, right code → cookie, forged cookie → rejected, open redirect → blocked.
- [x] SB-9   Code stored as `VIBE_CHECK_CODE` env var — done 2026-08-06
- [x] SB-10  Unlock persists in an httpOnly/Secure/SameSite cookie, 30 days — done 2026-08-06
- [ ] SB-11  Harden Supabase — *later, not blocking.* Drop the `USING (true)`
             public-read policy on all three tables now that reads are server-side only.
- [x] SB-12  `/vibe-check` and `/unlock` excluded from indexing via `robots.ts` + per-page
             `robots: { index: false }` — done 2026-08-06
- [ ] SB-38  Real rate limiting on `/api/unlock`. Currently only a 400ms delay per attempt,
             which slows but does not stop enumeration of a 6-digit code.
- [ ] SB-37  Delete dead `apps/web/lib/supabase.ts` and the unused `NEXT_PUBLIC_SUPABASE_*`
             vars — removes the trap that would expose everything the moment someone
             adds a client-side query

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
- **A server-side six-digit gate IS effective. (Corrected 2026-08-06.)** An earlier
  version of this file claimed the gate would be decorative because the anon key
  ships to the browser. That was wrong — traced the real data flow: `lib/supabase.ts`
  (the anon client) is imported by nothing, all reads happen server-side in
  `app/page.tsx` via the service key, and the client components receive data as
  props. Next never inlines `NEXT_PUBLIC_SUPABASE_ANON_KEY` into the bundle because
  nothing references it client-side. The data is not currently exposed.
- **Latent risk, not urgent:** the RLS policy is still `FOR SELECT USING (true)` on
  all three tables, and `lib/supabase.ts` is dead code holding an anon client. The
  day anyone adds a client-side Supabase query, the key ships and every row —
  including `raw_transcript` — becomes publicly readable in one step. Cheap to
  defuse (SB-11, SB-37): delete the dead file, drop the public-read policy, remove
  the unused `NEXT_PUBLIC_*` vars.
- Article format decision (SB-23) blocks all of EPIC-5.
- Landing page design direction (SB-13) blocks the rest of EPIC-3.

## Parking lot

Ideas captured but not yet committed to an epic.

- Subpaths on steelbay.io for other private projects (mentioned in original CLAUDE.md)
- Other projects from `OUTPUT/` that might deserve a page — Bostadskalkyl, Elementskydd
