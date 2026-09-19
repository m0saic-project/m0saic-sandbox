# Agent instructions (extended) — learnings from real human↔agent iteration

`agent.md` is the contract. This file is the **field notes**: how humans
*actually* edit `.m0c` files in Mosaic Desktop, and how an agent should
react. Read `agent.md` first; read this when you're about to author or
re-read an edited candidate.

Everything here was observed in live sessions. Add to it when you learn
something new — keep entries concrete ("I saw X → do Y"), not abstract.

---

## 1. The agent emits minimal m0; the human's edits make it massive

You will hand off a tight, legible string like
`8[0,0,0,0,0,0,1{5(...)},1{...}]`. The human opens it in Edit mode,
drags/resizes rects, and hands it back — and the m0 is now **huge**:
thousands of tokens, `gcol`-prefixed splits with `N` in the hundreds or
thousands (`108[...]`, `384(...)`, `1920(...)`), deep overlay nesting.

The editor places rects by **gridding to the pixel** — it emits a giant
donation split whose `N` equals the pixel extent, then claims the one
slot the rect lives in. That's why the string explodes. It is correct;
it is just verbose.

**Consequences for you:**

- **Never eyeball an edited m0.** It's unreadable by the time it comes
  back. Don't try to hand-diff the strings.
- **Always work through the DSL APIs**, not text. To read what the human
  actually built, parse it:
  ```js
  import { parseM0StringComplete } from "@m0saic/dsl";
  const r = parseM0StringComplete(file.m0, W, H);
  const byKey = new Map(r.ir.renderFrames.map(f => [f.meta.stableKey, f]));
  ```
  Then read each labeled region's real geometry from `byKey.get(stableKey)`
  → `{x, y, width, height}`. The rendered frames are the truth; the
  string is just transport.
- **Don't carry the human's bloated string forward.** Extract the intent
  (the rects), then **re-emit a fresh minimal structure** for the next
  candidate. Each candidate should start clean again — otherwise the
  string compounds every round until it's unmanageable.

---

## 2. Labels persist across edits — they're the shared handle; trust them

A label is the durable, shared way for both parties to say **"this rect."**
It is a *name on a region*, not a pointer to a fixed stableKey. The labels
you authored **stay** — the human keeps using them to mean the same region.

When the human edits a rect in Edit mode, the underlying geometry (and the
stableKey beneath it) changes, but **the label moves with it**: same label
text, now bound to the new stableKey and the new rect. A label only changes
meaning if the human *explicitly* renames or removes it.

- The old rect/stableKey often lingers underneath for provenance. **It
  doesn't matter — the label has moved.** Don't chase the buried original.
- **Scribe provenance stamps** show up as duplicate labels suffixed `-1`,
  `-2` (e.g. `splash-1`, `progressBar-2`) — the human's own iteration
  trail, not separate regions. Dedupe by base name.

**Practical read path:** the label IS your reliable join across iterations;
the stableKey underneath is an implementation detail that churns. To see
what the human changed, resolve each label to its **current** stableKey and
read that frame's rect:

```js
import { parseM0StringComplete } from "@m0saic/dsl";
const r = parseM0StringComplete(file.m0, W, H);
const byKey = new Map(r.ir.renderFrames.map(f => [f.meta.stableKey, f]));
for (const [stableKey, lbl] of Object.entries(file.labels)) {
  const f = byKey.get(stableKey);     // the label's CURRENT geometry
  // f.x / f.y / f.width / f.height → the human's new rect for this label
}
```

Edge case: if *you* do a global restructure that occludes a region the
human never touched, that region's label can be left pointing at a
now-unrendered stableKey. Resolve what you can, and re-emit a fresh label
map keyed to your clean structure for the next candidate (validate via
`tools/wireframe.mjs --labels '{...}'`). But the default truth is: **labels
follow the human's edits — rely on them.**

---

## 3. Human edits are pixel-imperfect — snap to the intended grid

Dragged rects come back **slightly off**: a region's right edge at 1475
while its neighbor's left is at 1478 (3px gap), a bottom at 726 over a
top at 730 (4px overlap), a rail at 438 next to one at 445. The human
will literally say "some of my adjustments are slightly offset, fix the
imperfections" and "all rects should be touching, no gaps."

**Snap, don't transcribe.** Read the human's approximate rects, infer the
**obvious intended grid**, and rebuild to that:

- Pick clean shared boundaries (one rail/main divider x, one top/bottom
  bar divider y) and make every region on each side share them exactly.
- Round wandering edges to the nearest sensible value (438/445 → 440;
  726/730 → 730).
- Verify the result tiles with **zero gaps and zero overlaps** (sum of
  region areas == canvas area is a cheap full-coverage check).

Exact pixel fidelity to the human's drag is *not* the goal — they
couldn't hit it by hand anyway. A clean gapless tiling that matches their
*intent* is what they're asking for.

### When the human actually wants gaps (padding / margin)

Contiguous is the **default**, not a law. In most cases the layout should
tile with no gaps — but the human may genuinely want padding or margin
between regions, and it's fine to give it **on request**. Don't add gaps
unprompted, and don't remove gaps the human deliberately asked for.

When they do ask, surface the trade-off — gaps can live at two layers, and
the cheaper one is usually *not* the layout:

