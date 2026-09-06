# 03 - Jakub Krehel Skills

|              |                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| **Source**   | https://github.com/jakubkrehel/skills (also published as interfaces.dev and skills.sh)                  |
| **Read**     | 2026-09-07                                                                                              |
| **Kind**     | A system - eleven agent skills of interface craft, ~4,850 lines of Markdown, no code                    |
| **Why this** | Whether a craft library of this depth names anything a generated page misses, and what holds on a phone |

## What It Actually Does

Eleven skills in two shapes. Seven are **domain skills** - `better-typography`, `better-colors`, `better-layout`,
`better-ui`, `better-accessibility`, `better-writing`, plus `better-interface` which consolidates them into one review.
Four are **verb skills** - `interface-review`, `explain-interface`, `break`, `variant` - which are agent procedures, not
design content.

The domain skills are written as measurable rules with exact values, not adjectives. The load-bearing ones:

- **Typography.** A role-based scale, each size paired with its line-height and weight: Display 36px/1.1/600, Title
  24px/1.2/600, Heading 18px/1.3/600, Body 16px/1.5/400, Caption 13px/1.4/400. Weight `400` floor below 18px; thin
  weights are display-only at 28px+. Measure capped at 60-75 characters. `text-wrap: balance` on headings, `pretty` on
  descriptions, neither in long-form. `font-variant-numeric: tabular-nums` on any value that changes. Inputs at 16px on
  mobile because iOS Safari zooms the page otherwise.
- **Color.** A palette is ramps, not colors: one neutral, one accent, only the status ramps the product renders. Radix's
  12 steps are role-defined and survive a theme change; Tailwind's 11 are lightness-defined and do not, so the role
  mapping belongs in a semantic token tier. Contrast is measured with APCA, not estimated: Lc 75 body, Lc 60 non-body,
  Lc 45 large text, Lc 30 UI components. "Never report a contrast value you did not measure."
- **Layout.** The gap between groups is at least 2x the gap within one - 8px intra-group to 16px+ inter-group, or the
  grouping reads as noise. Space groups first, background shapes second, separator lines last. One spacing step per
  level of subordination, 16px default. Horizontal scrollers peek the next item 16-32px past the edge, because "a row of
  cards that ends exactly at the edge looks complete, and nobody scrolls it". Content bleeds to the viewport edge;
  controls float inside 16px margins plus `env(safe-area-inset-*)`.
- **UI polish.** Concentric radius: outer radius = inner radius + padding, and mismatched nested radii is named "the
  most common thing that makes an interface feel off". Depth comes from a three-layer transparent shadow
  (`0 0 0 1px oklch(0 0 0 / 0.06)`, a 1px lift, a 2px ambient), not borders; dark mode collapses to one white ring at 8%
  white. Images get a 1px outline of pure black or white at 10% opacity, never a tinted neutral, because a tinted
  outline "reads as dirt on the image edge". Press feedback is exactly `scale(0.96)`. High-frequency interactions get
  150ms or less. Icon stroke matches text weight: 1.5px beside regular, 2px beside semibold.
- **Writing.** Buttons start with a verb; a confirmation repeats the consequence. Errors state the fix beside the field
  that failed. Empty states say what the place is and offer one action. Toggles are labelled for their ON state.

The verdict on our key question: **this repo knows a great deal about execution and nothing about direction.** It has no
palette, no typeface pairing, no mood, no composition point of view - it explicitly refuses to pick: "Applying or
reviewing typography never requires a new typeface" and "leave the colors alone, they are a design decision." A page can
satisfy every rule here and still look generated, because the tells in AGENTS.md are largely taste and composition
choices this library deliberately leaves alone. What it does give is the **execution floor underneath the tells** - the
layer of small, measurable correctness a generated page almost always fails, and which reads as "deliberate" even to a
judge who cannot name it.

## The Decision Behind It

Every rule earns its place by naming the failure it prevents: iOS zooms on sub-16px inputs, tap errors from unspaced hit
areas, dead scrollers with no peek. The craft reads as craft precisely because each value is a decision rather than a
default.

The repo's own structure encodes a second, transferable idea: **severity is evidence, not taste.** Each skill ends with
a ladder - HIGH blocks a task, MEDIUM breaks the system, LOW is isolated polish - and its escalation triggers are
concrete: color carrying meaning alone, truncated content with no recovery, an error with no way out. Judgement is
routed to the owner skill; the reviewer only consolidates. That is the same discipline our design README demands of us -
"structure must mean something" - implemented as process.

