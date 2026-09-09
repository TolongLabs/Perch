import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { addDays, DateRangePicker, nightsBetween, type Range } from '../components/DateRangePicker'
import { ChipGroup, Field, Heading } from '../components/Ui'
import { isJoiner } from '../lib/joiner'
import { MAX_PARTY, useTrip } from '../state'
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

const DESTINATIONS = [
  { id: 'tokyo', label: 'Tokyo' },
  { id: 'kyoto', label: 'Kyoto', disabled: true },
  { id: 'osaka', label: 'Osaka', disabled: true },
  { id: 'sapporo', label: 'Sapporo', disabled: true }
]

export const Onboarding = () => {
  const navigate = useNavigate()
  const { trip, setDates, addMember, removeMember, renameMember } = useTrip()
  // How you arrived, not what is stored. The prototype holds one trip either way, so the form is prefilled from it
  // in both cases; what changes is whether the reader was told they are starting something or changing something.
  // `/new` on its own is the new plan, which is what the landing and the sign-in path reach.
  const [params] = useSearchParams()
  const editing = params.has('edit')
  // Seeded from the trip rather than left blank: onboarding configures a fixture that already has dates, and
  // `PRODUCT.md`'s rule is that no question is asked which Perch can already answer.
  const [range, setRange] = useState<Range>(() => ({
    start: trip.startDate,
    end: addDays(trip.startDate, trip.nights)
  }))
  // What each row shows while it is being typed in. The trip is the record of who is coming, and a rename is
  // refused while the field is blank, so a half-cleared field would otherwise snap back to the old name under the
  // cursor. The draft holds what was typed; the party holds the last name that was actually given.
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [focusLast, setFocusLast] = useState(false)
  const rows = useRef<HTMLUListElement>(null)
  const [intent, setIntent] = useState('')
  const [city, setCity] = useState('')
  const [activities, setActivities] = useState<string[]>([])
  const [destination, setDestination] = useState<string[]>(['tokyo'])

  // The row that was just added takes the cursor, so the placeholder name is typed over rather than kept.
  useEffect(() => {
    if (!focusLast) return
    const inputs = rows.current?.querySelectorAll('input')
    const last = inputs?.[inputs.length - 1]
    last?.focus()
    last?.select()
    setFocusLast(false)
  }, [focusLast])

  // The invite link is the swipe link, so anyone who came in through it already has a trip and is never asked to set
  // one up. They go straight back to the deck.
  if (isJoiner()) return <Navigate to={`/t/${trip.id}/swipe`} replace />

  const nights = range.start && range.end ? nightsBetween(range.start, range.end) : 0
  const datesSet = nights > 0
  const datesMoved = datesSet && (range.start !== trip.startDate || nights !== trip.nights)
  const owner = trip.party.find((p) => p.id === trip.ownerId)
  const shown = (id: string, name: string) => drafts[id] ?? name
  // Read off the row rather than out of the trip: a blank field is refused as a rename, so the party still holds a
  // name the screen is not showing, and a button that says you are ready while the field reads empty is a lie.
  const named = owner ? shown(owner.id, owner.name).trim().length > 0 : false
  const ready = datesSet && named && destination.includes('tokyo')

  const rename = (memberId: string, value: string) => {
    setDrafts((current) => ({ ...current, [memberId]: value }))
    renameMember(memberId, value)
  }

  // A row is a member, so adding one adds a member; the party has no blank people in it. The name is a placeholder
  // and the field is selected, so the first keystroke replaces it.
  const addFriend = () => {
    addMember(`Friend ${trip.party.length}`)
    setFocusLast(true)
  }

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((v) => v !== id) : [...list, id])

  const start = () => {
    if (!ready || !range.start) return
    setDates(range.start, nights)
    navigate(`/t/${trip.id}/swipe`)
  }

  return (
    <main className="ob">
      <Heading
        as="h1"
        info="Perch fills in what it can and asks for the rest. The dates and the city shape the calendar; the activities and the free text only tip which reels come up first."
      >
        <span className="t-display">{editing ? 'Edit This Trip' : 'Plan A New Trip'}</span>
      </Heading>

      {/* Only on the way in from Edit Trip. A reader who pressed Start Planning is starting something and does not
          need telling that the fields already have answers in them; one who pressed Edit Trip does. */}
      {editing && (
        <p className="t-specimen ob-intro">
          This is the trip you already have, with everything Perch knows filled in. Changing anything here changes that
          trip; nothing starts over.
        </p>
      )}

      <section className="ob-section" data-state={datesSet ? 'decided' : 'open'}>
        <p className="t-label ob-legend">When</p>
        <DateRangePicker value={range} onChange={setRange} />
        <p className="t-specimen ob-count">
          {datesSet
            ? `${nights + 1} days, ${nights} ${nights === 1 ? 'night' : 'nights'}`
            : 'Tap the first day, then the last.'}
        </p>
        {/* Before the press, not after it. Moving the dates rebuilds the calendar, and a reader who has spent time
            arranging days and pinning stops should know that from the form rather than from losing them. */}
        {editing && (
          <p className="t-specimen ob-dates-note" data-state={datesMoved ? 'at-risk' : 'decided'}>
            {datesMoved
              ? 'These are new dates, so the days are rebuilt and the stops you have pinned are cleared.'
              : 'Unchanged, so the days you have planned and the stops you have pinned stay as they are.'}
          </p>
        )}
      </section>

      <section className="ob-section" data-state={named ? 'decided' : 'open'}>
        <p className="t-label ob-legend">Who Is Coming</p>
        <ul className="ob-party" ref={rows}>
          {trip.party.map((member, i) => (
            <li key={member.id} className="ob-party-row">
              <span className="t-label ob-party-role">{i === 0 ? 'You' : 'Friend'}</span>
              <input
                className="field-input"
                type="text"
                value={shown(member.id, member.name)}
                aria-label={i === 0 ? 'Your name' : `Name of friend ${i}`}
                placeholder={i === 0 ? 'Your name' : 'Their name'}
                onChange={(e) => rename(member.id, e.target.value)}
              />
              {/* The owner has no remove control. Everyone else's takes them and their votes out of the trip,
                  which is why it is a button rather than a cleared field: the two mean different things now. */}
              {i > 0 && (
                <button
                  type="button"
                  className="ob-party-drop"
                  onClick={() => removeMember(member.id)}
                  aria-label={`Remove ${member.name} from the trip`}
                  title={`Remove ${member.name} and their votes`}
                >
                  &minus;
                </button>
              )}
            </li>
          ))}
        </ul>
        {trip.party.length < MAX_PARTY && (
          <button type="button" className="ob-party-add t-label" onClick={addFriend}>
            Add Someone
          </button>
        )}
        <p className="t-specimen ob-party-help">
          Six at most, you and five others. Renaming a row keeps that person&rsquo;s votes, removing one takes their
          votes with them, and adding one starts them with none.
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
