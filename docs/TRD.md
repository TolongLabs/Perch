# TRD — Perch

**How.** Architecture, contracts, data models and the rationale behind them. [`PRODUCT.md`](PRODUCT.md) owns who and
why, [`PRD.md`](PRD.md) owns scope, [`DESIGN.md`](DESIGN.md) owns the look. This file is canonical over `AGENTS.md` on
technical matters, and it goes deeper than [`README.md`](README.md) rather than repeating it — deployment, the layout
tree and the reason we are not on Vercel are stated there once.

**This file describes the prototype that is built.** Every fenced block below is copied from the source rather than
written against it. Two sections are deliberately not descriptions of the build:
[Specified, Not Yet Built](#specified-not-yet-built) holds rules that are designed and unimplemented, and
[Known Limitations](#known-limitations-of-what-is-built) holds things the build does that are wrong on purpose or wrong
by accident. Nothing outside those two sections is aspirational.

---

## The Stack

Chosen 7 September 2026 and now built. Every row exists because the prototype is judged from a video and a set of
mockups, and because **an unnecessary service is an unnecessary way to fail on stage**.

| Layer               | Decision                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| **Build**           | Vite 8 + React 19 + TypeScript 7, `strict` and `noUncheckedIndexedAccess`, per `tsconfig.json`       |
| **Package Manager** | Bun, per `AGENTS.md`                                                                                 |
| **Styling**         | Plain CSS with custom properties. One `tokens.css`, one `base.css`, one CSS file per surface         |
| **Routing**         | `react-router-dom` 7 under `BrowserRouter`. Four `Route` entries over three surfaces                 |
| **Fonts**           | One Archivo variable face and two static Newsreader faces, self-hosted under `public/fonts/`         |
| **Motion**          | CSS keyframes and transitions, seven keyframe rules total. No animation library                      |
| **Icons**           | **None.** No icon library is installed and no icon set is chosen. See the open decisions below       |
| **State**           | One React context over one `useState`, mirrored to `localStorage`. No backend, database, auth or key |
| **Data**            | Two committed TypeScript fixtures: 27 places, and one four-day trip in Yogyakarta                    |
| **Container**       | Two stage. `oven/bun:1.3-alpine` builds, `nginx:1.27-alpine` serves `dist/` on 8080                  |
| **Deploy**          | Unchanged. See [`README.md`](README.md#deployment)                                                   |

**The exact dependency set.** `react` and `react-dom` at `^19.2.8`, `react-router-dom` at `^7.18.3`, and four new dev
dependencies: `vite` `^8.2.2`, `@vitejs/plugin-react` `^6.1.1`, `@types/react` `^19.2.18`, `@types/react-dom` `^19.2.7`.
Nothing else was added, and **`.env.example` is unchanged** because there is still no key to name.

### Rejected Alternatives

| Rejected             | Why Not                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Next.js**          | An SSR framework with no server to justify it, and it complicates the single-container Cloud Run deploy      |
| **Tailwind**         | Its default type scale fights a palette that uses only weights 100 and 700. **The tokens are the system**    |
| **A Real Backend**   | Nothing in the Must tier writes to a server. An unnecessary service is an unnecessary way to fail on stage   |
| **Vercel**           | Already rejected, for a reason unrelated to this file: [`README.md`](README.md#deployment)                   |
| **An Animation Lib** | Seven keyframe rules across the whole build. A library for seven effects is a dependency for nothing         |
| **A State Library**  | One trip, one context, one storage key. Redux or Zustand is scaffolding around a single object               |
| **An Icon Library**  | Every affordance in the three surfaces is a labelled control or a drawn shape. A glyph set earns nothing yet |
| **A Schema Library** | One boundary, `localStorage`. The guard that ships is a hand-written `isTrip`, and it is fourteen lines      |
| **ID Type Aliases**  | Even `type SlotId = string` was dropped. Every id is `string` in `types.ts`, and the discipline is manual    |

**Two TypeScript settings bite, and are meant to.** `verbatimModuleSyntax` means every type-only import is written
`import type`; `noUncheckedIndexedAccess` makes every `Record` and array lookup `T | undefined`, which is why
`trip.options[id]` is guarded at every call site rather than indexed inline.

---

## The Shape Of The Build

Three surfaces, four route entries, and no more. A fifth would be a page for something that is a state.

| Path         | Surface       | Who Lands There                                                                   |
| ------------ | ------------- | --------------------------------------------------------------------------------- |
| `/`          | The Desk      | Aisyah. Her private workspace, the cold-load default, and where the demo opens    |
| `/interview` | The Interview | Aisyah, first run. Reached deliberately, because the demo shows it after the plan |
| `/t/:tripId` | The Book      | The group, from the link pasted in WhatsApp. **The shared link, shaped like one** |
| `*`          | The Desk      | Anything else. No 404 screen, no redirect, no bounce to an onboarding wall        |

**`/t/:tripId` is the point.** `PRODUCT.md`'s rule is that the link is the trip, and a link is a path with the trip in
it — not a query string on a workspace route. The Desk holds the root because a cold load with nothing stored has to
land on a finished plan, which is `PRODUCT.md`'s first rule made literal: the trip is valid with zero group input.

**The Perch and What Changed have no route on purpose.** The Perch is a drawer over any slot, and What Changed is a
strip that renders on both surfaces from the same component.

```tsx
export const App = () => (
  <TripProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Desk />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/t/:tripId" element={<Book />} />
        <Route path="*" element={<Desk />} />
      </Routes>
    </BrowserRouter>
  </TripProvider>
)
```

### The Layout

```
index.html                Vite entry, at the repo root. Preloads the Archivo face
src/
  main.tsx                mounts <App /> into #root; imports tokens.css then base.css
  App.tsx                 TripProvider wrapping BrowserRouter and the four routes above
  state.tsx               the one context: trip, disrupt, swap, tap, settle, undo, restart
  surfaces/               Desk.tsx, Book.tsx, Interview.tsx, each beside its own .css
  components/             Perch.tsx, Plate.tsx, StateChip.tsx, WhatChanged.tsx
  lib/                    repair.ts, ranking.ts, store.ts, format.ts
  data/                   types.ts, places.ts, trip.ts
  styles/                 tokens.css, base.css
public/
  fonts/                  archivo-variable.woff2, newsreader-regular.woff2, newsreader-italic.woff2
  assets/                 mark.svg
Dockerfile                two stage: bun builds, nginx serves dist/
nginx.conf                SPA fallback plus immutable asset headers
vite.config.ts            the react plugin, outDir dist, assetsDir assets
```

**`Plate.tsx` is the one component with no CSS file of its own** — its three classes live in `Book.css`, because the
plate only ever appears inside a spread and a second file would be a file for three rules.

**The migration off the static prototype is done.** `public/index.html`, `public/app/planner.html` and
`public/assets/site.css` were deleted in the same commit that added `src/`, because Vite copies `public/` verbatim into
`dist/` and an `index.html` there collides with the built entry. `public/assets/mark.svg` survives as the favicon.

---

## The Data Model

`src/data/types.ts` is the whole model. House style throughout: single quotes, no semicolons, no trailing commas, 120
columns, no `any`.

### Money And Time, As Built

**Money is whole ringgit, as a plain `number`.** `costRM` and `budgetRM` are integers in the fixture, and RM is attached
in `format.ts` rather than in the model. There is no sen unit and no cent-integer discipline; every price in the fixture
is a whole number, so no addition in the build ever produces a fraction.

**Times are `'HH:MM'` strings and durations are minutes.** `Option.opens` and `Option.closes` are clock strings parsed
by a four-line `minutes()` in `repair.ts`; `travelMin` and `dwellMin` are plain minute counts. One destination, one
timezone, so a timezone library would be ceremony.

**Two `Date` objects are constructed in the whole build**, and neither is load-bearing: `format.dayLabel` builds one to
render `21 Nov`, and `repair` builds one for a `ChangeEvent`'s `at` timestamp.

### Period, State And Kind

```ts
export type Period = 'morning' | 'midday' | 'afternoon' | 'evening'

export type SlotState = 'open' | 'decided' | 'at-risk'

export type OptionKind =
  | 'temple'
  | 'volcano'
  | 'market'
  | 'food'
  | 'museum'
  | 'beach'
  | 'cave'
  | 'craft'
  | 'viewpoint'
  | 'street'
```

Slot state maps one-to-one onto `DESIGN.md`'s three state tokens. There is no fourth state because there is no fourth
token.

| State     | Token       | Means                                                                                    |
| --------- | ----------- | ---------------------------------------------------------------------------------------- |
| `open`    | `--open`    | Deliberately unfinished. **`chosenId` is still set** — Perch has proposed, it is movable |
| `decided` | `--decided` | Settled. The Book prints it and a group tap cannot displace it                           |
| `at-risk` | `--at-risk` | A repair ran and the bench had no survivor. `cause` carries why                          |

**`open` does not mean empty**, and that is the single most load-bearing decision in the model. A slot always holds a
`chosenId`, because the trip has to be valid with zero group input. `open` means still movable, and that is what The
Book draws as a blank.

### Option

```ts
export type Option = {
  id: string
  name: string
  kind: OptionKind
  area: string
  /** Driving minutes from the city centre. The unit that makes a swap honest. */
  travelMin: number
  /** How long a visitor actually spends there, not the minimum possible. */
  dwellMin: number
  costRM: number
  opens: string
  closes: string
  closedOn: string[]
  bestPeriod: Period[]
  tags: string[]
  blurb: string
}
```

`closedOn` holds lowercase weekday names and is compared against `Day.weekday.toLowerCase()`. `bestPeriod` is the field
the fit filter reads first, and it is what replaced the design's tag-matching rule: an option declares the periods it
belongs in rather than a slot declaring what it wants.

### Slot And Day

```ts
export type Slot = {
  id: string
  period: Period
  /** The option currently in the slot. Null only while The Book is in its setting state. */
  chosenId: string | null
  /** Everything that lost, in rank order. The replacement pool, the cut list and the change list at once. */
  benchIds: string[]
  /** Options the world has taken off the table for this slot. A cancelled jeep tour is still cancelled. */
  blockedIds: string[]
  state: SlotState
  /** Why the slot is at risk. Present only when state is 'at-risk'. */
  cause: string | null
}

export type Day = {
  index: number
  date: string
  weekday: string
  /** The bird that tints this day. Matches --day-N in tokens.css. */
  tint: 1 | 2 | 3 | 4 | 5
  title: string
  slots: Slot[]
}
```

**`benchIds` is the membership; `trip.ranking` is the order.** The array is written by every repair and every manual
swap, and `benchInRankOrder` sorts it by rank at read time. Both the drawer and `repair` call that one function, so the
number a person counts on screen is the number the sentence states, by construction rather than by coincidence.

**`blockedIds` is what the world has taken off the table.** A cancelled jeep tour stays cancelled: `repair` adds the
option it displaces, `fits` rejects anything in the array, and `undo` removes what it puts back. It is why firing the
same disruption three times walks down the bench and stops instead of swapping back and forth.

**There is no `travelBudgetMinutes` on a day.** Reach is bounded per swap instead, against the option leaving the slot.
See [Transport](#transport-and-why-every-delta-carries-two-units).

### Person, ChangeEvent And Trip

```ts
export type Person = {
  id: string
  name: string
  initials: string
  /** Days this person tapped as available in phase 1. Empty means they have not opened the link. */
  availableDays: number[]
  /** Option ids this person tapped as unmissable in phase 2. */
  wants: string[]
}

export type ChangeEvent = {
  id: string
  at: string
  dayIndex: number
  slotId: string
  cause: string
  fromId: string
  toId: string
  /** Negative is closer. Always reported with deltaRM, never alone. */
  deltaMin: number
  deltaRM: number
  sentence: string
}

export type Trip = {
  id: string
  destination: string
  country: string
  startDate: string
  nights: number
  budgetRM: number
  party: Person[]
  days: Day[]
  options: Record<string, Option>
  /** The order the interview produced, most wanted first. Group taps reorder it; they never edit a slot. */
  ranking: string[]
  changes: ChangeEvent[]
}
```

**`ranking` is a flat id array, not a weighted map.** Position is the whole signal. `cause` is a free string rather than
a union, because the only producer is the prototype control on The Desk and a union would be a union of one.

**The sentence is stored, not re-rendered.** What Changed is a log of what a person was told, and a log that rewrites
itself when the fixture changes is not a log.

**There is no `Disruption` type and no disruption fixture.** A disruption enters the system as an argument to
`disrupt(dayIndex, slotId, cause)`, and the only caller is the labelled prototype control described below.

---

## Transport, And Why Every Delta Carries Two Units

`PRODUCT.md`: _"a swap that silently adds forty minutes breaks the day it was meant to save"_. Transport is the
mechanism's missing unit of cost, so it is modelled once and bounded once.

**`Option.travelMin` is driving minutes from the city centre**, authored per place. It is not a from-to matrix.

**Reach is bounded against the option leaving the slot, not against a day budget.** A replacement may sit up to
`TRAVEL_SLACK_MIN` further out than the stop it displaces, and no further.

```ts
/** How much further than the outgoing stop a replacement may sit before it breaks the day it was meant to save. */
const TRAVEL_SLACK_MIN = 25
```

**Every delta is reported in two units, travel then money**, per `DESIGN.md`'s cost-delta component. Never one without
the other — not in the Perch drawer, not in What Changed, not in a sentence.

```ts
/** Two units, travel then money. Never one without the other. */
export const describeDelta = (deltaMin: number, deltaRM: number): string => {
  const travel = deltaMin === 0 ? 'same distance' : `${Math.abs(deltaMin)} min ${deltaMin < 0 ? 'closer' : 'further'}`
  const money = deltaRM === 0 ? 'same price' : `${deltaRM < 0 ? '−' : '+'}RM ${Math.abs(deltaRM)}`
  return `${travel} · ${money}`
}
```

The minus sign is U+2212, not a hyphen, so a saving lines up under a plus in a tabular-numeral column.

---

## The Algorithm

This is the product. Everything else on this page is scaffolding for it.

### Fit Comes Before Rank

`research:docs/decisions/disruption-recovery.md`: _"score = vote rank, filtered by fit"_. Next-highest-voted is not
enough, because losing the one natural stop and replacing it with a well-polled museum is not a repair.

```ts
/** The window a slot occupies, so an option's opening hours can be checked against it rather than against the day. */
const WINDOW: Record<Period, [string, string]> = {
  morning: ['08:00', '12:00'],
  midday: ['12:00', '14:30'],
  afternoon: ['14:30', '18:00'],
  evening: ['18:00', '22:00']
}

const minutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':')
  return Number(h ?? 0) * 60 + Number(m ?? 0)
}

/**
 * Fit, then rank. An option that ranks first and is shut at the time it is needed is not a replacement, so every
 * filter here is a hard one and the ranking only breaks ties between survivors.
 */
export const fits = (option: Option, slot: Slot, day: Day, outgoing: Option | undefined): boolean => {
  if (slot.blockedIds.includes(option.id)) return false
  if (!option.bestPeriod.includes(slot.period)) return false
  if (option.closedOn.includes(day.weekday.toLowerCase())) return false

  const [start] = WINDOW[slot.period]
  const usable = minutes(option.closes) - minutes(start)
  if (minutes(option.opens) > minutes(start) || usable < 60) return false

  const ceiling = (outgoing?.travelMin ?? 0) + TRAVEL_SLACK_MIN
  return option.travelMin <= ceiling
}
```

Five hard tests, cheapest first, and the whole filter is these five lines:

1. **Whether the world has already taken it off the table**, which is the `blockedIds` check and is why a repeated
   repair walks forward
2. **The period it belongs in**, read off `bestPeriod` rather than matched from tags
3. **The weekday it is shut on**, compared lowercase against `Day.weekday`
4. **The window it can actually fill.** A `usable` of less than sixty minutes fails, so an option that closes twenty
   minutes into the slot is not a survivor even though it is technically open
5. **How much further out it sits than the stop it replaces**, bounded by `TRAVEL_SLACK_MIN`

### The Filter Is The Argument, So It Is Visible

`fits` returns a boolean and `whyNot` returns the reason. They are two functions rather than one returning a union
because the drawer needs the sentence and the repair needs the predicate, and neither should carry the other's shape.

```ts
/**
 * Why an option cannot take this slot, or null when it can. The drawer shows this rather than hiding the row: the
 * fit filter is the argument, so it has to be visible.
 */
export const whyNot = (option: Option, slot: Slot, day: Day, outgoing: Option | undefined): string | null => {
  if (slot.blockedIds.includes(option.id)) return slot.cause ?? 'Off the table'
  if (!option.bestPeriod.includes(slot.period)) return `Not a ${slot.period} thing`
  if (option.closedOn.includes(day.weekday.toLowerCase())) return `Shut on ${day.weekday}s`

  const [start] = WINDOW[slot.period]
  if (minutes(option.opens) > minutes(start)) return `Opens ${option.opens}`
  if (minutes(option.closes) - minutes(start) < 60) return `Closes ${option.closes}`

  const ceiling = (outgoing?.travelMin ?? 0) + TRAVEL_SLACK_MIN
  if (option.travelMin > ceiling) return `${option.travelMin - ceiling} min too far`
  return null
}
```

**A blocked row stays on screen, greyed, with its reason where the delta would be.** Hiding it would hide the mechanism,
and the mechanism is the pitch. **The first branch prints the slot's own `cause` back at the reader**, so the row a
disruption took off the table says the thing that took it, rather than a generic refusal.

**Every branch is reachable from the fixture, and the Monday one is reachable in the demo.** Ullen Sentalu sits on Day
3's morning bench and carries `closedOn: ['monday']`, and Day 3 is a Monday, so opening the drawer on the slot the demo
disrupts prints `Shut on Mondays` against it with no setup at all.

### Ranking The Survivors

There is one sort, and it is by tap count with the interview's own order as the tie-break. No weights, no purpose table,
no score.

```ts
/**
 * Question 3 produces the whole ranking, not just the winners: three chosen sit on top in the order they were
 * chosen, and the seven that were not settle onto the perch beneath them. Nothing is discarded.
 */
export const rankingFromInterview = (picked: string[], pool: string[]): string[] => [
  ...picked,
  ...pool.filter((id) => !picked.includes(id))
]

/**
 * A tap is not an edit. The group never writes to a slot; they add weight to an option, and the order the interview
 * produced is re-sorted underneath them. With no taps at all the trip is exactly what Perch already chose.
 */
export const rankingWithTaps = (trip: Trip): string[] => {
  const weight = new Map<string, number>()
  for (const person of trip.party) {
    for (const id of person.wants) weight.set(id, (weight.get(id) ?? 0) + 1)
  }

  return [...trip.ranking].sort((a, b) => {
    const diff = (weight.get(b) ?? 0) - (weight.get(a) ?? 0)
    return diff !== 0 ? diff : trip.ranking.indexOf(a) - trip.ranking.indexOf(b)
  })
}

export const tapCount = (trip: Trip, optionId: string): number =>
  trip.party.filter((p) => p.wants.includes(optionId)).length
```

**The tie-break on the previous order is what makes the video repeatable.** The same taps produce the same book on every
take, because the comparator never falls through to unspecified ordering.

**One person, one vote, and a vote is not weighted by who cast it.** `tapCount` is a count of people whose `wants`
contain the id, so a majority of the group outranks what Perch inferred and a single voice does not.

**The fixture's own taps are applied once, at module load.** `trip.ts` exports
`export const trip: Trip = { ...seed, ranking: rankingWithTaps(seed) }`, so Farah's two picks and Hana's one have
already moved the order before anything renders. A tap made in the browser re-runs the same function over the same seed
order, which is why the first tap does not appear to jump.

### One Bench Order, Read Twice

The drawer's row numbers and the sentence's rank word are the same number because they come from the same call, not
because two orderings happen to agree.

```ts
/**
 * The one bench order. The drawer numbers its rows from this and `repair` picks from it, so the rank the sentence
 * states is always the rank a judge can count on screen.
 */
export const benchInRankOrder = (trip: Trip, slot: Slot): Option[] => {
  const at = (id: string): number => {
    const i = trip.ranking.indexOf(id)
    return i === -1 ? Number.MAX_SAFE_INTEGER : i
  }
  return slot.benchIds
    .map((id) => trip.options[id])
    .filter((o): o is Option => o !== undefined)
    .sort((a, b) => at(a.id) - at(b.id))
}
```

`Perch.tsx` renders `benchInRankOrder(trip, slot).map(...)` and prints `i + 2` into `.perch-rank`; `repair` takes
`survivors[0]` from the same array and reports `bench.findIndex(...) + 2`. **An id missing from `trip.ranking` sorts
last rather than throwing**, which is what `Number.MAX_SAFE_INTEGER` is doing there.

### The Repair Function

```ts
export type RepairResult =
  | { kind: 'swapped'; slot: Slot; change: ChangeEvent }
  | { kind: 'exhausted'; slot: Slot; reason: string }

/**
 * The mechanism. A slot repairs itself from the bench the same choosing already produced, so nobody is consulted:
 * survivors of the fit filter, in the group's own rank order, top one wins.
 */
export const repair = (trip: Trip, dayIndex: number, slotId: string, cause: string): RepairResult => {
  const day = trip.days.find((d) => d.index === dayIndex)
  if (!day) throw new Error(`no day ${dayIndex}`)

  const slot = day.slots.find((s) => s.id === slotId)
  if (!slot) throw new Error(`no slot ${slotId}`)

  const outgoing = slot.chosenId ? trip.options[slot.chosenId] : undefined

  // What the world took off the table stays off it, so firing the same disruption twice cannot swap the trip back.
  const withCause: Slot = {
    ...slot,
    blockedIds: outgoing ? [...slot.blockedIds, outgoing.id] : slot.blockedIds,
    cause
  }
  const bench = benchInRankOrder(trip, withCause)
  const survivors = bench.filter((o) => fits(o, withCause, day, outgoing))

  const winner = survivors[0]
  if (!winner) {
    return {
      kind: 'exhausted',
      slot: { ...withCause, chosenId: null, state: 'at-risk' },
      reason: `Nothing on the bench for this slot is open and close enough. ${day.title} needs a decision.`
    }
  }

  const deltaMin = winner.travelMin - (outgoing?.travelMin ?? 0)
  const deltaRM = winner.costRM - (outgoing?.costRM ?? 0)

  const repaired: Slot = {
    ...withCause,
    chosenId: winner.id,
    benchIds: [...bench.filter((o) => o.id !== winner.id).map((o) => o.id), ...(outgoing ? [outgoing.id] : [])],
    state: 'decided'
  }

  const after = { ...day, slots: day.slots.map((s) => (s.id === slot.id ? repaired : s)) }
  const total = dayCostRM(after, trip.options)
  const before = dayCostRM(day, trip.options)
  const rank = bench.findIndex((o) => o.id === winner.id) + 2

  const money = total === before ? `the day stays at RM ${total}` : `the day is RM ${total}`
  const sentence = outgoing
    ? `Swapped ${outgoing.name} for ${winner.name}. ${cause}, ${winner.name} was your number ${ordinal(rank)} for that slot, and ${money}.`
    : `Filled the gap with ${winner.name}. ${cause}, and ${money}.`

  return {
    kind: 'swapped',
    slot: repaired,
    change: {
      id: `${slot.id}-${trip.changes.length + 1}`,
      at: new Date().toISOString(),
      dayIndex,
      slotId: slot.id,
      cause,
      fromId: outgoing?.id ?? '',
      toId: winner.id,
      deltaMin,
      deltaRM,
      sentence
    }
  }
}
```

In prose, five steps:

1. **Block the option that is leaving and stamp the cause onto a working copy of the slot.** `withCause` is what every
   line below reads, so the option the world just cancelled cannot win the slot back on the next call
2. **Sort the bench by rank, then filter it by fit** — `benchInRankOrder`, then `fits`. Fit first, always
3. **Take `survivors[0]`.** The array is already in rank order, so the top survivor is the highest-ranked one and no
   second comparison is needed
4. **Swap, and put the displaced option on the end of the bench.** It is not deleted: a haze cancellation is a forecast,
   not a demolition, and the row has to still be there for `undo` to put it back. It stays blocked, though, which is
   what stops the swap-back
5. **Emit a `ChangeEvent` carrying both deltas and the rendered sentence.** The event is prepended to `trip.changes`, so
   `changes[0]` is what What Changed shows

### The Sentence, Verbatim

The demo's one shot, as the code actually emits it:

> **Swapped Merapi Lava Tour for Prambanan. Jeep tours cancelled for haze, Prambanan was your number two for that slot,
> and the day stays at RM 119.**

**Every part of that is assembled, not authored.**

| Fragment                        | Where It Comes From                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `Merapi Lava Tour`, `Prambanan` | `Option.name`                                                                          |
| `Jeep tours cancelled for haze` | The `cause` string the prototype control passes in                                     |
| `two`                           | `bench.findIndex((o) => o.id === winner.id) + 2`, spelled through an eight-word lookup |
| `the day stays at RM 119`       | The branch taken when the recomputed day total equals the old one                      |

**Day 3 costs RM 119** because Merapi and Prambanan are both priced at the real foreign gate rate of RM 107, and the
day's other two stops are Tebing Breksi at RM 3 and Oseng Mercon at RM 9.

```ts
const WORDS = ['', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const ordinal = (n: number): string => WORDS[n] ?? String(n)
```

**The rank is spelled as a word in prose while the drawer's chip beside it stays a tabular numeral.** The word reads as
speech and the numeral reads as data, and they are the same number because both come from `benchInRankOrder`.

**The demo's `two` is exact, and it stays exact under a reset.** Fire `Cancel The Merapi Jeeps` on a fresh seed and the
bench for `d3-morning` sorts to Prambanan, Jomblang Cave, Timang Beach, Kalibiru, Bukit Panguk, Ullen Sentalu, so
Prambanan is position 0 and the sentence says number two. What a second and third firing report is
[a known limitation](#known-limitations-of-what-is-built), not a second mechanism.

### When The Bench Is Exhausted

**The slot empties and goes `at-risk`, carrying the cause.** `chosenId` becomes `null`, `state` becomes `'at-risk'`, and
the result's `reason` names the day that now needs a decision. No `ChangeEvent` is written, because nothing changed —
the plan lost a stop and gained a question.

**Both surfaces draw the hole rather than skipping it.** The Desk prints `Nothing that fits` in the slot with an
`at-risk` chip beside it; The Book renders a `.gap` section instead of an entry, headed **Nothing On The Perch Fits**,
in the blank's dashed construction at `2px dashed var(--at-risk)` over a 6% `--at-risk` ground, carrying the slot's own
`cause` in the prose beneath. An empty slot is the one thing the group must not have hidden from them, so the surface
they read is the surface that has to show it.

**That is the honest end of the claim, not a failure of it.** `PRODUCT.md` states the narrow version: the claim is not
that the trip survives, it is that Aisyah does not spend her holiday morning re-planning while four people wait. An
empty slot with a named cause still meets that; a silently wrong substitution does not.

**Pooling the day's other benches was considered and dropped.** It would give a third tier between "a survivor" and
"empty", but it takes a stop from a slot that still needs one and so moves the hole rather than closing it. Recorded
because `research:docs/decisions/disruption-recovery.md` left this exact question open — _"what happens when the reserve
list runs out"_ — and this file is where it gets closed.

### A Tap Is Not An Edit

`PRODUCT.md`: _"the only writes that ever happen on the book are the group's taps, and a tap is not an edit."_ That is
mechanically true here rather than a slogan. **A tap toggles one id in one person's `wants` array**, and then
`trip.ranking` is re-sorted underneath it. It never writes `slot.chosenId`, and there is no code path from a tap to a
decision.

| Slot State When Tapped | What Happens                                                                   |
| ---------------------- | ------------------------------------------------------------------------------ |
| `open`                 | The blank's three candidates reorder, and the vote count beside each row moves |
| `decided`              | The ranking reorders underneath. The decision does not move                    |
| `at-risk`              | The ranking reorders. The next repair on that slot sees the new order          |

**Settling is the separate, deliberate act.** `Settle This One` flips a slot from `open` to `decided` and nothing else,
so a group turns a blank into a decision on purpose rather than by accumulating taps.

### The Interview, And What It Produces

`research:docs/decisions/storybook-shape.md` §1 proposed five questions. **Three ship**, at `/interview`.

| #   | Question                          | Answers                                                             |
| --- | --------------------------------- | ------------------------------------------------------------------- |
| 1   | **Who Is Coming?**                | `A Few Of Us` or `Just Me`. The only question that changes the rest |
| 2   | **What Is This Trip For?**        | `See The Big Things`, `Eat Our Way Through`, `Not Rush`             |
| 3   | **Pick Three You'd Hate To Miss** | Ten cards, three kept. **This one is the product**                  |

**Question 3 does not pick three winners, it produces the whole order.** The three chosen sit on top in the order they
were chosen, and the seven that lost settle onto the perch beneath them, which is what repairs the trip later. That is
`rankingFromInterview`, and it is also where `DESIGN.md`'s step-forward motion first appears: the cards stagger in at
`animationDelay: ${i * 40}ms`, and the seven that were not picked take a `data-benched` treatment the moment the third
pick lands.

**The interview is a demonstration of the mechanism, not an input to it, and the screen says so.** Its final button
navigates to `/` and writes nothing; questions 1 and 2 are answered into local component state and discarded. The honest
line under the cards is in the shipped copy:

> This prototype always proposes the same trip, seeded from 3 picks. The ranking your taps produce is real and the
> repair uses it.

**Two questions were cut and both cuts are forced.** Question 5, "anything non-negotiable", is free text, and free text
needs a model call — there is no key and no server. Question 4, "how do you travel", was a day travel budget, and the
build bounds reach per swap instead, so it has nothing left to set.

---

## State And Persistence

**One context, one `useState`, seven operations.** `state.tsx` is the only place a `Trip` is written, and every write is
a whole-object replacement.

```ts
type Ctx = {
  trip: Trip
  /** Something in the world changed. The bench is the repair pool, so nobody is consulted. */
  disrupt: (dayIndex: number, slotId: string, cause: string) => void
  /** She vetoes. Choosing a bench row by hand is the same interaction as a repair. */
  swap: (dayIndex: number, slotId: string, optionId: string) => void
  /** A tap is not an edit: it adds weight, and the order Perch already produced re-sorts underneath it. */
  tap: (personId: string, optionId: string) => void
  settle: (dayIndex: number, slotId: string) => void
  undo: () => void
  restart: () => void
}
```

| Operation | Writes                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------- |
| `disrupt` | Runs `repair` and replaces the slot; prepends the `ChangeEvent` when the result is `swapped`            |
| `swap`    | Replaces `chosenId` directly and moves the outgoing option to the end of the bench. **Writes no event** |
| `tap`     | Toggles one id in one person's `wants`, then rewrites `trip.ranking` through `rankingWithTaps`          |
| `settle`  | Flips one slot from `open` to `decided`                                                                 |
| `undo`    | Pops `changes[0]`, restores `chosenId` to `fromId` and puts `toId` back at the head of the bench        |
| `restart` | Clears the storage key and reloads the seed. The demo's reset                                           |

**One `useEffect` mirrors the trip to `localStorage` on every change**, including the first render, so a cold visit
writes the seed immediately and the two surfaces share one object from the first paint.

### The Storage Contract

```ts
const KEY = 'perch.trip.v1'

/** A cold load with nothing stored is the normal case, not an error: the trip is valid with zero group input. */
export const load = (): Trip => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed
    const parsed = JSON.parse(raw) as Trip
    return parsed.id === seed.id ? parsed : seed
  } catch {
    return seed
  }
}

export const save = (trip: Trip): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(trip))
  } catch {
    /* A demo machine with storage disabled still runs; it just forgets between reloads. */
  }
}

export const reset = (): void => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* nothing to do */
  }
}
```

Four properties, and each is a decision rather than an accident.

- **One key, and the whole `Trip` is the value.** Not a delta against the fixture. One key means one thing to clear, and
  a demo that has to be repeatable needs exactly that
- **A stored trip whose `id` does not match the seed's is discarded.** That is the version check: change the fixture's
  id and every stored copy in the room is stale, deliberately, with no migration path to write
- **Every read and write is wrapped.** `localStorage` throws in some privacy modes, so a storage failure degrades to
  forgetting between reloads rather than blanking a screen
- **A cold load renders the fixture as authored.** Perch has already proposed, The Book opens in its setting state, What
  Changed is empty, and there is no onboarding wall on any route

---

## The Shared Link, With No Backend

**What is built.** She sends `/t/yogya-nov-2026`. The route exists, resolves, and renders The Book cold — no stored
state required, no bounce to the interview, no 404 on a hard refresh. That last one is why `nginx.conf` carries an SPA
fallback: `/t/<trip>` has no file behind it, and the one thing the group does with the link is open it cold.

**One device, one browser, one storage key.** The Desk and The Book are two routes over the same context, so a tap made
on `/t/yogya-nov-2026` is visible on `/` because it is the same object in the same tab, not because anything synced.
Four limits follow, and the video must not imply otherwise.

- **Nothing crosses a device.** There is no fragment payload, no encoding, no server. A second phone opening the link
  gets the seed fixture, not Aisyah's trip
- **The `:tripId` segment is not read.** The Book renders whatever is in the store; `/t/anything` shows the same trip
- **It is not a secret.** Anyone holding the link holds the trip. Deliberate — no account, no install — but a property
  rather than an accident
- **The party's taps are fixture data.** Farah's two picks and Hana's one are authored, which is what gives the vote
  counts something to show before anybody taps

**Closing the round trip is the first thing a backend would buy**, and it is the honest first line of the build phase's
backlog rather than a gap to paper over on stage.

---

## Styling, Motion And Fonts

**`tokens.css` carries `DESIGN.md`'s palette under `DESIGN.md`'s own names**, so a token in the CSS and a row in the
design spec are searchably the same string. There is no Tailwind, no CSS-in-JS and no preprocessor — plain CSS custom
properties, one file per surface, one file per component that needs one.

```css
:root {
  /* Specimen palette. Every hue is on a bird that lives in or migrates through Peninsular Malaysia. */
  --ink: #2e261f; /* Magpie-Robin, Copsychus saularis */
  --paper: #fbf8f2; /* The Desk ground */
  --plate: #f2ede0; /* Zebra Dove, Geopelia striata */
  --open: #1b7f86; /* Bee-eater, Merops viridis */
  --decided: #3e7a3a; /* Green Broadbill, Calyptomena viridis */
  --at-risk: #c0342f; /* Crimson Sunbird, Aethopyga siparaja */

  --day-1: #c2622f; /* Rufous-collared Kingfisher, Actenoides concretus */
  --day-2: #2a4c9b; /* Asian Fairy-bluebird, Irena puella */
  --day-3: #e0a32c; /* Yellow-vented Bulbul, Pycnonotus goiavier */
  --day-4: #6e4a8e; /* Violet Cuckoo, Chrysococcyx xanthorhynchus */
  --day-5: #b0567e; /* Pink-necked Green Pigeon, Treron vernans */
}
```

**Five day tints ship, not three.** `--day-4` and `--day-5` were added for hue regions no other token in the palette
occupies — a violet and a rose — and both birds are Peninsular Malaysian, which is the rule the palette was built on.
Five is enough for the trip lengths the fixture and the pitch describe, and the tint is a per-day assignment in the
fixture rather than an index that cycles, so no two days can share a bird by accident.

| Token Group | Values                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------- |
| **Space**   | `--s1` 4px through `--s8` 64px, on the 4px base. A grouping gap is twice the internal gap |
| **Radius**  | `--r-desk` 24px, `--r-pill` 999px, `--r-plate` 0                                          |
| **Outline** | `--outline` 3px, from study 07's measured borders                                         |
| **Motion**  | `--motion-fade` 120ms, `--motion-step` 320ms, `--ease` `cubic-bezier(0.2, 0.7, 0.3, 1)`   |
| **Grounds** | Eight, each `color-mix(in oklab, <token> 8-10%, var(--paper))`                            |

**Radius is the mechanic, not a style value.** `--r-plate` is `0` and it is a real token rather than an omission,
because The Book has to be able to name its own corner treatment and get a square one. A stray 24px cannot leak from The
Desk onto a plate when the plate asks for `--r-plate` by name.

**Two attribute hooks carry everything else.** `[data-day="N"]` sets `--tint` and `--ground` once, and
`[data-state="open" | "decided" | "at-risk"]` sets `--state` and `--state-ground`. Every component inside reads those
four variables and names no colour of its own. That is the wayfinding device, and it is four selectors.

**Motion is five keyframe rules and a handful of transitions**: `perch-fade`, `perch-rise` and `perch-step` for the
drawer, `day-open` on The Desk, `spread-in` on The Book, `changed-in` on the What Changed strip, and `card-in` on the
interview. The 40ms stagger is `animationDelay` set inline from the row index. `base.css` closes with a
`prefers-reduced-motion: reduce` block that collapses every animation and transition to 0.01ms, with a
`biome-ignore-all` on the file for the `!important` that override needs.

### Type And Fonts

**Five type roles, and nothing is set at 500 or 600**: `.t-display` and `.t-plate-title` at weight 100, `.t-label` at
700 uppercase with `0.06em` tracking, `.t-name` at 700, `.t-specimen` at 400 italic in `--ink-muted`, and `.t-prose` in
Newsreader at 18px. The jump from 100 to 700 is the field guide's own hierarchy. `body` sets
`font-variant-numeric: tabular-nums` globally, and buttons inherit it, so every price and minute count aligns.

**Fonts are self-hosted so the demo cannot fail on someone else's network.** Three latin-subset `woff2` files under
`public/fonts/`, no Google Fonts request, and therefore no third-party request from a page a judge opens.

| File                       | Face                                                             |
| -------------------------- | ---------------------------------------------------------------- |
| `archivo-variable.woff2`   | Archivo, a real variable face with a `wght` axis from 100 to 900 |
| `newsreader-regular.woff2` | Newsreader 16pt, a static face                                   |
| `newsreader-italic.woff2`  | Newsreader 16pt, a static face                                   |

`index.html` preloads only the Archivo file, because it paints first and everywhere. Every `@font-face` sets
`font-display: swap`, and every stack ends in a real system fallback.

---

## Container, Deploy, Build And Run

**[`README.md`](README.md#deployment) is unchanged and stays the reference.** So is `.github/workflows/deploy.yml` — it
runs `docker build .` then `gcloud run deploy` on every push to `main`, and it does not know or care what is inside the
image. Two files changed, and no workflow did.

```dockerfile
FROM oven/bun:1.3-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 8080
```

**The lockfile is copied before the source**, so a change to a component does not re-resolve dependencies, and
`--frozen-lockfile` makes a drifted `bun.lock` a build failure rather than a silent upgrade in production.

```nginx
server {
  listen 8080;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # The shared link is a real path, so every unknown path falls back to the app rather than to a 404.
  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location /fonts/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**The fallback is load-bearing, not hygiene.** `/t/yogya-nov-2026` is a client route with no file behind it, and the old
`try_files $uri $uri/ =404` returned 404 for exactly the URL the pitch asks a judge to open. The immutable headers are
safe because Vite content-hashes everything it emits into `/assets/`, and the three font files never change name.

```bash
bun install          # dev tooling, app dependencies, and the husky hooks
bun run dev          # vite, on the port it prints
bun run build        # vite build, into dist/
bun run preview      # vite preview --port 8080, the way the container will serve it
bun run lint         # biome check . && prettier --check on md/yaml
bun run typecheck    # tsc --noEmit
```

**`build` does not typecheck.** `vite build` transpiles without checking types, so `bun run typecheck` is a separate
gate and CI has to run it separately. That is a deliberate split — a failing typecheck should not be discovered as a
Docker build failure four minutes into a deploy.

---

## The Fixture

Two files. `src/data/places.ts` holds 27 real places in and around Yogyakarta; `src/data/trip.ts` assembles them into
one trip, the interview's ten cards, and a party of four.

| Field       | Value                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- |
| **Trip id** | `yogya-nov-2026`, which is also the storage version check and the `/t/` segment         |
| **Dates**   | 21 - 24 November 2026, four days and three nights                                       |
| **Budget**  | RM 400 each, against RM 322 planned                                                     |
| **Party**   | Aisyah, Farah, Hana, Iman. Iman has not opened the link, which is what the nudge is for |
| **Places**  | 27, across 10 of the 11 `OptionKind` values                                             |
| **Slots**   | 12, three per day. Two are `open`, ten are `decided`, none start `at-risk`              |

**Prices are the foreign gate rate, in ringgit, not the domestic rate.** Borobudur is RM 130 and Prambanan RM 107
because that is what a Malaysian visitor actually pays, and a demo that quotes the local price is quoting a number
nobody in the audience would be charged.

```ts
export const dayCostRM = (day: Day, options: Record<string, Option>): number =>
  day.slots.reduce((sum, slot) => {
    const chosen = slot.chosenId ? options[slot.chosenId] : undefined
    return sum + (chosen?.costRM ?? 0)
  }, 0)

export const tripCostRM = (trip: Trip): number => trip.days.reduce((sum, day) => sum + dayCostRM(day, trip.options), 0)
```

**Day 3 is a Monday, and that is the point of the calendar.** Sonobudoyo, Benteng Vredeburg and Ullen Sentalu all carry
`closedOn: ['monday']`, which is why none of them sit on Day 3, and The Book's colophon says so in as many words. It is
also the demo day: Merapi Lava Tour in the morning, Tebing Breksi in the afternoon, Oseng Mercon in the evening, RM 119
in total.

### The Prototype Controls

**The Desk carries a labelled block called `Prototype Controls`, inside the product surface, saying it is not part of
the product.** Two buttons: `Cancel The Merapi Jeeps` calls `disrupt(3, 'd3-morning', 'Jeep tours cancelled for haze')`,
and `Start Over` clears the storage key and reloads the seed.

**A visible fixture control is more honest than a hidden one, and it is also better demo craft.** The alternative is a
keyboard shortcut or a timer that fires on its own, and both invite the judge's real question — _did that just happen,
or did you make it happen?_ — with no answer on screen. The block's own copy answers it: _"Not part of the product.
These stand in for the feeds a live build would listen to."_ A judge who reads it knows exactly where the seam is, which
is worth more than the two seconds of theatre a hidden trigger buys.

---

## Known Limitations Of What Is Built

Each of these is true of the code today. None of them blocks the 13 September submission; all of them are the build
phase's opening backlog.

| Limitation                             | What Is Actually Wrong                                                                                                                                                                                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Travel is from the city centre**     | `travelMin` is distance from town, not from the previous stop. Once a swap changes the predecessor the figure is wrong                                                                                                                                                        |
| **A repeated repair renumbers**        | The rank the sentence states is the position in the bench **as it stands at that moment**, not the order the interview produced. The first repair, which is the demo, is exact; a second and a third both report "number six" because the bench has shortened underneath them |
| **`/t/:tripId` is never read**         | `useParams` is not called, so `/t/anything` renders the stored trip. There is one trip, so nothing is wrong on screen                                                                                                                                                         |
| **The nudge is inert**                 | `Nudge Iman` is a real, disabled-when-complete button that sends nothing. There is no channel for it to send on                                                                                                                                                               |
| **The blank has no ranked candidates** | The Book offers the chosen option plus the first two on the bench. It does not re-filter them by fit for that slot                                                                                                                                                            |

**Six defects found reading this document back against the code were fixed rather than recorded**, on 7 September: the
bench cycled on repeated repair, the sentence numbered from a different ordering than the winner was picked from, a
manual swap emitted no `ChangeEvent`, an exhausted slot vanished from The Book, `undo` restored only the choice, and
`load` cast rather than validated. **The two Newsreader files were also the wrong way round**, so every line of prose in
The Book rendered italic. The sections above describe the fixed state.

**`--day-5` is defined and unexercised, and that is not a defect.** The palette is a system and a fifth day is a
plausible trip; the four-day fixture reaches `--day-4`. Cycling three tints across four days is what would be wrong, and
[`DESIGN.md`](DESIGN.md) records why.

**The travel limitation is the one that matters to the pitch**, because it sits directly under the sentence the demo
turns on. The fix is named below and it is small; what is not acceptable is leaving it unstated while the sentence
claims a minute figure.

---

## Specified, Not Yet Built

**Everything in this section is designed and unimplemented.** It is written down because each rule was reasoned through
and each one is cheap to build once the build phase opens. Nothing here describes the current build.

### A From-To Travel Override Matrix

The fix for the travel limitation above. Transport gets modelled twice — the per-option baseline that ships today, plus
a sparse override consulted first.

```ts
export const travelMinutes = (trip: Trip, from: string | 'home', to: string): number =>
  trip.travelOverrides[`${from}>${to}`] ?? optionOf(trip, to).travelMin
```

`travelOverrides` is keyed `` `${fromId}>${toId}` `` and the fixture authors an entry for every pair the demo exercises.
A full matrix was rejected as n squared hand-authored entries for a demo that walks one path. **The type cannot enforce
the key format**, so a malformed key silently falls back to the baseline, which is the cost of the sparse form and is
accepted.

### Tag Weights From Question 2

Question 2 is asked today and feeds nothing. The design gives it a committed table with one row per purpose: that
purpose's own tags at `TAG_PRIMARY`, its neighbours at `TAG_ADJACENT`, everything else absent and therefore zero.

```ts
const TAG_PRIMARY = 5
const TAG_ADJACENT = 2
const TAP_WEIGHT = 2

export const scoreOf = (option: Option, ranking: Ranking): number =>
  option.tags.reduce((total, tag) => total + (ranking.tagWeights[tag] ?? 0), 0) +
  TAP_WEIGHT * (ranking.taps[option.id] ?? 0)
```

**The three constants encode one product rule** and are tuned to the fixture rather than measured: with a party of five,
three taps outrank the trip's stated purpose and two do not. A majority of the group beats what Perch inferred; a
minority does not. `Option.tags` already exists in the model and is currently decoration, so this is additive.

### Must-Go, And A Repair That Refuses

The interview's three picks become non-negotiable, and `repair` refuses to displace one.

```ts
if (slot.chosenId !== null && trip.mustGo.includes(slot.chosenId)) {
  return { kind: 'refused', slot: { ...slot, state: 'at-risk', cause }, reason: refusalOf(trip, slot, cause) }
}
```

**This is the rule that gives `at-risk` a second job.** Today the state means only "the bench ran out"; with must-go it
also means "the group called this non-negotiable and we are not swapping it behind their backs". The group said it was
the reason for the trip, and a silent substitution would be a lie. `interviewPicks` is the three-pick array that exists
today and it carries no refusal.

### Two Smaller Rules

- **`trimToBudget(trip)`** returns `{ trip, events, shortfallRM }`. While the total exceeds `budgetRM` it takes the slot
  whose cheapest fitting survivor saves the most and repairs it with cause `over-budget`, stopping when the budget is
  met or when no slot can save anything — reporting the shortfall rather than emptying slots to hit a number
- **A `'reordered'` change cause.** An `open` slot that resolves to a different option than it would have without the
  group's taps is logged like any other change, so the group can see their taps did something

### The Disruption Boundary Stays Where It Is

`research:docs/decisions/disruption-recovery.md` verified two live sources — MET Malaysia for official warnings and
Open-Meteo for numbers, the latter recorded there as free, keyless, at 10,000 calls per day non-commercial.

**Neither is called, and neither should be before the build phase.** A network call on stage is a way to fail on stage,
and the prototype rubric scores no code. That same document scopes the prototype to **pre-trip only**, and the boundary
holds here.

---

## The Real Place Data Gap

`PRODUCT.md` lists this under What Would Kill This as **"Unsolved. Everything else is derived, free, or droppable. Named
in `TRD.md`."** Naming it properly is this file's job.

**What the fixture stands in for.** `src/data/places.ts` hand-authors, for 27 options: name, kind, area, driving minutes
from the centre, dwell minutes, cost in ringgit at the foreign gate rate, opening and closing times, the weekdays it is
shut, the periods it belongs in, tags, and a one-line blurb.

**Four of those fields are load-bearing and the rest are decoration.** `fits` reads `bestPeriod`, `closedOn`, `opens`
and `closes`, plus `travelMin` for the reach ceiling. Names, prices, areas, tags and blurbs can stay authored for a
single demo destination indefinitely without weakening the claim. **Hours cannot**, because the claim _is_ that the
itinerary knows what can break it.

**And hours are the field the free sources are worst at.** That is the sharp version of the gap, and it is more useful
to the build phase than "we need a places API".

| Source Considered            | Gives                                             | Costs                                                                                                                                                         |
| ---------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Google Places API**        | Names, hours, prices, photos, at coverage         | A billing account and a key, and a browser key is a public key, so it forces a server. Its caching and redistribution terms need reading before we rely on it |
| **OpenStreetMap / Overpass** | Names, locations, some hours. Free, ODbL          | Coverage is uneven place to place, hours use the `opening_hours` syntax and need a parser, and there is no price data at all                                  |
| **Wikidata / Wikipedia**     | Names and a usable blurb. Free                    | Nothing for hours, nothing for price                                                                                                                          |
| **MET Malaysia**             | Official warnings, the authority a forecast lacks | Verified on `research`. Answers disruption, not places                                                                                                        |
| **Open-Meteo**               | Forecasts and a flood endpoint, no key            | Verified on `research`. Answers disruption, not places                                                                                                        |
| **A Hand-Authored Fixture**  | Exactly what the demo needs, free, offline        | A lie about scale, and it does not survive a second destination                                                                                               |

**Three things must be decided before the build phase opens on 21 September**, and it cannot start on this without them.

1. **Whether there is a server at all.** A keyed place API forces one, because a key in a browser bundle is public. That
   reopens the rejection recorded above, so it is the first decision and the rest follow from it
2. **Whether we ship one destination properly or many badly.** One destination with authored hours is honest and
   demoable; many destinations with patchy hours breaks the mechanism in front of a judge who picks their own city
3. **What happens to hours we cannot get.** `opens` and `closes` are non-nullable strings today, so an option with
   unknown hours cannot be expressed at all — it has to be given a time, which makes it a guess wearing a fact's
   clothes. Real data means an explicit unknown case, and `fits` has to decide whether unknown counts as a survivor

**None of this blocks the 13 September submission.** The prototype rubric scores no code, and shipping a fixture with
its provenance declared is the correct prototype-phase answer. It blocks the build phase, which is why it is written
down here rather than discovered on 21 September.

---

## Open Decisions For The Team

Three things that need a person, not a commit. Each is one decision and none of them is technical.

| Decision                       | The Situation                                                                                                                                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The demo sentence's figure** | `PRODUCT.md`'s demo moment ends **"the day stays at RM 40"**; the code emits **"the day stays at RM 119"**. _Stays at_ is true either way, only the figure differs. Either `PRODUCT.md` updates, or the demo day is re-priced |
| **`DESIGN.md`'s tint table**   | `tokens.css` ships five day tints; `DESIGN.md`'s palette table still lists `--day-1` to `--day-3`. Two rows need adding to the spec, or the two new birds need rejecting                                                      |
| **An icon set**                | None is chosen and none is installed. Nothing in the three surfaces needs one today. If the pitch deck or a later surface does, it is a dependency decision that has not been made                                            |

**The figure is the one with a deadline.** It appears in `PRODUCT.md`, and it will appear in the video script and the
slides, so it wants settling before `pitch-smith` writes against either. `PRODUCT.md` also abbreviates the option as
_Merapi_ where the code prints its full `Option.name`, _Merapi Lava Tour_ — the same decision covers both.
