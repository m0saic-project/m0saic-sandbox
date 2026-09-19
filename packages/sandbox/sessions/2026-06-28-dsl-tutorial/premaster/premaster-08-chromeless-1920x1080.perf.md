# Render perf report

**11.2s** total  ·  **11** ffmpeg commands

`<sandbox>/sessions/2026-06-28-dsl-tutorial/premaster/./premaster-08-chromeless-1920x1080.mp4`

## ⤷ Bottleneck

`root:3` — **canvas** · `r/gcolc93/gcolc3/fc13` · 7-deep overlay — 5.9s, **52.9%** of the render. Its own composite is the cost (self 5.8s of 5.9s subtree) — optimize the filtergraph that builds this node, not its children.

Hot path: `root` 100% → `root:3` (canvas) 52.9%

## Heaviest mosaic nodes

| node | what | self | % of render | subtree | cmds |
| --- | --- | ---: | ---: | ---: | ---: |
| `root:3` | canvas | 5.8s | 52.1% | 5.9s | 1 |
| `root` | — | 4.2s | 37.5% | 11.2s | 1 |
| `root:1` | dsl-string | 0.4s | 3.4% | 0.6s | 1 |
| `root:0_text` | — | 0.1s | 1.3% | 0.1s | 1 |
| `root:1:0_text` | — | 0.1s | 1.2% | 0.1s | 1 |
| `root:2:0_text` | — | 0.1s | 1.2% | 0.1s | 1 |
| `root:1:2_text` | — | 0.1s | 1% | 0.1s | 1 |
| `root:2` | dsl-narration | 0.1s | 0.9% | 0.2s | 1 |

## Heaviest rectangles (self)

| stableKey | what | self | subtree | overlay |
| --- | --- | ---: | ---: | ---: |
| `r/gcolc93/gcolc3/fc13` | canvas | 5.8s | 5.9s | 7-deep |
| `r` | — | 4.2s | 11.2s | 7-deep |
| `r/growc17` | dsl-string | 0.4s | 0.6s | 2-deep |
| `r/growc23/gcolc4/fc96` | dsl-narration | 0.2s | 0.2s | — |
| `r/fc8` | — | 0.1s | 0.1s | — |
| `r/growc17/fc2` | — | 0.1s | 0.1s | — |
| `r/growc17/fc22/ov1c0` | — | 0.1s | 0.1s | 2-deep |
| `r/gcolc93/gcolc3/fc13/ov1c0/ov2c0` | — | 0.1s | 0.1s | 3-deep |
| `r/gcolc93/fc4` | — | 0.0s | 0.0s | — |
| `r/fc99` | — | 0.0s | 0.0s | — |

## By work category

| work | count | total | % |
| --- | ---: | ---: | ---: |
| m0saic render (mosaic node) | 4 | 10.5s | 93.9% |
| Render text source "…" to image | 6 | 0.6s | 4.9% |
| Render text source "…" to video | 1 | 0.1s | 1.2% |

## Slowest commands

| # | node | what | time | description |
| ---: | --- | --- | ---: | --- |
| 8 | `root:3` | canvas | 5.8s | m0saic render (mosaic node) |
| 11 | `root` | — | 4.2s | m0saic render (mosaic node) |
| 4 | `root:1` | dsl-string | 0.4s | m0saic render (mosaic node) |
| 1 | `root:0_text` | — | 0.1s | Render text source "root:0_text" to image |
| 2 | `root:1:0_text` | — | 0.1s | Render text source "root:1:0_text" to image |
| 5 | `root:2:0_text` | — | 0.1s | Render text source "root:2:0_text" to video |
| 3 | `root:1:2_text` | — | 0.1s | Render text source "root:1:2_text" to image |
| 6 | `root:2` | dsl-narration | 0.1s | m0saic render (mosaic node) |
| 7 | `root:3:2_text` | — | 0.1s | Render text source "root:3:2_text" to image |
| 9 | `root:4_text` | — | 0.0s | Render text source "root:4_text" to image |

## Node tree

```
root  11.2s · 100% (self 4.2s)
├─ root:3 canvas  5.9s · 52.9% (self 5.8s)  ◄ bottleneck
│  └─ + 1 more leaf  0.1s · 0.8%
├─ root:1 dsl-string  0.6s · 5.6% (self 0.4s)
│  └─ + 2 more leaves  0.2s · 2.2%
├─ root:2 dsl-narration  0.2s · 2.1% (self 0.1s)
│  └─ + 1 more leaf  0.1s · 1.2%
└─ + 3 more leaves  0.2s · 2%
```
