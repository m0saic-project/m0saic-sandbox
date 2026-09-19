# Render perf report

**12.0s** total  ·  **56** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-07-square-light-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc89` · 7-deep overlay — 3.4s, **28%** of the render. Its own composite is the cost (self 3.2s of 3.4s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 28%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root` | — | 3.4s | 28.6% | 12.0s | 1 |
| `root:3` | canvas | 3.2s | 27% | 3.4s | 1 |
| `root:4` | inspector | 2.3s | 19% | 3.3s | 1 |
| `root:5` | chrome-status | 0.5s | 4.5% | 1.0s | 1 |
| `root:0` | chrome-header | 0.5s | 4.3% | 0.8s | 1 |
| `root:0:5_text` | — | 0.1s | 1.2% | 0.1s | 1 |
| `root:0:1_text` | — | 0.1s | 1.2% | 0.1s | 1 |
| `root:3:2_text` | — | 0.1s | 0.9% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r` | — | 3.4s | 12.0s | 7-deep |
| `r/gcolc93/gcolc3/fc89` | canvas | 3.2s | 3.4s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.3s | 3.3s | 6-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc8/gcolc12` | chrome-header | 0.5s | 0.8s | 2-deep |
| `r/growc8/gcolc12/fc109/ov1c0/fc8` | — | 0.1s | 0.1s | 2-deep |
| `r/growc8/gcolc12/fc38` | — | 0.1s | 0.1s | — |
| `r/gcolc93/gcolc3/fc89/ov1c0/ov2c0` | — | 0.1s | 0.1s | 3-deep |
| `r/gcolc93/growc4/growc23/gcolc22/fc29/ov1c0/fc10` | — | 0.1s | 0.1s | 2-deep |
| `r/gcolc93/growc4/growc23/gcolc34/fc29/ov1c0/fc10` | — | 0.1s | 0.1s | 2-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 5 | 10.0s | 83.4% |
| Render text source "…" to image | 42 | 1.4s | 11.6% |
| Render text source "…" to video | 9 | 0.6s | 5% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 56 | `root` | — | 3.4s | m0saic render (mosaic node) |
| 8 | `root:3` | canvas | 3.2s | m0saic render (mosaic node) |
| 37 | `root:4` | inspector | 2.3s | m0saic render (mosaic node) |
| 55 | `root:5` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.5s | m0saic render (mosaic node) |
| 3 | `root:0:5_text` | — | 0.1s | Render text source "root:0:5_text" to video |
| 1 | `root:0:1_text` | — | 0.1s | Render text source "root:0:1_text" to image |
| 7 | `root:3:2_text` | — | 0.1s | Render text source "root:3:2_text" to image |
| 19 | `root:4:13_text` | — | 0.1s | Render text source "root:4:13_text" to video |
| 21 | `root:4:16_text` | — | 0.1s | Render text source "root:4:16_text" to video |

## Node tree

```
root  12.0s · 100% (self 3.4s)
├─ root:3 canvas  3.4s · 28% (self 3.2s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.9%
├─ root:4 inspector  3.3s · 27.5% (self 2.3s)
│  └─ + 28 more leaves  1.0s · 8.5%
├─ root:5 chrome-status  1.0s · 8.4% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 3.9%
├─ root:0 chrome-header  0.8s · 7% (self 0.5s)
│  └─ + 3 more leaves  0.3s · 2.8%
└─ + 2 more leaves  0.1s · 0.5%
```
