# 07 - Japanese Web, Four Sites Read Directly

|              |                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| **Source**   | [Awwwards Japan](https://www.awwwards.com/websites/japan/), then four winners opened live            |
| **Read**     | 2026-09-07                                                                                           |
| **Kind**     | Four production sites, probed in the browser for computed values                                     |
| **Why this** | The direction in `DESIGN.md` read as bland, rigid and sharp. This was opened to find what fixes that |

> **This study exists because the first pass was not a study.** An earlier turn claimed a "dense colour-blocked modular
> grid" pattern from these sites and cited them in `DESIGN.md`'s lineage. **That claim came from reading 350x220 px
> thumbnails on the listing page. No site had been opened.** Two of the specific attributions turned out to be wrong.
> The corrections are in [What The Thumbnails Got Wrong](#what-the-thumbnails-got-wrong).

## What Was Actually Read

| Site                                                                     | Studio            | State                                                                                     |
| ------------------------------------------------------------------------ | ----------------- | ----------------------------------------------------------------------------------------- |
| [おうちフェスタとうほく](https://www.driveplaza.com/special/ouchifesta/) | HAKUHODO I-STUDIO | **Read directly**, probed across 2,500 elements                                           |
| [Japan Past & Present](https://www.japanpastandpresent.org/)             | Herrmann Germann  | **Read directly**, probed across 2,500 elements                                           |
| [Kempa Japan](https://kempa-sports.jp/)                                  | chaitiandianzhi   | **Read directly**, probed, and scrolled to the grid section                               |
| [Hello Tea Japan](https://helloteajp.com/)                               | Coding creed      | **Opened, unusable.** Its CSS did not load; the page rendered unstyled in Times New Roman |
| [Culture Gate To Japan](https://culture-gate.jp/)                        | CINRA, inc.       | **Not opened.** The domain is blocked by this machine's browser permissions               |

**Two of the six are honestly unread**, and they stay marked that way rather than being described from their thumbnails
a second time.

## What It Actually Does

### Japan Past & Present - The Measurements That Matter

The most useful of the four, because it is an information-dense reference site rather than a campaign.

| Measured                        |   Count | What It Means                                                                                  |
| ------------------------------- | ------: | ---------------------------------------------------------------------------------------------- |
| `border-radius: 9999px`         | **139** | **The pill is the default shape**, not an accent. Not one 8px corner                           |
| `border-radius: 50%`            |       8 | Circles for the remainder                                                                      |
| `3px solid rgb(0,0,0)`          |       2 | Borders are **heavy**, not hairlines                                                           |
| Headings at **w900**, 25.3px    |       — | A custom heavy face, `JPP-AddChars-Heavy`                                                      |
| Body in `Noto Serif JP`         |     633 | Serif for reading, heavy sans for structure                                                    |
| Ground `#FFFFFF`, ink `#000000` |       — | No warm neutrals at all                                                                        |
| **Five pale desaturated tints** |    1 ea | `rgb(230,223,223)` `rgb(225,223,230)` `rgb(217,227,224)` `rgb(231,230,240)` `rgb(214,212,222)` |

**Those five tints are the finding.** Each is a near-white with a different hue pushed about 4% off grey, and each
grounds a different section. **The page separates its sections by changing the colour under them, not by drawing a line
between them.**

### Kempa - Tracking Runs Positive

| Measured      | Value                                                  |
| ------------- | ------------------------------------------------------ |
| Border radius | **Zero across the page**                               |
| H1            | 48px **w500**, letter-spacing **+2.4px (+0.05em)**     |
| H2            | 28px w500, +1.68px (+0.06em)                           |
| Japanese face | 游ゴシック体 (Yu Gothic), 326 uses                     |
| Chrome        | Black and white. **All colour arrives in photographs** |

**Positive tracking on display type is the opposite of the Western convention** and of our own spec, which currently
sets the display face at −0.03em. Latin set beside Japanese is given air rather than tightened.

### おうちフェスタとうほく - Cards As Physical Objects

Almost entirely drawn rather than styled, so it yields few CSS values: `Noto Sans JP` (454 uses), `4px solid black`
borders, `3px` SVG strokes with butt caps, and only two border radii in the whole document.

**What it does instead is the point.** It is a **pannable illustrated festival ground** - you drag around a world of
flat-vector stalls, cars, trees and people, and the content lives on **signboards** you click. Those signboards are
rounded cards with **a speech-bubble tail and a rivet in each corner**, because a real festival signboard has bolts in
it. The palette is six saturated flats - green, yellow, red, blue, pink, cream - and the illustration is built from a
small set of units tiled as texture.

## The Decision Behind It

**All three arrive at legibility by weight and ground rather than by rules.** None of them separates content with the
hairline dividers our own first pass leaned on. Japan Past & Present changes the background tint; Kempa changes to full-
bleed photography; the Tohoku site changes the illustrated terrain you are standing on.

**And two of the three take a shape to an extreme rather than a middle.** 139 pills and no other radius. Zero radius and
no exception. **A committed extreme reads as designed; a 3px corner reads as a default**, which is exactly the note
`DESIGN.md` v1 earned.

## What Transfers To Us

| Finding                                             | Where It Lands                                                                                       |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Pale tinted section grounds instead of dividers** | The design system sheet and The Desk. Five hues at ~4% saturation, one per section                   |
| **Pill as the default, not the accent**             | Every control, chip and container on The Desk. Stop at nothing between 24 and 999                    |
| **Heavy borders, 3-4px, not hairlines**             | Card and chip outlines. Our 1px rules are the thing reading as thin                                  |
| **Positive tracking on display type**               | Reverse the display face from −0.03em toward 0 or slightly positive                                  |
| **Cards that are physical objects**                 | The perch drawer and the blank. A signboard has rivets; our blank could carry its own physical logic |
| **Colour from illustration, chrome stays neutral**  | Confirms the plate direction: illustrate the day, keep The Desk quiet                                |

**The single most actionable is the first.** Our sheet still separates sections with a kicker floating on one flat
ground. Five pale tints, one per section, removes every remaining divider and is the direct answer to the standing
feedback.

## What Does Not, And Why

**The pannable illustrated world does not transfer, and it is the most tempting thing here.** It is a campaign microsite
for a toll-road operator with one job and no return visit. Aisyah opens Perch at 11pm to find out what still needs her;
making her drag around a map to find it would be hostile. **We can take the signboard's construction and none of its
navigation.**

**Kempa's zero radius does not transfer either**, and it is worth saying why given we cite it approvingly. Its content
is product photography of hard goods; ours is a plan four tired people read on a phone. The extremity transfers; the
direction does not.

**Japan Past & Present's pure `#000` on `#FFFFFF` does not transfer.** `DESIGN.md` uses a warm printing ink extracted
from the field guide, and that decision predates this study and survives it.

**And the Noto/Yu Gothic stack is not ours to borrow.** Those faces are carrying Japanese text. Setting Latin in them
because a Japanese site did would be the exact cargo-culting this study exists to correct.

## Checked Against The Tells

**Nothing here is one of the listed tells, and one finding is the inverse of one.** `AGENTS.md` names "one large corner
radius on every surface" as a tell. Japan Past & Present has 139 pills and nothing else, which looks like that tell and
is not, **because the radius is doing a job**: it is the shape of an interactive object throughout, and the page never
mixes it with a competing radius to signal something else. The tell is a single radius applied without a reason, not a
single radius applied for one.

**The pale tinted grounds need watching.** Five near-white tints is one step from "warm cream ground", the first tell on
the list. Ours are safe only while each tint is tied to a named section and none of them is the page's default.

## What The Thumbnails Got Wrong

Recorded because being wrong in public and correcting it is the evidence, and because this is the third time this week a
summary produced a different answer than the source.

| Claimed From A Thumbnail                                                    | What The Site Actually Is                                                         |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| おうちフェスタとうほく is "a packed grid of differently-sized colour tiles" | **A pannable illustrated festival ground.** The grid was a screenshot of a canvas |
| Kempa is an "asymmetric modular photo grid"                                 | **A collage image inside a single card thumbnail.** Zero CSS grids on the page    |
| Herrmann Germann does "editorial density with cards rather than rules"      | Closer to true, but arrived at by tinted grounds and pills, not cards             |
| mount inc. does "near-empty compositions, hard section modulation"          | **Never opened.** Pure invention                                                  |

**The bento grid in the design system sheet was not sourced from these sites.** It came from the reference image the
team supplied. It is a sound layout and it stays, but its lineage is now recorded correctly.
