import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../components/Ui'
import { handbookFor } from '../data/handbook'
import type { HandbookEntry, ManualNote, ManualSection, NewsItem } from '../data/types'
import { dayLabel } from '../lib/format'
import { MAX_NOTE_LENGTH } from '../lib/manualNotes'
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

type PersonalNotesProps = {
  section: ManualSection
  heading: string
  notes: ManualNote[]
  onAdd: (section: ManualSection, text: string) => void
  onRemove: (section: ManualSection, id: string) => void
}

const PersonalNotes = ({ section, heading, notes, onAdd, onRemove }: PersonalNotesProps) => {
  const [text, setText] = useState('')
  const fieldId = `hb-${section}-note`

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!text.trim()) return
    onAdd(section, text)
    setText('')
  }

  return (
    <div className="hb-personal" data-empty={notes.length === 0}>
      <div className="hb-personal-head">
        <h3 className="t-label">Your Notes</h3>
        <p className="t-specimen">Personal. Saved only in this browser.</p>
      </div>

      <div className="hb-personal-list" aria-live="polite">
        {notes.length === 0 ? (
          <p className="t-specimen hb-note-empty">No personal notes yet.</p>
        ) : (
          <ul aria-label={`${heading} Personal Notes`}>
            {notes.map((note) => (
              <li key={note.id} className="hb-personal-note">
                <p className="t-prose">{note.text}</p>
                <button type="button" className="t-label hb-note-remove" onClick={() => onRemove(section, note.id)}>
                  Remove Note
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form className="hb-note-form" aria-label={`Add A ${heading} Note`} onSubmit={submit}>
        <label className="t-label hb-note-label" htmlFor={fieldId}>
          Add A Note
        </label>
        <textarea
          id={fieldId}
          name={`${section}-note`}
          value={text}
          maxLength={MAX_NOTE_LENGTH}
          rows={2}
          placeholder="Add a reminder for this trip"
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit" className="t-label hb-note-add" disabled={!text.trim()}>
          Add Note
        </button>
      </form>
    </div>
  )
}

export const Handbook = () => {
  const navigate = useNavigate()
  const { trip, addManualNote, removeManualNote } = useTrip()
  const { takeCare, news, packing } = handbookFor(trip)

  return (
    <main className="handbook">
      <header className="hb-head">
        <Heading as="h1">
          <span className="t-display">The Manual</span>
        </Heading>
        <p className="t-prose hb-lede">
          {trip.destination}, {dayLabel(trip.startDate)} to{' '}
          {dayLabel(trip.days[trip.days.length - 1]?.date ?? trip.startDate)}. Sourced advice follows the trip; your own
          notes stay separate and on this browser.
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
            <PersonalNotes
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
            <PersonalNotes
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
