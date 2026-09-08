import { byId } from './places'
import type { ChecklistItem, Day, Period, Slot, Trip } from './types'
import { votes } from './votes'

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

const slot = (dayIndex: number, period: Period): Slot => ({
  id: `d${dayIndex}-${period}`,
  period,
  placeId: null,
  pinned: false
})

/**
 * A day in November, four in a row from a Friday so one day of leave covers the trip, with Monday inside it because
 * Monday is the day the museums and gardens close. The calendar is empty until Apply.
 */
const day = (index: number, date: string, weekday: string, tint: Day['tint'], title: string): Day => ({
  index,
  date,
  weekday,
  tint,
  title,
  slots: PERIODS.map((period) => slot(index, period)),
  feasibility: null
})

const days: Day[] = [
  day(1, '2026-11-20', 'Friday', 1, 'Asakusa And Ueno'),
  day(2, '2026-11-21', 'Saturday', 2, 'Shibuya, Harajuku And Shinjuku'),
  day(3, '2026-11-22', 'Sunday', 3, 'Tsukiji, Ginza And The Station'),
  day(4, '2026-11-23', 'Monday', 4, 'Odaiba, Toyosu And teamLab')
]

/** Six things a Tokyo trip in November needs, each traced to the fact that produced it. JR Pass is pre-ticked: not needed. */
export const checklist: ChecklistItem[] = [
  { id: 'passport', label: 'Passport valid for the whole trip', ticked: false, derivedFrom: 'destination:japan' },
  { id: 'suica', label: 'Suica or Welcome Suica card', ticked: false, derivedFrom: 'destination:japan' },
  {
    id: 'teamlab',
    label: 'teamLab ticket booked in advance',
    ticked: false,
    derivedFrom: 'cluster:odaiba-toyosu-teamlab'
  },
  { id: 'yen', label: 'Yen cash for the smaller shops', ticked: false, derivedFrom: 'destination:japan' },
  { id: 'insurance', label: 'Travel insurance', ticked: false, derivedFrom: 'duration:4days' },
  { id: 'jrpass', label: 'JR Pass, not needed for Tokyo only', ticked: true, derivedFrom: 'destination:tokyo' }
]

export const trip: Trip = {
  id: 'tokyo-nov-2026',
  destination: 'Tokyo',
  country: 'Japan',
  startDate: '2026-11-20',
  nights: 3,
  budgetRM: 600,
  ownerId: 'aisyah',
  party: [
    { id: 'aisyah', name: 'Aisyah', initials: 'AI' },
    { id: 'farah', name: 'Farah', initials: 'FA' },
    { id: 'hana', name: 'Hana', initials: 'HA' },
    { id: 'iman', name: 'Iman', initials: 'IM' }
  ],
  days,
  options: byId,
  legs: [{ city: 'Tokyo', startDay: 1, endDay: 4, transferMin: 0 }],
  votes,
  pins: [],
  checklist
}
