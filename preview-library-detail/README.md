# ByteBar Library — designer detail pass PREVIEW (not live)

The finishing system Cori approved and promoted on the homepage
(2026-11-16), carried to the library: library home, all 29 book
pages, all 6 watch pages. Same layout, same copy, same prices, every
href identical to live (build-asserted). Treatments by role, never
everything a button: gold = buy · solid = main action · outline =
secondary · text link + arrow = quiet next step.

The treatment lives in the real builder
(`preview-library/build_preview.py` → `detail_inject`, gated behind
`BB_DETAIL=1` so ordinary builds — including the hourly runner's live
builds — stay byte-identical until promotion). The two Linux+ pages
are staged from live-dist, which sits ahead of the builder (Ch 17
chapter data), with the identical treatment applied — no chapter
data regresses in this preview.

## Change list — what was off → what it is now

### Nav (every page in this set)
- The gold "Get ByteBar Complete" button sat inside the collapsible
  link list, so at phone widths it hid behind the ☰ menu — the exact
  defect Cori caught on the homepage this morning → the button moves
  into a `.nav-right` wrapper and stays in the bar at ≤1100px, burger
  last, exactly the homepage's fix. Book/watch buttons gain the
  two-span label (full "Get ByteBar Complete" → short "Get Complete"
  at ≤720px, the swap the book pages' own stylesheet already defines;
  the library home's button already carried its spans). The anchor
  keeps its classes and href, so the owner-state script still finds
  every gold door — verified in the owner simulation below.

### Library home
- Section padding was a patchwork — a 76px base buried under one-off
  inline tops (36 / 16 / 16 / 8px), so the page breathed unevenly →
  the inline tops are out; one rhythm: 56px sections (44px phones),
  same as the homepage.
- Phone hero kept the desktop 80px top padding → 56px on phones.
- Book grids used an 18px gap, shelves a 20px group margin → the
  shared tokens: 16px card gap, 28px groups.
- The footer's stray 20px top margin stacked on the last section's
  padding → removed; rhythm + footer padding do the work.
- The three step links ("Watch the Security+ first chapter →" …)
  measured 16px tall — too small to tap — and were styled ad hoc →
  they take the quiet-link execution (refined 1.5px underline,
  softened until hover) and a real tap height (~30px). The footer's
  "Already bought it? Claim your Library →" takes the same execution.

### Book + watch pages
- Book grid gap was 20px → the 16px token.
- Footer stray top margin → removed (same as home).
- Watch pages: "← Back to the chapter index" measured 23px tall →
  ~33px tap height, the size the sim's back link was fixed to.
- The player panel's quiet link (the sign-in note under the Complete
  panel) was a plain hover-underline → the on-dark text-link
  execution (accent #7ee7f7, refined underline, softened until hover).

### Everywhere in this set
- Keyboard focus had no designed treatment → one visible focus ring
  (:focus-visible, cyan, offset) for every interactive element. The
  library search pill keeps its own :focus-within treatment (its
  input takes no second ring); the account panel's input keeps its
  own higher-specificity ring.
- Text selection was the OS default blue → a soft gold tint, on brand.
- Mobile tap-flash on links → removed (buttons already had it).
- Ghost buttons had no hover → they answer the pointer like their
  siblings (cyan edge + ink).

## Deliberately untouched
- Owner state, byte for byte in behavior: signed-in Complete owners
  are never sold to — the owner script, the account panel, chapter
  locking and the signing flow are unchanged; the gold-door selector
  still matches every door it transformed before.
- All copy, prices, chapter data and hrefs (build-asserted identical
  to the live pages, including Linux+ Ch 17's live data).
- The crumb row's inline text links (breadcrumb prose, not doors).

## Gates run on this preview build
- 390px + 1280px headless-Chrome render audit on the staged set:
  no horizontal overflow, no clipped or cropped element, the nav
  gold button visible in the bar at 390px on home / book / watch,
  no button label wraps or spills, step links and the watch back
  link at their new tap heights.
- Owner-state simulation (the shared site harness, pointed at this
  build): owner → no gold buy doors remain, "You own ByteBar
  Complete" renders; guest → doors intact. 39/39 as on live.
- Flow walk: every relative link resolves inside the preview set;
  buy doors land on the one live /get path.
- Language sweep: no internal/demo wording; the free chapter is
  never named "Start Here".
- Served check after deploy: sha256 of every file equals its
  served bytes.

## Rebuild / deploy
- `python3 build_preview_library_detail.py` — runs the real builder
  with the detail gate on, stages this folder, re-derives the two
  Linux+ pages from live-dist, and runs the guards above.
- `python3 deploy_preview_library_detail.py` — pushes this folder's
  pages + this README to `ByteBarHQ/bytebar-landing` at
  `preview-library-detail/` via the Git Data API and verifies the
  served bytes match. Preview only; nothing live is touched.
