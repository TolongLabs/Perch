import { Link } from 'react-router-dom'
import { BookFlip } from '../components/BookFlip'
import { DayMap, DayMapThumb } from '../components/DayMap'
import { transitMin } from '../data/travel'
import type { Day, Place, Slot } from '../data/types'
import { tripCostRM } from '../lib/cost'
import { dayLabel, duration, money, price } from '../lib/format'
import { transitRoute } from '../lib/mapsLink'
import { saveAsPdf } from '../lib/print'
import { useTrip } from '../state'
import './Book.css'

const WORDS: Record<number, string> = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven' }

const PERIOD: Record<Slot['period'], string> = {
  morning: 'In The Morning',
  afternoon: 'In The Afternoon',
  evening: 'That Evening'
}

/** Two destinations to a spread, which is the composition the intake names and what fixes the page count. */
const PER_PAGE = 2

type Entry = { slot: Slot; place: Place; transit: number; day: number }

type MappedDay = { day: Day; stops: Place[] }

/**
 * The day's filled slots in visiting order, each carrying the transit from the one before it. A day whose slots are
 * partly empty simply has fewer entries; the Book prints what was settled and never a hole.
 */
const entriesOf = (day: Day, options: Record<string, Place>): Entry[] => {
  const entries: Entry[] = []
  for (const slot of day.slots) {
    const place = slot.placeId ? options[slot.placeId] : undefined
    if (!place) continue
    const previous = entries[entries.length - 1]
    entries.push({ slot, place, transit: previous ? transitMin(previous.place.id, place.id) : 0, day: day.index })
  }
  return entries
}

const pagesOf = (entries: Entry[]): Entry[][] => {
  const pages: Entry[][] = []
  for (let i = 0; i < entries.length; i += PER_PAGE) pages.push(entries.slice(i, i + PER_PAGE))
  return pages
}

/** The picture side of a destination: the reel's own poster frame, cropped to a landscape window. */
const DestPhoto = ({ entry }: { entry: Entry }) => (
  <div className="dest dest-photo">
    <img className="dest-shot" src={entry.place.reel.poster} alt="" />
  </div>
)

/** The words side of a destination: which day and when, name, blurb, and the specimen line. */
const DestDesc = ({ entry }: { entry: Entry }) => (
  <div className="dest dest-desc">
    <p className="t-label dest-when">
      Day {entry.day} &middot; {PERIOD[entry.slot.period]}
    </p>
    <h3 className="t-name">{entry.place.name}</h3>
    <p className="t-prose dest-prose">{entry.place.blurb}</p>
    <p className="t-specimen">
      {duration(entry.place.dwellMin)} &middot; {price(entry.place)}
      {entry.transit > 0 && <> &middot; {entry.transit} min from the last stop</>}
    </p>
  </div>
)

/**
 * The pin set in the top right of a page, for the day that owns the page's photo: the day's stops drawn on the
 * city they cross, with the day's transit route beneath. The route is withheld when the day has fewer than two
 * stops, because a route needs a start and an end. The figure carries the day's attribute, so the head's dot and
 * the fallback plate read the day's own tint.
 */
const PagePin = ({ day, stops }: { day: Day; stops: Place[] }) => {
  const route = transitRoute(stops)
  if (stops.length === 0) return null
  return (
    <figure className="spread-pin" data-day={day.index}>
      <span className="pin-head" aria-hidden="true" />
      <DayMapThumb day={day.index} title={day.title} stops={stops} />
      {route && (
        <a className="t-label pin-route" href={route} target="_blank" rel="noreferrer noopener" tabIndex={-1}>
          Open The Transit Route
        </a>
      )}
    </figure>
  )
}

/**
 * The keepsake, and the shared link. Printed state only: there is no setting state here, no blank slot and no
 * awaiting-decision chip, because a plate prints what was settled.
 *
 * One book for the whole trip: the days' destinations run 1..N across a single flipbook, and the day travels with
 * each destination as its own when-line rather than owning a section. A spread lays out two destinations across its
 * facing pages, alternating photo left / words right and words left / photo right, read in the group's visiting
 * order. The days' maps follow the book as a run of their own, because the map is the reader's note about a day
 * and the day is the one thing the pages no longer carry.
 */
