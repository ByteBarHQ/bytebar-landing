# ByteBar Library — production-wiring preview (STAGED, not live)

> **PROMOTED TO LIVE 2026-11-14** (Cori: "wire this up overall, sim
> and library"). `build_preview.py` now takes a target: `live` emits
> the same four pages without `noindex` into `live-dist/`, and
> `deploy_live.py` publishes them to `bytebarhq.com/library/` in one
> commit with the homepage (which gained a Library section; its nav
> already linked `/library/`). The live home also carries a Simulator
> door under the price card ("Practice Exam Simulator — included with
> ByteBar Complete"), added by the builder for both targets. The
> homepage received a full tidy pass in the same launch (Library-first
> nav order, ByteBar Complete naming on purchase CTAs, YouTube
> link/framing removed). This preview tree stays up, untouched, as the
> review surface. `/library/index.html` previously served the
> simulator's exam index; the per-exam pages under `/library/` are
> unchanged.

The customer path of the owned library, wired end to end. **Preview
only**: these pages deploy to `bytebarhq.com/preview-library/`, carry
`noindex`, and are not linked from any live page. The live `/library`,
homepage, and simulator are untouched.

## The tap-through

1. `index.html` — the approved library home ("Find your book"). The
   Security+ card is wired: cover and name open the book page, **Watch
   free** opens the player. Every "Get ByteBar Complete" goes to the buy
   sheet. The other books' cards keep their approved state (Watch free →
   the "Sample the real thing" section), and that section now carries
   real links: the Security+ first chapter, the simulator, the buy sheet.
2. `book-secplus.html` — the Security+ book page with the **full
   31-chapter index**: the first chapter free and playable, Chapters 1–30
   locked — each locked row leads to the buy sheet — and the Final Exam
   row seating into the Simulator. Chapter titles are the book's real
   titles (from `scripts/secplus/*.narr.json`); total runtime is the
   measured 6H 17M of the banked chapters.
3. `watch.html` — the free first chapter's player. On load it asks the
   signing service for a fresh signed Bunny embed URL and hands it to
   the player iframe. Nothing unsigned is ever embedded (Bunny's token
   authentication would refuse it anyway). The "Up next" card leads to
   the buy sheet; the back link returns to the chapter index.
4. `buy.html` — the ByteBar Complete sheet, $9.99. Until the Square
   checkout build (`~/workspace/your_files/bytebar-square-checkout-spec-20261111.md`)
   lands, the sheet carries no fake card fields: its one action,
   "Continue to secure checkout", hands off to the simulator storefront,
   where Complete is actually sold at $9.99 today — the same destination
   the approved library home's price card used. The Square build swaps
   the handoff for native fields on this same sheet.

## Finish pass (2026-11-14, Cori: "needs a little clean up so it doesn't
feel like a mock")

The first build mixed two design systems: the home in the live site's
clothes, the book/watch/buy pages in the shelved v2 dark system — a
different header, footer, and buttons, dead footer links (FAQ / Contact
/ Privacy / Terms / Refunds with no href), an inert header search and
Sign-in span, inert locked chapter rows, an unverified five-star
Trustpilot claim, a wrong total runtime (7H 24M), four chapter titles
that weren't the chapters' real titles, no meta descriptions, and no
favicon. All four pages are now built on the one live system (the
builder extracts the library home's stylesheet as the shared core);
book/watch/buy are generated from live-idiom templates in
`build_preview.py`. The v2 sources in
`hidden_files/site-overhaul-2026-11-12/` are untouched.

## Share card (2026-11-14 polish)

The set's og:image is its own asset, `og-image.png` — the framed
BYTEBAR / IT Exam Prep brand card, polished per Cori's screenshot
notes: content block measured and centered in the frame, the stray
rule under the wordmark removed (the accent divider now sits between
the product-type line and the spec line), the "bytebarhq.com" line
replaced by the spec line "VIDEO BOOKS · FIRST CHAPTER FREE IN EVERY
BOOK", and the circuit traces masked out of the type zone. Built by
`build_og_card.py` (the root `/og-image.png` that fronts the live
homepage is a separate file and is untouched).

## How the signing works

Bunny library **809286** ("ByteBar Library") has Embed view token
authentication ON, so an embed plays only with a token:
`SHA256(tokenAuthKey + videoId + expires)`. The key is a secret and never
touches the browser or either repo. The Supabase Edge Function
**`library-sign-url`** (`~/workspace/quiz-saas/supabase/functions/library-sign-url/`)
holds it as a function secret, checks the request against its server-side
catalog (the free first chapter mints for anyone; paid chapters will
require the account's Pro flag — the simulator's existing entitlement,
grandfathered), and returns only the signed URL.

**Status: LIVE.** The function is deployed and `BUNNY_TOKEN_AUTH_KEY` is
set (both done 2026-11-14 with Cori's approval); the preview player
plays the free chapter end to end, verified live 2026-11-14.

## Rebuild / redeploy

- `python3 build_preview.py` — regenerates the four pages (index from
  the approved `library-live.html` source; book/watch/buy from the
  live-idiom templates in the builder, sharing that source's CSS).
- `python3 deploy_preview.py` — pushes this folder's pages to
  `ByteBarHQ/bytebar-landing` at `preview-library/` via the Git Data API
  (the same route the TikTok poster uses for staging) and verifies the
  preview URLs serve.
