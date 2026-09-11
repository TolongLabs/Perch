import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { trip } from './data/trip'
import type { Answer, Day, Trip } from './data/types'
import { maxTripDays } from './lib/planCapacity'
import { evaluateDay } from './lib/schedule'
import { load, reset, save } from './lib/store'
import {
  MAX_PARTY,
  renamed,
  SLOTS_PER_PERIOD,
  withDates,
  withDayStart,
  withMember,
  withOptimizedPlan,
  withoutMember,
  withoutSlot,
  withSlot
} from './state'

let originalDescriptor: PropertyDescriptor | undefined

const allYes = (trip: Trip): Trip['votes'] => {
  const votes: Record<string, Record<string, Answer>> = {}
  for (const member of trip.party) {
    const memberVotes: Record<string, Answer> = {}
    for (const placeId of Object.keys(trip.options)) memberVotes[placeId] = 'yes'
    votes[member.id] = memberVotes
  }
  return votes
}

const noVotes = (trip: Trip): Trip['votes'] => {
  const votes: Record<string, Record<string, Answer>> = {}
  for (const member of trip.party) votes[member.id] = {}
  return votes
}

beforeEach(() => {
  originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const store: Record<string, string> = {}
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      }
    },
    configurable: true,
    writable: true
  })
})

afterEach(() => {
  reset()
  if (originalDescriptor) {
    Object.defineProperty(globalThis, 'localStorage', originalDescriptor)
  } else {
    delete (globalThis as unknown as { localStorage?: unknown }).localStorage
  }
})

const day = () => {
  const d = trip.days[0]
  if (!d) throw new Error('fixture has no day')
  return { ...d, slots: d.slots.map((s) => ({ ...s })) }
}

describe('a period holds up to two slots', () => {
  test('the second slot sits right after the first of its period', () => {
    const d = withSlot(day(), 'afternoon')
    expect(d.slots.map((s) => s.period)).toEqual(['morning', 'afternoon', 'afternoon', 'evening'])
    expect(d.slots[2]?.id).toBe('d1-afternoon-2')
  })

  test('a third slot in a period is refused and six is the ceiling', () => {
    let d = day()
    for (const p of ['morning', 'afternoon', 'evening'] as const) {
      d = withSlot(withSlot(withSlot(d, p), p), p)
    }
    expect(d.slots).toHaveLength(3 * SLOTS_PER_PERIOD)
  })

  test('only an empty second slot can go; the first of a period never does', () => {
    const d = withSlot(day(), 'morning')
    const first = d.slots[0]?.id ?? ''
    const second = d.slots[1]?.id ?? ''
    expect(withoutSlot(d, first).slots).toHaveLength(4)
    expect(
      withoutSlot({ ...d, slots: d.slots.map((s) => (s.id === second ? { ...s, placeId: 'sensoji' } : s)) }, second)
        .slots
    ).toHaveLength(4)
    expect(withoutSlot(d, second).slots).toHaveLength(3)
  })
})

describe('the party', () => {
  test('a new member gets a fresh id and no votes, and the party stops at six', () => {
    let t = withMember(trip, 'Nadia')
    expect(t.party.map((p) => p.id)).toContain('nadia')
    expect(t.votes.nadia).toBeUndefined()
    t = withMember(t, 'Hana')
    expect(t.party.map((p) => p.id)).toContain('hana-2')
    t = withMember(t, 'One more')
    expect(t.party).toHaveLength(MAX_PARTY)
    expect(withMember(t, 'Seven').party).toHaveLength(MAX_PARTY)
  })

  test('removing a member drops their votes; the owner cannot go', () => {
    const t = withoutMember(trip, 'hana')
    expect(t.party.some((p) => p.id === 'hana')).toBe(false)
    expect(t.votes.hana).toBeUndefined()
    expect(withoutMember(trip, trip.ownerId).party).toHaveLength(trip.party.length)
  })

  test('renaming keeps the id, so the votes stay', () => {
    const t = renamed(trip, 'hana', 'Hanabi')
    expect(t.party.find((p) => p.id === 'hana')?.name).toBe('Hanabi')
    expect(t.votes.hana).toBe(trip.votes.hana)
  })
})

