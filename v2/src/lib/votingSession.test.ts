import { describe, expect, test } from 'bun:test'
import { trip } from '../data/trip'
import type { Trip } from '../data/types'
import { withMember, withoutMember } from '../state'
import { load } from './store'
import { hasFinished, tallyFor, votedIn } from './votes'
import { castVote, closeVoting, finalizeVotingIfDue, votingDeadline } from './votingSession'

const now = new Date('2026-09-10T00:00:00Z')
const placeId = Object.keys(trip.options)[0] ?? ''
const blank = (): Trip => ({ ...trip, votes: {}, votingClosedAt: null })
const asMember = (t: Trip, memberId: string): Trip => ({ ...t, currentMemberId: memberId })

describe('voting answers', () => {
  test('skip counts as answered, unlike null or missing', () => {
    let t = blank()
    expect(hasFinished(t, t.ownerId)).toBe(false)
    for (const id of Object.keys(t.options)) t = castVote(t, t.ownerId, id, 'skip', now)
    expect(hasFinished(t, t.ownerId)).toBe(true)
    expect(t.votes[t.ownerId]?.[placeId]).toBe('skip')
    expect(votedIn(tallyFor(t))).toEqual([])
    t = { ...t, votes: { ...t.votes, [t.ownerId]: { ...t.votes[t.ownerId], [placeId]: null } } }
    expect(hasFinished(t, t.ownerId)).toBe(false)
  })

  test('owner weight and inclusion do not depend on completed ballots', () => {
    let t = castVote(blank(), trip.ownerId, placeId, true, now)
    expect(tallyFor(t).find((e) => e.placeId === placeId)?.percentage).toBe(33)
    expect(votedIn(tallyFor(t))).toHaveLength(0)
    t = castVote(asMember(t, 'farah'), 'farah', placeId, 'must', now)
    expect(hasFinished(t, 'farah')).toBe(false)
    expect(votedIn(tallyFor(t))[0]).toMatchObject({ placeId, percentage: 56, mustBy: ['farah'] })
    t = castVote(asMember(t, 'hana'), 'hana', placeId, 'skip', now)
    expect(votedIn(tallyFor(t))[0]?.percentage).toBe(56)
  })

  test('a second must demotes the previous one without changing its support', () => {
    const second = Object.keys(trip.options)[1] ?? ''
    const first = castVote(blank(), trip.ownerId, placeId, 'must', now)
    const next = castVote(first, trip.ownerId, second, 'must', now)
    expect(next.votes[trip.ownerId]?.[placeId]).toBe('yes')
    expect(next.votes[trip.ownerId]?.[second]).toBe('must')
    expect(first.votes[trip.ownerId]?.[placeId]).toBe('must')
  })

  test('unknown IDs and another member cannot cast a vote', () => {
    const t = blank()
    expect(castVote(t, 'nobody', placeId, true, now)).toBe(t)
    expect(castVote(asMember(t, 'nobody'), 'nobody', placeId, true, now).votes).toBe(t.votes)
    expect(castVote(t, 'farah', placeId, true, now)).toBe(t)
    for (const id of ['nowhere', 'toString', '__proto__']) {
      expect(castVote(t, t.ownerId, id, true, now)).toBe(t)
    }
  })
})

describe('voting closure', () => {
  test('fills only unanswered cards and preserves the source', () => {
    const original = structuredClone(trip)
    const closed = closeVoting(trip, trip.ownerId, now)
    expect(closed.votingClosedAt).toBe(now.toISOString())
    for (const member of trip.party) {
      for (const id of Object.keys(trip.options)) {
        expect(closed.votes[member.id]?.[id]).toBe(trip.votes[member.id]?.[id] ?? 'skip')
      }
      expect(hasFinished(closed, member.id)).toBe(true)
    }
    expect(trip).toEqual(original)
    expect(closeVoting(closed, trip.ownerId, now)).toBe(closed)
    expect(castVote(closed, trip.ownerId, placeId, true, now)).toBe(closed)
    expect(withMember(closed, 'New Friend')).toBe(closed)
    expect(withoutMember(closed, 'farah')).toBe(closed)
    expect(finalizeVotingIfDue(closed, new Date('2027-01-01T00:00:00Z'))).toBe(closed)
  })

  test('only the current owner can close manually', () => {
    const friend = asMember(trip, 'farah')
    expect(closeVoting(friend, 'farah', now)).toBe(friend)
    expect(closeVoting(friend, trip.ownerId, now)).toBe(friend)
  })

  test('removing the current member restores the owner before closure', () => {
    expect(withoutMember(asMember(trip, 'farah'), 'farah').currentMemberId).toBe(trip.ownerId)
  })

  test('deadline is precisely previous-day midnight Tokyo regardless of machine timezone', () => {
    const deadline = new Date('2026-11-18T15:00:00Z')
    expect(votingDeadline(trip)?.toISOString()).toBe(deadline.toISOString())
    expect(finalizeVotingIfDue(trip, new Date(deadline.getTime() - 1))).toBe(trip)
    const closed = finalizeVotingIfDue(asMember(trip, 'farah'), deadline)
    expect(closed.votingClosedAt).toBe(deadline.toISOString())
    expect(closed.party.every((p) => hasFinished(closed, p.id))).toBe(true)
    const attempted = castVote(blank(), trip.ownerId, placeId, true, deadline)
    expect(attempted.votes[trip.ownerId]?.[placeId]).toBe('skip')
  })

  test('deadline handles calendar rollover and rejects invalid calendar dates', () => {
    expect(votingDeadline({ ...trip, startDate: '2027-01-01' })?.toISOString()).toBe('2026-12-30T15:00:00.000Z')
    expect(votingDeadline({ ...trip, startDate: '2028-03-01' })?.toISOString()).toBe('2028-02-28T15:00:00.000Z')
    for (const startDate of ['not-a-date', '2026-02-30', '2026-13-01']) {
      const t = { ...trip, startDate }
      expect(votingDeadline(t)).toBeNull()
      expect(finalizeVotingIfDue(t, new Date('2099-01-01T00:00:00Z'))).toBe(t)
    }
  })
})

test('old stored trips migrate open and closed trips stay closed on reload', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const old: Partial<Trip> = { ...trip, budgetRM: 777 }
  delete old.votingClosedAt
  let stored = JSON.stringify(old)
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: () => stored }
  })
  try {
    expect(load().votingClosedAt).toBeNull()
    expect(load().budgetRM).toBe(777)
    stored = JSON.stringify(closeVoting(trip, trip.ownerId, now))
    expect(load().votingClosedAt).toBe(now.toISOString())
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
