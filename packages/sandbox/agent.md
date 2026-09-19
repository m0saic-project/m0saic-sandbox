# Agent instructions — `@m0saic/sandbox`

You are working inside an **iteration-session corpus**. This file is the
short version of the rules; the long version is `README.md` next door.

The point of these rules is that any agent who picks up a shared
sandbox can immediately continue the work in a way that's consistent
with what came before. **Same conventions → compatible mental
models → corpus stays browseable.**

---

## The one rule that subsumes the rest

**One file, one prompt.** Each `.m0` (or `.m0c`) is an atomic position
— ONE geometry, ONE question, ONE response. Never multi-turn inside a
file. When the geometry changes, that's a new file. The directory is
the conversation; the file is one move.

If you're tempted to edit a candidate after the human has responded,
write a new candidate instead.

> ### 🔒 AND THE RULE THAT PROTECTS IT: freeze the `.mosaic` twin, ALWAYS
>
> For TEMPLATE iteration (`.mosaicx` candidates), the recipe is template_id +
> props, but the TEMPLATE SOURCE changes on almost every candidate. So the
> `.mosaicx` alone is **worthless as a record** — re-rendering it later runs the
> *current* template, not the one the human judged. The ONLY durable record is
> the flattened **`.mosaic` twin**:
>
> ```bash
> m0saic resolve <candidate-NNN>.mosaicx --flatten -o <candidate-NNN>.mosaic
> ```
>
> **Run it YOURSELF the instant you mint each candidate — it's a fast resolve,
> not a render, so you do NOT hand it to the human.** If you skip it and then
> edit the template, the state the human saw is **GONE FOREVER** — there is no
> git history of per-candidate template source, no way back. This has already
> destroyed real work (see the dedicated section below). One candidate, one
> `.mosaic` twin. No exceptions, not "later", not "at closeout" — NOW.

---

## File naming (mandatory)

```
packages/sandbox/sessions/<session-name>/candidate-<NNN>.<ext>
```

- **`<session-name>`**: `YYYY-MM-DD-<slug>`. The date is the day work
  on this topic started (not today's date for every candidate). Slug
  is short, lower-case-kebab, scoped to the thing being iterated on
  (`bar-graph-track-rail`, `repo-tracker-v1`).
- **`<NNN>`**: 3-digit zero-padded sequence number. `001`, `002`,
  `017`. Sortable in `ls(1)`; let `tools/wireframe.mjs --session`
  auto-pick the next number instead of guessing.
- **`<ext>`**: `m0` by default. Promote to `m0c` when the candidate
  needs labels / masks / background that `.m0` can't carry. Don't
  downgrade — once a session goes `.m0c`, stay there.

Don't name files anything else. Don't put loose `.m0` files outside
`sessions/`. Don't nest sessions inside sessions.

---

## When to start a new session

Start a fresh session directory when:

- The thing being iterated on is conceptually different from anything
  in flight.
- You've handed off to the user and they've come back days later on a
  new question.
- The geometry family has changed enough that browsing the old
  candidates as part of the same story would be confusing.

Otherwise, keep adding candidates to the existing session. Long
sessions are GOOD — they're the corpus.

---

## Linear vs parallel sessions

Two session shapes show up. Both follow "one file, one prompt" — they
differ only in how the next file is named.

### Linear session (default)

One geometry being iterated over. Each candidate proposes the next
move. The conversation is a chain:

```
candidate-001.m0  →  candidate-002.m0  →  candidate-003.m0c  → …
```

Iteration = increment the number. `tools/wireframe.mjs --session …`
auto-picks the next NNN.

### Parallel session (knob-test / smoke / matrix)

Each candidate exercises a different facet, knob, or scenario in
parallel — not the same geometry getting refined. The number
identifies WHICH knob; the slug labels it:

```
candidate-01-bare.m0c
candidate-02-labels-text-only.m0c
candidate-03-labels-chip-color.m0c
…
candidate-14-everything.m0c
```

When the human rejects one of these candidates, **don't increment
to a fresh number** — that would imply a new knob. Instead, **append
`-a` to that candidate's slug** and ship the fix in the new file:

```
candidate-09-background-image.m0c     ← frozen with rejection
candidate-09-background-image-a.m0c   ← iteration with the fix
candidate-09-background-image-b.m0c   ← (later, if -a is also rejected)
```

The original stays at its rejected state. The `-a` carries:
- the fixed fields,
- a rewritten `question` matching the new state,
- a fresh `response` slot for the human's next verdict,
- a cross-reference comment linking back to the previous iteration.

The session directory now reads as a flat matrix of knobs, with each
column going as deep as it needs (one column might never iterate;
another might be at `-c`).

### Which to use

| Shape   | Use when                                                                  | Iteration |
| ------- | ------------------------------------------------------------------------- | --------- |
| Linear  | Refining one geometry toward a target.                                    | Increment NNN. |
| Parallel | Smoke-testing N fields/knobs, or N alternative designs in parallel.       | Suffix the candidate slug with `-a`/`-b`/`-c`. |

A session can also start linear and grow a parallel branch — at that
point the branch gets its own slug and starts numbering its own
`-a` chain. Don't mix the two shapes inside the same lineage.

---

## The iteration ritual

From the repo root, every time you write a candidate:

```bash
node tools/wireframe.mjs "<m0 string>" \
  --session <YYYY-MM-DD-slug> \
  --note "<what to look at>" \
  --question "<specific ask>" \
  --regions '{"<stableKey>":"<label>", ...}' \
  --context '{...}' \
  --skip-wireframe --open-mosaic
```

Notes:

- `--session` auto-routes output to the right directory and auto-picks
  the candidate number. Use it. Don't pass `--out` manually.
- `--skip-wireframe` skips the encode and just writes the `.m0`. Pair
  with `--open-mosaic` to drop the human straight into Layout — that's
  the fastest hand-off.
- The m0 string is validated AND canonicalized at the file boundary
  (every `@m0saic/dsl-file-formats` serialize/parse path). Invalid m0
  — child-count mismatch, unbalanced brackets, illegal chars — throws
  at write time AND on read; fix your m0, don't try to bypass.
- You may author EITHER canonical or pretty (expanded) DSL — both are
  valid input. The official methods always EMIT canonical, so the
  written `.m0`/`.m0c`/`.m0p` (and anything you read back) is canonical.
  Don't expect your pretty form to survive verbatim in the file.
- The **document formats** (`.mosaic` / `.mosaicx`) share the same
  contract via `@m0saic/platform`: every m0 in the tree (top-level,
  nested `children`, pipeline steps) is canonicalized + validated on
  write and read, so a resolved `.mosaic` twin or a `.mosaicx` handoff
  never carries pretty or broken m0 either.
- **For TEMPLATE candidates (`.mosaicx`), the ritual is not done until the
  `.mosaic` twin is frozen.** Immediately after writing `candidate-NNN.mosaicx`:
  `m0saic resolve candidate-NNN.mosaicx --flatten -o candidate-NNN.mosaic`. The
  `.mosaicx` is a recipe against drifting source; the `.mosaic` is the only
  drift-immune record. Treat "wrote the candidate" and "froze its `.mosaic`" as a
  single indivisible step — see "🔒" above and the dedicated section below.

---

## Reference background — bake it by DEFAULT

When a reference or source image exists for the thing being iterated
(the human provided a mock/crop, or the agent is comparing against an
earlier render), **write it into the candidate** via `--bg <path>` —
it lands in `derive.background` as a base64 data-URI. The human can
then flip the background on in Layout and judge the proposed
rectangles directly against the reference, no app-switching.

- This is the default, not an opt-in. If you have a reference image
  and you ship a candidate without it, that's a protocol miss.
- Keep the source PNG itself OUT of the sandbox directory (use
  `.scratch/claude/` or `/tmp`); the b64 payload inside the `.m0c` is
  the artifact that travels with the candidate.
- Same rule for agent-produced renders at closeout (masters already do
  this — `derive.background` is the provenance slot).

---

## Duplicate on handoff — preserve the agent state

The human doesn't just answer anymore — with Edit mode they can (and
should) **correct the geometry directly**: resize the agent's rects,
add regions, match their reference, then hand the file back. The user
is never inconvenienced: they only ever touch the file the agent
opened. The bookkeeping is entirely the agent's job:

