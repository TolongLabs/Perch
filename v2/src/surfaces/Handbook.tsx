import { useNavigate } from 'react-router-dom'
import { Heading } from '../components/Ui'
import { handbookFor } from '../data/handbook'
import type { NewsItem } from '../data/types'
import { dayLabel } from '../lib/format'
import { saveAsPdf } from '../lib/print'
import { useTrip } from '../state'
import './Handbook.css'

/**
 * What a packing line was earned by, in words. The columns put the list on the left and its reasons on the right,
 * which is the order the team drew, so the derivation has to be carried in the sentence rather than by the layout.
 */
const WHY: Record<string, string> = {
  'weather:rain': 'rain is likely',
  'weather:cool': 'the evenings run cold'
}

const because = (derivedFrom: string): string | null => {
  // Everything a Japan trip earns is earned by every Japan trip, so saying so on six lines out of seven is noise.
  if (derivedFrom.startsWith('destination:')) return null
  const known = WHY[derivedFrom]
  if (known) return known
  const [prefix, value] = derivedFrom.split(':')
  if (!value) return null
  return prefix === 'kind' || prefix === 'tag' ? `a ${value.replace(/-/g, ' ')} is on the calendar` : value
}

/** One line naming what a section drew on, rather than the same two strings repeated under a dozen rows. */
const Sources = ({ of }: { of: { source: string }[] }) => {
  const named = [...new Set(of.map((e) => e.source))]
  if (named.length === 0) return null
  return (
    <p className="t-specimen hb-sources">
      {named.length === 1 ? 'Source: ' : 'Sources: '}
      {named.join('; ')}.
    </p>
  )
}

/** News, in trip order, grouped under the day it belongs to. Two things can land on one day and often do. */
const byDate = (news: NewsItem[]): { date: string; items: NewsItem[] }[] => {
  const days: { date: string; items: NewsItem[] }[] = []
  for (const item of news) {
    const last = days[days.length - 1]
    if (last && last.date === item.date) last.items.push(item)
    else days.push({ date: item.date, items: [item] })
  }
  return days
}

/**
 * The second thing the checklist unlocks, beside the Book and in the same plate register. Every line on it is earned
 * by a fact the trip established: a shrine on the calendar, rain in the dates, Japan as the destination. A trip that
 * establishes none of them shows none of the lines, which is why nothing here is written as general travel advice.
 */
export const Handbook = () => {
  const navigate = useNavigate()
  const { trip } = useTrip()
  const { takeCare, news, packing } = handbookFor(trip)

  /** A Take Care line and a news line are the same row; only what earned them differs, and that is not shown here. */
  const entry = (e: { id: string; text: string }) => (
    <li key={e.id} className="hb-item">
      <p className="t-prose">{e.text}</p>
    </li>
  )

  return (
    <main className="handbook">
      <header className="hb-head">
        {/* No info bubble. The dot is the one pill in the plate register, and a sentence a reader has to hover to
            find is a sentence most readers never see, which is the mistake the Desk's first frame was making. It
            is written on the page instead. */}
        <Heading as="h1">
          <span className="t-display">The Handbook</span>
        </Heading>
        <p className="t-prose hb-lede">
          {trip.destination}, {dayLabel(trip.startDate)} to{' '}
          {dayLabel(trip.days[trip.days.length - 1]?.date ?? trip.startDate)}. Every line here is earned by something on
          your calendar or in your dates.
        </p>
      </header>

      <div className="hb-body">
        <section className="hb-pack" aria-labelledby="hb-packing">
          <h2 className="t-plate-title" id="hb-packing">
            Packing List
          </h2>
          <p className="t-specimen hb-note">
            Not the essentials, which are on Before We Go. These follow from the lines beside them.
          </p>
          <ul className="hb-list">
            {packing.map((e) => {
              const why = because(e.derivedFrom)
              return (
                <li key={e.id} className="hb-item">
                  <p className="t-prose">{e.text}</p>
                  {why && <p className="t-specimen hb-why">Because {why}.</p>}
                </li>
              )
            })}
          </ul>
          <Sources of={packing} />
        </section>

        <div className="hb-col">
          <section className="hb-care" aria-labelledby="hb-take-care">
            <h2 className="t-plate-title" id="hb-take-care">
              Take Care
            </h2>
            <ul className="hb-list">{takeCare.map(entry)}</ul>
            <Sources of={takeCare} />
          </section>

          <section className="hb-news" aria-labelledby="hb-news-head">
            <h2 className="t-plate-title" id="hb-news-head">
              News For The Trip
            </h2>
            <div className="hb-days">
              {byDate(news).map(({ date, items }) => (
                <div key={date} className="hb-day">
                  <p className="t-label hb-date">{dayLabel(date)}</p>
                  <ul className="hb-list">{items.map(entry)}</ul>
                </div>
              ))}
            </div>
            <Sources of={news} />
          </section>
        </div>
      </div>

      <div className="hb-foot">
        <button
          type="button"
          className="hb-save t-label"
          onClick={() =>
            saveAsPdf(`${trip.destination} Handbook, ${dayLabel(trip.startDate)} ${trip.startDate.slice(0, 4)}`)
          }
        >
          Save As PDF
        </button>
        <button type="button" className="hb-back t-label" onClick={() => navigate('/desk/before-we-go')}>
          Back To Before We Go
        </button>
      </div>
    </main>
  )
}
