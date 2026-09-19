# Render perf report

**14.7s** total  ·  **61** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/./master_candidate-03-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 5.5s, **37.1%** of the render. Its own composite is the cost (self 5.3s of 5.5s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 37.1%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 5.3s | 35.8% | 5.5s | 1 |
| `root` | — | 3.0s | 20.6% | 14.7s | 1 |
| `root:4` | inspector | 2.2s | 15.1% | 3.4s | 1 |
| `root:5` | chrome-status | 0.5s | 3.4% | 1.0s | 1 |
| `root:0` | chrome-header | 0.5s | 3.1% | 0.7s | 1 |
| `root:1` | dsl-string | 0.4s | 2.5% | 0.9s | 1 |
| `root:1:0_text` | — | 0.3s | 1.8% | 0.3s | 1 |
| `root:1:2_text` | — | 0.3s | 1.8% | 0.3s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 5.3s | 5.5s | 7-deep |
| `r` | — | 3.0s | 14.7s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.2s | 3.4s | 7-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc8/gcolc12` | chrome-header | 0.5s | 0.7s | 2-deep |
| `r/growc17` | dsl-string | 0.4s | 0.9s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.3s | 0.3s | — |
| `r/growc17/fc2` | — | 0.3s | 0.3s | — |
| `r/growc17/fc22/ov1c0` | — | 0.3s | 0.3s | 2-deep |
| `r/gcolc93/gcolc3/fc13/ov1c0/ov2c0` | — | 0.2s | 0.2s | 3-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 12.0s | 81.3% |
| Render text source "…" to image | 44 | 1.9s | 13.2% |
| Render text source "…" to video | 10 | 0.8s | 5.5% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 11 | `root:3` | canvas | 5.3s | m0saic render (mosaic node) |
| 61 | `root` | — | 3.0s | m0saic render (mosaic node) |
| 42 | `root:4` | inspector | 2.2s | m0saic render (mosaic node) |
| 60 | `root:5` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.5s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 5 | `root:1:0_text` | — | 0.3s | Render text source "root:1:0_text" to image |
| 6 | `root:1:2_text` | — | 0.3s | Render text source "root:1:2_text" to image |
| 8 | `root:2:0_text` | — | 0.2s | Render text source "root:2:0_text" to video |
| 10 | `root:3:2_text` | — | 0.2s | Render text source "root:3:2_text" to image |

## Node tree

```
root  14.7s · 100% (self 3.0s)
├─ root:3 canvas  5.5s · 37.1% (self 5.3s)  ◄ bottleneck
│  └─ + 1 more leaf  0.2s · 1.3%
├─ root:4 inspector  3.4s · 22.9% (self 2.2s)
│  └─ + 30 more leaves  1.1s · 7.8%
├─ root:5 chrome-status  1.0s · 6.6% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 3.1%
├─ root:1 dsl-string  0.9s · 6.1% (self 0.4s)
│  └─ + 2 more leaves  0.5s · 3.6%
├─ root:0 chrome-header  0.7s · 4.5% (self 0.5s)
│  └─ + 3 more leaves  0.2s · 1.4%
└─ root:2 dsl-narration  0.3s · 2.2% (self 0.1s)
   └─ + 1 more leaf  0.2s · 1.5%
```
