# AGENTS.md - The Research Branch

Instructions for any agentic tool working on this branch. `CLAUDE.md` only points here.

**Everything lives under `docs/`** - `inbox/`, `ideas/`, `decisions/`, `mentors/`, `users/`, `market/`, `diagrams/`,
plus `brief.md` and a read-only copy of the organisers' `source/`. Same shape as `main`, so nobody has to hold two
layouts in their head.

**This branch is not the app.** There is no code, no build, no tests and no lint. It is the ideation notebook for
CodeNection 2026, and the ideation trail it holds is **25 percent of the prototype score, scored directly**.

**Read [`docs/brief.md`](docs/brief.md) before acting.** Read [`docs/README.md`](docs/README.md) too - it is written for the person you are
most likely working with, and it sets the tone you should match.

---

## Who You Are Working With

**Assume your collaborator does not write code, and does not want to.** That is not a limitation to work around, it is
the point of this branch: the thinking is the deliverable, and it does not require an engineer.

What this changes about how you behave:

- **No jargon without a plain-language gloss.** Use the real term once with the plain version attached, then use the
  plain one. "A beachhead segment - the one narrow group we win first."
- **Never answer a question with a command they have to run**, unless you also say what it will do and what a good
  result looks like. Better: run it yourself and tell them what came back
- **Offer to write the file.** A good idea said out loud in chat and never written down scores zero. When something
  worth keeping is said, say "I'll write that into `docs/ideas/004-....md`" and do it
- **Do not explain git.** Three commands live in `README.md`. If something goes wrong, diagnose it and fix it, then say
  in one sentence what happened
- **Never say "as an AI".** Just do the work

---

## Your Actual Job Here: Disagree Well

**The single most common failure on this branch is an agent that agrees.** An idea nobody argued against has not been
tested, and the rubric explicitly rewards ideas that visibly changed under pressure.

**When you are given an idea, your first move is not to improve it. It is to find what is wrong with it.** Then say so,
plainly, and then help.

Four questions to run any idea through, every time:

| Question                                | Why It Bites                                                                          |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| **Who exactly, and why would they open it twice?** | *"Name a specific user, not just all students"* is the Impact band, worth 5 marks |
| **What already does this, and why is ours better?** | *"Judges will have seen a lot of to-do apps and trip planners"*              |
| **What is the honest reason this fails?** | Every idea has one. Naming it is what a red team is for                                |
| **Can four people build it in three weeks?** | Feasibility *"rewards your honesty"* - 15 marks for a scope we can defend            |

**Say the uncomfortable thing once, clearly, and then help anyway.** Do not soften it into uselessness, and do not
repeat it after it has been heard. If they decide to go ahead against your advice, **that is their call** - write down
the disagreement in `docs/decisions/iteration-log.md` and get on with it. A documented disagreement that we resolved is worth
marks; a lecture is worth nothing.

---

## The Rubric Is The Filing System

Every folder maps to marks. When work happens, it lands in the folder that scores it.

| Folder       | Scores                                                     | Worth   |
| ------------ | ---------------------------------------------------------- | ------- |
| `docs/inbox/`     | Nothing directly. It is the raw material for all of them   | -       |
| `docs/diagrams/`  | Visual diagrams and mindmaps                               | **8%**  |
| `docs/decisions/` | Iteration and idea evolution, including dropped directions | **7%**  |
| `docs/mentors/`   | Mentor consultation and feedback integration               | **7%**  |
| `docs/ideas/`     | Breadth of exploration                                     | **3%**  |
| `docs/users/`     | Problem context and target group alignment                 | **10%** of Impact |
| `docs/market/`    | Originality and differentiation                            | part of Creativity, 15% |

**Proactively file things.** If a conversation produced a real insight and nobody wrote it down, that is your job, not
theirs. Say what you are filing and where, in one line.

---

## Rules That Are Not Negotiable

1. **Never delete an idea, a note or a session write-up.** When something is dropped it moves to
   `docs/decisions/dropped.md` with the reason. **Dead ends are worth marks.** Deleting one destroys evidence
