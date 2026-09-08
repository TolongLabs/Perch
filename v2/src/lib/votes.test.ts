import { describe, expect, test } from 'bun:test'
import { places } from '../data/places'
import { trip } from '../data/trip'
import type { Votes } from '../data/types'
import { computeTally, nextReplacement, tallyFor, votedIn } from './votes'

const all = (answer: 'yes' | 'no'): Record<string, 'yes' | 'no'> =>
  Object.fromEntries(places.map((p) => [p.id, answer]))

describe('computeTally', () => {
  test('four yes votes with the owner is 100 percent and unanimous', () => {
    const votes: Votes = Object.fromEntries(trip.party.map((p) => [p.id, all('yes')]))
    const entry = computeTally(votes, trip.options, trip.party, trip.ownerId)[0]
    expect(entry?.percentage).toBe(100)
    expect(entry?.unanimous).toBe(true)
  })

  test('the owner alone is 1.5 of 4.5, 33 percent', () => {
    const votes: Votes = { aisyah: { sensoji: 'yes' } }
    const entry = computeTally(votes, trip.options, trip.party, trip.ownerId).find((t) => t.placeId === 'sensoji')
    expect(entry?.percentage).toBe(33)
  })

  test('a member alone is 1 of 4.5, 22 percent, so the owner counts 1.5 times a member', () => {
    const votes: Votes = { farah: { sensoji: 'yes' } }
    const entry = computeTally(votes, trip.options, trip.party, trip.ownerId).find((t) => t.placeId === 'sensoji')
    expect(entry?.percentage).toBe(22)
  })

  test('zero weighted yes is eliminated and out of the ranked list', () => {
    const tally = tallyFor(trip)
    const hama = tally.find((t) => t.placeId === 'hama-rikyu-gardens')
    expect(hama?.eliminated).toBe(true)
    expect(votedIn(tally).some((t) => t.placeId === 'hama-rikyu-gardens')).toBe(false)
  })

  test('ties break by fixture order', () => {
    const votes: Votes = { farah: { ameyoko: 'yes', sensoji: 'yes' } }
    const ids = computeTally(votes, trip.options, trip.party, trip.ownerId)
      .slice(0, 2)
      .map((t) => t.placeId)
    expect(ids).toEqual(['sensoji', 'ameyoko'])
  })
})

describe('the votes fixture', () => {
  const tally = tallyFor(trip)

  test('has at least two unanimous and two eliminated places', () => {
    expect(tally.filter((t) => t.unanimous).length).toBeGreaterThanOrEqual(2)
    expect(tally.filter((t) => t.eliminated).length).toBeGreaterThanOrEqual(2)
  })

  test('shows partial percentages before the owner casts a swipe', () => {
    const withoutOwner = computeTally({ ...trip.votes, aisyah: {} }, trip.options, trip.party, trip.ownerId)
    expect(withoutOwner.some((t) => t.percentage > 0 && t.percentage < 100)).toBe(true)
  })

  test('ranks enough places to fill twelve slots', () => {
    expect(votedIn(tally).length).toBeGreaterThanOrEqual(12)
  })
})

describe('nextReplacement', () => {
  test('returns the next-ranked voted-in card not already on the day', () => {
    const tally = tallyFor(trip)
    const day = trip.days[0]
    if (!day?.slots[0]) throw new Error('fixture has no day')
    const first = nextReplacement(day.slots[0], day, trip, tally)
    expect(first).not.toBeNull()
    const filled = { ...day, slots: day.slots.map((s, i) => (i === 1 ? { ...s, placeId: first?.id ?? null } : s)) }
    const second = nextReplacement(day.slots[0], filled, trip, tally)
    expect(second?.id).not.toBe(first?.id)
  })

  test('never offers a card already placed on another day', () => {
    const tally = tallyFor(trip)
    const day = trip.days[0]
    const other = trip.days[1]
    if (!day?.slots[0] || !other?.slots[0]) throw new Error('fixture has too few days')

    const offer = nextReplacement(day.slots[0], day, trip, tally)
    if (!offer) throw new Error('fixture offers nothing to replace with')

    // Park that same card in another day. Offering it again would steal it from there on swap.
    const held = {
      ...trip,
      days: trip.days.map((d) =>
        d.index === other.index
          ? { ...d, slots: d.slots.map((s, i) => (i === 0 ? { ...s, placeId: offer.id } : s)) }
          : d
      )
    }
    expect(nextReplacement(day.slots[0], day, held, tally)?.id).not.toBe(offer.id)
  })
})
