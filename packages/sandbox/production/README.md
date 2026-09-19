# `production/` — the v1 ship gate ledger

One directory per template under **production review** for the v1 cut. This is
the sandbox flavor of the pack-by-pack triage tracked in
`.scratch/claude/v1-template-cut.md`: the chart holds the row-level verdicts
(flags / gate / preview / news / cover-tutorial); each directory here holds the
**visual push-to-prod gate** for one template — a reviewable `.mosaicx`, its
drift-immune `.mosaic` twin, and the accumulated dated renders as the
historical trail.

## Structure

```
production/<template-slug>/            e.g. alpine-bar-graph-v1/
  master_candidate-01.mosaicx          the prod-gate candidate (showcase props + agent QnA)
  master_candidate-01.mosaic           frozen twin — resolve --flatten at mint time, NON-NEGOTIABLE
  master_candidate-01.<stamp>.mp4      dated renders (gitignored; local history)
  master_candidate-02.*                iterations, if the gate is rejected
  master.mosaicx / master.mosaic       promoted on human approval — the shipped state
```

Slug = template id, kebab: `@m0saic/alpine/bar-graph/v1` → `alpine-bar-graph-v1`.

## Rules (inherited from `../agent.md` — read it first)

- **Template-build closeout flavor applies.** `master_candidate-NN.mosaicx` is
  the final quality gate; a bare `master.mosaicx` exists only AFTER human
  approval (promote by rename). Rejected gates stay frozen; fixes ship as the
  next NN.
- **Freeze the `.mosaic` twin the instant a candidate is minted** — and freeze
  `_humanedits.mosaic` BEFORE touching template source on any negative return.
- **One template, one directory, one open question at a time.** The chart is
  the index; this ledger is per-template depth.
- **Handoff is Make-first:** `m0saic open <dir>/master_candidate-NN.mosaicx --make`.
  Make ADOPTS the ledger file as the agent-persistence path — the founder
  feels the knobs, renders land per `suggestedOutput` (this directory), and
  the verdict + `_humanedits.mosaic` persist right here. Plain `m0saic open`
  (Run page) is the fallback when the question is one render, not the knobs.
- Directories are minted **as each template reaches review** — not
  pre-scaffolded for all 101 (template source drifts; a gate minted weeks early
  gates stale code).
- Renders are **not committed** (package `.gitignore`); the committed artifacts
  are the `.mosaicx` recipes and `.mosaic` twins, which re-render the exact
  judged states. `response.src` pointers carry the dated-render provenance.
- Templates that are pure engine internals (never render standalone — chart
  internals, qr-stamp wraps) are gated in the CHART only; no directory here.
