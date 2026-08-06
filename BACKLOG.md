# Steelbay.io — Backlog

Last updated: 2026-08-06 (site built to DESIGN.md; SB-14 at its pass-2 checkpoint)

**Next up:** SB-14 — the first real agent loop. Premise and rubric are locked
(`DESIGN.md`); the loop instruction is ready to run as written.

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
- [x] SB-6  Rewrite `CLAUDE.md` for the steelbay.io site (vibe check kept as a
            product section within it) — done 2026-08-06
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

- [x] SB-13  Landing page design direction — done 2026-08-06. **Swiss structural**,
             audience = peers and fellow builders. Full spec in `DESIGN.md`:
             visible asymmetric grid, Familjen Grotesk, warm paper `#F4F2ED` /
             ink `#14130F` / ultramarine `#1F2AE0`, no motion, plus a banned list
             of the twelve tells that make a page read as machine-generated.
             Two calls made deliberately: **light not dark** (near-black is the
             AI-portfolio default), and **ultramarine not orange** (red/yellow/green
             are already Vibe Check's *data* colours — a site accent must not
             collide with the site's own semantic vocabulary).
- [ ] SB-14  Build `/` landing page — *this is the first proper agent loop.*
             **Loop instruction: `loops/sb-14-landing-page.md`** (premise: `DESIGN.md`).
             Closed solo loop, mechanical checks on 5 of 7 axes, mandatory human
             checkpoint after pass 2, budget 6 passes / 90 min.
             The summary below is a pointer — the file above is the real thing.

  ```
  GOAL    Build the steelbay.io landing page until it scores >= 8/10 on every
          rubric axis at BOTH viewports (1280px and 375px).
  PREMISE DESIGN.md — Swiss structural, for peers. Read it before pass 1.
  SCOPE   In:  apps/web/app/page.tsx, apps/web/components/,
               apps/web/app/globals.css, apps/web/app/layout.tsx,
               apps/web/tailwind.config.ts
          Out: /vibe-check, middleware/auth, Supabase, scripts/, workflows
  VERIFY  Start the dev server, screenshot at 1280px and 375px, in both colour
          schemes, then score each pass 0-10 on:

          1 STANCE       Does it say something about HOW Henrik works, not just
                         what he shipped? A stranger who builds things should
                         come away with an opinion about him.
          2 GRID         Is the grid real and obeyed? Do the hairlines actually
                         align across sections? One misaligned rule = max 6.
          3 TYPE         Extreme scale contrast, correct optical tracking, no
                         sizes landing in the dead middle of the scale.
          4 RESTRAINT    Accent used <= 2 times. Nothing present that is
                         decoration rather than structure.
          5 NOT-GENERIC  Scored against the DESIGN.md banned list.
                         ANY banned item present caps this axis at 4.
          6 MOBILE       At 375px does the rail become a deliberate meta row, or
                         does it collapse into a generic stack? Score the second
                         case no higher than 5. Check this FIRST each pass.
          7 INVERSION    Dark mode as a true ink/paper flip holding contrast and
                         accent legibility — not the light page dimmed.

  STOP    Done when: all 7 axes >= 8 at both viewports
          Cap:       6 passes, then stop and present the best version with its
                     scores and an honest list of what still fails
          Escalate:  if the premise itself feels wrong — not the execution —
                     stop and ask. Do not iterate on a bad premise, and do not
                     silently drift off DESIGN.md to make a pass score better.
                     Changing the premise means editing DESIGN.md first.
  MEMORY  Append each pass's per-axis scores and what changed to this ticket.
  ```
- [x] SB-15  Section index — done 2026-08-06. Numbered rows on rules (01–04), not
             cards. Four categories: Articles, Claude, Projects, Vibe Check.
- [x] SB-16  Short "about" / intro section — done 2026-08-06. Folded into the hero
             rather than given its own block; the stance line does the work.
- [x] SB-43  Clip all charts to the tracking start — done 2026-08-06. Vibe Check began
             2026-06-01, but the heatmap and monthly chart both hardcoded a full
             calendar year, rendering Jan–May as gray "unrecorded" days that never
             existed. Single source of truth in `lib/config.ts`.
             **This is the case a loop would not have caught** — a chart with five
             empty months scores fine on hierarchy, typography and spacing. The fact
             that makes it wrong lives in Henrik's head, not in the code.
- [x] SB-44  Monthly analysis was invisible — done 2026-08-06. `vibe-check/page.tsx`
             looked up `monthlySummaries.find(s => s.month === currentMonth)`, but
             summaries only exist for *completed* months, so the lookup always missed
             and the section never rendered. Now shows the most recent one that exists.
- [x] SB-45  Monthly summary switched Haiku → Sonnet — done 2026-08-06. Runs once a
             month; better Swedish and better pattern-finding for negligible cost.
- [x] SB-46  Chart bars depended on `requestAnimationFrame` — done 2026-08-06.
             Recharts' mount animation never runs in a backgrounded tab, leaving bars
             stuck at zero height and the chart silently blank. `isAnimationActive`
             off — the animation added nothing to a three-bar chart anyway.
- [-] SB-17  Responsive + dark mode pass — dropped 2026-08-06, absorbed into SB-14
             as rubric axes 6 (MOBILE) and 7 (INVERSION). A separate pass would let
             the loop ship something that only works at one viewport.
- [x] SB-39  Light/dark seam resolved — done 2026-08-06. **Deliberate.** Henrik's call:
             the site is paper-white, Vibe Check stays dark. Implemented structurally
             rather than by accident: the root layout holds the document only, `(site)/`
             carries the Swiss shell, and `/vibe-check` and `/unlock` bring their own
             dark shell. A lit front door and a private dark room.
- [ ] SB-48  `/claude` page has no content yet — **blocked on Henrik.** Which skills are
             public, and how much of the internals to show. Page ships with an honest
             empty state rather than invented entries.
- [ ] SB-49  `/projects` lists only Vibe Check — **blocked on Henrik.** Which other
             projects, and are there screenshots. Bostadskalkyl and Elementskydd are
             candidates from the parking lot.

## EPIC-4 · Vibe Check dashboard v2
**Status:** Open · **Why:** Henrik has UX and analytics improvements in mind.
**Note:** details still to be captured — this epic is deliberately under-specified.

- [x] SB-40  Fix the trapped day modal — done 2026-08-06. The bug was **not** a missing
             close handler (Escape, backdrop and ✕ all existed). The modal had no
             `max-height` and no internal scroll, so expanding a long transcript grew it
             past the viewport; because it centres with flex, it overflowed in both
             directions and pushed ✕ off the top with nothing to scroll. On mobile there
             is no Escape key either, so it was genuinely inescapable.
             Fix: viewport-capped height, fixed header + scrolling body, 44×44 touch
             target, `role="dialog"`, focus on open, background scroll locked.
             Verified at 375 and 1280 — all three close paths, transcript expanded.
- [x] SB-41  Monthly summary content — done 2026-08-06. Pipeline already existed and
             works; it was the *prompt* that was off. Replaced "kort uppmuntrande
             avslutning" with four named sections ending in **Inför nästa månad**
             (2–4 concrete actions). Added an anti-confabulation rule and a sparse-month
             guard: under 8 reflections it must say the data is too thin rather than
             invent patterns.
- [ ] SB-18  Capture the full list of UX improvements Henrik wants (session TBD)
- [ ] SB-19  Capture the analytics/AI-text improvements Henrik wants (session TBD)
- [ ] SB-20  Deeper AI analysis — what actually drives green vs red days
- [ ] SB-21  Seasonal / year-over-year trend view (grows more useful over time)
- [ ] SB-22  Streak and rolling-average indicators

## EPIC-5 · Articles
**Status:** Open · **Why:** Henrik writes articles and wants them published here.

- [x] SB-23  Article format decided — done 2026-08-06. **Markdown files in the repo**
             (`apps/web/content/articles/*.md`) with YAML frontmatter, rendered by
             `react-markdown` + `remark-gfm`. Version-controlled, no DB, no MDX build
             step. Adding an article = adding a file.
- [x] SB-24  `/articles` index — done 2026-08-06. Numbered rows, newest first.
- [x] SB-25  `/articles/[slug]` — done 2026-08-06. Statically generated per slug.
             Wide tables scroll inside their own container, never the page.
- [x] SB-26  Migrated both existing articles — done 2026-08-06. Full text, not summaries.
             Each carries a `canonical` link back to the Stardust original so the copy
             here never competes with the source in search.
- [ ] SB-27  RSS feed (optional, low priority)
- [ ] SB-47  More articles land over the coming months — adding one is just a new
             `.md` file in `content/articles/`. No code change needed.

## EPIC-6 · Automation & reliability
**Status:** Ongoing · **Why:** explicit goal — this must not need manual maintenance.

- [x] SB-1   Fix GitHub Actions 60-day auto-disable, add heartbeat commit — done 2026-08-06 · `86ac19b`
- [ ] SB-28  Alerting when a sync run fails (right now failures are silent)
- [x] SB-29  Verify catch-up backfill filled the Aug 4–5 gap — done 2026-08-06.
             Confirmed against the database: `2026-08-04: green`, `2026-08-05: green`.
             The catch-up worked; nothing was lost to the two disabled days.
- [ ] SB-30  Loop: weekly automated check that the whole pipeline is still healthy
- [ ] SB-31  Document the "what breaks and how to fix it" runbook
- [ ] SB-42  Weekly summary is systematically one week stale. `subWeeks(new Date(), 1)`
             at `weekly-summary.ts:21` means the Sunday run summarises the week that
             ended *seven days ago*, not the one that just ended. Nothing is lost — the
             missing week lands the following Sunday — but the dashboard is always a
             week behind. Fix is to summarise the week ending today.
             Check the monthly path when fixing it: `generateMonthlySummaryIfNeeded`
             bails after day 7, so it depends on a Sunday landing in days 1–7. That
             always holds, but it is load-bearing and undocumented.

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
- ~~Landing page design direction (SB-13) blocks the rest of EPIC-3.~~ Resolved
  2026-08-06 — see `DESIGN.md`.
- **The chosen direction has a known failure mode.** Asymmetric Swiss grids
  collapse badly at 375px, and the collapse is silent: it still *looks* fine, it
  just degrades into a generic stack and throws the direction away. SB-14's rubric
  checks mobile first for exactly this reason. If the loop burns its 6-pass cap,
  this is the most likely axis to have eaten it.

## Parking lot

Ideas captured but not yet committed to an epic.

- Subpaths on steelbay.io for other private projects (mentioned in original CLAUDE.md)
- Other projects from `OUTPUT/` that might deserve a page — Bostadskalkyl, Elementskydd
