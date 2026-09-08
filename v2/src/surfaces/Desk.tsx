import { Link } from 'react-router-dom'
import type { Slot } from '../data/types'
import { dayCostRM, tripCostRM } from '../lib/cost'
import { dayLabel, duration, money, price } from '../lib/format'
import { useTrip } from '../state'
import './Desk.css'

const PERIOD: Record<Slot['period'], string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }

/**
 * A holding render of the calendar against the new model, so the route stays live while the Desk is rebuilt as the
 * three-slot drag calendar in issue #64. Nothing here is the design.
 */
export const Desk = () => {
  const { trip, restart } = useTrip()
  const spent = tripCostRM(trip)

  return (
    <main className="desk">
      <header className="desk-head">
        <Link className="t-label desk-eyebrow" to="/trips">
          &larr; Your Trips &middot; The Desk
        </Link>
        <h1 className="t-display">{trip.destination}</h1>
        <p className="t-specimen desk-dates">
          {dayLabel(trip.startDate)} &ndash; {dayLabel(trip.days[trip.days.length - 1]?.date ?? trip.startDate)}
          &nbsp;&middot;&nbsp;{trip.nights} nights &middot; {trip.party.length} people
        </p>

        <div className="desk-budget">
          <div className="desk-budget-bar" aria-hidden="true">
            <span style={{ width: `${Math.min(100, (spent / trip.budgetRM) * 100)}%` }} />
          </div>
          <p className="t-label">
            {money(spent)} of {money(trip.budgetRM)} each
          </p>
        </div>
      </header>

      <ol className="days">
        {trip.days.map((day) => (
          <li key={day.index} className="day" data-day={day.tint} data-expanded="true">
            <div className="day-row">
              <span className="day-dot" aria-hidden="true" />
              <span className="day-body">
                <span className="t-label day-index">
                  Day {day.index} &middot; {day.weekday} {dayLabel(day.date)}
                </span>
                <span className="t-name">{day.title}</span>
              </span>
              <span className="day-meta">
                <span className="t-label">{money(dayCostRM(day, trip.options))}</span>
              </span>
            </div>

            <div className="day-open">
              <ul className="slots">
                {day.slots.map((slot) => {
                  const option = slot.placeId ? trip.options[slot.placeId] : undefined
                  return (
                    <li key={slot.id} className="slot" data-pinned={slot.pinned}>
                      <p className="t-label slot-period">{PERIOD[slot.period]}</p>
                      {option ? (
                        <>
                          <p className="t-name">{option.name}</p>
                          <p className="t-specimen">
                            {duration(option.dwellMin)} &middot; {price(option)}
                          </p>
                        </>
                      ) : (
                        <p className="t-name slot-empty">Empty until you apply</p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <footer className="proto">
        <p className="t-label proto-kicker">Prototype Controls</p>
        <p className="t-specimen">Not part of the product.</p>
        <div className="proto-actions">
          <button type="button" className="proto-reset t-label" onClick={restart}>
            Start Over
          </button>
        </div>
      </footer>
    </main>
  )
}
