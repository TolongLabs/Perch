# CodeNection 2026, Lifestyle & Personal Productivity

Our entry to **CodeNection 2026**, organised by the Faculty of Computing and Informatics and co-organised by IT Society
MMU Cyberjaya. Team **TolongLabs**.

|                          |                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------- |
| **Prototype submission** | 13 September 2026, 23:59 MYT, via the organisers' Google Form                    |
| **Grand Finals**         | 15 November 2026, physical, venue to be announced                                |
| **Track**                | Track 1: Lifestyle & Personal Productivity                                       |
| **Problem statement**    | Not chosen. Stress & Workload Manager, or Travel Planner                         |
| **Status**               | Prototype phase. Concept not locked, stack not chosen, no implementation started |

---

## The Rule That Shapes This Repo

> **Ideation is 25 percent of the prototype score, and all four of its bands grade evidence produced along the way** -
> mindmaps and problem trees, documented iterations **including the directions we dropped**, mentor feedback we acted
> on, and several distinct ideas compared before choosing.

None of that can be reconstructed on 13 September from a finished idea. It is built as the work happens, on the
[`research` branch](#the-research-branch).

---

## Start Here

| File                             | What's In It                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------- |
| [`docs/brief.md`](docs/brief.md) | The whole competition: phases, rules, deliverables, judging, mentors, judges |
| [`AGENTS.md`](AGENTS.md)         | Project instructions for agentic tools, and humans                           |

Work in progress lives in the [Issues board](https://github.com/TolongLabs/codenection-dev/issues), not in a checklist
here.

### Source Material From The Organisers

Verbatim, append-only. We cite these instead of relying on memory.

| File                                                                                   | Source                                                          |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`docs/source/kickoff-day-transcript.md`](docs/source/kickoff-day-transcript.md)       | Kick-Off Day recording, 30 Aug. Whisper transcript              |
| [`docs/source/kickoff-day-slides.md`](docs/source/kickoff-day-slides.md)               | Kick-Off Day deck, 30 slides. Authoritative on dates and rubric |
| [`docs/source/problem-statements.md`](docs/source/problem-statements.md)               | The two problem statements and the general stipulations         |
| [`docs/source/prototype-judging-rubrics.md`](docs/source/prototype-judging-rubrics.md) | The prototype rubric, band by band                              |

---

## The `research` Branch

**Ideation happens on a separate long-lived branch called `research`, and it is never merged into `main`.**

It is a plain-language working notebook with its own README, its own agent setup and no build tooling, so that someone
who does not write code can open it and be productive without reading `AGENTS.md`. It holds the idea log, competitor
scans, user research, mentor notes, mindmaps and the record of every direction we dropped.

`main` **reads** from it and **cites** it. `docs/PRODUCT.md`, `docs/PRD.md` and `docs/TRD.md` are written here, on
`main`, from what `research` established.

```bash
git fetch origin research
git show research:README.md                      # read a single file
git worktree add ../codenection-research research # or check it out alongside main
```

---

## Getting Started

```bash
bun install                  # dev tooling and the husky git hooks
cp .env.example .env         # empty of keys today; nothing external is wired yet
```

| Command             | Does                               |
| ------------------- | ---------------------------------- |
| `bun run lint`      | Biome check, then Prettier check   |
| `bun run format`    | Both formatters, writing in place  |
| `bun run typecheck` | `tsc --noEmit`, once `src/` exists |
| `gh issue list`     | The TODO board                     |

Biome covers JS, TS, JSON, CSS and HTML; Prettier covers the Markdown and YAML it cannot, wrapping prose at 120 to match
`biome.json`'s `lineWidth`. There is no `.prettierignore`, so every Markdown file is formatted, `docs/source/` and the
vendored skills included. Only the contents of fenced code blocks are left alone.

---

## How Work Ships

**`main` is PR-gated.** Branch as `<type>/<slug>`, open a PR with `gh pr create`, merge with
`gh pr merge --squash --delete-branch`. A human merges; nobody merges their own PR. `research` is the exception and
commits directly, because gating a notebook defeats it.

**The gate is enforced client-side, for now.** GitHub only offers branch protection on a private repo under a paid plan,
so today the rule is held up by `.claude/hooks/guard-git.sh`, which blocks a direct or force push to `main`, and by the
deny list in `.claude/settings.json`. **That stops an agent, not a determined human.** Protection becomes free the
moment the repo goes public, which it must before submission anyway - tracked in
[issue #13](https://github.com/TolongLabs/codenection-dev/issues/13).

**Implementation is gated on three docs.** `PRODUCT.md` (who and why), `PRD.md` (what, and what is out of scope) and
`TRD.md` (how) must all exist before build work starts. `DESIGN.md` joins them when frontend work does. All three cite
`research`.

**The repo must be public at submission.** It is private today. Flipping it is a deliberate action someone takes before
13 September, and it is tracked as an issue.

---

## Layout

```
README.md                this file. The submission surface, at the repo root on purpose
docs/
  brief.md               competition facts, the single source of truth
  PRODUCT.md             who, why, the demo moment
  PRD.md                 what: requirements, acceptance criteria, out of scope
  TRD.md                 how: architecture, contracts, schemas. Canonical
  DESIGN.md              the design system, once frontend work starts
  coding-guidelines.md   behavioural coding rules, referenced by AGENTS.md
  agent-tooling.md       rtk and graphify, both optional and per-machine
  source/                organiser material, append-only
  demo/                  video script, slides, assets
.agents/skills/          36 skills, the committed source of truth
.claude/skills/          symlinks into .agents/skills/, plus impeccable as a real dir
.claude/agents/          pitch-smith
.claude/hooks/           session brief, env drift, git guard, formatter
```

`PRODUCT.md`, `PRD.md`, `TRD.md` and `DESIGN.md` are listed but **not written yet**. Source layout is not decided; add
it here when it is.

Skill provenance and what each hook does: [`.agents/skills/VENDORED.md`](.agents/skills/VENDORED.md).

**This README lives at the repo root, not in `docs/`, and that is deliberate.** Asked at Kick-Off Day what the
submission format is, the organisers answered: the Google Form takes the repo link, and _"whatever you want to write or
show, it should be in the readme of your GitHub repo - the links to your YouTube video, the links to your Figma design,
any screenshots."_ GitHub only renders the root README on the landing page, so that is where it goes. **There is exactly
one README and this is it.**
