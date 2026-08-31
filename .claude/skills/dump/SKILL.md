---
name: dump
description: "Capture a raw brain-dump and file it, without making the person organise it first. Use whenever someone arrives with unstructured thinking - a paragraph of half-formed ideas, a voice-note transcript, a list that jumps between topics, a link with a reaction. Saves the raw text verbatim in docs/inbox/, then routes each piece into the folder that scores it and reports where everything went. Triggered by /dump, and proactively whenever a message reads as thinking-out-loud rather than a request."
---

# /dump

Someone just said something worth keeping. **Your job is to keep it, then file it, in that order.**

The person you are working with has more ideas than structure and will stop telling you things if telling you things
becomes work. So: **never ask them to organise before they speak, and never ask a clarifying question before the raw
text is safely written down.**

---

## Step 1: Write The Raw Text Down First

Before any analysis, any question, any routing.

```
docs/inbox/YYYY-MM-DD-<three-or-four-word-slug>.md
```

If a file for today already exists, append to it under a `## <time>` heading rather than making a second one.

```markdown
# Dump - <slug>

**Captured:** YYYY-MM-DD HH:MM

## Raw

<their words, exactly as given. Do not fix spelling, do not reorder, do not
tidy, do not drop the tangent. If it was spoken and rambling, it stays rambling.>
```

**Verbatim is not a style preference here.** This folder is dated evidence of thinking that actually happened, and the
rubric awards 7% for showing how ideas evolved. A cleaned-up dump is a worse artifact than a messy one.

---

## Step 2: Route The Pieces

Read what they said and pull out anything that belongs somewhere. **Copy it out; never move it.** The raw stays whole.

| If it is…                                                            | It goes to                                                           |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| A product idea, however rough                                        | `docs/ideas/NNN-<slug>.md`, from `docs/ideas/_template.md`                     |
| Something about who has the problem, or a real person they described | `docs/users/personas.md`, or `docs/users/interviews/` if it was a conversation |
| An app that already does this, or a workaround people use            | `docs/market/competitors.md`                                              |
| A change of mind, a doubt about an earlier idea, "actually…"         | A row in `docs/decisions/iteration-log.md`                                |
| An idea being abandoned                                              | `docs/decisions/dropped.md`, with what killed it                          |
| Something a mentor said                                              | `docs/mentors/sessions/`, from `docs/mentors/_template.md`                     |
| A relationship, branch or cause worth drawing                        | Note it; offer `/mindmap`                                            |

**One dump often produces three files.** That is normal and is the point.

**Fill templates partially and say so.** A template with four of nine sections filled and `<!-- not known yet -->` in
the rest is worth having. Waiting until you can fill all nine means it never gets written.

**Never invent to complete a section.** If they did not say who the user is, the field stays empty. A made-up persona is
worse than a blank one, because it will get quoted in the pitch.

---

## Step 3: Stamp The Dump

Add a `Filed` block at the top of the inbox file, under the captured line, so a reader can trace any piece back:

```markdown
**Filed:**

- `docs/ideas/004-load-forecast.md` - the forecasting idea
- `docs/users/personas.md` - the "doesn't know until finals week" observation
- `docs/decisions/iteration-log.md` - dropped the streaks angle
```

---

## Step 4: Report, Briefly

Two or three sentences. What you kept, where it went, and **at most one** question - the single thing that would most
sharpen the strongest idea in the dump.

```
Kept as docs/inbox/2026-09-02-overload-blindness.md. Pulled three things out of it:
a new idea in docs/ideas/004, an observation about finals week into docs/users/personas.md,
and a note in the iteration log that the streaks angle is dropped.

One question: when you said students don't notice, do you mean they can't see the
total, or that they can see it and don't believe it? Those are different products.
```

**Do not lecture, do not list what you rejected, do not summarise their own idea back at them.** They were there.

---

## Being Useful Without Being Annoying

**Push back once, on the strongest idea, not on all of them.** A dump is not a proposal. If something in it is clearly
weak, say so in a line and move on - or offer the `sparring-partner` agent, which is built for that and does it
properly.

**Notice repetition out loud.** If this is the third dump circling the same thing, say so. That is the signal that an
idea is real, and it is worth a row in `docs/decisions/iteration-log.md`.

**Notice contradiction out loud.** If today's dump disagrees with one from last week, do not silently pick a side. Both
go in the log with dates - a documented change of mind is 7% of the score, and it only exists if someone wrote down
what changed.

**Offer, do not do.** If a dump looks like it wants a diagram, say "this looks like a problem tree, want me to draw
it?" rather than producing one unasked.

---

## What Not To Do

- **Do not ask questions before Step 1 is written.** The text can be lost; the question can wait ninety seconds
- **Do not clean up the raw text.** Ever
- **Do not delete or overwrite an inbox file**, including one whose idea has since been dropped
- **Do not file a machine-specific path** into anything. `~/CS/...`, `C:\Users\...`, `/tmp/...` mean nothing to a teammate
- **Do not start designing screens or picking a tech stack.** That happens on `main`, and only after
  `PRODUCT.md`, `PRD.md` and `TRD.md` exist
- **Do not open a PR.** This branch commits directly
