# 06 - The Two X Posts, And Where One Of Them Leads

|              |                                                                                   |
| ------------ | --------------------------------------------------------------------------------- |
| **Source**   | @tranmautritam, 20 Aug 2026 · @neropursue, 1 Sept 2026 · plus `libraries.dev`     |
| **Read**     | 2026-09-07, both posts opened in a real browser and the destination site explored |
| **Kind**     | Two link-list posts by designers with reach. Neither is itself a design artefact  |
| **Why this** | Both were on the list. The finding is what they point at, not what they say       |

## What They Actually Are

**Neither post contains an argument.** They are curated link lists, and their value is entirely in the destinations.
Recorded with their numbers so the reach is on the record.

| Post                                                             | Content                       | Reach                                         |
| ---------------------------------------------------------------- | ----------------------------- | --------------------------------------------- |
| **@tranmautritam**, "Damn I love this ↓", 20 Aug 2026            | Four Jakub Antalik microsites | 46.6k views · 1.2k likes · **1.7k bookmarks** |
| **@neropursue**, "Icon sites for your next project", 1 Sept 2026 | Nine icon sites               | 39.5k views · 941 likes · **1.4k bookmarks**  |

**The icon list is studied separately** in [`04-icon-sites.md`](04-icon-sites.md), including licence terms and a single
recommendation. This file covers the first post and its destination.

## Where The First Post Leads

**All four microsites have been consolidated and the tweet's links are now redirects.** `gooey.jakubantalik.com`, which
the post lists as "liquid effects for React UI", serves only a notice: _"Liquid Gooey has moved to a new home:
libraries.dev to be accessible from one place together with other libraries."_ The same applies to `beam`, `metal` and
`orbs`.

**The destination is `libraries.dev`**, positioned as **"High-crafted UI libraries for AI agents"** with the subhead "UI
effects for modern apps, ready to use with your coding agents". It reports **2,853,114 installs** and 3k GitHub stars,
and carries the four originals - Liquid Gooey, Border Beam, Liquid Metal and Thinking Orbs - plus a paid Studio tier.

**Measured off its live DOM**, because a site selling craft should be judged on its own:

| Property   | Value                                                         |
| ---------- | ------------------------------------------------------------- |
| Display    | **Saans**, with Inter as the fallback                         |
| Mono       | Roboto Mono                                                   |
| Background | `rgb(18, 18, 18)`                                             |
| Text       | `rgb(255, 255, 255)` - pure white                             |
| Radii      | **2, 6, 8, 12, 14, 24, 26 and 50 px** - eight distinct values |

## The Decision Behind It

**The one transferable idea here is a positioning move, not a visual one.** Both this and Canvas UI and ThreeUI have
independently arrived at the same shape: **a component library whose distribution channel is a coding agent.** Canvas UI
ships a shadcn registry and an MCP server; ThreeUI publishes a `Skill.md` per template; `libraries.dev` says "for AI
agents" in its headline. That is three of the four sites on this list converging on the same idea within weeks of each
other.

**And the radius scale says the same thing ThreeUI's did, louder.** Eight distinct radii from 2 px to 50 px on one page.
Nobody picks eight values by accident; they picked one per element class and let the small things stay small. **Two
sites, independently measured, both refusing the single-radius habit** is the most repeated finding in this whole
directory.

## What Transfers To Us

**Almost nothing directly, and that is worth saying plainly rather than padding.** These are link lists; the studies
that matter are the destinations, which are covered in [`01-canvas-ui.md`](01-canvas-ui.md),
[`02-threeui.md`](02-threeui.md) and [`04-icon-sites.md`](04-icon-sites.md).

**Two things do carry over.**

**The radius finding, now confirmed twice.** ThreeUI runs 3/4/5/7 px; `libraries.dev` runs eight values from 2 to 50 px.
Neither applies one radius everywhere. `docs/DESIGN.md` should specify a scale of three or four values keyed to element
size, and the rebuild should stop reaching for a single token.

**Bookmarks are the honest signal.** Both posts have **more bookmarks than likes** - 1.7k against 1.2k, and 1.4k
against 941. People are saving these to use later. Where a designer's audience saves rather than applauds, the list is a
real working reference, which is the reason both destinations were worth the time.

## What Does Not, And Why

**"Liquid metal borders" and "thinking orbs" are for AI product interfaces, and we are not one.** A thinking orb is a
loading state for a chat that streams; our AI agent runs once, behind a planner, and its output is an itinerary rather
than a conversation. **Putting an orb on our page would be borrowing the visual language of a product category we are
not in**, which is the same error as putting a shader behind a checklist.

**`libraries.dev` also trips two tells that ThreeUI avoided**, and the contrast is instructive: pure `#fff` on
`#121212`, and **Inter as the fallback face**. It gets away with it because Saans carries the display weight and the
effects carry the personality. **We would not get away with it**, because we have no bespoke typeface and no effects.

**And the tweet is already stale after eighteen days.** Every URL in a post from 20 August now redirects. Anything we
cite in the README on 13 September should be cited by what it is, not only by a link that may move.

## Checked Against The Tells

**The post itself cannot trip the list - it is a list.** Its destination trips two: pure white on near-black, and Inter.
Both are recorded above with the reason they survive there and would not survive here.

**The finding that pushes back against the list is the radius scale**, and it is now doubly evidenced. AGENTS.md names
"one large corner radius on every surface" as a tell; the two most crafted sites in this directory answer it with
three-to-eight distinct values sized to the element. **That is a concrete correction we can apply, not a taste
judgement.**
