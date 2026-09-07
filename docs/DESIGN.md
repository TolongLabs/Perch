# DESIGN — Perch

**The spec, not the reading.** [`design/`](design/) is what we looked at; this file is what we are doing. A developer
implements against this. Where the two disagree, this file wins.

**Scope: the app.** Landing and auth pages are out — the product starts on a shared link and an account is optional, so
neither is in the wireframe or in the prototype submission.

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

|            | **The Desk**                                | **The Book**                                 |
| ---------- | ------------------------------------------- | -------------------------------------------- |
| **It is**  | An instrument. A tool she operates          | A plate. A document she and four others read |
| **Radius** | A scale — **3 / 5 / 8 / 12 px**, concentric | **0. Everywhere. No exceptions**             |
| **Type**   | Archivo alone                               | Archivo for labels, Newsreader for prose     |
| **Ground** | White `#FFFFFF`                             | Plate `#F5F3E9`                              |
| **Rules**  | Hairlines at 35% ink                        | Hairlines at **full ink**                    |

**This resolves a conflict in our own research rather than ignoring it.** [`design/README.md`](design/README.md) records
that all three prior studies converged on _a radius scale, not a radius_ — ThreeUI at 3/4/5/7px, libraries.dev at eight
values from 2 to 50px. That finding stands, **for product UI**. The Book is not product UI. So the scale governs The
Desk, zero governs The Book, and the boundary between them carries information instead of being a taste call.

**Concentric rule**, from [`design/studies/03-jakub-krehel-skills.md`](design/studies/03-jakub-krehel-skills.md): an
outer radius equals its inner radius plus the padding between them. A 5px control inside 3px of padding sits in an 8px
container.

---

## Colour

**Extracted from one specimen: the Blue-throated Bee-eater, _Merops viridis_.** It breeds in Peninsular Malaysia and
moves seasonally — a bird that travels, which is the only reason it is this bird and not a prettier one. Every colour
below is on the animal.

| Token       | Value                | From              | Used For                                              |
| ----------- | -------------------- | ----------------- | ----------------------------------------------------- |
| `--ink`     | `#2E261F`            | The eye-stripe    | All text, all rules. **Never `#000`**                 |
| `--ink-60`  | `#6D6762`            | —                 | Secondary text, metadata, captions                    |
| `--ink-35`  | `rgba(46,38,31,.35)` | —                 | Hairlines on The Desk                                 |
| `--paper`   | `#FFFFFF`            | —                 | The Desk ground                                       |
| `--plate`   | `#F5F3E9`            | Guide-plate stock | The Book ground                                       |
| `--decided` | `#2A5F3A`            | Wing green        | State: settled, booked, done                          |
| `--open`    | `#14676B`            | Throat turquoise  | State: awaiting a decision. Also the rank numeral     |
| `--at-risk` | `#8A4B2A`            | Crown chestnut    | State: something changed, or a critical item is unmet |

**The three states are plumage, and each carries information.** `--decided`, `--open` and `--at-risk` are the only
colours in the product that are not ink. **A colour that is not carrying a state does not appear.** There is no brand
colour splashed on a hero, because there is no hero.

**Contrast.** All three states are used as text or 1px rules on `--paper`/`--plate` and pass AA at 14px. State chips are
outlined, never filled — a filled chip needs a background colour that carries no extra information.

---

## Type

**Two families, and the second one only exists on The Book.**

| Role                   | Family     | Size / Weight                        | Notes                                                         |
| ---------------------- | ---------- | ------------------------------------ | ------------------------------------------------------------- |
| **Display**            | Archivo    | 40–56 / **100**                      | Thin. This is the field-guide rule, and it is the whole voice |
| **Plate title** (Book) | Archivo    | 32–44 / 100, −0.01em                 | Set over the image, never centred                             |
| **Prose** (Book only)  | Newsreader | 18 / 400, 1.6                        | The only serif in the product                                 |
| **Body** (Desk)        | Archivo    | 15 / 400, 1.5                        |                                                               |
| **Label**              | Archivo    | 12 / **700**, +0.06em, uppercase     | Section heads, eyebrows, state chips                          |
| **Specimen line**      | Archivo    | 12 / 400, italic                     | The metadata under a name: time, cost, distance               |
| **Numerals**           | Archivo    | `font-variant-numeric: tabular-nums` | **Everywhere.** Times, ringgit, distances, vote counts        |

