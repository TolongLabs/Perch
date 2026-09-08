import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { addDays, DateRangePicker, nightsBetween, type Range } from '../components/DateRangePicker'
import { ChipGroup, Field, Heading } from '../components/Ui'
import { isJoiner } from '../lib/joiner'
import { useTrip } from '../state'
import './Onboarding.css'

/** Mirrors the tag vocabulary the Tokyo fixture authors on its places. Tapping one is a hint, never a filter. */
const ACTIVITIES = [
  { id: 'food', label: 'Food' },
  { id: 'temples', label: 'Temples' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'art', label: 'Art' },
  { id: 'markets', label: 'Markets' },
  { id: 'night-views', label: 'Night Views' },
  { id: 'parks', label: 'Parks' },
  { id: 'museums', label: 'Museums' }
]

/** Four rows, fixed, so a key is a row rather than a name that is being typed over. */
const PARTY_ROWS = ['owner', 'friend-1', 'friend-2', 'friend-3']

const DESTINATIONS = [
  { id: 'tokyo', label: 'Tokyo' },
  { id: 'kyoto', label: 'Kyoto', disabled: true },
  { id: 'osaka', label: 'Osaka', disabled: true },
  { id: 'sapporo', label: 'Sapporo', disabled: true }
]

export const Onboarding = () => {
  const navigate = useNavigate()
  const { trip, setDates, setParty } = useTrip()
  // Seeded from the trip rather than left blank: onboarding configures a fixture that already has dates, and
  // `PRODUCT.md`'s rule is that no question is asked which Perch can already answer.
  const [range, setRange] = useState<Range>(() => ({
    start: trip.startDate,
    end: addDays(trip.startDate, trip.nights)
  }))
  // Prefilled from the fixture, because PRODUCT.md's rule is that no question is asked which Perch can already
  // answer. The owner is row one and cannot leave; a friend's row left blank drops them.
  const [names, setNames] = useState<string[]>(() => PARTY_ROWS.map((_, i) => trip.party[i]?.name ?? ''))
  const [intent, setIntent] = useState('')
  const [city, setCity] = useState('')
  const [activities, setActivities] = useState<string[]>([])
  const [destination, setDestination] = useState<string[]>(['tokyo'])

  // The invite link is the swipe link, so anyone who came in through it already has a trip and is never asked to set
  // one up. They go straight back to the deck.
  if (isJoiner()) return <Navigate to={`/t/${trip.id}/swipe`} replace />

  const nights = range.start && range.end ? nightsBetween(range.start, range.end) : 0
  const datesSet = nights > 0
  const named = (names[0]?.trim().length ?? 0) > 0
  const ready = datesSet && named && destination.includes('tokyo')

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((v) => v !== id) : [...list, id])

  const start = () => {
    if (!ready || !range.start) return
    setDates(range.start, nights)
    setParty(names)
    navigate(`/t/${trip.id}/swipe`)
  }

  return (
    <main className="ob">
      <Heading
        as="h1"
        info="Perch fills in what it can and asks for the rest. The dates and the city shape the calendar; the activities and the free text only tip which reels come up first."
      >
        <span className="t-display">Plan A New Trip</span>
      </Heading>

      <section className="ob-section" data-state={datesSet ? 'decided' : 'open'}>
        <p className="t-label ob-legend">When</p>
        <DateRangePicker value={range} onChange={setRange} />
        <p className="t-specimen ob-count">
          {datesSet
            ? `${nights + 1} days, ${nights} ${nights === 1 ? 'night' : 'nights'}`
            : 'Tap the first day, then the last.'}
        </p>
      </section>

      <section className="ob-section" data-state={named ? 'decided' : 'open'}>
        <p className="t-label ob-legend">Who Is Coming</p>
        <ul className="ob-party">
          {PARTY_ROWS.map((row, i) => (
            <li key={row} className="ob-party-row">
              <span className="t-label ob-party-role">{i === 0 ? 'You' : 'Friend'}</span>
              <input
                className="field-input"
                type="text"
                value={names[i] ?? ''}
                aria-label={i === 0 ? 'Your name' : `Friend ${i}`}
                placeholder={i === 0 ? 'Your name' : 'Leave blank to drop'}
                onChange={(e) => setNames((current) => current.map((n, j) => (j === i ? e.target.value : n)))}
              />
            </li>
          ))}
        </ul>
        <p className="t-specimen ob-party-help">
          Four at most in the prototype. Clear a friend's name and they leave the trip; a row keeps its votes when it is
          renamed, so you can make this yours without losing anything.
        </p>
      </section>

      <section className="ob-section" data-state={activities.length > 0 || intent ? 'decided' : 'open'}>
        <p className="t-label ob-legend">What You Are After</p>
        <Field
          label="What You Want"
          placeholder="Tell Perch what you want out of this trip"
          help="Type it in your own words first, then tap whatever matches."
          value={intent}
          onChange={setIntent}
        />
        <ChipGroup
          label="Activities"
          chips={ACTIVITIES}
          selected={activities}
          onToggle={(id) => toggle(activities, setActivities, id)}
        />
      </section>

      <section className="ob-section" data-state={destination.length > 0 ? 'decided' : 'open'}>
        <p className="t-label ob-legend">Where</p>
        <Field
          label="Where To"
          placeholder="Name a city"
          help="One city per trip. A different city means a different plan."
          value={city}
          onChange={setCity}
        />
        <ChipGroup
          label="Destination"
          chips={DESTINATIONS}
          selected={destination}
          onToggle={(id) => setDestination([id])}
          note="Only Tokyo has reels in the prototype."
        />
      </section>

      <button type="button" className="ob-go t-label" disabled={!ready} onClick={start}>
        Start Swiping
      </button>
    </main>
  )
}
