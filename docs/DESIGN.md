# DESIGN — Perch

**The spec, not the reading.** [`design/`](design/) is what we looked at; this file is what we are doing. A developer
implements against this. Where the two disagree, this file wins.

**Scope: the whole surface, revised 8 September.** This file previously put landing and auth pages out of scope on the
grounds that the product starts on a shared link. **Both are now in**, and the reasoning that excluded them still holds
for the product while no longer holding for the submission: a judge opens a URL, and what that URL renders is the first
thing scored under Design.

| Surface                      | Standing                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Landing**                  | **In.** One screen that folds over the footer like every other surface, so its only scroll is the footer's height. Premium and quiet |
| **Auth**                     | **In**, as a two-pane screen with no authentication behind it. Only **Sign In As Guest** does anything                               |
| **Dashboard And Onboarding** | **In.** The dashboard is re-fixtured for Tokyo with an invite code and who has voted; onboarding is new and replaces the interview   |
| **The Deck**                 | **In.** The swipe surface. Joiners land here from the invite link and skip onboarding                                                |
| **The Tally**                | **In.** Percentage per place, unanimous places in `--gold`, zero-vote places greyed and eliminated                                   |
| **The Desk**                 | **In.** Rebuilt: the 4 day × 3 slot calendar, the sidebar of voted-in cards, Apply, pins and feasibility chips                       |
| **Before We Go**             | **In.** The checklist derived from the trip; every item ticked enables Print The Book                                                |
| **The Book**                 | **In.** Re-fixtured for Tokyo, one plate per day, a Maps deep link per day. Still reached from a link, still needs no account        |

**Revised 8 September with the rebuild.** The route set follows the plan: the interview is deleted, the Deck, the Tally
and Before We Go are new, and the Desk is rebuilt around a three-slot calendar. The Book survives, re-fixtured for
Tokyo, and the footer carries on every surface, the new ones included.

**Nothing about the product's rules changed.** The account is still optional, the shared link still opens without one,
and the auth screen exists to be walked past.

---

## The Figma Files

**Two files, and they are drawn at different stages on purpose.** The wireframe settles structure before any visual
direction exists, so a structural problem and a styling problem never get argued about in the same conversation.

