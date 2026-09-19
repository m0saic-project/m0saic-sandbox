# Render perf report

**17.7s** total  ·  **61** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/./master_candidate-01-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 6.5s, **36.4%** of the render. Its own composite is the cost (self 6.3s of 6.5s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 36.4%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 6.3s | 35.8% | 6.5s | 1 |
| `root` | — | 4.2s | 23.8% | 17.7s | 1 |
| `root:4` | inspector | 2.5s | 14.1% | 3.8s | 1 |
| `root:0` | chrome-header | 0.7s | 4.2% | 1.1s | 1 |
| `root:5` | chrome-status | 0.6s | 3.4% | 1.1s | 1 |
| `root:1` | dsl-string | 0.4s | 2.1% | 0.7s | 1 |
| `root:0:1_text` | — | 0.2s | 1.1% | 0.2s | 1 |
| `root:1:0_text` | — | 0.2s | 1% | 0.2s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 6.3s | 6.5s | 7-deep |
| `r` | — | 4.2s | 17.7s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.5s | 3.8s | 7-deep |
| `r/growc8/gcolc12` | chrome-header | 0.7s | 1.1s | 2-deep |
| `r/growc99/gcolc12` | chrome-status | 0.6s | 1.1s | — |
| `r/growc17` | dsl-string | 0.4s | 0.7s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.3s | 0.3s | — |
| `r/growc8/gcolc12/fc38` | — | 0.2s | 0.2s | — |
| `r/growc17/fc2` | — | 0.2s | 0.2s | — |
| `r/growc17/fc22/ov1c0` | — | 0.2s | 0.2s | 2-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 14.9s | 84.3% |
| Render text source "…" to image | 44 | 1.9s | 10.8% |
| Render text source "…" to video | 10 | 0.9s | 5% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 11 | `root:3` | canvas | 6.3s | m0saic render (mosaic node) |
| 61 | `root` | — | 4.2s | m0saic render (mosaic node) |
| 42 | `root:4` | inspector | 2.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.7s | m0saic render (mosaic node) |
| 60 | `root:5` | chrome-status | 0.6s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 1 | `root:0:1_text` | — | 0.2s | Render text source "root:0:1_text" to image |
| 5 | `root:1:0_text` | — | 0.2s | Render text source "root:1:0_text" to image |
| 8 | `root:2:0_text` | — | 0.2s | Render text source "root:2:0_text" to video |
| 6 | `root:1:2_text` | — | 0.2s | Render text source "root:1:2_text" to image |

## Node tree

```
root  17.7s · 100% (self 4.2s)
├─ root:3 canvas  6.5s · 36.4% (self 6.3s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.6%
├─ root:4 inspector  3.8s · 21.3% (self 2.5s)
│  └─ + 30 more leaves  1.3s · 7.2%
├─ root:5 chrome-status  1.1s · 6.4% (self 0.6s)
│  └─ + 17 more leaves  0.5s · 3%
├─ root:0 chrome-header  1.1s · 6.1% (self 0.7s)
│  └─ + 3 more leaves  0.3s · 1.9%
├─ root:1 dsl-string  0.7s · 4.2% (self 0.4s)
│  └─ + 2 more leaves  0.4s · 2%
└─ root:2 dsl-narration  0.3s · 1.8% (self 0.1s)
   └─ + 1 more leaf  0.2s · 1%
```
