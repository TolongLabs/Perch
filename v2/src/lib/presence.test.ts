import { describe, expect, test } from 'bun:test'
import { trip } from '../data/trip'
import { nameList, standingLine, standings } from './presence'

describe('standings', () => {
  test('reads the friends from their votes and leaves the owner out', () => {
    const rest = standings(trip)
    expect(rest.map((s) => s.member.id)).toEqual(['farah', 'hana', 'iman'])
    // Farah is two places short in the fixture; Hana and Iman have answered everything. The Tally reads the same
    // votes and says the same thing, which is the only reason this strip is allowed to say anything at all.
    expect(rest.map((s) => s.reel)).toEqual([23, null, null])
  })

  test('a member with places left is on the reel after the last one she answered', () => {
    const answers = trip.votes.farah ?? {}
    const half = Object.fromEntries(
      Object.keys(trip.options)
        .slice(0, 8)
        .map((id) => [id, answers[id] ?? 'yes'])
    )
    const partial = { ...trip, votes: { ...trip.votes, farah: half } }
    expect(standings(partial).find((s) => s.member.id === 'farah')?.reel).toBe(9)
  })
})

describe('standingLine', () => {
  test('names whoever the votes say is still going', () => {
    expect(standingLine(standings(trip))).toBe('Farah is on reel 23 · 2 of 3 finished')
  })

  test('says everyone is here when nobody has reels left, and never invents a reel', () => {
    const done = standings(trip).map((s) => ({ ...s, reel: null }))
    expect(standingLine(done)).toBe('Farah, Hana and Iman are here · all three finished')
  })

  test('names whoever is still going', () => {
    const line = standingLine([
      { member: { id: 'farah', name: 'Farah', initials: 'FA' }, reel: 9 },
      { member: { id: 'hana', name: 'Hana', initials: 'HA' }, reel: null },
      { member: { id: 'iman', name: 'Iman', initials: 'IM' }, reel: null }
    ])
    expect(line).toBe('Farah is on reel 9 · 2 of 3 finished')
  })
})

describe('nameList', () => {
  test('sets one, two and three names as a sentence', () => {
    expect(nameList(['Farah'])).toBe('Farah')
    expect(nameList(['Farah', 'Hana'])).toBe('Farah and Hana')
    expect(nameList(['Farah', 'Hana', 'Iman'])).toBe('Farah, Hana and Iman')
  })
})
