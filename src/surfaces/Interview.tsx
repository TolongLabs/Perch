import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { interviewPicks, interviewPool } from '../data/trip'
import { duration, money } from '../lib/format'
import { useTrip } from '../state'
import './Interview.css'

const SHAPES = [
  { id: 'group', label: 'A Few Of Us', note: 'Different jobs, different shifts, one group chat' },
  { id: 'solo', label: 'Just Me', note: 'Supported, and the questions get shorter' }
]

const MOODS = [
  { id: 'see', label: 'See The Big Things', note: 'The temples and the volcano, even at the gate price' },
  { id: 'eat', label: 'Eat Our Way Through', note: 'Warungs, night carts, and one proper sit-down' },
  { id: 'slow', label: 'Not Rush', note: 'One anchor a day, and time to do nothing' }
]

/**
 * Three questions, and the third one is the product. It does not just pick three winners: it produces the whole
 * order, and the seven that lose settle onto the perch where they stay useful.
 */
export const Interview = () => {
  const { trip } = useTrip()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [shape, setShape] = useState('group')
  const [mood, setMood] = useState('see')
  const [picked, setPicked] = useState<string[]>([])
  const settling = picked.length === 3

  return (
    <main className="interview">
      <header className="interview-head">
        <p className="t-label interview-count">Question {step + 1} Of 3</p>
        <div className="interview-rule" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} data-done={i <= step} />
          ))}
        </div>
      </header>

      {step === 0 && (
        <section className="ask">
          <h1 className="t-display">Who Is Coming?</h1>
          <p className="t-specimen ask-note">This is the only question that changes the shape of the rest.</p>
          <ul className="ask-options">
            {SHAPES.map((o) => (
              <li key={o.id}>
                <button type="button" className="ask-option" data-on={shape === o.id} onClick={() => setShape(o.id)}>
                  <span className="t-name">{o.label}</span>
                  <span className="t-specimen">{o.note}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="ask-next t-label" onClick={() => setStep(1)}>
            Next
          </button>
        </section>
      )}

      {step === 1 && (
        <section className="ask">
          <h1 className="t-display">What Is This Trip For?</h1>
          <p className="t-specimen ask-note">
            Perch proposes from this. Nothing here is a filter you have to maintain.
          </p>
          <ul className="ask-options">
            {MOODS.map((o) => (
              <li key={o.id}>
                <button type="button" className="ask-option" data-on={mood === o.id} onClick={() => setMood(o.id)}>
                  <span className="t-name">{o.label}</span>
                  <span className="t-specimen">{o.note}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="ask-next t-label" onClick={() => setStep(2)}>
            Next
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="ask">
          <h1 className="t-display">Pick Three You&rsquo;d Hate To Miss</h1>
          <p className="t-specimen ask-note">
            The other seven are not thrown away. They settle onto the perch, in this order, and that is what repairs the
            trip later.
          </p>

          <ul className="cards">
            {interviewPool.map((id, i) => {
              const option = trip.options[id]
              if (!option) return null
              const on = picked.includes(id)
              const benched = settling && !on

              return (
                <li key={id} className="card-item" data-benched={benched} style={{ animationDelay: `${i * 40}ms` }}>
                  <button
                    type="button"
                    className="card"
                    data-on={on}
                    disabled={settling && !on}
                    onClick={() => setPicked((p) => (on ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : p))}
                  >
                    <span className="card-rank t-label">{on ? picked.indexOf(id) + 1 : ''}</span>
                    <span className="t-name">{option.name}</span>
                    <span className="t-specimen">
                      {duration(option.dwellMin)} &middot; {money(option.costRM)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <button type="button" className="ask-next t-label" disabled={!settling} onClick={() => navigate('/')}>
            {settling ? 'Perch Proposes The Trip' : `Pick ${3 - picked.length} More`}
          </button>

          <p className="t-specimen interview-honest">
            This prototype always proposes the same trip, seeded from {interviewPicks.length} picks. The ranking your
            taps produce is real and the repair uses it.
          </p>
        </section>
      )}
    </main>
  )
}
