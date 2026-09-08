import { describe, expect, test } from 'bun:test'
import { trip } from './data/trip'
import { SLOTS_PER_PERIOD, withoutSlot, withSlot } from './state'

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
