# Alpine bar-graph — prop-shape feedback (DEFERRED)

Captured 2026-06-22 from the Make evaluation of candidate-002 (dual props live).
Status: **deferred** — do NOT implement yet; park for the prop-shape pass.

## 1. Optional fields shouldn't read as empty — "default to what actually appears"
- **Bar Color** shows a `#RRGGBB or none` placeholder while the bars render blue
  (`#2563EB`, the Alpine primary). The field should be **pre-filled with the
  resolved default** so the human sees the color actually in use — not an empty
  box they have to guess at.
- **Min Value / Max Value** are empty optional number boxes — "I don't immediately
  know how to use them because they're empty." Same principle: surface the
  **auto-derived domain** (e.g. `0` and the nice-max) so they read as editable
  current values, not blanks.
- General convention: an OPTIONAL prop whose effective value is always *something*
  (color, domain) should show that effective value, not a placeholder. Likely
  applies to other templates too.

## 2. "Speed" → "Intro length as % of the clip"
- Replace the abstract **Speed** slider with a **duration-as-percentage** control:
  "the clip is X seconds — what % of it does the intro animation occupy?"
  Ratio-based, which is what humans want.
- **Design note (blocker for the current syncsTo):** a fixed linear `syncsTo`
  map can't reference the clip duration. Cleanest fix = give the template an
  `anim.introFrac` (fraction of `ctx.target.durationMs`) that `render()` resolves
  into the absolute per-bar `durationSec`/`staggerSec` (mirrors
  `stat-card`'s `introFrac`). The human "Intro length %" slider then identity-maps
  to `introFrac`. So this is a template change + a small render reconcile, not
  just a Make-form tweak.

## Not-yet-evaluated
- Whether the sliders drive the render correctly (Animate off → static,
  Gridlines/Value labels toggles, Speed). Confirm on resume.
