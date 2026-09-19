# m0saic sandbox

The m0saic iteration-session corpus: `.m0` / `.m0c` / `.mosaic` / `.mosaicx` candidates that build up when a human and an agent iterate on layouts, session by session. A pattern bank you can browse like an endgame book.

This repository is the public mirror of `packages/sandbox` in the m0saic monorepo — **a developer's personal workshop**: a chronological corpus of layout files generated while iterating on geometry with an agent. It is documentation as data. Each session is a self-contained record of how one geometry conversation went: what was asked, what was proposed, what the human accepted or rejected, and why.

---

## Mental model

Two analogies, layered:

**Chess endgame book** — for the corpus as a whole.

- A `.m0` / `.m0c` file is **one position**: a geometry + a question + a response.
- A **session directory** is a **game**: a chronological set of positions building up to a final geometry. Each candidate is one move in the discussion.
- The **whole corpus** is a **book**: many games, browseable in any order, accumulating into a graded pattern library over time.

**Discussion thread** — for what is inside each file.

- The **prompt** is the writing party's `note` / `question` / `regions` / `context`.
- The **selected answer** is `response` — the canonical human verdict for the file's exact state. One per file.
- The **comments** (`comments[]`) are an append-only side thread: non-canonical, but preserved as provenance for future readers.

The reason this matters is corpus scale: the more layout conversations are preserved, the more material future agents have to learn from. "What worked? What didn't? Why?" — answered empirically by every saved session.

---

## How the corpus is organised

```
packages/sandbox/
├── README.md                  # the long-form conventions
├── agent.md                   # the agent protocol (short version of the rules)
├── agent-extended.md
├── sessions/                  # geometry iteration sessions
│   └── <YYYY-MM-DD>-<slug>/   # date-prefixed so they sort chronologically
│       ├── candidate-001.m0   # zero-padded so ls(1) sorts naturally
│       ├── candidate-002.m0
│       ├── candidate-003.m0c  # promoted to .m0c when labels / masks join
│       └── …
└── production/                # template iteration: one folder per template
    └── <publisher>/<template-slug>-vN/
        ├── candidate-001.mosaicx  # the recipe (template id + props)
        ├── candidate-001.mosaic   # its frozen twin (the resolved document)
        └── …
```

- **One file, one prompt.** Each candidate is an atomic position — one geometry, one question, one response. When the geometry changes, that is a new file; the directory is the conversation.
- **Rejected candidates are never mutated.** A follow-up is a new candidate number (linear refinement) or an `-a` / `-b` / `-c` suffix on the candidate being iterated (parallel variants).
- **Template candidates come in pairs.** Every `.mosaicx` (the recipe) has a frozen `.mosaic` twin (the exact document that was reviewed), so a verdict can always be replayed against the bytes it was given for.

The full protocol — naming, the comments thread, when to start a new session, anti-patterns — is [`packages/sandbox/agent.md`](./packages/sandbox/agent.md). Read it before adding to or continuing a session.

---

## De-identification

The corpus records file paths from the machine it was authored on (render-output pointers, temp caches, user-data folders). Before every mirror those are rewritten to portable placeholders, and the mirror refuses to ship if any remain:

| Placeholder | Stands for |
|---|---|
| `<sandbox>/` | the sandbox package directory |
| `<repo>/` | the m0saic monorepo root |
| `~/` | the author's home directory |
| `$TMPDIR/` | the OS temp directory |

Placeholders are angle-bracketed on purpose: they cannot be mistaken for real paths, and nothing resolves them at runtime — the files are a corpus, not something a tool executes.

---

## Reading the files

- `.m0` — one m0 layout string plus its sidecar prose, line-based.
- `.m0c` — the same with context: labels, masks, regions, the question / response / comments as JSON.
- `.mosaic` / `.mosaicx` — m0saic documents: a resolved composition, and the template recipe it came from.

The formats are documented and parseable with [`@m0saic/dsl-file-formats`](https://github.com/m0saic-dsl/m0/tree/main/packages/dsl-file-formats) (`npm i @m0saic/dsl-file-formats`) and rendered by the `m0saic` CLI (`npm i -g m0saic`).

---

## Related

- The m0 layout DSL: https://github.com/m0saic-dsl/m0
- The public m0saic packages: https://github.com/m0saic-project/m0saic-packages
- Website: https://m0saic.io · Editor: https://app.m0saic.io/layout

---

## Licensing

Licensed under the **Apache License, Version 2.0** — see [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE).

m0saic and the m0saic logo are trademarks of m0saic LLC. The license does not grant permission to use the trade names, trademarks, service marks, or product names of m0saic LLC, except as required for reasonable and customary use in describing the origin of the work.

Maintained by **m0saic LLC**.
