import { Link } from 'react-router-dom'
import { Plate } from '../components/Plate'
import type { Slot } from '../data/types'
import { dayCostRM, tripCostRM } from '../lib/cost'
import { dayLabel, duration, money, price } from '../lib/format'
import { useTrip } from '../state'
import './Book.css'

const WORDS: Record<number, string> = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven' }

const PERIOD: Record<Slot['period'], string> = {
  morning: 'In The Morning',
  afternoon: 'In The Afternoon',
  evening: 'That Evening'
}

/**
 * The magazine, and the shared link. A holding render against the new model: the cover, one spread per day, and the
 * checklist as the colophon. Issue #66 re-fixtures it for Tokyo properly.
 */
export const Book = () => {
  const { trip } = useTrip()
  const empty = trip.days.flatMap((d) => d.slots.filter((s) => s.placeId === null))
  const printed = empty.length === 0 && trip.checklist.every((item) => item.ticked)

  return (
    <main className="book">
      <article className="spread cover">
        <p className="t-label cover-eyebrow">{printed ? 'Printed' : 'Still Setting'}</p>
        <h1 className="t-display cover-title">{trip.destination}</h1>
        <p className="t-prose cover-prose">
          {WORDS[trip.days.length]} days, {WORDS[trip.nights]} nights, put together by{' '}
          {trip.party.find((p) => p.id === trip.ownerId)?.name ?? 'the owner'}.{' '}
          {empty.length === 0
            ? 'Every slot is filled.'
            : empty.length === 1
              ? 'One slot is still open, and it is marked.'
              : `${empty.length} slots are still open, and they are marked.`}
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

      {trip.days.map((day) => (
        <article key={day.index} className="spread day-spread" data-day={day.tint}>
          <div className="spread-plate">
            <Plate day={day.index} title={day.title} />
          </div>

          <div className="spread-text">
            <p className="t-label spread-band">
              Day {day.index} &middot; {day.weekday} {dayLabel(day.date)} &middot; {money(dayCostRM(day, trip.options))}
            </p>
            <h2 className="t-plate-title">{day.title}</h2>

            {day.slots.map((slot) => {
              const option = slot.placeId ? trip.options[slot.placeId] : undefined
              if (!option) {
                return (
                  <section key={slot.id} className="gap">
                    <p className="t-label entry-when">{PERIOD[slot.period]}</p>
                    <h3 className="t-name gap-title">Nothing Here Yet</h3>
                    <p className="t-prose entry-prose">This slot fills when the calendar is applied on the Desk.</p>
                  </section>
                )
              }
              return (
                <section key={slot.id} className="entry">
                  <p className="t-label entry-when">{PERIOD[slot.period]}</p>
                  <h3 className="t-name">{option.name}</h3>
                  <p className="t-prose entry-prose">{option.blurb}</p>
                  <p className="t-specimen">
                    {duration(option.dwellMin)} &middot; {price(option)}
                  </p>
                </section>
              )
            })}
          </div>
        </article>
      ))}

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
