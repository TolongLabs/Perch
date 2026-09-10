# TRD - Perch

**How.** Architecture, contracts, data models and the rationale behind them. [PRODUCT.md](PRODUCT.md) owns who and why,
[PRD.md](PRD.md) owns scope, [DESIGN.md](DESIGN.md) owns the look. This file is canonical over AGENTS.md on technical
matters, and it goes deeper than [README.md](README.md) rather than repeating it.

**Contract Status.** The historical design below is dated 8 September 2026; selected implementation contracts have since
been updated through PRs #301, #302 and #304, which does not make everything else here implemented.

[Specified, Not Yet Built](#specified-not-yet-built) holds rules that are designed and deferred, and
[Known Limitations](#known-limitations) holds things the design accepts or has not solved. The build phase opens 21
September; see [brief.md](brief.md#dates).

**What is built today, what is being rebuilt and what is new on 8 September.** The submission runs one path: sign in,
new plan, swipe, votes, drag the calendar, apply, checklist, book. Two old surfaces are deleted, not kept behind a flag.

| Surface           | Status      | Note                                                                      |
| ----------------- | ----------- | ------------------------------------------------------------------------- |
| Landing           | Built, keep | Unchanged. Draws The Perch story                                          |
| Sign In           | Built, keep | Unchanged. Guest only, email/password disabled                            |
| Dashboard         | Built, keep | Re-fixtured for Tokyo. Adds invite code and who-has-voted indicators      |
| Onboarding        | **New**     | Replaces NewPlan and Interview. Drawn date-range picker, chips, free text |
| The Deck (swipe)  | **New**     | Reel cards. Joiners land here from the invite link, skip onboarding       |
| The Tally (votes) | **New**     | Percentage per place, unanimous gold, zero greyed and eliminated          |
| The Desk          | **Rebuilt** | Calendar surface with 4 days x 3 slots. Sidebar, Apply, pins              |
| Before We Go      | **New**     | Checklist derived from the trip. All ticked enables Print The Book        |
| The Book          | Built, keep | Re-fixtured for Tokyo. One plate per day, Maps deep link per day          |

**Old surfaces Interview and the current Desk body are deleted.** Not kept behind a flag or behind a route that renders
nothing. Removed.

---

## The Stack

Decided 8 September 2026 and frozen for the prototype. Every row exists because the prototype is judged from a video, a
set of mockups and a single path through the app, and because **an unnecessary service is an unnecessary way to fail on
stage**.

| Layer               | Decision                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **Build**           | Vite 8 + React 19 + TypeScript 7, `strict` and `noUncheckedIndexedAccess`, per `tsconfig`     |
| **Package Manager** | Bun                                                                                           |
| **Styling**         | Plain CSS with custom properties. One `tokens.css`, one CSS file per surface                  |
| **Routing**         | `react-router-dom` 7 under `BrowserRouter`                                                    |
| **Drag And Drop**   | `@dnd-kit/core`, the one new dependency                                                       |
| **Fonts**           | Quicksand and Newsreader, self-hosted under `public/fonts/`                                   |
| **Motion**          | CSS keyframes and transitions. One branded mechanic: perch step-forward; 120ms cross-fade     |
| **Icons**           | **None.** No icon library is installed. Every affordance is a labelled control or drawn shape |
| **State**           | One React context mirrored to `localStorage`. No backend, database, auth or API key           |
| **Data**            | Committed TypeScript fixtures. External media comes from a public GCS bucket and OSM tiles    |
| **Container**       | Two stage. Bun builds, nginx serves `dist/` on 8080                                           |
| **Deploy**          | Cloud Run in asia-southeast1, deployed by GitHub Actions on every merge to main               |
| **Storage**         | Google Cloud Storage for reel MP4s                                                            |

**The exact dependency set.** `react` and `react-dom` at `^19.2.8`, `react-router-dom` at `^7.18.3`, `@dnd-kit/core` at
`^6.3.1`, and the usual dev dependencies: `vite` `^8.2.2`, `@vitejs/plugin-react` `^6.1.1`, `@types/react` `^19.2.18`,
`@types/react-dom` `^19.2.7`. Nothing else was added, and **.env.example is unchanged** because there is still no key to
name.

### Rejected Alternatives

| Rejected              | Why Not                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Next.js**           | An SSR framework with no server to justify it, and it complicates the single-container Cloud Run deploy    |
| **Tailwind**          | Its default type scale fights a palette that uses only weights 100 and 700. **The tokens are the system**  |
| **A Real Backend**    | Nothing in the Must tier writes to a server. An unnecessary service is an unnecessary way to fail on stage |
| **Vercel**            | Already rejected per [README.md](README.md#deployment)                                                     |
| **An Animation Lib**  | Seven keyframe rules across the whole build. A library for seven effects is a dependency for nothing       |
| **A State Library**   | One trip, one context, one storage key. Redux or Zustand is scaffolding around a single object             |
| **An Icon Library**   | Every affordance in the surfaces is a labelled control or a drawn shape. No glyph set earns anything yet   |
| **A Schema Library**  | One boundary, `localStorage`. The guard is a hand-written `isTrip` type predicate                          |
| **ID Type Aliases**   | Even `type SlotId = string` was dropped. Every id is `string` in `types.ts`                                |
| **Google Places API** | Terms cap caching at 30 days and forbid storing photos. Forces a server because a browser key is public    |

**Two TypeScript settings bite, and are meant to.** `verbatimModuleSyntax` means every type-only import is written
`import type`; `noUncheckedIndexedAccess` makes every `Record` and array lookup `T | undefined`, which is why
`trip.options[id]` is guarded at every call site rather than indexed inline.

## Build Phase

The prototype has no backend, no auth and no API key; external requests include media -- the reel and hero files from a
public GCS bucket, and OpenStreetMap tiles. The build phase (21 September to 11 October) adds infrastructure behind
these decisions.

| Service              | Role                                                                                         | Constraint the team expects to face                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase**         | Auth, votes table, realtime sync across devices                                              | Schema migrations must be authored and reviewed. Realtime must handle a joiner's tab arriving mid-session. The free tier pauses a project after a week idle     |
| **Google (limited)** | Maps deep links per day in The Book. A Routes call for transit times                         | Deep links need no key. Routes is metered and keyed, so replacing the hand-authored matrix with routed minutes forces a server-side call even for the demo city |
| **LLM**              | Parsing free text intent from Onboarding. Writing the one-line rationale per day on The Desk | One call per new plan and one per Apply. Latency is acceptable at low concurrency. The model choice, key and cost ceiling are undecided                         |
| **Cloud Run**        | Hosting every surface under the same image, same deploy pipeline                             | No change from the prototype. The Dockerfile and nginx.conf serve identically. The deploy workflow must add a Supabase migration step                           |

The Supabase schema for votes is a single table: `(trip_id, place_id, person_id, weight)`. Realtime subscriptions listen
on the trip's rows and update the tally in place without a reload. Auth is email-password plus magic-link; Google SSO is
deferred to post-build.

**The LLM boundary is precise:** it never decides what goes in a slot, never re-ranks and never writes to a calendar
cell. It parses a free-text answer like "we want good food and one night out" into tag-style preferences, and it writes
the one-line rationale each day carries on The Desk. Both calls are stateless; the result is stored, not streamed.

**Google Places API remains rejected even in the build phase.** Its Accepted Use Policy caps `placePhoto` and
`placeDetails` caching at 30 days and explicitly forbids storing photos for longer than a transient display. The build
phase seeds places from OpenStreetMap, Wikidata and Wikimedia Commons instead. Google Maps JavaScript API is used only
for deep links (the "Open In Maps" button per day in The Book) and a single Routes API call per trip to get transit
minutes between consecutive stops. See [The Real Place Data Gap](#the-real-place-data-gap).

## The Shape Of The Build

Nine route entries over eight surfaces, and no more. A tenth would be a page for something that is a state.

| Path                 | Surface      | Who Lands There                                                                         |
| -------------------- | ------------ | --------------------------------------------------------------------------------------- |
| `/`                  | Landing      | Anyone opening the bare URL. One screen, no scroll                                      |
| `/sign-in`           | Sign In      | Guest only. The only surface with no footer                                             |
| `/trips`             | Dashboard    | Post-auth. Lists trips, carries New Plan call to action, shows invite code status       |
| `/new`               | Onboarding   | Prefilled chips and a drawn date-range picker, free text field. Replaces two old routes |
| `/t/:tripId/swipe`   | The Deck     | Reel cards. Joiners land here from the invite link and skip onboarding                  |
| `/t/:tripId/votes`   | The Tally    | Percentage per place, unanimous gold, zero greyed. The only votes screen                |
| `/desk`              | The Desk     | Aisyah's workspace. Calendar grid, sidebar of voted-in cards, Apply, pins, feasibility  |
| `/desk/before-we-go` | Before We Go | Checklist derived from the trip. All ticked enables Print The Book                      |
| `/t/:tripId`         | The Book     | The group, from the link pasted in the chat. One plate per day                          |
| `*`                  | Landing      | Anything else. No 404 screen, no bounce to an onboarding wall                           |

**There is no authentication behind `/sign-in`, and the screen says so** rather than letting a reviewer discover it by
typing into a dead field. The email and password fields are disabled and drawn; Sign In As Guest navigates. This is the
honest version of a screen the submission needs and the product does not.

**`/t/:tripId/swipe` is the point of arrival for joiners.** Aisyah pastes the invite link into WhatsApp; Farah, Hana and
Iman open it and land on the reel deck without going through New Plan or Sign In. The trip id is in the path, not a
query string.

**Onboarding is not a form and must not become one.** A drawn date-range picker, chips for activities and destination,
plus a free text field. A destination with no fixture behind it says so and disables the continue button, which is also
the honest way to show that place data covers one city.

**The Desk is rebuilt from scratch.** The old Desk body is deleted. The new Desk has a 4-day by 3-slot calendar grid, a
sidebar of voted-in cards, drag-to-drop with `@dnd-kit/core`, an Apply button, owner pinning, and feasibility colours
per day.

**Old routes deleted.** `/interview` and the old `/desk` body are removed, not kept behind a flag.

### The Layout

```
v2/
  index.html              Vite entry. Preloads the Quicksand face
  src/
    main.tsx              mounts <App /> into #root; imports tokens.css then base.css
    App.tsx               TripProvider wrapping BrowserRouter and the route tree
    state.tsx             the one context: trip, operations, localStorage sync
    chrome/               Shell.tsx and Footer.tsx, the two mountings of one footer
    surfaces/             Landing, SignIn, Dashboard, Onboarding, Deck, Tally, Desk,
                          BeforeWeGo, Book. Each with its own .css
    components/           Perch.tsx, Plate.tsx, StateChip.tsx, Ui.tsx, ReelCard.tsx,
                          PlacedCard.tsx, CopyLink.tsx, DateRangePicker.tsx
    lib/                  schedule.ts, votes.ts, mapsLink.ts, store.ts, format.ts
    data/                 types.ts, places.ts, trip.ts, votes.ts, travel.ts,
                          reels.json, checklist.ts
    styles/               tokens.css, base.css
  public/
    fonts/                quicksand-variable.woff2, newsreader-regular.woff2,
                          newsreader-italic.woff2
    assets/               mark.svg
Dockerfile                two stage: bun builds, nginx serves dist/
nginx.conf                SPA fallback plus immutable asset headers
vite.config.ts            root v2, react plugin, outDir ../dist
```

**The app lives under `v2/`** and the toolchain files sit at the repo root because there is one toolchain.

## The Data Model

`src/data/types.ts` is the whole model. House style throughout: single quotes, no semicolons, no trailing commas, 120
columns, no `any`.

### Money And Time

**Money is whole ringgit, as a plain `number`.** `costRM` and `budgetRM` are integers in the fixture, and RM is attached
in `format.ts` rather than in the model. There is no sen unit and no cent-integer discipline; every price in the fixture
is a whole number, so no addition in the build ever produces a fraction.

**Times are `'HH:MM'` strings and durations are minutes.** `Place.opens` and `Place.closes` are clock strings parsed by
a four-line `minutes()` in `schedule.ts`; dwell minutes are plain minute counts. One destination, one timezone, so a
timezone library would be ceremony.

**Calendar Dates Are Real `Date` Work.** `format.dayLabel` builds one to render a date, `withDates` walks the calendar
in UTC, and `votingDeadline` computes the previous-day midnight in Asia/Tokyo. Place opening times and durations remain
string and minute arithmetic.

### Period, State And Kind

```ts
export type Period = 'morning' | 'afternoon' | 'evening'

export type OptionKind =
  | 'temple'
  | 'shrine'
  | 'market'
  | 'food'
  | 'museum'
  | 'park'
  | 'viewpoint'
  | 'mall'
  | 'entertainment'
  | 'street'
```

Three slots per day: morning, afternoon, evening. No midday period, no free-time dragging. Cards drop into named slots.

There is no slot state. Feasibility is a property of the day: green renders as `--decided`, gold as `--gold`, red as
`--at-risk`. Apply is guarded by `planCapacity`: a successful run fills every requested slot, and a run that cannot is a
no-op that leaves the existing plan, empty slots included.

### Place

```ts
export type Place = {
  id: string
  name: string
  kind: OptionKind
  cluster: ClusterId
  lat: number
  lng: number
  yen: number
  costRM: number
  dwellMin: number
  opens: string
  closes: string
  closedOn: string[]
  bestPeriod: Period[]
  tags: string[]
  blurb: string
  reel: Reel
}
```

`cluster` groups places by geographic area for the scheduler -- Asakusa and Ueno cluster together, Shibuya and Harajuku
together, and so on. The scheduler picks a cluster per day, fills a shortfall from the highest-ranked candidates in
other clusters, then orders by period and nearest neighbour.

`closedOn` holds lowercase weekday names and is compared against `Day.weekday.toLowerCase()`. `bestPeriod` is the field
the fit filter reads first: a place declares the periods it belongs in rather than a slot declaring what it wants.

### Slot And Day

```ts
export type Slot = {
  id: string
  period: Period
  placeId: string | null
  pinned: boolean
}

export type Day = {
  index: number
  date: string
  weekday: string
  tint: 1 | 2 | 3 | 4 | 5
  title: string
  /** In period order, morning then afternoon then evening; three by default, and each period may hold two. */
  slots: Slot[]
  /** Minutes after midnight when the day starts. 540 is 09:00. */
  startMin: number
  feasibility: DayFeasibility | null
}
```

**Three Slots Per Day By Default, Up To Six.** `Day.slots` starts with length 3 and a second slot can be opened in any
period, up to six per day. The first slot of each period never closes.

**Slot Occupancy.** `placeId` holds a place id or null when empty. The Perch drawer offers the next-ranked voted-in
place for an empty slot, while the state operation itself does not enforce the drawer's two-stop guard.

### Person, Votes, Manual Notes And Trip

```ts
export type Person = {
  id: string
  name: string
  initials: string
}

export type Answer = 'yes' | 'no' | 'must' | 'skip' | null

export type Votes = Record<string, Record<string, Answer>>

export type ManualSection = 'takeCare' | 'packing'

export type ManualNote = {
  id: string
  text: string
}

export type Trip = {
  id: string
  destination: string
  country: string
  startDate: string
  nights: number
  budgetRM: number
  ownerId: string
  /** Who this browser is voting as. The owner by default; the invite link lets a friend pick themselves. */
  currentMemberId: string
  /** ISO timestamp when voting closed, or null while it is open. */
  votingClosedAt: string | null
  party: Person[]
  days: Day[]
  options: Record<string, Place>
  legs: Leg[]
  votes: Votes
  pins: Pin[]
  checklist: ChecklistItem[]
  manualNotes: Record<ManualSection, ManualNote[]>
}
```

**Answers.** `Answer` is `yes`, `no`, `must`, `skip` or null. A `must` is a yes with a rank bonus; a member holds only
one, and a second `must` demotes the first to `yes`. A `skip` is an explicit abstention that still counts in the full
party denominator. Null means that member has not yet swiped on that place.

```ts
export const MAX_NOTE_LENGTH = 1000

export const withManualNote = (trip: Trip, section: ManualSection, text: string, id: string): Trip => { ... }
export const withoutManualNote = (trip: Trip, section: ManualSection, id: string): Trip => { ... }
```

**Manual Notes.** `manualNotes` holds personal notes for the `takeCare` and `packing` sections. They are local to the
browser and carry no owner-only enforcement; any current member can add or remove them, including after voting is
closed.

`withManualNote` trims the text and is a no-op when the result is blank, longer than `MAX_NOTE_LENGTH`, or the `id`
already exists in the section -- a duplicate id is rejected, duplicate text is not. `withoutManualNote` is a no-op for a
missing id. Successful changes return a new `Trip` without mutating the input or changing other fields. The provider
generates the add operation's `id` with `crypto.randomUUID()` before entering the state updater.

### Legs

The data model carries legs so the product can claim multi-city support through a type, not a screen.

```ts
export type Leg = {
  city: string
  startDay: number
  endDay: number
  transferMin: number
}
```

A leg is one city and a run of consecutive days, with a fixed transfer block between legs. The Tokyo demo uses one leg.
**No screen renders a leg switcher or a multi-leg calendar.** The type exists to anchor the README claim and is
exercised only in tests.

### Pin

```ts
export type Pin = {
  placeId: string
  dayIndex: number
  slotIndex: number
}
```

### ChecklistItem

```ts
export type ChecklistItem = {
  id: string
  label: string
  ticked: boolean
  derivedFrom: string
}
```

### Reel

```ts
export type Reel = {
  src: string
  poster: string
  platform: 'instagram' | 'xhs'
  creditHandle: string
  sourceUrl: string
}
```

### ClusterId

```ts
export type ClusterId =
  | 'asakusa-ueno'
  | 'shibuya-harajuku-shinjuku'
  | 'tsukiji-ginza-station'
  | 'odaiba-toyosu-teamlab'
```

### Travel Matrix

24 by 24 transit minutes, hand-authored from Google Maps transit estimates, committed as a fixture.

```ts
export type TravelMatrix = Record<string, Record<string, number>>

// travelMatrix[fromId][toId] = transit minutes
// Symmetric, zero diagonal, no null cells: every pair has an authored estimate.
export const travelMatrix: TravelMatrix = { ... }
```

The matrix is consumed by the scheduler's nearest-neighbour pass within a day. During the build phase, the matrix would
be replaced by a Google Routes API call per trip.

### Reels Manifest

One reel per place, the `Reel` type above, keyed by place id.

```ts
export type ReelsManifest = Record<string, Reel>
```

Reels are served from `gs://perch-reels` as small MP4s, 8 seconds, muted, 540x960. The manifest maps place id to reel
metadata. 24 reels are needed, 4 spares are authored.

### Checklist

Checklist derived from the trip fixture. All items must be ticked to enable Print The Book.

```ts
export const checklist: ChecklistItem[] = [
  { id: 'passport', label: 'Passport validity check', ticked: false, derivedFrom: 'destination:japan' },
  { id: 'suica', label: 'Suica or Welcome Suica card', ticked: false, derivedFrom: 'destination:japan' },
  { id: 'teamLab', label: 'teamLab ticket booked in advance', ticked: false, derivedFrom: 'cluster:odaiba-toyosu-teamlab' },
  { id: 'yen', label: 'Yen cash (enough for smaller shops)', ticked: false, derivedFrom: 'destination:japan' },
  { id: 'insurance', label: 'Travel insurance', ticked: false, derivedFrom: 'duration:4days' },
  { id: 'jrpass', label: 'JR Pass (not needed for Tokyo-only)', ticked: true, derivedFrom: 'destination:tokyo' },
]
```

## The Algorithm

This is the product. Everything else on this page is scaffolding for it. The scheduler is a heuristic, never called AI
in the UI copy: cluster by area per day, order by best period and opening hours, nearest neighbour within the day.

**Five Scheduling Rules.**

1. The schedule is built from the voted-in pool, with pinned cards as an additional source: owner priority raises the
   tally weight but the owner alone (1.5 of 4.5 in a four-person seed) does not guarantee a full calendar.
2. Owner priority: the owner's yes or must carries 1.5 weight. A `must` adds a 0.5 rank bonus and is held one at a time
   per member; a second `must` demotes the first to `yes` rather than being refused. The owner can pin a card; the
   scheduler never moves it.
3. The `remove` state operation empties a slot without a two-stop guard. The drawer separately hides Leave It Empty when
   removal would leave fewer than two stops. An empty day has null feasibility, and a partially filled day can still
   evaluate green; feasibility is not a fill guarantee.
4. Feasibility per day: green when every placed stop fits its hours and the day ends by 21:00; gold when it fits but the
   actual transit is more than 25 percent above the heuristic's own order for the same stops; red when a stop is closed
   that weekday, outside its hours or the day overruns 21:00. The span is measured from `Day.startMin`, defaulting to
   09:00, and opening waits are included.
5. A date change that is valid and different regenerates the empty calendar and clears pins; invalid or unchanged dates
   are a no-op. Votes survive because they are on places. A destination change is a new plan.

### The Scheduler

```ts
/**
 * Schedule all days in a trip. Pure, never mutates its input. Skips pinned cards: they stay
 * where the owner put them. Fills cross-cluster shortfall from the ranked pool before route
 * ordering. Returns Day objects with feasibility attached.
 */
export const scheduleTrip = (trip: Trip): Day[] => { ... }

export const scheduleOrder = (stops: Place[]): string[] => { ... }
```

In prose, five steps:

1. **Voted-In Pool.** Only cards at or above the rounded 50 percent threshold and not eliminated enter the unpinned
   pool. Zero-vote cards are excluded from it; pinned cards are the exception, sitting in their slots regardless of
   tally.
2. **Strongest Cluster Per Day.** Each day takes the cluster with the most candidates open on that weekday -- a count of
   open cards, not an aggregate rank -- preferring a cluster not yet taken, with the deterministic existing order
   breaking ties. Once every cluster has been taken it may be reused.
3. **Ranked Subset Before Ordering.** The day keeps only as many of the cluster's cards as it has open slots, taken in
   pool rank order, and any shortfall is filled with the highest-ranked candidates from other clusters that are open
   that weekday -- all before any route ordering.
4. **Period Match, Then Nearest.** For each open slot the scheduler prefers a card whose `bestPeriod` matches the slot's
   period, falling back to all of the day's selected cards when none match. With a previous stop it picks the nearest
   candidate; without one, the earliest opener. This is not a full TSP solve.
5. **Feasibility From `Day.startMin`.** A stop closed that weekday, reached outside its hours, or a day that ends after
   21:00 turns red. Gold compares the day's actual transit against `scheduleOrder(stops)`, which seeds on the earliest
   best-period rank and opening time then walks nearest neighbour -- a deterministic baseline, not a global optimum --
   and applies only when that transit is positive and the actual exceeds 1.25 times it.

**Pinned Cards Override.** The owner can pin any card to a specific day and slot. The authority is the slot itself --
`slot.pinned` with a non-null `slot.placeId` -- not a lookup in `trip.pins`, and the scheduler never moves that card.
The day is scheduled around pinned cards, filling remaining slots from the remaining pool. A pinned card closed on that
weekday stays pinned and the day warns through feasibility.

### Plan Capacity

```ts
export const maxTripDays = (trip: Trip): number => Math.floor(Object.keys(trip.options).length / 3)

export const planCapacity = (
  trip: Trip
): { maxDays: number; availablePlaces: number; requiredPlaces: number; canFill: boolean } => { ... }

export const withDates = (trip: Trip, startDate: string, nights: number): Trip => { ... }
export const withDayStart = (trip: Trip, dayIndex: number, startMin: number): Trip => { ... }
export const withOptimizedPlan = (trip: Trip): Trip => { ... }
```

**Content Ceiling.** `maxTripDays` is `floor(options / 3)`. With 24 options the fixture allows up to 8 days. It is a
content ceiling, not a tally or hours check.

**Date And Start Updates.** The provider delegates `setDates` to `withDates`, `setDayStart` to `withDayStart` and
`apply` to `withOptimizedPlan`. `withDates` requires a real `YYYY-MM-DD` start date, integer `nights >= 0` and
`nights + 1 <= maxTripDays`; invalid input or unchanged dates return the original `Trip` reference.

Changed dates rebuild the calendar as UTC days with `startMin` 540, clear the pins, rebuild a single leg, and keep votes
and manual notes.

`withDayStart` matches on `Day.index`, not the array position, and takes an integer `0..1439`; a missing day, an invalid
value or the same value returns the original trip. A successful change recomputes that day's feasibility and leaves the
other day references untouched.

`availablePlaces` counts distinct voted-in ids plus known ids in actual pinned slots. `requiredPlaces` sums
`day.slots.length` across all days, including empty slots and extra slots.

`planCapacity` scans occupied pinned slots for known options with `Object.hasOwn` before running the scheduler, and
ignores stale `trip.pins` entries. `canFill` additionally requires nonempty days, a positive required count, and a
schedule where every requested slot is filled with a distinct id known to `trip.options`; a closed but known pinned
place can still yield `canFill: true` while its day warns red. Duplicate placed ids make `canFill` false.

This is not an hours-feasibility guarantee, a general malformed-input boundary or a global solver.

`withOptimizedPlan` writes scheduled days only when `planCapacity` reports `canFill`; on success it schedules twice --
once inside `planCapacity` and once to write the days -- and on failure it returns the original `Trip` reference. The
visible controls for these contracts are pending under #311, #313 and #317.

### Feasibility

```ts
/**
 * Feasibility per day. Three status values:
 * - 'green': every stop fits its hours and the day ends by 21:00
 * - 'gold': fits but transit is more than 25% above the heuristic's own order for the same stops
 * - 'red': a stop is closed that weekday, outside its hours, or the day overruns 21:00
 */
export type DayFeasibility = {
  status: 'green' | 'gold' | 'red'
  /** Why a red day is red: closed, hours, or overrun. */
  reason: 'closed' | 'hours' | 'overrun' | null
  transitMin: number
  dwellMin: number
  daySpanMin: number
  /** Minutes after midnight when the last stop is left. */
  endMin: number
  stopsOutsideHours: string[]
  rationale: string
}

export const evaluateDay = (
  day: Day,
  options: Record<string, Place>
): DayFeasibility | null => { ... }
```

| State | Means                                                                       | Rendered As                  |
| ----- | --------------------------------------------------------------------------- | ---------------------------- |
| Green | Every stop fits its hours. The day ends by 21:00.                           | Green tint on the day header |
| Gold  | Fits, but transit is more than 25 percent above the heuristic's own order   | Gold tint, slower badge      |
| Red   | A stop is closed that weekday, outside its hours, or the day overruns 21:00 | Red tint, what-went-wrong    |

**Null And Green.** `evaluateDay` returns null for a day with no stops, which renders as the blank state. Green
certifies only the stops that are placed: a day with empty slots can still be green, so green is not a guarantee the day
is filled.

**Two Golds.** The gold day state is not the gold unanimous border in the tally: one marks a day that fits but runs
slow, the other a tally row every member backed.

**`gold` is new for this rebuild**, matching the Black-naped Oriole token `--gold`. It means the owner has re-ordered
the day by dragging and the day is viable but noticeably suboptimal. The gold tint communicates this without requiring a
"this could be better" block of text.

**`red` always carries a rationale.** "Stops outside hours" names which one. "Day overruns" names by how many minutes.

### The Tally

```ts
export type TallyEntry = {
  placeId: string
  name: string
  /** Displayed as a rounded integer. */
  percentage: number
  /** True when every member, owner included, said yes or must. */
  unanimous: boolean
  /** True when the weighted yes score is zero. */
  eliminated: boolean
  /** Members who marked this place Must Go. */
  mustBy: string[]
}

/**
 * Compute the tally from votes. The owner's yes or must carries 1.5 weight.
 * A must is a yes for the percentage and adds a 0.5 rank bonus to the score.
 * Returns entries sorted by weighted score descending, ties broken by fixture order.
 * Places at or above the rounded 50 percent threshold and not eliminated are the ranked voted-in list.
 */
export const computeTally = (
  votes: Votes,
  options: Record<string, Place>,
  party: Person[],
  ownerId: string
): TallyEntry[] => { ... }
```

**Percentage Per Place.** Weighted yes over total possible weight. Each member's yes or must is 1, the owner's is 1.5.
`no`, `skip` and unanswered answers keep the full party in the denominator, so partial results are legitimate: a member
with an incomplete deck can still have a valid Must Go. The percentage is rounded for display.

With four people (one owner), the total possible weight is 4.5 and the owner alone is 33 percent; the share changes with
party size. Unanimous means every member said yes or must. Eliminated means weighted yes is zero. The ranked voted-in
list is places at or above the rounded 50 percent threshold and not eliminated, weighted score descending, ties broken
by fixture order.

| Condition         | Effect                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Unanimous (All)   | Marked gold. Still does not guarantee a calendar place when capacity is limited           |
| Eliminated (Zero) | Greyed, eliminated. The scheduler never considers them unless the owner pins one          |
| Must Go Bonus     | Adds 0.5 to the ordering score, not the percentage. Each member holds one at a time       |
| Owner 1.5 Weight  | The owner's yes or must counts 1.5, giving 33 percent in the four-person seed (1.5 / 4.5) |
| Owner Pinned      | Not in the tally. Pins are a Desk operation and can bypass the tally threshold            |

**Primary Input, Pins Excepted.** Within `scheduleTrip`, pinned slots survive regardless of tally; zero-vote cards never
enter its unpinned pool. The Perch drawer draws from `waitingPlaces`, which is voted-in cards not yet placed anywhere on
the trip; cards below the threshold are not offered.

### Owner Priority And Pins

Two mechanisms give the owner control without making the group's input decorative.

1. **Owner Vote Weight 1.5.** The owner's swipe counts 50 percent more than a regular vote: 1.5 of 4.5, or 33 percent,
   in the four-person seed. That is below the 50 percent threshold, so the owner cannot carry a place into the
   scheduling pool alone, and cannot override a clear group preference (3 regular votes = 3.0 vs 1 owner vote = 1.5). A
   pin, not the vote, is what bypasses the tally
2. **Owner pins a card to a day and slot.** Once pinned, the scheduler never moves it. Pin is a Desk operation: the
   owner drags a card onto the calendar and pins it. Pinned cards carry a pin indicator in the calendar grid

```ts
export const pinCard = (
  trip: Trip,
  placeId: string,
  dayIndex: number,
  slotIndex: number
): Trip => { ... }

export const isPinned = (trip: Trip, placeId: string): boolean => { ... }
```

**Deleting a pinned card removes the pin.** The card returns to the sidebar pool and the slot opens for the Perch
drawer.

### The Perch Drawer

When the owner removes a card from a slot, the Perch drawer opens from that slot offering the next-ranked voted-in card
that is open on the weekday, fits the slot's period and is not already placed anywhere on the trip -- the exclusion
spans every day, plus the stops of a hypothetical day passed in for checking.

```ts
/**
 * Find the next best replacement for a slot. Draws from voted-in cards that are not already
 * placed anywhere on the trip, open on this weekday, and matching this period, in tally rank order.
 */
export const nextReplacement = (
  slot: Slot,
  day: Day,
  trip: Trip,
  tally: TallyEntry[]
): Place | null => { ... }
```

| Situation                        | Behaviour                                                        |
| -------------------------------- | ---------------------------------------------------------------- |
| Replacement exists               | Drawer shows the top ranked option                               |
| No replacement fit               | Drawer says the slot can stay empty. Day must keep 2 other stops |
| Owner rejects the replacement    | Next ranked option slides into view                              |
| Day has fewer than 2 stops after | Drawer refuses to close: the day needs at least two stops        |

**The Perch drawer is the same mechanism for all slots.** It is not a separate "pick a replacement" screen -- it is the
same `Perch.tsx` component mounted over the calendar slot. The drawer shows the replacement card and its tally
percentage. The owner can accept or cycle to the next option.

**The two-stop floor is enforced at the Perch drawer level.** Removing a card that would bring a day below two stops is
rejected; the drawer offers the next-ranked voted-in card from the tally.

## State And Persistence

**One context, one `useState`, one operation per write.** `state.tsx` is the only place a `Trip` is written, and every
write is a whole-object replacement. The list grew through the release cycle; this table is the contract.

| Operation          | Writes                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `swipe`            | A member's yes, no, Skip or Must Go for a place. A second Must Go demotes the first to yes                                      |
| `setCurrentMember` | Only switches which member this browser votes as; the load-time backfill to the owner is a separate step                        |
| `endVoting`        | Owner acting as the current member: fills null or missing answers with `skip`, freezing votes and member add/remove             |
| `renameMember`     | A new name on the same id, so the votes stay; allowed while voting is open or closed                                            |
| `addMember`        | A new member with a fresh id and no votes. Refused past six and once voting is closed                                           |
| `removeMember`     | Drops the member and their votes. Refused for the owner and once closed; removing the active member restores the owner identity |
| `place`            | Puts a place into a day and slot, taking it out of any slot it held                                                             |
| `remove`           | Empties a day and slot                                                                                                          |
| `apply`            | Writes scheduled days only when `planCapacity` can fill; otherwise preserves the existing plan                                  |
| `pin` / `unpin`    | Fixes a card to a day and slot, or frees it. The scheduler never moves a pinned card                                            |
| `tick`             | Toggles a checklist item                                                                                                        |
| `setDates`         | New start and nights regenerate the days and clear pins; unchanged or invalid dates are a no-op                                 |
| `setDayStart`      | Sets when a day starts, a valid integer 0..1439, and recomputes that day's feasibility only                                     |
| `addSlot`          | Opens a second slot in a period of a day. Two per period, six per day; raises required capacity                                 |
| `removeSlot`       | Closes a period's second slot, only while empty. The first slot of a period never goes                                          |
| `addManualNote`    | Adds a personal note to `takeCare` or `packing`, 1..1000 chars, no duplicate ids in the section                                 |
| `removeManualNote` | Removes a personal note by id                                                                                                   |
| `restart`          | Clears the storage key, reloads the seed and runs the voting-deadline check on it                                               |

### Voting Session

```ts
export const votingDeadline = (trip: Trip): Date | null => { ... }
export const finalizeVotingIfDue = (trip: Trip, now: Date = new Date()): Trip => { ... }
export const closeVoting = (trip: Trip, actorId: string, now: Date = new Date()): Trip => { ... }
export const castVote = (
  trip: Trip,
  memberId: string,
  placeId: string,
  answer: boolean | 'must' | 'skip',
  now: Date = new Date()
): Trip => { ... }
```

**Deadline.** `votingClosedAt` is `null` while voting is open and an ISO timestamp once closed. `votingDeadline`
validates `startDate` as a real ISO date and returns midnight Asia/Tokyo on the calendar day before it: a start of
2026-11-20 yields `2026-11-18T15:00:00Z`, which is 19 November 00:00 in Tokyo. There is no real authentication; a manual
`closeVoting` acts only when the actor is both the owner and the current member.

**Evaluation.** The deadline is checked on initial load and restart, on mount, on a 60 second interval, on `window`
focus, and inside `castVote` as an expiry catch-up that may close the round first. There is no background server and no
cross-device sync. Changing the dates does not immediately rerun the expiry effect.

**Closure.** The first closure fills only null or missing answers on known member and place pairs with `skip`, records
the timestamp, and freezes voting plus member add and remove. Rename and manual notes are not frozen, and closure does
not touch pins or the schedule. Idempotent means an already-closed trip returns the same object; it does not fill votes
that became missing later.

`castVote` validates a known place, a known member and the current identity before writing. The controls are pending
under #307, #308 and #309.

### Trip States

**Five states, derived from the trip rather than stored, so a surface cannot disagree with the data it shows.** The
dashboard reads them to decide which controls appear; the copy on each surface says which state the reader is in and
what personal completion does and does not mean.

| State             | Derived From                                                         | Dashboard Shows                                                                 |
| ----------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Setup**         | No dates, or the owner has no name                                   | Finish Setup only                                                               |
| **Voting, mine**  | The current member has unanswered places                             | Open The Deck, the invite link, who has finished                                |
| **Voting, group** | I have finished; someone in the party has not                        | View Current Tally, the invite link, _You have finished · 3 of 4 have finished_ |
| **Planned**       | Every day has feasibility, and no vote or member changed since Apply | Open The Desk, Before We Go, The Book                                           |
| **Needs review**  | Days are planned, and a vote or member changed after the last Apply  | Open The Desk with a _votes changed since the days were planned_ line           |

**Planning During Voting.** The Tally is provisional until the round closes: an unanswered member still counts in the
total weight, so open-session answers can move percentages and change who qualifies, and closing fills what is missing
with `skip`. The Desk rebuilds the days only on the next Apply, which is itself a no-op when `planCapacity` cannot fill
every slot.

Editing the trip through onboarding is _Edit Trip_, not _New Plan_: the prototype holds one trip, and the calendar
survives an edit that leaves the dates alone.

**One `useEffect` mirrors the trip to `localStorage` on every change**, including the first render, so a cold visit
writes the seed immediately and the surfaces share one object from the first paint.

### The Storage Contract

```ts
const KEY = 'perch.trip.v1'

export const load = (): Trip => { ... }
export const save = (trip: Trip): void => { ... }
export const reset = (): void => { ... }
```

**Load Path.** `load` validates the stored object with the shallow `isTrip` predicate, not a full schema check. A
mismatched `id`, or a throw during read, parse or evaluation, falls back to the seed; a cold load returns the seed
fixture as authored, before the provider runs its expiry check.

**Migrations.** `currentMemberId` is backfilled to `ownerId` only when nullish. A missing or invalid `Day.startMin`
becomes 540 and feasibility is recomputed; a valid `startMin` keeps the stored feasibility, or null when none was
stored. `manualNotes` is checked only for the two arrays of `{ id: string, text: string }` -- there is no max-length or
duplicate validation on load -- and a malformed shape resets both sections to empty.

| Migration                         | Source Shape                  | Result                                     |
| --------------------------------- | ----------------------------- | ------------------------------------------ |
| Missing `currentMemberId`         | Stored before member switcher | Defaults to `ownerId`                      |
| Missing `votingClosedAt`          | Stored before voting closure  | Defaults to `null` (open)                  |
| Missing or invalid `Day.startMin` | Stored before day start times | Resets to 540, recomputes feasibility      |
| Valid `Day.startMin`              | Stored with day start times   | Kept; stored feasibility retained, or null |
| Malformed `manualNotes`           | Stored before manual notes    | `{ takeCare: [], packing: [] }`            |

Three properties, and each is a decision rather than an accident.

- **One Storage Key.** The whole `Trip` is the value. Not a delta against the fixture. One key means one thing to clear,
  and a demo that has to be repeatable needs exactly that
- **Fixture Identity.** A stored trip whose `id` does not match the seed's is discarded. That is the version check:
  change the fixture's id and every stored copy in the room is stale
- **Storage Failures.** Every read and write is wrapped. `localStorage` throws in some privacy modes, so a storage
  failure degrades to forgetting between reloads rather than blanking a screen

## The Shared Link With No Backend

**What is built.** Aisyah sends `/t/tokyo-nov-2026`. The route exists, resolves, and renders The Book cold -- no stored
state required, no bounce to the sign in, no 404 on a hard refresh. That last one is why `nginx.conf` carries an SPA
fallback: `/t/<trip>` has no file behind it.

**The swipe link is separate.** Joiners land at `/t/:tripId/swipe`, which renders the reel deck. They never see
onboarding or The Book. The invite link is the swipe link.

**One device, one browser, one storage key.** The Desk and The Book are two routes over the same context, so a pin made
on `/desk` is visible on `/t/tokyo-nov-2026` because it is the same object in the same tab, not because anything synced.
Four limits follow, and the video must not imply otherwise.

- **Nothing crosses a device.** There is no fragment payload, no encoding, no server. A second phone opening the link
  gets the seed fixture, not Aisyah's trip
- **The `:tripId` segment is not read.** The Book renders whatever is in the store; `/t/anything` shows the same trip
- **It is not a secret.** Anyone holding the link holds the trip. Deliberate -- no account, no install
- **The party's votes are fixture data.** Farah, Hana and Iman have already swiped, which is what gives the tally
  percentages something to show before anybody opens the app

**Closing the round trip is the first thing a backend would buy**, and it is the honest first line of the build phase's
backlog rather than a gap to paper over on stage.

## Styling, Motion And Fonts

**Two registers.** The Desk is an instrument (paper `#FBF8F2`, Quicksand only, radius 24 or 999 and nothing between,
pill buttons, one solid button per screen). The Book is a plate (plate `#F2EDE0`, zero radius, Newsreader prose).

**`tokens.css` carries the palette under the design's own names**, so a token in the CSS and a row in the design spec
are searchably the same string. There is no Tailwind, no CSS-in-JS and no preprocessor.

**A surface override of a `.t-*` type role loses on source order, not specificity.** `.t-specimen` sets `color`, and
`base.css` loads after every surface stylesheet, so a single-class override such as `.reel-line` is beaten by it. Scope
the override to its parent, `.reel-foot .reel-line`, and it wins. Found on The Deck, and it applies to every surface.

```css
:root {
  --ink: #2e261f;
  --paper: #fbf8f2;
  --plate: #f2ede0;
  --open: #1b7f86;
  --decided: #3e7a3a;
  --at-risk: #c0342f;
  --gold: #e8a317;   /* Black-naped Oriole, unanimous tally and slow days */

  --day-1: #c2622f;  /* Rufous-collared Kingfisher */
  --day-2: #2a4c9b;  /* Asian Fairy-bluebird */
  --day-3: #e0a32c;  /* Yellow-vented Bulbul */
  --day-4: #6e4a8e;  /* Violet Cuckoo */
  --day-5: #b0567e;  /* Pink-necked Green Pigeon */
}
```

**`--gold` is new for this rebuild.** It colours unanimous tally entries and days that fit but run slow (the gold
feasibility state). The token matches the Black-naped Oriole naming convention of the existing palette.

**Radius is the mechanic, not a style value.** `--r-desk` 24px, `--r-pill` 999px, `--r-plate` 0. The plate has zero
radius by name, not by omission, so a stray 24px cannot leak from The Desk onto a plate.

**Motion.** One branded mechanic: the perch step-forward. Everything else is a 120ms cross-fade.
`prefers-reduced-motion` is respected. The calendar drag uses the `@dnd-kit/core` drag gesture -- a card flies into its
slot on Apply with a 40ms stagger and the same easing as the perch step-forward. Only the top two reel cards mount their
video element to keep the DOM tree small.

### Type And Fonts

Quicksand for instrument surfaces, Newsreader for prose in The Book. Self-hosted so the demo cannot fail on someone
else's network.

| File                       | Face                                                             |
| -------------------------- | ---------------------------------------------------------------- |
| `quicksand-variable.woff2` | Quicksand, variable face with a `wght` axis, The Desk's typeface |
| `newsreader-regular.woff2` | Newsreader 16pt, The Book's prose face                           |
| `newsreader-italic.woff2`  | Newsreader 16pt italic, specimen lines in The Book               |

**Five type roles.** `.t-display` and `.t-plate-title` at weight 300. `.t-label` at 700 uppercase with `0.06em`
tracking. `.t-name` at 700. `.t-specimen` at 400 italic. `.t-prose` in Newsreader at 18px. Tabular numerals set globally
so every price and minute count aligns. `index.html` preloads Quicksand, which paints first and appears everywhere; The
Book loads Newsreader on navigation.

## Container, Deploy, Build And Run

[README.md](README.md#deployment) is the reference. `.github/workflows/deploy.yml` runs `docker build .` then
`gcloud run deploy` on every push to `main`.

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

**The fallback is load-bearing, not hygiene.** `/t/tokyo-nov-2026` and `/t/:tripId/swipe` are client routes with no file
behind them. The immutable headers are safe because Vite content-hashes everything it emits into `/assets/`.

```bash
bun install          # dev tooling, app dependencies
bun run dev          # vite, on the port it prints
bun run build        # vite build, into dist/
bun run preview      # vite preview --port 8080
bun run lint         # biome check . && prettier --check on md/yaml
bun run typecheck    # tsc --noEmit
```

**`build` does not typecheck.** `vite build` transpiles without checking types. That split is deliberate: a failing
typecheck should not be discovered as a Docker build failure four minutes into a deploy.

## The Fixture

Committed TypeScript fixtures. 24 Tokyo places, one trip, one votes fixture, one travel matrix, one reels manifest, one
checklist. No network call from these pages.

### Tokyo Places

24 places across four clusters, one cluster per demo day.

| Cluster                       | Places                                                                                                                        |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Asakusa and Ueno              | Sensoji, Nakamise, Kappabashi, Ueno Park, Tokyo National Museum, Ameyoko                                                      |
| Shibuya, Harajuku, Shinjuku   | Meiji Jingu, Takeshita Street, Shibuya Crossing, Shinjuku Gyoen, Omoide Yokocho, Tokyo Metropolitan Building                  |
| Tsukiji, Ginza, Tokyo Station | Tsukiji Outer Market, Hama-rikyu Gardens, Ginza Chuo-dori, Imperial Palace East Gardens, Tokyo Station Marunouchi, Nihonbashi |
| Odaiba, Toyosu, teamLab       | teamLab Planets, Toyosu Market, Odaiba Beach, DiverCity Gundam, Daiba Park, Hachitama Observatory                             |

Each place carries: `id`, `name`, `kind`, `cluster`, `lat`, `lng`, `dwellMin`, `costRM`, `opens`, `closes`, `closedOn`,
`bestPeriod`, `tags`, `blurb`, `reel`. Prices are the foreign gate rate in ringgit.

### Votes Fixture

Farah, Hana and Iman have already swiped so the tally has percentages the moment Aisyah finishes.

| Property             | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| At least 2 unanimous | Sensoji (all four), Meiji Jingu (all four)             |
| At least 2 zero      | Hama-rikyu Gardens (0), Daiba Park (0)                 |
| Owner (Aisyah)       | 1.5 weight on Sensoji, Shinjuku Gyoen, teamLab Planets |

### Travel Matrix

24 by 24 transit minutes, hand-authored from Google Maps transit estimates. `travelMatrix[fromId][toId]` is minutes by
transit between any two places. The matrix is symmetric with a zero diagonal and no null cells.

### Reels Manifest

24 reels and 4 spares were sourced on 8 September; 27 of the 28 fetched, cut to 8 seconds, muted, 540x960, and uploaded
to `gs://perch-reels`. The manifest at `v2/src/data/reels.json` maps place id to
`{ src, poster, platform, credit, source }` under a bucket base URL.

| Platform    | Fetched | Note                                                                                      |
| ----------- | ------- | ----------------------------------------------------------------------------------------- |
| Instagram   | 27      | Public reels resolve anonymously. Omoide Yokocho is audience-restricted and needs a login |
| Xiaohongshu | 0       | Tried and dropped, 8 September: see the note below                                        |

**Why the mix is Instagram only, recorded so nobody repeats the attempt.** The pipeline works against Xiaohongshu: a
`discovery/item` link with its `xsec_token` downloads against exported cookies. The source material does not. Its video
notes are often landscape, 1280x720 on the one clean Nihonbashi candidate, which the 540x960 crop would reduce to a
narrow slice; and burned-in caption banners are the house style, so the text-free covers were the landscape ones. The
constraint that matters for a swipe card is vertical and text-free, and Instagram Reels are natively 1080x1920. If a
Xiaohongshu clip ever goes in, yt-dlp reports its uploader as `NA`, so the credit handle has to be filled by hand.

### Checklist Fixture

Six items derived from a Tokyo trip in November. All must be ticked to enable Print The Book.

| Item              | Ticked | Derived From                  |
| ----------------- | ------ | ----------------------------- |
| Passport validity | No     | destination:japan             |
| Suica card        | No     | destination:japan             |
| teamLab ticket    | No     | cluster:odaiba-toyosu-teamlab |
| Yen cash          | No     | destination:japan             |
| Travel insurance  | No     | duration:4days                |
| JR Pass           | Yes    | destination:tokyo             |

### Handbook Fixture

`data/handbook.ts` holds every line the Handbook can say, and imports the `HandbookEntry` and `NewsItem` types from
`data/types.ts`. `handbookFor(trip)` returns only the lines the trip earns: Take Care entries whose `derivedFrom` is a
fact of the trip, news rows dated inside the trip, and packing entries whose derivation is the destination, a place kind
on the calendar or a news trigger such as `weather:rain`.

```ts
export type HandbookEntry = {
  id: string
  title: string
  text: string
  derivedFrom: string
  source: string
}

export type Handbook = {
  takeCare: HandbookEntry[]
  news: NewsItem[]
  packing: HandbookEntry[]
}
```

**Authored Normals, Not A Forecast.** The news rows are authored fixture data for this November 2026 trip: the weather
lines are climate normals attributed in the fixture to the Japan Meteorological Agency, while the sunset, autumn colour
and 23 November holiday rows carry their own named sources. The attributions are recorded as authored, not re-verified
here.

`factsOf` adds every non-null `NEWS.triggers` value regardless of the trip's dates, so packing derivations are not fully
date-scoped even though the displayed news rows are.

| Section   | Entries | Derived From                                                                        |
| --------- | ------- | ----------------------------------------------------------------------------------- |
| Take Care | 9       | `destination:japan`, `kind:shrine`, `kind:temple`, `kind:museum`, `tag:street-food` |
| News      | 5       | The trip's dates: climate normals, sunset, autumn colour, the 23 November holiday   |
| Packing   | 7       | `destination:japan`, `kind:temple`, `weather:rain`, `weather:cool`                  |

### The Prototype Controls

**The Desk carries a labelled block called `Prototype Controls`, inside the product surface, saying it is not part of
the product.** One button: `Start Over` clears the storage key and reloads the seed.

## Known Limitations

Each of these is true of the prototype today. None of them blocks the 13 September submission; most are the build
phase's opening backlog, and the pending-control rows are prototype integration work still in flight.

| Limitation                                      | What Is Actually Wrong                                                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Transit Minutes Are Estimates**               | The travel matrix is hand-authored from Google Maps transit estimates, not a routed result, and can be wrong by ten minutes either way        |
| **`/t/:tripId` Is Never Read**                  | `useParams` is not called, so `/t/anything` renders the stored trip. There is one trip, so nothing is wrong on screen                         |
| **Votes Are Fixture Data**                      | Farah, Hana and Iman have already swiped, and Farah's deck is partial. No live voting crosses devices; the fixture votes are editable locally |
| **Reels Are Static Files**                      | The manifest is committed. No CMS, no upload UI, no creator workflow                                                                          |
| **No Backend, No Cross-Device Persistence**     | The storage key is per browser. A second phone opening the link gets the seed, not Aisyah's trip                                              |
| **Checklist Is Fixture-Derived**                | Items are hardcoded from the trip fixture, not inferred from the trip's actual content                                                        |
| **Manual, Capacity And Start Controls Pending** | The data contracts are in code; the requested UI controls are still being integrated under #305–#344, alongside the existing Deck controls    |
| **Voting Expiry Is Client-Side Only**           | The deadline is checked only while the browser is open. There is no server, no cross-device sync and no real authentication                   |
| **Plan Capacity Failure Is Unexplained In UI**  | `apply` preserves the existing plan when the scheduler cannot fill every slot; the UI that explains this is pending                           |

## Specified, Not Yet Built

**Everything in this section is designed and deferred.** It is written down because each rule was reasoned through and
each one is cheap to build once the build phase opens.

### Strength Of Swipe

A zero to one hundred value per swipe, raised in mentor session 1, replacing the binary answer in the build phase.

### Tag Weights From Free Text

New Plan's free text answer feeds an LLM that produces tag-style preferences. Each tag gets a weight. The scheduler uses
these weights as a tie-break when two options have equal tally percentages.

```ts
export const tagWeightOf = (place: Place, tagWeights: Record<string, number>): number =>
  place.tags.reduce((total, tag) => total + (tagWeights[tag] ?? 0), 0)
```

The LLM call is one per new plan. The model choice, key and cost ceiling are undecided.

### Real Data Sources

The places, hours and prices that are hand-authored today would come from OpenStreetMap, Wikidata and Wikimedia Commons.
See [The Real Place Data Gap](#the-real-place-data-gap). The Handbook's news rows would come from a weather API keyed to
the trip's dates and city, and its disruption lines from the transit operators' service notices; the etiquette and
packing lines stay authored per destination, since no API writes advice.

## The Real Place Data Gap

PRODUCT.md lists this under What Would Kill This as **"Solved for the stage we are in"**, and points here. Naming what
that means is this file's job.

**What the fixture stands in for.** `src/data/places.ts` hand-authors, for 24 options: name, kind, cluster, lat, lng,
dwell minutes, cost in ringgit at the foreign gate rate, opening and closing times, the weekdays it is shut, the periods
it belongs in, tags, a one-line blurb, and a reel reference.

**Four of those fields are load-bearing and the rest are decoration.** `fits` reads `bestPeriod`, `closedOn`, `opens`
and `closes`, plus transit from the matrix for the reach ceiling. Names, prices, areas, tags and blurbs can stay
authored for a single demo destination indefinitely without weakening the claim. **Hours cannot**, because the claim is
that the itinerary knows what can break it.

**And hours are the field the free sources are worst at.** That is the sharp version of the gap.

| Source Considered            | Gives                                       | Costs                                                                                                             |
| ---------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Google Places API**        | Names, hours, prices, photos, at coverage   | Rejected. Terms cap caching at 30 days and forbid storing photos. Forces a server because a browser key is public |
| **OpenStreetMap / Overpass** | Names, locations, some hours. Free, ODbL    | Coverage is uneven place to place. Hours use `opening_hours` syntax and need a parser. No price data at all       |
| **Wikidata / Wikipedia**     | Names and a usable blurb. Free              | Nothing for hours, nothing for price                                                                              |
| **Wikimedia Commons**        | Place photos and imagery. Free, CC-licensed | No hours, no prices, no structured data beyond what Wikidata links provide                                        |
| **A Hand-Authored Fixture**  | Exactly what the demo needs, free, offline  | A lie about scale, and it does not survive a second destination                                                   |

**The team decision, 8 September 2026.** Places are seeded from OpenStreetMap, Wikidata and Wikimedia Commons. Google
Places API is not used, governed by two term limits that make it unusable for this product:

1. **30-day caching cap.** The Accepted Use Policy limits `placePhoto` and `placeDetails` responses to 30 days of
   caching. A trip planner whose data goes stale in 30 days cannot hold a meaningful pre-trip itinerary
2. **Photo storage prohibition.** Storing Google Places photos for longer than a transient display is explicitly
   forbidden. The Book's plates require persistent imagery

Google is used only for a transit directions deep link per day in The Book, which needs no API and no key, and in the
build phase a single Routes API call per trip to get transit minutes between consecutive stops.

**Three things must be decided before the build phase opens on 21 September.**

1. **Whether there is a server at all.** A keyed place API forces one. The OSM-and-commons path means the places
   database is a committed JSON file that the build pipeline refreshes, not a live API call
2. **Whether we ship one destination properly or many badly.** One destination with authored hours is honest and
   demoable; many destinations with patchy hours breaks the mechanism
3. **What happens to hours we cannot get.** `opens` and `closes` are non-nullable strings today, so an option with
   unknown hours cannot be expressed. Real data means an explicit unknown case, and the scheduler has to decide whether
   unknown counts as a survivor

**None of this blocks the 13 September submission.** The prototype rubric scores no code, and shipping a fixture with
its provenance declared is the correct prototype-phase answer.

## Open Decisions

Four things that need a person, not a commit. Each is one decision and none of them is technical.

| Decision                | The Situation                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **An icon set**         | None is chosen and none is installed. Nothing in the eight surfaces needs one today. If a later surface does, it is a dependency decision not yet made |
| **LLM model and key**   | The build phase needs an LLM for free text parsing and rationale writing. The model, key provisioning and cost ceiling are undecided                   |
| **Auth provider scope** | Supabase auth is scoped to email-password and magic link. Google SSO, Apple SSO and other providers are deferred                                       |
| **Reel licensing**      | The clips are other people's videos, credited on the card and never committed; the team accepts that for a prototype and must decide before the build  |
|                         | phase whether the product ships with creator-uploaded or licensed footage                                                                              |
