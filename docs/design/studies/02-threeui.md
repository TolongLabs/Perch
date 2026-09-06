# 02 - ThreeUI

|              |                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Source**   | https://threeui.com , browse index plus the Kage landing-page entry                                                |
| **Read**     | 2026-09-07, **opened in a real browser**, with the live DOM measured                                               |
| **Kind**     | Component and template library, 395 items, 5.2k GitHub stars. Ships as `@designcodeio/threeui`                     |
| **Why this** | Second of the two "beautiful UI repository" sites. The question was the same: is any of this usable on our screens |

## What It Actually Does

**Three things, and only the third is unusual.** It sells Three.js components and WebGL backgrounds, which is crowded;
it sells shader effects, which is crowded; and it sells **complete authored landing pages preserved byte-for-byte**,
which is not.

Categories across 395 items: Landing Pages, Hero, Three.js, Backgrounds, Buttons, Text Animation, UI Elements, CSS,
Motion Design. Named template families include Sylva, Sketchbook, Kage, Complete Shelf, Predictive Arc, Structure Flow,
3D Paper, Ashen Press, Country Towers and Temple Night. Some are free; several are marked **PRO**.

**The most useful thing on the site is not a component, it is that every template publishes its own type spec.** Kage, a
Japanese temple page, exposes these as editable props:

| Prop             | Value                                                          |
| ---------------- | -------------------------------------------------------------- |
| Heading font     | Onest                                                          |
| Body font        | **Onest** - the same family                                    |
| Heading weight   | Regular, 400                                                   |
| Body weight      | **Light, 300**                                                 |
| Heading size     | 46 px                                                          |
| Body size        | **17 px**                                                      |
| Heading tracking | **−0.012 em**                                                  |
| Primary colour   | `#e0231c`, "the vermilion accent and the ember tint it drives" |
| Font options     | Onest, Instrument Serif, Newsreader, Geist                     |
| Assets           | 14 images, 2.4 MB, plus 1.1 MB of code                         |

**And the site practises what the templates preach.** Measured off its own live DOM:

| Property   | Measured value                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| Typeface   | `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace` - **one family for the entire site** |
| Background | `rgb(5, 6, 8)` - near-black, but blue-shifted, not `#000`                                               |
| Text       | `rgb(247, 248, 248)` - off-white, not `#fff`                                                            |
| Radii      | **3 px, 4 px, 5 px, 7 px** and `50%` for round things                                                   |

## The Decision Behind It

**Kage pairs a typeface with itself and separates the roles by weight.** Heading is Onest 400, body is Onest 300. There
is no display face, no second family, no serif-plus-sans handshake. The hierarchy comes from **46 px against 17 px and
400 against 300**, which is a bigger size ratio and a smaller weight gap than the usual advice, and it reads as
deliberate rather than as two fonts that happened to be nearby.

**The negative tracking is doing real work.** At 46 px, default letter-spacing looks loose; −0.012 em closes it. The
rule generalises: **track tighter as size goes up**, and the site ships it as a prop rather than leaving it to taste.

**Four small radii instead of one big one.** This is the direct counter to AGENTS.md's tell, "one large corner radius on
every surface". 3, 4, 5 and 7 px are not a scale someone reached for by accident - they are different because the things
they are on are different sizes, and a 4 px radius on a chip and a 7 px radius on a panel keep their relative weight.
**The generated look comes from applying `border-radius: 16px` to everything.**

**Near-black that is not black, off-white that is not white.** `rgb(5,6,8)` carries a slight blue; `rgb(247,248,248)`
pulls the text off pure white. Both moves cost nothing, are invisible when described, and are the difference between a
page that looks printed and a page that looks like a default.

## What Transfers To Us

**Four measurements, directly.** These are cheap, they are not stylistic commitments, and they can go into
`docs/DESIGN.md` as-is:

1. **One family, two weights**, with role separation by weight and size rather than by a second typeface
2. **Negative tracking on display sizes**, around −0.01 em at 46 px and up
3. **A small radius scale of three or four values**, sized to the element, never one value everywhere
4. **Never `#000` and never `#fff`.** Shift both a few points off pure

**Body at 17 px is worth copying too.** Our reader is Aisyah on a phone at midnight; 16 px is the floor, and 17 px at
weight 300-400 reads better on a dense itinerary than the default.

**And their own site is the proof it works.** ThreeUI looks expensive using one monospace typeface and about five
colours. **That is a much more reproducible target than any of the shaders it sells.**

## What Does Not, And Why

**The templates themselves are a competition-rule problem, and this is the finding that matters most.** Kage's own
`Skill.md` instructs, in its Guardrails:

> Copy the complete Kage HTML file **byte-for-byte**; do not extract, rewrite, shorten, or rebrand any section. Preserve
> every embedded style, script, media payload, text string, interaction, responsive rule, and document-level lifecycle.

That is a licensed authored document, several of the family are marked **PRO**, and every renderer is "tied to its
first-party source revision". **Adapting one into our prototype is taking somebody else's finished design work into a
repo that must be public on 13 September.** AGENTS.md's rule is about prior work by the team, but the spirit here is
worse, not better: it is somebody else's work entirely. **Do not use the templates. Use the measurements.**

**The Three.js catalogue does not fit the brief.** 395 items of WebGL backgrounds, particle fields and shader heroes
answer "how do I make a portfolio hero look expensive". Our judged surfaces are an itinerary, a vote and a checklist -
dense, textual, and read on a phone. A shader behind them costs load time and gives a judge nothing to score.

**The mono-everything choice does not transfer either.** JetBrains Mono for a whole site works for a developer tool
where mono _means_ something. On a travel planner it would read as a costume, and a monospace face at 17 px across
paragraphs of Malay and English place names is harder to read, not easier.

## Checked Against The Tells

**One tell is present and it is instructive.** Kage is near-black with a single **vermilion** pop, `#e0231c`, which is
almost word-for-word AGENTS.md's second tell.

**It works there for a reason we can state: the red is motivated.** The page is a Japanese mountain-temple piece; the
vermilion is torii red, and the accent is described as driving "the ember tint", so it recurs as a system rather than as
one highlighted button. **The tell is not the colour, it is an unmotivated colour** - and that distinction is the most
useful thing this study produced. Our own accent has to be able to answer "why that one" with something about the
product, not about taste.

**Nothing else here trips the list.** The small varied radii, the single-family type and the off-pure neutrals are
active corrections to three of the eleven shapes.
