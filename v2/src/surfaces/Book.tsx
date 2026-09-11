import { Link } from 'react-router-dom'
import { BookFlip } from '../components/BookFlip'
import { DayMap } from '../components/DayMap'
import { transitMin } from '../data/travel'
import type { Day, Place, Slot } from '../data/types'
import { dayCostRM, tripCostRM } from '../lib/cost'
import { clock, dayLabel, duration, money, price } from '../lib/format'
import { transitRoute } from '../lib/mapsLink'
import { saveAsPdf } from '../lib/print'
import { backupFor } from '../lib/schedule'
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

type Entry = { slot: Slot; place: Place; transit: number }

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
    entries.push({ slot, place, transit: previous ? transitMin(previous.place.id, place.id) : 0 })
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
    <img className="dest-shot" src={entry.place.reel.poster} alt="" loading="lazy" />
  </div>
)

/** The words side of a destination: when, name, blurb, and the specimen line. */
const DestDesc = ({ entry }: { entry: Entry }) => (
  <div className="dest dest-desc">
    <p className="t-label dest-when">{PERIOD[entry.slot.period]}</p>
    <h3 className="t-name">{entry.place.name}</h3>
    <p className="t-prose dest-prose">{entry.place.blurb}</p>
    <p className="t-specimen">
      {duration(entry.place.dwellMin)} &middot; {price(entry.place)}
      {entry.transit > 0 && <> &middot; {entry.transit} min from the last stop</>}
    </p>
  </div>
)

/**
 * The keepsake, and the shared link. Printed state only: there is no setting state here, no blank slot and no
 * awaiting-decision chip, because a plate prints what was settled.
 *
 * Each day is a run of two-page spreads, and every spread lays out two destinations across its facing pages,
 * alternating photo left / words right and words left / photo right. The alternation is the intake's own wording:
 * a photo on the top left page, its words on the top right, then the next destination's words on the bottom left
 * and its photo on the bottom right. A day is read forwards, so the destinations keep their visiting order.
 */
export const Book = () => {
  const { trip } = useTrip()
  const owner = trip.party.find((p) => p.id === trip.ownerId)?.name ?? 'the owner'
  // A cold visit reaches this page before anything is on the calendar, and the plates read the calendar: every day
  // drew as a bare title over white. A judge landing on the shared link deserves to be told why, not shown a book
  // with its pictures missing.
  const planned = trip.days.some((day) => day.slots.some((slot) => slot.placeId !== null))

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
            control. It prints nothing of itself: the sheet is the Book. Withheld until there is a book to save:
            a control that hands back four blank sheets is worse than no control. */}
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

      {planned &&
        trip.days.map((day) => {
          const entries = entriesOf(day, trip.options)
          const folios = pagesOf(entries)
          const route = transitRoute(entries.map((e) => e.place))

          /* The day's reserve, and how far it is from the stop it is nearest. `backupFor` already guarantees the
           place is voted in, unplaced anywhere in the trip, in the day's own cluster and within reach; the reader
           needs the one number that says which stop to swap it for. */
          const backup = backupFor(day, trip)
          const nearest = backup
            ? entries.reduce<{ place: Place; min: number } | null>((best, e) => {
                const min = transitMin(e.place.id, backup.id)
                return !best || min < best.min ? { place: e.place, min } : best
              }, null)
            : null

          return (
            <article key={day.index} className="spread day-spread" data-day={day.tint}>
              <header className="spread-head">
                <div className="spread-when">
                  <p className="t-label spread-band">
                    Day {day.index} &middot; {day.weekday} {dayLabel(day.date)} &middot;{' '}
                    {money(dayCostRM(day, trip.options))}
                  </p>

                  {/* How long the day runs and when it ends, read from the same feasibility walk the Desk's chip is
                    read from, so the two can never disagree. A day the scheduler has not walked has no span. */}
                  {day.feasibility && (
                    <p className="t-specimen spread-span">
                      {duration(day.feasibility.daySpanMin)} &middot; ends {clock(day.feasibility.endMin)}
                    </p>
                  )}
                </div>

                {/* Day-level, like the band beside it, so the page number stays the last mark on the page. */}
                {route && (
                  <a className="t-label day-route" href={route} target="_blank" rel="noreferrer noopener">
                    Open The Transit Route
                  </a>
                )}
              </header>

              <h2 className="t-plate-title day-title">{day.title}</h2>

              {/* The screen reader's copy of the day: the same stops, from the same ordered data, read in visiting
                order, once. The visual folios below are the printed object and are `aria-hidden`, so this list is the
                single accessible source and the two cannot disagree. It is `sr-only`, so it shows nowhere on screen
                and only in the tree; print drops it because the sheet already carries these stops as pictures. */}
              <ol className="day-stops sr-only">
                {entries.map((entry) => (
                  <li key={entry.slot.id}>
                    <DestDesc entry={entry} />
                  </li>
                ))}
              </ol>

              {/* Pinned rather than printed: the route is the reader's own note about the day, laid on the spread it
                describes. The tilt is what pinning means; there is no shadow, per `DESIGN.md`. Day-level now that the
                lead plate is gone, so it anchors to the spread rather than to one picture. */}
              {entries.length > 1 && (
                <figure className="spread-pin">
                  <span className="pin-head" aria-hidden="true" />
                  <DayMap day={day.index} title={day.title} stops={entries.map((e) => e.place)} />
                </figure>
              )}

              <BookFlip>
                {folios.map((folio) => {
                  const [a, b] = folio
                  if (!a) return null
                  return (
                    <div className="folio-spread" key={a.slot.id}>
                      {/* The first destination of the spread sits photo left / words right; the second flips to words
                        left / photo right. That is the alternation the intake names, and it is what makes a spread read
                        as two facing pages rather than two stacked lists. On a wide screen with motion, BookFlip turns
                        these pages with page-flip; everywhere else they are the day's flat pages, laid out by the
                        Book's own rules. */}
                      <div className="book-page folio-page folio-left">
                        <DestPhoto entry={a} />
                        {b && <DestDesc entry={b} />}
                        <p className="page-num t-specimen" aria-hidden="true" />
                      </div>
                      <div className="book-page folio-page folio-right">
                        <DestDesc entry={a} />
                        {b && <DestPhoto entry={b} />}
                        <p className="page-num t-specimen" aria-hidden="true" />
                      </div>
                    </div>
                  )
                })}
              </BookFlip>

              {/* Under the folios rather than inside the last page, and the difference is visible: inside the page it
                pushed that page's folio 129px above its neighbour's, and two page numbers at different heights read
                as a layout fault rather than as a book. Below the row it is still the last thing on the day.
              *
              * A day whose cluster is exhausted, or whose only unplaced neighbours are too far, says nothing at all:
              * a reserve across the city is a second plan, not a backup. */}
              {backup && nearest && (
                <aside className="page-backup">
                  <p className="t-label backup-label">If Plans Change</p>
                  <p className="t-specimen backup-line">
                    {backup.name} is {nearest.min} min from {nearest.place.name}, voted in and on no day.
                  </p>
                </aside>
              )}
            </article>
          )
        })}

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
