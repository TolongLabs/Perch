# The deck's screenshots

Every file here was shot off the deployed prototype at <https://prototype-yskhynz4la-as.a.run.app>, running `f928159`,
on 13 September 2026. Nothing is mocked up and nothing is retouched.

The app moves faster than the deck does: ten commits landed on `main` between the deck's last rework and this shoot, and
all eight screenshots were a UI behind. If the surfaces change again, reshoot rather than patch — a deck that shows a
screen the judges cannot find is worse than one with fewer pictures.

## How they were taken

Chromium via Playwright, `colorScheme: 'light'` forced (the app follows `prefers-color-scheme` and the deck is a light
deck), `deviceScaleFactor: 2`, then downscaled with PIL/Lanczos and saved as JPEG at quality 88, 4:4:4. Shooting at
twice the final size and downsampling is what keeps the phone text legible at 264&nbsp;px wide on the slide.

Each run starts on `/desk` and clicks **Optimize Plan**, because Before We Go and the Book both read the calendar and
show a cold state until the days are settled.

| File                     | Surface                   | Viewport        | State captured                                         |
| ------------------------ | ------------------------- | --------------- | ------------------------------------------------------ |
| `01-landing-sm.jpg`      | `/`                       | 390&times;844   | Top of the landing screen, video hero running          |
| `02-dashboard-sm.jpg`    | `/trips`                  | 390&times;844   | The Tokyo trip card, who has voted, the invite         |
| `03-onboarding-sm.jpg`   | `/new`                    | 390&times;844   | November 2026 drawn, 20 to 23 selected                 |
| `04-deck-sm.jpg`         | `/t/tokyo-nov-2026/swipe` | 390&times;844   | Reel 1 of 20, scrolled 40px (see below)                |
| `05-tally-sm.jpg`        | `/t/tokyo-nov-2026/votes` | 390&times;844   | Scrolled to the top of The Running Order (see below)   |
| `07-before-we-go-sm.jpg` | `/desk/before-we-go`      | 390&times;844   | All six items, one ticked                              |
| `06-desk-lg.jpg`         | `/desk`                   | 1800&times;1000 | See below                                              |
| `08-book-lg.jpg`         | `/t/tokyo-nov-2026`       | 1400&times;1200 | Spread 7 of 7, The Complete Route and the Master Atlas |

## Where the two scrolled shots start

Both are scrolled, and where they start is the whole difference between a screen and a botched crop.

**The Deck** starts 40&nbsp;px down. At the top of the page the app's own _The Deck_ heading sits directly under the
frame's `THE DECK` caption, which reads as a stutter, and it costs the crop the bottom row, so the four directional
arrows and _Change voter_ fell outside it. Forty pixels drops the heading and brings the whole card, both arrows and the
voter row inside the frame. Aisyah is picked at the identity gate first, since the reel is gated on who is voting.

**The Tally** starts at the top of `.tally-rows`, six pixels into the gap above it, which is the only offset that opens
on empty ground rather than mid-sentence. It also clears the floating account pill: any card whose name row lands
between 16&nbsp;px and 78&nbsp;px gets its vote count covered. From there the frame holds the section heading, the Voted
In Rule, and four ranked places with their percentages, which is what the deck says the Tally is.

## The Desk's gold day

Slide 14 needs Day 1 in the gold **Fits But Runs Slow** state, and one click of Optimize Plan will never produce it: the
scheduler clusters each day into a single area, so reordering inside a day barely moves the travel time and never
crosses the 1.25 slack that trips gold. Gold needs a day that spans two clusters.

Two pointer drags produce it, in this order:

1. **Sensoji** (Day 2 evening, Asakusa) into **Day 1 afternoon**. Day 1 becomes Meiji Jingu &rarr; Sensoji &rarr; Omoide
   Yokocho: Shibuya, out to Asakusa, back to Shibuya. The chip turns gold.
2. **Shinjuku Gyoen**, which the first drag displaced to the pool, into **Day 2 evening**, so the board reads as a
   finished plan with exactly one slow day.

Then the day heading's info dot is clicked, which opens the rationale beside the chip — _This order spends 30 more
minutes in transit than the heuristic order._ Slide 14 quotes that line, so the popover has to be open in the shot.

dnd-kit needs a real gesture: press, move past the activation constraint, then about twenty intermediate moves before
releasing. A single `mouse.move` to the target does nothing.

## Crops

The Desk and the Book are clipped to their own content rather than the window, so neither carries the sidebar rail or
the floating account chrome:

- **Desk** — a 1631&times;827 clip centred on the day columns, which is the 1120&times;568 box the slide draws it in.
  The 1800&nbsp;px viewport exists only so a clip at that ratio clears the rail on the left.
- **Book** — the two facing pages plus three pixels, 989&times;596. Leaflet is live here, so the capture waits until the
  loaded-tile count stops changing.
