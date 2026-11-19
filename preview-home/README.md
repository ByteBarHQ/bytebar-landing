# Preview: the wired one-home (real data, real routing)

The approved one-home mock (../preview-dashboard/) wired to live
account data. Cori approved the wiring 2026-11-18 with one condition:
**the logic holds — no weird loops, no dead ends, keep it tight.**
This page is the proof artifact for that condition. Preview only:
nothing here is live; the live homepage, the approved mock, and the
Simulator are untouched (checksums in the verification record).

- Home: https://bytebarhq.com/preview-home/
- Practice room: https://bytebarhq.com/preview-home/practice/
- Routing demonstrators: /preview-home/retire/root.html and
  /preview-home/retire/sim-root.html (see the route map)

## Where every number comes from

One house, one set of numbers. The wired pages read the SAME
Supabase tables the Simulator reads, through the SAME shared
session (the bbAuthStorage cookie adapter, injected verbatim from
the live landing), and the math is the Simulator's own source,
injected verbatim at build time from quiz-saas/app.js.html
(readinessDetail, dayStreak, goalState/goalRollDay, weekKey,
weekActiveDays, daysLeftInWeek, levelFor/LEVELS, domDisplay +
DOMAIN_DISPLAY). The record is built with the Simulator's own
backend mapping (BB.hydrate's four reads + BB.recordFromBackend,
field for field).

