# Render perf report

**9.9s** total  ·  **8** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-08-chromeless-a-1920x1080.mp4`

## ⤷ Bottleneck

`root:2` — **canvas** · `r/gcolc99/fc36` · 7-deep overlay — 7.0s, **71.1%** of the render. Its own composite is the cost (self 7.0s of 7.0s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:2` (canvas) 71.1%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:2` | canvas | 7.0s | 70.2% | 7.0s | 1 |
| `root` | — | 2.0s | 19.9% | 9.9s | 1 |
| `root:0` | dsl-string | 0.4s | 3.7% | 0.7s | 1 |
| `root:0:0_text` | — | 0.2s | 1.9% | 0.2s | 1 |
| `root:1:0_text` | — | 0.1s | 1.2% | 0.1s | 1 |
| `root:1` | dsl-narration | 0.1s | 1.1% | 0.2s | 1 |
| `root:0:2_text` | — | 0.1s | 1% | 0.1s | 1 |
| `root:2:2_text` | — | 0.1s | 0.9% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc99/fc36` | canvas | 7.0s | 7.0s | 7-deep |
| `r` | — | 2.0s | 9.9s | 7-deep |
| `r/growc8` | dsl-string | 0.4s | 0.7s | 2-deep |
| `r/growc14/gcolc4/fc96` | dsl-narration | 0.2s | 0.2s | — |
| `r/growc8/fc2` | — | 0.2s | 0.2s | — |
| `r/growc8/fc22/ov1c0` | — | 0.1s | 0.1s | 2-deep |
| `r/gcolc99/fc36/ov1c0/ov2c0` | — | 0.1s | 0.1s | 3-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 4 | 9.4s | 95% |
| Render text source "…" to image | 3 | 0.4s | 3.8% |
| Render text source "…" to video | 1 | 0.1s | 1.2% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 7 | `root:2` | canvas | 7.0s | m0saic render (mosaic node) |
| 8 | `root` | — | 2.0s | m0saic render (mosaic node) |
| 3 | `root:0` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 1 | `root:0:0_text` | — | 0.2s | Render text source "root:0:0_text" to image |
| 4 | `root:1:0_text` | — | 0.1s | Render text source "root:1:0_text" to video |
| 5 | `root:1` | dsl-narration | 0.1s | m0saic render (mosaic node) |
| 2 | `root:0:2_text` | — | 0.1s | Render text source "root:0:2_text" to image |
| 6 | `root:2:2_text` | — | 0.1s | Render text source "root:2:2_text" to image |

## Node tree

```
root  9.9s · 100% (self 2.0s)
├─ root:2 canvas  7.0s · 71.1% (self 7.0s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.9%
├─ root:0 dsl-string  0.7s · 6.6% (self 0.4s)
│  └─ + 2 more leaves  0.3s · 2.9%
└─ root:1 dsl-narration  0.2s · 2.4% (self 0.1s)
   └─ + 1 more leaf  0.1s · 1.2%
```