describe('dates', () => {
  test('withDates is a no-op when nothing changes', () => {
    expect(withDates(trip, trip.startDate, trip.nights)).toBe(trip)
  })

  test('withDates rejects non-roundtrip, invalid or over-long requests', () => {
    const maxDays = maxTripDays(trip)
    expect(withDates(trip, '2026-11-31', 3)).toBe(trip)
    expect(withDates(trip, '2026-12-01', -1)).toBe(trip)
    expect(withDates(trip, '2026-12-01', 1.5)).toBe(trip)
    expect(withDates(trip, '2026-12-01', maxDays)).toBe(trip)
  })

  test('withDates uses UTC so month rollover and weekday are exact', () => {
    const moved = withDates(trip, '2026-11-30', 1)
    expect(moved.days[0]?.date).toBe('2026-11-30')
    expect(moved.days[1]?.date).toBe('2026-12-01')
    expect(moved.days[0]?.weekday).toBe('Monday')
    expect(moved.days[1]?.weekday).toBe('Tuesday')
  })

  test('withDates rejects an invalid leap day and accepts a real one', () => {
    expect(withDates(trip, '2025-02-29', 1)).toBe(trip)
    const leap = withDates(trip, '2024-02-29', 1)
    expect(leap.days[0]?.date).toBe('2024-02-29')
    expect(leap.days[1]?.date).toBe('2024-03-01')
  })

  test('withDates regenerates days up to the content ceiling and clears pins', () => {
    const pinned = { ...trip, pins: [{ placeId: 'sensoji', dayIndex: 1, slotIndex: 0 }] }
    const maxNights = maxTripDays(trip) - 1
    const moved = withDates(pinned, '2026-12-01', maxNights)
    expect(moved.startDate).toBe('2026-12-01')
    expect(moved.nights).toBe(maxNights)
    expect(moved.pins).toHaveLength(0)
    expect(moved.legs[0]?.endDay).toBe(maxNights + 1)
    expect(moved.days[0]?.date).toBe('2026-12-01')
    expect(moved.days.every((d) => d.startMin === 540)).toBe(true)
  })
})

describe('day start time', () => {
  test('withDayStart updates a valid day and start time', () => {
    const t = withDayStart(trip, 1, 480)
    expect(t).not.toBe(trip)
    expect(t.days[0]?.startMin).toBe(480)
  })

  test('withDayStart accepts the boundary values and rejects outside them', () => {
    // 300 and 600 are the floor and ceiling (5:00 and 10:00); the guard uses >= MIN and <= MAX.
    expect(withDayStart(trip, 1, 300)).not.toBe(trip)
    expect(withDayStart(trip, 1, 600)).not.toBe(trip)
    // 299 is one step below; 601 is one step above.
    expect(withDayStart(trip, 1, 299)).toBe(trip)
    expect(withDayStart(trip, 1, 601)).toBe(trip)
  })

  test('withDayStart is a no-op for an invalid day or time', () => {
    expect(withDayStart(trip, 0, 480)).toBe(trip)
    expect(withDayStart(trip, 99, 480)).toBe(trip)
    expect(withDayStart(trip, 1, -1)).toBe(trip)
    expect(withDayStart(trip, 1, 1440)).toBe(trip)
    expect(withDayStart(trip, 1, 480.5)).toBe(trip)
  })

  test('withDayStart is a no-op for the same start time', () => {
    expect(withDayStart(trip, 1, 540)).toBe(trip)
  })

  test('withDayStart recomputes feasibility for the target day', () => {
    const placed = {
      ...trip,
      days: trip.days.map((d) =>
        d.index === 1 ? { ...d, slots: d.slots.map((s, i) => (i === 0 ? { ...s, placeId: 'sensoji' } : s)) } : d
      )
    }
    const place = placed.options.sensoji
    if (!place) throw new Error('fixture missing sensoji')
    const [h = '0', m = '0'] = place.opens.split(':')
    const openMin = Number(h) * 60 + Number(m)
    const dwell = place.dwellMin
    const atEight = withDayStart(placed, 1, 480)
    const atTen = withDayStart(placed, 1, 600)
    expect(atEight.days[0]?.feasibility?.endMin).toBe(Math.max(480, openMin) + dwell)
    expect(atTen.days[0]?.feasibility?.endMin).toBe(Math.max(600, openMin) + dwell)
  })

  test('withDayStart preserves other days and all trip data', () => {
    const t = withDayStart(trip, 1, 480)
    expect(t.days[1]).toBe(trip.days[1])
    expect(t.votes).toBe(trip.votes)
    expect(t.manualNotes).toBe(trip.manualNotes)
  })
})

