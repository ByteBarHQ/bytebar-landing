# Preview: the signed-in owner home (dashboard)

Cori 2026-11-18: rethink the landing when someone is signed in — one
home with a door to each room (Watch = library, Practice = simulator),
same visual style, more color against the navy, at the premier-designer
bar. "It's the crown jewel of our products."

## The shape

Guests keep the current sales landing. For a signed-in owner, this page
replaces the patched sales page (the one whose buttons swap to "Open
the Library"): one house — the dashboard is the front room, the library
and the simulator are the two big doors off it. The shelf and the sim
keep living at their own URLs; every door here links into the real
destinations. The dashboard is a SNAPSHOT only (today's goal, streak,
continue, last score) — the simulator's full game layer stays inside
the simulator, by design.

Sections: slim nav (Library / Simulator links, gold-dot account chip)
→ greeting with Pip and a plain-words briefing → Continue hero
(Security+ Ch. 18 of 31, 58%) → Today (gold goal ring 10/25, 6-day
streak, Threats Week challenge 26/40) → Readiness (last exam 82%, five
domain bars, weakest domain called out, "Take the final exam" + misses
link) → the two doors → your shelf (8 books) → footer.

## One home — the map (Cori 2026-11-18: "Yes — one home, fold it in")

There is exactly ONE home for a signed-in user: this dashboard. The
simulator's separate home page is folded into it — everything that
page did (Pip session briefing, daily goal, streak, weekly challenge,
misses-deck pull, readiness) lives here, and only here. The rooms off
the home are for DOING, not for re-greeting:

- **The home (this page) holds:** Pip's briefing, Continue, today's
  goal + streak, the weekly challenge, readiness with the weakest
  domain, the misses door-label in Readiness ("Review your misses —
  12 waiting"), and the two doors. Duplication sweep for this round:
  goal, streak, challenge, misses, briefing, and readiness each
  appear exactly once on the dashboard, and the practice room shows
  none of them. (The gold XP ring on the Practice door is door art —
  the game's colors on the door — not a data display; no level or XP
  figure appears anywhere else on the home.)
- **Watch (the Library)** holds the shelf and the watch pages, as
  today, at bytebarhq.com/library/.
- **Practice (the practice room, `practice/`)** holds the exam
  picker and the misses deck as a working card — activities, not a
  home. No greeting, no goal ring, no streak, no briefing. A slim
  header carries the way back: "← Home".

**Part A (this round, dashboard):** the Practice door now opens the
practice room (`/preview-dashboard/practice/`) instead of the sim
URL, and its copy is about doing, not visiting: "Pick an exam and
play it like test day…" with the pill "Pick an exam" (was "Open the
Simulator"). Nothing else on the dashboard changed.

**Part B (this round, `practice/`):** the room's whole job is picking
an exam. Ten exam doors are shown (Security+ SY0-701 and SY0-801,
AZ-104, SAA-C03, CISSP, Linux+, Network+, CCNA, CKA, A+ Core 1) in
the landing's language — cream ground, the cover system with
"PRACTICE EXAM" as the type line, per-exam accents from the
dashboard cover family (Network+, CCNA, and A+ take the sim
registry's accents; the dashboard shelf doesn't carry them). The
live room carries all 29 exams in this same grid. The owner rule is
baked into every card: the card is the door, its pill reads "Take
the final exam" and deep-links the sim exam
(`sim.bytebarhq.com/sim-preview/?exam=<slug>` — tapping starts Exam
Simulation directly, no mode picker), and one quiet "Quick practice"
link sits under it, secondary, per the owner-state rule. (In this
preview both point at the exam deep link; the live room routes the
quiet link to the same exam in Quick Practice mode. SY0-801 uses the
pattern slug `secplus_sy0_801`.) Each card shows the owner's standing
in plain words ("Last score 82% · 2 days ago" / "Not started yet").
Below the grid, the misses deck is a working card — "12 questions ·
about 12 min" with a "Review misses" pill — because reviewing misses
is an activity; its count also appears on the home as a door label,
the same door seen from two rooms. In-quiz screens are out of scope:
the room ends at the exam doors.

**What retires when this promotes:** the sim landing page and the
sim home page, as pages. Nothing else about the sim changes — the
quiz engine, the results/report card, and the game layer (badges,
coins, XP, streaks, celebrations) are untouched; the game layer
lives inside the practice flow and reports back to the one home.
The sim's nav "Home" and the dashboard's doors resolve to the one
home; the practice room is what the Practice door and the sim root
open into.

## Round 3 — art direction (Cori's verdict on round 2, 2026-11-18)

Round 2 verdict, verbatim: "no not quite still way too sterile and
flat. it feels nothing like the landing page either. this still
isn't it."

**The lesson, now the rule for this surface: stop designing a
"dashboard."** Rounds 1–2 invented new art directions (Drafting
Table, then corporate "premium dusk") and both felt sterile next to
the page Cori actually loves. Round 3's design source of truth is
the LIVE LANDING PAGE itself. The signed-in home is the landing
page, rearranged for an owner — same warmth, same playfulness, same
family. When a design choice is in doubt, the answer is "whatever
the landing page does."

What was carried over, from the landing's actual CSS (../index.html):

- Tokens verbatim: cream ground #f6f1e6, card #fffdf8, warm ink
  #2c2620, navy #0b1e42, gold #f5a623, cyan #0b8fc4, radius 20px,
  the landing's soft shadows and ease.
- The landing's 3D tactile buttons, unmodified in spirit: chunky
  pills with a hard bottom edge (cyan .btn-primary, gold .btn-gold,
  cream .btn-ghost), .btn-lg hero size, lbl-full/lbl-short swaps.
- The cream sticky nav with the navy brand tile; the owner Account
  chip is the ghost-button family plus the live owner gold dot.
- The navy hero (#0a1a38, as the live V5 hero): sticker pill, huge
  friendly headline type, and the signature hand-drawn GOLD MARKER
  — the $99 strikethrough's move, reused as an underline beneath
  "Cori." Pip is LARGE and center-stage with his white speech
  bubble (the hero-pip + pip-tag family, bubble enlarged for the
  briefing) — a character moment, never a shrunken widget.
- The landing's chunky cards: Continue is the quiz-card family
  (2px navy border, 8px navy offset shadow, navy head strip), and
  Readiness is the landing's OWN report card (.report-card / rc-*
  CSS: score ring, verdict, chunky 11px domain bars, the weakest
  domain in its warm highlight) carrying the owner's numbers.
- Friendly step-family cards for Today (gold goal ring in the
  report ring's geometry, flame streak, gold challenge bar);
  the two doors as big landing cards with navy art bands (fanned
  real covers for Watch, the gold XP ring for Practice) and tactile
  pills (cyan for the Library, gold for the Simulator); the shelf
  as friendly exam-family cover cards on cream; the landing's own
  footer. Light-dark-light rhythm, exactly like the landing:
  cream nav → navy hero → cream sections with navy moments.
- Motion is the landing's own: reveal-on-scroll (.reveal +
  IntersectionObserver, copied) and Pip's bob. No spec strips, no
  mono callouts, no hairline data rows, no drafting or dusk
  furniture, no tiny uppercase labels as decoration (the landing's
  kicker + section headings are its real heading device and stay).

Structure, copy, figures, and the href set are unchanged from
rounds 1–2 (href set verified byte-identical after the rebuild).
The functional standard below still governs the content order.
Round 3 verification: 390px + 1280px — overflow 0, zero
out-of-viewport elements, zero console errors, header fits
(376/390 phone); every button measures exactly one text line
(descendant-text-node probe: the three range-based flags — Account
chip, misses link, shelf link — are the known dot/arrow span-rect
artifacts and measure 1 line by text node on both viewports);
language sweep clean (the one "Start here" hit is the approved
brand tagline in the footer, the landing's own closing line);
zero price language anywhere.

## Round 2 — art direction (Cori's verdict on round 1, 2026-11-18)

Round 1 verdict, verbatim: "feels a little dark and i don't think i
like the little crosses in the background corners. hmm also flat can
you do better? doesn't feel like a crown jewel product." Calibration
that followed: "it doesn't have to be super bright either — somewhere
between."

**Documented departure:** the Drafting Table texture language —
registration crosses, the 124px drafting grid, circuit traces, FIG./
SHEET callouts, spec strips — is REMOVED from this surface at Cori's
explicit direction. That is a decision, not drift: the v2 skeleton
still governs (one product, cyan chrome, gold as the owner color,
per-exam accents, the locked motion family), but the texture on the
owner home is now "premium dusk," defined below. Other surfaces keep
the full Drafting Table treatment unless Cori directs otherwise.

**Premium dusk (the midpoint):** the deep navy identity stays as the
ground, lifted with light and color from within — not flat-dark like
round 1, not a light-mode page. Luminous elevated panels (lit blue
gradient, top light edge, layered soft shadows) sit ON the page;
gradient washes glow behind sections in their accent; gold is a METAL
(three-stop gradient #FFE9B8 → #F5B544 → #C77400) on the goal ring,
streak, challenge bar, Complete badge, and XP ring — never a flat
fill. Cream appears only as an accent: Pip's speech card. Real art,
not color blocks: the shelf, the Continue hero, and the Watch door all
carry the library's actual cover system (BYTEBAR masthead, exam code,
title, VIDEO BOOK, accent rule, framed navy art) with the library's
true per-exam accents (Security+ #3896FF, AZ-104 #38BDF8, Linux+
#FBBF24, CISSP #F5B544, CKA #F43F5E, Terraform #7B42BC, SAA-C03
#FF9900, GCP ACE #34D399); the Watch door fans three covers, the
Practice door carries the gold XP ring. Pip gets a stage — a soft
azure glow and a cream speech card with a real shadow. Motion stays
the house family: rise-in 480ms / stagger 60ms / bar-grow 400ms,
cubic-bezier(.2,0,0,1), nothing loops; reduced-motion zeroes it.

## Cori's functional standard for this surface (2026-11-18)

"it needs to do its job well — be a good dashboard and home page for
our studyers." Applied as a content-priority pass:

1. The #1 job is getting a studier back INTO studying within one tap:
   the Continue card is the hero and its play door is the largest
   action on the page. Nothing decorative outranks it.
2. The page answers "what do I do next?" — its order is the session's
   order: Continue → today's goal → readiness / weakest domain → the
   doors. The greeting was trimmed to one line so Continue starts
   inside the first phone screen.
3. The learn→prove loop closes in words: the Readiness note reads
   "The Library taught it chapter by chapter — your saved misses are
   where you prove it's sticking." A nudge, never a pitch — no price
   language anywhere on this owner surface.
4. Momentum reads in under 3 seconds at phone size: 82% score, 10/25
   goal ring, gold 6-day streak, 58% book progress — big figures,
   plain labels.
5. Anything that doesn't help a studier start, continue, or know
   where they stand is cut or demoted: the duplicated XP chip on the
   Practice door and the repeated greeting line were removed in this
   pass.

Pip is the live asset, injected byte-for-byte from `../index.html` by
`build_preview_dashboard.py` (pipv3 defs + pip-big SVG) — never redrawn.
All figures on the page are illustrative owner data for the design
review; no "sample/mock" language appears on the page itself.

## Verification (verify/, headless Chrome over CDP)

- 390px phone + 1280px desktop: horizontal overflow 0, zero elements
  outside the viewport, header fits (right edge 374/390 phone), zero
  console errors.
- Every button, chip, nav link, badge, and quiet link measures exactly
  ONE text line at phone width (text-node rect measurement,
  `textline_check.mjs`; screenshots in `verify/`). The element-range
  pass flags the Account chip and the Complete badge only because
  their dot spans offset the range; the text-node check and the
  screenshots confirm one line each.
- Render defects found and fixed at the source during round 2: the
  Today cells squeezed into word-per-line columns on phone (now
  full-width rows), the misses link crowding the Readiness panel edge
  (now 13px on its own row), shelf state rows reading cramped (type
  tightened). A dark block in early phone-top captures was proven to
  be a headless scroll-restore compositing artifact — fresh-load
  captures (`verify/phone-continue.png`) are pixel-clean, and the
  harness now takes the top shot on a fresh load.
- Flow walk: all links point at the same real destinations as round 1
  (library, book pages by verified slug, sim, final-exam deep link,
  profile, terms, refund policy) — the href set is byte-identical to
  round 1. Language sweep: no internal words on the page.
- Self-check against the brief: visibly lighter than round 1 while
  staying deep navy (midpoint — "deep but luminous"), ZERO crosses or
  grid anywhere, real depth throughout (shadows, metallic gold,
  gradient washes, real cover art).

## Verification — one-home round (verify/verify_onehome.mjs)

Headless Chrome over CDP against the local files, both pages, 390px
phone + 1280px desktop (`verify/results-onehome.json`):

- Horizontal overflow **0** and zero out-of-viewport elements on
  both pages at both widths; **zero console errors** anywhere.
- Every button/link measures exactly **1 text line** by the
  text-node method on both pages. The range method flags only the
  known span artifacts (the Account chip's gold dot, the lbl-full /
  lbl-short and arrow spans, the practice header's "←" span) — the
  same artifacts round 3 documented, disproven by the text-node
  check and the screenshots.
- Header fits: right edge 376/390 on phone for both pages.
- Flow walk, asserted in the DOM: dashboard doors =
  [library, practice room]; practice room = 10 exam cards, 10 cover
  doors, 10 "Take the final exam" pills on the correct sim deep
  links, 10 "Quick practice" links, 3 Home links (brand, header,
  footer) back to the dashboard, misses pill to the sim.
- Language sweep on both built pages: no internal/mock/sample
  wording, zero price language; the only "Start here" is the
  approved footer tagline. Screenshots: `verify/phone-top.png`,
  `verify/phone-doors.png` (new Practice door copy visible),
  `verify/practice-phone-top.png`, `verify/practice-phone-grid.png`,
  `verify/practice-phone-misses.png`, plus full-page captures.

## Viewing

Deployed as a preview only, at **https://bytebarhq.com/preview-dashboard/**
and **https://bytebarhq.com/preview-dashboard/practice/** (live
homepage untouched, MD5-verified before and after). The pages are
noindexed. Nothing here is wired to real account data — it is the
design, with the real doors.

## Promote path (only on Cori's word)

Rebuild the owner home into the signed-in flow: serve this page (or
its components) to sessions whose profiles.pro is true, reusing the
existing owner-state detection from the live landing; keep the guest
landing byte-identical for everyone else. Re-run the render suite in
both visitor states before anything ships.
