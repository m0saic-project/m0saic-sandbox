#!/usr/bin/env node
/**
 * Generator for the 2026-06-10 fill+knobs smoke session.
 *
 * Emits one candidate per M0cFile knob (and a kitchen-sink) so every
 * field on a .m0c can be visually validated in Mosaic Desktop's
 * inspector. Each candidate is round-trip-correct by construction —
 * we feed serializeM0cFile, not hand-authored JSON, so the on-disk
 * shape always matches the format contract.
 *
 * Run from this directory:   node generate.mjs
 *
 * Layout: 4(F,F,F,F) — four side-by-side frames at 1920×1080. Picked
 * because four stableKeys are enough to demonstrate per-frame
 * variation without making the inspector noisy.
 *
 * ── Iteration convention ───────────────────────────────────────
 * This script emits ONE file per candidate — the "first iteration"
 * (no suffix). When a human rejects a candidate's question, the
 * fix lands as a NEW file with a `-a`/`-b`/`-c` suffix (hand-
 * crafted, not regenerated). The original stays frozen with its
 * rejection.
 *
 * WARNING: re-running this script overwrites the no-suffix files.
 * If iteration variants exist in this directory (`-a` / `-b`
 * files), DO NOT regenerate without first archiving the iteration
 * trail — you would clobber the first-iteration files that the
 * iteration variants reference. The `-a` files themselves are
 * never produced by this script.
 *
 * See `notes.md` § "Iteration convention" for the full rationale.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Buffer } from "node:buffer";
import zlib from "node:zlib";
import { serializeM0cFile } from "@m0saic/dsl-file-formats";
import { parseM0StringComplete } from "@m0saic/dsl";

/**
 * Minimal PNG encoder — emits a solid-color RGB PNG at arbitrary
 * dimensions. Used by candidate-09 to embed a meaningfully-sized
 * background image (the previous 1×1 was invisible at true-scale
 * rendering and the test couldn't be verified). Inlined here so the
 * generator stays dependency-free.
 */
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makeSolidRgbPng(w, h, r, g, b) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;     // bit depth
  ihdr[9] = 2;     // RGB color type
  const rowLen = 1 + w * 3;
  const raw = Buffer.alloc(rowLen * h);
  for (let y = 0; y < h; y++) {
    const s = y * rowLen;
    raw[s] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const i = s + 1 + x * 3;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

const DIR = dirname(fileURLToPath(import.meta.url));
const FIXED_DATE = new Date("2026-06-10T12:00:00.000Z");

const M0 = "4(F,F,F,F)";
const WIDTH = 1920;
const HEIGHT = 1080;

// Resolve the actual stableKeys for the layout so every per-frame
// map uses keys that round-trip cleanly through the parser. Skip the
// root + any non-frame entries — labels/masks/fill only apply to
// leaf-frame stableKeys.
const parsed = parseM0StringComplete(M0, WIDTH, HEIGHT);
if (!parsed.ok) {
  console.error("Layout failed to parse:", parsed);
  process.exit(1);
}
const frameKeys = parsed.ir.editorFrames
  .filter((f) => f.meta.kind === "frame")
  .map((f) => f.meta.stableKey);
const [K1, K2, K3, K4] = frameKeys;
console.log("Layout:", M0, "→ frame stableKeys:", frameKeys);

const baseOpts = {
  m0: M0,
  size: { width: WIDTH, height: HEIGHT },
  created: FIXED_DATE,
  app: "m0saic-fill-smoke",
  appVersion: "0.1.0",
};

function write(name, json) {
  writeFileSync(join(DIR, name), json);
  console.log(`  wrote ${name} (${json.length} bytes)`);
}

/**
 * Build an agent block with a smoke-test question. The human reviewing
 * this candidate in Mosaic Desktop populates `response` (and optionally
 * `comments`) inline to leave feedback per-file.
 */
function agent(note, question) {
  return {
    id: "claude-smoke-2026-06-10",
    note,
    question,
  };
}

// 256×256 brand-orange (#ef7525) PNG. Re-emitted from a 1×1 after
// human feedback — at true-scale rendering, the original 1×1 was
// invisible. The 256² size is large enough to clearly verify "this
// is rendered at native size, NOT stretched to the 1920×1080 canvas."
const BG_PNG = makeSolidRgbPng(256, 256, 0xef, 0x75, 0x25);
const BG_PNG_B64 = BG_PNG.toString("base64");
const BG_PNG_BYTES = BG_PNG.length;

// ─────────────────────────────────────────────────────────────
// Candidates
// ─────────────────────────────────────────────────────────────

// 01 — bare baseline. Nothing should render in any inspector overlay
// beyond the four uniform-colored rects when Rects is toggled on.
write("candidate-01-bare.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "01 · bare baseline", note: "Nothing populated. Sanity check." },
  agent: agent(
    "Sanity baseline. No labels, no fill, no masks, no background — only the four-frame layout.",
    "With the Rects toggle ON, do you see four uniform-colored rects and nothing in any other overlay (Labels, Masks, Fill)?",
  ),
}));

