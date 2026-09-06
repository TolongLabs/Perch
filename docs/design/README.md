# Design Research

**Where web design direction gets studied before it gets applied.** One file per resource in [`studies/`](studies/),
written as it is read, so the direction we end up with can be traced to something rather than asserted.

## What This Is Not

**`docs/DESIGN.md` is the spec and this directory is the reading behind it.** When frontend work starts, `DESIGN.md`
states the decisions - palette, type pairing, radius and border treatment, spacing scale - in the form a developer
implements against. Nothing here is binding until it lands there.

The split matters because the two answer different questions. **This directory answers "what did we look at, and what
did it teach us". `DESIGN.md` answers "what are we doing".** A finding that never makes it into `DESIGN.md` is not a
failure; it is a direction considered and dropped, and those score.

## How A Study Gets Written

Copy [`_template.md`](_template.md) into `studies/` as `NN-<short-slug>.md`, numbered in the order they were read.

**Study the resource, do not summarise it.** A list of what a site does is worth nothing on its own. What is worth
something is the mechanism behind a decision and whether it transfers to a page a group of four reads on a phone the
night before a trip.

**Record what does not transfer, too.** A technique that is beautiful and wrong for us is a finding, and saying why it
is wrong is how the direction gets its edges.

## The Bar Everything Is Held To

From [`../../AGENTS.md`](../../AGENTS.md), Design Standards. **Design is 10 marks and Presentation is 15**, and the
prototype is judged from a video and a set of mockups rather than a running app.

> **The work must not look generated.** A competent but templated screen has failed the task, not partly done it.

The tells AGENTS.md lists as disqualifying - warm cream and terracotta, near-black with one acid pop, a purple-to-blue
gradient hero, Inter or Space Grotesk as the safe default, everything centre-aligned, one large radius on every surface,
a coloured rail down a rounded card, numbered markers on things that are not a sequence, three items in every list,
unmotivated glassmorphism, a dark dashboard with neon lines and no data - **are not a style guide to avoid. They are the
shapes a generated page falls into**, and a study that recommends one of them needs to say why this case is the
exception.

**Structure must mean something.** If a study proposes numbering, an eyebrow, a divider or a state chip, it has to say
what information that device carries.

## Index

| #   | Resource               | Read | What It Settled |
| --- | ---------------------- | ---- | --------------- |
|     | _Nothing studied yet._ |      |                 |