- **Layout-level gaps (in the m0) are absolute and rigid.** You buy a gap
  with a null tile (`-`) that consumes fixed pixels. Changing that padding
  later means **re-deriving the whole layout** — the split counts,
  donation runs, and every neighboring region's geometry shift to make
  room. Padding baked into the m0 is load-bearing structure; nudging it is
  a full rebuild, not a tweak.
- **Template-level padding is forgiving.** The template that consumes the
  layout can inset/align its content within each region — **fractional**
  padding (e.g. 4% of the cell), per-side, with alignment — without
  touching the m0 at all. Adjusting it is a prop change, not a relayout.

**Default recommendation to the human:** keep the *layout* contiguous
(gapless tiling of named regions) and apply padding/margins/alignment at
the *template* layer, where it's fractional and cheap to revise. Reserve
layout-level nulls for gaps that are genuinely structural and fixed. Note
also that **overlapping regions are possible** at the template layer too
(layers can overlap), so "these two should overlap" is a template concern,
not a reason to fight the layout tiling.

---

## 4. Reconstruction: `placeRects` is the default; don't over-optimize

When you rebuild geometry from extracted rects, all the tools are exact —
each places rects at integer-pixel positions, one rect = one frame. They
differ in m0 shape, not correctness:

- **`placeRects` (plural) is the default.** It places ALL rects, one
  rendered frame each, packing them onto as few overlay layers as
  possible. Any rect another would slice vertically spills to its own
  layer rather than fragmenting — so the result is always faithful, and
  it's usually **less verbose** than stacking `placeRect` per rect
  (fewer layers, compact band splits). Reach for it by default.

- **`placeRect` (singular) isolates one rect on its own layer.** Same
  exact placement, but each call is its own layer. That's more verbose,
  and the isolation is sometimes exactly the point: in a noisier layout
  it's useful for the human to see a specific frame alone on a layer so
  they can focus on / edit it without the neighbors in the way. Use it
  when per-frame isolation helps the reviewer, not as a correctness
  fallback (placeRects is already correct).

- **A hand-built nested structure** (donation-run splits + null carriers,
  §5) is the leanest single-tree form for a hierarchical dashboard (rail
  subdivided into rows, main into rows, bottom into columns) and reads as
  explicit logical owners. Worth it when you want the m0 itself to mirror
  the hierarchy; otherwise `placeRects` gets you there with less effort.

**Don't agonize over which produces the leanest m0 during exploration.**
The closeout **optimization / Compact pass** (`compactDocument` — drop
null layers, repack every rect onto as few layers as possible, optional
GCD snap) flattens all of this optimally at the end regardless of how you
authored it mid-session. Per `agent.md`, optimization is a *closing*
step, not an exploration step — pick whichever tool is convenient now and
let Compact do the packing later.

---

## 5. Null carriers are "logical owners" — a first-class concept

A null tile carrying an overlay (`-{<sublayout>}`) is **not** a hack to
suppress a frame — it's a first-class Mosaic concept: a **logical owner**.
The `-` renders nothing itself, but the `{…}` declares "something useful
lives on top of this region." It owns the region structurally without
painting it. Mosaic Desktop gives logical owners **special UI treatment**
(surfaced as owners, toggleable on/off) — they're meant to be authored
deliberately, not just tolerated.

Use them whenever you nest sub-layouts: carry each sub-tree on a `-{…}`
owner rather than a rendered `1{…}` tile. Two payoffs:

- **Semantic:** the owner says "this rectangle is a container for what's
  inside," which is exactly true for a rail / main / footer band. That's
  the honest model, and the editor/File Details can act on it.
- **Frame hygiene:** a `1{}` carrier renders a background frame at the
  carrier's bounds *plus* the sub-regions on top — every nesting level
  adds a stray unlabeled frame. A `-{}` owner adds none, so the only
  rendered leaves are your actual regions.

Observed: `-` works both as a **donation claimant** (`13(0,0,-{RAIL},…)`
— the `-` absorbs the two preceding `0`s) and as an **overlay anchor**.
The root-level `NO_SOURCES` check is satisfied because the `1` leaves live
inside the overlays (sources in overlays count). Result: a 12-region
dashboard parsed to exactly **12 leaf frames, no filler** — every frame is
a region you can label, and every container is an explicit logical owner.

Reach for a rendered `1{}` carrier only when you actually want that region
to have its own paintable background panel (not just own what's on top).

---

## 6. The re-read loop, end to end

When an edited candidate comes back:

1. `parseM0StringComplete(file.m0, W, H)` → `renderFrames`.
2. Resolve each **label** to its current stableKey → read its rect (§2).
   Labels followed the human's edits; they're your join key.
3. Infer the intended grid; **snap** to gapless boundaries (§3).
4. Re-emit a **fresh** structure (`placeRects` by default, or hand-built
   nested splits + null carriers — §4/§5), not the human's bloated string.
   Don't over-optimize; Compact repacks it at closeout.
5. Re-derive labels against the new parse; validate via the tool.
6. Write the next candidate (linear increment), snapshot `-agent`, hand
   off with `m0saic open`.

The human edits in pixels; you respond in clean structure. That division
of labor is the whole point.
