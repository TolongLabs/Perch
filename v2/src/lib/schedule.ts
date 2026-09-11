import { routeMin, transitMin } from '../data/travel'
import type { ClusterId, Day, DayFeasibility, Period, Place, Trip } from '../data/types'
import { tallyFor, votedIn } from './votes'

export const DAY_START = 9 * 60
export const MIN_DAY_START = 5 * 60
export const MAX_DAY_START = 10 * 60
export const DAY_END = 21 * 60
export const GOLD_SLACK = 1.25

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

export const CLUSTER_LABEL: Record<ClusterId, string> = {
  'asakusa-ueno': 'Asakusa And Ueno',
  'shibuya-harajuku-shinjuku': 'Shibuya, Harajuku And Shinjuku',
  'tsukiji-ginza-station': 'Tsukiji, Ginza And The Station',
  'odaiba-toyosu-teamlab': 'Odaiba, Toyosu And teamLab'
}

/** The same areas for a specimen line under a place name, where metadata is sentence case. */
export const CLUSTER_AREA: Record<ClusterId, string> = {
  'asakusa-ueno': 'Asakusa and Ueno',
  'shibuya-harajuku-shinjuku': 'Shibuya, Harajuku and Shinjuku',
  'tsukiji-ginza-station': 'Tsukiji, Ginza and the Station',
  'odaiba-toyosu-teamlab': 'Odaiba, Toyosu and teamLab'
}

const CLUSTERS = Object.keys(CLUSTER_LABEL) as ClusterId[]

export const minutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':')
  return Number(h ?? 0) * 60 + Number(m ?? 0)
}

const openOn = (place: Place, day: Day): boolean => !place.closedOn.includes(day.weekday.toLowerCase())

/**
 * Nearest neighbour from a fixed start: the next stop is the closest unvisited one. A greedy walk, not a TSP solve,
 * and deterministic because ties fall to the earlier position in the input.
 */
const nearestOrder = (start: string, rest: string[]): string[] => {
  const out: string[] = []
  let at = start
  let pool = [...rest]
  while (pool.length > 0) {
    const next = pool.reduce((best, id) => (transitMin(at, id) < transitMin(at, best) ? id : best), pool[0] ?? '')
    out.push(next)
    pool = pool.filter((id) => id !== next)
    at = next
  }
  return out
}

/**
 * The scheduler's own order for a set of stops on a day, the one gold is measured against. Morning goes first,
 * seeded by best period and opening time, then nearest neighbour through the rest.
 */
export const scheduleOrder = (stops: Place[]): string[] => {
  if (stops.length === 0) return []
  const rank = (p: Place): number => Math.min(...p.bestPeriod.map((period) => PERIODS.indexOf(period)))
  const first = [...stops].sort((a, b) => rank(a) - rank(b) || minutes(a.opens) - minutes(b.opens))[0]
  if (!first) return []
  return [
    first.id,
    ...nearestOrder(
      first.id,
      stops.filter((p) => p.id !== first.id).map((p) => p.id)
    )
  ]
}

/**
 * Walk the day from its start time, defaulting to 09:00. A stop that opens later is waited for; a stop reached after
 * it closes, or that closes before its dwell is done, is outside its hours. The rationale is one sentence, in sentence
 * case, and never the decision path itself.
 */
export const evaluateDay = (day: Day, options: Record<string, Place>): DayFeasibility | null => {
  const stops = day.slots.map((s) => (s.placeId ? options[s.placeId] : undefined)).filter((p): p is Place => !!p)
  if (stops.length === 0) return null

  const start = day.startMin ?? DAY_START
  let clock = start
  let transit = 0
  let dwell = 0
  const outside: string[] = []
  const reasons: string[] = []
  let reason: DayFeasibility['reason'] = null
  const hhmm = (m: number): string => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
  stops.forEach((place, i) => {
    const previous = stops[i - 1]
    const travel = previous ? transitMin(previous.id, place.id) : 0
    transit += travel
    const arrive = Math.max(clock + travel, minutes(place.opens))
    const leave = arrive + place.dwellMin
    if (!openOn(place, day)) {
      outside.push(place.id)
      reason ??= 'closed'
      reasons.push(`${place.name} is closed on ${day.weekday}s`)
    } else if (arrive >= minutes(place.closes)) {
      outside.push(place.id)
      reason ??= 'hours'
      reasons.push(`${place.name} would be reached at ${hhmm(arrive)}, after it closes at ${place.closes}`)
    } else if (leave > minutes(place.closes)) {
      outside.push(place.id)
      reason ??= 'hours'
      reasons.push(`${place.name} closes at ${place.closes}, before its ${place.dwellMin} minutes are done`)
    }
    dwell += place.dwellMin
    clock = leave
  })
  const daySpanMin = clock - start
  const overrun = clock - DAY_END

  const base = { transitMin: transit, dwellMin: dwell, daySpanMin, endMin: clock, stopsOutsideHours: outside }
  if (outside.length > 0) {
    return { ...base, status: 'red', reason, rationale: `${reasons.join(', and ')}.` }
  }
  if (overrun > 0) {
    return { ...base, status: 'red', reason: 'overrun', rationale: `The day runs ${overrun} minutes past 21:00.` }
  }
  const own = routeMin(scheduleOrder(stops))
  if (own > 0 && transit > own * GOLD_SLACK) {
    return {
      ...base,
      status: 'gold',
      reason: null,
      rationale: `This order spends ${transit - own} more minutes in transit than the heuristic order.`
    }
  }
  return {
    ...base,
    status: 'green',
    reason: null,
    rationale: `Every stop fits its hours and the day ends by ${hhmm(clock)}.`
  }
}

