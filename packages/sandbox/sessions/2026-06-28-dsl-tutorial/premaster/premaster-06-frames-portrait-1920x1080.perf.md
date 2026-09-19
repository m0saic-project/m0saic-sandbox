# Render perf report

**11.0s** total  ·  **59** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-06-frames-portrait-1920x1080.mp4`

## ⤷ Bottleneck

`root:4` — **inspector** · `r/gcolc93/growc4/growc23` · 6-deep overlay — 3.5s, **32.4%** of the render. Its own composite is the cost (self 2.5s of 3.5s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:4` (inspector) 32.4%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root` | — | 2.7s | 24.9% | 11.0s | 1 |
| `root:4` | inspector | 2.5s | 22.6% | 3.5s | 1 |
| `root:3` | canvas | 1.9s | 17.4% | 2.0s | 1 |
| `root:5` | chrome-status | 0.6s | 5.5% | 1.1s | 1 |
| `root:0` | chrome-header | 0.6s | 5.1% | 0.8s | 1 |
| `root:1` | dsl-string | 0.4s | 3.3% | 0.6s | 1 |
| `root:2:0_text` | — | 0.1s | 1.2% | 0.1s | 1 |
| `root:2` | dsl-narration | 0.1s | 1.1% | 0.3s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r` | — | 2.7s | 11.0s | 7-deep |
| `r/gcolc93/growc4/growc23` | inspector | 2.5s | 3.5s | 6-deep |
| `r/gcolc93/gcolc3/fc6` | canvas | 1.9s | 2.0s | 7-deep |
| `r/growc99/gcolc12` | chrome-status | 0.6s | 1.1s | — |
| `r/growc8/gcolc12` | chrome-header | 0.6s | 0.8s | 2-deep |
| `r/growc17` | dsl-string | 0.4s | 0.6s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.3s | 0.3s | — |
| `r/growc17/fc22/ov1c0` | — | 0.1s | 0.1s | 2-deep |
| `r/growc8/gcolc12/fc38` | — | 0.1s | 0.1s | — |
| `r/growc17/fc2` | — | 0.1s | 0.1s | — |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 7 | 8.8s | 79.8% |
| Render text source "…" to image | 42 | 1.5s | 14% |
| Render text source "…" to video | 10 | 0.7s | 6.2% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 59 | `root` | — | 2.7s | m0saic render (mosaic node) |
| 40 | `root:4` | inspector | 2.5s | m0saic render (mosaic node) |
| 11 | `root:3` | canvas | 1.9s | m0saic render (mosaic node) |
| 58 | `root:5` | chrome-status | 0.6s | m0saic render (mosaic node) |
| 4 | `root:0` | chrome-header | 0.6s | m0saic render (mosaic node) |
| 7 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 8 | `root:2:0_text` | — | 0.1s | Render text source "root:2:0_text" to video |
| 9 | `root:2` | dsl-narration | 0.1s | m0saic render (mosaic node) |
| 6 | `root:1:2_text` | — | 0.1s | Render text source "root:1:2_text" to image |
| 1 | `root:0:1_text` | — | 0.1s | Render text source "root:0:1_text" to image |

## Node tree

```
root  11.0s · 100% (self 2.7s)
├─ root:4 inspector  3.5s · 32.4% (self 2.5s)  ◄ bottleneck
│  └─ + 28 more leaves  1.1s · 9.8%
├─ root:3 canvas  2.0s · 18.1% (self 1.9s)
│  └─ + 1 more leaf  0.1s · 0.7%
├─ root:5 chrome-status  1.1s · 10.2% (self 0.6s)
│  └─ + 17 more leaves  0.5s · 4.7%
├─ root:0 chrome-header  0.8s · 7% (self 0.6s)
│  └─ + 3 more leaves  0.2s · 1.9%
├─ root:1 dsl-string  0.6s · 5.1% (self 0.4s)
│  └─ + 2 more leaves  0.2s · 1.8%
└─ root:2 dsl-narration  0.3s · 2.3% (self 0.1s)
   └─ + 1 more leaf  0.1s · 1.2%
```