| File                                                                                                           | What Is In It                                                                                                        | Access                                     |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Perch - Prototype Wireframe](https://www.figma.com/design/54WzxphGf6z5qeCzOXZscK/Perch---Prototype-Wireframe) | Eight screens in greyscale, captioned per screen. Structure and behaviour, no visual direction                       | Link + password                            |
| [Perch - Visual Mockups](https://www.figma.com/design/lei5YdT1r8Dky1QjfwZGfY/Perch---Visual-Mockups)           | One page, read left to right: the Design System sheet, the Brand sheet, the desktop plate, then three mobile screens | **Private. Must be shared before 13 Sept** |

**The two sheets in the mockups file do not repeat each other.** The Design System sheet is the spec — what the palette,
the type, the controls and the two surfaces **are**. The Brand sheet is the derivation — the five marks, the size test
that eliminated four of them, and the typeface routes compared before one was picked. Spec belongs on the first; the
reasoning that produced it belongs on the second.

---

## The Direction, In One Line

> **A field guide, not a travel brochure.** The Book is a printed plate; The Desk is the instrument you hold while you
> read it — and the two are told apart by whether their corners are round.

---

## Where It Comes From

**The method is study 05's**, from [`design/studies/05-m-ndgn-y-instagram.md`](design/studies/05-m-ndgn-y-instagram.md):

> 似たデザインを作らせるのではなく、元のデザインが持つルールを見つけて、別のブランドへ翻訳する使い方です
>
> _Not making it produce a similar design, but finding the rules the original design has, and translating them to a
> different brand._

**The source object is a bird field guide.** It is not decoration and it is not a pun on the name. A field-guide plate
does the exact thing our product does: it shows several specimens together, ordered, precisely labelled, so you can tell
which one you are looking at. **That is the bench.**

**Measured from the source, 2026-09-07**, probing Cornell Lab's guide (`allaboutbirds.org`) across 1,500 elements:

| What                | Measured                                               | What It Means                                        |
| ------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| **Border radius**   | **Zero. Not one rounded corner in 1,500 elements**     | A printed plate has no rounded corners               |
| **Rules**           | `1px rgb(46,38,31)` ×12 — the **ink** colour, not grey | A printed rule is struck in the same ink as the type |
| **Ink**             | `rgb(46,38,31)`                                        | Warm printing black. Never `#000`                    |
| **Display weight**  | H1 48px **w100**, H2 36px w100 at −0.01em              | The display face is _thin_                           |
| **Label weight**    | H3 20.8px **w700**, small type at **w900**             | Labels are heavy. **Nothing sits at 500 or 600**     |
| **Specimen colour** | `rgb(179,27,27)`, `rgb(41,98,57)`, `rgb(255,188,16)`   | Colour arrives from the specimen, sparingly          |

---

## What It Is Not, And Why

**Two live registers were looked at and both rejected**, which is what gives this direction its edges.

**Awwwards, travel category.** Uniformly aspirational-luxury: a giant display serif, a full-bleed hero photograph,
"TRAVEL REDEFINED". It is `AGENTS.md`'s first tell almost verbatim, and worse, it is aimed at a traveller our user
explicitly is not — the persona's own objection is that trip products _"assume you're splitting a villa in Bali, not a
RM180 room in Penang."_ Copying the category's award winners would work against Target Group Alignment.

**Dribbble, travel itinerary app.** Equally uniform and closer to home: destination photography behind glassy cards,
large radii on every surface, gradient overlays, a dark variant with neon. Four separate tells at once. **The single
most-viewed result was the exception** — texture photography rather than destination hero shots, plain white schedule
cards, small type — which is the one signal in the whole search worth keeping.

**The gap both leave open is the same one.** Nobody in the category treats an itinerary as **a document**. That is the
position, and it is unoccupied.

---

## The One Mechanic

**Radius is not a style value here. It is what tells you which surface you are on.**

|                 | **The Desk**                                                                                                                                                                                        | **The Book**                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **It is**       | An instrument. A tool she operates                                                                                                                                                                  | A plate. A document she and four others read  |
| **Radius**      | **24 or 999. Nothing between them** - a committed extreme reads as designed, a middling corner reads as a default                                                                                   | Zero. A printed plate has no rounded corners  |
| **Type**        | Quicksand alone                                                                                                                                                                                     | Quicksand for labels, Newsreader for prose    |
| **Ground**      | Paper `#FBF8F2`                                                                                                                                                                                     | Plate `#F2EDE0`                               |
| **Colour**      | The day's tint on chips and numerals                                                                                                                                                                | The day's tint on the band, eyebrow and plate |
| **Feasibility** | A state chip on the day heading: `--decided` when the day fits, `--gold` when it fits but runs more than 25 percent slower than the scheduler's order, `--at-risk` on overrun or out-of-hours stops | None. The plate prints the settled trip       |

**Revised 8 September for the rebuild.** The feasibility row is new, and it is a state chip on each day heading in the
chip spec below, not a new token family: green when every stop fits its hours and the day's travel plus dwell fits 09:00
to 21:00, gold when it fits but the order runs more than 25 percent slower than the scheduler's, red when a stop is
outside its hours or the day overruns.

**Revised 2026-09-07 after review.** The first pass ran The Desk at 3/5/8px and read as rigid. The contrast is stronger,
not weaker, when The Desk is genuinely soft — so it moved to the squircle register and the difference between the two
surfaces became more legible, not less.

**This resolves a conflict in our own research rather than ignoring it.** [`design/README.md`](design/README.md) records
that all three prior studies converged on _a radius scale, not a radius_ — ThreeUI at 3/4/5/7px, libraries.dev at eight
values from 2 to 50px. That finding stands, **for product UI**. The Book is not product UI. So the scale governs The
Desk, plate geometry governs The Book, and the boundary between them carries information instead of being a taste call.

**Concentric rule**, from [`design/studies/03-jakub-krehel-skills.md`](design/studies/03-jakub-krehel-skills.md): an
outer radius equals its inner radius plus the padding between them. A 14px control inside 10px of padding sits in a 24px
container.

## Colour

**The palette is a specimen set, not a mood board.** Every colour is on a bird that lives in or migrates through
Peninsular Malaysia, and each is named with its binomial so the source is checkable rather than asserted.

> **Revised 2026-09-07 after review.** The first pass took the field guide's _paper_ — ink, hairlines, plate stock — and
> left the specimens grey. That is why it read as bland: a plate with no plate on it. **In a real field guide the birds
> are the saturated part**, so the palette expanded from three states to ten species and colour moved from 1px chip
> outlines to tints, bands and illustration.

| Token       | Value     | Specimen                                     | Used For                                                          |
| ----------- | --------- | -------------------------------------------- | ----------------------------------------------------------------- |
| `--ink`     | `#2E261F` | Magpie-Robin, _Copsychus saularis_           | All text and rules. **Never `#000`**                              |
| `--paper`   | `#FBF8F2` | —                                            | The Desk ground                                                   |
| `--plate`   | `#F2EDE0` | Zebra Dove, _Geopelia striata_               | The Book ground, card fills                                       |
| `--open`    | `#0B777E` | Bee-eater, _Merops viridis_                  | Awaiting a decision. Rank numerals, focus rings                   |
| `--decided` | `#3E7A3A` | Green Broadbill, _Calyptomena viridis_       | Settled, booked, done                                             |
| `--at-risk` | `#C0342F` | Crimson Sunbird, _Aethopyga siparaja_        | Something changed, or a critical gap                              |
| `--gold`    | `#E8A317` | Black-naped Oriole, _Oriolus chinensis_      | Unanimous places on The Tally; a Desk day that fits but runs slow |
| `--day-1`   | `#C2622F` | Kingfisher, _Actenoides concretus_           | Day tint                                                          |
| `--day-2`   | `#2A4C9B` | Fairy-bluebird, _Irena puella_               | Day tint                                                          |
| `--day-3`   | `#E0A32C` | Yellow-vented Bulbul, _Pycnonotus goiavier_  | Day tint                                                          |
| `--day-4`   | `#6E4A8E` | Violet Cuckoo, _Chrysococcyx xanthorhynchus_ | Day tint                                                          |
| `--day-5`   | `#B0567E` | Pink-necked Green Pigeon, _Treron vernans_   | Day tint                                                          |

**Revised 8 September with the rebuild.** `--gold` joins the state colours as the fourth, because the rebuild gave both
of its uses a screen: the Tally marks a unanimous place with it, and the Desk shows it on a day that fits but runs slow.
It is Black-naped Oriole, _Oriolus chinensis_, on the same rule as the rest - a species that occurs in Peninsular
Malaysia, so the source stays checkable.

**There are five day tints because a day tint that repeats is not a wayfinding device.** The first pass named three,
which meant day 4 borrowed day 1's bird and the reader lost the one thing the colour was there to tell them. The two
added on 7 September were picked for hue regions nothing else occupies: **violet, which no state colour uses, and a
mauve-pink far enough from `--at-risk` that neither is mistaken for the other.** Both species occur in Peninsular
Malaysia, on the same rule as the rest.

**Each day of a trip is assigned a bird, and that bird tints the day.** The band at the top of the plate, the eyebrow,
the rank numerals and the day's chips all carry it. **So colour tells you which day you are on** — it is a wayfinding
device, not decoration, which is what `AGENTS.md` requires of any device on screen.

**Revised 8 September, the day grounds mix at 26 percent.** Each day column's ground is its bird mixed toward `--paper`
in OKLab. At the original 9 percent the columns were too close to tell apart, which defeats the one thing the colour is
for: measured with CIEDE2000, adjacent days sat at ΔE 2.4 to 3.7 in light and about the same in dark, the blue and the
violet both greying toward the paper. At 26 percent every pair among days 1 to 4 clears ΔE 8.6 in light and 8.7 in dark,
with ink on any ground above 9:1. The known limit is day 4 against day 5, the Violet Cuckoo and the Pink-necked Green
Pigeon, which are hue-adjacent and reach only 7.4 light and 6.7 dark; a per-day mix could push them past 8 but would
make the columns read as ranked by weight, so the uniform mix was kept. The empty slot's dashed boundary is drawn in 62
percent ink so it clears 3:1 against these deeper tints.

**`--gold` and `--day-3` share a hue region, and that is survivable only because they do not answer the same question.**
The day tint is a ground; the gold chip is a 10% tint with a 1px rule and a plumage dot, never a solid fill of either.
Where a day 3 heading runs the slow-day chip, form carries the distinction that hue cannot.

**Every colour has a five-step ramp toward the plate stock**, used for tinted fills, and `--gold` joins on exactly the
rule the other palette entries follow: five steps mixed toward `#F2EDE0`, the 10% step being what the unanimous and
slow-day chips fill with. State chips are a 10% tint, a 1px rule in the full colour, and a plumage dot - not a solid
fill, which would carry no extra information.

**Contrast.** Body text hits ≥4.5:1 against its ground and large text ≥3:1, per the `impeccable` rule that muted grey on
tinted near-white is the single most common failure. Where open, decided or at-risk carries text it is used at full
strength on paper, never as grey-on-tint.

**Gold cannot carry text on a light ground at any tint.** Black-naped Oriole `#E8A317` measures about 1.9:1 on paper, a
hue limit no ground fixes. So a gold chip keeps its 1px rule and plumage dot at full gold, which is what reads as gold,
and sets its label in `color-mix(in srgb, var(--state) 34%, var(--ink))`, which measures 6.9:1. Found on The Tally.

**A state colour set as text on its own 10 percent tint fails contrast every time**, three for three in the build: the
onboarding legend at 4.4:1, Who Has Voted at 4.3:1, the gold chip at 1.9:1. Text on a tint is always ink-weighted.

**Revised 8 September, `--open` darkened from `#1B7F86` to `#0B777E`.** The original measured 4.48:1 on paper, missing
AA by 0.02, and 4.32:1 on the plate, and it carries every rank numeral and every focus ring. The darker value keeps the
hue and measures 5.01:1 on paper and 4.54:1 on the plate. Found while deriving the dark palette below.

### Dark

**Added 8 September for the topbar's theme switcher, intake 1 of the release cycle.** The Open section used to rule dark
mode out because a field guide is printed on paper. The theme switcher is a team request, so the palette now has a dark
face, and the mark's dark file finally has a surface to sit on.

**Same token names, second set of values behind `[data-theme="dark"]`.** Every value was lifted in OKLab so the hue is
preserved and only perceptual lightness moves, and each was targeted at the plate rather than the ground, because the
plate is the stricter surface and chips sit on it. The ground is a warm near-black in the brand's own hue direction,
never `#000`.

| Token         | Light     | Dark      | On Paper | On Plate |
| ------------- | --------- | --------- | -------- | -------- |
| `--paper`     | `#FBF8F2` | `#1B1714` | ground   | —        |
| `--plate`     | `#F2EDE0` | `#26201B` | 1.11:1   | ground   |
| `--ink`       | `#2E261F` | `#F4EFE6` | 15.55:1  | 14.05:1  |
| `--ink-muted` | `#6A5F53` | `#918679` | 4.99:1   | 4.51:1   |
| `--open`      | `#0B777E` | `#38949B` | 4.98:1   | 4.50:1   |
| `--decided`   | `#3E7A3A` | `#599654` | 5.02:1   | 4.53:1   |
| `--at-risk`   | `#C0342F` | `#E6584F` | 4.98:1   | 4.50:1   |
| `--gold`      | `#E8A317` | `#E8A318` | 8.21:1   | 7.42:1   |
| `--day-1`     | `#C2622F` | `#CE6D3A` | 4.98:1   | 4.50:1   |
| `--day-2`     | `#2A4C9B` | `#5F86DA` | 5.01:1   | 4.53:1   |
| `--day-3`     | `#E0A32C` | `#E0A32C` | 8.01:1   | 7.24:1   |
| `--day-4`     | `#6E4A8E` | `#9D78BF` | 4.98:1   | 4.50:1   |
| `--day-5`     | `#B0567E` | `#C66A92` | 4.98:1   | 4.50:1   |

The plate-to-paper step is 1.11:1 in dark against 1.10:1 in light, so the two grounds keep the same distance from each
other. `--gold` and `--day-3` need no lift at all: a saturated yellow that is nearly illegible on paper is naturally
strong on ink.

**The gold limitation above is a light-mode limitation only.** Running the chip rule unchanged, a 10 percent state tint
with the label at `color-mix(in oklab, var(--state) 34%, var(--ink))`, every chip clears AAA in dark, and the gold chip
goes from 1.92:1 to 10.99:1. The formula does not change; it works better against ink.

| Chip    | Dark Tint | Dark Label | Ratio   |
| ------- | --------- | ---------- | ------- |
| Open    | `#202220` | `#B8D0CC`  | 9.86:1  |
| Decided | `#22221A` | `#BFD1B3`  | 9.90:1  |
| At risk | `#2D1E1A` | `#F5BEB2`  | 9.82:1  |
| Gold    | `#2C2319` | `#F1D6AD`  | 10.99:1 |

**Outlines stay 3px solid ink in dark.** At 15.55:1 that is a hard keyline around a floating island, and `--ink-muted`
was considered for a softer edge. The rule holds because the scrim already separates an expanded island from the desk,
and a second outline recipe would be a device carrying no information.

## The Mark

**The Seal.** 判子 _hanko_ is what you press on a document once the thing is settled, which is exactly what a Book is.
The mark is the bar and the ranked bench reversed out of a solid rounded square: one form ahead and largest, two
receding behind it. Same sentence as the product, pressed rather than drawn.

| Property        | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Geometry**    | 168 unit square, corner radius 28. Bar at y 92, 104×5, r 2.5. Discs r 16, 12, 9 on a descending line                                                                                                                                                                                                                                                                                                                                                    |
| **Light theme** | `v2/public/assets/mark.svg` — ink plate `#2E261F`, the drawing reversed out in paper `#FBF8F2`                                                                                                                                                                                                                                                                                                                                                          |
| **Dark theme**  | `v2/public/assets/mark-dark.svg` — the plate inverts, the drawing does not. One geometry, two files                                                                                                                                                                                                                                                                                                                                                     |
| **Colour**      | Two values, never three. The lead disc takes no tint: its size already ranks it                                                                                                                                                                                                                                                                                                                                                                         |
| **Floor**       | 16px. Below that the third disc is dropped rather than the whole mark scaled down                                                                                                                                                                                                                                                                                                                                                                       |
| **Favicon**     | `v2/public/favicon.svg`, which swaps plate and drawing on `prefers-color-scheme` so the tab reads on either browser chrome. `favicon-32.png` / `favicon-16.png` are the raster fallback, `apple-touch-icon.png` sets the mark on paper with margin because iOS applies its own mask                                                                                                                                                                     |
| **Social card** | `v2/public/assets/og-banner.png`, 1200×630. Lockup top left on empty paper; the rest is a topographic contour set around one summit off the bottom right corner, masked by a diagonal fade so it thins to nothing before it reaches the lockup. The meta tag carries a `?v=` suffix that **must be bumped whenever the art changes**, because a scraper caches its preview against the exact image URL and will not re-fetch a path it has already seen |

**Why This One, Out Of Five.** Five marks were drawn against the same sentence, each taking one principle: 家紋 _kamon_
the crest, 間 _ma_ the empty seat, 円相 _ensō_ the open ring, 判子 _hanko_ the seal, and メリハリ _merihari_ the
half-step. Each was then re-rendered at 48, 24 and 16px on paper and reversed on an ink plate. **The Seal is the only
one that survives both the 16px column and the ink plate** — every mark carrying a hairline ring loses the ring in each.
The comparison sheet is the `Brand — Logo And Typeface` frame in the
[Visual Mockups file](https://www.figma.com/design/lei5YdT1r8Dky1QjfwZGfY/Perch---Visual-Mockups).

**The social card does not repeat the mark.** An early version tiled the bar and discs across it, which made the card
state the same shape twice while saying nothing about what the product is for. Contours read as map, terrain and route
at a glance, and they are the field-guide direction made literal rather than decoration borrowed to fill space.

**None of the five is a bird, a torii or a kanji radical**, which are the three ways this brief goes wrong. Japanese
design supplies the method here and not the motifs, which is the translation rule study 07 sets out.

---

## Type

**Two families. The serif carries prose on The Book and every italic in the product, and nothing else.**

| Role                   | Family     | Size / Weight                        | Notes                                                                                                                                                           |
| ---------------------- | ---------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Display**            | Quicksand  | 40–56 / **300**, **+0.01em**         | Light, and tracked **positive** — study 07 found +0.05em on Japanese display type, the reverse of the Western reflex                                            |
| **Plate title** (Book) | Quicksand  | 32–44 / 300, **+0.01em**             | Set over the image, never centred                                                                                                                               |
| **Prose** (Book only)  | Newsreader | 18 / 400, 1.6                        | The only serif in the product                                                                                                                                   |
| **Body** (Desk)        | Quicksand  | 15 / 400, 1.5                        |                                                                                                                                                                 |
| **Label**              | Quicksand  | 12 / **700**, +0.06em, uppercase     | Section heads, eyebrows, state chips                                                                                                                            |
| **Specimen line**      | Newsreader | 13 / 400, italic                     | The metadata under a name: time, cost, distance. **Quicksand ships no italic**, and a field guide sets the binomial in italic serif regardless of its body face |
| **Numerals**           | Quicksand  | `font-variant-numeric: tabular-nums` | **Everywhere.** Times, ringgit, distances, vote counts                                                                                                          |

**Nothing is set at 400 except body and prose, and nothing at all at 500 or 600.** The jump from 300 to 700 is the field
guide's own hierarchy and it is what stops this reading as another SaaS product. Two weights carry meaning; a middle
weight would carry none.

**Why Quicksand.** A rounded near-geometric sans with soft terminals, effectively no stroke contrast, and a 300–700
variable axis, OFL-licensed. It is not Inter and it is not Space Grotesk, which `AGENTS.md` names as the safe-default
tell. **Why Newsreader.** A screen-first serif with low stroke contrast that holds at 18px on a phone, which a display
serif does not; it was picked on measurement and the change of sans did not disturb it.

**What The Change Cost, Stated Rather Than Hidden.** Quicksand has no weight below 300, so the display jump is 300 → 700
where the previous pairing ran 100 → 700. The hero is measurably less airy. The two-weight contrast, which is the part
that carries meaning, survives intact. **Neither face is Japanese**, and that is deliberate: study 07 is explicit that
setting Latin in a face drawn for Japanese text is the exact cargo-culting it exists to correct. The method travels, the
font file does not.

---

## Space, Grid And Rules

**4px base.** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64. Grouping gap is twice the internal gap, from study 03 — items 8px
apart sit in groups 16px apart, and the reader gets the structure without a divider.

**Sections are separated by the ground under them, never by a line.** Each section sits on its own tint — a specimen hue
mixed 90–93% toward the paper, so the shift is felt rather than seen. **There are no horizontal dividers anywhere in the
product, and no card shadows.** Study 07 measured this on Japan Past & Present, which grounds five sections in five
near-whites and draws no rule between any of them.

**Outlines are 3px, not hairlines.** The same study found 3px borders and 139 pills with no other radius; our 1px rules
were the thing reading as thin.

**Margins.** 24px on a 390px phone. The Book's desktop spread runs a two-column plate: image left at 640px, text right
at 576px, 64px gutter, 80px outer margins on 1440.

**Alignment is left, always.** Centred text appears nowhere, which is `AGENTS.md`'s fifth tell and also simply wrong for
a document.

---

## Motion

**One mechanic, tied to the brand, per study 05.** When an option is displaced, **the next one steps forward** — the
perch, animated. The perch keeps its three places, and the calendar drag joins it as the fourth sanctioned motion.

**Revised 8 September with the rebuild.** The perch's homes moved with the flow that carries them: the interview's third
question and the What Changed replay are gone with the surfaces deleted, and the same displacement now plays on the
Deck, in the perch drawer and on the Tally. The mechanic itself is untouched.

1. **The Deck** - a swiped card leaves and the next reel steps forward onto the perch
2. **The perch drawer** - the next-ranked voted-in card rises into the slot the deleted one vacated
3. **The Tally** - a place that falls to zero leaves the running order and the rows below step up
4. **The calendar drag, on Apply** - a card flies into its slot, staggered 40ms, on the same easing as the perch

**Everything else is a 120ms opacity cross-fade.** The Book's spreads cross-fade and scroll-snap; **there is no 3D page
turn**, which answers open question 3 in the resume note — a real flip fights the in-app browser, costs days, and breaks
first at demo scale.

`prefers-reduced-motion` removes the step-forward and the calendar drag, and leaves the cross-fade.

**One exception, added 8 September with the islands.** The sidebar island's expand and collapse on hover, and the topbar
island's dropovers, animate regardless of the operating system's reduced-motion setting. The team asked for this in
intake 1 of the release cycle, because the demo is recorded on a machine with reduced motion on and a chrome that snaps
open reads as broken on camera. It is the only motion in the product that ignores the preference, and it is chrome, not
content: the perch, the drag and the cross-fade still honour it.

---

## The Islands

**Added 8 September with #120, refined 9 September with #180.** The rail on the left, the cluster top right and the
account dropover are the one thing in the product that floats over scrolling content, so they are the one surface where
depth is earned. Everything here is scoped to `.island` and its scrim; cards, plates and buttons in the page keep their
3px outlines and stay shadowless.

| Property | Value                                                                                  | Why                                                                         |
| -------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Border   | 1px hairline, ink at 12 percent in light, paper at 10 percent in dark                  | The 3px outline is the seal's device for content, and chrome is not content |
| Ground   | `--paper` at 78 percent behind `blur(20px) saturate(150%)`, prefixed declaration first | Content shows through, so the island reads as hovering, not pasted on       |
| Shadow   | `0 1px 2px` ink 4 percent and `0 10px 24px` ink 12 percent; paper-tinted in dark       | The only shadow in the product                                              |
| Scrim    | Ink at 22 percent in light, 16 in dark, plus `blur(8px)` on the scrim itself           | The page recedes as the rail expands, rather than competing with it         |
| Rows     | 44px, the Perch mark as the rail's head, inner rows stay pills                         | The system has two radii and a third would carry nothing                    |
| Outline  | Full ink in dark, never muted                                                          | The scrim already separates an expanded island                              |

**Measured on #180, 46 text samples over the Desk's day tints and a playing reel in both themes:** worst text 4.98:1,
the unread count in dark at rest; worst icon 3.73:1. Two rules fell out of the measurements. **`--ink-muted` is not used
on island text**, because with the panel open over a bright reel the ground composites to about `#484543` in dark and
muted ink reads 2.71:1 there; the type role already says secondary. **The cluster stays above the scrim**, because an
island blurred behind another island's blur reads as a rendering fault. The scrim transitions its background rather than
its opacity, since group opacity would fade the blur with it. Two fallbacks ship: `@supports not` for a browser without
`backdrop-filter`, and `prefers-reduced-transparency: reduce`, which returns an opaque paper ground.

## Components, Briefly

**Only the ones where the rules above are not obvious.**

| Component        | Spec                                                                                                                                                                                                                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **State chip**   | A 10% tint, a 1px rule in the state colour, a plumage dot, pill radius. Never a solid fill                                                                                                                                                                                                            |
| **Rank numeral** | `--open`, 12/700, tabular. **Only ever on the perch**, where the number is a real rank                                                                                                                                                                                                                |
| **Perch drawer** | Rises from the bottom, pill rows on a tinted ground, 3px outlines. Each row: rank, name, specimen line, action                                                                                                                                                                                        |
| **Reel card**    | 9:16, radius 24, muted autoplay loop. Name and specimen line small in the bottom-left; creator handle and platform in the bottom-right. The video mounts only on the top two cards; the rest hold their poster frame. The MP4 comes from a public GCS bucket and is the prototype's only network call |
| **Buttons**      | Pill by default, generous padding. One solid button per screen, maximum                                                                                                                                                                                                                               |
| **Info tooltip** | The only home for a card's caption. A 16px circled `i` in `--ink-muted`, **beside the heading, never under it**                                                                                                                                                                                       |
| **Footer**       | A drawer the page folds over. Fixed behind at `z-index: 0`; the page column is opaque and reserves its height                                                                                                                                                                                         |

**Revised 8 September with the rebuild.** The reel card is new, and it is the one component that carries moving
photography. It keeps the Desk register - radius 24, no shadow - and the credit stays on the card because a field guide
labels its plate with the collector.

### Captions Live In A Tooltip, Not Under The Heading

**Revised 8 September after review.** Explanatory captions were being set as a second line of italic prose under every
heading, and on a screen with four cards that is four paragraphs of chrome competing with the data.

| Where                    | Rule                                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **The hero**             | **No caption at all.** The display line carries it, or it is not worth saying                               |
| **Every other card**     | The caption moves **into an info tooltip beside the heading or subheading**, revealed on hover and on focus |
| **What may stay inline** | Data, state and specimen lines. **A specimen line is not a caption** — it is the record for that row        |

**The tooltip is a real affordance, not a decoration**, so it follows the same rules as everything else here: pill
radius, a 3px outline in `--ink`, the tinted ground of the section it sits in, and body type at 15px. It opens on hover
and on keyboard focus, and it is reachable by tab, because a caption only a mouse can read is a caption half the readers
never get.

**If a caption cannot survive being hidden, it is not a caption.** It is either a label, which belongs on the element,
or it is a limitation, which belongs where a reader cannot miss it.

### Nothing Native Is Left Styled By The Browser

**Every control is drawn by us.** Scrollbars, dropdowns, checkboxes, radios, range inputs, text fields, the focus ring
and the text selection all get the tokens above, because a default select on a field-guide plate is the one element that
says nobody looked at this screen.

**Three exceptions, and they are deliberate.** The native control stays when replacing it would remove behaviour we
cannot rebuild honestly:

1. **The text caret**, which is the operating system's and is better than any imitation of it
2. **Autofill**, where fighting the browser produces an unreadable field on someone else's machine
3. **`prefers-reduced-motion`**, which is the platform telling us something and is obeyed rather than restyled

---

## Checked Against The Tells

**Rechecked 8 September against the rebuilt screens**, row by row.

| `AGENTS.md` Tell                          | Us                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Warm cream, serif display, terracotta     | Plate stock is warm, but the display face is a **thin grotesque** and every hue is sourced to a named species                                                                                                                                                                                                 |
| Near-black with one acid pop              | Warm printing ink and nine plumage hues, none of them acid                                                                                                                                                                                                                                                    |
| Purple-to-blue gradient hero              | No gradients. No hero                                                                                                                                                                                                                                                                                         |
| Inter or Space Grotesk                    | Quicksand and Newsreader                                                                                                                                                                                                                                                                                      |
| Geometric-rounded as the friendly default | **The nearest tell to us, and closer since the rebuild: pills throughout, the `--gold` chip and the reel card at radius 24.** Held off it by a square seal rather than a rounded pill, a paper ground rather than white, left alignment throughout, and by the radius mechanic itself, 24 or 999 against zero |
| Everything centre-aligned                 | Left, always                                                                                                                                                                                                                                                                                                  |
| One large radius on every surface         | **24 or 999 on The Desk and plate geometry on The Book, and the difference is the mechanic.** Study 07: a committed extreme reads as designed                                                                                                                                                                 |
| A coloured rail down a rounded card       | Cards are used only where they are the best affordance, never nested, and never railed or shadowed                                                                                                                                                                                                            |
| Numbered markers on non-sequences         | Numerals appear only on the perch and on the day numerals of a four-day calendar, both real sequences                                                                                                                                                                                                         |
| Three items because three feels balanced  | Four states because the product has four; nine chromatic palette entries because there are nine                                                                                                                                                                                                               |
| Unmotivated glassmorphism                 | The islands only, the one surface that floats over content, see The Islands                                                                                                                                                                                                                                   |
| Dark dashboard, neon lines, no data       | Light, printed, and every number on screen is derived from a vote                                                                                                                                                                                                                                             |

---

## Open

- **The specimen illustration is unresolved and is the next thing to make.** The plates are flat-vector landscapes built
  in Figma, which works. The bird itself does not survive being assembled from primitives and goes to Codex, per
  `AGENTS.md`. Photography stays out of the plates, and the reel does not change that - the reel is a field recording on
  the card, not a hero shot on the plate. The field-guide reading still argues for drawn specimens, which is also what
  the strongest Dribbble result did
- **Dark mode was out of scope until 8 September**, when the theme switcher came in through intake 1 of the release
  cycle. The palette is in the Dark section above. What remains open is the plates: the specimen illustrations were
  drawn for paper and have not been checked against ink
