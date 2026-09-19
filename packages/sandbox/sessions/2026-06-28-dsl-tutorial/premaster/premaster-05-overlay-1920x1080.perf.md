# Render perf report

**15.1s** total  ·  **59** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-05-overlay-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 5.9s, **39.2%** of the render. Its own composite is the cost (self 5.8s of 5.9s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 39.2%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 5.8s | 38.6% | 5.9s | 1 |
| `root` | — | 3.1s | 20.3% | 15.1s | 1 |
| `root:4` | inspector | 2.3s | 15.6% | 3.4s | 1 |
| `root:0` | chrome-header | 0.6s | 4% | 0.9s | 1 |
| `root:5` | chrome-status | 0.5s | 3.4% | 1.0s | 1 |
| `root:1` | dsl-string | 0.4s | 2.4% | 0.6s | 1 |
| `root:1:0_text` | — | 0.1s | 0.8% | 0.1s | 1 |
| `root:2:0_text` | — | 0.1s | 0.8% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 5.8s | 5.9s | 7-deep |
| `r` | — | 3.1s | 15.1s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.3s | 3.4s | 7-deep |
| `r/growc8/gcolc12` | chrome-header | 0.6s | 0.9s | 2-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc17` | dsl-string | 0.4s | 0.6s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.2s | 0.2s | — |
| `r/growc17/fc2` | — | 0.1s | 0.1s | — |
| `r/growc8/gcolc12/fc38` | — | 0.1s | 0.1s | — |
| `r/growc17/fc22/ov1c0` | — | 0.1s | 0.1s | 2-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 12.8s | 85% |
| Render text source "…" to image | 42 | 1.6s | 10.6% |
| Render text source "…" to video | 10 | 0.7s | 4.5% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 11 | `root:3` | canvas | 5.8s | m0saic render (mosaic node) |
| 59 | `root` | — | 3.1s | m0saic render (mosaic node) |
| 40 | `root:4` | inspector | 2.3s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.6s | m0saic render (mosaic node) |
| 58 | `root:5` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 5 | `root:1:0_text` | — | 0.1s | Render text source "root:1:0_text" to image |
| 8 | `root:2:0_text` | — | 0.1s | Render text source "root:2:0_text" to video |
| 9 | `root:2` | dsl-narration | 0.1s | m0saic render (mosaic node) |
| 1 | `root:0:1_text` | — | 0.1s | Render text source "root:0:1_text" to image |

## Node tree

```
root  15.1s · 100% (self 3.1s)
├─ root:3 canvas  5.9s · 39.2% (self 5.8s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.6%
├─ root:4 inspector  3.4s · 22.9% (self 2.3s)
│  └─ + 28 more leaves  1.1s · 7.3%
├─ root:5 chrome-status  1.0s · 6.6% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 3.2%
├─ root:0 chrome-header  0.9s · 5.7% (self 0.6s)
│  └─ + 3 more leaves  0.3s · 1.8%
├─ root:1 dsl-string  0.6s · 3.9% (self 0.4s)
│  └─ + 2 more leaves  0.2s · 1.5%
└─ root:2 dsl-narration  0.2s · 1.5% (self 0.1s)
   └─ + 1 more leaf  0.1s · 0.8%
```
