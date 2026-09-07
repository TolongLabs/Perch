import { byId, places } from './places'
import type { Day, Slot, Trip } from './types'

/**
 * A slot always has a chosen option, because the trip is valid with zero group input: Perch has already chosen.
 * `open` does not mean empty, it means still movable, and that is what The Book draws as a blank.
 */
const slot = (id: string, period: Slot['period'], chosenId: string, bench: string[], state: Slot['state']): Slot => ({
  id,
  period,
  chosenId,
  benchIds: bench,
  state,
  cause: null
})

const days: Day[] = [
  {
    index: 1,
    date: '2026-11-21',
    weekday: 'Saturday',
    tint: 1,
    title: 'Landing, And The Street',
    slots: [
      slot('d1-midday', 'midday', 'gudeg-yu-djum', ['bakmi-mbah-gito', 'sonobudoyo', 'kotagede'], 'decided'),
      slot('d1-afternoon', 'afternoon', 'malioboro', ['beringharjo', 'kotagede', 'affandi'], 'decided'),
      slot(
        'd1-evening',
        'evening',
        'angkringan-lik-man',
        ['alun-alun-kidul', 'oseng-mercon', 'sate-klathak'],
        'decided'
      )
    ]
  },
  {
    index: 2,
    date: '2026-11-22',
    weekday: 'Sunday',
    tint: 2,
    title: 'The Temple Day',
    slots: [
      slot('d2-morning', 'morning', 'borobudur', ['prambanan', 'jomblang', 'kalibiru', 'bukit-panguk'], 'decided'),
      slot('d2-afternoon', 'afternoon', 'ullen-sentalu', ['ratu-boko', 'kalibiru', 'parangtritis'], 'open'),
      slot(
        'd2-evening',
        'evening',
        'sate-klathak',
        ['bakmi-mbah-gito', 'oseng-mercon', 'angkringan-lik-man'],
        'decided'
      )
    ]
  },
  {
    index: 3,
    date: '2026-11-23',
    weekday: 'Monday',
    tint: 3,
    title: 'The Mountain',
    slots: [
      slot(
        'd3-morning',
        'morning',
        'merapi-jeep',
        ['prambanan', 'jomblang', 'timang', 'bukit-panguk', 'kalibiru'],
        'decided'
      ),
      slot('d3-afternoon', 'afternoon', 'tebing-breksi', ['ratu-boko', 'parangtritis', 'kalibiru'], 'decided'),
      slot(
        'd3-evening',
        'evening',
        'oseng-mercon',
        ['angkringan-lik-man', 'alun-alun-kidul', 'sate-klathak'],
        'decided'
      )
    ]
  },
  {
    index: 4,
    date: '2026-11-24',
    weekday: 'Tuesday',
    tint: 4,
    title: 'South To The Coast',
    slots: [
      slot('d4-morning', 'morning', 'pindul', ['timang', 'kalibiru', 'bukit-panguk', 'batik-workshop'], 'decided'),
      slot('d4-afternoon', 'afternoon', 'parangtritis', ['ratu-boko', 'tebing-breksi', 'kalibiru'], 'open'),
      slot('d4-evening', 'evening', 'bakmi-mbah-gito', ['sate-klathak', 'oseng-mercon', 'alun-alun-kidul'], 'decided')
    ]
  },
  {
    index: 5,
    date: '2026-11-25',
    weekday: 'Wednesday',
    tint: 5,
    title: 'Inside The Walls',
    slots: [
      slot('d5-morning', 'morning', 'kraton', ['sonobudoyo', 'vredeburg', 'affandi', 'batik-workshop'], 'decided'),
      slot('d5-midday', 'midday', 'taman-sari', ['vredeburg', 'kotagede', 'sonobudoyo'], 'decided'),
      slot('d5-afternoon', 'afternoon', 'beringharjo', ['malioboro', 'kotagede', 'affandi'], 'open')
    ]
  }
]

/** The ten cards question 3 deals, and the three Aisyah kept. The other seven settle onto the perch. */
export const interviewPool = [
  'borobudur',
  'prambanan',
  'merapi-jeep',
  'jomblang',
  'timang',
  'taman-sari',
  'malioboro',
  'kotagede',
  'sate-klathak',
  'parangtritis'
]

export const interviewPicks = ['borobudur', 'prambanan', 'merapi-jeep']

const ranking = [
  ...interviewPicks,
  ...interviewPool.filter((id) => !interviewPicks.includes(id)),
  ...places.map((p) => p.id).filter((id) => !interviewPool.includes(id))
]

export const trip: Trip = {
  id: 'yogya-nov-2026',
  destination: 'Yogyakarta',
  country: 'Indonesia',
  startDate: '2026-11-21',
  nights: 4,
  budgetRM: 450,
  party: [
    { id: 'aisyah', name: 'Aisyah', initials: 'AI', availableDays: [1, 2, 3, 4, 5], wants: [] },
    {
      id: 'farah',
      name: 'Farah',
      initials: 'FA',
      availableDays: [1, 2, 3, 4, 5],
      wants: ['prambanan', 'parangtritis']
    },
    { id: 'hana', name: 'Hana', initials: 'HA', availableDays: [2, 3, 4, 5], wants: ['sate-klathak'] },
    { id: 'iman', name: 'Iman', initials: 'IM', availableDays: [], wants: [] }
  ],
  days,
  options: byId,
  ranking,
  changes: []
}