**Nothing is set at 500 or 600.** The jump from 100 to 700 is the field guide's own hierarchy and it is what stops this
reading as another SaaS product. Two weights carry meaning; a middle weight would carry none.

**Why Archivo.** A grotesque with a true 100 through 900 range and a width axis, OFL-licensed. It is not Inter and it is
not Space Grotesk, which `AGENTS.md` names as the safe-default tell. **Why Newsreader.** A screen-first serif with low
stroke contrast that holds at 18px on a phone, which a display serif does not.

---

## Space, Grid And Rules

**4px base.** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64. Grouping gap is twice the internal gap, from study 03 — items 8px
apart sit in groups 16px apart, and the reader gets the structure without a divider.

**Rules do the work dividers and cards do elsewhere.** A 1px hairline in ink separates sections on The Book; on The Desk
it drops to 35%. **There are no card shadows anywhere in the product.** A plate has no drop shadow, and an instrument
does not need one to be legible.

**Margins.** 24px on a 390px phone. The Book's desktop spread runs a two-column plate: image left at 640px, text right
at 576px, 64px gutter, 80px outer margins on 1440.

**Alignment is left, always.** Centred text appears nowhere, which is `AGENTS.md`'s fifth tell and also simply wrong for
a document.

---

## Motion

**One mechanic, tied to the brand, per study 05.** When an option is displaced, **the next one steps forward** — the
perch, animated. It is used in exactly three places and nowhere else:

1. **Question 3** — the seven unpicked options settle down onto the perch, staggered 40ms apart
2. **The bench drawer** — the swapped-in option rises into the slot the old one vacated
3. **What Changed** — the same movement, replayed small, next to the sentence

**Everything else is a 120ms opacity cross-fade.** The Book's spreads cross-fade and scroll-snap; **there is no 3D page
turn**, which answers open question 3 in the resume note — a real flip fights the in-app browser, costs days, and breaks
first at demo scale.

`prefers-reduced-motion` removes the step-forward and leaves the cross-fade.

---

## Components, Briefly

**Only the ones where the rules above are not obvious.**

| Component        | Spec                                                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **State chip**   | 1px outlined in its state colour, label type, 4px radius on Desk / 0 on Book. Never filled                                  |
| **Rank numeral** | `--open`, 12/700, tabular. **Only ever on the perch**, where the number is a real rank                                      |
| **Perch drawer** | Rises from the bottom, plate ground, full-ink hairlines. Each row: rank, name, specimen line, action                        |
| **The blank**    | The Book's unfinished slot. A 1px **dashed** ink rule — the only dashed line in the product, and it means _not yet decided_ |
| **Cost delta**   | Always two units, travel then money: `20 min closer · −RM 15`. Never one without the other                                  |
| **Buttons**      | Text plus a 1px ink rule. One solid ink button per screen, maximum                                                          |

---

## Checked Against The Tells

| `AGENTS.md` Tell                         | Us                                                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Warm cream, serif display, terracotta    | Plate stock is warm, but the display face is a **thin grotesque** and chestnut appears only as an at-risk state |
| Near-black with one acid pop             | Warm printing ink, three muted plumage states, no acid                                                          |
| Purple-to-blue gradient hero             | No gradients. No hero                                                                                           |
| Inter or Space Grotesk                   | Archivo and Newsreader                                                                                          |
| Everything centre-aligned                | Left, always                                                                                                    |
| One large radius on every surface        | **A scale on one surface and zero on the other, and the difference is the mechanic**                            |
| A coloured rail down a rounded card      | No cards, no rails, no shadows                                                                                  |
| Numbered markers on non-sequences        | Numerals appear only on the perch, where they are a real rank                                                   |
| Three items because three feels balanced | Three states because the product has three states                                                               |
| Unmotivated glassmorphism                | None                                                                                                            |
| Dark dashboard, neon lines, no data      | Light, printed, and every number on screen is derived from a vote                                               |

---

## Open

- **The logo** is not drawn. Direction is settled — one solid form with lighter ones queued behind, which is the perch
  and the ranked bench in one mark. Generated with Codex, per `AGENTS.md`
- **Photography** is unresolved. The field-guide reading argues for texture and specimen detail over destination hero
  shots, which is also what the strongest Dribbble result did. Decide before the mockups are finished
- **Dark mode** is out of scope for the prototype. A field guide is printed on paper
