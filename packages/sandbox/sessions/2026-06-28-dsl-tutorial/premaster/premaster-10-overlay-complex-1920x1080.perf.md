# Render perf report

**23.8s** total  ·  **68** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-10-overlay-complex-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/growc13` · 5-deep overlay — 8.9s, **37.4%** of the render. Its own composite is the cost (self 8.6s of 8.9s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 37.4%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 8.6s | 35.9% | 8.9s | 1 |
| `root` | — | 5.8s | 24.3% | 23.8s | 1 |
| `root:4` | inspector | 2.9s | 12.4% | 4.5s | 1 |
| `root:5` | chrome-status | 1.5s | 6.1% | 2.5s | 1 |
| `root:0` | chrome-header | 0.7s | 2.9% | 1.0s | 1 |
| `root:1` | dsl-string | 0.4s | 1.9% | 0.8s | 1 |
| `root:2:0_text` | — | 0.2s | 0.9% | 0.2s | 1 |
| `root:0:1_text` | — | 0.2s | 0.8% | 0.2s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/growc13` | canvas | 8.6s | 8.9s | 5-deep |
| `r` | — | 5.8s | 23.8s | 8-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.9s | 4.5s | 8-deep |
| `r/growc99/gcolc12` | chrome-status | 1.5s | 2.5s | — |
| `r/growc8/gcolc12` | chrome-header | 0.7s | 1.0s | 2-deep |
| `r/growc17` | dsl-string | 0.4s | 0.8s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.3s | 0.3s | — |
| `r/growc8/gcolc12/fc38` | — | 0.2s | 0.2s | — |
| `r/growc17/fc2` | — | 0.2s | 0.2s | — |
| `r/growc17/fc22/ov1c0` | — | 0.2s | 0.2s | 2-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 20.0s | 84.1% |
| Render text source "…" to image | 51 | 2.9s | 12% |
| Render text source "…" to video | 10 | 0.9s | 3.9% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 17 | `root:3` | canvas | 8.6s | m0saic render (mosaic node) |
| 68 | `root` | — | 5.8s | m0saic render (mosaic node) |
| 49 | `root:4` | inspector | 2.9s | m0saic render (mosaic node) |
| 67 | `root:5` | chrome-status | 1.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.7s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 8 | `root:2:0_text` | — | 0.2s | Render text source "root:2:0_text" to video |
| 1 | `root:0:1_text` | — | 0.2s | Render text source "root:0:1_text" to image |
| 5 | `root:1:0_text` | — | 0.2s | Render text source "root:1:0_text" to image |
| 6 | `root:1:2_text` | — | 0.2s | Render text source "root:1:2_text" to image |

## Node tree

```
root  23.8s · 100% (self 5.8s)
├─ root:3 canvas  8.9s · 37.4% (self 8.6s)  ◄ bottleneck
│  └─ + 7 more leaves  0.3s · 1.4%
├─ root:4 inspector  4.5s · 18.7% (self 2.9s)
│  └─ + 31 more leaves  1.5s · 6.4%
├─ root:5 chrome-status  2.5s · 10.5% (self 1.5s)
│  └─ + 17 more leaves  1.0s · 4.4%
├─ root:0 chrome-header  1.0s · 4.2% (self 0.7s)
│  └─ + 3 more leaves  0.3s · 1.3%
├─ root:1 dsl-string  0.8s · 3.5% (self 0.4s)
│  └─ + 2 more leaves  0.4s · 1.6%
└─ root:2 dsl-narration  0.3s · 1.4% (self 0.1s)
   └─ + 1 more leaf  0.2s · 0.9%
```
