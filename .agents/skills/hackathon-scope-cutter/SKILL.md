---
name: hackathon-scope-cutter
description: >-
  Cut a feature set down to what ships by the 13 Sept prototype deadline while preserving demo impact. Use proactively whenever a plan or feature list grows past the days remaining.
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

# hackathon-scope-cutter

## Goal

Reduce a project's feature set to the minimum viable product (MVP) that can be shipped within the hackathon time limit
while preserving demo impact.

---

## Trigger Conditions

Use this skill when:

- A top idea has been selected and confirmed by `hackathon-idea-scoring`
- A feature wishlist exists and must be reduced to a shippable set
- The hackathon duration and team size are known
- The team is at risk of building too much and shipping nothing
- Invoked once per project, immediately after idea selection; output is an upstream dependency for planning,
  implementation, and presentation skills

---

## Inputs

| Input                      | Type     | Required | Description                                       |
| -------------------------- | -------- | -------- | ------------------------------------------------- |
| `project_title`            | string   | Yes      | Name of the selected project                      |
| `feature_wishlist`         | string[] | Yes      | Full desired feature list                         |
| `core_mechanism`           | string   | Yes      | The single mechanism the project must demonstrate |
| `hackathon_duration_hours` | integer  | Yes      | Total hours available                             |
| `team_size`                | integer  | Yes      | Number of team members                            |
| `team_skills`              | string[] | Yes      | Technologies the team can use effectively         |
| `wow_factor`               | string   | Yes      | What must land for judges to be impressed         |

---

## Outputs

| Output               | Description                                       |
| -------------------- | ------------------------------------------------- |
| `mvp_features`       | Features included in the MVP                      |
| `deferred_features`  | Features cut from MVP (post-hackathon backlog)    |
| `cut_rationale`      | Why each deferred feature was cut                 |
| `mvp_demo_flow`      | Minimal user journey that demonstrates core value |
| `time_budget`        | Rough hour estimate per MVP feature               |
| `scope_risk`         | Remaining risks even after scoping                |
| `recommended_skills` | Suggested next skills to invoke                   |

---

## Rules

1. Include a feature in MVP only if it is required to demonstrate `core_mechanism` or `wow_factor`.
2. Default to cutting any feature that cannot be implemented in less than 20% of total time.
3. Preserve at least one visually compelling UI moment in `mvp_demo_flow`.
4. Total `time_budget` must not exceed 70% of `hackathon_duration_hours` (reserve 30% for polish and presentation).
5. Mark features as `[FAKE-OK]` if they can be simulated or hardcoded for demo purposes.
6. Do not cut the feature that delivers `wow_factor`.

---

## Output Format

```yaml
mvp_features:
  - feature: '<name>'
    purpose: "<why it's essential>"
    fake_ok: <true|false>

deferred_features:
  - feature: '<name>'
    cut_rationale: '<reason>'

mvp_demo_flow:
  - step: <number>
    action: '<user action>'
    outcome: '<visible result>'

time_budget:
  - feature: '<name>'
    estimated_hours: <number>

scope_risk:
  - '<risk>'

recommended_skills:
  - '<skill-name>'
```

---

## Example

**Input:**

```yaml
project_title: 'AnchorAI'
feature_wishlist:
  - 'User authentication and profiles'
  - 'GPT-4 emotional check-in conversation'
  - 'Session memory (recall past conversations)'
  - 'Mood trend dashboard'
  - 'Push notifications for daily check-ins'
  - 'Crisis escalation to hotline resources'
  - 'Onboarding quiz to personalize tone'
core_mechanism: 'GPT-4 conversation with persistent emotional context memory'
hackathon_duration_hours: 24
team_size: 3
team_skills: ['Python', 'React', 'OpenAI API']
wow_factor: 'AI recalls emotional context from past sessions and adapts tone in real time'
```

**Output:**

```yaml
mvp_features:
  - feature: 'GPT-4 emotional check-in conversation'
    purpose: 'Core mechanism — must ship'
    fake_ok: false
  - feature: 'Session memory (recall past conversations)'
    purpose: 'Delivers the wow factor'
    fake_ok: false
  - feature: 'Crisis escalation to hotline resources'
    purpose: 'Safety requirement visible to judges'
    fake_ok: true

deferred_features:
  - feature: 'User authentication and profiles'
    cut_rationale: '3–4h cost; demo uses single hardcoded session'
  - feature: 'Mood trend dashboard'
    cut_rationale: 'Not in demo flow; 4h cost'
  - feature: 'Push notifications'
    cut_rationale: 'Backend complexity; irrelevant to live demo'
  - feature: 'Onboarding quiz'
    cut_rationale: 'Can be mocked with pre-set tone for demo'

mvp_demo_flow:
  - step: 1
    action: "User opens app and types: 'I'm feeling really overwhelmed today'"
    outcome: 'AI responds empathetically with personalized opening'
  - step: 2
    action: 'User describes a recurring work stress'
    outcome: "AI references last week's similar conversation from memory"
  - step: 3
    action: 'User expresses hopelessness'
    outcome: 'AI surfaces crisis resource card gracefully'

time_budget:
  - feature: 'GPT-4 check-in conversation'
    estimated_hours: 4
  - feature: 'Session memory'
    estimated_hours: 5
  - feature: 'Crisis escalation (mocked)'
    estimated_hours: 1

scope_risk:
  - 'Memory retrieval latency may degrade demo experience on slow networks'

recommended_skills:
  - 'hackathon-task-planner'
  - 'hackathon-wow-detector'
```

---

## Context Files

### Knowledge Base

- `../hackathon-shared-resources/knowledge/hackathon-mvp-strategy.md`
- `../hackathon-shared-resources/knowledge/hackathon-common-failures.md`
- `../hackathon-shared-resources/knowledge/hackathon-winning-patterns.md`
- `../hackathon-shared-resources/knowledge/hackathon-demo-patterns.md`

### Playbooks

- `../hackathon-shared-resources/playbooks/hackathon-workflow.md`
- `../hackathon-shared-resources/playbooks/24h-hackathon-playbook.md`
- `../hackathon-shared-resources/playbooks/36h-hackathon-playbook.md`
- `../hackathon-shared-resources/playbooks/48h-hackathon-playbook.md`
