# Code snippet morph v1 — phase-gated review

This session freezes the phase-gated visual checkpoints for
`@m0saic/code/snippet-morph/v1`.

- `candidate-001.mosaic` preserves the template's one-step pipeline output.
- `candidate-002.mosaic` is the same first at-rest document, extracted for the
  native still-image review path. Its first handoff exposed that Make's in-page
  loader dropped otherwise-valid top-level agent metadata, so it remains frozen
  as the failed handoff record.
- `candidate-003.mosaic` carries the same judged pixels with the canonical
  optional-response shape. Its three raster assets are embedded data URIs, so
  the judged frame cannot drift with later source changes.
- `candidate-004.mosaic` is the B4 six-second diff-morph pipeline. It exercises
  reveal-from-empty, move/remove/add motion, line-count gutter crossfades, and
  invisible hard-cut boundaries with embedded raster assets.
- `candidate-005-landscape.mosaic` is the B5 16:9 stress candidate using the
  Merge Conflict preset.
- `candidate-006-square.mosaic` is the B5 1:1 stress candidate using the Rubber
  Duck preset and centered code.
- `candidate-007-vertical.mosaic` is the B5 9:16 stress candidate using the
  light preset and deterministic cross-state autofit.
- `master.mosaicx` is the approved B6 invocation and human-review record. Its
  paired `master.mosaic` is a fully resolved three-step pipeline whose child
  documents contain no executable template invocations. The resolver cannot
  flatten a pipeline to one document, so this is the drift-proof pipeline
  equivalent of the closeout protocol's `resolve --flatten` requirement.
- `master.mosaic-plan.json` and `master.commands.json` are the canonical replay
  sidecars emitted from the promoted recipe in CLI development mode.
- The shipped preview assets live under
  `packages/templates/assets/templates/@m0saic__code__snippet-morph__v1/`.
- `postmortem.mosaicx` is the unrendered session-replay recipe required by the
  template closeout protocol.

The B5 aspect questions remain frozen on their candidates. The master carries
the final human response approving landscape, square, and vertical together.

## Closeout note

The promoted recipe declares a 6000ms pipeline (three 2000ms steps), but the
current CLI `make` path reports a 5000ms plan and emits a 3.53s container. The
same behavior was present in the three-aspect review renders that were approved,
so the shipped preview intentionally preserves the judged output. This is a CLI
pipeline-duration follow-up, not a hidden template adjustment.
