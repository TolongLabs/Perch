import { Link } from 'react-router-dom'
import { Plate } from '../components/Plate'
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

/** Two stops to a page, which is the composition the reference spread uses and what fixes the page count. */
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

/**
 * The keepsake, and the shared link. Printed state only: there is no setting state here, no blank slot and no
 * awaiting-decision chip, because a plate prints what was settled.
 *
 * Each day is a spread of pages laid two across, and the day's first stop is promoted out of its page into a plate
 * that runs the full width of the spread, crossing the gutter. The promotion is the day's own order rather than a
 * decoration: a day is read forwards, and the stop it opens with is the one that establishes it.
 */
export const Book = () => {
  const { trip } = useTrip()
  const owner = trip.party.find((p) => p.id === trip.ownerId)?.name ?? 'the owner'

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
            control. It prints nothing of itself: the sheet is the Book. */}
        <button
          type="button"
          className="cover-save t-label"
          onClick={() =>
            saveAsPdf(`${trip.destination} Book, ${dayLabel(trip.startDate)} ${trip.startDate.slice(0, 4)}`)
          }
        >
          Save As PDF
        </button>

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
            <dt className="t-label">Each</dt>
            <dd>{money(tripCostRM(trip))}</dd>
          </div>
        </dl>
      </article>

      {trip.days.map((day) => {
        const entries = entriesOf(day, trip.options)
        const pages = pagesOf(entries)
        const lead = entries[0]
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

              {/* Day-level, like the band beside it, so the page number stays the last mark on the page. Below the
                  pages it read as a footnote arriving after the book had already finished the spread. */}
              {route && (
                <a className="t-label day-route" href={route} target="_blank" rel="noreferrer noopener">
                  Open The Transit Route
                </a>
              )}
            </header>

            {lead ? (
              <div className="spread-lead">
                {/* The reel's own poster frame. Nothing new is fetched: this is the still the deck already showed
                    for the place, so the Book is made of the trip's pictures rather than of a map. */}
                <img className="lead-shot" src={lead.place.reel.poster} alt="" />
                <h2 className="t-plate-title lead-title">{day.title}</h2>

                {/* Pinned rather than printed: the route is the reader's own note about the day, laid on the plate
                    it describes. The tilt is what pinning means; there is no shadow, per `DESIGN.md`. It is anchored
                    to the picture rather than to the spread so it lands on the same corner whatever the band wraps
                    to, and the note is opaque paper so the drawing is never read through a photograph. */}
                {entries.length > 1 && (
                  <figure className="spread-pin">
                    <span className="pin-head" aria-hidden="true" />
                    <Plate day={day.index} title={day.title} stops={entries.map((e) => e.place)} />
                  </figure>
                )}
              </div>
            ) : (
              <h2 className="t-plate-title">{day.title}</h2>
            )}

            <div className="spread-pages">
              {pages.map((page, pageIndex) => (
                <section key={page[0]?.slot.id ?? pageIndex} className="page">
                  {page.map((entry, i) => (
                    <section key={entry.slot.id} className="entry">
                      {/* The first stop's picture is the spread's plate above, so its entry is words only and sits
                          directly beneath it. Everything after it carries its own. */}
                      {!(pageIndex === 0 && i === 0) && (
                        <img className="entry-shot" src={entry.place.reel.poster} alt="" loading="lazy" />
                      )}
                      <div className="entry-text">
                        <p className="t-label entry-when">{PERIOD[entry.slot.period]}</p>
                        <h3 className="t-name">{entry.place.name}</h3>
                        <p className="t-prose entry-prose">{entry.place.blurb}</p>
                        <p className="t-specimen">
                          {duration(entry.place.dwellMin)} &middot; {price(entry.place)}
                          {entry.transit > 0 && <> &middot; {entry.transit} min from the last stop</>}
                        </p>
                      </div>
                    </section>
                  ))}
                  <p className="page-num t-specimen" aria-hidden="true" />
                </section>
              ))}
            </div>

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

      <article className="spread colophon">
        <p className="t-label">Before We Go</p>
        <h2 className="t-plate-title">What This Trip Needs</h2>
        <ul className="colophon-list t-prose">
          {trip.checklist.map((item) => (
            <li key={item.id} data-ticked={item.ticked}>
              {item.label}
            </li>
          ))}
        </ul>
        <Link className="colophon-back t-label" to="/desk">
          Back To The Desk
        </Link>
      </article>
    </main>
  )
}
