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
  // Both boundary controls disable at their limits; the other days retain their stored starts.
  const html = renderDesk(
    seeded((trip) => {
      slotOf(trip, 0, 0).day.startMin = 480
      slotOf(trip, 1, 0).day.startMin = 300
      slotOf(trip, 2, 0).day.startMin = 600
    })
  )
  expect(html.match(/>08:00</g)).toHaveLength(1)
  expect(html.match(/>05:00</g)).toHaveLength(1)
  expect(html.match(/>10:00</g)).toHaveLength(1)
  expect(html.match(/>09:00</g)).toHaveLength(1)
  expect(html).toContain('disabled="" title="Start the day thirty minutes earlier"')
  expect(html).toContain('disabled="" title="Start the day thirty minutes later"')
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

test('a feasibility chip reads Closed when the day is red because a held stop is closed on that weekday', () => {
  // Shinjuku Gyoen is closed on Mondays; day 4 is Monday. evaluateDay makes this a red day with reason=closed.
  // The chip renders "Closed" rather than the default "Overruns" label, without changing evaluateDay itself.
  const html = renderDesk(
    seeded((trip) => {
      slotOf(trip, 3, 0).slot.placeId = 'shinjuku-gyoen'
      const day = slotOf(trip, 3, 0).day
      day.feasibility = evaluateDay(day, trip.options)
    })
  )
  // Day 4 shows Closed in the state chip.
  expect(html).toContain('>Closed<')
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

test('says how many places are eligible when the content cannot hold the plan', () => {
  // Everyone says no to everything but Sensoji, so one place is the only one that may be used. availablePlaces is
  // a candidate count, not a fill count - the note says one place is eligible for twelve slots and never says the
  // plan will fill one of them, because a single place closed on its days would fill none.
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
  expect(html).toContain('Only 1 distinct place is eligible for 12 slots')
  expect(html).toContain('The days already on the Desk stay as they are')
  expect(html).not.toContain('can fill only')
})

test('counts eligible places, not filled slots, when the one place is closed on every trip day', () => {
  // The delta repro: one place is eligible and it is closed on every one of the trip's four weekdays, so the
  // scheduler fills zero of the twelve slots. The old copy claimed a fill of one; the note must say what is
  // eligible, not what the scheduler achieved, and it must not drag in the day-count ceiling, which the date
  // panel already states.
  const html = renderDesk(
    seeded((trip) => {
      for (const member of Object.keys(trip.votes)) {
        const answers = trip.votes[member] as Record<string, Answer>
        for (const [placeId, answer] of Object.entries(answers)) {
          if (answer && placeId !== 'sensoji') answers[placeId] = 'no'
        }
      }
      for (const place of Object.values(trip.options)) place.closedOn = ['friday', 'saturday', 'sunday', 'monday']
    })
  )
  expect(html).toContain('Only 1 distinct place is eligible for 12 slots')
  expect(html).not.toContain('can fill only')
  expect(html).not.toContain('days at most')
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

test('Proto Controls follows the pool and grid in a separate full-width desktop row', async () => {
  const html = renderDesk(seeded(() => {}))
  // Proto is a direct child of desk-body alongside pool and grid, not nested under pool.
  // The three children appear in pool → grid → proto order in the JSX.
  const poolIdx = html.indexOf('class="desk-pool"')
  const gridIdx = html.indexOf('class="desk-grid"')
  const protoIdx = html.indexOf('class="desk-proto"')
  expect(poolIdx).toBeGreaterThan(-1)
  expect(gridIdx).toBeGreaterThan(poolIdx)
  expect(protoIdx).toBeGreaterThan(gridIdx)
  expect(html).toContain('Prototype Controls')

  const css = await Bun.file(new URL('./Desk.css', import.meta.url)).text()
  const desktop = css.slice(css.indexOf('@media (min-width: 900px)'))
  expect(desktop).toMatch(/\.desk-grid\s*\{\s*grid-area:\s*1 \/ 2;/)
  expect(desktop).toMatch(/\.desk-proto\s*\{\s*grid-area:\s*2 \/ 1 \/ auto \/ -1;/)
  expect(desktop).not.toContain('grid-area: 1 / 2 / span 2')
})

test('renders no literal entity text', () => {
  // JSX decodes entities in markup but not inside string literals: a `&rsquo;` written in a string literal
  // ships to the screen as the letters amp-r-s-q-u-o. The static render escapes the ampersand, so the tell is
  // the doubled form. The capacity note renders on this trip in its constraint branch, so both the markup path
  // and the decoded apostrophe are pinned at once.
  const html = renderDesk(
    seeded((trip) => {
      for (const member of Object.keys(trip.votes)) {
        const answers = trip.votes[member] as Record<string, Answer>
        for (const placeId of Object.keys(answers)) answers[placeId] = 'yes'
      }
      for (const place of Object.values(trip.options)) place.closedOn = ['friday']
    })
  )
  expect(html).not.toContain('&amp;rsquo;')
  expect(html).not.toContain('&amp;mdash;')
  expect(html).not.toContain('&amp;minus;')
  expect(html).toContain('destination’s content')
})
