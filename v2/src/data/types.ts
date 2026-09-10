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
  /** Why a red day is red: a stop closed that weekday, a stop reached outside its hours, or the day past 21:00. */
  reason: 'closed' | 'hours' | 'overrun' | null
  transitMin: number
  dwellMin: number
  daySpanMin: number
  /** Minutes after midnight when the last stop is left. */
  endMin: number
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
  /** Minutes after midnight when the day starts. 540 is 09:00. */
  startMin: number
  /** Null until the day has been scheduled, which renders as the blank state. */
  feasibility: DayFeasibility | null
}

export type Person = {
  id: string
  name: string
  initials: string
}

export type Answer = 'yes' | 'no' | 'must' | 'skip' | null

/**
 * Member id to place id to answer. Null means that member has not swiped that place yet. A must is a yes the member
 * wants weighted extra; each member holds at most one, and the tally ranks it higher without changing percentages.
 * A skip is an explicit abstain: it gives no support, keeps the full denominator, and counts as answered.
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

/**
 * One line of the Handbook. `derivedFrom` names the trip fact that puts it on the page: the destination, a place
 * kind on the calendar, a tag on a placed card, or a news item. `source` says where the advice comes from, because a
 * handbook that cannot say is a guess dressed as a guide.
 */
export type HandbookEntry = {
  id: string
  title: string
  text: string
  derivedFrom: string
  source: string
}

/** A dated forecast or disruption line for the trip. The prototype's rows come from climate normals, and say so. */
export type NewsItem = {
  id: string
  date: string
  text: string
  /** The packing derivation this item triggers, for example weather:rain, or null when it triggers none. */
  triggers: string | null
  source: string
}

export type Handbook = {
  takeCare: HandbookEntry[]
  news: NewsItem[]
  packing: HandbookEntry[]
}

export type ManualSection = 'takeCare' | 'packing'

export type ManualNote = {
  id: string
  text: string
}

export type Trip = {
  id: string
  destination: string
  country: string
  startDate: string
  nights: number
  budgetRM: number
  ownerId: string
  /** Who this browser is voting as. The owner by default; the invite link lets a friend pick themselves. */
  currentMemberId: string
  /** ISO timestamp when voting closed, or null while it is open. */
  votingClosedAt: string | null
  party: Person[]
  days: Day[]
  options: Record<string, Place>
  legs: Leg[]
  votes: Votes
  pins: Pin[]
  checklist: ChecklistItem[]
  manualNotes: Record<ManualSection, ManualNote[]>
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
