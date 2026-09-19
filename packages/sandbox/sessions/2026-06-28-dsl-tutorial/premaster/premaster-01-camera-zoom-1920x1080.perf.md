# Render perf report

**15.8s** total  ·  **59** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-01-camera-zoom-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 6.1s, **38.3%** of the render. Its own composite is the cost (self 5.9s of 6.1s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 38.3%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 5.9s | 37.5% | 6.1s | 1 |
| `root` | — | 3.7s | 23.4% | 15.8s | 1 |
| `root:4` | inspector | 2.4s | 14.9% | 3.4s | 1 |
| `root:5` | chrome-status | 0.5s | 3.4% | 1.0s | 1 |
| `root:0` | chrome-header | 0.5s | 3.3% | 0.8s | 1 |
| `root:1` | dsl-string | 0.4s | 2.2% | 0.6s | 1 |
| `root:0:1_text` | — | 0.2s | 1.2% | 0.2s | 1 |
| `root:2:0_text` | — | 0.1s | 0.9% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 5.9s | 6.1s | 7-deep |
| `r` | — | 3.7s | 15.8s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.4s | 3.4s | 6-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc8/gcolc12` | chrome-header | 0.5s | 0.8s | 2-deep |
| `r/growc17` | dsl-string | 0.4s | 0.6s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.2s | 0.2s | — |
| `r/growc8/gcolc12/fc38` | — | 0.2s | 0.2s | — |
| `r/gcolc93/gcolc3/fc13/ov1c0/ov2c0` | — | 0.1s | 0.1s | 3-deep |
| `r/growc17/fc22/ov1c0` | — | 0.1s | 0.1s | 2-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 13.5s | 85.5% |
| Render text source "…" to image | 42 | 1.6s | 10.2% |
| Render text source "…" to video | 10 | 0.7s | 4.4% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 11 | `root:3` | canvas | 5.9s | m0saic render (mosaic node) |
| 59 | `root` | — | 3.7s | m0saic render (mosaic node) |
| 40 | `root:4` | inspector | 2.4s | m0saic render (mosaic node) |
| 58 | `root:5` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.5s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 1 | `root:0:1_text` | — | 0.2s | Render text source "root:0:1_text" to image |
| 8 | `root:2:0_text` | — | 0.1s | Render text source "root:2:0_text" to video |
| 10 | `root:3:2_text` | — | 0.1s | Render text source "root:3:2_text" to image |
| 6 | `root:1:2_text` | — | 0.1s | Render text source "root:1:2_text" to image |

## Node tree

```
root  15.8s · 100% (self 3.7s)
├─ root:3 canvas  6.1s · 38.3% (self 5.9s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.7%
├─ root:4 inspector  3.4s · 21.5% (self 2.4s)
│  └─ + 28 more leaves  1.0s · 6.6%
├─ root:5 chrome-status  1.0s · 6.4% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 2.9%
├─ root:0 chrome-header  0.8s · 5.3% (self 0.5s)
│  └─ + 3 more leaves  0.3s · 1.9%
├─ root:1 dsl-string  0.6s · 3.7% (self 0.4s)
│  └─ + 2 more leaves  0.2s · 1.4%
└─ root:2 dsl-narration  0.2s · 1.5% (self 0.1s)
   └─ + 1 more leaf  0.1s · 0.9%
```
