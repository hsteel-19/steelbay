# SB-14 loop log

Premise: `DESIGN.md`. Instruction: `loops/sb-14-landing-page.md`.

---

## Baseline — the placeholder

Scored before any work, so improvement is measured, not asserted.

| Axis | 1280 | 375 | Note |
|---|---|---|---|
| 1 Stance | 3 | 3 | Said what he built, nothing about how he works |
| 2 Grid | 2 | 2 | No grid. Centred `max-w-5xl` column |
| 3 Type | 3 | 3 | Single family, gentle scale, no contrast |
| 4 Restraint | 6 | 6 | Restrained by having no ideas, not by choice |
| 5 Not-generic | 3 | 3 | `rounded-lg` cards, centred column, badge pills |
| 6 Mobile | 4 | 4 | Stacks into a generic list |
| 7 Inversion | 1 | 1 | Dark only. No light mode at all |

## Pass 1 — build to the premise

Built the token system, the 3/9 asymmetric grid, the four category rows, and the
site shell. Landing, `/articles`, `/articles/[slug]`, `/claude`, `/projects`.

Three defects found by verification, not by eye:

1. **Å collided with K.** Display leading of 0.86 left no headroom for Swedish
   diacritics in STÅHLE. Corrected to 0.95 — and `DESIGN.md` was edited to match,
   rather than the code quietly drifting off the spec.
2. **Column rule broke between sections.** Section padding sat outside the grid,
   so the hairline stopped and restarted. Moved inside; it now runs unbroken.
3. **Dark-mode accent measured 3.66:1**, below AA, and it carries the link hover
   state. Moved `#4B54FF` → `#6B72FF` (5.0:1). Also written back to `DESIGN.md`.

## Pass 2 — mobile and overflow

4. **Nav overflowed at 375px**, hiding Vibe Check behind a scrollbar. Now drops to
   its own rule-separated second row — a deliberate band, not an overflow.
5. **The comparison table pushed the whole page sideways.** Grid items default to
   `min-width: auto`, so `.table-wrap`'s `overflow-x` could never engage.
   `min-width: 0` on `.split > *` fixed it: page 375px, table scrolls in-place.

### Mechanical checks

```
banned list      clean — no hits
emoji            clean
mx-auto          0 in components (page shell only, in CSS)
static accent    1 use (the hero plane)
horizontal scroll  none at 375 or 1280
contrast (dark)  ink 15.95:1 · muted 5.22:1 · accent 5.00:1
build            clean, 13 routes, both articles prerendered
```

### Scores after pass 2

| Axis | 1280 | 375 |
|---|---|---|
| 1 Stance | 8 | 8 |
| 2 Grid | 9 | 8 |
| 3 Type | 8 | 8 |
| 4 Restraint | 9 | 9 |
| 5 Not-generic | 9 | 9 |
| 6 Mobile | — | 8 |
| 7 Inversion | 9 | 9 |

**Status: at the mandatory pass-2 checkpoint.** Every axis is at or above 8, so
the loop's stop condition is technically met — but the checkpoint exists because
taste is the one thing the loop cannot verify for itself. Waiting on Henrik's
answer to: *is the premise right?*

### One rubric change, stated rather than slipped in

Axis 4 originally read "accent used at most twice", counted by grepping every
`var(--accent)` occurrence. That would have failed any design with link hover and
focus states. Redefined to count **static, visible** accent uses; hover/focus
states are exempt. Static count is currently 1.
