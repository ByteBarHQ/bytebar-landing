# Preview: owner-state flash fix (homepage)

Cori 2026-11-18: the landing page "flashes the correct landing page
for a second, then it's the other without the gold button." Diagnosed
from the live page's own code: a signed-in owner sees the sales page
paint first, then the owner-state script (async: Supabase session +
profiles.pro, two round trips) swaps the gold buy doors to "Open the
Library" and replaces the pricing pitch. Guests and free accounts
never trigger the swap — it is owner-only, and Cori sees it because
his phone is signed in as the owner.

## The fix — three edits, nothing else

1. **Head guard script** (synchronous, in `<head>` before the first
   stylesheet): if a Supabase auth session appears stored — the
   chunked auth cookie `sb-duutviqszajmmoskvdfy-auth-token[.N]`, or
   the same key in the localStorage mirror with no sign-out
   tombstone — add class `bb-pending` to `<html>` before first
   paint, and arm a hard **2500ms safety timeout** that removes it
   unconditionally. No stored session → no class → guests get
   byte-identical behavior.
2. **Pending CSS** (`<style id="bb-pending-css">`): while
   `html.bb-pending` is set, exactly the elements the owner script
   can swap (gold buy doors to /get, `#pricing`, `.price-card`,
   `#stickybuy`, the account link) are `visibility:hidden` — layout
   preserved, so nothing jumps when they resolve. Everything else
   paints normally.
3. **Removal hooks in the owner script**: it now removes
   `bb-pending` on every resolution — the non-owner early return,
   the end of the owner swap, and the catch. Its pre-chain early
   returns (Supabase CDN missing) are covered by the safety timeout.

Same owner swap, same copy, same design. The build script
(`build_preview_ownerflash.py`) proves it: strip the three edits
from the preview and the live file comes back byte-for-byte; href
lists and visible text are identical to live.

## Viewing

Deployed as a preview only, at **https://bytebarhq.com/preview-ownerflash/**
(live homepage untouched). On a signed-out browser it looks exactly
like the live page. Signed in as an owner, the buy doors and pricing
pitch simply never appear in their sales form — the page settles
straight into the owner version with no flash and no layout shift.

## Promote path (only on Cori's word)

Rebuild from the then-current live `../index.html` with
`build_preview_ownerflash.py`, re-run the two-state verification,
then apply the same three edits to the live file and deploy through
the normal homepage promote flow.