/** How far a reserve may sit from the day it backs up, in transit minutes to its nearest stop. */
export const BACKUP_REACH_MIN = 30

/**
 * One reserve for a day: the highest-ranked voted-in place in the day's cluster that is on no day at all and
 * within reach of one of the day's stops. Null when the day has no stops, the cluster is exhausted, or nothing
 * unplaced is near enough; a far reserve is worse than none, because it would be a second plan, not a backup.
 */
export const backupFor = (day: Day, trip: Trip): Place | null => {
  const stops = day.slots.map((s) => (s.placeId ? trip.options[s.placeId] : undefined)).filter((p): p is Place => !!p)
  const first = stops[0]
  if (!first) return null
  const placed = new Set(trip.days.flatMap((d) => d.slots.map((s) => s.placeId)))
  return (
    votedIn(tallyFor(trip))
      .map((t) => trip.options[t.placeId])
      .filter((p): p is Place => !!p && p.cluster === first.cluster && !placed.has(p.id))
      .find((p) => stops.some((stop) => transitMin(stop.id, p.id) <= BACKUP_REACH_MIN)) ?? null
  )
}

export const withFeasibility = (days: Day[], options: Record<string, Place>): Day[] =>
  days.map((day) => ({ ...day, feasibility: evaluateDay(day, options) }))

/**
 * One pass over the whole trip. The pool is the voted-in list from the tally, in rank order. Each day takes the
 * cluster with the most pool cards open on that weekday, then fills its unpinned slots: morning first, each slot
 * preferring a card whose best period matches, then the nearest neighbour of the previous stop. Pinned cards never
 * move, and the days that hold them are scheduled around them. Pure: the input trip is never mutated.
 */
export const scheduleTrip = (trip: Trip): Day[] => {
  const pool = votedIn(tallyFor(trip))
    .map((t) => trip.options[t.placeId])
    .filter((p): p is Place => !!p)
  const pinned = new Set(trip.days.flatMap((d) => d.slots.filter((s) => s.pinned && s.placeId).map((s) => s.placeId)))
  let remaining = pool.filter((p) => !pinned.has(p.id))
  const taken = new Set<ClusterId>()

  const days = trip.days.map((day) => {
    const candidates = remaining.filter((p) => openOn(p, day))
    const cluster = CLUSTERS.filter(
      (c) => !taken.has(c) || CLUSTERS.every((k) => taken.has(k))
    ).reduce<ClusterId | null>((best, c) => {
      const count = (k: ClusterId) => candidates.filter((p) => p.cluster === k).length
      return best === null || count(c) > count(best) ? c : best
    }, null)
    if (cluster) taken.add(cluster)

    // The pool is in rank order, so the day keeps only as many cluster cards as it has open slots before ordering
    // them. Otherwise the period and geography picks below can seat three weaker cards and bench a unanimous one.
    // If the chosen cluster has fewer open cards than slots, the shortfall is filled with the highest-ranked remaining
    // openOn(day) candidates from other clusters before any route ordering.
    const open = day.slots.filter((s) => !(s.pinned && s.placeId)).length
    let local = candidates.filter((p) => p.cluster === cluster).slice(0, open)
    const shortfall = open - local.length
    if (shortfall > 0) {
      const outside = candidates
        .filter((p) => p.cluster !== cluster && !local.some((l) => l.id === p.id))
        .slice(0, shortfall)
      local = [...local, ...outside]
    }
    let previous: string | null = null
    const slots = day.slots.map((slot) => {
      if (slot.pinned && slot.placeId) {
        previous = slot.placeId
        return slot
      }
      const fitting = local.filter((p) => p.bestPeriod.includes(slot.period))
      const from = fitting.length > 0 ? fitting : local
      const pick = previous
        ? nearestOrder(
            previous,
            from.map((p) => p.id)
          )[0]
        : [...from].sort((a, b) => minutes(a.opens) - minutes(b.opens))[0]?.id
      if (!pick) return { ...slot, placeId: null, pinned: false }
      local = local.filter((p) => p.id !== pick)
      remaining = remaining.filter((p) => p.id !== pick)
      previous = pick
      return { ...slot, placeId: pick, pinned: false }
    })

    return { ...day, title: cluster ? CLUSTER_LABEL[cluster] : day.title, slots }
  })

  return withFeasibility(days, trip.options)
}
