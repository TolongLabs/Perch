import { Link } from 'react-router-dom'
import { BookFlip } from '../components/BookFlip'
import { DayMap, DayMapThumb, dayTint, FullTripMap } from '../components/DayMap'
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

/** Below this many settled destinations the book is a single scuffed spread with a lone dot on each day map, so it
    shows the cold state instead: a keepsake needs a few stops to read as a book rather than two pages. */
const MIN_DESTINATIONS = 4

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
 * The pin set in the top right of a spread's second page, for the day that owns that page's photo: the day's stops
 * drawn on the city they cross, with the day's transit route beneath. One per spread rather than per page, because
 * two pinned maps across a gutter read as noise over one, and a second map on the facing page says the same thing
 * twice. The route is withheld when the day has fewer than two stops, because a route needs a start and an end. The
 * figure carries the day's attribute, so the head's dot and the fallback plate read the day's own tint.
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
  const entries = trip.days.flatMap((day) => entriesOf(day, trip.options))
  // A book needs a few settled destinations to read as a book rather than one scuffed spread: two dots on a day map
  // and a page or two is not a keepsake, so below the threshold the cold state shows instead of a thin book.
  const planned = entries.length >= MIN_DESTINATIONS
  const folios = pagesOf(entries)
  const mapped: MappedDay[] = trip.days
    .map((day) => ({ day, stops: entriesOf(day, trip.options).map((e) => e.place) }))
    .filter((entry) => entry.stops.length > 0)
  const dayMap = new Map(mapped.map((m) => [m.day.index, m]))
  // The minimap of each day is only shown on the last segment of each day (e.g. Day 1 evening,
  // Day 2 evening, Day 3 evening) to avoid visual clutter (#108).
  const lastSegmentByDay = new Map<number, string>()
  for (const day of trip.days) {
    const dayEntries = entriesOf(day, trip.options)
    if (dayEntries.length > 0) {
      const last = dayEntries[dayEntries.length - 1]
      if (last) lastSegmentByDay.set(day.index, last.slot.id)
    }
  }

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

          {/* One flipbook for the whole book. Its page numbers run 1..N across every day, because the numbering is
            the book's and a per-day host is what reset it to 1 on the second spread. */}
          <BookFlip>
            {folios.map((folio, i) => {
              const [a, b] = folio
              if (!a) return null

              // The minimap of each day is only shown on the last segment of that day (#108).
              const pinLeft = a && lastSegmentByDay.get(a.day) === a.slot.id ? dayMap.get(a.day) : null
              const pinRight = b && lastSegmentByDay.get(b.day) === b.slot.id ? dayMap.get(b.day) : null

              return (
                <div className="folio-spread" key={a.slot.id}>
                  {/* Each page follows a top-down structure: the left page carries the first destination's photo
                    at top and description at bottom; the facing right page carries the second destination's words at top
                    (clearing the pinned map) and photo at bottom (#108). */}
                  <div className="book-page folio-page folio-left">
                    <div className="book-page-inner">
                      <DestPhoto entry={a} />
                      <DestDesc entry={a} />
                      <p className="page-num t-specimen" aria-hidden="true">
                        {i * 2 + 1}
                      </p>
                    </div>
                    {pinLeft && <PagePin day={pinLeft.day} stops={pinLeft.stops} />}
                  </div>
                  <div className="book-page folio-page folio-right">
                    <div className="book-page-inner">
                      {b && <DestDesc entry={b} />}
                      {b && <DestPhoto entry={b} />}
                      <p className="page-num t-specimen" aria-hidden="true">
                        {i * 2 + 2}
                      </p>
                    </div>
                    {pinRight && <PagePin day={pinRight.day} stops={pinRight.stops} />}
                  </div>
                </div>
              )
            })}

            {/* Final 2-page spread: The Complete Route giant map combining all days of the trip (#108). */}
            <div className="folio-spread" key="spread-giant-map">
              <div className="book-page folio-page folio-left giantmap-page giantmap-page-legend">
                <div className="book-page-inner">
                  <div className="giantmap-intro">
                    <p className="t-label giantmap-when">The Whole Journey</p>
                    <h3 className="t-name">The Complete Route</h3>
                    <p className="t-prose dest-summary">
                      All {trip.days.length} days and {entries.length} destinations plotted across the city, from{' '}
                      {entries[0]?.place.name} to {entries[entries.length - 1]?.place.name}.
                    </p>
                  </div>
                  <div className="giantmap-legend">
                    <p className="t-label giantmap-legend-title">Itinerary By Day</p>
                    <ul className="giantmap-days">
                      {mapped.map(({ day, stops }) => (
                        <li key={day.index} className="giantmap-day-row" data-day={((day.index - 1) % 7) + 1}>
                          <div className="giantmap-day-badge">
                            <span
                              className="giantmap-swatch"
                              style={{ background: dayTint(day.index) }}
                              aria-hidden="true"
                            />
                            <span className="t-label">
                              Day {day.index} &middot; {day.weekday}
                            </span>
                          </div>
                          <div className="giantmap-day-info">
                            <strong className="giantmap-day-title">{day.title}</strong>
                            <span className="t-specimen giantmap-day-stops">{stops.map((s) => s.name).join(', ')}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="page-num t-specimen" aria-hidden="true">
                    {folios.length * 2 + 1}
                  </p>
                </div>
              </div>
              <div className="book-page folio-page folio-right giantmap-page giantmap-page-map">
                <div className="book-page-inner">
                  <div className="giantmap-header">
                    <p className="t-label giantmap-when">Master Atlas</p>
                    <h3 className="t-name">City Transit &amp; Walking Routes</h3>
                  </div>
                  <FullTripMap days={mapped} title="The Complete Route" />
                  <p className="page-num t-specimen" aria-hidden="true">
                    {folios.length * 2 + 2}
                  </p>
                </div>
              </div>
            </div>
          </BookFlip>

          {/* The days' maps, after the book: each day's stops in visiting order on the city the walk crosses. Set in
            the flow rather than pinned, because with one book there is no spread of the day to pin a note to. */}
          <section className="book-maps" aria-label="The Days' Maps">
            {mapped.map(({ day, stops }) => (
              <figure className="book-map" data-day={((day.index - 1) % 7) + 1} key={day.index}>
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
        <Link className="colophon-back t-label" to="/desk/before-we-go">
          Back To Before We Go
        </Link>
      </article>
    </main>
  )
}
