export type Period = 'morning' | 'afternoon' | 'evening'

export type OptionKind =
  | 'temple'
  | 'shrine'
  | 'market'
  | 'food'
  | 'museum'
  | 'park'
  | 'viewpoint'
  | 'mall'
  | 'entertainment'
  | 'street'

export type ClusterId = 'asakusa-ueno' | 'shibuya-harajuku-shinjuku' | 'tsukiji-ginza-station' | 'odaiba-toyosu-teamlab'

export type Reel = {
  src: string
  /** The same clip as VP9, for a browser with no H.264 decoder; Firefox on Linux without system codecs is one. */
  webm: string
  poster: string
  platform: 'instagram' | 'xhs'
  creditHandle: string
  sourceUrl: string
}

export type Place = {
  id: string
  name: string
  kind: OptionKind
  cluster: ClusterId
  lat: number
  lng: number
  yen: number
  costRM: number
  /** How long a visitor actually spends there, not the minimum possible. */
  dwellMin: number
  opens: string
  closes: string
  /** Lowercase weekday names, compared against Day.weekday.toLowerCase(). */
  closedOn: string[]
  bestPeriod: Period[]
  tags: string[]
  blurb: string
  reel: Reel
}

export type Slot = {
  id: string
  period: Period
  /** The place occupying the slot, null while the calendar is empty. */
  placeId: string | null
  pinned: boolean
}

export type DayFeasibility = {
  status: 'green' | 'gold' | 'red'
  transitMin: number
  dwellMin: number
  daySpanMin: number
  stopsOutsideHours: string[]
  rationale: string
}

export type Day = {
  index: number
  date: string
  weekday: string
  /** The bird that tints this day. Matches --day-N in tokens.css. */
  tint: 1 | 2 | 3 | 4 | 5
  title: string
  /** In period order, morning then afternoon then evening; three by default, and each period may hold two. */
  slots: Slot[]
  /** Null until the day has been scheduled, which renders as the blank state. */
  feasibility: DayFeasibility | null
}

export type Person = {
  id: string
  name: string
  initials: string
}

export type Answer = 'yes' | 'no' | 'must' | null

/**
 * Member id to place id to answer. Null means that member has not swiped that place yet. A must is a yes the member
 * wants weighted extra; each member holds at most one, and the tally ranks it higher without changing percentages.
 */
export type Votes = Record<string, Record<string, Answer>>

/** One city and a run of consecutive days, with a fixed transfer block before it. */
export type Leg = {
  city: string
  startDay: number
  endDay: number
  transferMin: number
}

export type Pin = {
  placeId: string
  dayIndex: number
  slotIndex: number
}

export type ChecklistItem = {
  id: string
  label: string
  ticked: boolean
  /** The trip fact this item is derived from, for example destination:japan. */
  derivedFrom: string
}

export type Trip = {
  id: string
  destination: string
  country: string
  startDate: string
  nights: number
  budgetRM: number
  ownerId: string
  party: Person[]
  days: Day[]
  options: Record<string, Place>
  legs: Leg[]
  votes: Votes
  pins: Pin[]
  checklist: ChecklistItem[]
}

/** travelMatrix[fromId][toId] is transit minutes. Symmetric, zero diagonal, no empty cell. */
export type TravelMatrix = Record<string, Record<string, number>>

export type TallyEntry = {
  placeId: string
  name: string
  percentage: number
  /** True when every member, owner included, said yes. */
  unanimous: boolean
  /** True when the weighted yes score is zero. */
  eliminated: boolean
  /** Members who marked this place Must Go. */
  mustBy: string[]
}
