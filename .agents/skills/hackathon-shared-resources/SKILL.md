---
name: hackathon-shared-resources
description: >-
  Reference library (knowledge, playbooks, templates) backing the other hackathon-* skills - they load these files via relative paths. Rarely invoked directly; consult its knowledge/ docs for winning patterns, demo psychology, and MVP strategy.
---

> ## This Event
>
> This skill was vendored from a prior hackathon repo and **retargeted twice**. The generic method below is unchanged;
> these are the real constraints. Where the body still names another event's rules, this block wins.
>
> |                         |                                                                                                          |
> | ----------------------- | -------------------------------------------------------------------------------------------------------- |
> | **Event**               | CodeNection 2026, organised by FCI and IT Society MMU Cyberjaya                                          |
> | **Track**               | Lifestyle & Personal Productivity. Every team starts here                                                |
> | **Problem statement**   | Stress & Workload Manager, or Travel Planner. Pick one                                                   |
> | **Build window**        | Prototype phase, 31 Aug to 13 Sept 2026. Fourteen days, remote                                           |
> | **Submission**          | Google Form by 13 Sept 2026, 23:59 MYT. Team leader submits. Late is rejected, no appeal                 |
> | **Deliverables**        | Public repo with README, ideation assets, design prototype links, slides, 3-5 min unlisted YouTube video |
> | **Rubric**              | Ideation 25 / Impact 20 / Creativity & Novelty 15 / Feasibility 15 / Presentation 15 / Design 10         |
> | **After the prototype** | 10 teams advance. Teams that do not may opt into Track 2, Industry, and stay in                          |
> | **Grand Finals**        | 15 Nov 2026, physical, every member present. 10 min pitch + 5 min Q&A                                    |
>
> **This is a fourteen-day prototype phase, not a 48-hour build, and nothing is deployed yet.** Any instruction about a
> 2-hour on-site rebuild, a 1080x1080 poster, community voting, a Qwen model, or a Creativity 50 / Presentation 30 /
> Qwen Integration 20 rubric belongs to a different event and does not apply.
>
> **Ideation is the largest single category at 25 percent, and it is scored on evidence you produced along the way** -
> mindmaps and problem trees, documented iterations including the directions you dropped, and mentor feedback you
> actually acted on. None of that can be reconstructed on 13 September. Full rules: `docs/brief.md`.

# hackathon-shared-resources

This package holds the shared resources used across the skills in the **hackathon-ai-devkit** suite.

## Contents

- **`knowledge/`**: Best practices, winning patterns, and reference architectures.
- **`templates/`**: Standard markdown templates (e.g. PRD, ADR, Pitch Deck, Demo Script).
- **`playbooks/`**: Context and time-boxed strategies (e.g. 24h, 36h, 48h workflows).

This folder is designed to be installed alongside the other skills in the suite to provide contextual knowledge and
reference templates for the AI agent.
