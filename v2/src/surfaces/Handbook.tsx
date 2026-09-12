import { CloudSun } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../components/Ui'
import { handbookFor } from '../data/handbook'
import type { HandbookEntry, ManualNote, ManualSection, NewsItem } from '../data/types'
import { dayLabel } from '../lib/format'
import { MAX_NOTE_LENGTH, MAX_NOTE_TITLE_LENGTH } from '../lib/manualNotes'
import { saveAsPdf } from '../lib/print'
import { useTrip } from '../state'
import './Handbook.css'

const WHY: Record<string, string> = {
  'weather:rain': 'rain is likely',
  'weather:cool': 'the evenings run cold'
}

const because = (derivedFrom: string): string | null => {
  if (derivedFrom.startsWith('destination:')) return null
  const known = WHY[derivedFrom]
  if (known) return known
  const [prefix, value] = derivedFrom.split(':')
  if (!value) return null
  return prefix === 'kind' || prefix === 'tag' ? `a ${value.replace(/-/g, ' ')} is on the calendar` : value
}

const Sources = ({ of }: { of: { source: string }[] }) => {
  const named = [...new Set(of.map((entry) => entry.source))]
  if (named.length === 0) return null
  return (
    <p className="t-specimen hb-sources">
      {named.length === 1 ? 'Source: ' : 'Sources: '}
      {named.join('; ')}.
    </p>
  )
}

const byDate = (news: NewsItem[]): { date: string; items: NewsItem[] }[] => {
  const days: { date: string; items: NewsItem[] }[] = []
  for (const item of news) {
    const last = days[days.length - 1]
    if (last && last.date === item.date) last.items.push(item)
    else days.push({ date: item.date, items: [item] })
  }
  return days
}

const GuideList = ({ entries, explain = false }: { entries: HandbookEntry[]; explain?: boolean }) => (
  <ul className="hb-list">
    {entries.map((entry) => {
      const why = explain ? because(entry.derivedFrom) : null
      return (
        <li key={entry.id} className="hb-item">
          <h3 className="hb-item-title">{entry.title}</h3>
          <p className="t-prose hb-item-description">{entry.text}</p>
          {why && <p className="t-specimen hb-why">Because {why}.</p>}
        </li>
      )
    })}
  </ul>
)

type TripNotesProps = {
  section: ManualSection
  heading: string
  notes: ManualNote[]
  onAdd: (section: ManualSection, text: string, title: string) => void
  onRemove: (section: ManualSection, id: string) => void
}

