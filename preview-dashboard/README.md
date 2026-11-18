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

## Viewing

Deployed as a preview only, at **https://bytebarhq.com/preview-dashboard/**
(live homepage untouched, MD5-verified before and after). The page is
noindexed. Nothing here is wired to real account data — it is the
design, with the real doors.

## Promote path (only on Cori's word)

Rebuild the owner home into the signed-in flow: serve this page (or
its components) to sessions whose profiles.pro is true, reusing the
existing owner-state detection from the live landing; keep the guest
landing byte-identical for everyone else. Re-run the render suite in
both visitor states before anything ships.
