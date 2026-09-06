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

| #                                             | Resource                          | Read       | What It Settled                                                                                                          |
| --------------------------------------------- | --------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| [01](studies/01-canvas-ui.md)                 | canvasui.dev                      | 2026-09-07 | Take the graceful-degradation contract, not the forty effects. One reveal, on the substituted card                       |
| [02](studies/02-threeui.md)                   | threeui.com                       | 2026-09-07 | Four measurements to copy. **Do not use the templates** - they are licensed authored documents                           |
| [03](studies/03-jakub-krehel-skills.md)       | github.com/jakubkrehel/skills     | 2026-09-07 | The execution floor beneath the tells. Supplies no direction, so it must pair with a direction study                     |
| [04](studies/04-icon-sites.md)                | Nine icon sites, from @neropursue | 2026-09-07 | **Standardise on Lucide.** Animated icons buy nothing on a static mockup                                                 |
| [05](studies/05-m-ndgn-y-instagram.md)        | @m.ndgn_y, Japanese web designer  | 2026-09-07 | **The method the whole directory was looking for**: analyse a real artefact's rules, translate them to a different brand |
| [06](studies/06-x-posts-antalik-and-icons.md) | @tranmautritam, and libraries.dev | 2026-09-07 | Link lists. Confirms the radius finding a second time                                                                    |

## What The Six Studies Agree On

**Three findings appeared independently in more than one study**, which is the only reason to trust them over taste.

1. **A radius scale, not a radius.** ThreeUI runs 3/4/5/7 px; libraries.dev runs eight values from 2 to 50 px; the
   skills repo states the rule as concentric - outer radius equals inner radius plus padding. **Three sources, and not
   one of them keeps a single radius token**
2. **Type hierarchy from weight and size inside one family**, rather than a display-plus-body font pairing. Kage pairs
   Onest 400 at 46 px against Onest 300 at 17 px; the skills repo specifies roles as Body 16/1.5 and Caption 13/1.4
3. **The tell is the missing motivation, not the device.** Kage is near-black with a vermilion pop - AGENTS.md's second
   tell - and survives because the red is torii red on a temple page. @m.ndgn_y arrives at the same place from the other
   side: her palettes cannot look generated because they were extracted from a physical object

**And one study supplies what the other five cannot.** Studies 01, 02, 03 and 06 are execution - radii, tracking,
licences, fallbacks. **Study 05 is the only one that answers where a direction comes from in the first place**, and it
is the one to read before the rebuild starts.
