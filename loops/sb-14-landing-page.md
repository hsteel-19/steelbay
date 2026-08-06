# Loop · SB-14 — steelbay.io landing page

Closed solo loop with one human checkpoint. Run on demand.
Premise: `DESIGN.md`. Ticket: `BACKLOG.md` → SB-14.

---

## GOAL

Build the steelbay.io landing page until every rubric axis scores >= 8/10 at
**both** viewports (1280px, 375px) in **both** colour schemes.

## SCOPE

```
In    apps/web/app/page.tsx
      apps/web/app/layout.tsx
      apps/web/app/globals.css
      apps/web/components/
      apps/web/tailwind.config.ts
Out   /vibe-check, middleware.ts, lib/auth.ts, Supabase, scripts/, workflows
```

Out-of-scope files are not edited even if a pass would score better for it.

## PASS 0 — plan and baseline

1. Read `DESIGN.md` in full. Do not start from the placeholder's assumptions.
2. Write the plan for pass 1 into the log **before** editing anything.
3. Score the **existing placeholder** against the rubric and record it as the
   baseline. Improvement is measured from there, not from zero.

## EACH PASS

**Observe** — start the dev server (`preview_start` → `steelbay-web`), capture
four screenshots: 1280 light, 1280 dark, 375 light, 375 dark.

**Choose** — take the single lowest-scoring axis. If two tie, take the one
earlier in the rubric. One axis per pass.

**Act** — one bounded change addressing that axis. Do not opportunistically
"also fix" other things; that makes the score unattributable.

**Verify** — re-screenshot all four, run the mechanical checks below, score all
seven axes.

**Record** — append to `loops/sb-14-log.md`: pass number, axis chosen, what
changed, all seven scores at both viewports, what is still failing.

**Repeat or stop** — see STOP.

---

## RUBRIC

Five axes have a mechanical check. Run it first; it settles the score without
argument. Only 1 and 3 are judged by eye.

### 1 · STANCE  *(judged)*
Does the page say something about **how** Henrik works, not just what he shipped?
A stranger who builds things should leave with an opinion about him.
Fails if the copy would survive being pasted onto someone else's site.

### 2 · GRID  *(mechanical + eye)*
The grid is real and obeyed; hairlines align across every section.
> Check: overlay column guides via `javascript_tool`, compare the computed
> `left` of each vertical rule and the `x` of section headings.
> **Any misaligned rule caps this axis at 6.**

### 3 · TYPE  *(judged)*
Extreme scale contrast, correct optical tracking.
> Check: `getComputedStyle` every text node's `font-size`. If any size lands
> between the sub-display max and body — the dead middle of the scale — that is
> the failure `DESIGN.md` warns about.

### 4 · RESTRAINT  *(mechanical)*
Accent used at most twice. Nothing present that is decoration, not structure.
```bash
rg -n --stats 'var\(--accent\)|text-accent|bg-accent|border-accent' apps/web/app apps/web/components
```
> 3+ usages caps this axis at 5.

### 5 · NOT-GENERIC  *(mechanical)*
Scored against the `DESIGN.md` banned list.
```bash
rg -n 'bg-clip-text|backdrop-blur|rounded-2xl|rounded-3xl|hover:scale|from-purple|from-indigo|to-pink|animate-bounce|animate-pulse' apps/web/app apps/web/components apps/web/app/globals.css
rg -n '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' apps/web/app apps/web/components
rg -c 'mx-auto' apps/web/app apps/web/components
```
> **Any hit on lines 1–2 caps this axis at 4.**
> `mx-auto` more than once (the page shell) caps it at 6 — centred columns are
> banned-list item 7.

### 6 · MOBILE  *(judged, checked first each pass)*
At 375px, does the meta rail become a deliberate top row with its rule and
numbering intact, or does it collapse into a generic vertical stack?
> **Generic stack scores no higher than 5.** This is the known failure mode —
> it looks fine and silently throws the direction away. Check it before the
> desktop view, every pass.

### 7 · INVERSION  *(mechanical)*
Dark mode is a true ink/paper flip, not the light page dimmed.
> Check: sample computed `background-color` and `color` in both schemes.
> Contrast ratio must hold >= 4.5:1 for body and the accent must remain
> distinguishable against paper in both.

---

## CHECKPOINT — after pass 2, mandatory

Stop. Present the four screenshots and the score table. Ask Henrik one question:

> **Is the premise right?** Not "is this good yet" — is Swiss structural,
> paper-light, ultramarine, still the thing you want?

Taste is the one thing this loop cannot verify for itself, and pass 2 is when
there is enough on screen to judge it and still four passes left to act on the
answer. Do not continue past pass 2 without an answer.

## STOP

Enter exactly one named end state and say which:

| State | Condition |
|---|---|
| `DONE` | all 7 axes >= 8 at both viewports, both schemes |
| `STALLED` | the lowest axis score has not risen for 2 consecutive passes |
| `CAPPED` | 6 passes or 90 minutes reached |
| `BLOCKED` | a scope boundary or missing dependency prevents progress |
| `PREMISE-REJECTED` | the direction itself is wrong |

`CAPPED` and `STALLED` are **not** success. Report the best version, the score
table, and an honest list of what still fails. Never dress a hit cap as done.

On `PREMISE-REJECTED`: stop and ask. Do not iterate on a bad premise, and do not
silently drift off `DESIGN.md` to make a pass score better — the cheapest way to
raise a score is always to move the target. Changing the premise means editing
`DESIGN.md` first, as a visible commit.

## MEMORY

`loops/sb-14-log.md`, appended every pass. Survives between passes so each one
builds on the last rather than rediscovering the same problems.

## BUDGET

6 passes, 90 minutes, whichever comes first.