const TripNotes = ({ section, heading, notes, onAdd, onRemove }: TripNotesProps) => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const fieldId = `hb-${section}-note`

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !text.trim()) return
    onAdd(section, text, title)
    setTitle('')
    setText('')
  }

  return (
    <div className="hb-trip-notes" data-empty={notes.length === 0}>
      <h3 className="t-label">Trip Notes</h3>
      <div className="hb-trip-note-list" aria-live="polite">
        {notes.length === 0 ? (
          <p className="hb-note-empty">Add a reminder for everyone on this trip.</p>
        ) : (
          <ul className="hb-list" aria-label={`${heading} Trip Notes`}>
            {notes.map((note) => (
              <li key={note.id} className="hb-item hb-trip-note">
                <div className="hb-note-heading">
                  <h4 className="hb-item-title">{note.title}</h4>
                  <button
                    type="button"
                    className="t-label hb-note-remove"
                    aria-label={`Remove ${note.title}`}
                    onClick={() => onRemove(section, note.id)}
                  >
                    Remove
                  </button>
                </div>
                <p className="hb-item-description">{note.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form className="hb-note-form" aria-label={`Add A ${heading} Note`} onSubmit={submit}>
        <label className="t-label hb-note-label" htmlFor={`${fieldId}-title`}>
          Note Title
        </label>
        <input
          id={`${fieldId}-title`}
          name={`${section}-note-title`}
          value={title}
          maxLength={MAX_NOTE_TITLE_LENGTH}
          required
          placeholder={section === 'takeCare' ? 'Meeting point' : 'Phone charger'}
          onChange={(event) => setTitle(event.target.value)}
        />
        <label className="t-label hb-note-label" htmlFor={fieldId}>
          Note Content
        </label>
        <textarea
          id={fieldId}
          name={`${section}-note`}
          value={text}
          maxLength={MAX_NOTE_LENGTH}
          required
          rows={3}
          placeholder="What should the group know?"
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit" className="t-label hb-note-add" disabled={!title.trim() || !text.trim()}>
          Add Note
        </button>
      </form>
    </div>
  )
}

/** Predicted weather for the destination during the trip window. */
const predictedWeatherFor = (destination: string) => {
  if (destination.toLowerCase().includes('tokyo')) {
    return {
      temp: '16°C',
      feelsLike: '14°C',
      condition: 'Mostly Clear'
    }
  }
  return {
    temp: '28°C',
    feelsLike: '33°C',
    condition: 'Partly Cloudy'
  }
}

export const Handbook = () => {
  const navigate = useNavigate()
  const { trip, addManualNote, removeManualNote } = useTrip()
  const { takeCare, news, packing } = handbookFor(trip)
  const weather = predictedWeatherFor(trip.destination)

  return (
    <main className="handbook">
      <header className="hb-head">
        <div className="hb-title-row">
          <Heading as="h1">
            <span className="t-display">The Manual</span>
          </Heading>
          <div className="hb-weather">
            <CloudSun className="hb-weather-icon" size={18} aria-hidden="true" />
            <span className="hb-weather-temp">{weather.temp}</span>
            <span className="hb-weather-dot" aria-hidden="true">
              &middot;
            </span>
            <span className="hb-weather-feels">Feels like {weather.feelsLike}</span>
            <span className="hb-weather-dot" aria-hidden="true">
              &middot;
            </span>
            <span className="hb-weather-condition">{weather.condition}</span>
          </div>
        </div>
        <p className="hb-lede">
          {trip.destination}, {dayLabel(trip.startDate)} to{' '}
          {dayLabel(trip.days[trip.days.length - 1]?.date ?? trip.startDate)}. Advice and reminders for the whole group.
        </p>
        <p className="hb-sharing">
          Trip notes stay visible when you switch members in this browser. Cross-device sharing is not connected in this
          prototype.
        </p>
      </header>

      <div className="hb-body">
        <div className="hb-guide">
          <section className="hb-care hb-section" aria-labelledby="hb-take-care">
            <h2 className="t-plate-title" id="hb-take-care">
              Take Care
            </h2>
            <p className="t-label hb-kind">Sourced Advice</p>
            <GuideList entries={takeCare} />
            <Sources of={takeCare} />
            <TripNotes
              section="takeCare"
              heading="Take Care"
              notes={trip.manualNotes.takeCare}
              onAdd={addManualNote}
              onRemove={removeManualNote}
            />
          </section>

          <section className="hb-pack hb-section" aria-labelledby="hb-packing">
            <h2 className="t-plate-title" id="hb-packing">
              Packing List
            </h2>
            <p className="t-specimen hb-note">
              Not the essentials from Before We Go. These follow from the forecast and places on your calendar.
            </p>
            <p className="t-label hb-kind">Sourced Advice</p>
            <GuideList entries={packing} explain />
            <Sources of={packing} />
            <TripNotes
              section="packing"
              heading="Packing"
              notes={trip.manualNotes.packing}
              onAdd={addManualNote}
              onRemove={removeManualNote}
            />
          </section>
        </div>

        <section className="hb-news hb-section" aria-labelledby="hb-news-head">
          <div className="hb-news-head">
            <h2 className="t-plate-title" id="hb-news-head">
              News For The Trip
            </h2>
            <p className="t-specimen hb-note">
              These prototype conditions use climate normals and public-calendar guidance, not a live forecast.
            </p>
          </div>
          <div className="hb-days">
            {byDate(news).map(({ date, items }) => (
              <section key={date} className="hb-day" aria-labelledby={`hb-news-${date}`}>
                <h3 className="t-label hb-date" id={`hb-news-${date}`}>
                  {dayLabel(date)}
                </h3>
                <ul className="hb-news-list">
                  {items.map((item) => (
                    <li key={item.id} className="hb-news-item">
                      <p className="t-prose">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <Sources of={news} />
        </section>
      </div>

      <div className="hb-foot">
        <button
          type="button"
          className="hb-save t-label"
          onClick={() =>
            saveAsPdf(`${trip.destination} Manual, ${dayLabel(trip.startDate)} ${trip.startDate.slice(0, 4)}`)
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