1. **Before (or immediately after) pointing the human at a candidate**,
   duplicate it: `candidate-NNN.m0c` → `candidate-NNN-agent.m0c`. The
   `-agent` file is the pristine proposal — same m0, labels, note,
   question, background; `response: null`. It never changes again.
2. The LIVE file (`candidate-NNN.m0c`) is the human's. They may save a
   verdict into `agent.response`, mutate geometry wholesale, or both.
3. On the next turn the agent reads the live file as the canonical
   human state and **diffs it against the `-agent` snapshot** to read
   the corrections — at this point the human may be making wide
   changes, and the diff IS the feedback. Both states stay in the
   session forever: full history, capturable diff, replayable.

This composes with "one file, one prompt": the proposal + its
correction are ONE move; the snapshot just keeps both sides of it.
Scribe-mode provenance stamps (`label-1`, `label-2`, …) inside the live
file additionally record the human's own iteration trail; Compact's
prune strips them at closeout if the session wants a lean export.

**Clean up untouched snapshots.** The duplicate exists to capture a
diff. On the next turn, compare the live file against its `-agent`
copy: if the human made NO changes (geometry, props, labels — a
response alone doesn't count as an edit), DELETE the `-agent`
duplicate. An identical copy is noise, not provenance. Keep it only
when a real diff exists.

**`.mosaicx` candidates: dated OUTPUTS are the provenance, not file
copies.** A `.mosaicx` is usually just a template invocation with
defaults — a recipe, not a state. Editing the TEMPLATE SOURCE changes
what the same recipe renders, so keeping a `.mosaicx` copy does not
keep the same output if run later. Don't snapshot `.mosaicx` handoffs
by default; instead:

- The human double-clicks the `.mosaicx` → the Run page's
  "▶ Render" executes it as-is and writes a TIME-STAMPED output next
  to it (`candidate-005.mosaicx` → `candidate-005.20260612-084403.mp4`).
- That dated render IS "the template at that time" — successive
  renders accumulate as the iteration trail; output-file naming does
  the provenance work.
- Only duplicate a `.mosaicx` when the human actually edits its props
  and the diff matters (same rule as geometry files, applied lazily).

**Always set `suggestedOutput` so the render lands in the session dir,
well-named.** Without it, the Run/Make "▶ Render" falls back to a
workspace smart default — the output (and its `.mosaic` twin) can land
elsewhere or with the wrong basename (e.g. a `candidate-002.mosaicx`
rendering as `candidate-001-1920x1080.mp4`). Set it on EVERY `.mosaicx`
candidate you author:

```json
"suggestedOutput": { "dir": ".", "basename": "candidate-002" }
```

- `dir` is absolute, or relative to the `.mosaicx` itself — `"."` keeps
  the render next to the candidate (the session dir). Created if missing.
- `basename` carries no extension — the surface appends `-{W}x{H}.{ext}`
  (`candidate-002` → `candidate-002-1920x1080.mp4`) and the `.mosaic`
  provenance twin rides the same basename.
- The human can still override the path in the UI; this is just the
  authoring default (precedence: UI pick > `suggestedOutput` > smart
  default). Pure metadata — ignored by the engine and resolver.

**`.mosaicx` carries the agent QnA — seed it.** The mosaicx `agent`
slot takes the same note / question / context / response block `.m0c`
has, and the Run page renders it: the human renders, watches, and
answers RIGHT THERE. Always seed `.mosaicx` candidates with an `agent`
block (note + question), not just a `_comment`. When the human saves:

- Every as-is render ALSO emits the resolved `.mosaic` beside the
  `.mp4` (same basename, via the renderer's `saveMosaic` sidecar) —
  the TRUE source of those exact pixels: pure geometry + primitives,
  frozen at render time, immune to template-source drift. Provenance
  per iteration = the dated `.mp4` AND its `.mosaic` twin.
- `response.src` is stamped with the path of the render the verdict
  judged (the most recent output that session), and `response.srcMosaic`
  with its resolved-`.mosaic` twin — the hard links between opinion,
  pixels, and true source that make `.mosaicx` files worth tracking.
- `response.images` may carry b64 screenshot attachments ("I rendered,
  saw something, screenshotted it") — read them; they're the
  highest-bandwidth feedback channel. Same `images` array exists on
  `.m0c` / `.m0p` responses via File Details.
- All optional — rich provenance when desired, at file-size cost.

---

## Null top layer — the background peek (convention)

**By convention, append a null top overlay layer to most layout
candidates you hand back during iteration** (`.m0` / `.m0c` / `.m0p`).
It is a full-canvas `-` (passthrough / no fill) nested as the
FRONTMOST child of the composition:

```
L0{L1{ … {Ln{-}}}}      ← the innermost "-" is the topmost overlay
```

**Why.** It gives the human a clean, empty top depth to jump to in the
multi-layer viewer. Selecting it peels the content off and shows the
BACKGROUND / base by itself — the "let me see the pure bg" move (e.g.
inspecting a scatter behind a chrome, or a base behind a busy stack)
without hand-deleting layers. Especially useful for composed layouts
(content over a background field).

**It costs nothing visually.** `-` is transparent, so the rendered
frame is unchanged, and a pure-null full-canvas overlay produces NO
renderFrame — it doesn't perturb the `fill` / `masks` / source
indexing (stableKey joins are unaffected).

**It's dead geometry — pruned on compact.** The null layer is a review
aid, not part of the design. Compact / canonicalization strips the
pure-null layer at closeout, so it never reaches the shipped master.
Don't ship it: when emitting a final/compacted master (or a sidecar
`.m0p` built from a candidate), drop the null layer (regenerate with it
off, or let Compact prune it).

**How.** When building the composition by nesting layers, start the
nest from `"-"` instead of the last real layer so it lands innermost:

```js
let m0 = "-";                                  // null top layer (peek aid)
for (let i = layers.length - 1; i >= 0; i--)   // wrap every real layer around it
  m0 = `${layers[i].m0}{${m0}}`;
```

Skip it for ship-clean outputs (e.g. an env/flag toggle) and for files
where there's no background worth isolating.

---

## Rectangle operations — explore with overlays, optimize last

The human speaks in rectangle-level English: "make this one a little
bigger", "nudge that down", "swap these two". Each of those is **one
operation on one rect** — the rect has a stableKey, an x/y, a w/h.
The agent's translation is mechanical:

1. **Null out** the target rect in place (`1` → `-` at its slot, or
   replace the overlay body that carried it).
2. **Add an overlay layer** that places the resized/moved rect —
   `placeRect` from `@m0saic/dsl-stdlib` is the safe primitive (exact
   pixel placement, 1 frame, `-` nulls everywhere else; GCD-reduces
   its splits).
3. Validate, re-seed as the next candidate, hand off.

Principles:

- **The human sees a simple change; the document may restructure
  massively underneath.** Frame numbers and tree shape can churn —
  irrelevant. Everything reduces back to the same flat set of
  rectangles. If the human says "a little bigger" and sees "a little
  bigger", the operation succeeded.
- **Adding layers during exploration is GOOD practice.** Don't
  prematurely flatten or re-derive a minimal tree mid-session;
  100+ overlay layers perform fine. Layer-per-operation keeps each
  edit legible and reversible.
- **Optimization is a closing step, not an exploration step.** Packing
  rects onto as few layers as possible happens once, near closeout —
  never while the geometry is still moving.
- Direction of travel: an edit-rectangles UX (drag/resize on screen)
  and English → m0-operation logic in `dsl-stdlib` (natural-language
  instruction → target math operation → DSL performs it). Until those
  exist, the agent IS that translation layer — keep the operations
  small, named, and one-per-candidate.

---

## What goes in the agent block

Mental model: **Reddit thread**. The file is one post.

- **OP body** — `note` / `question` / `regions` / `context`. Generated by the writing party; read-only after the file is shared.
- **The selected answer** — `response`. The canonical reply. Downstream agents route on this.
- **The thread below** — `comments[]`. Open, append-only orbit. Anyone (human or agent) can add. Non-canonical — comments don't replace `response`.

| Field        | Style                                                            |
| ------------ | ---------------------------------------------------------------- |
| `id`         | Optional short hash for the post itself. Used for cross-file deep-links (`#c-<id>` anchors). Mint with `mintAgentId` when you want a stable handle. |
| `note`       | Markdown prose. What you want the reading party to look at.       |
| `question`   | Markdown prose. Specific yes/no or which-one-of-these question.   |
| `regions`    | `stableKey → short label`. Match nodes in the layout so File Details can hover-highlight them. |
| `context`    | Structured JSON for the next agent. Derivation method, constraints, what you tried. |
| `response`   | Canonical answer. One body, one party-id (`from`), one timestamp (`at`). |
| `comments[]` | Append-only thread. Each comment has `body`, `from`, `at`, and a short stable `id` (auto-minted on add). |

Conventions:

- **Prose is markdown.** `note`, `question`, `response.body`, and
  `comments[].body` render as markdown in the Momo FILE pane (headings,
  lists, GFM tables, fenced code, **bold**, `inline code`). Use it — a
  short table or bullet list reads far better than a run-on sentence.
  The `.m0c`/`.m0p` JSON formats preserve newlines, so multi-line
  structure survives the round-trip. (The line-based `.m0` format still
  flattens prose to one line — reach for `.m0c` when the question wants
  real formatting.)
- Keep `note` and `question` honest. The reading party is looking
  AT the wireframe; don't paraphrase what they can already see.
- `regions` are most useful when they point to nodes the question is
  actually about. Don't label everything.
- `context` is for the next agent to route on. "What was I trying to
  do?" — answer it structurally.

---

## When the human (or other responder) saves back

The canonical answer lands in `agent.response`:

```json
{
  "body": "<prose answer>",
  "from": "human" | "human:<name>" | "agent:<role>",
  "at": "<ISO 8601>"
}
```

When you read a candidate's response and want to iterate the geometry,
**write a new candidate**. Don't overwrite the one you read. Increment
the number — the directory IS the conversation.

### Comments thread (the orbit)

Anyone can append to `agent.comments[]` to add non-canonical context
that future readers will want to see but that shouldn't displace the
response. Each comment carries a stable `id` (short hash) so it can be
deep-linked:

```json
{
  "id": "k7mx9q2v",
  "body": "Spacing between bars 3 and 4 looks off in this preset.",
  "from": "human:quentin",
  "at": "2026-06-09T05:14:22.000Z"
}
```

**`@<id>` mentions** — reply to or reference another comment by typing
`@<that-id>` in your body. The Layout File Details renderer turns them
into clickable scroll-to-anchor chips. Cross-file references work the
same — the chip jumps when the target is in the same thread, otherwise
it's still readable as provenance.

**Deep-links** — every comment in File Details has a `#<id>` chip you
can click to copy a URL. Open the URL on another machine (or paste it
into a chat) and the file opens scrolled to that comment.

**When to use a comment vs a new candidate:**

- Adding context, raising a concern, linking related work → comment.
- Disagreeing with the response or proposing a different geometry → new candidate.
- Routine acknowledgement / status / banter → comment, and keep it short.

The agent only reads `response`. Anything load-bearing for the next
geometry must live there, not buried in a comment.

---

## When you pick up someone else's sandbox

1. Read the session directory's name → that's the topic.
2. `ls` the candidates in number order → that's the chronology.
3. Open each `.m0`'s header to see the agent's question + the human's
   response. The geometry tells you what changed between candidates.
4. Carry the conventions forward. Don't rename, renumber, or
   reorganize someone else's session unless you have a load-bearing
   reason.

---

## Session closeout (the FULL ritual — a sandbox is closed only when
## every step below is done)

A session does not end at "last candidate approved". The closeout:

1. **Master candidate → human approval.** Write
   `master-candidate01.m0c`: the approved geometry + LIVE labels only
   (prune orphans — a label whose stableKey no longer parses is a
   rejection magnet), scribe provenance stamps kept, the approved
   render baked into `derive.background`, intent `ship`. The human
   reviews it like any candidate; rejected masters stay frozen and the
   fix ships as `master-candidate02.m0c`, etc. **The session is closed
   only once the human approves a master.**
2. **Compact ask.** On approval, ASK whether to compact. If yes: run
   Compact with ALL options (null layers, repack, prune) plus a minor
   GCD search — ask the human for the drift tolerance — to heavily
   reduce the DSL and simplify the template. Produce BOTH
   `master.m0c` (the approved master, verbatim) and
   `master_compact.m0c`. Then ask which version feeds the template
   (master or compact).
3. **Final steps** (after the master/compact choice):
   - Render the FINAL preview — and in the SAME run emit
     `master.mosaic` (the fully RESOLVED, flattened document) plus the
     CLI sidecars (`--save-mosaic --save-plan --save-commands`; add
     `--save-m0` only when the resolved m0 is a meaningful layout —
     skip it for trivial overlay stacks like a one-cell `1{1{…}}`).
     The `.mosaicx` is the recipe and its output drifts with template
     source; the resolved `.mosaic` + sidecars freeze the TRUE source
     of that exact preview video. Pick the SHOWCASE props for the
     preview — the variant that demonstrates the template's breadth
     (more segments / labels / captions), not necessarily the minimal
     default.
   - Generate `master.mosaicx` — the double-clickable recipe whose
     dated renders are the template's go-forward provenance.
   - Copy the preview image/video into the TEMPLATE's preview assets
     (the `preview` meta surface the Templates page / Run header
     reads) so the UI shows the real thing.
   - Write `postmortem.mosaicx` into the session dir — a
     double-clickable recipe that renders the session walkthrough via
     `@m0saic/meta/post-mortem/v1`. **Do NOT render it**; committing
     the recipe is the deliverable — anyone replays the session on
     demand.

   Master-candidate craft notes (rejection magnets): the master canvas
   matches the TEMPLATE'S OUTPUT shape (square output → square master),
   not the exploration tile; labels/regions must describe the SHIPPED
   layout — drop anything that no longer correlates (orphans, stale
   iteration stamps, superseded decompositions).

### Template-build closeout (the `.mosaicx` flavor)

When the session's deliverable is a **template** (a `.ts` under
`packages/templates/src/m0saic/…`) rather than a single `.m0c`
geometry, the master is a **`.mosaicx` that INVOKES the template**, not
an `.m0c`. The ritual adapts:

1. **`master_candidate-NN.mosaicx` → human approval (the FINAL QUALITY
   GATE).** Write `master_candidate-01.mosaicx` (a `template_invocation`
   of the finished template with the showcase props) plus its flattened
   `master_candidate-01.mosaic` twin (`m0saic resolve --flatten`) for
   provenance. **Do NOT mint a bare `master.mosaicx` before approval** —
   that name is reserved for the approved file. The human reviews it
   like any candidate; rejected gates stay frozen (their verdict is the
   record) and the fix ships as `master_candidate-02.mosaicx`, etc.
2. **Gate EVERY output aspect, not just one.** Aspect-adaptive templates
   pass desktop and still fail square/mobile (a desktop-tuned content
   upscale that overflows the narrow canvas; a right-aligned element
   that collides with a bottom-right watermark). The final gate is the
   human rendering ALL aspects (H / V / square) from the candidate and
   signing off — hand them the per-aspect render one-liners
   (`m0saic make <file> -o <out> -w <W> -h <H> …`; the user runs the
   renders they review). Verify the aspects yourself first, but the gate
   is theirs.
3. **No `.m0c` / Compact step.** The template source IS the artifact;
   "compaction" here is code (e.g. baking a constant subtree to a flat
   asset — see the internal reduce-to-one notes), done and signed off
   DURING the candidate loop, before the gate.
4. **Promote + finish.** On approval, rename the approved
   `master_candidate-NN.*` → `master.mosaicx` + `master.mosaic`, then do
   the usual finals: copy a preview render into the template's preview
   assets, and write (don't render) `postmortem.mosaicx`.

Renders themselves are never committed: `packages/sandbox/.gitignore`
ignores video outputs; the dated-render provenance lives in each
response's `src` pointer, and any render is reproducible from its
candidate.

---

## What's safe to commit, what's local

- `sessions/` IS the deliverable. Commit it.
- Don't commit large rendered videos / PNGs into the sandbox. The
  `.m0` is the artifact; rendered outputs go to `/tmp/` or a sibling
  directory.
- `.gitignore` is fine for per-developer scratch but the sessions
  themselves are shared.

---

## Opening Mosaic Desktop directly on a file

This is the **agent ↔ human handoff loop**: the agent's last
non-conversational action is to open Mosaic Desktop on the file the
human needs to see. No clicks, no copy-paste, no "open it from the
file picker." The conversation continues in the file itself.

### Canonical: `m0saic open <file>`

```bash
# Existing file → drop the user straight into Layout
m0saic open packages/sandbox/sessions/<dir>/candidate-09-background-image.m0c

# Fresh candidate → write + open in one call
node tools/wireframe.mjs "<m0 string>" \
  --session <YYYY-MM-DD-slug> \
  --question "<ask>" \
  --skip-wireframe --open-mosaic
```

`m0saic open` (from `@m0saic/cli`):

- Returns immediately — non-blocking, agent's next prompt isn't held up.
- On macOS, prefers a running dev electron when one is detected (so
  the file lands in the user's already-open Layout window rather than
  triggering a fresh prod launch). Falls back to the file association
  for the installed app.
- On Win / Linux uses the platform file association.
- `--app <path>` overrides the target app explicitly (escape hatch
  for non-standard topologies).
- Validates the extension is one of `.m0` / `.m0c` / `.m0p` / `.m0v`
  / `.mosaic` / `.mosaicx` and errors cleanly otherwise.

The user lands in Layout with File Details ready to receive a
response. Their answer saves into the same file as `agent.response`.
The agent reads it on the next turn and either appends a comment or
writes the next candidate.

### Bare fallback

If `m0saic` isn't on `PATH` (older repo, fresh checkout, CI sandbox),
`open <file>` works on macOS provided the prod app has been
first-launched (Gatekeeper requires a one-time user approval for
unsigned/unnotarized builds). On Win / Linux: `start "" <file>` /
`xdg-open <file>`.

When `m0saic open` is unavailable, see
the internal mosaic-cli-open notes for the install path.

### Template iteration: preview in Make with `m0saic open --template`

The flow above hands off LAYOUT candidates (`.m0c` → Layout). When the work has
moved past geometry to a **template** — you've built or edited the `.ts` under
`packages/templates/src/m0saic/…` and want the human to see it RENDER — open it
straight into the **Make** page with props preconfigured:

```bash
npm run build:templates            # compile your edit into dist
m0saic open --template @m0saic/charts/line-chart/v1 \
  --props '{"preset":"dark","title":"…","values":[…]}'
```

`m0saic open --template`:

- **Hot-reloads fresh `dist`.** The desktop app's template registry is frozen at
  boot; this re-requires `@m0saic/templates` inside the running app so your
  rebuild shows up WITHOUT an app restart. (Pass `--no-reload` to skip.)
- **Pre-fills props.** `--props '<json>'` (or `--props-file <path>`) is merged
  over the template's `defaultProps`, so the Make panel shows a full standard
  prop set with your overrides applied — the human tweaks knobs from there.
- Opens Make on the template and triggers a fresh preview render.
- Needs Mosaic Desktop running (same loopback bridge as `m0saic momo`); errors
  cleanly if it isn't.

**The template iteration loop** (mirrors "one file, one move"): edit the
template source → `npm run build:templates` → `m0saic open --template … --props
'{…the one thing under test…}'` → STOP and let the human verify in Make → react
to their verdict → repeat. When exercising several knobs or variants, open them
**one at a time** and get a verdict on each before the next — same discipline as
parallel knob-test candidates, just live in Make instead of on disk.

Use the SHOWCASE props (the variant that demonstrates the template's breadth)
for a representative preview; use minimal props when isolating one knob.

#### Run vs Make — situational; pick the surface for the moment

Two render surfaces, two purposes. The agent CHOOSES based on what the human needs
right now — neither is "the" surface:

- **Run = iteration.** The AGENT is driving: render the thing, inspect/report the
  result, iterate on output. Use Run when you've changed the template/recipe and
  want to PRODUCE a render + verdict — it carries the `agent` block, renders on
  demand, and stamps `response.src` / `srcMosaic` for provenance. Hand off a
  `.mosaicx`: `m0saic open <candidate>.mosaicx`. ("Render this and tell me.")
- **Make = evaluation.** The HUMAN is driving: they need to FEEL using the
  template — click the prop panel, slide knobs, validate the prop SET reads well,
  check the **GeometricPreview is faithful**, change props and re-render a few
  times themselves. Use Make when the question is "how does this template feel to
  USE", not "is this one render right". Hand off the template:
  `m0saic open --template <id> --props …`.

Render-to-judge → Run. Feel-the-knobs → Make. When unsure which the human wants,
ask.

#### Agent flow in Make — the eager scratch `.mosaicx` (agents open mosaicx, humans load templates)

Make now carries the **same File-tab agent loop** as Layout and Run. The model:
**an agent opening a template gets a file-backed, provenance-carrying `.mosaicx`;
a human just browsing a template stays in-memory.**

`m0saic open --template <id>` mints (or refreshes) an **eager scratch `.mosaicx`**
at a stable per-template path — `~/m0saic/make/<sanitized-id>.mosaicx` — carrying
the template invocation **and an `agent` block**. Make adopts that path, so the
File tab opens **live** (no Export step): the agent's seeded note/question shows
with a composer, the human answers in place, and the response persists into the
scratch file — stamped with `response.src` (the render it judged). Reopening the
same template continues the thread (prior response/comments are preserved).

Seed the block from the CLI:

```bash
m0saic open --template @m0saic/charts/line-chart/v1 \
  --props '{…}' \
  --agent-question "Does the X axis density read right at this width?"
# also: --agent-note "<context for the reviewer>"
```

If you pass neither, a default note is seeded so the composer still appears. The
Make top-bar shows a **`.mosaicx` badge** (icon + filename + amber dirty dot) so
the human can see which file Make owns and when knob edits drift from disk.

Two surfaces, same protocol:

- **`m0saic open --template … --agent-question "…"` → Make** — iterate template
  *props/knobs* live; the scratch `.mosaicx` under `~/m0saic/make/` is the agent
  thread + provenance store.
- **`m0saic open <file>.mosaicx` → Run** — run an existing recipe; same `agent`
  block, renders on demand, stamps `response.src` / `response.srcMosaic`.

(Agent-block type: `packages/momo-types/src/agent.ts`. Make consumer:
`pages/MakePage.tsx` publishes a `MomoFileTarget`; the scratch mint is in
`electron/main.js` `writeMakeScratchMosaicx`. Render-provenance `.mosaic` sidecar
still rides the **Save .mosaic** / `--save-mosaic` toggle.)

#### Geometry Edit mode — the human's drag is INTENT you re-encode, not geometry you copy

Make has an **Edit mode** (right-panel Edit section, or the Edit chip next to
Preview/DSL): the human drags/resizes rects **on your rendered output**. This is
a **user-facing JIT edit tool** — the human tweaks a layout in place and can
Export the result as `.mosaic` if they want to keep it. It has two engines:

- **Light** (default) — each drop is one additive operation on the flattened
  doc: the grabbed node nulls out in place and its subtree re-lands via
  `placeRect` on a new TOPMOST overlay layer. **Untouched geometry is
  byte-identical; sibling rects never rebalance; the graph/structure is
  preserved.** This is the mode you can reason about — a clean N vs N−1 diff —
  so **prefer Light edits for anything you need to re-encode.**
- **Full** — a destructive full-graph rebuild (resize past the safe floor,
  Z-order changes, group/mosaic moves with descendant scaling). It regenerates
  the ENTIRE flat m0 at exact pixels, so the string diff is opaque and the whole
  structure is "blown up." Reach for it only when Light can't express the edit.

Invite it explicitly when the layout feel is the open question:

```bash
m0saic open --template @m0saic/charts/line-chart/v1 --props '{…}' \
  --agent-question "Drag anything that feels off — I'll encode your moves into the template."
```

**On return:** when the human responds while edits exist, Make automatically
writes **`<scratch-basename>_humanedits.mosaic`** beside the scratch `.mosaicx`
and stamps **`response.srcMosaic`** at it — the same freeze convention as the
manual `m0saic resolve --flatten` flow, now app-generated. That file is the
edited FLAT doc, and its **`editor.geometryEdits`** array is the record you
consume: per edit, `kind` (`move_subtree` / `move_rect_only` for **Light**,
`rebuild` for **Full**), `fromKey → toKey` (pre-edit node → placed node root,
flat-keyspace stableKeys), `prevRect → nextRect` (integer px), `canvas`, and
`movedSourceCount`.

A saved `.mosaic` (the user's Export) carries the same `editor.geometryEdits` —
so you'll meet these records whether or not the response handshake fired.

How to read it — **treat the records as intent, not geometry to copy**:

1. Parse both states (`parseM0StringComplete` on the doc's m0 at `canvas` dims)
   and look at what the human was DOING: "moved the legend up-right", "shrank
   the title block", "pulled this cell out of the grid".
2. Re-encode that intent into the **template math** — grid-align, compact,
   adjust the split weights / knobs that produce the geometry. NEVER replay the
   exploded null+placeRect overlay DSL into a template; it's a human gesture
   trail, not a layout design.
3. Rects are in DOC OUTPUT px (resolution-dependent by design — the human edited
   the rendered output). Normalize against `canvas` before turning them into
   template fractions.

Caveats you must know: edits are **JIT and ephemeral** — any prop/dim/template
change re-renders and discards them (the human sees a toast), so the
`_humanedits.mosaic` freeze at response time (or an explicit Export as `.mosaic`)
is the only durable artifact. And Light's placed rects always land on the
**topmost layer**, so an edit can paint over content that used to be above it —
z-order-sensitive moves are what **Full** is for.

**Reading a `kind:"rebuild"` (Full) record — do NOT string-diff.** Full
regenerates the whole m0, so every stableKey changes and an N vs N−1 string diff
is meaningless. The record carries the intent explicitly instead:

- `scope` (`"subtree"` | `"rect_only"`), and `z` (`{op, prevPaintIndex,
  nextPaintIndex}`) when the edit changed stacking (front / back / forward /
  backward).
- `nodes[]` — a per-descendant `{fromKey, toKey, prevRect, nextRect}` map: the
  full structural intent (what moved/scaled to where) even though the emitted
  string is opaque. `prevRect === nextRect` marks a pure Z change.
- **Keys chain per-record.** Record *N*'s `fromKey`s live in doc *N−1*'s
  keyspace (each rebuild re-keys everything), so walk the records in order — do
  not expect a key from one record to resolve in a later doc.
- The doc is **resolution-baked** at `record.canvas` (post-render, output
  locked) — read the rects as exact px at those dims, then normalize to template
  fractions like any other edit.

Same disposal as Light: read the intent (`nodes[]` + `z`), re-encode it into the
template math — never replay the regenerated geometry verbatim.

#### Freeze each iteration to `.mosaic` — the TEMPLATE drifts, the recipe doesn't  ⛔ NON-NEGOTIABLE

> **This is the single most-violated, most-costly rule in the protocol. Read it
> twice. It has already destroyed real work: a run shipped candidates 005–010 as
> bare `.mosaicx` with no `.mosaic` twins, then kept editing the template — those
> six template states are now LOST FOREVER (no git history per candidate, only
> the human's mp4 screenshots survive). Do not let it happen again.**

When iterating a TEMPLATE through `.mosaicx` candidates, the recipe (`templateId`
+ props) stays the same while the template SOURCE changes every candidate. So a
`.mosaicx` re-rendered later does NOT reproduce what the human judged — it renders
the *current* template. The human's screenshot is a weak record; a re-renderable
**`.mosaic`** (resolved, flattened, pure geometry + primitives) is the strong one.

**It is a fast resolve, not a render — run it YOURSELF, do not hand it to the
human, do not defer it to closeout. "Wrote the candidate" and "froze its
`.mosaic`" are ONE step.**

**Rule:** as you present each `candidate-NNN.mosaicx`, immediately freeze its
resolved view next to it —

```bash
m0saic resolve <candidate-NNN>.mosaicx --flatten -o <candidate-NNN>.mosaic
```

— captured at THAT template state, BEFORE you make the next change. The `.mosaic`
is template-drift-immune: it re-renders byte-for-byte what the human saw. Do this
when you hand off the candidate (and at the latest before editing the template for
the next one), so the iteration trail is reproducible, not just screenshotted.

**On the human's RETURN, REVIEW the candidate before you react.** Read not just
`agent.response` but the `comments[]` AND the `props` — in Make the human may have
NUDGED KNOBS (to probe an edge case, often a BREAKING one) and saved.

**⛔ FREEZE `_humanedits.mosaic` BEFORE YOU TOUCH THE TEMPLATE. This is the single
most important provenance step and it is NOT recoverable later.** The moment the
human gives negative feedback or you see a prop diff, your FIRST action — before
diagnosing, before any edit, before a rebuild — is:

```bash
m0saic resolve <candidate-NNN>.mosaicx --flatten -o <candidate-NNN>_humanedits.mosaic
```

Why first, why non-negotiable: **the template source changes between almost every
candidate.** A `.mosaicx` is a recipe (template invocation + props); `--flatten`
renders it against the template *as it exists right now*. Once you edit the template
to fix the bug, flattening the same `.mosaicx` renders the FIXED output — the broken
state the human actually saw is gone forever. There is no going back. (This was
learned the hard way: two breaking candidates were flattened only after their fixes
shipped, so their `_humanedits.mosaic` show clean charts and the real repros are
lost.)

So the order on return is ALWAYS:
1. **Freeze `_humanedits.mosaic`** from the live `.mosaicx` (captures the exact
   broken render the verdict is about) — distinct from the `candidate-NNN.mosaic`
   you froze at hand-off.
2. THEN read `response` / `comments` / prop diff and diagnose.
3. THEN edit the template.

Emit `_humanedits.mosaic` on EVERY return where the props differ from what you
presented — and ALWAYS on negative feedback, where the human's edited props ARE the
bug repro. A clean approval with zero prop changes is the only case you can skip it.

#### Before you LOCK a template: the ship-readiness final candidate

Iteration candidates each chase ONE thing — one question, one geometry, "is THIS
fix right?". Locking is a DIFFERENT bar: "is this TEMPLATE good to SHIP?" Don't
jump from the last fix straight to tests. Present a FINAL candidate that flips the
human into stress-test mode:

- **Urge the human to NUDGE the props and try to BREAK it.** They drive Make,
  change knobs, and re-render as many times as they want — this is the one
  candidate where wide prop edits are the POINT. Capture `_humanedits.mosaic` when
  they do (per the rule above).
- **YOU name the high-value props/combos to probe.** You know the prop surface, so
  call out the edge cases most likely to expose inconsistency — don't make the
  human guess. For a chart that's typically: extreme values (one giant slice +
  tiny ones), the 1-item and max-item counts, all-equal values, very long
  labels/values, empty optionals, the dark preset, reduceMotion, a non-default
  aspect ratio. Pick the few that actually stress THIS template.
- **The human approves the TEMPLATE, not a frame.** The verdict you're after is
  "ship it", not "this one render looks right". Only AFTER that do you lock (unit
  + CLI-E2E + variant + preview asset).

This is the gate between "the fix landed" and "the template is production-ready".

---

## Companion docs

- `agent-extended.md` (this directory) — field notes from real human↔agent
  iteration: how humans actually edit `.m0c` (edits explode the string;
  labels persist and follow the edit — they're the shared "this rect"
  handle; edits land pixel-imperfect), and how to react (parse don't
  eyeball, trust labels as the join, snap to the intended grid, rebuild
  minimal, `placeRect` over `placeRects`, null carriers). Read before
  re-reading an edited candidate.
- `README.md` (this directory) — full mental model, longer prose,
  walkthrough-video stretch goal.
- `.scratch/claude/wireframe-protocol.md` (project-level scratch) —
  the protocol the agent + party negotiate over.
- `packages/momo/src/agent/meta.ts` — canonical type definition for
  the annotation block.
- `tools/wireframe.mjs --help` — every flag the iteration loop
  supports.

---

## Anti-patterns (don't do these)

- **Shipping a `.mosaicx` template candidate without freezing its `.mosaic`
  twin.** This is the most destructive mistake in the whole protocol: the
  template source drifts, so the moment you edit it for the next candidate the
  judged state is unrecoverable. Freeze `m0saic resolve … --flatten -o …` the
  instant you write the candidate — see "🔒" near the top and the "Freeze each
  iteration" section. (This has already cost real work — multiple candidates
  whose exact template states are now lost forever.)
- Multi-turn inside a single file. Iteration = new file.
- Loose `.m0` files at the package root. Always inside `sessions/`.
- Hand-rolled candidate numbers that skip or repeat existing ones.
- Stripping the agent block before saving back. The response slot is
  load-bearing.
- Using the sandbox for non-iteration files (snippets, templates,
  rendered videos, screenshots). Those go elsewhere.
