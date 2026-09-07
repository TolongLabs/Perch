import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plate } from '../components/Plate'
import { WhatChanged } from '../components/WhatChanged'
import type { Slot } from '../data/types'
import { dayLabel, duration, money } from '../lib/format'
import { tapCount } from '../lib/ranking'
import { dayCostRM, tripCostRM } from '../lib/repair'
import { useTrip } from '../state'
import './Book.css'

const PERIOD: Record<Slot['period'], string> = {
  morning: 'In The Morning',
  midday: 'Around Midday',
  afternoon: 'In The Afternoon',
  evening: 'That Evening'
}

/**
 * The magazine, and the shared link, and Plan It Together. One object in three phases: read-only everywhere except
 * where it is deliberately unfinished, and a tap on a blank is not an edit.
 */
export const Book = () => {
  const { trip, tap, settle } = useTrip()
  const [readerId, setReaderId] = useState('hana')
  const blanks = trip.days.flatMap((d) => d.slots.filter((s) => s.state === 'open'))
  const printed = blanks.length === 0

  return (
    <main className="book">
      <article className="spread cover">
        <p className="t-label cover-eyebrow">{printed ? 'Printed' : 'Still Setting'}</p>
        <h1 className="t-display cover-title">{trip.destination}</h1>
        <p className="t-prose cover-prose">
          {trip.days.length} days, {trip.nights} nights, put together by Aisyah.{' '}
          {printed
            ? 'Everything below is settled.'
            : `There are ${blanks.length} things still open, and they are marked.`}
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

        <div className="cover-reader">
          <span className="t-label">Reading As</span>
          <div className="cover-reader-pills">
            {trip.party.map((p) => (
              <button
                key={p.id}
                type="button"
                className="reader-pill t-label"
                data-active={p.id === readerId}
                onClick={() => setReaderId(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <WhatChanged compact />
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
              const option = slot.chosenId ? trip.options[slot.chosenId] : undefined
              if (!option) return null

              if (slot.state !== 'open') {
                return (
                  <section key={slot.id} className="entry">
                    <p className="t-label entry-when">{PERIOD[slot.period]}</p>
                    <h3 className="t-name">{option.name}</h3>
                    <p className="t-prose entry-prose">{option.blurb}</p>
                    <p className="t-specimen">
                      {option.area} &middot; {duration(option.dwellMin)} &middot; {money(option.costRM)}
                    </p>
                  </section>
                )
              }

              const candidates = [option.id, ...slot.benchIds.slice(0, 2)]

              return (
                <section key={slot.id} className="blank">
                  <p className="t-label entry-when">{PERIOD[slot.period]}</p>
                  <p className="t-prose blank-ask">
                    Perch put {option.name} here. Tap what you&rsquo;d hate to miss and it moves up.
                  </p>

                  <ul className="blank-options">
                    {candidates.map((id) => {
                      const candidate = trip.options[id]
                      if (!candidate) return null
                      const reader = trip.party.find((p) => p.id === readerId)
                      const mine = reader?.wants.includes(id) ?? false

                      return (
                        <li key={id}>
                          <button
                            type="button"
                            className="blank-option"
                            data-mine={mine}
                            onClick={() => tap(readerId, id)}
                          >
                            <span className="t-name">{candidate.name}</span>
                            <span className="t-specimen">
                              {duration(candidate.dwellMin)} &middot; {money(candidate.costRM)}
                            </span>
                            {tapCount(trip, id) > 0 && (
                              <span className="blank-votes t-label">{tapCount(trip, id)}</span>
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>

                  <button type="button" className="blank-settle t-label" onClick={() => settle(day.index, slot.id)}>
                    Settle This One
                  </button>
                </section>
              )
            })}
          </div>
        </article>
      ))}

      <article className="spread colophon">
        <p className="t-label">Before We Go</p>
        <h2 className="t-plate-title">Three Things This Trip Needs</h2>
        <ul className="colophon-list t-prose">
          <li>
            Cash for the gate at Borobudur and Prambanan. Both price foreign visitors well above the domestic rate.
          </li>
          <li>A jacket for Day 3. The Merapi track starts before the sun does.</li>
          <li>Monday closes Sonobudoyo, Vredeburg and Ullen Sentalu, which is why none of them sit on Day 3.</li>
        </ul>
        <Link className="colophon-back t-label" to="/">
          Back To The Desk
        </Link>
      </article>
    </main>
  )
}
