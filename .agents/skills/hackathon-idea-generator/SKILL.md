---
name: hackathon-idea-generator
description: >-
  Generate candidate product concepts against the chosen Lifestyle & Personal Productivity problem statement. Use proactively whenever the concept is still open or being rethought - before any planning - then hand results to hackathon-idea-scoring. Record the ideas you reject; breadth of exploration is scored.
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

# hackathon-idea-generator

## Goal

Generate a diverse set of candidate project ideas that address the identified problem space and satisfy hackathon track
constraints.

---

## Trigger Conditions

Use this skill when:

- A `problem_statement` and `solution_gaps` are available from `hackathon-problem-space`
- The team is ready to brainstorm and needs structured idea diversity
- Track constraints from `hackathon-track-analyzer` are confirmed
- The team size and hackathon duration are known (required for feasibility scoping)
- Invoked after problem space mapping is complete, before idea scoring

---

## Inputs

| Input                      | Type     | Required | Description                                          |
| -------------------------- | -------- | -------- | ---------------------------------------------------- |
| `problem_statement`        | string   | Yes      | How-might-we problem statement                       |
| `solution_gaps`            | string[] | Yes      | Gaps from `hackathon-problem-space`                  |
| `track_constraints`        | string[] | Yes      | Required constraints from `hackathon-track-analyzer` |
| `team_size`                | integer  | Yes      | Number of team members                               |
| `hackathon_duration_hours` | integer  | Yes      | Total hours available                                |
| `tech_stack_preferences`   | string[] | No       | Preferred languages, frameworks, platforms           |
| `idea_count`               | integer  | No       | Number of ideas to generate (default: 5)             |

---

## Outputs

| Output               | Description                                 |
| -------------------- | ------------------------------------------- |
| `ideas`              | List of candidate project ideas             |
| `diversity_axes`     | Dimensions of variation across the idea set |
| `recommended_skills` | Suggested next skills to invoke             |

---

## Rules

1. Generate exactly `idea_count` ideas (default 5 if not specified).
2. Ensure each idea addresses at least one `solution_gap`.
3. Ensure each idea satisfies all `required_constraints`.
4. Vary ideas across at least 3 dimensions (e.g., complexity, user segment, tech approach).
5. Each idea must be completable by `team_size` people within `hackathon_duration_hours`.
6. Include at least one bold/high-risk idea and one conservative/low-risk idea.
7. Do not duplicate ideas; each must have a meaningfully distinct core mechanism.

---

## Output Format

```yaml
ideas:
  - id: '<idea-N>'
    title: '<short title>'
    tagline: '<one sentence>'
    core_mechanism: '<what makes it work>'
    target_user: '<segment>'
    gaps_addressed:
      - '<gap>'
    risk_level: '<high|medium|low>'
    wow_factor: '<what judges will remember>'

diversity_axes:
  - axis: '<dimension>'
    range: '<low end> → <high end>'

recommended_skills:
  - '<skill-name>'
```

---

## Example

**Input:**

```yaml
problem_statement: 'How might we provide always-available emotional support for college students so that they can manage anxiety between professional appointments?'
solution_gaps:
  - 'No affordable always-available context-aware emotional support'
track_constraints:
  - 'Must use OpenAI GPT-4 API'
team_size: 3
hackathon_duration_hours: 24
tech_stack_preferences: ['Python', 'React', 'OpenAI API']
idea_count: 3
```

**Output:**

```yaml
ideas:
  - id: 'idea-1'
    title: 'AnchorAI'
    tagline: 'A GPT-4 powered check-in companion that remembers your emotional context across sessions.'
    core_mechanism: 'Persistent memory layer over GPT-4 with emotion-state tracking'
    target_user: 'College students'
    gaps_addressed:
      - 'No affordable always-available context-aware emotional support'
    risk_level: 'medium'
    wow_factor: 'Live demo shows the AI recalling emotional context from 3 days ago and adapting its tone'

  - id: 'idea-2'
    title: 'PeerBridge'
    tagline: 'AI-facilitated peer support circles that match students by shared anxiety triggers.'
    core_mechanism: 'GPT-4 moderates group text sessions; similarity matching via embeddings'
    target_user: 'College students'
    gaps_addressed:
      - 'No peer-community facilitation layer'
    risk_level: 'high'
    wow_factor: 'Real-time AI moderation prevents harmful conversation spirals live'

  - id: 'idea-3'
    title: 'CalmDraft'
    tagline: 'Turns your anxious journaling into a structured CBT reflection in one click.'
    core_mechanism: 'GPT-4 restructures free-text journal entries using CBT thought-record format'
    target_user: 'College students'
    gaps_addressed:
      - 'No affordable always-available context-aware emotional support'
    risk_level: 'low'
    wow_factor: 'Side-by-side: raw anxious thought vs. structured reframe — instant relief visible'

diversity_axes:
  - axis: 'interaction model'
    range: '1:1 async journaling → group real-time chat'
  - axis: 'AI role'
    range: 'passive formatter → active conversation facilitator'
  - axis: 'risk level'
    range: 'low (journaling) → high (group moderation)'

recommended_skills:
  - 'hackathon-idea-scoring'
```

---

## Context Files

### Knowledge Base

- `../hackathon-shared-resources/knowledge/hackathon-winning-patterns.md`
- `../hackathon-shared-resources/knowledge/hackathon-mvp-strategy.md`
- `../hackathon-shared-resources/knowledge/hackathon-judging-criteria.md`
- `../hackathon-shared-resources/knowledge/hackathon-tools.md`

### Playbooks

- `../hackathon-shared-resources/playbooks/hackathon-workflow.md`