// 02 — labels with text only (no chip color). Labels toggle should
// show four plain text chips, no tint.
write("candidate-02-labels-text-only.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "02 · labels (text only)" },
  agent: agent(
    "Four plain text labels — alpha / beta / gamma / delta — with no chip tint.",
    "With the Labels toggle ON, do all four labels render as plain text chips (no background tint, no rect fill change)?",
  ),
  labels: {
    [K1]: { text: "alpha" },
    [K2]: { text: "beta" },
    [K3]: { text: "gamma" },
    [K4]: { text: "delta" },
  },
}));

// 03 — labels with text + color (the demoted chip tint). Per the v2
// semantic split, labels[k].color tints the badge ONLY. It must NOT
// drive the rect fill — that's `fill[k].color`'s job (see 04+).
write("candidate-03-labels-chip-color.m0c", serializeM0cFile({
  ...baseOpts,
  meta: {
    title: "03 · labels with chip color",
    note: "labels[k].color tints the badge — NOT the rect fill.",
  },
  agent: agent(
    "Labels carry chip-tint colors. Under the v2 semantic split this should tint the badge ONLY — the rect fill must come from the separate `fill` map (see candidate 04).",
    "With Labels ON: do the four chips tint with their per-frame colors? With Rects ON: do the rects stay the uniform Rects-toggle color (i.e. NOT the label colors)?",
  ),
  labels: {
    [K1]: { text: "alpha", color: "#ef7525" },
    [K2]: { text: "beta",  color: "#bcd6e8" },
    [K3]: { text: "gamma", color: "#4b5563" },
    [K4]: { text: "delta", color: "#22c55e" },
  },
}));

// 04 — fill with color only (the original ask). With the Fill sub-
// toggle on, each rect should paint with the per-frame color below.
write("candidate-04-fill-color.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "04 · fill (color only)" },
  agent: agent(
    "Per-frame rect color via the new top-level `fill` map. Labels carry text only — chip tint is not involved.",
    "With Rects ON and the new Fill sub-toggle ON, does each rect take its per-frame color (pale steel / orange / dark gray / near-black)? If the Fill sub-toggle does not exist yet, the inspector is still on the Phase-1-only UI and this candidate is waiting on the Phase-2 rewire.",
  ),
  labels: {
    [K1]: { text: "agent · 🤖" },
    [K2]: { text: "human · 👤" },
    [K3]: { text: "system" },
    [K4]: { text: "context" },
  },
  fill: {
    [K1]: { color: "#bcd6e8" },
    [K2]: { color: "#ef7525" },
    [K3]: { color: "#4b5563" },
    [K4]: { color: "#23262f" },
  },
}));

// 05 — fill with mediaRef only. The asset resolver isn't wired yet;
// this candidate locks in the on-disk shape so a future inspector
// pass can pick up mediaRef without another format break.
write("candidate-05-fill-media.m0c", serializeM0cFile({
  ...baseOpts,
  meta: {
    title: "05 · fill (mediaRef only)",
    note: "mediaRef is a forward-compat slot. No resolver yet.",
  },
  agent: agent(
    "mediaRef-only fill entries. No resolver hookup yet, so rendering is not expected — the goal is to confirm the field round-trips on disk and surfaces in the editor.",
    "Does the file-details panel (or any per-frame inspector view) surface the per-frame mediaRef strings? Visible rendering of the referenced media is NOT expected at this stage.",
  ),
  labels: {
    [K1]: { text: "avatar" },
    [K2]: { text: "hero" },
    [K3]: { text: "logo" },
    [K4]: { text: "ornament" },
  },
  fill: {
    [K1]: { mediaRef: "./media/avatar-1.png" },
    [K2]: { mediaRef: "./media/hero-banner.jpg" },
    [K3]: { mediaRef: "asset:brand-logo" },
    [K4]: { mediaRef: "asset:ornament-sparkle" },
  },
}));

