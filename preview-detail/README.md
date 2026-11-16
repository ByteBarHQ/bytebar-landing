# ByteBar homepage — designer detail pass PREVIEW (not live)

Cori 2026-11-16: "i need our site to look like a premiere website
designer created our site. the little things are important."

Finishing, not restyling: same layout, same copy, same prices, every
href byte-identical to the live homepage (asserted in the build). The
variety principle holds — treatments by role, never everything a
button: gold = buy · solid = a section's main action · outline =
secondary on navy · text link + arrow = quiet next step. What changed
is how flawlessly each treatment is executed.

## Change list — what was off → what it is now

### Spacing
- Section padding was a patchwork — a 76px base buried under one-off
  inline tops (20px, 24px) on all six sections, so measured gaps ran
  28 / 44 / 96 / 148px down the page → one rhythm: 56px top and bottom
  on every section (44px on phones), inline overrides gone.
- The sample report card floated between hero and quiz on leftover
  margins (36px above, 4px below) → seated on the rhythm (44px above,
  the section's own spacing below).
- The hero's dark field ran long at the bottom (steps → card measured
  ~142px of stacked padding) → hero and steps close on the scale, so
  the page changes from navy to cream on the beat.
- The footer carried a stray 20px top margin stacked on the last
  section's padding → removed; rhythm + footer padding do the work.
- Card grids each used their own gap (steps 18px, exam grid 14px,
  category groups 26px) → one card-gap token (16px; groups 28px).
- The hero headline gap was faked with a negative margin (−4px) →
  real margins, identical visual gap, no fudge.
- Phone hero kept the desktop 80px top padding → 56px on phones, so
  the headline arrives sooner.

### Type
- The scale itself (kicker 13px tracked caps · H2 clamp 28–42px ·
  lead 17.5px · body 16px) audited clean and is untouched.
- The free-door links were colored with the light-background link
  blue (#0873a0) — on the navy hero it rendered muddy, the exact pair
  in Cori's screenshot → the quiet link now has a true on-dark variant
  in the hero's own accent (#7ee7f7, the cyan the kickers already use
  on navy).
- Report-card verdict weight was 850 — off-scale, rounded differently
  by different browsers → 800, on the scale.

### Links & buttons
- The free doors ("Watch a free first chapter →" · "Start practicing
  free →") were jammed together with an "&nbsp;·&nbsp;", set in the
  wrong color for their background, underlined with the heavy browser
  default, and wrapped mid-phrase on phones ("Start / practicing
  free") → they stay text links (their role), now: on-dark accent,
  refined underline (1.5px, offset, softened until hover), an arrow
  that leans in on hover, a real dot separator with chosen spacing,
  and each phrase unbreakable — on phones they stack, one per line.
- The same quiet-link role appeared in three places with three
  different inline styles (under the steps, under the exam grid, in
  the footer) → one class (.tlink) executes it identically everywhere;
  in the footer it keeps the footer's no-underline convention.
- The gold buy button wore two finishes on the same screen — flat in
  the hero, gradient + tactile edge in the nav, pricing, final CTA,
  footer and sticky bar → the hero orphan overrides are gone; gold is
  gold everywhere. One role, one finish.
- "Secondary on navy" was executed two ways — a hero-only override
  stack vs a one-off inline style in the final CTA (a filled slab) →
  one shared outline treatment (.btn-outline) in both places; the
  inline style and the dead overrides are removed.
- Ghost buttons had a press state but no hover → they answer the
  pointer like their siblings (cyan edge + ink).
- FAQ questions gave no hover response → a subtle row tint, matching
  the accordion's existing motion.
- Keyboard focus had no designed treatment → one visible focus ring
  for every interactive element (:focus-visible, cyan, offset).

### Micro-details
- Text selection was the OS default blue → a soft gold tint, on brand.
- Mobile tap-flash on links → removed (buttons already had it).
- A duplicate .exam rule declared flex-wrap in a second block →
  merged into the card's main rule.
- The arrow nudge respects prefers-reduced-motion.

## How this extends (not in this preview)
- Library home / book / watch pages: adopt the same appended block —
  section rhythm, .tlink for quiet doors, .btn-outline for on-dark
  secondaries, focus ring + selection tint carry over verbatim.
- Sim landing: same button finishes and states (gold = buy, primary =
  main action). The in-sim game layer is untouched by this system.
- /get (cream): .tlink and the rhythm carry over unchanged; gold
  stays the buy finish.

## Gates run on this preview build
- 390px + 1280px headless-Chrome render audit: no horizontal
  overflow, no clipped/cropped element, every button/link checked —
  no label wraps or spills; the door links measure exactly one line
  each at both widths.
- Side-by-side against live (hero, door pair, pricing, final CTA,
  footer): same site, visibly more finished.
- Flow walk: href list byte-identical to live (build-asserted).
- Language sweep: no internal/demo wording.
- Owner state: nav block and owner script byte-identical to live
  (build-asserted); the shared site harness passes 39/39 against
  this build — owners, free accounts and guests each get exactly
  their live behavior, including the restored gold nav CTA.

## Rebuild / deploy
- `python3 build_preview_detail.py` — regenerates `index.html` from
  the live `../index.html` with asserted exact-string edits; fails
  loudly if the live page drifts, and asserts the nav, the owner
  script, every href and all visible text are unchanged.
- `python3 deploy_preview_detail.py` — pushes `index.html` + this
  README to `ByteBarHQ/bytebar-landing` at `preview-detail/` via the
  Git Data API and verifies the served bytes match.
