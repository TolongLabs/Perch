# 04 - Nine Icon Sites

|              |                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Source**   | X post by @neropursue, 1 Sep 2026 (39.5K views, 1.4K bookmarks); the nine sites below       |
| **Read**     | 2026-09-07                                                                                  |
| **Kind**     | A survey - nine icon libraries, fetched individually and checked for licence and format     |
| **Why this** | Pick one icon family for the travel-planner mockups, and stay licence-safe in a public repo |

## What It Actually Does

Nine libraries compared on the five axes that matter to us. Counts and licence terms below were read from each site or
its GitHub repo on 2026-09-07; where a site would not yield its terms, the row says so rather than guessing.

| #   | Site                                                   | Count                                                                                                       | Style                                                                                                  | Licence And Price                                                                                                                                                                   | Formats                                                         | Animates                                                        |
| --- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | [itshover.com/icons](https://itshover.com/icons)       | ~263                                                                                                        | Outline, a few filled variants                                                                         | **Apache-2.0**, free (verified via GitHub repo `itshover/itshover`)                                                                                                                 | React via shadcn CLI                                            | Yes, on hover (Motion)                                          |
| 2   | [web.iconly.pro](https://web.iconly.pro)               | 40,000+ (2,500 free)                                                                                        | Light, Outline, Bold, Two-tone, Duotone, Bulk; animated and 3D sets                                    | **Paid**: $8/mo ($99/yr) personal, $189 lifetime; licence terms not reachable - `[not verified]`                                                                                    | SVG, PNG, JSX/TSX, Figma                                        | Yes, 60fps set                                                  |
| 3   | [nucleoapp.com](https://nucleoapp.com)                 | 43,450                                                                                                      | Outline and fill across 9 families; no animation                                                       | **Paid**: $69-$149 per family, $149 bundle (43,450 icons); custom standard/extended licences, terms not on fetched pages - `[not verified]`; free collection exists, terms unstated | SVG, React packages, web/native apps                            | No                                                              |
| 4   | [iconsax.io](https://iconsax.io)                       | ~50,000 (6,000 free)                                                                                        | Multiple styles incl. animated                                                                         | Custom licence: **commercial use allowed, attribution NOT required** for ordinary products; attribution mandatory only for redistributed UI kits                                    | Vue, React, Svelte, Flutter, font, Figma                        | Yes (premium)                                                   |
| 5   | [isocons.app](https://isocons.app)                     | Small set, 6 categories (UI Actions, Maps, Transportation, Business & Payments, Social, Privacy & Security) | **Isometric 3D**                                                                                       | **CC BY 4.0** (verified in site bundle: credit + licence link required, changes must be indicated)                                                                                  | SVG, PNG download                                               | No                                                              |
| 6   | [hugeicons.com](https://hugeicons.com)                 | 60,000+ (6,000 free)                                                                                        | 9 styles: Stroke/Solid in Rounded, Standard, Sharp; Twotone, Duotone, Bulk                             | Custom licence, free tier included: **commercial use allowed, no attribution**; prohibits redistributing source files or making a competing library                                 | SVG, npm, CDN/font, React, Vue, Flutter, Figma                  | No                                                              |
| 7   | [morphicons.com](https://morphicons.com)               | None of its own                                                                                             | Works with icons you already have (Lucide, Tabler, Heroicons, Hugeicons) on a shared 24x24 stroke grid | **MIT**, free; bundled demos keep their authors' licences                                                                                                                           | SVG path data, React/Vue/Svelte/RN/Astro                        | Yes - morphs between icon states, spring physics, 6.5KB gzipped |
| 8   | [lucide-animated.com](https://lucide-animated.com)     | 467                                                                                                         | Lucide outline, animated on hover                                                                      | **MIT**, free (verified via GitHub repo `pqoqubbw/icons`, 8,051 stars)                                                                                                              | React + TypeScript components, shadcn CLI, needs `motion`       | Yes, on hover                                                   |
| 9   | [movingicons.dev/icons](https://movingicons.dev/icons) | 500+                                                                                                        | Lucide outline, animated on hover                                                                      | **MIT**, free (verified via GitHub repo `jis3r/icons`)                                                                                                                              | Svelte 5 components, npm `@jis3r/icons`, shadcn-svelte registry | Yes, on hover                                                   |

Context: the base library three of the nine build on, [Lucide](https://lucide.dev), is 1,813 icons on a 24px grid, **ISC
licence**, free, official packages for React, Vue, Svelte and more, tree-shakable.

## The Decision Behind It

The nine split into three groups with different jobs. **Libraries of static families** (Iconly, Nucleo, Iconsax,
Hugeicons) compete on count - 40,000 to 60,000 icons - but we need about 20, so count buys nothing and every paid one
carries a custom licence whose terms had to be chased. **Animated wrappers** (It's Hover, Lucide Animated, Moving Icons)
are all MIT or Apache-2.0 and all built on Lucide, which tells you where the open ecosystem's gravity is. **Morphicons**
is not a set at all but a transition engine for a set you already have.

The structural fact: the three safest licences in the list all ship the same underlying icon design, Lucide. Licence
safety and family consistency point at the same choice, which is why the recommendation does not need to trade one
against the other.

## What Transfers To Us

**Recommendation: standardise on Lucide** - static Lucide SVGs for the mockups, ISC licence, one family, done. Three of
the nine sites are Lucide restyled or reanimated, so if a motion moment is ever wanted in the build phase,
`lucide-animated` (467 icons, MIT, React) or Moving Icons (500+, MIT, Svelte) drops onto the same visual family with
zero redesign. It's Hover is the same deal in Apache-2.0 with fewer icons. Lucide's 1,813 icons cover every travel
concept we need - map-pin, plane, calendar, clock, users, luggage - and its 24px grid and customisable stroke width mean
one family renders consistently at caption size and at hero size.

**Animated icons do not earn their cost here.** The prototype is judged from a 3-5 minute video and static mockups; a
hover-triggered animation is invisible in a screenshot, and at mockup stage there is not even a hover to trigger. The
cost side is real: each animated icon is a component plus the Motion runtime. Say yes to animation only if a build-phase
screen has a genuinely stateful icon - a toggle, a sync spinner - and take Morphicons (MIT, 6.5KB, works on the Lucide
we already picked) over a new family at that point. For the mockups: none.

## What Does Not, And Why

- **The mega-libraries.** 43,450 or 60,000 icons answer a problem we do not have, and two of them charge $99+ a year for
  icons we would use 20 of. Iconly and Nucleo are also `[not verified]` on licence terms, which alone disqualifies them
  for a public competition repo.
- **Isocons.** Its isometric style is the most distinctive thing in the list and the CC BY 4.0 licence is workable with
  attribution - but isometric 3D icons on a phone-readable itinerary screen trade legibility for decoration, and six
  categories cannot cover a travel planner. Right answer for a landing page, wrong one for our product.
- **Icon fonts and CDN delivery.** Hugeicons and Iconsax advertise them; at mockup stage we inline SVG, and at build
  stage tree-shaken components beat a font for bundle size and accessibility.
- **Two-tone, duotone and bulk styles.** A second tone inside every icon is a design commitment the rest of our
  direction has not made; stroke-only keeps the icon family subordinate to the type and colour decisions.

## Licence Landmines For A Public Competition Repo

- **Iconly Pro** - paid subscription and its licence terms would not load on any page fetched; an unverifiable custom
  licence cannot go in a repo that turns public on 13 Sept. Avoid.
- **Nucleo** - paid with separate standard and extended licences, terms not reachable in the fetched pages; its free
  collection's terms are also unstated. Avoid.
- **Isocons** - CC BY 4.0, attribution is a hard requirement (credit plus licence link). Usable, but the attribution has
  to ship in the repo, and the style is wrong for us anyway.
- **Iconsax and Hugeicons** - custom licences but explicitly commercial-friendly with **no attribution required** for
  ordinary product use. Safe, though both forbid redistributing the source files, so the repo must not re-ship their
  whole packs. Lucide itself is safest of all: ISC, a permissive licence with no attribution obligation beyond keeping
  the notice.

## Checked Against The Tells

No site in the list pushes a generated-page tell by itself; icon choice is downstream of the tells. Two cautions worth
recording: duotone and bulk styles tempt exactly the "coloured accents with no data behind them" failure, and Isocons'
decorative 3D style is the same temptation in another shape. The recommendation - one monochrome stroke family at
consistent stroke width - is the choice least able to look generated, because it makes no colour or depth claims at all.