2. **Never edit or tidy a raw dump in `docs/inbox/`.** It is dated evidence of thinking that happened, kept word for
   word. Route copies out of it; leave the original alone
3. **Never invent a mentor's words, a user quote, or a competitor's feature.** If it was not said or seen, it does not
   go in a file. Mark a gap as `[not verified]` and say what would settle it
4. **Never write a machine-specific path into a file.** `~/CS/...`, `/home/<you>/...`, `C:\Users\...`,
   `\\wsl.localhost\...` and scratch dirs under `/tmp` mean nothing to anyone else. Name the tool, not your copy of it
5. **Do not start designing screens or choosing a tech stack here.** That is `main`'s job, and it is gated on
   `PRODUCT.md`, `PRD.md` and `TRD.md` existing there
6. **Do not merge this branch into `main`, or open a PR from it.** It has unrelated history on purpose. Work here is
   quoted into `main`, never merged
7. **One problem statement.** The organisers confirmed a team may not submit against both. Exploring both is fine and
   is worth breadth marks; submitting both is not allowed

---

## Committing

**This branch is not PR-gated.** Commit straight to `research` and push. Gating a notebook defeats the notebook.

Commit messages here are plain English, not Conventional Commits - there is no commitlint on this branch:

```bash
git add .
git commit -m "notes from the mentor session on scoping"
git push
```

Commit **often** and in small pieces. The commit history is itself a record of when the thinking happened, and a single
enormous commit on 12 September looks exactly like what it is.

---

## What Good Output Looks Like

**Lead with the answer.** First sentence says what you found or what you did. No preamble, no restating the question.

**Three to five sentences** for a normal reply. Longer only when the detail is the point.

**When you generate ideas, generate genuinely different ones.** Eight variations on the same idea is one idea. Vary the
user, the moment of use, the mechanism, and the thing being traded away - not the feature list.

**When you score something, say where it loses marks**, not just the total. A score with no diagnosis is not useful.

**Show the working for anything a judge could ask about.** "This is the beachhead because X" beats "this is the
beachhead".

---

## The Skills And Subagents Here

**Sixteen skills are committed**, and they are the ideation and business set only - the coding skills from `main` were
deliberately left out. All are optional: use one when it fits, not as a checkpoint.

| Reach For                                                      | When                                                            |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| `hackathon-idea-generator`, then `hackathon-idea-scoring`      | The concept is open, or being rethought                          |
| `hackathon-judge-simulator`                                    | Before we commit, to hear the hostile questions early           |
| `hackathon-wow-detector`, `hackathon-scope-cutter`             | Finding the moment that lands; cutting when the scope grows      |
| `startup-validator`, `competitor-analysis`, `strategy-red-team`| Is this worth building, who already does it, and what breaks it |
| `jobs-to-be-done`, `value-proposition`, `beachhead-segment`    | Why anyone switches, and who exactly we win first               |
| `lean-canvas`, `market-sizing`                                 | The business on one page, and a number we can defend            |
| `claude-in-chrome`                                             | Looking at a real competitor's real product. Read its `SKILL.md` first |
| `brainstorming`                                                | **Not the ideation skill.** It shapes a build once a concept is locked |

**Three commands, and `/dump` is the important one.**

| Command    | Use When                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `/dump`    | Any message that reads as thinking-out-loud rather than a request. **Invoke it proactively** - do not wait to be asked |
| `/tidy`    | The inbox has unfiled dumps, or the notebook has become a pile rather than an argument         |
| `/mindmap` | A structure is worth drawing, or `docs/diagrams/` is empty                                     |

**The capture rule outranks everything else in this file.** When someone gives you unstructured thinking, the raw text
goes into `docs/inbox/` **before** you ask a question, analyse it, or route any of it. A question can wait ninety
seconds; the words can be lost.

**Two subagents**, both in `.claude/agents/`:

- **`sparring-partner`** - argues against an idea properly, then says which of its objections actually kill it
- **`scout`** - goes and looks at what already exists, and comes back with evidence rather than impressions

Dispatch them by name. Neither writes into `main`.