describe('plan optimization guard', () => {
  test('withOptimizedPlan refuses to replace assignments when the plan cannot fill', () => {
    if (!trip.days[0]) throw new Error('fixture has no day')
    const assigned: Trip = {
      ...trip,
      votes: noVotes(trip),
      days: trip.days.map((d) => ({
        ...d,
        slots: d.slots.map((s) => ({ ...s, placeId: 'sensoji' }))
      }))
    }
    const out = withOptimizedPlan(assigned)
    expect(out).toBe(assigned)
    expect(out.days[0]?.slots.map((s) => s.placeId)).toEqual(assigned.days[0]?.slots.map((s) => s.placeId))
  })

  test('withOptimizedPlan fills the calendar when the plan can fill', () => {
    const full = { ...trip, votes: allYes(trip) }
    const out = withOptimizedPlan(full)
    expect(out).not.toBe(full)
    const placed = out.days.flatMap((d) => d.slots.map((s) => s.placeId))
    expect(placed.length).toBe(12)
    expect(placed.every((id) => id !== null)).toBe(true)
    expect(new Set(placed).size).toBe(12)
  })
})

describe('store migration', () => {
  test('load preserves budget, votes, manual notes and valid day starts, and defaults invalid or missing starts to 540 with feasibility', () => {
    const oldDays: Trip['days'] = trip.days.map((d, i) => {
      const slots = d.slots.map((s, j) => (j === 0 ? { ...s, placeId: 'sensoji' } : s))
      const startMin = i === 0 ? 480 : i === 1 ? undefined : 2000
      const withStart = { ...d, startMin, slots, feasibility: null as Day['feasibility'] }
      if (startMin === 480) {
        withStart.feasibility = evaluateDay({ ...d, startMin: 480, slots }, trip.options)
      }
      return withStart as unknown as Day
    })
    const old = {
      ...trip,
      budgetRM: 777,
      days: oldDays,
      manualNotes: {
        takeCare: [{ id: 'n1', text: 'A' }],
        packing: [{ id: 'n2', text: 'B' }]
      }
    } as unknown as Trip
    save(old)
    const loaded = load()
    expect(loaded.budgetRM).toBe(777)
    expect(loaded.votes).toEqual(trip.votes)
    expect(loaded.manualNotes).toEqual({
      takeCare: [{ id: 'n1', title: 'Trip Note', text: 'A' }],
      packing: [{ id: 'n2', title: 'Trip Note', text: 'B' }]
    })
    expect(loaded.days[0]?.startMin).toBe(480)
    expect(loaded.days[0]?.feasibility).toEqual(oldDays[0]?.feasibility)
    for (let i = 1; i < loaded.days.length; i += 1) {
      expect(loaded.days[i]?.startMin).toBe(540)
      expect(loaded.days[i]?.feasibility).not.toBeNull()
    }
  })

  test('load migrates legacy 0 and 1439 start times to DAY_START while preserving votes and notes', () => {
    const oldDays: Trip['days'] = trip.days.map((d, i) => {
      const startMin = i === 0 ? 0 : i === 1 ? 1439 : undefined
      const slots = d.slots.map((s, j) => (j === 0 ? { ...s, placeId: 'sensoji' } : s))
      const withStart = { ...d, startMin: startMin as number, slots, feasibility: null as Day['feasibility'] }
      return withStart as unknown as Day
    })
    const old = {
      ...trip,
      days: oldDays,
      manualNotes: { takeCare: [{ id: 'n1', text: 'X' }], packing: [] }
    } as unknown as Trip
    save(old)
    const loaded = load()
    // Votes and notes survive the migration.
    expect(loaded.votes).toEqual(trip.votes)
    expect(loaded.manualNotes).toEqual({ takeCare: [{ id: 'n1', title: 'Trip Note', text: 'X' }], packing: [] })
    // Both legacy extremes migrate to DAY_START (540) with feasibility recomputed.
    expect(loaded.days[0]?.startMin).toBe(540)
    expect(loaded.days[0]?.feasibility).not.toBeNull()
    expect(loaded.days[1]?.startMin).toBe(540)
    expect(loaded.days[1]?.feasibility).not.toBeNull()
    // Undefined stays 540.
    expect(loaded.days[2]?.startMin).toBe(540)
  })
})
