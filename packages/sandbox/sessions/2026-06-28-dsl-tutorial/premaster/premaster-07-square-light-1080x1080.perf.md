# Render perf report

**10.4s** total  ·  **56** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-07-square-light-1080x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 3.4s, **32.9%** of the render. Its own composite is the cost (self 3.3s of 3.4s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 32.9%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 3.3s | 31.8% | 3.4s | 1 |
| `root` | — | 2.4s | 23.3% | 10.4s | 1 |
| `root:4` | inspector | 1.9s | 17.9% | 2.9s | 1 |
| `root:5` | chrome-status | 0.5s | 4.6% | 1.0s | 1 |
| `root:0` | chrome-header | 0.4s | 3.9% | 0.7s | 1 |
| `root:0:1_text` | — | 0.2s | 1.5% | 0.2s | 1 |
| `root:3:2_text` | — | 0.1s | 1.1% | 0.1s | 1 |
| `root:0:5_text` | — | 0.1s | 0.6% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 3.3s | 3.4s | 7-deep |
| `r` | — | 2.4s | 10.4s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 1.9s | 2.9s | 6-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc8/gcolc12` | chrome-header | 0.4s | 0.7s | 2-deep |
| `r/growc8/gcolc12/fc38` | — | 0.2s | 0.2s | — |
| `r/gcolc93/gcolc3/fc13/ov1c0/ov2c0` | — | 0.1s | 0.1s | 3-deep |
| `r/growc8/gcolc12/fc109/ov1c0/fc8` | — | 0.1s | 0.1s | 2-deep |
| `r/gcolc93/growc4/growc23/gcolc22/fc29/ov1c0/fc10` | — | 0.1s | 0.1s | 2-deep |
| `r/gcolc93/growc4/growc23/gcolc34/fc29/ov1c0/fc10` | — | 0.1s | 0.1s | 2-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 5 | 8.4s | 81.3% |
| Render text source "…" to image | 42 | 1.4s | 13.7% |
| Render text source "…" to video | 9 | 0.5s | 4.9% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 8 | `root:3` | canvas | 3.3s | m0saic render (mosaic node) |
| 56 | `root` | — | 2.4s | m0saic render (mosaic node) |
| 37 | `root:4` | inspector | 1.9s | m0saic render (mosaic node) |
| 55 | `root:5` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.4s | m0saic render (mosaic node) |
| 1 | `root:0:1_text` | — | 0.2s | Render text source "root:0:1_text" to image |
| 7 | `root:3:2_text` | — | 0.1s | Render text source "root:3:2_text" to image |
| 3 | `root:0:5_text` | — | 0.1s | Render text source "root:0:5_text" to video |
| 19 | `root:4:13_text` | — | 0.1s | Render text source "root:4:13_text" to video |
| 21 | `root:4:16_text` | — | 0.1s | Render text source "root:4:16_text" to video |

## Node tree

```
root  10.4s · 100% (self 2.4s)
├─ root:3 canvas  3.4s · 32.9% (self 3.3s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 1.1%
├─ root:4 inspector  2.9s · 27.6% (self 1.9s)
│  └─ + 28 more leaves  1.0s · 9.7%
├─ root:5 chrome-status  1.0s · 9.3% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 4.7%
├─ root:0 chrome-header  0.7s · 6.3% (self 0.4s)
│  └─ + 3 more leaves  0.3s · 2.4%
└─ + 2 more leaves  0.1s · 0.6%
```
