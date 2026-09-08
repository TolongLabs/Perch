import { Link } from 'react-router-dom'
import { Plate } from '../components/Plate'
import { transitMin } from '../data/travel'
import type { Place, Slot } from '../data/types'
import { dayCostRM, tripCostRM } from '../lib/cost'
import { dayLabel, duration, money, price } from '../lib/format'
import { transitRoute } from '../lib/mapsLink'
import { useTrip } from '../state'
import './Book.css'

const WORDS: Record<number, string> = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven' }

const PERIOD: Record<Slot['period'], string> = {
  morning: 'In The Morning',
  afternoon: 'In The Afternoon',
  evening: 'That Evening'
}

/**
 * The keepsake, and the shared link. Printed state only: there is no setting state here, no blank slot and no
 * awaiting-decision chip, because a plate prints what was settled. A day that has not been scheduled simply has
 * fewer entries rather than a row of holes.
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
        const stops = day.slots
          .map((slot) => (slot.placeId ? trip.options[slot.placeId] : undefined))
          .filter((p): p is Place => p !== undefined)
        const route = transitRoute(stops)

        return (
          <article key={day.index} className="spread day-spread" data-day={day.tint}>
            <div className="spread-plate">
              <Plate day={day.index} title={day.title} stops={stops} />
            </div>

            <div className="spread-text">
              <p className="t-label spread-band">
                Day {day.index} &middot; {day.weekday} {dayLabel(day.date)} &middot;{' '}
                {money(dayCostRM(day, trip.options))}
              </p>
              <h2 className="t-plate-title">{day.title}</h2>

              {day.slots.map((slot, i) => {
                const place = slot.placeId ? trip.options[slot.placeId] : undefined
                if (!place) return null
                const previousId = day.slots
                  .slice(0, i)
                  .reverse()
                  .find((s) => s.placeId !== null)?.placeId
                const transit = previousId ? transitMin(previousId, place.id) : 0

                return (
                  <section key={slot.id} className="entry">
                    <p className="t-label entry-when">{PERIOD[slot.period]}</p>
                    <h3 className="t-name">{place.name}</h3>
                    <p className="t-prose entry-prose">{place.blurb}</p>
                    <p className="t-specimen">
                      {duration(place.dwellMin)} &middot; {price(place)}
                      {transit > 0 && <> &middot; {transit} min from the last stop</>}
                    </p>
                  </section>
                )
              })}

              {route && (
                <a className="t-label day-route" href={route} target="_blank" rel="noreferrer noopener">
                  Transit Route
                </a>
              )}
            </div>
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
