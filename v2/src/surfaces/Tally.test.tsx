import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { trip as seed } from '../data/trip'
import type { Trip } from '../data/types'
import { TripProvider } from '../state'
import { Tally } from './Tally'

const renderTally = (trip: Trip = seed) => {
  const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: () => JSON.stringify(trip), setItem: () => undefined }
  })
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { location: { origin: 'https://perch.test' } }
  })
  try {
    return renderToStaticMarkup(
      <TripProvider>
        <MemoryRouter initialEntries={[`/t/${trip.id}/votes`]}>
          <Tally />
        </MemoryRouter>
      </TripProvider>
    )
  } finally {
    if (storageDescriptor) Object.defineProperty(globalThis, 'localStorage', storageDescriptor)
    else Reflect.deleteProperty(globalThis, 'localStorage')
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor)
    else Reflect.deleteProperty(globalThis, 'window')
  }
}

test('explains that Must Go adds normal Yes support but only its bonus changes rank', () => {
  const html = renderTally()

  expect(html).toContain('Voted In Rule')
  expect(html).toContain('displayed weighted support rounds to 50% or more')
  expect(html).toContain('full party stays in the denominator')
  expect(html).toContain('Must Go counts as that person’s Yes')
  expect(html).toContain('its extra half point changes rank only')
  expect(html).toContain('never increases the support percentage')
})

test('places accessible Must Go hearts beside destination names instead of verdict chips', () => {
  const html = renderTally()

  expect(html.match(/data-must-heart/g)).toHaveLength(3)
  expect(html).toContain('aria-label="Must Go by Farah"')
  expect(html).toContain('aria-label="Must Go by Hana"')
  expect(html).toContain('aria-label="Must Go by Iman"')
  expect(html).not.toContain('Must Go ·')
  expect(html).not.toContain('title="Must Go')
  expect(html.match(/class="info-dot tally-must"/g)).toHaveLength(3)
  expect(html).toContain('aria-expanded="false"')
})

test('preserves distinct member identities when Must Go voters share a name', () => {
  const first = seed.party.find((member) => Object.values(seed.votes[member.id] ?? {}).includes('must'))
  const second = seed.party.find((member) => member.id !== first?.id)
  const placeId = first
    ? Object.entries(seed.votes[first.id] ?? {}).find(([, answer]) => answer === 'must')?.[0]
    : undefined
  if (!first || !second || !placeId) throw new Error('The voting fixture needs two members and one Must Go vote')

  const duplicateNameTrip: Trip = {
    ...seed,
    party: seed.party.map((member) =>
      member.id === first.id || member.id === second.id ? { ...member, name: 'Same Name' } : member
    ),
    votes: {
      ...seed.votes,
      [second.id]: { ...seed.votes[second.id], [placeId]: 'must' }
    }
  }
  const html = renderTally(duplicateNameTrip)

  expect(html.match(/aria-label="Must Go by Same Name"/g)).toHaveLength(2)
  expect(html).toContain(`data-must-voter="${first.id}"`)
  expect(html).toContain(`data-must-voter="${second.id}"`)
})

test('lets the current owner end an open browser-local session and explains the deadline', () => {
  const html = renderTally()

  expect(html).toContain('>End Voting Session</button>')
  expect(html).toContain('one day before the trip at midnight Tokyo time')
  expect(html).toContain('not a background service')
})

test('shows a final closed state without another invite or end-session control', () => {
  const html = renderTally({ ...seed, votingClosedAt: '2026-09-10T12:00:00.000Z' })

  expect(html).toContain('Voting Closed')
  expect(html).toContain('This tally is final')
  expect(html).not.toContain('The Invite')
  expect(html).not.toContain('End Voting Session')
})
