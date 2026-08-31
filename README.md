# Start Here

This is the **thinking branch** for our CodeNection 2026 entry. It is not the app and it has no code in it. It is where
we work out **what to build and why**, and it is worth a quarter of our score on its own.

You do not need to know how to program to work here. If you can write in a text file, you can do everything on this
branch.

---

## Why This Branch Exists

The judges score six things. The biggest one is **Ideation, at 25 percent** - and it is not about the app at all.

> **"It's not about your app. It's about your thinking."**
> — the organisers, presenting the rubric on Kick-Off Day

They score four specific things, and each of them is a **file somebody has to have written while we were thinking**:

| They Look For                                     | Worth | It Lives In     |
| ------------------------------------------------- | ----- | --------------- |
| Mindmaps, problem trees, user flows               | 8%    | `diagrams/`     |
| How the idea changed, **including what we dropped**| 7%    | `decisions/`    |
| Mentor feedback, and what we changed because of it| 7%    | `mentors/`      |
| Several ideas compared before we picked one       | 3%    | `ideas/`        |

Two more folders feed the next-biggest category, **Impact at 20 percent**, and **Creativity at 15 percent**:

| They Look For                                            | It Lives In |
| -------------------------------------------------------- | ----------- |
| A specific user and their real problem, not "students"   | `users/`    |
| Why ours is different from what already exists           | `market/`   |

**None of this can be written on the last day.** It has to already exist, because it is a record of thinking that
actually happened. That is the whole point of the branch.

The line the organisers actually said out loud:

> **"A beautiful prototype with no documented process will lose to a paper wireframe with a well documented journey."**

---

## The Two Ideas We Are Choosing Between

Every team starts in the same track, with the same two problem statements. **We pick one.**

| Problem Statement            | In One Sentence                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Stress & Workload Manager**| Show a student everything they are carrying, then actually help them carry less before they burn out            |
| **Travel Planner**           | Plan a trip end to end - budget, itinerary, everyone's preferences - and re-plan it when something goes wrong    |

The full wording is in `brief.md`, next to this file. Read it once before you start.

---

## How To Work Here

**Three rules, and that is all of them.**

1. **Write things down as you think of them, not afterwards.** A half-finished note beats a perfect note that does not
   exist.
2. **Never delete an idea.** When we drop something, it moves to `decisions/dropped.md` with a line about what killed
   it. **Dead ends are worth marks.** Deleting them costs us marks.
3. **Save changes often.** Every folder has a `_template.md` - copy it, rename it, fill it in.

### The Loop

```
have a thought  ->  put it in ideas/ or users/ or market/
talk to a mentor ->  write it up in mentors/ the same day
change our mind  ->  add a row to decisions/iteration-log.md
kill an idea     ->  move it to decisions/dropped.md and say why
```

### Saving Your Work

Three commands, always the same three, in the terminal, from this folder:

```bash
git add .
git commit -m "notes from today"
git push
```

If it complains, paste what it said into the chat and ask. **You cannot break anything here** - every version is kept,
and nothing on this branch touches the app.

---

## Working With The AI

Open Claude Code in this folder and just talk to it. It has already been set up for this branch: it knows the
competition rules, it knows the rubric, and it has been told **not to agree with you too easily**.

Things worth asking it:

| You Want                          | Say Something Like                                                            |
| --------------------------------- | ------------------------------------------------------------------------------- |
| More ideas                        | "Give me eight different angles on the stress problem, not the obvious ones"   |
| To be argued with                 | "Use the sparring-partner agent on idea 003"                                   |
| To know who else does this        | "Use the scout agent to find what already exists for this"                     |
| To know if an idea will score     | "Score idea 003 against the rubric and tell me where it loses marks"           |
| A judge's hostile question        | "Simulate the judges and ask me the three questions I would least like"        |
| To turn a messy chat into a file  | "Write that up as an entry in ideas/"                                          |

**The agent will not just say yes.** It has been told that an idea nobody argued against has not been tested. That is
deliberate and it is what the 25 percent is for.

---

## What Happens To All This

Nothing here is submitted directly. Two things happen to it:

1. **It becomes the documents on the `main` branch.** `PRODUCT.md` (who and why), `PRD.md` (what) and `TRD.md` (how) are
   written over there, quoting what we worked out here.
2. **The diagrams and the trail go into the submission itself** - screenshots of the mindmaps, the iteration log, and
   the mentor notes are exactly what the Ideation marks are awarded for.

**This branch is never merged into `main`.** It stays separate on purpose, so this stays a notebook and does not turn
into paperwork.

---

## The Folders

| Folder       | What Goes In It                                                            |
| ------------ | ---------------------------------------------------------------------------- |
| `ideas/`     | One file per idea. Good ones, bad ones, half-formed ones                    |
| `decisions/` | The running log of how our thinking changed, and the graveyard of what we killed |
| `mentors/`   | One file per mentor session. What they said, what we did about it           |
| `users/`     | Real people we talked to, and who exactly we are building for               |
| `market/`    | What already exists, and why ours is different                              |
| `diagrams/`  | Mindmaps, problem trees, user flows. Images live in `diagrams/exports/`     |

Each folder has its own README explaining what "done" looks like for it and what it is worth.

---

## The Dates That Matter

| Date                  | What                                                              |
| --------------------- | ------------------------------------------------------------------ |
| **31 Aug - 13 Sept**  | Mentorship is open. Book early, good slots go fast                |
| **13 Sept, 11:59 PM** | Everything is due. The team leader submits, and only them         |
| 21 Sept - 11 Oct      | If we get through, this is when the app actually gets built       |

**There is no code in this phase.** The organisers were asked directly and said so: *"Prototype phase is just your idea
and your UI. You'll build the app after prototype phase."* Wireframes on paper are explicitly allowed.

Everything else about the competition: `brief.md`.
