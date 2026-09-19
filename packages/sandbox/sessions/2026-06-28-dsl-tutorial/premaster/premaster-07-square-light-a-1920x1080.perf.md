# Render perf report

**11.1s** total  ·  **54** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-07-square-light-a-1920x1080.mp4`

## ⤷ Bottleneck

`root:1` — **canvas** · `r/gcolc93/gcolc3/fc94` · 7-deep overlay — 4.1s, **36.9%** of the render. Its own composite is the cost (self 4.0s of 4.1s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:1` (canvas) 36.9%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:1` | canvas | 4.0s | 35.9% | 4.1s | 1 |
| `root:2` | inspector | 2.3s | 20.6% | 3.3s | 1 |
| `root` | — | 2.0s | 18.1% | 11.1s | 1 |
| `root:3` | chrome-status | 0.5s | 4.7% | 1.0s | 1 |
| `root:0` | chrome-header | 0.4s | 4% | 0.6s | 1 |
| `root:1:2_text` | — | 0.1s | 1.1% | 0.1s | 1 |
| `root:0:1_text` | — | 0.1s | 0.7% | 0.1s | 1 |
| `root:0:5_text` | — | 0.1s | 0.7% | 0.1s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc94` | canvas | 4.0s | 4.1s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.3s | 3.3s | 6-deep |
| `r` | — | 2.0s | 11.1s | 7-deep |
| `r/growc99/gcolc12` | chrome-status | 0.5s | 1.0s | — |
| `r/growc8/gcolc12` | chrome-header | 0.4s | 0.6s | 2-deep |
| `r/gcolc93/gcolc3/fc94/ov1c0/ov2c0` | — | 0.1s | 0.1s | 3-deep |
| `r/growc8/gcolc12/fc38` | — | 0.1s | 0.1s | — |
| `r/growc8/gcolc12/fc109/ov1c0/fc8` | — | 0.1s | 0.1s | 2-deep |
| `r/gcolc93/growc4/growc23/gcolc22/fc29/ov1c0/fc10` | — | 0.1s | 0.1s | 2-deep |
| `r/gcolc93/growc4/growc23/gcolc34/fc29/ov1c0/fc10` | — | 0.1s | 0.1s | 2-deep |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 5 | 9.3s | 83.3% |
| Render text source "…" to image | 40 | 1.3s | 11.6% |
| Render text source "…" to video | 9 | 0.6s | 5.1% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 6 | `root:1` | canvas | 4.0s | m0saic render (mosaic node) |
| 35 | `root:2` | inspector | 2.3s | m0saic render (mosaic node) |
| 54 | `root` | — | 2.0s | m0saic render (mosaic node) |
| 53 | `root:3` | chrome-status | 0.5s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.4s | m0saic render (mosaic node) |
| 5 | `root:1:2_text` | — | 0.1s | Render text source "root:1:2_text" to image |
| 1 | `root:0:1_text` | — | 0.1s | Render text source "root:0:1_text" to image |
| 3 | `root:0:5_text` | — | 0.1s | Render text source "root:0:5_text" to video |
| 17 | `root:2:13_text` | — | 0.1s | Render text source "root:2:13_text" to video |
| 19 | `root:2:16_text` | — | 0.1s | Render text source "root:2:16_text" to video |

## Node tree

```
root  11.1s · 100% (self 2.0s)
├─ root:1 canvas  4.1s · 36.9% (self 4.0s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 1.1%
├─ root:2 inspector  3.3s · 30.1% (self 2.3s)
│  └─ + 28 more leaves  1.1s · 9.5%
├─ root:3 chrome-status  1.0s · 9% (self 0.5s)
│  └─ + 17 more leaves  0.5s · 4.3%
└─ root:0 chrome-header  0.6s · 5.8% (self 0.4s)
   └─ + 3 more leaves  0.2s · 1.7%
```
