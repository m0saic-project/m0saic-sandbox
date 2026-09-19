# 2026-07-06 · header-hero-footer geometry-edit handshake (smoke test)

Purpose: end-to-end smoke test of the **Make geometry-edit handshake** — a human
drags rects on a rendered template in Make Edit mode, and the agent decodes the
`editor.geometryEdits` records back into a **template-level** fix.

## The template under test
`@m0saic/demos/header-hero-footer/v1` — header / two-column hero / footer.

- Layout: `weightedSplit([1,3,1],"row")` → `5[1,0,0,HERO,1]` (header 20% · hero
  60% · footer 20%). Hero claimant is `2(1,1)` (two columns).
- v1 is **columns-only, hardcoded** — the deliberate flaw. On a portrait canvas
  the two hero cells get skinny/cramped.

## The spec'd scenario
1. **Desktop (1920×1080)** — two columns read fine. ✅ no edit.
2. **Square (1080×1080)** — two columns still fine. ✅ no edit.
3. **Mobile (1080×1920)** — columns cramp. The human enters Edit mode and drags
   the two hero cells into **two rows** (left → top half, right → bottom half),
   then answers the agent's question → Make freezes `<scratch>_humanedits.mosaic`
   with the `editor.geometryEdits` records.
4. **Agent decodes** the records as intent ("on portrait, stack the hero into two
   rows") and applies the aspect-adaptive template fix:
   `heroClaimant = isPortrait ? "2[1,1]" : "2(1,1)"`.
5. **Re-hand-off** on mobile → human confirms rows.

## Artifacts (all in THIS folder — corpus-correct)
- `candidate-001.mosaicx` — the authored recipe (template_invocation + props +
  `agent` block + `size` 1920×1080 + `suggestedOutput`).
- `candidate-001.mosaic` — the frozen flattened twin (`m0saic resolve --flatten`),
  captured at the v1 columns state (`5[1,0,0,2(1,1),1]`), drift-immune.
- Handoff: `m0saic open candidate-001.mosaicx --make` — Make **adopts this file**
  (not a `~/m0saic/make` scratch), so the geometry-edit freeze
  `candidate-001_humanedits.mosaic` lands right here on save.

> Note: `m0saic open --template <id>` mints an EPHEMERAL scratch under
> `~/m0saic/make/` — disconnected from the session. The `--make <file>` flow keeps
> the whole handshake inside the sandbox corpus. Use `--make` for real sessions.

## Handshake result (candidate-001 → 002)
Human dragged both hero cells full-width and stacked them on the 1080×1920 render
(`candidate-001_humanedits.mosaic`, 2 `move_subtree` edits):
- hero-left `(0,384,540,1152)` → `(0,384,1080,556)` — full-width top row
- hero-right `(540,384,540,1152)` → `(0,942,1080,594)` — full-width bottom row

Decoded as intent ("portrait → rows"), NOT copied. Re-encoded at the template
level: `hero = isPortrait ? "2[1,1]" : "2(1,1)"`. candidate-002 renders
`5[1,0,0,2[1,1],1]` natively on portrait; landscape/square keep `2(1,1)`.

## Status
- [x] v1 template built + unit tested (`5[1,0,0,2(1,1),1]`, validates).
- [x] `candidate-001.mosaicx` authored in-session + `.mosaic` twin frozen.
- [x] Opened via `--make` (Make adopts the sandbox file).
- [x] Human ran the 3 aspects and dragged the hero into rows on mobile.
- [x] Agent decoded `geometryEdits` → applied aspect-adaptive fix; tests flipped
      (portrait → `2[1,1]`), templates rebuilt.
- [x] `candidate-002.mosaicx` (fix, mobile dims) authored + `.mosaic` twin frozen.
- [x] Human confirmed all three aspects ("perfect, ship it." — 2026-07-06T16:46Z).
- [x] Promoted candidate-002 → `master.mosaicx` + `master.mosaic`.

## Outcome — handshake VERIFIED ✅
The Make geometry-edit handshake works end-to-end: human drags on a rendered
template in Make → `_humanedits.mosaic` freezes into the sandbox session (via
`open <file>.mosaicx --make`) → agent decodes `editor.geometryEdits` as intent →
re-encodes as a template-level aspect-adaptive fix → human confirms. The template
(`@m0saic/demos/header-hero-footer/v1`) is the vehicle; the mechanism is the
deliverable.
