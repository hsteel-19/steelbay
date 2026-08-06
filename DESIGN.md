# steelbay.io — design direction

Decided 2026-08-06 (SB-13). This is the premise SB-14 builds against. If the
premise turns out to be wrong, change *this file* and re-run the loop — do not
quietly drift away from it while iterating.

**Direction:** Swiss structural.
**Audience:** peers and fellow builders. They already know what a Next.js app is.
Do not explain. Have a point of view instead.

---

## The one idea

**The grid is visible and it is the design.** Not a decorated page that happens to
sit on a grid — a page where the structure *is* the content's frame, and the
hairlines, the numbering, and the column boundaries are what you actually see.
Everything else is subordinate to that.

If a change doesn't strengthen the grid, it doesn't belong.

## Layout

A 12-column grid, but used asymmetrically. The page is split into a narrow
**meta rail** and a wide **content field**:

```
 ≥1024px                                  <1024px
┌────────┬─────────────────────────────┐  ┌───────────────────┐
│ 3 col  │ 9 col                       │  │ rail collapses to │
│        │                             │  │ a top row of meta │
│ 01     │ HENRIK                      │  │ ─────────────────  │
│ meta   │ STÅHLE                      │  │ 01                │
│ labels │                             │  │ HENRIK            │
│ dates  │ ████ accent plane           │  │ STÅHLE            │
│        │                             │  │                   │
└────────┴─────────────────────────────┘  └───────────────────┘
   ↑ 1px rule on the boundary, full-bleed vertically
```

- Column boundary rules are **visible** at ≥1024px, full height, `--rule`.
- Horizontal rules separate every section and every project row. They are
  structure, not decoration — they must align across the whole page.
- Body text is **flush left, ragged right**. Never centered, never justified.
- Content is not centered in a `max-w-4xl mx-auto` box. The field is
  intentionally off-centre; whitespace is asymmetric and load-bearing.
- Max page width 1440px, gutters 24px mobile / 40px desktop.

## Type

Two families, no more.

| Role | Family | Spec |
|---|---|---|
| Display | Familjen Grotesk | `clamp(3.25rem, 11vw, 8.5rem)`, weight 500, tracking `-0.04em`, leading `0.95` |
| Sub-display | Familjen Grotesk | `clamp(1.5rem, 3vw, 2.25rem)`, weight 400, tracking `-0.02em` |
| Body | Familjen Grotesk | `1.0625rem` / `1.55`, max measure **34rem** |
| Label / section head | mono | `0.6875rem`, uppercase, tracking `0.14em` |
| Meta / numbers | mono | `0.75rem`, `tabular-nums` |

Familjen Grotesk is a Swedish grotesk — apt, on Google Fonts, and not Inter.
Load via `next/font/google` with `display: 'swap'`. Mono is JetBrains Mono or
the system mono stack; it is used **only** for labels, numbers and status, never
for prose.

**The type contrast must be extreme.** 136px sitting next to 11px. There is no
comfortable middle of the scale — if a size lands between sub-display and body,
it is wrong. That gap is the whole effect.

**Leading was 0.86; corrected to 0.95 on 2026-08-06.** At 0.86 the ring of the Å
in STÅHLE collided with the K on the line above. Swedish diacritics need
headroom that a Helvetica-era spec assumes away — the name of the person whose
site this is has to set the floor for the type scale.

## Colour

One accent. Used at most **twice** on the page.

```
--paper    #F4F2ED   warm off-white
--ink      #14130F   warm near-black (not #000)
--muted    #6E6A61
--rule     #D8D4CB   hairlines
--accent   #1F2AE0   ultramarine
```

Dark mode is a **true inversion**, not a dimming:

```
--paper    #100F0D
--ink      #EDEAE3
--muted    #8A857A
--rule     #2A2823
--accent   #6B72FF   brightened to hold contrast on dark
```

Measured against the dark paper: ink 15.95:1, muted 5.22:1, accent 5.0:1. The
accent was `#4B54FF` until 2026-08-06, when it measured 3.66:1 — fine as a
plane, but it also carries the link hover state, and that has to clear AA.

The accent is applied as a **plane** (a filled block, a full-width rule) and as
exactly one interaction state. It is never a button gradient, never body text,
never a glow.

Rationale for ultramarine over red/orange: Vibe Check already uses red, yellow
and green as *data* colours. A site accent that collides with the site's own
semantic vocabulary is a bug, not a style choice.

## Motion

Effectively none. Swiss doesn't animate.

Permitted: `color` and `border-color` transitions at 150ms on interactive
elements. One optional entrance — rules drawing in horizontally, 400ms, once.

Banned: scroll-triggered fade-ups, `hover:scale`, parallax, marquees, blur-ins,
anything that moves because it can.

## Voice

Dry, specific, unhedged. Keep the humour, drop the explaining.

- Say what the thing *is* and what you learned building it.
- Never "crafting delightful experiences", "passionate about", "building the
  future of", or any sentence that would survive being pasted onto another
  person's site.
- Real numbers over adjectives. "Runs weekdays at 22:00" beats "automated".

---

## Banned list

These are the tells that make a page read as machine-generated. Any one of them
present caps the "not-generic" rubric axis at 4/10.

1. Gradient text (`bg-clip-text`), gradient hero backgrounds, mesh gradients
2. Glassmorphism — `backdrop-blur` panels, translucent frosted cards
3. `rounded-2xl` card grids with subtle borders and `hover:scale-105`
4. Emoji used as icons or section markers
5. An icon next to every heading
6. Badge pills scattered as decoration
7. Everything centered in one `max-w-4xl mx-auto` column
8. Uniform visual weight — no element clearly dominant
9. Purple/indigo→pink as the primary palette
10. Fabricated stats, testimonials, or logo walls
11. Symmetric three-up feature grids with title + blurb + icon
12. Dark mode implemented as "the same page, dimmed"

The tell they share: **nothing on the page could only have been made for this
person.** Specificity is the antidote.

## Known failure mode

Asymmetric grids collapse badly at 375px. The rail cannot simply stack into a
generic vertical list — that throws away the entire direction and lands back on
"refined dark minimal with extra steps". At mobile the rail becomes a **top meta
row** with its own rule, the numbering stays visible, and the display type stays
oversized enough to still feel like a poster. This is the axis most likely to
fail the loop; check it first, not last.

## Out of scope

The Vibe Check dashboard stays dark and is not restyled here — see SB-39 for the
seam between the two.