The `variant` skill adds the sharpest single idea in the repo: when exploring a design, pick **one primary axis** -
structure, density, emphasis, type, or voice - and give each variant a different position on it, letting every other
choice follow. "Varying every axis at once produces three unattributable results. You learn which you liked, not what
made it work." Variants get real content and the real container: "Lorem ipsum and three rows make every structure look
good."

## What Transfers To Us

Specific to the phone page four people read the night before a trip, and to the mockups the judges watch:

- **The role-based type scale is our spacing-and-hierarchy answer.** Five roles with size, line-height and weight stated
  as one decision each maps straight onto `docs/DESIGN.md`. On a 375px itinerary screen, Body 16/1.5 and Caption 13/1.4
  are the two roles that do almost all the work.
- **`tabular-nums` on every changing value.** An itinerary is times, gate numbers, prices and counts. Without it, the
  layout shifts as values update or differ; this is a one-line rule with outsized effect on exactly our content.
- **The 2x grouping gap.** A night-before checklist page is entirely groups - bookings, timings, who-brings-what.
  Enforcing 8px inside a group and 16px+ between them is the difference between a scannable plan and noise.
- **One filled action per view**, accent on the background, peers neutral. Directly applicable to the share/save
  affordance on the trip page.
- **The 16-32px peek on horizontal scrollers.** If day cards or itinerary segments scroll horizontally, the next card
  must peek, or nobody scrolls it. This is the single most phone-specific rule in the repo.
- **Concentric radius** (outer = inner + padding) and the three-layer shadow-as-border recipe give the surfaces the "one
  large corner radius on every surface" tell is a failure of.
- **Inputs at 16px on mobile**, 44x44px touch targets, 12px between bordered controls and 24px around borderless ones,
  buttons inset 16px from the edge with `env(safe-area-inset-bottom)` accounted for. A trip page used in an airport is a
  thumb-first page.
- **The writing rules are the mockup-copy rules**: verb-first buttons, errors that say the fix, empty states that
  orient, `tabular-nums` aside - plus AGENTS.md's TitleCase/sentence-case split maps cleanly onto its "one
  capitalization policy" principle.
- **The `variant` method for the mockup phase itself**: when comparing itinerary-layout directions, vary one named axis
  (density, or emphasis, or structure), build on real trip content, and judge at 375px - "the answer can change between
  375px and 1440px".

## What Does Not, And Why

- **Direction.** The repo refuses to choose typefaces, palettes or moods, so it cannot keep a page out of the generated
  tells on its own. Pairing it with one of the reference systems in the design library is required; this repo only makes
  whatever we pick render correctly.
- **Deep accessibility and i18n.** ARIA patterns, screen-reader walks, RTL mirroring, logical properties,
  pseudo-localization testing, forced-colors mode. Our page is one language, one direction, four readers, one night;
  carrying that cost buys nothing a judge sees. Hit-area minimums and contrast floors stay; the apparatus around them
  does not.
- **Dual themes.** Every color rule assumes light and dark variants plus a `prefers-contrast` tier. The prototype is
  judged from a video and mockups of one theme; building both halves the palette work for zero scored pixels.
- **Dark-mode recipes** - the single white ring, reduced vividness - same reason, and they are the half of the shadow
  system we would simply not use.
- **The verb skills as tooling.** `interface-review`, `break` and `explain-interface` are procedures for a live codebase
  with a browser; our deliverable is mockups, so the harnesses do not apply. Only their discipline - every state
  rendered, worst-case content, real item counts - carries over.
- **Review bureaucracy at full weight.** Severity tables, caps and verdicts are for a maintained product. We take the
  escalation triggers as a mockup checklist and drop the format.

## Checked Against The Tells

Nothing here recommends a listed tell, and three of its rules arm directly against them: concentric radius against the
one-radius-on-everything tell, "align to shared edges" against everything-centre-aligned, and grouping-from-space
against decorative dividers. Nothing in the repo prescribes three-item lists or unmotivated glassmorphism.

The exception to name honestly: the repo's default toolkit - Tailwind utilities, semantic tokens, the Radix ramp model,
the system font stack as its own listed option - is exactly the toolkit a generated page reaches for. Following these
rules makes a page correct, not distinctive; the differentiation has to come from the direction studies, with this one
as the floor underneath.
