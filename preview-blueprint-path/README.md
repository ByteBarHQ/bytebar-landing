# Preview: the Blueprint Path (simulator Phase 3) — design mock

A design mock for Cori's eye, approved by him 2026-11-19 (voice
call): mock first, his verdict, then a separate promote decision.
**Preview only — nothing here is live.** The live homepage, the
practice room, and the Simulator are untouched. No real account
data is wired: the progress on the path is plausible sample
progress for one Security+ learner, so the states read clearly.

- Path: https://bytebarhq.com/preview-blueprint-path/
- Home Continue demonstrator: https://bytebarhq.com/preview-blueprint-path/home/

## What it shows

1. **The path, inside the Practice room.** Security+ SY0-701 laid
   out as a walkable trail in the exam's own order — the five
   real domains as bands (with their exam weights and mastery
   bars), 24 topic stops along a dashed trail, and the full
   timed final exam as the last stop. Each stop carries the
   learner's standing from practice: Solid (green, with the %),
   Shaky (gold), In progress / next up (cyan, pulsing ring, with
   a "You are here" tag on the card), Not started (hollow).
   A slim game strip rides under the nav — streak flame, level,
   XP bar, daily-goal ring — the sim's game layer, visible on
   the path the way it is inside the practice flow.
2. **A stop, tapped open.** Every stop (node or card) opens a
   sheet with the topic's standing, any saved misses waiting on
   that topic, and the two doors side by side at equal weight:
   **Practice this topic** (cyan) and **Watch the book** (gold)
   — the paired-doors rule, applied at the stop level. The sheet
   names the book chapter(s) that teach the topic. The final
   exam's sheet carries "Take the final exam" + "Watch the book".
3. **Continue, from home.** The home demonstrator shows the
   Continue card pointing at the learner's next unfinished stop
   ("Next stop: Cryptography basics" — the first non-solid stop
   on the path), with Pip's briefing saying the same thing, the
   same paired doors, and a "See your whole path" link into the
   path page.

## Design source

The live landing page / signed-in home family — cream and navy,
big friendly type, gold marker strokes, chunky 3D pill buttons,
the site Pip with his speech bubble. The stylesheet is the
approved one-home mock's own sheet plus the visual-pass sheet,
reused verbatim; Pip is injected byte-for-byte from the live
landing. Structure follows the Phase 3 spec
(`sim-evolution-duolingo-2026-11-15/SPEC.md` §3): per-exam path,
domains in teaching order, mastery states, book chapters as
stations, the timed simulation as the path's final stop. The
spec's Drafting Table sheet dressing (FIG. numbers, sheet
stamps) is NOT used: Cori's one-home decision (2026-11-19) made
the landing page the design source for signed-in surfaces, and
that later call governs.

## Design decisions for Cori

- **Sample progress tells one coherent story** across both
  pages: Domain 1 nearly strong (cryptography is the gap, and
  it is the next stop everywhere — hero bubble, summary chips,
  the home's Continue, Pip's briefing), Domain 2 building,
  Domain 3 just starting, Domains 4–5 untouched, readiness 54%
  from 212 questions answered. Numbers agree page to page.
- **States are words + numbers, not just colors**: every stop
  says "Solid · 94% over 26 questions", "Shaky · 58%…", or
  "Not started yet" in text, so standing is readable at a glance.
- **The final exam is a destination, not a lock**: its node is
  the biggest on the trail with a gold ring; its sheet is
  honest that it counts most when the path behind you is strong.
- **Book chapters are named per stop** (Security+ book chapter
  ranges), so "watch first, then practice" is one tap either way.
- **At phone width the trail runs down a left rail**; on desktop
  the stop cards alternate sides of a center trail.

## Verification record

`verify/verify.mjs` — real headless-Chrome sessions over CDP,
run against the local build and again against the deployed
preview URLs. Render audits at 390px and 1280px for both pages
(zero horizontal overflow, no out-of-viewport elements, no
button-label wraps, zero JS errors); a full playthrough at
390px: all 25 stops open their sheets by node and by card, every
sheet's paired doors measured equal with live destinations,
sheet closes via button, backdrop, and Escape; stops sampled at
the top, middle, and end of the trail verified fully revealed
(opacity 1) after scrolling; the home's Continue pair measured
equal and its whole-path link verified. Language sweep at build
time: no internal vocabulary on either surface. Screenshots in
`verify/` (390px: path top, stop sheet, trail middle, trail end,
home).

Two defects were caught and fixed during QA, before deploy:
the game strip overflowed at 390px (goal ring clipped — level
name and XP bar drop out at phone width, numbers stay), and the
trail's reveal observer was registered before the stops were
built, which would have left the trail invisible (script order
fixed; the opacity check above now guards it).
