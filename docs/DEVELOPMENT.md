# Developer Guide

Local development setup, commands, testing, and deployment reference for **Perch by TolongLabs**. External submission
information and product overview live in [`README.md`](README.md).

---

## Getting Started

### Prerequisites

- **Bun** (version 1.1 or higher)
- **Git**

```bash
bun install                  # Install dependencies and wire husky hooks
cp .env.example .env         # Initialize local env (prototype requires no external API keys)
bun run dev                  # Start Vite development server at http://localhost:5173
```

### Core Commands

| Command             | Role                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| `bun run dev`       | Start local Vite dev server with Hot Module Replacement                  |
| `bun run build`     | Compile production distribution bundle into `dist/`                      |
| `bun run preview`   | Serve compiled production bundle locally on port 8080                    |
| `bun run lint`      | Run Biome check on code and Prettier check on markdown and YAML          |
| `bun run format`    | Format code with Biome and format markdown/YAML with Prettier            |
| `bun run typecheck` | Run TypeScript compiler type check (`tsc --noEmit`)                      |
| `bun test`          | Run Vitest test suites (scheduler, tally, formatters, and surface tests) |

---

## Code Quality And Style

- **Biome is authoritative** for JavaScript, TypeScript, JSON, CSS, and HTML. Lines wrap at 120 characters, 2-space
  indentation, single quotes, no semicolons.
- **Prettier is authoritative** for Markdown and YAML. It wraps prose at 120 characters to match `biome.json`.
- **TypeScript strict mode** is enabled with `noUncheckedIndexedAccess`. Avoid `any`; use narrow type guards.
- **Documentation hygiene**: TitleCase for all headings, subheadings, table headers, and bold labels. Body text stays
  sentence case. Prose blocks must not exceed four lines.

---

## Git Workflow And Shipping

1. **Branching**: Create feature or fix branches matching the convention: `<type>/<short-slug>` (e.g.
   `feat/book-spread`, `fix/desk-layout`).
2. **Conventional Commits**: Format commit messages as `<type>(scope): <imperative description>` in lowercase without a
   trailing period. Allowed types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`.
3. **Verification Before Push**: Always verify locally before creating a pull request:
   ```bash
   bun run lint && bun run typecheck && bun test
   ```
4. **Pull Requests**: Push the branch and open a pull request. Merges to `main` are squashed with branch deletion.

---

## Repository Layout

```
docs/
  README.md              Submission surface and repository landing page
  DEVELOPMENT.md         This file: local setup, commands, and developer guide
  PRODUCT.md             Product spine: user persona, core thesis, and scope ladder
  PRD.md                 Requirements, user stories, and acceptance criteria
  TRD.md                 Technical reference, architecture contracts, and scheduler algorithms
  DESIGN.md              Design system: field-guide aesthetic, tokens, and typography
  brief.md               Competition rules, deadlines, and rubric guidelines
  assets/                Screenshots and ideation diagram exports
  research/              Ideation notebook: dated decision records, market analyses, and user research
  source/                Verbatim organiser material, kickoff transcripts, and mentor notes
  demo/                  Slide deck PDF, recording script, and video assets
v1/                      Legacy static HTML mockup, served at /v1/
v2/
  index.html             Vite entry point
  public/                Static fonts (Quicksand, Newsreader) and seal assets
  src/
    data/                Data fixtures, place models, and Tokyo seed data
    lib/                 Deterministic scheduler, tally logic, persistence, and unit tests
    surfaces/            Route surfaces: Landing, Dashboard, Onboarding, Deck, Tally, Desk, Book, Handbook
    components/          Shared UI components (ReelCard, PlacedCard, Drawer, StateChip)
    styles/              Design tokens (`tokens.css`) and surface stylesheets (`base.css`)
scripts/demo/            Experimental automated video recording scripts
Dockerfile               Two-stage multiplatform build (Bun compile + Nginx static server)
nginx.conf               Production web server configuration with SPA routing fallback
vite.config.ts           Vite build configuration
```

---

## Deployment Architecture

The live prototype is automatically deployed to **Google Cloud Run** (`asia-southeast1`) on every merge to `main`.

| Component    | Specification                                                                               |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Hosting**  | Google Cloud Run (serverless container, scales to zero when idle)                           |
| **Delivery** | Nginx 1.27 Alpine serving compiled SPA bundle and `/v1/` static fallback                    |
| **CI/CD**    | GitHub Actions via Workload Identity Federation (no long-lived service account credentials) |
| **Routing**  | Nginx SPA fallback redirects all unknown `/t/<trip>` paths to `index.html`                  |

---

## Source Material From Organisers

All organiser materials are preserved verbatim in `docs/source/`:

- [`source/kickoff-day-transcript.md`](source/kickoff-day-transcript.md) — Kick-Off Day recording transcript
- [`source/kickoff-day-slides.md`](source/kickoff-day-slides.md) — Kick-Off Day 30-slide presentation deck
- [`source/problem-statements.md`](source/problem-statements.md) — Official track problem statements and criteria
- [`source/prototype-judging-rubrics.md`](source/prototype-judging-rubrics.md) — Prototype judging rubric bands
- [`source/submission-template.md`](source/submission-template.md) — Submission README and video outline guidelines
- [`source/mentor-session-1-transcript.md`](source/mentor-session-1-transcript.md) — Verbatim mentor session transcript
