import { describe, expect, test } from 'bun:test'
import { trip } from './data/trip'
import { MAX_PARTY, renamed, SLOTS_PER_PERIOD, withMember, withoutMember, withoutSlot, withSlot } from './state'

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
