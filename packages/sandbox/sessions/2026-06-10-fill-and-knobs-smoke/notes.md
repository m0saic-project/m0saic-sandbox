# Session — fill-and-knobs smoke (2026-06-10)

## Purpose

End-to-end visual sign-off on every `M0cFile` knob after the
Phase-1 rect-fill rework. Each candidate isolates one field (or
one knob within a field) so a regression in the inspector shows up
in exactly one file. Candidate `14-everything.m0c` is the canary —
if any future change drops a field on round-trip, that file is the
fastest place to notice.

All candidates share the same layout for visual comparability:

- m0: `4(F,F,F,F)` → canonical `4(1,1,1,1)`
- canvas: 1920×1080
- four frame stableKeys: `r/fc0`, `r/fc1`, `r/fc2`, `r/fc3`
- created: `2026-06-10T12:00:00.000Z` (fixed for determinism)

Candidates were emitted by `generate.mjs` using
`serializeM0cFile` from `@m0saic/dsl-file-formats`, so on-disk
shape is correct by construction. To regenerate:

```
cd packages/sandbox/sessions/2026-06-10-fill-and-knobs-smoke
node generate.mjs
```

### Iteration convention — `-a` / `-b` suffixes

One file = one question = one official human response. The `response`
is the canonical human verdict for the file's exact state at the time
it was given. When iterating on a rejected candidate, **never mutate
the original** — it would invalidate the verdict and collapse the
iteration trail.

Instead, fork the file with a `-a` (then `-b`, `-c`) suffix carrying
the fix and the rewritten question. The original stays frozen with
its rejection. The new file's `agent.note` and a cross-reference
comment explain what changed and link back to the previous iteration.

This session contains three live examples:

- `candidate-09-background-image.m0c` (rejected — 1×1 PNG invisible at
  true scale) → `candidate-09-background-image-a.m0c` (256×256 PNG,
  approved).
- `candidate-12-agent.m0c` (rejected — placeholder regions
  `K1..K4`) → `candidate-12-agent-a.m0c` (real stableKeys, approved).
- `candidate-14-everything.m0c` (rejected — same regions issue +
  missing rank sets) → `candidate-14-everything-a.m0c` (regions
  fixed, rank-sets-coverage delegated to candidate-10 per follow-up,
  approved).

### Leaving feedback inline

Every candidate carries an `agent` block with a `note` + `question`
keyed to what that file exercises. To sign off (or push back) on a
candidate, populate the `agent.response` field inside the `.m0c`
itself — that's the productionized review trail:

```json
"agent": {
  "id": "claude-smoke-2026-06-10",
  "note": "...",
  "question": "...",
  "response": {
    "body": "Your reply here.",
    "from": "human",
    "at": "2026-06-10T15:00:00.000Z"
  }
}
```

Candidate 12 (`candidate-12-agent.m0c`) ships with a sample
`response` + 2-comment thread pre-filled — replace the body to leave
real feedback, or use it as a template for the others.

## Candidate index

| # | File | Knob exercised | What to look for in Mosaic Desktop |
|---|---|---|---|
| 01 | `candidate-01-bare.m0c` | none (baseline) | Four uniform rects when Rects toggle is on. Every overlay should be empty. |
| 02 | `candidate-02-labels-text-only.m0c` | `labels[k].text` | Labels toggle shows four plain text chips (alpha/beta/gamma/delta) — no tint. |
| 03 | `candidate-03-labels-chip-color.m0c` | `labels[k].color` (chip tint) | Labels show with **tinted backgrounds**. Critical: this MUST NOT drive the rect fill. Rects should still show the uniform Rects-toggle color. |
| 04 | `candidate-04-fill-color.m0c` | `fill[k].color` | With the new Fill sub-toggle ON, each rect picks up its per-frame color (pale steel / orange / dark gray / near-black). |
| 05 | `candidate-05-fill-media.m0c` | `fill[k].mediaRef` | mediaRef values round-trip; no inspector resolver yet, so visually the rects fall back to the uniform Rects color. File-details should show the mediaRef strings per frame. |
| 06 | `candidate-06-fill-both.m0c` | `fill[k].color` + `fill[k].mediaRef` | Both fields present per entry. Color paints the rect today; mediaRef sits as a placeholder until the resolver lands. |
| 07 | `candidate-07-masks.m0c` | `masks[k]` | Masks toggle shows two circle silhouettes (K1/K2) and a rect silhouette (K3). K4 is explicitly `null` — "no mask" — and stays a full rect. |
| 08 | `candidate-08-background-color.m0c` | `derive.background` (hex) | Canvas tints dark slate (`#14151b`); rects render on top. |
| 09 | `candidate-09-background-image.m0c` | `derive.background` (data: URI) | Canvas should render a 1×1 red PNG stretched to fit. |
| 10 | `candidate-10-rank-sets.m0c` | `rankSets` | A `diag` set distributes `0, 0.33, 0.66, 1` across the four frames. Surfaces in rank-aware overlays / templates. |
| 11 | `candidate-11-meta-app.m0c` | `meta` (title/author/source/note) + `app` / `appVersion` | File-details panel should show every meta field populated and the bumped app version. |
| 12 | `candidate-12-agent.m0c` | `agent` block | Agent panel should surface note + question + regions registry + response + 2-comment thread. |
| 13 | `candidate-13-custom.m0c` | `custom` free-form JSON | Inspector's custom-JSON view should round-trip a brand/copy/flags payload unchanged. |
| 14 | `candidate-14-everything.m0c` | ALL of the above | Every knob populated. Canary for round-trip field-drop regressions. |
| 09-a | `candidate-09-background-image-a.m0c` | Iter A of #09 | 256×256 brand-orange PNG, true-scale wording. Approved. |
| 12-a | `candidate-12-agent-a.m0c` | Iter A of #12 | Real-stableKey regions (`r/fc0..r/fc3`). Approved. |
| 14-a | `candidate-14-everything-a.m0c` | Iter A of #14 | Real-stableKey regions; rankSets intentionally null (covered by #10). Approved. |

## v2 semantic note

Before this session's series, the inspector treated `labels[k].color`
as the rectangle fill. That has been demoted: `labels[k].color` now
only tints the label badge UI. The rect fill source is the new
top-level `fill[k].color` field.

Candidate 03 vs 04 are the load-bearing comparison:

- **03** puts color on labels only → chips tint, rects stay uniform.
- **04** puts color on fill only → chips are plain, rects fill per-frame.

If those two look the same in the inspector, the toggle wiring is
still reading the old `labels[k].color` path and needs the Phase 2
rename (`useLabelColorsForRects` → `useFillColors`, source switches
to `fill[k].color`).

## Sign-off checklist

Tick a box once you've answered the candidate's `agent.question`
inline (and dropped a `response` if there's anything to flag).

- [ ] 01 — bare baseline: nothing in any overlay
- [ ] 02 — labels: four plain text chips
- [ ] 03 — labels with chip color: badge tint, rect fill UNCHANGED
- [ ] 04 — fill color: rect fill per-frame
- [ ] 05 — fill mediaRef: round-trips on disk (no render yet)
- [ ] 06 — fill both: color paints, mediaRef preserved
- [ ] 07 — masks: two circles + one rect, one explicit-null
- [ ] 08 — background color: dark slate canvas
- [ ] 09 — background image: 1×1 red stretched
- [ ] 10 — rank sets: sweep visible / consumable downstream
- [ ] 11 — meta + app: all fields visible
- [ ] 12 — agent: note / question / regions / response / comments
- [ ] 13 — custom: round-trips unchanged
- [ ] 14 — kitchen sink: every knob simultaneously
