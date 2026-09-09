import type { Handbook, HandbookEntry, NewsItem, Trip } from './types'

/**
 * The Tokyo handbook fixture: everything the Handbook can say, each line tied to the trip fact that earns it. The
 * page shows only the lines the trip derives, so a trip with no shrine on the calendar never sees shrine etiquette.
 * Sourcing this live is a build-phase question, recorded in TRD.md; for the prototype the lines are authored and
 * every one carries its source.
 */
const JNTO = 'Japan National Tourism Organization, japan.travel'
const JMA = 'Japan Meteorological Agency, 1991 to 2020 climate normals for Tokyo'

export const TAKE_CARE: HandbookEntry[] = [
  {
    id: 'shoes',
    text: 'Expect to take your shoes off at temple halls, some restaurants and any tatami room. Socks without holes are the quiet win.',
    derivedFrom: 'destination:japan',
    source: JNTO
  },
  {
    id: 'cash',
    text: 'Cards work in most shops now, but small eateries, shrines and market stalls still take cash only. Keep a few thousand yen in coins and notes.',
    derivedFrom: 'destination:japan',
    source: JNTO
  },
  {
    id: 'bins',
    text: 'Public bins are rare. Carry a small bag for your own rubbish and use the bins at convenience stores and stations.',
    derivedFrom: 'destination:japan',
    source: JNTO
  },
  {
    id: 'trains-quiet',
    text: 'Trains are quiet. Phones on silent, no calls, and backpacks worn on the front when it is crowded.',
    derivedFrom: 'destination:japan',
    source: JNTO
  },
  {
    id: 'shrine-etiquette',
    text: 'At a shrine, bow once at the gate, keep to the sides of the approach, rinse hands at the basin, then bow twice, clap twice and bow once at the hall.',
    derivedFrom: 'kind:shrine',
    source: JNTO
  },
  {
    id: 'temple-etiquette',
    text: 'At a temple, incense smoke is wafted over the head for luck and photographs are not taken inside the main hall.',
    derivedFrom: 'kind:temple',
    source: JNTO
  },
  {
    id: 'museum-bags',
    text: 'Large bags go into the coin lockers at the museum entrance; the coin comes back.',
    derivedFrom: 'kind:museum',
    source: 'Tokyo National Museum visitor guidance, tnm.jp'
  },
  {
    id: 'street-food',
    text: 'Eat street food where you bought it. Walking while eating is frowned on, and stalls set out a spot for it.',
    derivedFrom: 'tag:street-food',
    source: JNTO
  },
  {
    id: 'tattoos',
    text: 'Tattoos can be refused at public baths and some pools. Cover them where you can, or check the venue first.',
    derivedFrom: 'destination:japan',
    source: JNTO
  }
]

export const NEWS: NewsItem[] = [
  {
    id: 'weather-1',
    date: '2026-11-20',
    text: 'Late November in Tokyo runs 10 to 17°C, mostly dry and clear; the coldest part of the day is the evening.',
    triggers: 'weather:cool',
    source: JMA
  },
  {
    id: 'weather-2',
    date: '2026-11-21',
    text: 'One day in four carries rain at this time of year, usually light and short. Check the morning forecast before Odaiba.',
    triggers: 'weather:rain',
    source: JMA
  },
  {
    id: 'sunset',
    date: '2026-11-22',
    text: 'Sunset is about 16:30. Gardens and outdoor spots are best before three; evenings belong to the streets and the lights.',
    triggers: null,
    source: 'National Astronomical Observatory of Japan, sunrise and sunset tables'
  },
  {
    id: 'autumn-leaves',
    date: '2026-11-23',
    text: 'Autumn colour in central Tokyo peaks in the last week of November, so the gardens on this trip fall inside it.',
    triggers: null,
    source: 'JNTO autumn leaves calendar, japan.travel'
  },
  {
    id: 'holiday',
    date: '2026-11-23',
    text: 'Monday 23 November is Labour Thanksgiving Day, a public holiday. Museums that close on Mondays open, and the following day closes instead.',
    triggers: null,
    source: 'Cabinet Office of Japan, national holidays'
  }
]

export const PACKING: HandbookEntry[] = [
  {
    id: 'umbrella',
    text: 'A compact umbrella. Convenience stores sell them for a few hundred yen if you forget.',
    derivedFrom: 'weather:rain',
    source: JMA
  },
  {
    id: 'layers',
    text: 'A light jacket and one warm layer for the evenings.',
    derivedFrom: 'weather:cool',
    source: JMA
  },
  {
    id: 'shoes',
    text: 'Shoes that slip off easily. You will be taking them off more than you think.',
    derivedFrom: 'destination:japan',
    source: JNTO
  },
  {
    id: 'coin-purse',
    text: 'A coin purse. Change builds up fast when stalls and shrines take cash.',
    derivedFrom: 'destination:japan',
    source: JNTO
  },
  {
    id: 'rubbish-bag',
    text: 'A small folding bag for your own rubbish between bins.',
    derivedFrom: 'destination:japan',
    source: JNTO
  },
  {
    id: 'battery',
    text: 'A power bank. Maps, the Book and the transit routes all live on the phone.',
    derivedFrom: 'destination:japan',
    source: JNTO
  },
  {
    id: 'socks',
    text: 'Warm socks, because the floors you stand on without shoes are cold in November.',
    derivedFrom: 'kind:temple',
    source: JNTO
  }
]

/** The facts a trip establishes: its destination, the kinds and tags of what is on the calendar, and the news triggers. */
export const factsOf = (trip: Trip): Set<string> => {
  const facts = new Set<string>([
    `destination:${trip.destination.toLowerCase() === 'tokyo' ? 'japan' : trip.destination.toLowerCase()}`
  ])
  for (const day of trip.days) {
    for (const slot of day.slots) {
      const place = slot.placeId ? trip.options[slot.placeId] : undefined
      if (!place) continue
      facts.add(`kind:${place.kind}`)
      for (const tag of place.tags) facts.add(`tag:${tag}`)
    }
  }
  for (const item of NEWS) if (item.triggers) facts.add(item.triggers)
  return facts
}

/** The Handbook for this trip: only the lines its facts earn, news inside its dates. */
export const handbookFor = (trip: Trip): Handbook => {
  const facts = factsOf(trip)
  const inTrip = (date: string) => trip.days.some((d) => d.date === date)
  return {
    takeCare: TAKE_CARE.filter((e) => facts.has(e.derivedFrom)),
    news: NEWS.filter((n) => inTrip(n.date)),
    packing: PACKING.filter((e) => facts.has(e.derivedFrom))
  }
}
