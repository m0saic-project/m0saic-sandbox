# Render perf report

**109.2s** total  ·  **61** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-02-paging-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 40.7s, **37.3%** of the render. Its own composite is the cost (self 40.0s of 40.7s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 37.3%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 40.0s | 36.7% | 40.7s | 1 |
| `root` | — | 34.9s | 31.9% | 109.2s | 1 |
| `root:4` | inspector | 16.6s | 15.2% | 19.2s | 1 |
| `root:5` | chrome-status | 4.1s | 3.7% | 4.6s | 1 |
| `root:1` | dsl-string | 3.3s | 3% | 4.7s | 1 |
| `root:0` | chrome-header | 3.2s | 2.9% | 3.6s | 1 |
| `root:2:0_text` | — | 0.9s | 0.8% | 0.9s | 1 |
| `root:3:2_text` | — | 0.7s | 0.6% | 0.7s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 40.0s | 40.7s | 7-deep |
| `r` | — | 34.9s | 109.2s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 16.6s | 19.2s | 6-deep |
| `r/growc99/gcolc12` | chrome-status | 4.1s | 4.6s | — |
| `r/growc17` | dsl-string | 3.3s | 4.7s | 3-deep |
| `r/growc8/gcolc12` | chrome-header | 3.2s | 3.6s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 1.5s | 1.5s | — |
| `r/gcolc93/gcolc3/fc13/ov1c0/ov2c0` | — | 0.7s | 0.7s | 3-deep |
| `r/gcolc93/growc4/growc23/gcolc22/fc29/ov1c0/fc10` | — | 0.5s | 0.5s | 2-deep |
| `r/growc17/fc3` | — | 0.4s | 0.4s | — |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 102.6s | 94% |
| Render text source "…" to image | 44 | 3.4s | 3.1% |
| Render text source "…" to video | 10 | 3.2s | 3% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 13 | `root:3` | canvas | 40.0s | m0saic render (mosaic node) |
| 61 | `root` | — | 34.9s | m0saic render (mosaic node) |
| 42 | `root:4` | inspector | 16.6s | m0saic render (mosaic node) |
| 60 | `root:5` | chrome-status | 4.1s | m0saic render (mosaic node) |
| 9 | `root:1` | dsl-string | 3.3s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 3.2s | m0saic render (mosaic node) |
| 10 | `root:2:0_text` | — | 0.9s | Render text source "root:2:0_text" to video |
| 12 | `root:3:2_text` | — | 0.7s | Render text source "root:3:2_text" to image |
| 11 | `root:2` | dsl-narration | 0.6s | m0saic render (mosaic node) |
| 24 | `root:4:13_text` | — | 0.5s | Render text source "root:4:13_text" to video |

## Node tree

```
root  109.2s · 100% (self 34.9s)
├─ root:3 canvas  40.7s · 37.3% (self 40.0s)  ◄ bottleneck
│  └─ + 1 more leaf  0.7s · 0.6%
├─ root:4 inspector  19.2s · 17.6% (self 16.6s)
│  └─ + 28 more leaves  2.6s · 2.4%
├─ root:1 dsl-string  4.7s · 4.3% (self 3.3s)
│  └─ + 4 more leaves  1.4s · 1.3%
├─ root:5 chrome-status  4.6s · 4.2% (self 4.1s)
│  └─ + 17 more leaves  0.5s · 0.5%
├─ root:0 chrome-header  3.6s · 3.3% (self 3.2s)
│  └─ + 3 more leaves  0.5s · 0.4%
└─ root:2 dsl-narration  1.5s · 1.4% (self 0.6s)
   └─ + 1 more leaf  0.9s · 0.8%
```