| Element | Source | Notes |
|---|---|---|
| Owner vs free | profiles.pro | The same check the live landing runs |
| Greeting name | profiles.display_name, else email prefix | No name on file → nameless greeting |
| Pip briefing | goalState + readinessDetail (focus exam) | The sim's own greeting clauses; a clause with no data is omitted, never invented. The sim's misses-deck clause is NOT used (see misses, below) |
| Continue | Most-attempted exam (the sim home's own pick), its readinessDetail + last attempt from quiz_attempts | No attempts → "pick your first book" state, no invented progress |
| Daily goal | profiles.data.goal + goalRollDay semantics | Exactly the sim's counter — it syncs through profiles |
| Streak | dayStreak(profiles.data.active_days); Best = max(streaks.longest_streak, longest run in active_days) | Same computation the sim displays |
| Weekly challenge (owner) | Derived from quiz_attempts + active_days with the sim's accrual rules (recordAttempt: questions += answered; sims80 += sim attempts ≥ 80%; days = this week's active days; Monday weekKey) | The sim accrues these counters in its local record; the synced attempts are the account's record of the same events. Boundary note: derivation buckets by UTC day, the sim accrues by its local day — a completion within hours of midnight can sit in adjacent buckets. Promote item P5 fixes this at the source |
| Weekly challenge (free) | Locked teaser | Matches the sim: challenges are Complete-only |
| Readiness | readinessDetail over quiz_attempts for the focus exam | Below the sim's evidence bar (20 questions) the score is withheld and the card says so — the sim's own rule |
| XP / level (Practice door) | profiles.xp + levelFor | Real level names from the sim (Study Rookie → Certification Legend) |
| Practice standings | Latest quiz_attempts row per exam | "Last score X% · when", else "Not started yet" |
| Shelf | Book doors only | **No book progress exists anywhere in the product** — the library tracks no watch progress, so the shelf makes no progress claims (the mock's bars are gone). Promote item P6 |
| Saved misses | **No count — by design** | The misses deck lives only in the Simulator's on-device record; it is not in the synced tables, so no surface outside the sim can know the count. The home/room link to the deck without inventing a number; the sim shows the real deck on landing. Promote item P4 restores the counted door |

## Route map

States: **G** guest (no session) · **F** free signed-in · **O** owner.
Every door below was walked in a real browser session per state;
the proof results follow the map.

### The home (/preview-home/ — production: the signed-in root)

| Door | G | F | O | Lands on |
|---|---|---|---|---|
| (arriving) | → storefront, 1 replace hop, before paint | home (free) | home (owner) | — |
| Brand | — | home (self) | home (self) | — |
| Nav · Library | — | Library home | Library home | bytebarhq.com/library/ |
| Nav · Simulator | — | practice room | practice room | /preview-home/practice/ |
| Account chip | — | sim profile | sim profile (gold dot) | sim ?profile=1 (sign-out lives there) |
| Continue · primary | — | final exam (focus exam) | final exam (focus exam) | sim ?exam=\<slug\> — owner: straight to the exam check-in; free: mode select (the sim's own rule per state) |
| Continue · book link | — | the focus exam's book page | same | /library/book-\*.html |
| Goal card · set-goal link (only when no goal set) | — | sim home (goal picker lives there) | same | sim root |
| Readiness · Take the final exam | — | sim ?exam=\<focus\> | same | as Continue primary |
| Readiness · Review your misses | — | sim root (deck pull lives on the sim's home today) | same | sim root — see P4 |
| Readiness · empty state door | — | practice room | practice room | — |
| Watch door | — | Library home | Library home | /library/ |
| Practice door | — | practice room | practice room | /practice/ |
| Buy door (free only, exactly one) | — | checkout | — (never rendered) | bytebarhq.com/get |
| Shelf cards (8) | — | book pages | book pages | /library/book-\*.html |
| Shelf · whole shelf | — | Library home | Library home | /library/ |
| Footer · Library / Simulator / Terms / Refund | — | as nav / room / legal pages | same | — |

### The practice room (/preview-home/practice/)

| Door | G | F | O | Lands on |
|---|---|---|---|---|
| (arriving) | → sim public front door, 1 replace hop, before paint | room (free) | room (owner) | — |
| Brand / ← Home / footer Home | — | home | home | /preview-home/ |
| Buy card (free only, exactly one) | — | checkout | — | /get |
| Exam cover + "Take the final exam" (×29) | — | sim ?exam=\<slug\> | same | every slug is in the sim's registry — the sim router accepts all 29 (asserted) |
| "Quick practice" (×29, quiet) | — | sim ?exam=\<slug\> | same | the sim's check-in carries Quick Practice as its own quiet link (owner rule); promote item P3 adds a direct parameter |
| Misses card · Review misses (hidden when the account has no attempts) | — | sim root | sim root | deck lives in the sim — see P4 |
| Footer · Library / Terms / Refund | — | as home | as home | — |

### Retirement routing (demonstrators — model the post-promote rules)

| Route | G | F/O | Production change it maps to |
|---|---|---|---|
| retire/root.html = bytebarhq.com/ | stays on the storefront (the real one) | → the home (1 replace hop) | P1: the root serves the home to any valid session; guests keep today's storefront byte-identical |
| retire/sim-root.html = sim root + sim home | stays on the public sim (10 free questions) | → the practice room (1 replace hop) | P2: the sim's root/home, for a signed-in session, hands off to the room; the quiz engine, brief, results and game layer are untouched — only the sim's home *screen* retires |

### Exit + edge routes

- **Sign-out** (inherited, unchanged): sim profile → sign out clears
  the shared cookie everywhere → the sim shows its guest home; the
  BYTEBAR brand there leads to the storefront; revisiting the home
  with no session hands off to the storefront. No page strands a
  signed-out user.
- **Signed-out deep link** (e.g. a bookmarked practice room):
  hands off to the sim's public front door, which carries the
  sign-in door — never a blank, never a loop.
- **Expired/invalid session**: resolves to "no session" and follows
  the guest route exactly (verified with a corrupted stored token).
- **Back button**: room → home (normal history); arriving via a
  retirement hop uses replace(), so Back skips the hop page and
  lands on whatever came before it — the hop can never re-fire.
- **Data failure** (Supabase unreachable): the home renders a
  doors-only fallback (Library + practice room), the room keeps its
  static grid with real doors; neither page can sit blank.
- **Review aid (preview only)**: `?as=free` on either page renders
  the free chrome over the signed-in account's real data, so the
  free layout can be reviewed without a second account. Production
  derives state from profiles.pro only; the parameter ships
  nowhere. It is the one deliberate extra edge in this preview.

### Loop / dead-end proof (measured — see verification record)

- Every redirect in the system is a single replace() hop whose
  destination never routes back: home→storefront (guest only;
  the storefront does not redirect), room→sim (guest only; the
  sim does not redirect signed-out visitors), stubs→home/room
  (signed-in only; neither destination redirects a signed-in
  user). Maximum chain observed: 1. Cycles: 0.
- Every reachable page offers a way home and a way forward
  (asserted per page/state in the walk).
- Every internal link on both wired pages resolves (crawl: all
  200 after at most the known library-stub hop).

## What the mock had that wiring removed — honestly

- **Book progress** (Continue "Chapter 18 of 31 · 58%", shelf
  bars): no source exists. Continue is now the account's real
  practice focus; the shelf is doors only. (P6)
- **Misses counts** ("12 waiting · about 12 min"): the deck is not
  synced. Doors remain, counts are gone until P4.
- **"Threats Week" challenge**: invented for the mock. The wired
  card runs the sim's real weekly challenges (Sharp Week /
  Bookworm Week / Keep the Fire) with derived progress.
- **SY0-801 practice card**: the sim has not seated SY0-801 yet —
  its deep link would fall through the sim router to the sim home
  (a soft dead end), so the card is out until the sim seats it
  (the Dec 1 seating adds DVA-C03 the same way → 30 cards).
- **Level "7 · Scholar"** on the Practice door: the sim's levels
  are named tiers, not numbers. The door now shows real XP and
  the real tier name.

## Promote checklist (in order — nothing here is done yet)

- **P1 · Root routing.** bytebarhq.com/ serves the wired home to
  sessions with a valid login (free variant for non-pro, owner
  variant for pro); guests keep the current storefront
  byte-identical. Reuse the live owner-state detection + the
  no-flash guard, extended to the home's regions.
- **P2 · Sim retirement.** The sim root and the sim's home screen,
  for signed-in sessions, hand off to the practice room (one
  replace hop); guests keep the public sim exactly as today. The
  sim's internal "Home" targets and logo for signed-in users
  point at the one home.
- **P3 · Quick Practice parameter.** Sim router accepts
  `?exam=<slug>&practice=1` → routes owners straight to the Quick
  Practice check-in (renderBrief taste), so the room's quiet link
  lands in one hop instead of via the check-in's own quiet link.
- **P4 · Misses count sync.** The sim includes a per-exam deck
  count summary in the profiles.data push (one small object), so
  the home's misses door and the room's misses card can carry the
  real count + the sim's ~1 min/question estimate again, and the
  misses doors can deep-link the deck (with a `?deck=<slug>`
  router seat in the sim).
- **P5 · Challenge counters sync.** The sim includes its weekly
  challenge counters + week key in the same profiles.data push;
  the home then reads them directly instead of deriving from
  attempts (removes the UTC/local bucketing note).
- **P6 · Watch progress (optional, larger).** If book progress is
  wanted on the home/shelf, the library watch pages need to record
  per-account chapter progress (a small table + a write on chapter
  open/complete). Until then the shelf stays doors-only.
- **P7 · Re-verify at promote.** Re-run this preview's full suite
  (states × pages × viewports, route walk, link crawl) against
  the production routes before the old sim home is retired, and
  re-check home-vs-sim numbers side by side on the real account.

## Verification record

Run 2026-11-19 (verify/verify_wired.mjs, results in
verify/results-wired.json): **104 checks, 0 failures.**

- **Number truth, three ways.** The sim's own scoring functions,
  extracted verbatim from its source, were run against an
  independent port and against the fixtures: goal, streak, level,
  focus exam, readiness % / evidence / weakest domain / per-domain
  mastery, and weekly challenges agree exactly for all three test
  accounts. The wired pages inject the sim's source text itself, so
  the home and the sim cannot drift apart.
- **States walked end to end** in headless Chrome: guest (home →
  storefront in exactly 1 replace hop; room → public sim; both
  retirement stubs keep guests on the public destinations), owner
  (full home: real greeting, briefing with the real weakest domain,
  Continue at the real readiness, goal ring, streak, challenge,
  report card with all five domain bars matching the model, owner
  chip, no buy door), free (real goal/streak, readiness honestly
  withheld below the evidence bar, locked challenge teaser, exactly
  one gold buy door), fresh owner (every element in its honest
  empty state; misses card hidden), corrupted session (no loop,
  ≤3 hops, never a blank page), and the ?as=free review aid (free
  chrome over the account's real numbers).
- **Route walk.** Every retirement hop measured at exactly 1
  replace; back-button after a hop never lands on the hop page;
  back from the practice room returns home. Link crawl: 44 unique
  doors collected from the rendered owner home + practice room —
  all resolve 200, none needs more than 1 redirect hop, no cycles,
  and every exam deep link names a seated registry slug.
- **Render audits** (390px + 1280px, every page × state): zero
  horizontal overflow, no out-of-viewport elements, header fits,
  zero JS errors, zero failed subresources (favicon aside;
  PostgREST's 406 "no row" answer excluded as the API's normal
  empty read). Every interactive label and status line verified on
  one line; exam-name titles and readiness domain names are data
  typography and may wrap inside their card/row (same as the sim).
- **Method note.** This VM holds no Supabase service-role key and
  the license keys are sellable inventory, so signed-in states were
  verified with the backend stubbed at the network edge using
  fixtures in the backend's exact response shapes, while the
  page's real auth storage, queries, math, and routing ran
  unstubbed; guest and corrupted-session flows ran fully live.
  The owner's own signed-in open is the final real-data check:
  he should see his name, his goal and streak, and the same
  readiness the simulator shows him.
- **Untouched surfaces.** Live homepage, live simulator, library,
  and the approved mock verified byte-identical before and after
  the whole build (checksums in the build folder).
