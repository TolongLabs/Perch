# AGENTS.md

Canonical, tool-agnostic project instructions. Every agentic tool works from this file; `CLAUDE.md` only points here.
**Read [`docs/brief.md`](docs/brief.md) before acting** - phase dates, rules and the judging rubric.

---

## Project

**CodeNection 2026**, track **Lifestyle & Personal Productivity**. Team **TolongLabs**, four members. Repo:
`github.com/TolongLabs/Perch`.

**Prototype submission: 13 September 2026, 23:59 MYT**, via the organisers' Google Form, submitted by the team leader
only. Late submissions are rejected with no appeal. Every other event fact lives in [`docs/brief.md`](docs/brief.md),
which is the single source of truth for them; organiser source material is in `docs/source/`.

The competition runs in phases, not as one sprint. **Only the prototype phase is live right now**, and it is judged on a
different rubric from the ones that follow. Building the product is not the current job. See
[The Phase You Are In](#the-phase-you-are-in).

---

## The Branching Model

| Branch                | Holds                                                                                                             | Who Works There    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------ |
| `main`                | The product, the docs, the tooling, and the ideation notebook in `docs/research/`. Everything that gets submitted | Everyone. PR-gated |
| `<type>/<short-slug>` | One change at a time, opened as a PR and merged back into `main`                                                  | Anyone making one  |

**The research branch was retired on 8 September 2026.** The ideation notebook it used to hold now lives in
`docs/research/` on `main` and is committed directly, through the same PR gate as everything else. It is still a working
notebook with its own README and no build tooling, so that a teammate who does not write code can open it and be
productive without learning this file.

**Its output is an input to everything on `main`.** `docs/PRODUCT.md`, `docs/PRD.md` and `docs/TRD.md` are written on
`main` **citing** what the notebook established. Read it in place at `docs/research/`; there is nothing to merge, fetch
or check out.

**The ideation notebook in `docs/research/` is itself a graded deliverable.** See
[The Ideation Trail](#the-ideation-trail).

---

## The Phase You Are In

Five phases, each with its own deliverable and its own rubric. **Doing the next phase's work early is not being ahead,
it is being off-brief**, because the prototype rubric awards nothing for a working build and 25 points for how the idea
was arrived at.

| Phase                 | Dates            | The Job                                                                           |
| --------------------- | ---------------- | --------------------------------------------------------------------------------- |
| **Prototype**         | 31 Aug - 13 Sept | Decide what to build and prove how you decided. Mockups, not code                 |
| **Prototype judging** | 14 - 20 Sept     | Nothing. Wait                                                                     |
| **Building**          | 21 Sept - 11 Oct | Build it                                                                          |
| **Deployment**        | 12 - 31 Oct      | Ship it live. **Bug fixes only, major features are grounds for disqualification** |
| **Grand Finals**      | 15 Nov           | Pitch it. 10 minutes plus 5 minutes of Q&A, every member physically present       |

**Ten teams advance out of the prototype phase.** Teams that do not may opt into Track 2, Industry, and stay in the
competition.

---

## The Ideation Trail

**Ideation is 25 percent, the largest single category, and every one of its four bands scores an artifact you either
made along the way or did not.** None of it can be reconstructed on 13 September from a finished idea.

| Band                                             | Worth | What The Judges Look At                                                     |
| ------------------------------------------------ | ----- | --------------------------------------------------------------------------- |
| **Visual Diagrams And Mindmaps**                 | 8%    | A mindmap plus a problem tree or user flow. Multi-layered beats tidy        |
| **Iteration And Idea Evolution**                 | 7%    | Multiple documented turns, **including the directions you dropped and why** |
| **Mentor Consultation And Feedback Integration** | 7%    | Specific feedback, quoted, and the change it caused                         |
| **Breadth Of Exploration**                       | 3%    | Several distinct ideas compared, with the rationale for the pick            |

Three consequences that change how you work:

- **Dead ends are worth points.** When an idea is abandoned, write down what it was and what killed it. Deleting it
  costs marks
- **Mentor slots are a scored resource, not a favour.** Booking is first come first served, up to two per day, 25
  minutes each, across 31 Aug - 13 Sept. A session with no written record of what was said scores as no session
- **Impact is a further 20 percent and also rewards understanding over output.** Stakeholders, causes, real-world
  implications, and a target group narrower than "students"

Full band-by-band wording: [`docs/source/prototype-judging-rubrics.md`](docs/source/prototype-judging-rubrics.md).

---

## Competition Rules That Bind Code

From the organisers, and each one is a disqualification risk:

1. **Nothing may be reused from a prior project.** The project is developed after the problem statements were released
   on 30 August 2026. Standard open-source libraries, frameworks and APIs are fine; a private boilerplate the team
   already owned is not
2. **No collaboration with anyone outside the team.** No cross-sharing assets with other competing teams, no outside
   developers
3. **The repo must be public at submission**, with every link viewable. It is private today, and making it public is a
   deliberate action someone has to take before 13 Sept
4. **No major features during the deployment phase**, 12 - 31 Oct. Bug fixes only
5. **Every member attends the Grand Finals physically.** No substitutions

---

## How To Work

**Proceed without asking** on anything you can name a sensible default for: picking a library, file layout, naming or
approach; installing a dependency; refactoring your own code mid-task; writing tests, docs or types you judge necessary;
fixing a bug in code you are already touching. If two approaches are close, pick one and say which. **A reversible
decision made now beats a correct decision made after a ten minute conversation.**

**Stop and ask only for these six.** If it is not on this list, proceed:

1. **A competition rule is at risk.** Reused prior code, outside collaboration, a feature landing during the deployment
   phase, or a deadline about to be missed
2. **The change would break something already working**, and you cannot avoid it
3. **`bun run lint` or `bun run typecheck` fails and you cannot fix it.** Say what fails and what you tried
4. **Two pieces of work genuinely conflict** and shipping both is impossible
5. **A credential or external account is missing** and you cannot proceed
6. **The work would change the concept or the demo** in a way the team has not agreed to

**The bar for shipping.** Work is ready when the checks pass and it does what was asked. It need not be complete,
elegant or final. **Partial work that is submitted beats finished work still sitting on a branch on 13 September.** If
you are behind, cut scope, not the quality of what ships. **Demo-first:** if it will not appear in the 3-5 minute video
or the Grand Finals pitch, it is not a priority.

---

## The Gate Before Implementation

**No implementation starts until `docs/` holds all three.** Cheap to write, expensive to skip: without them the build
phase produces code nobody agreed to, and the submission's required sections get invented at the end from whatever got
built.

| File              | Answers                                                                         | Owns                                              |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| `docs/PRODUCT.md` | **Who and why.** The user, their problem, the demo moment, the scope ladder     | The spine. Everything downstream cites it         |
| `docs/PRD.md`     | **What.** Requirements, user stories, acceptance criteria, what is out of scope | Scope. What `hackathon-scope-cutter` cuts against |
| `docs/TRD.md`     | **How.** Architecture, API contracts, data models, schemas, decision rationale  | Technical truth. Canonical over this file         |

`docs/DESIGN.md` joins them when frontend work starts, and owns the design system: palette, type pairing, radius and
border treatment, spacing scale.

**All three are written from the findings in `docs/research/`, and they cite it.** A claim about the user, the market or
a rejected alternative that has no basis in `docs/research/` is a claim you made up. **The gate is binary.** If the
three are not all present, the answer to "can I start building" is no. Say so, and write the missing one.

---

## How To Report

If reading your message takes longer than doing the thing, you have cost time.

- **Lead with what happened.** First sentence answers "what is the state of things now?" No preamble, no restating the
  request
- **Three to five sentences** for a normal update. Longer only when something broke and the detail is needed
- **Say what a human should do, or say nothing is needed.** Never leave someone guessing whether they are blocked
- **No status theatre.** Do not narrate steps, list what you rejected, or summarise what you already said
- **When something breaks, give the error verbatim.** Paste the trace, then say in one plain sentence what it means
- **No jargon without a plain-language gloss.** Use the real term once with the plain version attached

---

## Tech Stack And Commands

| Tool                                 | Role                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------- |
| **Bun**                              | Package manager and script runner                                         |
| **Biome**                            | Lint and format for JS, TS, JSON, CSS, HTML                               |
| **Prettier**                         | Format for Markdown and YAML, the two Biome does not cover                |
| **TypeScript**                       | `tsc --noEmit`; strict, `noUncheckedIndexedAccess`                        |
| **commitlint + husky + lint-staged** | Conventional Commits on `commit-msg`; staged files linted on `pre-commit` |

```bash
bun install          # dev tooling; also wires husky hooks
bun run lint         # biome check . && prettier --check .
bun run format       # biome format --write . && prettier --write .
bun run typecheck    # tsc --noEmit, once src/ exists
```

**Application framework, database and hosting are not chosen yet**, and choosing them is not a prototype-phase job. They
get chosen and justified in `docs/TRD.md`; this table is an inventory of what is installed. The organisers place no
restriction on stack or language. **Prettier owns Markdown and YAML, Biome owns everything else**, split by file
extension rather than an ignore file. `.prettierrc.json` mirrors every formatter setting `biome.json` states, so both
wrap at 120 and neither can undo the other. `embeddedLanguageFormatting` is off, so fenced code samples are never
rewritten.

`.env.example` is empty of keys on purpose: nothing external is wired yet. Add a key name there the moment you add one
to `.env`, because the `env-drift` hook is what tells the next teammate their `.env` is stale.

**`scripts/demo/` is the exception to all of the above.** The demo recorder runs on system `python3`, `ffmpeg` and a
Playwright installed outside the repo, and it deliberately adds nothing to `package.json` - a browser and a 3 GB torch
stack have no business in the app's dependency tree. It is experimental and expected to be edited in place. Read
[`scripts/demo/README.md`](scripts/demo/README.md) before running it, especially the Chatterbox section.

`rtk` and `graphify`, both optional and per-machine, are documented in [`docs/agent-tooling.md`](docs/agent-tooling.md).
The layout tree lives in [`docs/README.md`](docs/README.md#layout), because a reviewer must read it without opening this
file. Source layout is not decided; add it there when it is.

---

## CLI First, Always

Reach for a CLI before a dashboard: `gh` for GitHub, `bun` for Node. Clicking through a dashboard leaves no trace,
cannot be handed to a teammate, and cannot be repeated tomorrow.

**If the CLI is missing, say so immediately and give the install command.** Do not route a human through the web UI as a
workaround.

**If no CLI exists, drive the browser yourself.** Pick by whether the task needs a logged-in session:

| Task                                                              | Tool                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Behind a login: the submission form, a booking sheet, OAuth       | `claude-in-chrome`. Read its `SKILL.md` first; it carries banned actions |
| Our own deployed app: smoke tests, screenshots, checking a render | Playwright, headless. Scriptable, needs no human                         |

Headless Chromium cannot see the desktop browser's cookies, which is the whole reason that split exists.

**Never type a password, card number or API key into a form** for someone, and never accept terms or submit a form on
their behalf. **The submission form is the team leader's action and nobody else's** - the rules say so explicitly. Read
the screen, do the navigation, hand back the one action that is theirs. **Screenshot what you did.**

---

## Code Style

- **Biome is authoritative:** single quotes, no semicolons, no trailing commas, 120-char lines, 2-space indent. Do not
  hand-format against it
- **Types:** no `any`; prefer `unknown` plus narrowing. Validate at system boundaries
- **Error handling:** validate at boundaries; do not wrap internal framework calls in try/catch
- **Comments:** default to none. Comment only when the _why_ is non-obvious. Never describe _what_ the code does
- **Changes are surgical.** See [guideline 3](docs/coding-guidelines.md#3-surgical-changes)

---

## Documentation Hygiene

- **TitleCase for every heading, subheading, bold lead-in label and table header.** Body prose, full sentences and
  commit subjects stay sentence case. Acronyms and proper names keep their form: AI, API, PR, UX, MMU, FCI, RM
- **Forward-looking only.** Apply this to what you write or touch. Do not sweep existing docs to conform
- **Do not reformat received sources, transcripts or installed skills.** `docs/source/` is append-only and is the
  verbatim record
- **No clumped prose.** No block over four lines. Three or more consecutive bolded-lead-in paragraphs are a table. An
  enumeration of three or more items inside a sentence is a list
- **Never drop a measured figure, a citation, a section reference or a limitation** to save space. Reformatting must be
  lossless
- **Never create a second file overlapping an existing one.** Update the existing file

### README vs TRD

Both may describe architecture. They differ in **depth and audience**, not subject.

|              | `docs/README.md`                                                 | `docs/TRD.md`                                  |
| ------------ | ---------------------------------------------------------------- | ---------------------------------------------- |
| **Audience** | Judges, external reviewers, anyone landing on the repo           | Developers implementing against it             |
| **Depth**    | High-level narrative: the whats, hows and whys                   | Canonical implementation-level reference       |
| **Contains** | Architecture overview, diagrams, setup, constraints, limitations | API contracts, data models, schemas, rationale |
| **Rule**     | Anything an outside reader needs must live here                  | Never duplicate the README. Go deeper instead  |

"It is in the TRD" is a valid answer for implementation detail, **not** for anything a reviewer needs. **The README is
the submission.** Asked at Kick-Off Day what gets submitted, the organisers answered that the Google Form takes the repo
link and everything else - the YouTube link, the design links, the ideation screenshots - lives in the repo's README.
GitHub surfaces a README from the repo root, `.github/` or `docs/`, so `docs/README.md` renders as the repository
landing page from where it sits. Keep its links relative to `docs/`. There is exactly one README in this repo.

---

## Design Standards

Anything a judge can see is held to a professional standard: the mockups, the README, the slides. **Design is 10 points
and Presentation is 15**, a quarter of the score, and the prototype is judged from a video and a set of mockups rather
than a running app. **Mockup completeness is scored on covering the core flow end to end**, not on polish per screen.

The bar: **the work must not look generated.** A competent but templated screen has failed the task, not partly done it.
The tells to avoid:

- Warm cream ground, serif display face, terracotta accent
- Near black with a single acid green or vermilion pop
- A purple to blue gradient hero on white
- Inter or Space Grotesk as the safe default
- Everything centre aligned
- One large corner radius on every surface
- A coloured rail down the side of a rounded card
- Numbered markers on content that is not a sequence
- Three items in every list because three feels balanced
- Glassmorphism with no reason for depth
- A dark dashboard with neon chart lines and no data behind them

**Structure must mean something.** If a design uses numbering, an eyebrow, a divider or a state chip, that device has to
carry real information. A numbered list of unordered things is a lie told in layout.

**UI text follows Documentation Hygiene.** TitleCase for nav items, buttons, section headings, card titles, table
headers, tab labels, menu items, modal titles and form labels. Sentence case for body copy, helper text, placeholders,
tooltips, errors, empty states and toasts. `Save Changes`, but `We could not reach the server, try again in a moment.`

**Claude Code cannot generate images.** Delegate to Codex, which needs no API key:

```bash
codex exec --skip-git-repo-check "<prompt>. Use your image generation tool. Save to /absolute/path/<name>.png"
```

Give it an absolute path, and resize before anything lands in the repo. Use the `brandkit` skill for art direction
rather than hand-writing a prompt.

**Nothing visual is done until all four are true.** State them when you report:

1. `impeccable critique` has run and its findings are addressed or consciously declined
2. The `design-taste-frontend` pre-flight check passes
3. The screen has been viewed at demo scale, not just in a wide editor pane
4. TitleCase has been checked against rendered text, not source

---

## How Work Ships

**`main` is PR-gated. No stray commits.** `.claude/hooks/guard-git.sh` enforces it. **Authorization is standing**: open
the PR, then merge it yourself, as long as nothing in it breaks something already working. The PR exists so the change
is reviewable and revertable, not so it waits for a human.

1. **Branch.** `<type>/<short-slug>`, matching the commit types below
2. **Commit** in [Conventional Commits](https://www.conventionalcommits.org/) form: `<type>[scope]: <description>`, a
   single imperative sentence, lowercase, no trailing period. Allowed types: `feat`, `fix`, `refactor`, `docs`, `test`,
   `chore`, `style`, `perf`
3. **Push the branch** and open a PR with `gh pr create`
4. **Merge** with `gh pr merge --squash --delete-branch`. Agents may merge their own PRs; the gate is the review, not
   the merge button

Small fixes still go through a branch. The overhead is one command; the alternative is a `main` nobody can review or
revert cleanly.

**`docs/research/` follows the same PR gate as everything else.** It is a notebook, but it lives on `main`, so a change
to it branches, opens a PR and merges like any other file. Its own README says how to work inside it.

**TODOs live in GitHub Issues**, not a markdown checklist, a `docs/plan.md`, or a code comment. A checklist in a file
goes stale, conflicts on merge, and is invisible to anyone not in that file. Reference the issue in the PR so merging
closes it: `Closes #12`. A short-lived, in-session task list is fine; anything that outlives the session is not.

```bash
gh issue list                          # what is open
gh issue create -t "..." -b "..."      # add one
gh issue close <n>                     # done
```

---

## The Release Cycle

**From 8 September until code freeze, the v2 prototype ships in tagged releases, and the team comments on each one in
[issue #108](https://github.com/TolongLabs/Perch/issues/108).** Code freeze is **13 September 2026, 11:59 MYT**, twelve
hours before the submission deadline. After the freeze nothing changes but the form.

| Step | Who      | What                                                                                              |
| ---- | -------- | ------------------------------------------------------------------------------------------------- |
| 1    | Advisor  | Tags `main` as `v2-X.Y.0`, publishes the GitHub release, posts "intake open" on #108              |
| 2    | Team     | Comments on #108 with suggestions and opinions on that release                                    |
| 3    | Leader   | Says "enough". The advisor closes the intake with what was accepted, what was declined and why    |
| 4    | Advisor  | Turns the accepted items into GitHub issues for the designer, in dependency order                 |
| 5    | Designer | Changes `v2/` through PRs, then hands the pitcher the new state                                   |
| 6    | Pitcher  | Re-records the demo video against the deployed release and uploads it to the team's review folder |
| 7    | Advisor  | Tags the next release and opens the next intake on #108. Repeat until the freeze                  |

The review folder's link is held by the team leader and is never written into the repo.

### The Three Sessions

Three Claude Code sessions share this one repository, each in its own worktree, with a role, a heartbeat and the same
working-tree rules.

| Session      | Model            | Owns                                                                                              |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------- |
| **Advisor**  | Claude Fable 5.1 | Sequencing, review of every PR, `docs/`, the data and lib modules, releases, the @mention monitor |
| **Designer** | Claude Opus 5    | Every surface under `v2/`, the visual checks, the README's screens, the slides' design pass       |
| **Pitcher**  | Claude Opus 5    | `scripts/demo/`, the video script through `pitch-smith`, recording, upload to the review folder   |

**How to rebuild them if they die.** Open a session in this directory per role. Each one calls `ListAgents`, sends the
other two a one-line introduction naming its role, and creates a recurring `CronCreate` heartbeat off the :00 and :30
marks (the advisor at :17 and :47, the designer at :08, :33 and :58, the pitcher at :12 and :42) whose prompt says: if
paused by a session or usage limit, resume the task you were on; run `git status` first; if nothing is pending, reply
"heartbeat: idle". The advisor also arms a persistent `Monitor` that polls `gh api notifications` every minute for
mentions on this repo only, and marks them read.

**One worktree per session, because a shared HEAD moves under a session between `git checkout -b` and `git commit`.**
Sharing one checkout put three commits on the wrong branch in one afternoon, one of them onto another session's branch
minutes before that branch was squash-merged and deleted; nothing errors, the commit is simply elsewhere. Since 8
September the advisor keeps the clone at `Perch/`, and the other two work in sibling worktrees of the same repository:

```bash
git worktree add --detach ../Perch-designer origin/main   # then bun install once, at the root
git worktree add --detach ../Perch-pitcher  origin/main
git worktree list                                         # every checkout, its HEAD and its branch
```

One remote, one set of branches, the same hooks and the same PR gate; only the path differs. Every session starts in its
own directory and never runs git in another's. A branch can be checked out in one worktree at a time, so branch from
`origin/main` inside your own tree and run `git pull` there after a merge. The single-tree rules still hold within a
tree: stage only in the same breath as committing, check `git diff --cached --name-only` before every commit, commit by
explicit pathspec and never `git add .` or `commit -a`. Keep captures and bundles out of `/tmp`; see
[`docs/agent-tooling.md`](docs/agent-tooling.md#machine-gotchas).

---

## Critical Do-Nots

- **Do not** import or adapt code written before 30 Aug 2026 **into the product**, including anything the team privately
  owned. It is a disqualification, not a style violation. The one carried-in exception is `scripts/demo/`, build tooling
  that records a video and ships nothing to a user; its provenance is declared in
  [`scripts/demo/README.md`](scripts/demo/README.md) and must be declared again in the submission. **Do not widen that
  exception** - if a second piece of prior work looks tempting, that is the moment to ask a mentor, not to copy it
- **Do not** share assets with, or take them from, another competing team, or bring in an outside developer
- **Do not** land a major feature during the deployment phase, 12 - 31 Oct. Bug fixes only
- **Do not** commit `.env` or any `sk-…` key. `.env.example` carries key names, never values
- **Do not** commit directly to `main`, force-push, rewrite published history, or delete a branch other than a merged
  feature branch
- **Do not** keep ideation anywhere but `docs/research/` on `main`. Cite it, quote it, do not duplicate it elsewhere
- **Do not** track TODOs in a markdown file
- **Do not** create `docs/architecture.md`, a root `README.md`, or any second README. `docs/README.md` is the only one
- **Do not** start implementation before `PRODUCT.md`, `PRD.md` and `TRD.md` all exist
- **Do not** rewrite `docs/source/`. It is the verbatim record
- **Do not** commit a path that only exists on your machine. `~/CS/...`, `/home/<you>/...`, `C:\Users\...`,
  `\\wsl.localhost\...` and scratch dirs under `/tmp` are invisible to everyone else. Name the tool, not your copy of
  it. Machine-independent locations like `~/.claude/` are fine
- **Do not** edit `docs/demo/` outside the `pitch-smith` subagent. It owns those files
- **Do not** delete an abandoned idea from `docs/research/`. Dead ends are worth marks
- **Do not** miss the 13 Sept submission, and **do not** leave the repo private when it goes in

---

## Skills, Subagents And Hooks

**37 skills are committed** and all are optional: invoke one when the task matches, not as a checkpoint before every
action. Your tool already lists them with descriptions, so the inventory is not repeated here. Provenance, what was
retargeted, what was deliberately not taken, and what each hook does:
[`.agents/skills/VENDORED.md`](.agents/skills/VENDORED.md).

Three things the listing does not tell you:

- **`brainstorming` is not the ideation skill.** It shapes a build once a concept is locked. The eight business skills
  are what concept selection runs on, and in this competition that selection is itself graded
- **Taste sets the target, `impeccable` hits it.** Do not start with `impeccable`
- **The `hackathon-*` skills were retargeted twice.** Their bodies still name a different event's rules. The
  `> ## This Event` block at the top of each wins

**One subagent.** `pitch-smith` owns `docs/demo/` - the submission video script, the slides, the PDF and the Grand
Finals pitch, and nothing else. Dispatch it once the concept is locked, or earlier to draft against what already exists.

**Four hooks** are wired in `.claude/settings.json`, each exiting 0 on internal failure so a broken guard never wedges a
session. Only one can stop you: `guard-git.sh` blocks a direct or force push to `main` and `git add .env`. The other
three are informational.

---

## Appendix: Standing References

Moved out of this file so they are not reloaded into every session. **The sections above outrank them wherever they
disagree.**

| Reference                               | Lives In                                                                           | Applies                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Coding Guidelines (Andrej Karpathy)** | [`docs/coding-guidelines.md`](docs/coding-guidelines.md)                           | Always. Guideline 1 is overridden by **How To Work** above; the file says so at the top |
| **RTK (Rust Token Killer)**             | [`docs/agent-tooling.md`](docs/agent-tooling.md#rtk-rust-token-killer)             | Only if `which rtk` finds it                                                            |
| **Graphify**                            | [`docs/agent-tooling.md`](docs/agent-tooling.md#graphify-codebase-knowledge-graph) | Only if `which graphify` finds it, and only once there is real code                     |

Two rules from them that change behaviour even if you never open them:

- **Changes are surgical.** Every changed line traces to what was asked. Do not refactor, reformat or improve adjacent
  code you were not sent to touch
- **`rtk` does not defeat the git guard, but it does defeat the deny list.** The hook matches the command substring, so
  `rtk git push origin main` is blocked. The `permissions.deny` entries are prefix-matched and are not. That is why both
  exist
