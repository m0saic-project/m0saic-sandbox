# Render perf report

**14.2s** total  ·  **61** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/./master_candidate-02-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 5.3s, **37.5%** of the render. Its own composite is the cost (self 5.2s of 5.3s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 37.5%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 5.2s | 36.8% | 5.3s | 1 |
| `root` | — | 2.7s | 19% | 14.2s | 1 |
| `root:4` | inspector | 2.3s | 16.2% | 3.5s | 1 |
| `root:5` | chrome-status | 0.6s | 4.2% | 1.1s | 1 |
| `root:0` | chrome-header | 0.5s | 3.5% | 0.7s | 1 |
| `root:1` | dsl-string | 0.3s | 2.4% | 0.6s | 1 |
| `root:2:0_text` | — | 0.2s | 1.1% | 0.2s | 1 |
| `root:1:2_text` | — | 0.2s | 1.1% | 0.2s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 5.2s | 5.3s | 7-deep |
| `r` | — | 2.7s | 14.2s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.3s | 3.5s | 7-deep |
| `r/growc99/gcolc12` | chrome-status | 0.6s | 1.1s | — |
| `r/growc8/gcolc12` | chrome-header | 0.5s | 0.7s | 2-deep |
| `r/growc17` | dsl-string | 0.3s | 0.6s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.3s | 0.3s | — |
| `r/growc17/fc22/ov1c0` | — | 0.2s | 0.2s | 2-deep |
| `r/growc17/fc2` | — | 0.1s | 0.1s | — |
| `r/growc8/gcolc12/fc38` | — | 0.1s | 0.1s | — |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 11.8s | 82.9% |
| Render text source "…" to image | 44 | 1.7s | 11.8% |
| Render text source "…" to video | 10 | 0.8s | 5.3% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 11 | `root:3` | canvas | 5.2s | m0saic render (mosaic node) |
| 61 | `root` | — | 2.7s | m0saic render (mosaic node) |
| 42 | `root:4` | inspector | 2.3s | m0saic render (mosaic node) |
| 60 | `root:5` | chrome-status | 0.6s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.5s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.3s | m0saic render (mosaic node) |
| 8 | `root:2:0_text` | — | 0.2s | Render text source "root:2:0_text" to video |
| 6 | `root:1:2_text` | — | 0.2s | Render text source "root:1:2_text" to image |
| 5 | `root:1:0_text` | — | 0.1s | Render text source "root:1:0_text" to image |
| 9 | `root:2` | dsl-narration | 0.1s | m0saic render (mosaic node) |

## Node tree

```
root  14.2s · 100% (self 2.7s)
├─ root:3 canvas  5.3s · 37.5% (self 5.2s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.7%
├─ root:4 inspector  3.5s · 24.4% (self 2.3s)
│  └─ + 30 more leaves  1.2s · 8.2%
├─ root:5 chrome-status  1.1s · 7.6% (self 0.6s)
│  └─ + 17 more leaves  0.5s · 3.4%
├─ root:0 chrome-header  0.7s · 5.1% (self 0.5s)
│  └─ + 3 more leaves  0.2s · 1.6%
├─ root:1 dsl-string  0.6s · 4.5% (self 0.3s)
│  └─ + 2 more leaves  0.3s · 2.1%
└─ root:2 dsl-narration  0.3s · 1.9% (self 0.1s)
   └─ + 1 more leaf  0.2s · 1.1%
```
