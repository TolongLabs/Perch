import type { ChangeEvent, Day, Option, Period, Slot, Trip } from '../data/types'

/** The window a slot occupies, so an option's opening hours can be checked against it rather than against the day. */
const WINDOW: Record<Period, [string, string]> = {
  morning: ['08:00', '12:00'],
  midday: ['12:00', '14:30'],
  afternoon: ['14:30', '18:00'],
  evening: ['18:00', '22:00']
}

/** How much further than the outgoing stop a replacement may sit before it breaks the day it was meant to save. */
const TRAVEL_SLACK_MIN = 25

const minutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':')
  return Number(h ?? 0) * 60 + Number(m ?? 0)
}

export const dayCostRM = (day: Day, options: Record<string, Option>): number =>
  day.slots.reduce((sum, slot) => {
    const chosen = slot.chosenId ? options[slot.chosenId] : undefined
    return sum + (chosen?.costRM ?? 0)
  }, 0)

export const tripCostRM = (trip: Trip): number => trip.days.reduce((sum, day) => sum + dayCostRM(day, trip.options), 0)

/**
 * Fit, then rank. An option that ranks first and is shut at the time it is needed is not a replacement, so every
 * filter here is a hard one and the ranking only breaks ties between survivors.
 */
export const fits = (option: Option, slot: Slot, day: Day, outgoing: Option | undefined): boolean => {
  if (slot.blockedIds.includes(option.id)) return false
  if (!option.bestPeriod.includes(slot.period)) return false
  if (option.closedOn.includes(day.weekday.toLowerCase())) return false

  const [start] = WINDOW[slot.period]
  const usable = minutes(option.closes) - minutes(start)
  if (minutes(option.opens) > minutes(start) || usable < 60) return false

  const ceiling = (outgoing?.travelMin ?? 0) + TRAVEL_SLACK_MIN
  return option.travelMin <= ceiling
}

/**
 * Why an option cannot take this slot, or null when it can. The drawer shows this rather than hiding the row: the
 * fit filter is the argument, so it has to be visible.
 */
export const whyNot = (option: Option, slot: Slot, day: Day, outgoing: Option | undefined): string | null => {
  if (slot.blockedIds.includes(option.id)) return slot.cause ?? 'Off the table'
  if (!option.bestPeriod.includes(slot.period)) return `Not a ${slot.period} thing`
  if (option.closedOn.includes(day.weekday.toLowerCase())) return `Shut on ${day.weekday}s`

  const [start] = WINDOW[slot.period]
  if (minutes(option.opens) > minutes(start)) return `Opens ${option.opens}`
  if (minutes(option.closes) - minutes(start) < 60) return `Closes ${option.closes}`

  const ceiling = (outgoing?.travelMin ?? 0) + TRAVEL_SLACK_MIN
  if (option.travelMin > ceiling) return `${option.travelMin - ceiling} min too far`
  return null
}

/** Two units, travel then money. Never one without the other. */
export const describeDelta = (deltaMin: number, deltaRM: number): string => {
  const travel = deltaMin === 0 ? 'same distance' : `${Math.abs(deltaMin)} min ${deltaMin < 0 ? 'closer' : 'further'}`
  const money = deltaRM === 0 ? 'same price' : `${deltaRM < 0 ? '−' : '+'}RM ${Math.abs(deltaRM)}`
  return `${travel} · ${money}`
}

const WORDS = ['', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const ordinal = (n: number): string => WORDS[n] ?? String(n)

/**
 * The one bench order. The drawer numbers its rows from this and `repair` picks from it, so the rank the sentence
 * states is always the rank a judge can count on screen.
 */
export const benchInRankOrder = (trip: Trip, slot: Slot): Option[] => {
  const at = (id: string): number => {
    const i = trip.ranking.indexOf(id)
    return i === -1 ? Number.MAX_SAFE_INTEGER : i
  }
  return slot.benchIds
    .map((id) => trip.options[id])
    .filter((o): o is Option => o !== undefined)
    .sort((a, b) => at(a.id) - at(b.id))
}

export type RepairResult =
  | { kind: 'swapped'; slot: Slot; change: ChangeEvent }
  | { kind: 'exhausted'; slot: Slot; reason: string }

/**
 * The mechanism. A slot repairs itself from the bench the same choosing already produced, so nobody is consulted:
 * survivors of the fit filter, in the group's own rank order, top one wins.
 */
export const repair = (trip: Trip, dayIndex: number, slotId: string, cause: string): RepairResult => {
  const day = trip.days.find((d) => d.index === dayIndex)
  if (!day) throw new Error(`no day ${dayIndex}`)

  const slot = day.slots.find((s) => s.id === slotId)
  if (!slot) throw new Error(`no slot ${slotId}`)

  const outgoing = slot.chosenId ? trip.options[slot.chosenId] : undefined

  // What the world took off the table stays off it, so firing the same disruption twice cannot swap the trip back.
  const withCause: Slot = {
    ...slot,
    blockedIds: outgoing ? [...slot.blockedIds, outgoing.id] : slot.blockedIds,
    cause
  }
  const bench = benchInRankOrder(trip, withCause)
  const survivors = bench.filter((o) => fits(o, withCause, day, outgoing))

  const winner = survivors[0]
  if (!winner) {
    return {
      kind: 'exhausted',
      slot: { ...withCause, chosenId: null, state: 'at-risk' },
      reason: `Nothing on the bench for this slot is open and close enough. ${day.title} needs a decision.`
    }
  }

  const deltaMin = winner.travelMin - (outgoing?.travelMin ?? 0)
  const deltaRM = winner.costRM - (outgoing?.costRM ?? 0)

  const repaired: Slot = {
    ...withCause,
    chosenId: winner.id,
    benchIds: [...bench.filter((o) => o.id !== winner.id).map((o) => o.id), ...(outgoing ? [outgoing.id] : [])],
    state: 'decided'
  }

  const after = { ...day, slots: day.slots.map((s) => (s.id === slot.id ? repaired : s)) }
  const total = dayCostRM(after, trip.options)
  const before = dayCostRM(day, trip.options)
  const rank = bench.findIndex((o) => o.id === winner.id) + 2

  const money = total === before ? `the day stays at RM ${total}` : `the day is RM ${total}`
  const sentence = outgoing
    ? `Swapped ${outgoing.name} for ${winner.name}. ${cause}, ${winner.name} was your number ${ordinal(rank)} for that slot, and ${money}.`
    : `Filled the gap with ${winner.name}. ${cause}, and ${money}.`

  return {
    kind: 'swapped',
    slot: repaired,
    change: {
      id: `${slot.id}-${trip.changes.length + 1}`,
      at: new Date().toISOString(),
      dayIndex,
      slotId: slot.id,
      cause,
      fromId: outgoing?.id ?? '',
      toId: winner.id,
      deltaMin,
      deltaRM,
      sentence
    }
  }
}
