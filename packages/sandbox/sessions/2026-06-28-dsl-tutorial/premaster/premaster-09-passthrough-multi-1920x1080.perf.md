# Render perf report

**18.9s** total  ·  **61** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-09-passthrough-multi-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 7.2s, **38.1%** of the render. Its own composite is the cost (self 7.1s of 7.2s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 38.1%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 7.1s | 37.3% | 7.2s | 1 |
| `root` | — | 4.0s | 21.2% | 18.9s | 1 |
| `root:4` | inspector | 2.7s | 14.2% | 4.2s | 1 |
| `root:5` | chrome-status | 0.7s | 3.8% | 1.3s | 1 |
| `root:0` | chrome-header | 0.7s | 3.5% | 1.0s | 1 |
| `root:1` | dsl-string | 0.4s | 2.3% | 0.9s | 1 |
| `root:1:0_text` | — | 0.2s | 1.2% | 0.2s | 1 |
| `root:1:2_text` | — | 0.2s | 1.1% | 0.2s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 7.1s | 7.2s | 7-deep |
| `r` | — | 4.0s | 18.9s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.7s | 4.2s | 7-deep |
| `r/growc99/gcolc12` | chrome-status | 0.7s | 1.3s | — |
| `r/growc8/gcolc12` | chrome-header | 0.7s | 1.0s | 2-deep |
| `r/growc17` | dsl-string | 0.4s | 0.9s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.3s | 0.3s | — |
| `r/growc17/fc2` | — | 0.2s | 0.2s | — |
| `r/growc17/fc22/ov1c0` | — | 0.2s | 0.2s | 2-deep |
| `r/growc8/gcolc12/fc38` | — | 0.2s | 0.2s | — |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 15.7s | 83.1% |
| Render text source "…" to image | 44 | 2.2s | 11.8% |
| Render text source "…" to video | 10 | 1.0s | 5.1% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 11 | `root:3` | canvas | 7.1s | m0saic render (mosaic node) |
| 61 | `root` | — | 4.0s | m0saic render (mosaic node) |
| 42 | `root:4` | inspector | 2.7s | m0saic render (mosaic node) |
| 60 | `root:5` | chrome-status | 0.7s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.7s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 5 | `root:1:0_text` | — | 0.2s | Render text source "root:1:0_text" to image |
| 6 | `root:1:2_text` | — | 0.2s | Render text source "root:1:2_text" to image |
| 1 | `root:0:1_text` | — | 0.2s | Render text source "root:0:1_text" to image |
| 8 | `root:2:0_text` | — | 0.2s | Render text source "root:2:0_text" to video |

## Node tree

```
root  18.9s · 100% (self 4.0s)
├─ root:3 canvas  7.2s · 38.1% (self 7.1s)  ◄ bottleneck
│  └─ + 1 more leaf  0.2s · 0.8%
├─ root:4 inspector  4.2s · 22.1% (self 2.7s)
│  └─ + 30 more leaves  1.5s · 8%
├─ root:5 chrome-status  1.3s · 7% (self 0.7s)
│  └─ + 17 more leaves  0.6s · 3.2%
├─ root:0 chrome-header  1.0s · 5.3% (self 0.7s)
│  └─ + 3 more leaves  0.3s · 1.8%
├─ root:1 dsl-string  0.9s · 4.5% (self 0.4s)
│  └─ + 2 more leaves  0.4s · 2.2%
└─ root:2 dsl-narration  0.3s · 1.7% (self 0.2s)
   └─ + 1 more leaf  0.2s · 0.9%
```