// 06 — fill with BOTH color and mediaRef per entry. Acts as a
// placeholder palette while the asset resolves, then the media
// would paint on top. Round-trip preserves both.
write("candidate-06-fill-both.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "06 · fill (color + mediaRef)" },
  agent: agent(
    "Each fill entry carries BOTH color and mediaRef. Color is the placeholder paint today; mediaRef sits as a forward-compat slot for the future asset resolver.",
    "With Fill ON, does each rect paint its color? Does the file-details panel also surface the per-frame mediaRef strings (without dropping either field)?",
  ),
  labels: {
    [K1]: { text: "avatar / agent" },
    [K2]: { text: "avatar / human" },
    [K3]: { text: "brand mark" },
    [K4]: { text: "decoration" },
  },
  fill: {
    [K1]: { color: "#bcd6e8", mediaRef: "./media/avatar-agent.png" },
    [K2]: { color: "#ef7525", mediaRef: "./media/avatar-human.png" },
    [K3]: { color: "#4b5563", mediaRef: "asset:brand-mark-light" },
    [K4]: { color: "#22c55e", mediaRef: "asset:sparkle-1" },
  },
}));

// 07 — masks with SVG silhouettes. Masks toggle should show two
// circle clips on K1/K2 plus a rect clip on K3. K4 stays unmasked.
write("candidate-07-masks.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "07 · masks (SVG silhouettes)" },
  agent: agent(
    "Two circle masks, one inner-rect mask, one explicit-null entry (K4 = 'no mask, on purpose').",
    "With Masks ON, do K1/K2 render as circle silhouettes, K3 as a smaller inner rect, and K4 stay a full rect (the explicit-null entry should NOT mask it)?",
  ),
  labels: {
    [K1]: { text: "circle 1" },
    [K2]: { text: "circle 2" },
    [K3]: { text: "rect" },
    [K4]: { text: "(no mask)" },
  },
  masks: {
    [K1]: {
      localPath: "M 20 0 A 20 20 0 1 0 20 40 A 20 20 0 1 0 20 0 Z",
      bounds: { x: 0, y: 0, width: 40, height: 100 },
    },
    [K2]: {
      localPath: "M 20 0 A 20 20 0 1 0 20 40 A 20 20 0 1 0 20 0 Z",
      bounds: { x: 0, y: 0, width: 40, height: 100 },
    },
    [K3]: {
      localPath: "M 10 10 H 90 V 90 H 10 Z",
      bounds: { x: 0, y: 0, width: 100, height: 100 },
    },
    [K4]: null,
  },
}));

// 08 — background as a solid color hex. Canvas should tint to the
// dark slate below; rects render on top.
write("candidate-08-background-color.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "08 · background (solid color)" },
  agent: agent(
    "derive.background carries a dark slate hex. Canvas tint, rects on top.",
    "Is the canvas tinted #14151b, with the four uniform rects rendering on top?",
  ),
  background: "#14151b",
}));

// 09 — background as an embedded image. The inspector reads
// derive.background as a data: URI and renders the bytes inline.
write("candidate-09-background-image.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "09 · background (embedded image)" },
  agent: agent(
    "256×256 brand-orange PNG embedded as a data: URI in derive.background. Now visibly verifiable at true scale (image renders 256×256 inside the 1920×1080 canvas; explicitly NOT stretched).",
    "Does the canvas show a 256×256 brand-orange square rendered at its native size (positioned per the renderer's true-scale convention — NOT stretched to fill 1920×1080)?",
  ),
  deriveImage: { mime: "image/png", bytes: BG_PNG_BYTES, b64: BG_PNG_B64 },
}));

// 10 — named rank sets. A `diag` sweep distributes 0..1 across the
// four frames. Surfaces in rank-aware overlays / templates.
write("candidate-10-rank-sets.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "10 · rankSets (diagonal sweep)" },
  agent: agent(
    "A `diag` rank set with values 0, 0.33, 0.66, 1 across the four frames.",
    "Does any rank-aware overlay or template surface pick up this sweep? If the inspector does not surface ranks directly, this is a pure round-trip check — confirm the values are visible somewhere in the file-details view.",
  ),
  rankSets: {
    diag: {
      mode: "diag",
      ranks: { [K1]: 0, [K2]: 0.33, [K3]: 0.66, [K4]: 1 },
    },
  },
}));

// 11 — meta + app populated. Inspector's file-details panel should
// show every field.
write("candidate-11-meta-app.m0c", serializeM0cFile({
  ...baseOpts,
  app: "m0saic-fill-smoke",
  appVersion: "1.2.3+test",
  meta: {
    title: "11 · meta + app",
    author: "smoke generator",
    source: "fill-and-knobs-smoke",
    note: "Every meta field populated so the inspector's details panel can be eyeballed.",
  },
  agent: agent(
    "All four meta fields (title / author / source / note) + a bumped appVersion.",
    "Does the file-details panel surface all four meta fields and the appVersion (1.2.3+test) correctly?",
  ),
}));

