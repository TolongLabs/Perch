# Video Script - Perch

The 3-5 minute prototype submission video, verbatim spoken text with timings. Tracks
[issue #10](https://github.com/TolongLabs/Perch/issues/10). Ideation, mentor consultation and idea evolution are scored
from `docs/README.md`, not this video - the organisers said so directly at Kick-Off - so none of it is spoken here.

**At a glance: 758 words, 259.9s of narration at 175 words per minute (about 4:20), inside the 4:15-4:45 hard bound.**

**Re-keyed once already.** The first cut spent 102s of the film - more than a third - on static title cards and a held
Landing screen, which reads as a stall past about 12 seconds. This version keys every line to a picture someone can
actually shoot: a title card, the live Landing screen, or one of the ten walkthrough beats. Framing is now ~54s, and the
seconds that came off it went onto `shot-4` and `shot-7`, the two beats with the most on-screen reading.

---

## Header

| Field              | Detail                                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Runtime target** | 4:15-4:45, hard bound. 758 words of narration is 259.9s (about 4:20). The cut film is expected a little longer once the recorder's natural gaps between lines and beats are in                                                                                     |
| **Team**           | TolongLabs, four members. Roster names are filled in by the team leader before upload, per `docs/README.md`                                                                                                                                                        |
| **Format**         | Screen capture of the live prototype at `https://prototype-yskhynz4la-as.a.run.app`, opened in incognito, narrated over, plus a small number of title cards. No slide deck in this cut - `docs/demo/slides.html` is a separate deliverable for a different purpose |
| **Voice**          | One narrator throughout. `scripts/demo/speak.py` renders it with Kokoro `af_heart` at speed 1.0, measured at 175 words per minute; a human reading at a similar pace works identically                                                                             |
| **YouTube title**  | The team name only - `TolongLabs` - per the organisers' rule recorded in `docs/brief.md`                                                                                                                                                                           |
| **Output file**    | `TolongLabs.mp4`, matching `scripts/demo/README.md`'s `DEMO_OUT` default                                                                                                                                                                                           |
| **Beat names**     | `shot-1` through `shot-10` already match `scripts/demo/record.mjs` one for one. `open`, `landing`, `stack` and `close` are new and do not exist in `record.mjs` yet - see Production Notes                                                                         |

---

## Picture Inventory

The shot list as given, with what this script actually spends against each ceiling.

| Beat               | Picture Available                                                                                   | Ceiling  | This Script |
| ------------------ | --------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `open`             | Title card: TolongLabs, the product name, one line beneath. Paper ground, real type                 | ~12s     | 11.3s       |
| `landing`          | The live Landing screen at `/`: eyebrow, hero, and its three columns The Deck / The Desk / The Book | ~16s     | 15.4s       |
| `shot-1`-`shot-10` | The ten walkthrough beats                                                                           | budgeted | 205.4s      |
| `stack`            | A title card listing the stack, then a second card with the build span                              | ~14s     | 14.1s       |
| `close`            | The Book's Tokyo cover plate, then an end card: product name and TolongLabs                         | ~14s     | 13.7s       |

Framing (`open` + `landing` + `stack` + `close`) totals 54.5s against the "roughly 56" target. `shot-1`-`shot-10`
absorbs the rest, unchanged for eight of the ten beats and deliberately expanded for `shot-4` and `shot-7`.

---

## Format Notes And Conventions

- Routes are written in backticks: `` `/new` ``.
- Spoken lines are the exact words to read, quoted in full, sentence case, contractions kept.
- **Seconds** and **Words** are computed at 175 words per minute, the narration engine's measured rate.
- `shot-4` and `shot-7` carry more than one spoken line. Every line shares the same beat name in production - that is
  what lets `scripts/demo/schedule.py` place each one against the single measured timestamp for that beat, offset by a
  few hundred milliseconds per line. The `(i)`, `(ii)` markers in the Beat column below are for reading this document
  only and are not part of the beat name.
- **This Is The Moment** flags the beat the whole video exists to land.
- Retired mechanics do not appear anywhere below: no self-repairing itinerary, no closed stop swapped without asking, no
  "Interview," "Perch bench," "Mechanic," "Repair" or "Cost." `docs/PRODUCT.md`'s 8 September Decision Record is
  authoritative and this script is written against it.
- The scheduler is never called anything but a heuristic, or the scheduler, on screen and in narration.
- `shot-7`'s gold mechanic is written against `v2/src/lib/schedule.ts`, read directly for this script: `GOLD_SLACK` is
  1.25, and the rationale string is generated as
  `` `This order spends ${transit - own} more minutes in transit than the heuristic order.` ``. No specific minute count
  is spoken, since that number depends on which stop gets dragged at record time.

---

## Opening Options Considered

Three routes for `open`, drafted before picking one. Alternatives are not part of the timed runtime.

| Route                      | Opening Line                                                                                                                                                                            | Verdict                                                                                                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A - The Facts (chosen)** | "Aisyah's twenty-four, junior job in KL, no car, and she's always the one who ends up planning the group trip..."                                                                       | Fits a ~12 second title card. Carries her age, no car and the planning role in one breath, and hands the rest of the problem to `landing`, which has the picture to support it |
| **B - The Scene**          | "It's a Tuesday night. Aisyah's still awake, thumb stuck on a WhatsApp group chat with three hundred unread messages, hunting for the one where somebody actually said yes to Sensoji." | Vivid, but at roughly 30 words it overruns a 12 second card on its own, and a title card has nothing to cut to mid-sentence                                                    |
| **C - Direct Address**     | "If you're the one who ends up planning the group trip, every year, you already know this feeling..."                                                                                   | Never lands a name or a fact inside the card's short window, so `landing` would have to introduce Aisyah from nothing                                                          |

---

## Run Of Show

| Beat               | Timestamp     | Seconds | Words   |
| ------------------ | ------------- | ------- | ------- |
| `open`             | 0:00-0:11     | 11      | 33      |
| `landing`          | 0:11-0:26     | 15      | 45      |
| `shot-1`           | 0:26-0:40     | 14      | 41      |
| `shot-2`           | 0:40-0:52     | 12      | 34      |
| `shot-3`           | 0:52-1:12     | 20      | 57      |
| `shot-4` (5 lines) | 1:12-2:03     | 51      | 146     |
| `shot-5`           | 2:03-2:10     | 7       | 21      |
| `shot-6`           | 2:10-2:21     | 11      | 32      |
| `shot-7` (6 lines) | 2:21-3:05     | 44      | 130     |
| `shot-8`           | 3:05-3:16     | 11      | 31      |
| `shot-9`           | 3:16-3:32     | 16      | 47      |
| `shot-10`          | 3:32-3:53     | 21      | 60      |
| `stack`            | 3:53-4:07     | 14      | 41      |
| `close`            | 4:07-4:21     | 14      | 40      |
| **Total**          | **0:00-4:21** | **261** | **758** |

Each row's Seconds is that beat's own lines, individually rounded to the nearest second and summed - the same rule the
detailed tables below use, so a row here always matches its rows there. The precise, unrounded total is 259.9s (4:19.9);
summing already-rounded lines instead adds 1.1s, landing this ladder at 261s (4:21).

---

## The Finalized Script

### Open (0:00-0:11)

| Beat       | Seconds | Words | On Screen                                                                                                         | Spoken Line                                                                                                                                                                               |
| ---------- | ------- | ----- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`open`** | 11      | 33    | Title card: "TolongLabs" and "Perch," one line of tagline beneath. Paper ground, real type. No app on screen yet. | "Aisyah's twenty-four, junior job in KL, no car, and she's always the one who ends up planning the group trip. This one's four days, three nights, built around one day of annual leave." |

### Landing (0:11-0:26)

| Beat          | Seconds | Words | On Screen                                                                                               | Spoken Line                                                                                                                                                                                                                                           |
| ------------- | ------- | ----- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`landing`** | 15      | 45    | `/`. The live Landing screen: eyebrow, hero line, and its three columns - The Deck, The Desk, The Book. | "Farah, Hana and Iman are on different shifts. Today's trip runs on a group chat, a booking app, Google Maps and a spreadsheet, and none of them turns the group's decision into days. This is Perch: swipe The Deck, drag The Desk, print The Book." |

### Prototype Demo Walkthrough (0:26-3:53)

Entry point to outcome, ten beats, the fixed recorded path. `shot-4` and `shot-7` carry several short lines rather than
one long one - each row below is one spoken line, and every row in a group shares that group's single beat name.

| Beat                                                  | Seconds | Words | On Screen                                                                                                                                                                                                                                                                                                           | Spoken Line                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------- | ------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`shot-1` - Onboarding**                             | 14      | 41    | `/new`. Heading "Plan A New Trip." Two taps: 20 November, then 23 November; the page reads "4 days, 3 nights." Free-text field filled: "temples and snacks, early starts." Chips tapped: Food, Temples, Shopping. Destination: "Tokyo." Button: Start Swiping.                                                      | "She opens a new plan. Two taps on the month grid set the twentieth to the twenty-third of November: four days, three nights. One line of free text, 'temples and snacks, early starts,' then chips for the rest, and Start Swiping."                                                                                                 |
| **`shot-2` - Dashboard**                              | 12      | 34    | `/trips`. The Tokyo trip card, its invite-link control, and a voter row: Farah, Hana and Iman checked off, Aisyah still open.                                                                                                                                                                                       | "The trip card's waiting on her dashboard, with the invite link she already dropped into the group chat, the same link that got Farah, Hana and Iman here. They've voted. Aisyah hasn't, not yet."                                                                                                                                    |
| **`shot-3` - The Deck**                               | 20      | 57    | `/t/tokyo-nov-2026/swipe`. A 9:16 reel card, place name overlaid. Six swipes on camera (keep, keep, pass, keep, pass, keep). Counter reads "Reel 1 Of 20" and ticks down; cut well before it reaches zero.                                                                                                          | "So she swipes. One reel at a time, nine by sixteen, the name shown first, so she's judging the place, not somebody's edit. Yes, no, yes, no, pure instinct, no thinking required. The counter in the corner ticks down for the whole deck, and Farah, Hana and Iman already did this on their own phones, days ago."                 |
| **`shot-4` (i) - The Tally**                          | 10      | 29    | `/t/tokyo-nov-2026/votes`. Rows ranked by percentage, appearing top to bottom.                                                                                                                                                                                                                                      | "Twenty-four places, ranked by percentage. Four voters, but Aisyah's own swipe counts one and a half times, so the group can't accidentally overrule her, and she can't overrule them."                                                                                                                                               |
| **`shot-4` (ii)**                                     | 14      | 40    | Camera holds on the top three rows: Sensoji, Meiji Jingu and teamLab Planets, each marked 100%, gold.                                                                                                                                                                                                               | "Three places are unanimous, Sensoji, Meiji Jingu, teamLab Planets, all at a hundred percent. Further down, the ones nobody wanted are greyed out and eliminated. They never reach the calendar, and this ranked list is the only thing that does."                                                                                   |
| **`shot-4` (iii)**                                    | 10      | 28    | Camera pulls back to the full ranked list.                                                                                                                                                                                                                                                                          | "That's the whole tally: a ranked list, weighted once by the group and once more by the owner, and it's the only thing that reaches The Desk next."                                                                                                                                                                                   |
| **`shot-4` (iv)**                                     | 7       | 21    | Scrolls toward the bottom of the list, where the percentage bars run thin.                                                                                                                                                                                                                                          | "That gap between a hundred percent and zero is the whole reason a swipe works better than a poll nobody tallies."                                                                                                                                                                                                                    |
| **`shot-4` (v)**                                      | 10      | 28    | Settles on a greyed, eliminated row at the very bottom, and holds.                                                                                                                                                                                                                                                  | "Everything at or above half the vote reaches the pool The Desk draws from. Everything below it stays here, ranked, in case a slot ever needs a replacement."                                                                                                                                                                         |
| **`shot-5` - The Desk, Empty**                        | 7       | 21    | `/desk`. Four day columns, three slots each (Morning, Afternoon, Evening), all empty. Sidebar reads "14 waiting."                                                                                                                                                                                                   | "Now, The Desk. Four days, three slots each, morning, afternoon, evening, and a sidebar holding everything that won: fourteen places, waiting."                                                                                                                                                                                       |
| **`shot-6` - The Desk, The Drag**                     | 11      | 32    | `/desk`, sped up. She drags one card into each day's first slot, then a second card into Day 1's afternoon slot - five drags, straight out of the sidebar.                                                                                                                                                          | "This part is just her. She drags a first pick into each day, straight out of the sidebar. No order yet, no suggestions, just the group's winners, landing where she puts them."                                                                                                                                                      |
| **`shot-7` (i) - Plan The Days - This Is The Moment** | 7       | 21    | `/desk`. Click Plan The Days. Cards animate into their slots. All four day headers take a green colour chip.                                                                                                                                                                                                        | "Then, Plan The Days. One button, and the calendar colours itself, all four days green, every stop fits, door to door."                                                                                                                                                                                                               |
| **`shot-7` (ii)**                                     | 7       | 21    | She drags one placed card out of its slot and into a different position on the same day - out toward another stop, then back.                                                                                                                                                                                       | "Now watch her overrule it. She drags one stop out of order on purpose, away from its cluster and back again."                                                                                                                                                                                                                        |
| **`shot-7` (iii)**                                    | 7       | 21    | That day's chip flips from green to gold. Its rationale line reads: "This order spends [N] more minutes in transit than the heuristic order."                                                                                                                                                                       | "That day's chip turns gold. Right beside it, in words: this order spends more minutes in transit than the scheduler's own."                                                                                                                                                                                                          |
| **`shot-7` (iv)**                                     | 6       | 17    | Camera holds on the gold chip and its rationale text.                                                                                                                                                                                                                                                               | "Not broken. Slow. The instrument doesn't stop her, it just answers back, the moment she overrules it."                                                                                                                                                                                                                               |
| **`shot-7` (v)**                                      | 9       | 27    | The dragged card sits in its new position, undisturbed - she has not undone it.                                                                                                                                                                                                                                     | "She can leave it like this, or drag that stop right back. Either way, it's her call, and the calendar just told her the cost of it."                                                                                                                                                                                                 |
| **`shot-7` (vi)**                                     | 8       | 23    | Camera pulls back to all four day headers: three green, one gold.                                                                                                                                                                                                                                                   | "That's the whole idea. Not a clever schedule, an honest one, that tells her exactly what she's trading when she moves something herself."                                                                                                                                                                                            |
| **`shot-8` - The Pin**                                | 11      | 31    | `/desk`. The pin toggle on the Sensoji card switches on. Plan The Days is clicked again. Sensoji's card shows a pinned mark; the rest of that day reorders around it.                                                                                                                                               | "One more move. She pins Sensoji so it can never drift, then presses Plan The Days again, the rest of that day rebuilds around it, and Sensoji doesn't move an inch."                                                                                                                                                                 |
| **`shot-9` - Before We Go**                           | 16      | 47    | `/desk`, then `/desk/before-we-go` by pressing Before We Go in the band under the calendar, the band that appears once Plan The Days has run. Six rows: passport, Suica, teamLab ticket, yen cash, travel insurance, JR Pass (already ticked). First three boxes ticked on camera. Print The Book stays greyed out. | "One gate before The Book. Six items, pulled straight from the trip itself: a teamLab ticket, a Suica card, the JR Pass already ticked off, because this trip never leaves Tokyo. She checks a few, on camera. Print The Book stays locked until every row is ticked."                                                                |
| **`shot-10` - The Book**                              | 21      | 60    | `/t/tokyo-nov-2026`. Four day-spread plates in sequence, each with a drawn route line and a Transit Route button linking out to Google Maps.                                                                                                                                                                        | "And then, The Book. Four plates, one per day, each one drawing that day's actual route, the real line between the real stops, not a stock map. Every plate carries a Transit Route link straight into Google Maps. This is what gets shared back into the group chat: not a screenshot of a plan, the whole trip, printed and done." |

**This Is The Moment is `shot-7`, all six lines of it.** Plan The Days cannot produce gold by itself - it lays every day
out in its own optimal order, so the ratio the code checks is exactly 1.0 and every day comes up green. Gold only exists
because Aisyah then drags a stop into a worse position on purpose, and the instrument answers back in words rather than
stopping her. The claim was never that the scheduler is clever. It is that it stays honest even when she overrules it,
and that the call stays hers.

### Stack (3:53-4:07)

| Beat        | Seconds | Words | On Screen                                                                                                                                 | Spoken Line                                                                                                                                                                                                                                                            |
| ----------- | ------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`stack`** | 14      | 41    | Title card: React 19 - React Router - dnd-kit - TypeScript - Vite - Cloud Run. Second card: the three-week build span, 21 Sept to 11 Oct. | "React nineteen, React Router, dnd-kit, TypeScript and Vite, on Cloud Run, no backend, no API key, just the reel video streamed in. Real multi-user voting is build-phase work, and it's Supabase. Three weeks: twenty-first of September to the eleventh of October." |

### Close (4:07-4:21)

| Beat        | Seconds | Words | On Screen                                                                        | Spoken Line                                                                                                                                                                                                                                    |
| ----------- | ------- | ----- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`close`** | 14      | 40    | Cut to The Book's Tokyo cover plate, then an end card: "Perch" and "TolongLabs." | "This isn't built for students. It's built for the one friend who always ends up planning. After Perch, the group spends two minutes swiping, and the only hands the plan passes through are hers, dragging. We're TolongLabs. This is Perch." |

---

## Timing And Budget

| Check                                          | Result                                                                                                                                                                                              |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Total words**                                | 758                                                                                                                                                                                                 |
| **Rate**                                       | 175 words per minute, measured from Kokoro `af_heart` at speed 1.0                                                                                                                                  |
| **Precise narration duration**                 | 758 words / 175 wpm = 259.9s, about 4:20                                                                                                                                                            |
| **Production ladder (rounded per line)**       | 261s = 4:21. Every line's own duration rounded to the nearest second, then summed - the same rule the Run Of Show and walkthrough tables use throughout, so no two tables in this document disagree |
| **Hard bound**                                 | 4:15-4:45 (255-285s). The precise total clears the floor by 4.9s and sits 25.1s under the ceiling; the ladder clears it by 6s and sits 24s under                                                    |
| **Framing vs. the coordinator's "roughly 56"** | 54.5s (`open` 11.3 + `landing` 15.4 + `stack` 14.1 + `close` 13.7), against a stated target of "roughly 56"                                                                                         |
| **Where the recovered seconds went**           | `shot-4` grew from 21s (one line) to 51s (five lines); `shot-7` grew from 26s (one line) to 44s (six lines) - both because the picture on each carries more to read than a click does               |
| **Organisers' outer bound**                    | 3:00-5:00. Cleared with margin on both sides regardless of how the film's own gap timing lands                                                                                                      |

---

## Production Notes

**`open`, `landing`, `stack` and `close` do not exist in `record.mjs` or `schedule.py` yet.** `record.mjs` currently
shoots only `shot-1` through `shot-10`; `schedule.py`'s `SHOT_NAMES` currently lists only `shot-1` through `shot-9`, one
short even of the walkthrough. All four new beats, and the tenth shot name, need to be added to both files before this
script's `beat | offset_ms | text` block below can be scheduled against a real capture. That work is outside
`docs/demo/` and was not done here.

**`shot-7`'s current capture procedure does not perform the drag this script now describes.** Reading `record.mjs`
directly: `shot-7` today is `click Plan The Days, wait for a placed card and a state chip, pause 1.5s` - nothing in it
drags a card back out. `v2/src/lib/schedule.ts` confirms why the beat had to change: `GOLD_SLACK` is 1.25 and gold is
only reachable when the day's actual transit exceeds the scheduler's own order for the same stops by more than 25
percent. Plan The Days lays every day out in that same order, so it cannot produce gold by construction - every day
comes up green. `shot-7`'s capture needs a second gesture added after Plan The Days: drag one placed card into a worse
position on one day (an out-and-back, away from its cluster and back), then hold on that day's chip turning gold with
its rationale line. `shot-8`'s pin sequence is unaffected and unchanged.

**Multiple lines, one beat name.** `shot-4` carries five spoken lines and `shot-7` carries six. In production every line
in a group is written against the same beat name with an increasing `offset_ms`, so `schedule.py` places each one
relative to that beat's single measured timestamp rather than needing five or six beats it does not have. The `(i)`
through `(vi)` markers in the walkthrough table are for reading this document only.

**This script's Seconds run well past `record.mjs`'s current `finishShot` floors for two beats, and that is expected.**

| Beat      | Current Floor | This Script | Delta | Why                                                                                                             |
| --------- | ------------- | ----------- | ----- | --------------------------------------------------------------------------------------------------------------- |
| `shot-4`  | 18s           | 51s         | +33s  | Five lines now cover the weighting, the unanimous rows, the eliminated rows, and what the ranking feeds forward |
| `shot-7`  | 13s           | 44s         | +31s  | Six lines cover Plan The Days going all-green, the overrule drag, the gold flip, and its rationale text         |
| `shot-3`  | 16s           | 20s         | +4s   | Names the deck mechanic and that the group already swiped, off-screen                                           |
| `shot-10` | 17s           | 21s         | +4s   | Names the route line and the Transit Route link both, not just showing the plates                               |
| `shot-2`  | 9s            | 12s         | +3s   | Small addition for clarity                                                                                      |
| `shot-9`  | 8s            | 16s         | +8s   | Naming all six checklist items by name takes longer than the three ticks alone                                  |
| `shot-6`  | 14s           | 11s         | -3s   | Shorter than the floor - the picture can hold a moment past the line ending                                     |
| `shot-8`  | 12s           | 11s         | -1s   | Shorter than the floor, same reason                                                                             |
| `shot-1`  | 13s           | 14s         | +1s   | Effectively unchanged                                                                                           |
| `shot-5`  | 7s            | 7s          | 0s    | Unchanged                                                                                                       |

The coordinator has said the picture will be cut to this script's numbers, so no change is needed here - this table is a
heads-up for whoever next tunes `record.mjs`'s hold times, and adds the `shot-7` drag gesture. Those files live outside
`docs/demo/` and were read, not edited, for this task.

**`shot-6` is a sped-up montage, not real time.** `record.mjs` performs five drags on camera (one per day's first slot,
plus a second into Day 1); doing all fourteen at real speed would run well past this beat's 11 seconds. Speed the clip
up in the edit rather than filming it in real time - a normal, honestly-labelled choice, distinct from ever passing a
recording off as a live demo.

**The deck shows six swipes out of twenty, on purpose.** `shot-3`'s narration never claims she swipes through all of
them; the on-screen counter, ticking from `Reel 1 Of 20`, carries that information without the line needing to say it.

**Record at 1440x900, the deployed Cloud Run URL, never `bun run dev`.** Both are `scripts/demo/README.md`'s own
findings, learned against crashes on the live site, and are repeated here because getting the shot right the first time
matters more than re-deriving it.

**The prototype link opens in incognito**, per the submission template's own instruction in `docs/brief.md` - relevant
here because the recorder's browser context should start clean the same way a judge's incognito window would.

---

## What We Cut To Hit The Budget

| Cut                                                                        | Why                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ideation, mentor session, dropped directions**                           | Scored from `docs/README.md`, not the video - the organisers said so directly                                                                                                                                                                     |
| **A standalone "This Is Perch" statement, and the SwipeSights comparison** | The first cut spent 55s on this before the walkthrough even started. Both are compressed into `landing`'s 15s, and the SwipeSights originality argument is dropped entirely - it belongs to the README, which can make it better than a video can |
| **The full 20-place swipe pool**                                           | Six swipes on camera, one counter carrying the other fourteen                                                                                                                                                                                     |
| **The full dependency list**                                               | Six named technologies, not `react ^19.2.8` and the rest of `TRD.md`'s exact versions                                                                                                                                                             |
| **The Perch drawer, as a screen action**                                   | `shot-4`'s last line describes the ranked list behind the tally staying available for a slot that needs a replacement, but no delete-and-refill gesture is shown - that mechanic is not on the fixed ten-beat recorded path                       |
| **A Grand Finals section**                                                 | Out of scope for this delegation and premature at the prototype phase - the built product a Grand Finals pitch would describe does not exist until the Building and Deployment Phases close                                                       |
| **A fuller before-and-after or stakeholder breakdown**                     | One persona line does the job the close needs; the fuller argument is `docs/PRODUCT.md`'s and lives there                                                                                                                                         |
| **The legs data model, multi-city as a type-level claim**                  | A README nuance, not a spoken one - it never renders on any of the ten screens                                                                                                                                                                    |
| **Budget figures in ringgit, and the "why Tokyo, why four days" argument** | Argued in `docs/PRODUCT.md`; the video shows the trip rather than justifying its length                                                                                                                                                           |

---

## Narration Block

Pasteable into `scripts/demo/narration.txt` once `open`, `landing`, `stack` and `close` exist as beats in `beats.json`.
Format is `beat | offset_ms | text`, matching `scripts/demo/schedule.py`'s `resolve_narration`: `offset_ms` is
milliseconds after that beat's own measured timestamp, not a duration. A 400ms lead-in opens every beat's first line,
and 400ms separates each later line in `shot-4` and `shot-7` from the one before it - comfortably clear of
`schedule.py`'s own 260ms collision gap, so `deconflict` should not need to shift anything.

```text
open | 400 | Aisyah's twenty-four, junior job in KL, no car, and she's always the one who ends up planning the group trip. This one's four days, three nights, built around one day of annual leave.
landing | 400 | Farah, Hana and Iman are on different shifts. Today's trip runs on a group chat, a booking app, Google Maps and a spreadsheet, and none of them turns the group's decision into days. This is Perch: swipe The Deck, drag The Desk, print The Book.
shot-1 | 400 | She opens a new plan. Two taps on the month grid set the twentieth to the twenty-third of November: four days, three nights. One line of free text, 'temples and snacks, early starts,' then chips for the rest, and Start Swiping.
shot-2 | 400 | The trip card's waiting on her dashboard, with the invite link she already dropped into the group chat, the same link that got Farah, Hana and Iman here. They've voted. Aisyah hasn't, not yet.
shot-3 | 400 | So she swipes. One reel at a time, nine by sixteen, the name shown first, so she's judging the place, not somebody's edit. Yes, no, yes, no, pure instinct, no thinking required. The counter in the corner ticks down for the whole deck, and Farah, Hana and Iman already did this on their own phones, days ago.
shot-4 | 400 | Twenty-four places, ranked by percentage. Four voters, but Aisyah's own swipe counts one and a half times, so the group can't accidentally overrule her, and she can't overrule them.
shot-4 | 10743 | Three places are unanimous, Sensoji, Meiji Jingu, teamLab Planets, all at a hundred percent. Further down, the ones nobody wanted are greyed out and eliminated. They never reach the calendar, and this ranked list is the only thing that does.
shot-4 | 24857 | That's the whole tally: a ranked list, weighted once by the group and once more by the owner, and it's the only thing that reaches The Desk next.
shot-4 | 34857 | That gap between a hundred percent and zero is the whole reason a swipe works better than a poll nobody tallies.
shot-4 | 42457 | Everything at or above half the vote reaches the pool The Desk draws from. Everything below it stays here, ranked, in case a slot ever needs a replacement.
shot-5 | 400 | Now, The Desk. Four days, three slots each, morning, afternoon, evening, and a sidebar holding everything that won: fourteen places, waiting.
shot-6 | 400 | This part is just her. She drags a first pick into each day, straight out of the sidebar. No order yet, no suggestions, just the group's winners, landing where she puts them.
shot-7 | 400 | Then, Plan The Days. One button, and the calendar colours itself, all four days green, every stop fits, door to door.
shot-7 | 8000 | Now watch her overrule it. She drags one stop out of order on purpose, away from its cluster and back again.
shot-7 | 15600 | That day's chip turns gold. Right beside it, in words: this order spends more minutes in transit than the scheduler's own.
shot-7 | 23200 | Not broken. Slow. The instrument doesn't stop her, it just answers back, the moment she overrules it.
shot-7 | 29429 | She can leave it like this, or drag that stop right back. Either way, it's her call, and the calendar just told her the cost of it.
shot-7 | 39086 | That's the whole idea. Not a clever schedule, an honest one, that tells her exactly what she's trading when she moves something herself.
shot-8 | 400 | One more move. She pins Sensoji so it can never drift, then presses Plan The Days again, the rest of that day rebuilds around it, and Sensoji doesn't move an inch.
shot-9 | 400 | One gate before The Book. Six items, pulled straight from the trip itself: a teamLab ticket, a Suica card, the JR Pass already ticked off, because this trip never leaves Tokyo. She checks a few, on camera. Print The Book stays locked until every row is ticked.
shot-10 | 400 | And then, The Book. Four plates, one per day, each one drawing that day's actual route, the real line between the real stops, not a stock map. Every plate carries a Transit Route link straight into Google Maps. This is what gets shared back into the group chat: not a screenshot of a plan, the whole trip, printed and done.
stack | 400 | React nineteen, React Router, dnd-kit, TypeScript and Vite, on Cloud Run, no backend, no API key, just the reel video streamed in. Real multi-user voting is build-phase work, and it's Supabase. Three weeks: twenty-first of September to the eleventh of October.
close | 400 | This isn't built for students. It's built for the one friend who always ends up planning. After Perch, the group spends two minutes swiping, and the only hands the plan passes through are hers, dragging. We're TolongLabs. This is Perch.
```
