# ByteBar /get + claim + success — designer detail pass PREVIEW (not live)

The finishing system Cori approved and promoted on the homepage
(2026-11-16), applied to the checkout surfaces: /get (cream),
claim and the /get success page (both dark — they share
checkout.css). Same layout, same copy, same prices. Every script —
payment and owner logic included — is byte-identical to live
(build-asserted); the payment page itself (checkout.html) is not
part of this preview and is never copied or modified here.

## Change list — what was off → what it is now

### All three pages
- Keyboard focus had no designed treatment on any of them (the /get
  form strips input outlines; links and buttons had nothing) → one
  visible focus ring for every interactive element: cyan at the
  homepage's strength on cream, the dark sheet's own cyan on the
  dark pages.
- Text selection was the OS default blue → a soft gold tint on /get;
  on the dark pages, a cyan tint in their own accent.
- Mobile tap-flash on links → removed.
- The one quiet link each page carries was styled inline, ad hoc
  (/get's "claim it here" in the promise strip; the access-guide PDF
  link on claim's granted state and on the success page) → all three
  take the homepage's text-link execution: their page accent,
  refined 1.5px underline, softened until hover. They stay text
  links — their role — not buttons.

### Claim
- The hero carried a one-off inline padding override (20px against
  the sheet's own 28px) → removed; the sheet's rhythm stands.
- Card stacks used a 14px gap (the dark sheet's own value) → the
  site's one card token, 16px (stack gap and panel-to-panel margin).

### Success
- Card stack gap → the same 16px token.
- Everything else is the shared dark treatment above; the sign-in
  card, the next-step cards and all state logic are untouched.

### /get
- Beyond the shared treatment: nothing. The cream page already sits
  on the 16px card token with the unified gold finish; its spacing
  audited on-rhythm at 390px and 1280px.

## Preview-only differences (never promoted)
- noindex on all three pages.
- /get's buy button points at the live payment page
  (https://bytebarhq.com/get/checkout.html) instead of the relative
  "checkout.html", which would 404 outside /get/ — so this preview
  has no dead end. One href differs from live, this one, documented.
- checkout.css ships in this folder byte-identical to both live
  copies (claim and success share it) purely so the two dark pages
  render; the detail styles ride inline in each page's head, after
  the stylesheet link, so the sheet itself never changes.

## Observed, not changed (flagged for Cori)
- The buy journey changes dialect mid-stream: /get and the payment
  page are cream; the success page and claim are still the dark
  sheet. This pass finishes each page in its own dialect rather
  than redesigning — a cream conversion of success/claim is a
  separate decision.

## Gates run on this preview build
- 390px + 1280px headless-Chrome render audit: no horizontal
  overflow, no clipped element, every button checked — no label
  wraps or spills; the /get owner state renders with no buy pitch.
- Guards in the build: scripts byte-identical to live, visible text
  identical, hrefs identical except the one documented change.
- Flow walk: /get → live payment page (one buy path), claim →
  Library/Simulator doors, success → Library/Simulator doors.
- Language sweep: no internal/demo wording.
- Served check after deploy: sha256 of every file equals its
  served bytes.

## Rebuild / deploy
- `python3 build_preview_get_detail.py` — regenerates this folder
  from the live sources with asserted exact-string edits; fails
  loudly if a live page drifts.
- `python3 deploy_preview_get_detail.py` — pushes this folder to
  `ByteBarHQ/bytebar-landing` at `preview-get-detail/` via the Git
  Data API and verifies the served bytes match. Preview only.
