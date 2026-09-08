import { useMemo, useState } from 'react'
import './DateRangePicker.css'

export type Range = { start: string | null; end: string | null }

/** Monday first, so a weekend reads as one block at the end of a row instead of being split across two. */
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

/**
 * The month grid is the one place in the build that needs calendar arithmetic, so it is the one place that constructs
 * a Date. `TRD.md` limits Date to `format.dayLabel`; a drawn month cannot be built from 'HH:MM' strings and minutes.
 */
const leadingBlanks = (y: number, m: number) => (new Date(y, m, 1).getDay() + 6) % 7
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()

const label = (value: string) => {
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return value
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`
}

/** Whole days between two ISO dates. The trip's nights count, which is what the model stores. */
export const nightsBetween = (start: string, end: string) =>
  Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000)

/** The inverse, for seeding the picker from a trip that already has dates. */
export const addDays = (start: string, days: number) => {
  const d = new Date(`${start}T00:00:00`)
  d.setDate(d.getDate() + days)
  return iso(d.getFullYear(), d.getMonth(), d.getDate())
}

type Cell = { key: string; value: string; day: number } | { key: string; value: null; day: null }

export const DateRangePicker = ({ value, onChange }: { value: Range; onChange: (next: Range) => void }) => {
  const [view, setView] = useState(() => {
    const anchor = value.start ? new Date(`${value.start}T00:00:00`) : new Date()
    return { year: anchor.getFullYear(), month: anchor.getMonth() }
  })

  const cells = useMemo<Cell[]>(() => {
    const blanks = leadingBlanks(view.year, view.month)
    const total = daysInMonth(view.year, view.month)
    const out: Cell[] = []
    for (let i = 0; i < blanks; i++) out.push({ key: `blank-${i}`, value: null, day: null })
    for (let d = 1; d <= total; d++) {
      const v = iso(view.year, view.month, d)
      out.push({ key: v, value: v, day: d })
    }
    return out
  }, [view])

  const step = (by: number) => {
    const next = view.month + by
    setView({ year: view.year + Math.floor(next / 12), month: ((next % 12) + 12) % 12 })
  }

  // First tap anchors the start, second closes the range. A tap before the anchor re-anchors rather than inverting,
  // because an inverted range is a state the caller would have to unpick.
  const pick = (day: string) => {
    if (!value.start || value.end || day < value.start) return onChange({ start: day, end: null })
    onChange({ start: value.start, end: day })
  }

  const edge = (day: string) => {
    if (day === value.start && day === value.end) return 'both'
    if (day === value.start) return 'start'
    if (day === value.end) return 'end'
    return undefined
  }

  const within = (day: string) => {
    if (!value.start) return false
    if (!value.end) return day === value.start
    return day >= value.start && day <= value.end
  }

  return (
    <div className="dr">
      <div className="dr-bar">
        <p className="dr-month">
          {MONTHS[view.month]} {view.year}
        </p>
        <div className="dr-nav">
          <button type="button" className="dr-step" aria-label="Previous Month" onClick={() => step(-1)}>
            <span className="dr-chev" data-dir="back" aria-hidden="true" />
          </button>
          <button type="button" className="dr-step" aria-label="Next Month" onClick={() => step(1)}>
            <span className="dr-chev" data-dir="on" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="dr-week" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <p key={d} className="t-label dr-weekday">
            {d}
          </p>
        ))}
      </div>

      <div className="dr-grid">
        {cells.map((c) =>
          c.value === null ? (
            <span key={c.key} className="dr-cell" data-blank="true" />
          ) : (
            <span key={c.key} className="dr-cell" data-in={within(c.value)} data-edge={edge(c.value)}>
              <button
                type="button"
                className="dr-num"
                aria-label={label(c.value)}
                aria-pressed={within(c.value)}
                onClick={() => pick(c.value)}
              >
                {c.day}
              </button>
            </span>
          )
        )}
      </div>
    </div>
  )
}
