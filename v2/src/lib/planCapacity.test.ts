import { describe, expect, test } from 'bun:test'
import { trip } from '../data/trip'
import type { Answer, Day, Trip } from '../data/types'
import { maxTripDays, planCapacity } from './planCapacity'
import { evaluateDay, scheduleTrip } from './schedule'

const allVotes = (trip: Trip, answer: 'yes' | 'skip'): Trip['votes'] => {
  const votes: Record<string, Record<string, Answer>> = {}
  for (const member of trip.party) {
    const memberVotes: Record<string, Answer> = {}
    for (const placeId of Object.keys(trip.options)) memberVotes[placeId] = answer
    votes[member.id] = memberVotes
  }
  return votes
}

const dayVotes = (trip: Trip, ids: string[]): Trip['votes'] => {
  const votes: Record<string, Record<string, Answer>> = {}
  for (const member of trip.party) {
    const memberVotes: Record<string, Answer> = {}
    for (const id of ids) memberVotes[id] = 'yes'
    votes[member.id] = memberVotes
  }
  return votes
}

describe('maxTripDays', () => {
  test('is the destination content ceiling and zero below three options', () => {
    expect(maxTripDays(trip)).toBe(8)
    expect(maxTripDays({ ...trip, options: {} })).toBe(0)
    const sensoji = trip.options.sensoji
    const nakamise = trip.options.nakamise
    if (!sensoji || !nakamise) throw new Error('fixture missing places')
    expect(maxTripDays({ ...trip, options: { a: sensoji, b: nakamise } })).toBe(0)
  })
})