export const Book = () => {
  const { trip } = useTrip()
  const owner = trip.party.find((p) => p.id === trip.ownerId)?.name ?? 'the owner'
  // A cold visit reaches this page before anything is on the calendar, and the pages read the calendar: every day
  // drew as a bare title over white. A judge landing on the shared link deserves to be told why, not shown a book
  // with its pictures missing.
  const planned = trip.days.some((day) => day.slots.some((slot) => slot.placeId !== null))
  const entries = trip.days.flatMap((day) => entriesOf(day, trip.options))
  const folios = pagesOf(entries)
  const mapped: MappedDay[] = trip.days
    .map((day) => ({ day, stops: entriesOf(day, trip.options).map((e) => e.place) }))
    .filter((entry) => entry.stops.length > 0)
  const dayMap = new Map(mapped.map((m) => [m.day.index, m]))

  return (
    <main className="book">
      <article className="spread cover">
        <p className="t-label cover-eyebrow">The Book</p>
        <h1 className="t-display cover-title">{trip.destination}</h1>
        <p className="t-prose cover-prose">
          {WORDS[trip.days.length] ?? trip.days.length} days,{' '}
          {(WORDS[trip.nights] ?? String(trip.nights)).toLowerCase()} nights, put together by {owner} and voted on by{' '}
          {trip.party.length - 1} others.
        </p>

        {/* On the cover, because a reader who wants the file should not have to read the whole book to find the
            control. It prints nothing of itself: the sheet is the Book's pages. Withheld until there is a book to
            save: a control that hands back four blank sheets is worse than no control. */}
        {planned && (
          <button
            type="button"
            className="cover-save t-label"
            onClick={() =>
              saveAsPdf(`${trip.destination} Book, ${dayLabel(trip.startDate)} ${trip.startDate.slice(0, 4)}`)
            }
          >
            Save As PDF
          </button>
        )}

        <dl className="cover-facts">
          <div>
            <dt className="t-label">When</dt>
            <dd>
              {dayLabel(trip.startDate)} &ndash; {dayLabel(trip.days[trip.days.length - 1]?.date ?? trip.startDate)}
            </dd>
          </div>
          <div>
            <dt className="t-label">Who</dt>
            <dd>{trip.party.map((p) => p.name).join(', ')}</dd>
          </div>
          <div>
            <dt className="t-label">Total</dt>
            <dd>{money(tripCostRM(trip))}</dd>
          </div>
        </dl>
      </article>

      {!planned && (
        <article className="spread book-cold">
          <h2 className="t-plate-title book-cold-line">Plan the days on the Desk first</h2>
          <p className="t-prose book-cold-note">
            The Book prints what the group settled. Drag what won onto the calendar and this fills with the day's
            pictures, its stops in order, and the walk between them.
          </p>
          <Link className="book-cold-go t-label" to="/desk">
            Open The Desk
          </Link>
        </article>
      )}

      {planned && (
        <article className="spread book-body">
          {/* The screen reader's copy of the trip: every stop from the same ordered data, read in visiting order,
            once. The visual pages are `aria-hidden`, so this list is the single accessible source and the two
            cannot disagree. It is `sr-only`, so it shows nowhere on screen; print drops it because the sheet
            already carries these stops as pages. */}
          <ol className="day-stops sr-only">
            {entries.map((entry) => (
              <li key={entry.slot.id}>
                <DestDesc entry={entry} />
              </li>
            ))}
          </ol>

          {/* One flipbook for the whole book. Its page counter runs 1..N across every day, because the numbering is
            the book's and a per-day host is what reset it to 1 on the second spread. */}
          <BookFlip>
            {folios.map((folio) => {
              const [a, b] = folio
              if (!a) return null
              const pinA = dayMap.get(a.day)
              const pinB = b ? dayMap.get(b.day) : undefined
              return (
                <div className="folio-spread" key={a.slot.id}>
                  {/* The first destination of the spread sits photo left / words right; the second flips to words
                    left / photo right. That is the alternation the intake names, and it is what makes a spread read
                    as two facing pages rather than two stacked lists. On a wide screen with motion, BookFlip turns
                    these pages with page-flip; everywhere else they are the book's flat pages, laid out by the
                    Book's own rules. Each page carries the pin of the day that owns its picture, set in the page's
                    top right. */}
                  <div className="book-page folio-page folio-left">
                    <div className="book-page-inner">
                      <DestPhoto entry={a} />
                      {b && <DestDesc entry={b} />}
                      <p className="page-num t-specimen" aria-hidden="true" />
                    </div>
                    {pinA && <PagePin day={pinA.day} stops={pinA.stops} />}
                  </div>
                  <div className="book-page folio-page folio-right">
                    <div className="book-page-inner">
                      <DestDesc entry={a} />
                      {b && <DestPhoto entry={b} />}
                      <p className="page-num t-specimen" aria-hidden="true" />
                    </div>
                    {pinB && <PagePin day={pinB.day} stops={pinB.stops} />}
                  </div>
                </div>
              )
            })}
          </BookFlip>

          {/* The days' maps, after the book: each day's stops in visiting order on the city the walk crosses. Set in
            the flow rather than pinned, because with one book there is no spread of the day to pin a note to. */}
          <section className="book-maps" aria-label="The Days' Maps">
            {mapped.map(({ day, stops }) => (
              <figure className="book-map" data-day={day.tint} key={day.index}>
                <figcaption className="t-label book-map-title">
                  Day {day.index} &middot; {day.weekday} {dayLabel(day.date)}
                </figcaption>
                <DayMap day={day.index} title={day.title} stops={stops} />
              </figure>
            ))}
          </section>
        </article>
      )}

      {/* The Book shows the trip's destinations and nothing else: the checklist lives on the Desk, where it is set.
          What remains is the one way back, and it is the last mark in the book. */}
      <article className="spread colophon">
        <Link className="colophon-back t-label" to="/desk">
          Back To The Desk
        </Link>
      </article>
    </main>
  )
}
