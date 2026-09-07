import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NewPlan.css'

type Choice = { id: string; label: string; note: string; stub?: boolean }

const WHERE: Choice[] = [
  { id: 'yogya', label: 'Yogyakarta', note: '27 places loaded' },
  { id: 'penang', label: 'Penang', note: 'No place data yet', stub: true },
  { id: 'bangkok', label: 'Bangkok', note: 'No place data yet', stub: true },
  { id: 'da-nang', label: 'Da Nang', note: 'No place data yet', stub: true }
]

/** The lengths are prefills, not a date picker. The middle one is what every panel answer described unprompted. */
const HOW_LONG: Choice[] = [
  { id: 'weekend', label: 'Just The Weekend', note: '2 days, 1 night' },
  { id: 'leave', label: 'One Day Of Leave', note: '4 days, 3 nights. Tag a weekend' },
  { id: 'week', label: 'A Full Week', note: '7 days, 6 nights' }
]

const WHO: Choice[] = [
  { id: 'solo', label: 'Just Me', note: 'The questions get shorter' },
  { id: 'four', label: 'Four Of Us', note: 'Aisyah, Farah, Hana, Iman' },
  { id: 'more', label: 'More Than Six', note: 'Availability comes first' }
]

/**
 * The step the prototype was missing. It is deliberately not a form: three rows of prefilled chips, one already
 * chosen in each, because `PRODUCT.md`'s rule is that no question is asked which Perch can infer.
 */
export const NewPlan = () => {
  const navigate = useNavigate()
  const [where, setWhere] = useState('yogya')
  const [how, setHow] = useState('leave')
  const [who, setWho] = useState('four')

  const row = (label: string, hint: string, options: Choice[], value: string, set: (v: string) => void) => (
    <section className="np-row">
      <p className="t-label np-label">{label}</p>
      <p className="t-specimen np-hint">{hint}</p>
      <ul className="np-chips">
        {options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              className="np-chip"
              data-on={value === o.id}
              data-stub={o.stub === true}
              onClick={() => set(o.id)}
            >
              <span className="t-name">{o.label}</span>
              <span className="t-specimen">{o.note}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )

  const stub = where !== 'yogya'

  return (
    <main className="np">
      <header className="np-head">
        <p className="t-label np-kicker">New Plan</p>
        <h1 className="t-display">Three Things, Then Three Questions</h1>
        <p className="t-specimen np-sub">
          Everything here is already filled in. Change what is wrong and leave the rest &mdash; Perch does not ask what
          it can infer.
        </p>
      </header>

      {row('Where To', 'One destination has real place data in this prototype.', WHERE, where, setWhere)}
      {row('How Long', 'The middle one is the trip our research kept describing.', HOW_LONG, how, setHow)}
      {row('Who Is Coming', 'This is the only answer that changes the shape of the rest.', WHO, who, setWho)}

      {stub && (
        <p className="np-stub t-label">
          That destination has no place data in the prototype. Yogyakarta is the one that runs end to end.
        </p>
      )}

      <button type="button" className="np-go t-label" disabled={stub} onClick={() => navigate('/interview')}>
        {stub ? 'Pick Yogyakarta To Continue' : 'Ask Me The Three Questions'}
      </button>

      <button type="button" className="np-back t-label" onClick={() => navigate('/trips')}>
        Back To Your Trips
      </button>
    </main>
  )
}
