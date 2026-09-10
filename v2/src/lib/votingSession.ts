import type { Answer, Trip, Votes } from '../data/types'

/** Fill every missing (null or undefined) member/place answer with 'skip' without touching existing answers. */
const withSkipped = (trip: Trip): Votes => {
  const votes: Votes = { ...trip.votes }
  for (const member of trip.party) {
    const existing = votes[member.id]
    const memberVotes: Record<string, Answer> = existing ? { ...existing } : {}
    for (const placeId of Object.keys(trip.options)) {
      if (memberVotes[placeId] == null) memberVotes[placeId] = 'skip'
    }
    votes[member.id] = memberVotes
  }
  return votes
}

const isValidDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

/**
 * Prototype deadline: voting closes automatically at midnight Asia/Tokyo one calendar day before startDate.
 * The prototype only has Tokyo content, so the offset is hard-coded to +09:00.
 */
export const votingDeadline = (trip: Trip): Date | null => {
  if (!isValidDate(trip.startDate)) return null
  const deadline = new Date(`${trip.startDate}T00:00:00+09:00`)
  if (Number.isNaN(deadline.getTime())) return null
  deadline.setUTCDate(deadline.getUTCDate() - 1)
  return deadline
}

export const finalizeVotingIfDue = (trip: Trip, now: Date = new Date()): Trip => {
  if (trip.votingClosedAt !== null) return trip
  const deadline = votingDeadline(trip)
  if (deadline === null || now.getTime() < deadline.getTime()) return trip
  return { ...trip, votes: withSkipped(trip), votingClosedAt: now.toISOString() }
}

export const closeVoting = (trip: Trip, actorId: string, now: Date = new Date()): Trip => {
  if (trip.votingClosedAt !== null) return trip
  if (actorId !== trip.ownerId) return trip
  if (actorId !== trip.currentMemberId) return trip
  return { ...trip, votes: withSkipped(trip), votingClosedAt: now.toISOString() }
}

const toAnswer = (answer: boolean | 'must' | 'skip'): Answer => {
  if (answer === true) return 'yes'
  if (answer === false) return 'no'
  return answer
}

export const castVote = (
  trip: Trip,
  memberId: string,
  placeId: string,
  answer: boolean | 'must' | 'skip',
  now: Date = new Date()
): Trip => {
  if (memberId !== trip.currentMemberId) return trip
  if (!trip.party.some((p) => p.id === memberId)) return trip
  if (!Object.hasOwn(trip.options, placeId)) return trip
  const finalized = finalizeVotingIfDue(trip, now)
  if (finalized.votingClosedAt !== null) return finalized
  const existing = finalized.votes[memberId]
  const prior: Record<string, Answer> = existing ? { ...existing } : {}
  if (answer === 'must') {
    for (const id of Object.keys(prior)) {
      if (prior[id] === 'must') prior[id] = 'yes'
    }
  }
  prior[placeId] = toAnswer(answer)
  return { ...finalized, votes: { ...finalized.votes, [memberId]: prior } }
}
