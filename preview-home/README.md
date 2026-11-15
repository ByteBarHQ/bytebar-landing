# ByteBar homepage refresh — PREVIEW (not live)

Cori 2026-11-14: the landing page must present the ENTIRE system —
video-book Library + practice-exam Simulator as one customer journey —
flowing in sales order. Story/flow/copy refresh inside the kept live
style; NOT a redesign. The live homepage at `/` is untouched.

## What changed vs live

- **Hero** — sticker now "LEARN IT · PROVE IT · PASS IT"; the subhead
  presents both halves (video books that teach + practice exams that
  mirror test day; all 28 exams, one price, yours forever). Buy CTA
  leads; the free quiz is the secondary CTA. "1,000 questions each" is
  gone from the hero.
- **How It Works** moved up to position 2 and rewritten as the spine:
  Learn (watch the book) → Prove (sit the practice exam) → Pass (walk
  in ready), with free doors to both halves.
- **Library** moved up behind it and strengthened: what the books are,
  first chapter free in every book, Security+ live now (31 chapters,
  ~6 hours), every book ends in the Simulator's final exam.
- **Simulator** story follows: live demo, then the 28-exam section
  (new headline — mirrors its real exam; the total-bank figure appears
  once here as a spec line), method, features, terminal demo.
- **The Racket** now sits directly before Pricing as the price
  contrast. Pricing is unchanged: one card, ByteBar Complete $9.99.
- **FAQ** — the free-trial answer now covers both free doors (first
  chapter free + 10-question taste); per-exam question counts removed.
- Per-exam counts ("1,000 questions each/per exam") removed from every
  headline position page-wide. All hrefs are byte-identical to live.

## Rebuild / redeploy

- `python3 build_preview_home.py` — regenerates `index.html` from the
  live `../index.html` with asserted exact-string edits + a section
  reorder. Fails loudly if the live page drifts.
- `python3 deploy_preview_home.py` — pushes `index.html` + this README
  to `ByteBarHQ/bytebar-landing` at `preview-home/` via the Git Data
  API and verifies the served bytes match.
