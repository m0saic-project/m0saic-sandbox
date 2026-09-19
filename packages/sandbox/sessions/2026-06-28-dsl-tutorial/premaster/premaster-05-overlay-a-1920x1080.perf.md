# Render perf report

**14.4s** total  ·  **62** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-05-overlay-a-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/gcolc13` · 5-deep overlay — 6.4s, **44.3%** of the render. Its own composite is the cost (self 6.2s of 6.4s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 44.3%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 6.2s | 43.1% | 6.4s | 1 |
| `root` | — | 2.5s | 17.3% | 14.4s | 1 |
| `root:4` | inspector | 2.1s | 14.4% | 3.1s | 1 |
| `root:5` | chrome-status | 0.5s | 3.6% | 1.0s | 1 |
| `root:0` | chrome-header | 0.5s | 3.1% | 0.7s | 1 |
| `root:1` | dsl-string | 0.3s | 2.4% | 0.5s | 1 |
| `root:0:1_text` | — | 0.1s | 1% | 0.1s | 1 |
| `root:2:0_text` | — | 0.1s | 0.9% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/gcolc13` | canvas | 6.2s | 6.4s | 5-deep |
| `r` | — | 2.5s | 14.4s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.1s | 3.1s | 7-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc8/gcolc12` | chrome-header | 0.5s | 0.7s | 2-deep |
| `r/growc17` | dsl-string | 0.3s | 0.5s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.2s | 0.2s | — |
| `r/growc8/gcolc12/fc38` | — | 0.1s | 0.1s | — |
| `r/growc17/fc22/ov1c0` | — | 0.1s | 0.1s | 2-deep |
| `r/growc17/fc2` | — | 0.1s | 0.1s | — |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 12.2s | 84.6% |
| Render text source "…" to image | 45 | 1.6s | 10.8% |
| Render text source "…" to video | 10 | 0.7s | 4.6% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 14 | `root:3` | canvas | 6.2s | m0saic render (mosaic node) |
| 62 | `root` | — | 2.5s | m0saic render (mosaic node) |
| 43 | `root:4` | inspector | 2.1s | m0saic render (mosaic node) |
| 61 | `root:5` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.5s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.3s | m0saic render (mosaic node) |
| 1 | `root:0:1_text` | — | 0.1s | Render text source "root:0:1_text" to image |
| 8 | `root:2:0_text` | — | 0.1s | Render text source "root:2:0_text" to video |
| 9 | `root:2` | dsl-narration | 0.1s | m0saic render (mosaic node) |
| 6 | `root:1:2_text` | — | 0.1s | Render text source "root:1:2_text" to image |

## Node tree

```
root  14.4s · 100% (self 2.5s)
├─ root:3 canvas  6.4s · 44.3% (self 6.2s)  ◄ bottleneck
│  └─ + 4 more leaves  0.2s · 1.2%
├─ root:4 inspector  3.1s · 21.6% (self 2.1s)
│  └─ + 28 more leaves  1.0s · 7.2%
├─ root:5 chrome-status  1.0s · 6.9% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 3.3%
├─ root:0 chrome-header  0.7s · 4.8% (self 0.5s)
│  └─ + 3 more leaves  0.2s · 1.7%
├─ root:1 dsl-string  0.5s · 3.4% (self 0.3s)
│  └─ + 2 more leaves  0.1s · 1%
└─ root:2 dsl-narration  0.2s · 1.6% (self 0.1s)
   └─ + 1 more leaf  0.1s · 0.9%
```
