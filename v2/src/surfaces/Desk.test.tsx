import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { trip as seed } from '../data/trip'
import type { Answer, Trip } from '../data/types'
import { evaluateDay } from '../lib/schedule'
import { TripProvider } from '../state'
import { Desk } from './Desk'

// Bun's test runtime has no localStorage; the store wraps every access in try/catch, so it falls back to the seed
// and every test would render the fixture. A map-backed stub gives the seeded trips somewhere to live.
const storage = new Map<string, string>()
globalThis.localStorage = {
  getItem: (k: string) => storage.get(k) ?? null,
  setItem: (k: string, v: string) => void storage.set(k, v),
  removeItem: (k: string) => void storage.delete(k),
  clear: () => void storage.clear(),
  key: () => null,
  get length() {
    return storage.size
  }
} as Storage

const KEY = 'perch.trip.v1'

const renderDesk = (trip: Trip) => {
  localStorage.setItem(KEY, JSON.stringify(trip))
  const html = renderToStaticMarkup(
    <TripProvider>
      <MemoryRouter initialEntries={['/desk']}>
        <Desk />
      </MemoryRouter>
    </TripProvider>
  )
  localStorage.removeItem(KEY)
  return html
}

/** The fixture's days carry no stops, so a test that places one mutates a structured copy. */
const seeded = (mutate: (trip: Trip) => void): Trip => {
  const trip = structuredClone(seed)
  mutate(trip)
  return trip
}

/** Indexes into the fixture, which always holds the slot: `noUncheckedIndexedAccess` sees only the array. */
const slotOf = (trip: Trip, dayIndex: number, slotIndex: number) => {
  const day = trip.days[dayIndex]
  const slot = day?.slots[slotIndex]
  if (!day || !slot) throw new Error(`fixture day ${dayIndex} slot ${slotIndex} missing`)
  return { day, slot }
}

test('names the weekday on each day card, alongside the date', () => {
  const html = renderDesk(seeded(() => {}))
  // Day 1 is Friday 20 Nov: the stamp reads 'Day 1 20 Nov Fri', not just the date.
  expect(html).toContain('>20 Nov<')
  expect(html).toContain('>Fri<')
  // Four days, four weekdays, in fixture order.
  expect(html.match(/>Fri</g)).toHaveLength(1)
  expect(html.match(/>Sat</g)).toHaveLength(1)
  expect(html.match(/>Sun</g)).toHaveLength(1)
  expect(html.match(/>Mon</g)).toHaveLength(1)
})

test('shows the daily start time on each day, defaulting to 09:00', () => {
  const html = renderDesk(seeded(() => {}))
  expect(html.match(/>Start</g)).toHaveLength(4)
  expect(html.match(/>09:00</g)).toHaveLength(4)
  expect(html).toContain('aria-label="Start day 1 thirty minutes earlier"')
  expect(html).toContain('aria-label="Start day 4 thirty minutes later"')
})

test('shows the stored start time when a day has been moved, and disables the spent step', () => {
  // Day 1 has been stepped to 08:00 and day 2 to first light at 00:00: the clock reads the stored startMin, the
  // two untouched days keep 09:00, and a day that already starts at 00:00 has spent its earlier step, so only that
  // button disables. On this empty calendar no other control is disabled, so the count is exact.
  const html = renderDesk(
    seeded((trip) => {
      slotOf(trip, 0, 0).day.startMin = 480
      slotOf(trip, 1, 0).day.startMin = 0
    })
  )
  expect(html.match(/>08:00</g)).toHaveLength(1)
  expect(html.match(/>00:00</g)).toHaveLength(1)
  expect(html.match(/>09:00</g)).toHaveLength(2)
  // Day 2 starts at 00:00, so its earlier step is the spent one: the disabled attribute sits between the class and
  // the title in the render, so it is exact to match the pair rather than count a word across the page.
  expect(html).toContain('disabled="" title="Start the day thirty minutes earlier"')
  expect(html).not.toContain('disabled="" title="Start the day thirty minutes later"')
})

test('keeps the unanimous mark on a card once it is placed in a slot', () => {
  // teamLab Planets is unanimous in the fixture; day 1's morning slot holds it.
  const html = renderDesk(
    seeded((trip) => {
      slotOf(trip, 0, 0).slot.placeId = 'teamlab-planets'
    })
  )
  expect(html).toContain(
    '<article class="card card-placed" data-dragging="false" data-pinned="false" data-flying="false" data-unanimous="true" data-closed="false"'
  )
})

