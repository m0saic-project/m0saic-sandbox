# Render perf report

**14.8s** total  ·  **59** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-03-passthrough-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 6.0s, **40.7%** of the render. Its own composite is the cost (self 6.0s of 6.0s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 40.7%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 6.0s | 40.2% | 6.0s | 1 |
| `root` | — | 2.9s | 19.6% | 14.8s | 1 |
| `root:4` | inspector | 2.3s | 15.8% | 3.4s | 1 |
| `root:5` | chrome-status | 0.5s | 3.5% | 1.0s | 1 |
| `root:0` | chrome-header | 0.5s | 3.2% | 0.7s | 1 |
| `root:1` | dsl-string | 0.4s | 2.5% | 0.6s | 1 |
| `root:2:0_text` | — | 0.1s | 0.8% | 0.1s | 1 |
| `root:0:5_text` | — | 0.1s | 0.7% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 6.0s | 6.0s | 7-deep |
| `r` | — | 2.9s | 14.8s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.3s | 3.4s | 7-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc8/gcolc12` | chrome-header | 0.5s | 0.7s | 2-deep |
| `r/growc17` | dsl-string | 0.4s | 0.6s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.2s | 0.2s | — |
| `r/growc8/gcolc12/fc109/ov1c0/fc8` | — | 0.1s | 0.1s | 2-deep |
| `r/growc8/gcolc12/fc38` | — | 0.1s | 0.1s | — |
| `r/growc17/fc22/ov1c0` | — | 0.1s | 0.1s | 2-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 12.6s | 85.5% |
| Render text source "…" to image | 42 | 1.5s | 9.9% |
| Render text source "…" to video | 10 | 0.7s | 4.7% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 11 | `root:3` | canvas | 6.0s | m0saic render (mosaic node) |
| 59 | `root` | — | 2.9s | m0saic render (mosaic node) |
| 40 | `root:4` | inspector | 2.3s | m0saic render (mosaic node) |
| 58 | `root:5` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.5s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 8 | `root:2:0_text` | — | 0.1s | Render text source "root:2:0_text" to video |
| 3 | `root:0:5_text` | — | 0.1s | Render text source "root:0:5_text" to video |
| 1 | `root:0:1_text` | — | 0.1s | Render text source "root:0:1_text" to image |
| 9 | `root:2` | dsl-narration | 0.1s | m0saic render (mosaic node) |

## Node tree

```
root  14.8s · 100% (self 2.9s)
├─ root:3 canvas  6.0s · 40.7% (self 6.0s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.5%
├─ root:4 inspector  3.4s · 22.8% (self 2.3s)
│  └─ + 28 more leaves  1.0s · 7.1%
├─ root:5 chrome-status  1.0s · 6.7% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 3.2%
├─ root:0 chrome-header  0.7s · 4.9% (self 0.5s)
│  └─ + 3 more leaves  0.2s · 1.7%
├─ root:1 dsl-string  0.6s · 3.8% (self 0.4s)
│  └─ + 2 more leaves  0.2s · 1.3%
└─ root:2 dsl-narration  0.2s · 1.5% (self 0.1s)
   └─ + 1 more leaf  0.1s · 0.8%
```
