import { describe, expect, test } from 'bun:test'
import { places } from '../data/places'
import { travelMatrix } from '../data/travel'
import { trip } from '../data/trip'
import type { Day } from '../data/types'
import { evaluateDay, scheduleTrip } from './schedule'

const ids = places.map((p) => p.id)

const dayWith = (stops: (string | null)[], weekday = 'Saturday'): Day => {
  const base = trip.days[0]
  if (!base) throw new Error('fixture has no day')
  return {
    ...base,
    weekday,
    slots: base.slots.map((s, i) => ({ ...s, placeId: stops[i] ?? null }))
  }
}

describe('the travel matrix', () => {
  test('is 24 by 24 over the fixture ids, symmetric, zero diagonal, positive elsewhere', () => {
    expect(Object.keys(travelMatrix)).toEqual(ids)
    for (const a of ids) {
      const row = travelMatrix[a]
      expect(Object.keys(row ?? {})).toEqual(ids)
      for (const b of ids) {
        const v = row?.[b]
        expect(v).toBe(travelMatrix[b]?.[a])
        if (a === b) expect(v).toBe(0)
        else expect(v).toBeGreaterThan(0)
      }
    }
  })
})

describe('scheduleTrip', () => {
  test('is deterministic and does not mutate its input', () => {
    const before = JSON.stringify(trip)
    const a = scheduleTrip(trip)
    const b = scheduleTrip(trip)
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
    expect(JSON.stringify(trip)).toBe(before)
  })

  test('fills every slot from the voted-in pool with no duplicates', () => {
    const placed = scheduleTrip(trip).flatMap((d) => d.slots.map((s) => s.placeId))
    expect(placed.every((id) => id !== null)).toBe(true)
    expect(new Set(placed).size).toBe(placed.length)
  })

  test('never moves a pinned card, with a pin on each of the four days', () => {
    const pins = ['ameyoko', 'shibuya-crossing', 'tokyo-station-marunouchi', 'odaiba-beach']
    const days = trip.days.map((d, i) => ({
      ...d,
      slots: d.slots.map((s, j) => (j === 2 ? { ...s, placeId: pins[i] ?? null, pinned: true } : s))
    }))
    const out = scheduleTrip({ ...trip, days })
    out.forEach((d, i) => {
      expect(d.slots[2]?.placeId).toBe(pins[i] ?? null)
      expect(d.slots[2]?.pinned).toBe(true)
    })
  })

  test('seats the highest ranked cards of a cluster before any weaker one', () => {
    const owner = trip.ownerId
    const mine = { ...trip.votes[owner] }
    for (const id of ['nakamise', 'kappabashi', 'tokyo-national-museum']) mine[id] = 'yes'
    const scheduled = scheduleTrip({ ...trip, votes: { ...trip.votes, [owner]: mine } })
    const asakusa = scheduled.find((d) => d.title === 'Asakusa And Ueno')
    expect(asakusa?.slots.map((s) => s.placeId)).toContain('sensoji')
  })

  test('keeps each day inside one cluster', () => {
    for (const day of scheduleTrip(trip)) {
      const clusters = new Set(day.slots.map((s) => (s.placeId ? trip.options[s.placeId]?.cluster : null)))
      expect(clusters.size).toBe(1)
    }
  })
})

describe('evaluateDay', () => {
  test('an empty day is null', () => {
    expect(evaluateDay(dayWith([null, null, null]), trip.options)).toBeNull()
  })

  test('a day inside hours that ends before 21:00 is green', () => {
    const result = evaluateDay(dayWith(['sensoji', 'nakamise', 'ameyoko']), trip.options)
    expect(result?.status).toBe('green')
    expect(result?.transitMin).toBeGreaterThan(0)
    expect(result?.dwellMin).toBe(60 + 45 + 60)
    expect(result?.daySpanMin).toBeGreaterThan(0)
    expect(result?.rationale.length).toBeGreaterThan(0)
  })

  test('a stop closed on that weekday is red and named', () => {
    const result = evaluateDay(dayWith(['ueno-park', 'tokyo-national-museum', 'ameyoko'], 'Monday'), trip.options)
    expect(result?.status).toBe('red')
    expect(result?.stopsOutsideHours).toEqual(['tokyo-national-museum'])
    expect(result?.rationale).toBe('Tokyo National Museum is closed on Mondays.')
  })

  test('the closed-day sentence names the weekday, not a generic hours line', () => {
    const result = evaluateDay(
      dayWith(['ueno-park', 'imperial-palace-east-gardens', 'teamlab-planets'], 'Friday'),
      trip.options
    )
    expect(result?.status).toBe('red')
    expect(result?.rationale).toContain('Imperial Palace East Gardens is closed on Fridays')
  })

  test('a stop reached after it closes is red', () => {
    const result = evaluateDay(dayWith(['omoide-yokocho', 'tsukiji-outer-market', 'meiji-jingu']), trip.options)
    expect(result?.status).toBe('red')
    expect(result?.stopsOutsideHours).toContain('tsukiji-outer-market')
    expect(result?.rationale).toMatch(/Tsukiji Outer Market would be reached at \d+:\d\d, after it closes at 14:00/)
  })

  test('an order far slower than the heuristic order is gold', () => {
    const result = evaluateDay(dayWith(['ueno-park', 'sensoji', 'tokyo-national-museum']), trip.options)
    expect(result?.status).toBe('gold')
  })

  test('a day that overruns 21:00 is red', () => {
    const late = { ...trip.options, 'teamlab-planets': { ...trip.options['teamlab-planets'], dwellMin: 600 } }
    const result = evaluateDay(
      dayWith(['toyosu-market', 'teamlab-planets', 'odaiba-beach']),
      late as typeof trip.options
    )
    expect(result?.status).toBe('red')
    expect(result?.rationale).toContain('past 21:00')
  })
})
