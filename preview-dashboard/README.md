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

## Design

Design System v2 "the Drafting Table," built from
`style-board-v2.html` tokens and the library hero's component family:
near-black navy six-layer field (vertical fall, top-left light, 124px
drafting grid masked at 88%, right-angle traces clear of type, grain,
vignette), registration crosses on every sheet, mono FIG./SHEET
callouts, hairline spec strips with tabular numerals, cyan chrome.
Per Cori's color direction, gold #F5B544 is the OWNER color here —
goal ring, streak, challenge, Complete badge, account dot, XP chip —
and every exam card carries its own accent (Security+ cyan, AZ-104
azure, Linux+ red, CISSP amber on card art only, CKA rose, Terraform
violet, SAA-C03 fuchsia, GCP emerald). Motion is the house family:
rise-in 480ms / stagger 60ms / bar-grow 400ms, cubic-bezier(.2,0,0,1),
nothing loops; reduced-motion zeroes it.

Sections: slim nav (Library / Simulator links, gold-dot account chip)
→ greeting sheet with Pip and a plain-words briefing → Continue hero
(Security+ Ch. 18 of 31, 58%, spec strip) → Today (gold goal ring
10/25, 6-day streak, Threats Week challenge 26/40) → Readiness (last
exam 82%, five domain bars, weakest called out, "Take the final exam"
+ misses link) → the two doors → your shelf (8 accent cards) → footer.

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
  `textline_check.mjs`; screenshots in `verify/`).
- Flow walk: all 15 links point at real destinations (library, book
  pages by verified slug, sim, final-exam deep link, profile, terms,
  refund policy). Language sweep: no internal words on the page.

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
