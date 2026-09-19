# `@m0saic/sandbox` — iteration-session corpus

This package is **a developer's personal workshop**: a chronological
corpus of `.m0` / `.m0c` files generated while iterating on layouts with
an agent. It's documentation as data. Other developers can clone or
share their own sandboxes; each is a self-contained record of how the
geometry conversations went.

## Mental model

Two analogies layered on top of each other.

**Chess endgame book** — for the geometry corpus:

- A `.m0` file is **one position**: a geometry + a question + a
  response (see `.scratch/claude/wireframe-protocol.md` and
  `@m0saic/momo`'s `M0AgentMeta` for the wire shape).
- A **session directory** is a **game**: a chronological set of
  positions building up to a final geometry. Each candidate is one
  move in the discussion.
- The whole **sandbox package** is a **book**: many games, browseable
  in any order, accumulating into a graded pattern library over time.

**Reddit thread** — for what's inside each `.m0` file:

- The **OP body** is the writing party's prompt (`note` / `question` /
  `regions` / `context`).
- The **selected answer** is `response` — the canonical reply that
  downstream agents route on. One per file, structurally separate.
- The **comments thread** (`comments[]`) is an open append-only orbit
  anyone can add to. Non-canonical — comments don't replace the
  response — but they survive in the file as provenance, context, and
  side-discussion for future readers.
- Each comment carries a short stable `id`. The Layout File Details
  view renders them as `#c-<id>` anchors so any comment (or the OP
  itself) is a copyable deep-link. Write `@<id>` in a comment body to
  reference another comment — File Details turns it into a
  scroll-to-anchor chip.

This isn't an analogy stretched for cuteness. The reason it matters is
the *same reason chess engines became superhuman*: corpus scale. The
more layout conversations get preserved, the more material future
agents have to learn from. "What worked? What didn't? Why?" — answered
empirically by every saved session.

## Directory convention

```
packages/sandbox/
├── package.json           # private package, no code, just storage
├── README.md              # this file
└── sessions/              # all iteration sessions live here
    ├── 2026-06-09-bar-graph/        # date-prefixed for chronological browsing
    │   ├── candidate-001.m0         # zero-padded so ls(1) sorts naturally
    │   ├── candidate-002.m0
    │   ├── candidate-003.m0c        # promote to .m0c when labels/masks join
    │   └── ...
    ├── 2026-06-10-line-chart/
    │   └── ...
    └── 2026-06-12-repo-tracker/
        └── ...
```

Each candidate carries the agent's note / question via the
`# m0agent:*` header block; the response gets written back to the same
file from Mosaic Desktop's File Details panel. **One file, one prompt.**

## Naming rules

- Session name: `YYYY-MM-DD-<short-slug>` (sortable, scoped to the
  thing being iterated on).
- Candidate name: `candidate-NNN.<ext>` zero-padded to 3 digits.
- When a session iterates the same geometry into a refined version,
  bump the candidate number. When the agent decides the geometry needs
  to change shape entirely, that's still a new candidate — every file
  is atomic.

## The iteration loop in practice

From the project root:

```bash
# 1. Agent writes candidate
node tools/wireframe.mjs "<m0 string>" \
  --note "..." --question "..." \
  --regions '{"<stableKey>":"<label>"}' \
  --context '{...}' \
  --skip-wireframe --open-mosaic \
  --m0-out packages/sandbox/sessions/2026-06-09-bar-graph/candidate-001.m0

# 2. Mosaic Desktop opens; auto-jumps to File Details.
# 3. User reads the question, types a response, hits Save.
# 4. Same file is rewritten with response.body populated.
# 5. Agent reads the file back, generates candidate-002.m0, …
```

(See `tools/wireframe.mjs --help` for the full flag set — adding a
`--session <name>` convenience that auto-derives the output path is on
the followup list.)

## Browsing a session later

Anyone — the original author, a teammate, a future agent — should be
able to open `packages/sandbox/sessions/<name>/` and read the files in
filename order to reconstruct the discussion that produced the final
geometry. No external transcript needed; the files **are** the
transcript.

## Stretch goal: walkthrough video template

A future template, e.g. `@m0saic/iteration-walkthrough/v1`, would take
a session directory as input and produce a video that plays out the
discussion: for each candidate, render the geometry, overlay the
agent's note + question, show the human's response, then transition to
the next candidate. Shipped as a `walkthrough.mosaicx` inside each
session, double-clicking it renders the entire session's conversation
as a watchable video.

Why this is fun:

- Onboarding: hand someone a sandbox folder, they double-click the
  `.mosaicx` and watch the whole design exchange unfold.
- Sharing thought process: developers post short walkthrough videos of
  their layout iterations as the visual equivalent of a code review or
  a chess YouTube post-mortem.
- Time travel: re-render a session at any point with updated rendering
  to see how it would have looked under different defaults.

Not built today. Just leaving the placeholder here so the data
structure is forward-compatible with it.

## Posture

Private, monorepo-versioned, no source code, no tests. This is a
**storage convention**, not a library. The sandbox isn't published;
each developer's sandbox is their own. The convention is the load-
bearing artifact, not the contents.

If you fork or share this repo, expect the new owner to wipe
`sessions/` and start their own corpus — or to keep yours as a
reference book they can browse.
