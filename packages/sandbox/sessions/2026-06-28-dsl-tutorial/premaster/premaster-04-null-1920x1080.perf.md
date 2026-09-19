# Render perf report

**14.5s** total  ·  **61** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-04-null-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 5.6s, **38.4%** of the render. Its own composite is the cost (self 5.5s of 5.6s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 38.4%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 5.5s | 37.9% | 5.6s | 1 |
| `root` | — | 2.9s | 20.1% | 14.5s | 1 |
| `root:4` | inspector | 2.4s | 16.3% | 3.5s | 1 |
| `root:0` | chrome-header | 0.5s | 3.7% | 0.8s | 1 |
| `root:5` | chrome-status | 0.5s | 3.6% | 1.0s | 1 |
| `root:1` | dsl-string | 0.4s | 2.4% | 0.5s | 1 |
| `root:2:0_text` | — | 0.1s | 1% | 0.1s | 1 |
| `root:0:1_text` | — | 0.1s | 0.8% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 5.5s | 5.6s | 7-deep |
| `r` | — | 2.9s | 14.5s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.4s | 3.5s | 7-deep |
| `r/growc8/gcolc12` | chrome-header | 0.5s | 0.8s | 2-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc17` | dsl-string | 0.4s | 0.5s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.2s | 0.2s | — |
| `r/growc8/gcolc12/fc38` | — | 0.1s | 0.1s | — |
| `r/growc17/fc22/ov1c0` | — | 0.1s | 0.1s | 2-deep |
| `r/growc17/fc2` | — | 0.1s | 0.1s | — |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 12.3s | 84.7% |
| Render text source "…" to image | 44 | 1.5s | 10.6% |
| Render text source "…" to video | 10 | 0.7s | 4.7% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 11 | `root:3` | canvas | 5.5s | m0saic render (mosaic node) |
| 61 | `root` | — | 2.9s | m0saic render (mosaic node) |
| 42 | `root:4` | inspector | 2.4s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.5s | m0saic render (mosaic node) |
| 60 | `root:5` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 8 | `root:2:0_text` | — | 0.1s | Render text source "root:2:0_text" to video |
| 1 | `root:0:1_text` | — | 0.1s | Render text source "root:0:1_text" to image |
| 9 | `root:2` | dsl-narration | 0.1s | m0saic render (mosaic node) |
| 6 | `root:1:2_text` | — | 0.1s | Render text source "root:1:2_text" to image |

## Node tree

```
root  14.5s · 100% (self 2.9s)
├─ root:3 canvas  5.6s · 38.4% (self 5.5s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.6%
├─ root:4 inspector  3.5s · 23.8% (self 2.4s)
│  └─ + 30 more leaves  1.1s · 7.5%
├─ root:5 chrome-status  1.0s · 7% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 3.4%
├─ root:0 chrome-header  0.8s · 5.2% (self 0.5s)
│  └─ + 3 more leaves  0.2s · 1.6%
├─ root:1 dsl-string  0.5s · 3.7% (self 0.4s)
│  └─ + 2 more leaves  0.2s · 1.3%
└─ root:2 dsl-narration  0.2s · 1.7% (self 0.1s)
   └─ + 1 more leaf  0.1s · 1%
```
