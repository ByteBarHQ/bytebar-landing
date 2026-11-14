# ByteBar Library — production-wiring preview (STAGED, not live)

The first end-to-end proof of the owned library's customer path, built
2026-11-14 from the approved surfaces. **Preview only**: these pages deploy
to `bytebarhq.com/preview-library/`, carry `noindex`, and are not linked
from any live page. The live `/library`, homepage, and simulator are
untouched.

## The tap-through

1. `index.html` — the approved library home ("Find your book"). The
   Security+ card is wired: its name opens the book page, **Watch free**
   opens the player.
2. `book-secplus.html` — the Security+ book page with the **full
   31-chapter index**: the first chapter free and playable, Chapters 1–30
   shown locked under ByteBar Complete framing, the Final Exam row seating
   into the Simulator.
3. `watch.html` — the free first chapter's player. On load it asks the
   signing service for a fresh signed Bunny embed URL and hands it to the
   player iframe. Nothing unsigned is ever embedded (Bunny's token
   authentication would refuse it anyway).
4. `buy.html` — the approved ByteBar Complete checkout surface, $9.99.
   Design only until the Square checkout build
   (`~/workspace/your_files/bytebar-square-checkout-spec-20261111.md`) lands.

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

## What stands between this preview and a playing chapter

Two steps, both in human hands (see the function's `DEPLOY.md`):

1. **Deploy** `library-sign-url` to the Supabase project
   (`duutviqszajmmoskvdfy`) — dashboard paste or `supabase functions deploy`.
2. **Paste the Bunny token authentication key** into the function's
   secrets as `BUNNY_TOKEN_AUTH_KEY` (Bunny dashboard → ByteBar Library →
   Security → General → "Token authentication key").

Until both land, `watch.html` shows its designed "Couldn't load this
video" state — that is the honest preview state, not a bug.

## Rebuild / redeploy

- `python3 build_preview.py` — regenerates the four pages from the
  approved sources in `hidden_files/site-overhaul-2026-11-12/`.
- `python3 deploy_preview.py` — pushes this folder's pages to
  `ByteBarHQ/bytebar-landing` at `preview-library/` via the Git Data API
  (the same route the TikTok poster uses for staging) and verifies the
  preview URLs serve.