// 12 — agent annotations populated. Note, question, regions,
// response (pre-filled), and a comment thread. This candidate
// double-duties: smoke-tests the agent panel AND demonstrates the
// "human leaves feedback inline" workflow with a sample reply
// already baked in.
write("candidate-12-agent.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "12 · agent annotations" },
  agent: {
    id: "claude-smoke-2026-06-10",
    note: "Smoke candidate covering the agent annotation block: note + question + regions registry + response + 2-comment thread.",
    question: "Does the agent panel surface every field — note, question, regions, response, comments — without dropping any? (Unlike the other candidates, this one ships with a sample response pre-filled to show the rendered shape.)",
    regions: { hero: K1, body: K2, side: K3, footer: K4 },
    response: {
      body: "Sample response — replace this body to leave real feedback for this candidate.",
      from: "human",
      at: "2026-06-10T12:05:00.000Z",
    },
    comments: [
      { id: "c1", body: "Initial pass.", from: "agent", at: "2026-06-10T12:00:00.000Z" },
      { id: "c2", body: "Add a comment to verify the thread renders.", from: "human", at: "2026-06-10T12:03:00.000Z" },
    ],
  },
}));

// 13 — custom JSON. Free-form payload that round-trips unchanged.
// Templates and tooling stash structured data here.
write("candidate-13-custom.m0c", serializeM0cFile({
  ...baseOpts,
  meta: { title: "13 · custom JSON" },
  agent: agent(
    "Free-form payload (brand / copy / flags) stashed in `custom`. Format treats it as opaque JSON.",
    "Does the inspector's custom-JSON view surface the brand / copy / flags object unchanged (no key reorders, no value drops)?",
  ),
  custom: {
    brand: { primary: "#ef7525", secondary: "#bcd6e8", neutral: "#23262f" },
    copy: { hero: "Hello, smoke.", sub: "Every knob, accounted for." },
    flags: { showOverlay: true, dataset: "fill-and-knobs" },
  },
}));

// 14 — kitchen sink. Every knob populated at once. This is the
// canary: if anything ever drops a field on round-trip, this
// candidate exposes it.
write("candidate-14-everything.m0c", serializeM0cFile({
  ...baseOpts,
  app: "m0saic-fill-smoke",
  appVersion: "1.2.3+test",
  meta: {
    title: "14 · kitchen sink",
    author: "smoke generator",
    source: "fill-and-knobs-smoke",
    note: "Every M0cFile knob populated at once.",
  },
  agent: {
    id: "claude-smoke-2026-06-10",
    note: "Kitchen sink — every M0cFile knob populated at once. The canary: if a future change ever drops a field on round-trip, this is the candidate that exposes it.",
    question: "Does every knob render simultaneously without any field being dropped? Specifically: labels (with chip color), background tint, masks (two circles), fill (per-frame color + mediaRef), rank sets (diag + importance), agent block, custom JSON — all visible at once?",
    regions: { hero: K1, body: K2, side: K3, footer: K4 },
    response: { body: "Sample response — replace this body to leave real feedback for the canary.", from: "human", at: "2026-06-10T12:10:00.000Z" },
    comments: [{ id: "c1", body: "All fields visible at the time of generation.", from: "agent", at: "2026-06-10T12:10:00.000Z" }],
  },
  labels: {
    [K1]: { text: "agent · 🤖", color: "#bcd6e8" },
    [K2]: { text: "human · 👤", color: "#ef7525" },
    [K3]: { text: "brand", color: "#4b5563" },
    [K4]: { text: "context", color: "#23262f" },
  },
  background: "#14151b",
  masks: {
    [K1]: {
      localPath: "M 20 0 A 20 20 0 1 0 20 40 A 20 20 0 1 0 20 0 Z",
      bounds: { x: 0, y: 0, width: 40, height: 100 },
    },
    [K2]: {
      localPath: "M 20 0 A 20 20 0 1 0 20 40 A 20 20 0 1 0 20 0 Z",
      bounds: { x: 0, y: 0, width: 40, height: 100 },
    },
    [K3]: null,
    [K4]: null,
  },
  fill: {
    [K1]: { color: "#bcd6e8", mediaRef: "./media/avatar-agent.png" },
    [K2]: { color: "#ef7525", mediaRef: "./media/avatar-human.png" },
    [K3]: { color: "#4b5563" },
    [K4]: { mediaRef: "asset:context-decoration" },
  },
  rankSets: {
    diag: { mode: "diag", ranks: { [K1]: 0, [K2]: 0.33, [K3]: 0.66, [K4]: 1 } },
    importance: { ranks: { [K1]: 1, [K2]: 0.8, [K3]: 0.5, [K4]: 0.2 } },
  },
  custom: {
    brand: { primary: "#ef7525", secondary: "#bcd6e8" },
    copy: { hero: "Hello, kitchen sink." },
    flags: { reviewed: false },
  },
}));

console.log("\nGenerated 14 candidates in", DIR);
