# Render perf report

**13.8s** total  ·  **59** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-01-camera-zoom-b-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 5.3s, **38%** of the render. Its own composite is the cost (self 5.2s of 5.3s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 38%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 5.2s | 37.3% | 5.3s | 1 |
| `root` | — | 2.9s | 20.9% | 13.8s | 1 |
| `root:4` | inspector | 2.2s | 15.5% | 3.2s | 1 |
| `root:5` | chrome-status | 0.5s | 3.8% | 1.0s | 1 |
| `root:0` | chrome-header | 0.5s | 3.4% | 0.7s | 1 |
| `root:1` | dsl-string | 0.3s | 2.4% | 0.5s | 1 |
| `root:2:0_text` | — | 0.1s | 1% | 0.1s | 1 |
| `root:1:0_text` | — | 0.1s | 0.8% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 5.2s | 5.3s | 7-deep |
| `r` | — | 2.9s | 13.8s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.2s | 3.2s | 6-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc8/gcolc12` | chrome-header | 0.5s | 0.7s | 2-deep |
| `r/growc17` | dsl-string | 0.3s | 0.5s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.2s | 0.2s | — |
| `r/growc17/fc2` | — | 0.1s | 0.1s | — |
| `r/growc17/fc22/ov1c0` | — | 0.1s | 0.1s | 2-deep |
| `r/growc8/gcolc12/fc109/ov1c0/fc8` | — | 0.1s | 0.1s | 2-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 11.6s | 84.2% |
| Render text source "…" to image | 42 | 1.4s | 10.5% |
| Render text source "…" to video | 10 | 0.7s | 5.4% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 11 | `root:3` | canvas | 5.2s | m0saic render (mosaic node) |
| 59 | `root` | — | 2.9s | m0saic render (mosaic node) |
| 40 | `root:4` | inspector | 2.2s | m0saic render (mosaic node) |
| 58 | `root:5` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.5s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.3s | m0saic render (mosaic node) |
| 8 | `root:2:0_text` | — | 0.1s | Render text source "root:2:0_text" to video |
| 5 | `root:1:0_text` | — | 0.1s | Render text source "root:1:0_text" to image |
| 6 | `root:1:2_text` | — | 0.1s | Render text source "root:1:2_text" to image |
| 3 | `root:0:5_text` | — | 0.1s | Render text source "root:0:5_text" to video |

## Node tree

```
root  13.8s · 100% (self 2.9s)
├─ root:3 canvas  5.3s · 38% (self 5.2s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.7%
├─ root:4 inspector  3.2s · 23.2% (self 2.2s)
│  └─ + 28 more leaves  1.1s · 7.7%
├─ root:5 chrome-status  1.0s · 7.2% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 3.4%
├─ root:0 chrome-header  0.7s · 4.9% (self 0.5s)
│  └─ + 3 more leaves  0.2s · 1.5%
├─ root:1 dsl-string  0.5s · 4% (self 0.3s)
│  └─ + 2 more leaves  0.2s · 1.6%
└─ root:2 dsl-narration  0.2s · 1.7% (self 0.1s)
   └─ + 1 more leaf  0.1s · 1%
```