test('marks in red a card placed on a day the place is closed', () => {
  // Shinjuku Gyoen is voted in at 78% but closed on Mondays; day 4 is Monday.
  const html = renderDesk(
    seeded((trip) => {
      slotOf(trip, 3, 0).slot.placeId = 'shinjuku-gyoen'
    })
  )
  expect(html).toContain(
    '<article class="card card-placed" data-dragging="false" data-pinned="false" data-flying="false" data-unanimous="false" data-closed="true"'
  )
  expect(html).toContain('Closed This Day')
})

test('a placed card that is both unanimous and closed shows the closed warning', () => {
  // The fixture has no place that is both unanimous and closed, so the test makes one: every member says yes to
  // Shinjuku Gyoen and the card sits on day 4, the Monday it closes. The closed warning is the state that changes
  // what happens on that day, so it shows even with the unanimous mark present, and the card carries both.
  const html = renderDesk(
    seeded((trip) => {
      for (const member of Object.keys(trip.votes)) {
        const answers = trip.votes[member] as Record<string, Answer>
        answers['shinjuku-gyoen'] = 'yes'
      }
      slotOf(trip, 3, 0).slot.placeId = 'shinjuku-gyoen'
    })
  )
  expect(html).toContain('data-unanimous="true" data-closed="true"')
  expect(html).toContain('Closed This Day')
})

test('shows the day span, end time and cost once the day is scheduled', () => {
  const html = renderDesk(
    seeded((trip) => {
      const { day, slot } = slotOf(trip, 0, 0)
      slot.placeId = 'sensoji'
      // The scheduler's own numbers, so the test checks the Desk shows them, not that it recomputes them.
      day.feasibility = evaluateDay(day, trip.options)
    })
  )
  expect(html).toMatch(/· ends \d{2}:\d{2}/)
  expect(html).toContain('RM')
})

test('says why a plan cannot fill every slot when the content cannot hold it', () => {
  // Everyone says no to everything but Sensoji, so one place has to fill twelve slots.
  const html = renderDesk(
    seeded((trip) => {
      for (const member of Object.keys(trip.votes)) {
        const answers = trip.votes[member] as Record<string, Answer>
        for (const [placeId, answer] of Object.entries(answers)) {
          if (answer && placeId !== 'sensoji') answers[placeId] = 'no'
        }
      }
    })
  )
  expect(html).toContain('covers 8 days at most')
  expect(html).toContain('can fill only 1 of its 12 slots')
})

test('says the days are the limit, not the places, when the content holds the plan but not the days', () => {
  // The advisor's #313 repro: everyone says yes and every place is closed on Friday, day 1's weekday. The content
  // is ample - 24 places for 12 slots - but no place is open on day 1, so the scheduler leaves that day's slots
  // empty. availablePlaces is a count of places that may be used, not of slots that can be filled, so the note must
  // not claim the plan fills 24 of 12 slots; it names the days instead.
  const html = renderDesk(
    seeded((trip) => {
      for (const member of Object.keys(trip.votes)) {
        const answers = trip.votes[member] as Record<string, Answer>
        for (const placeId of Object.keys(answers)) answers[placeId] = 'yes'
      }
      for (const place of Object.values(trip.options)) place.closedOn = ['friday']
    })
  )
  expect(html).not.toContain('can fill only')
  expect(html).toContain('content is enough for every slot')
  expect(html).toContain('not every slot can be filled on these days')
  expect(html).toContain('The days already on the Desk stay as they are')
})

test('says nothing about capacity when the plan can be filled', () => {
  const html = renderDesk(seeded(() => {}))
  expect(html).not.toContain('covers 8 days at most')
  expect(html).not.toContain('can fill only')
})

test('does not ask for confirmation on an empty calendar', () => {
  // Nothing unpinned to lose means no second press: the confirmation block stays out of the render.
  const html = renderDesk(seeded(() => {}))
  expect(html).not.toContain('Yes, Optimize Plan')
  expect(html).not.toContain('Keep This Plan')
})

test('renders no literal entity text', () => {
  // JSX decodes entities in markup but not inside string literals: a `&rsquo;` written in a template literal
  // ships to the screen as the letters amp-r-s-q-u-o. The static render escapes the ampersand, so the tell is
  // the doubled form. The capacity note renders on this trip, so both the markup path and the decoded apostrophe
  // are pinned at once.
  const html = renderDesk(
    seeded((trip) => {
      for (const member of Object.keys(trip.votes)) {
        const answers = trip.votes[member] as Record<string, Answer>
        for (const [placeId, answer] of Object.entries(answers)) {
          if (answer && placeId !== 'sensoji') answers[placeId] = 'no'
        }
      }
    })
  )
  expect(html).not.toContain('&amp;rsquo;')
  expect(html).not.toContain('&amp;mdash;')
  expect(html).not.toContain('&amp;minus;')
  expect(html).toContain('destination’s content')
})