describe('planCapacity', () => {
  test('reports the content ceiling, required slots and available places', () => {
    const capacity = planCapacity(trip)
    expect(capacity.maxDays).toBe(maxTripDays(trip))
    expect(capacity.requiredPlaces).toBe(trip.days.reduce((sum, d) => sum + d.slots.length, 0))
    expect(capacity.availablePlaces).toBeGreaterThan(0)
  })

  test('availablePlaces is the union of voted-in and valid pinned-slot places', () => {
    const sensoji = trip.options.sensoji
    if (!sensoji) throw new Error('fixture missing sensoji')
    const withSlotPin = {
      ...trip,
      votes: allVotes(trip, 'skip'),
      days: trip.days.map((d, i) =>
        i === 0
          ? { ...d, slots: d.slots.map((s, j) => (j === 0 ? { ...s, placeId: sensoji.id, pinned: true } : s)) }
          : d
      )
    }
    expect(planCapacity(withSlotPin).availablePlaces).toBe(1)
  })

  test('availablePlaces ignores unknown pinned-slot placeIds', () => {
    const withUnknownPin = {
      ...trip,
      votes: allVotes(trip, 'skip'),
      days: trip.days.map((d, i) =>
        i === 0
          ? { ...d, slots: d.slots.map((s, j) => (j === 0 ? { ...s, placeId: 'not-a-place', pinned: true } : s)) }
          : d
      )
    }
    expect(planCapacity(withUnknownPin).availablePlaces).toBe(0)
  })

  test('canFill is false when no day is requested', () => {
    const empty = { ...trip, days: [] }
    expect(planCapacity(empty).canFill).toBe(false)
    expect(planCapacity(empty).requiredPlaces).toBe(0)
  })

  test('canFill is false when the group skips or leaves everything unvoted', () => {
    expect(planCapacity({ ...trip, votes: allVotes(trip, 'skip') }).canFill).toBe(false)
    expect(planCapacity({ ...trip, votes: {} }).canFill).toBe(false)
  })

  test('canFill is true when every slot is filled with a distinct known venue', () => {
    expect(planCapacity({ ...trip, votes: allVotes(trip, 'yes') }).canFill).toBe(true)
  })

  test('canFill is true for a shortfall filled from another cluster', () => {
    const baseDay = trip.days[0]
    if (!baseDay) throw new Error('fixture has no day')
    const asakusaA = trip.options.nakamise
    const asakusaB = trip.options.kappabashi
    const shibuya = trip.options['shibuya-crossing']
    if (!asakusaA || !asakusaB || !shibuya) throw new Error('fixture missing places')
    const chosen = [asakusaA.id, asakusaB.id, shibuya.id]
    const day: Day = { ...baseDay, weekday: 'Saturday', title: 'Test' }
    const mixed: Trip = {
      ...trip,
      nights: 0,
      days: [day],
      legs: [{ city: 'Tokyo', startDay: 1, endDay: 1, transferMin: 0 }],
      votes: dayVotes(trip, chosen)
    }
    const capacity = planCapacity(mixed)
    const scheduled = scheduleTrip(mixed)
    const placeIds = scheduled[0]?.slots.map((s) => s.placeId).filter((id): id is string => id !== null) ?? []
    expect(capacity.requiredPlaces).toBe(3)
    expect(placeIds).toHaveLength(3)
    expect(new Set(placeIds).size).toBe(3)
    expect(capacity.canFill).toBe(true)
  })

  test('a pinned closed venue stays pinned and does not make canFill false', () => {
    const baseDay = trip.days[0]
    if (!baseDay) throw new Error('fixture has no day')
    const closed = 'tokyo-national-museum'
    const day: Day = {
      ...baseDay,
      weekday: 'Monday',
      slots: baseDay.slots.map((s, i) => (i === 1 ? { ...s, placeId: closed, pinned: true } : s))
    }
    const pinned: Trip = {
      ...trip,
      nights: 0,
      days: [day],
      legs: [{ city: 'Tokyo', startDay: 1, endDay: 1, transferMin: 0 }],
      votes: allVotes(trip, 'yes')
    }
    const capacity = planCapacity(pinned)
    const scheduled = scheduleTrip(pinned)
    const result = scheduled[0] ? evaluateDay(scheduled[0], pinned.options) : null
    expect(scheduled[0]?.slots[1]?.placeId).toBe(closed)
    expect(scheduled[0]?.slots[1]?.pinned).toBe(true)
    expect(result?.status).toBe('red')
    expect(result?.reason).toBe('closed')
    expect(capacity.canFill).toBe(true)
  })

  test('unknown and duplicate pinned slots cannot yield canFill true and the pins are preserved', () => {
    const baseDay = trip.days[0]
    if (!baseDay) throw new Error('fixture has no day')
    const closed = 'tokyo-national-museum'
    const day: Day = {
      ...baseDay,
      weekday: 'Monday',
      slots: baseDay.slots.map((s, i) =>
        i === 0
          ? { ...s, placeId: 'not-a-place', pinned: true }
          : i === 1 || i === 2
            ? { ...s, placeId: closed, pinned: true }
            : s
      )
    }
    const pinned: Trip = {
      ...trip,
      nights: 0,
      days: [day],
      legs: [{ city: 'Tokyo', startDay: 1, endDay: 1, transferMin: 0 }],
      votes: allVotes(trip, 'yes')
    }
    const capacity = planCapacity(pinned)
    const scheduled = scheduleTrip(pinned)
    expect(capacity.canFill).toBe(false)
    expect(scheduled[0]?.slots[0]?.placeId).toBe('not-a-place')
    expect(scheduled[0]?.slots[0]?.pinned).toBe(true)
    expect(scheduled[0]?.slots[1]?.placeId).toBe(closed)
    expect(scheduled[0]?.slots[1]?.pinned).toBe(true)
  })

  test('an unknown pinned slot makes canFill false while other valid pins are preserved and counted', () => {
    const baseDay = trip.days[0]
    if (!baseDay) throw new Error('fixture has no day')
    const day: Day = {
      ...baseDay,
      weekday: 'Saturday',
      slots: baseDay.slots.map((s, i) =>
        i === 0
          ? { ...s, placeId: 'not-a-place', pinned: true }
          : i === 1
            ? { ...s, placeId: 'sensoji', pinned: true }
            : i === 2
              ? { ...s, placeId: 'nakamise', pinned: true }
              : s
      )
    }
    const pinned: Trip = {
      ...trip,
      nights: 0,
      days: [day],
      legs: [{ city: 'Tokyo', startDay: 1, endDay: 1, transferMin: 0 }],
      votes: allVotes(trip, 'skip')
    }
    const before = JSON.stringify(pinned)
    const capacity = planCapacity(pinned)
    expect(capacity.canFill).toBe(false)
    expect(capacity.availablePlaces).toBe(2)
    expect(JSON.stringify(pinned)).toBe(before)
  })

  test('duplicate valid pinned slots make canFill false and are counted once', () => {
    const baseDay = trip.days[0]
    if (!baseDay) throw new Error('fixture has no day')
    const day: Day = {
      ...baseDay,
      weekday: 'Saturday',
      slots: baseDay.slots.map((s) => ({ ...s, placeId: 'sensoji', pinned: true }))
    }
    const pinned: Trip = {
      ...trip,
      nights: 0,
      days: [day],
      legs: [{ city: 'Tokyo', startDay: 1, endDay: 1, transferMin: 0 }],
      votes: allVotes(trip, 'skip')
    }
    const before = JSON.stringify(pinned)
    const capacity = planCapacity(pinned)
    const scheduled = scheduleTrip(pinned)
    expect(capacity.canFill).toBe(false)
    expect(capacity.availablePlaces).toBe(1)
    expect(scheduled[0]?.slots.every((s) => s.placeId === 'sensoji' && s.pinned)).toBe(true)
    expect(JSON.stringify(pinned)).toBe(before)
  })

  test('inherited property names as pinned placeIds are rejected and not counted', () => {
    const baseDay = trip.days[0]
    if (!baseDay) throw new Error('fixture has no day')
    const day: Day = {
      ...baseDay,
      weekday: 'Saturday',
      slots: baseDay.slots.map((s, i) =>
        i === 0
          ? { ...s, placeId: 'toString', pinned: true }
          : i === 1
            ? { ...s, placeId: '__proto__', pinned: true }
            : { ...s, placeId: 'sensoji', pinned: true }
      )
    }
    const pinned: Trip = {
      ...trip,
      nights: 0,
      days: [day],
      legs: [{ city: 'Tokyo', startDay: 1, endDay: 1, transferMin: 0 }],
      votes: allVotes(trip, 'skip')
    }
    const before = JSON.stringify(pinned)
    const capacity = planCapacity(pinned)
    expect(capacity.canFill).toBe(false)
    expect(capacity.availablePlaces).toBe(1)
    expect(JSON.stringify(pinned)).toBe(before)
  })
})
