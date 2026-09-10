import { trip as seed } from '../data/trip'
import type { ManualNote, ManualSection, Trip } from '../data/types'
import { evaluateDay } from './schedule'

const KEY = 'perch.trip.v1'

/**
 * Storage is a boundary, so what comes back over it is validated rather than cast. A stored trip from an older shape
 * fails this and the seed is used, which is the same path as a first visit.
 */

const isManualNote = (value: unknown): value is ManualNote => {
  if (typeof value !== 'object' || value === null) return false
  const n = value as Partial<ManualNote>
  return typeof n.id === 'string' && typeof n.text === 'string'
}

const isManualNotes = (value: unknown): value is Record<ManualSection, ManualNote[]> => {
  if (typeof value !== 'object' || value === null) return false
  const m = value as Partial<Record<ManualSection, ManualNote[]>>
  return (
    Array.isArray(m.takeCare) &&
    Array.isArray(m.packing) &&
    m.takeCare.every(isManualNote) &&
    m.packing.every(isManualNote)
  )
}

const isTrip = (value: unknown): value is Trip => {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Partial<Trip>
  return (
    typeof t.id === 'string' &&
    typeof t.ownerId === 'string' &&
    Array.isArray(t.days) &&
    Array.isArray(t.party) &&
    Array.isArray(t.legs) &&
    Array.isArray(t.pins) &&
    Array.isArray(t.checklist) &&
    typeof t.votes === 'object' &&
    t.votes !== null &&
    typeof t.options === 'object' &&
    t.options !== null &&
    (t.votingClosedAt === undefined || t.votingClosedAt === null || typeof t.votingClosedAt === 'string') &&
    t.days.every((d) => Array.isArray(d?.slots) && d.slots.every((s) => typeof s?.pinned === 'boolean'))
  )
}

/** A cold load with nothing stored is the normal case, not an error: the fixture renders as authored. */
export const load = (): Trip => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed
    const parsed: unknown = JSON.parse(raw)
    if (!isTrip(parsed) || parsed.id !== seed.id) return seed
    // A trip stored before the member switcher existed has no current member; it was always the owner.
    // A trip stored before voting closure tracking has no votingClosedAt; default it to open.
    // Old stored days may be missing startMin or have an invalid one; migrate to 09:00 and recompute feasibility.
    const days = parsed.days.map((day) => {
      const valid =
        typeof day.startMin === 'number' && Number.isInteger(day.startMin) && day.startMin >= 0 && day.startMin <= 1439
      const startMin = valid ? day.startMin : 540
      const withStart = { ...day, startMin }
      return {
        ...withStart,
        feasibility: valid ? (day.feasibility ?? null) : evaluateDay(withStart, parsed.options)
      }
    })
    return {
      ...parsed,
      currentMemberId: parsed.currentMemberId ?? parsed.ownerId,
      votingClosedAt: parsed.votingClosedAt ?? null,
      manualNotes: isManualNotes(parsed.manualNotes) ? parsed.manualNotes : { takeCare: [], packing: [] },
      days
    }
  } catch {
    return seed
  }
}

export const save = (trip: Trip): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(trip))
  } catch {
    /* A demo machine with storage disabled still runs; it just forgets between reloads. */
  }
}

export const reset = (): void => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* nothing to do */
  }
}
