import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Perch } from '../components/Perch'
import { StateChip } from '../components/StateChip'
import { WhatChanged } from '../components/WhatChanged'
import type { Day, Slot } from '../data/types'
import { dayLabel, duration, money, travel } from '../lib/format'
import { dayCostRM, tripCostRM } from '../lib/repair'
import { useTrip } from '../state'
import './Desk.css'

const PERIOD: Record<Slot['period'], string> = {
  morning: 'Morning',
  midday: 'Midday',
  afternoon: 'Afternoon',
  evening: 'Evening'
}

const mapsUrl = (names: string[], destination: string): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${names.at(-1)}, ${destination}`)}&waypoints=${encodeURIComponent(
    names
      .slice(0, -1)
      .map((n) => `${n}, ${destination}`)
      .join('|')
  )}`

export const Desk = () => {
  const { trip, disrupt, restart } = useTrip()
  const [openDay, setOpenDay] = useState(3)
  const [perch, setPerch] = useState<{ day: Day; slot: Slot } | null>(null)

  const spent = tripCostRM(trip)
  const tapped = trip.party.filter((p) => p.wants.length > 0 || p.availableDays.length > 0)

  return (
    <main className="desk">
      <header className="desk-head">
        <Link className="t-label desk-eyebrow" to="/">
          &larr; Perch &middot; The Desk
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

      <WhatChanged />

      <section className="together" aria-label="Plan It Together">
        <p className="t-label together-kicker">Plan It Together</p>
        <p className="together-copy">
          The link is the trip. Nobody installs anything, and if nobody taps at all this plan is still the plan.
        </p>

        <ul className="together-party">
          {trip.party.map((p) => (
            <li key={p.id} className="together-person" data-tapped={p.wants.length > 0 || p.availableDays.length > 0}>
              <span className="together-initials t-label">{p.initials}</span>
              <span className="t-specimen">
                {p.availableDays.length > 0 ? `${p.wants.length} pick${p.wants.length === 1 ? '' : 's'}` : 'Not opened'}
              </span>
            </li>
          ))}
        </ul>

        <div className="together-actions">
          <Link className="together-open t-label" to={`/t/${trip.id}`}>
            Open The Book
          </Link>
          <button type="button" className="together-nudge t-label" disabled={tapped.length === trip.party.length}>
            Nudge{' '}
            {trip.party
              .filter((p) => p.availableDays.length === 0)
              .map((p) => p.name)
              .join(' And ') || 'Nobody'}
          </button>
        </div>
      </section>

      <ol className="days">
        {trip.days.map((day) => {
          const expanded = openDay === day.index
          const risky = day.slots.some((s) => s.state === 'at-risk')
          const openCount = day.slots.filter((s) => s.state === 'open').length
          const names = day.slots.map((s) => (s.chosenId ? trip.options[s.chosenId]?.name : null)).filter(Boolean)

          return (
            <li key={day.index} className="day" data-day={day.tint} data-expanded={expanded}>
              <button type="button" className="day-row" onClick={() => setOpenDay(expanded ? 0 : day.index)}>
                <span className="day-dot" aria-hidden="true" />
                <span className="day-body">
                  <span className="t-label day-index">
                    Day {day.index} &middot; {dayLabel(day.date)}
                  </span>
                  <span className="t-name">{day.title}</span>
                </span>
                <span className="day-meta">
                  {risky && <StateChip state="at-risk" />}
                  {!risky && openCount > 0 && <StateChip state="open" />}
                  <span className="t-label">{money(dayCostRM(day, trip.options))}</span>
                </span>
              </button>

              {expanded && (
                <div className="day-open">
                  <ul className="slots">
                    {day.slots.map((slot) => {
                      const option = slot.chosenId ? trip.options[slot.chosenId] : undefined
                      return (
                        <li key={slot.id} className="slot" data-state={slot.state}>
                          <p className="t-label slot-period">{PERIOD[slot.period]}</p>

                          {option ? (
                            <>
                              <p className="t-name">{option.name}</p>
                              <p className="t-specimen">
                                {travel(option.travelMin)} &middot; {duration(option.dwellMin)} &middot;{' '}
                                {money(option.costRM)}
                              </p>
                            </>
                          ) : (
                            <p className="t-name slot-empty">Nothing that fits</p>
                          )}

                          <div className="slot-foot">
                            {slot.state !== 'decided' && <StateChip state={slot.state} />}
                            <button
                              type="button"
                              className="slot-perch t-label"
                              onClick={() => setPerch({ day, slot })}
                            >
                              {slot.benchIds.length} On The Perch
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>

                  <a
                    className="day-maps t-label"
                    href={mapsUrl(names as string[], trip.destination)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Day {day.index} In Maps
                  </a>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <footer className="proto">
        <p className="t-label proto-kicker">Prototype Controls</p>
        <p className="t-specimen">
          Not part of the product. These stand in for the feeds a live build would listen to.
        </p>
        <div className="proto-actions">
          <button
            type="button"
            className="proto-fire t-label"
            onClick={() => {
              setOpenDay(3)
              disrupt(3, 'd3-morning', 'Jeep tours cancelled for haze')
            }}
          >
            Cancel The Merapi Jeeps
          </button>
          <button type="button" className="proto-reset t-label" onClick={restart}>
            Start Over
          </button>
        </div>
      </footer>

      {perch && <Perch day={perch.day} slot={perch.slot} onClose={() => setPerch(null)} />}
    </main>
  )
}
