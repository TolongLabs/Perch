export type Period = 'morning' | 'midday' | 'afternoon' | 'evening'

export type SlotState = 'open' | 'decided' | 'at-risk'

export type OptionKind =
  | 'temple'
  | 'nature'
  | 'volcano'
  | 'market'
  | 'food'
  | 'museum'
  | 'beach'
  | 'cave'
  | 'craft'
  | 'viewpoint'
  | 'street'

export type Option = {
  id: string
  name: string
  kind: OptionKind
  area: string
  /** Driving minutes from the city centre. The unit that makes a swap honest. */
  travelMin: number
  /** How long a visitor actually spends there, not the minimum possible. */
  dwellMin: number
  costRM: number
  opens: string
  closes: string
  closedOn: string[]
  bestPeriod: Period[]
  tags: string[]
  blurb: string
}

export type Slot = {
  id: string
  period: Period
  /** The option currently in the slot. Null only while The Book is in its setting state. */
  chosenId: string | null
  /** Everything that lost, in rank order. The replacement pool, the cut list and the change list at once. */
  benchIds: string[]
  state: SlotState
  /** Why the slot is at risk. Present only when state is 'at-risk'. */
  cause: string | null
}

export type Day = {
  index: number
  date: string
  weekday: string
  /** The bird that tints this day. Matches --day-N in tokens.css. */
  tint: 1 | 2 | 3 | 4 | 5
  title: string
  slots: Slot[]
}

export type Person = {
  id: string
  name: string
  initials: string
  /** Days this person tapped as available in phase 1. Empty means they have not opened the link. */
  availableDays: number[]
  /** Option ids this person tapped as unmissable in phase 2. */
  wants: string[]
}

export type ChangeEvent = {
  id: string
  at: string
  dayIndex: number
  slotId: string
  cause: string
  fromId: string
  toId: string
  /** Negative is closer. Always reported with deltaRM, never alone. */
  deltaMin: number
  deltaRM: number
  sentence: string
}

export type Trip = {
  id: string
  destination: string
  country: string
  startDate: string
  nights: number
  budgetRM: number
  party: Person[]
  days: Day[]
  options: Record<string, Option>
  /** The order the interview produced, most wanted first. Group taps reorder it; they never edit a slot. */
  ranking: string[]
  changes: ChangeEvent[]
}
