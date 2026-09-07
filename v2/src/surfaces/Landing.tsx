import { Link } from 'react-router-dom'
import './Landing.css'

/**
 * One screen, no scroll. `DESIGN.md`: the hero carries no caption, because the display line either says it or it was
 * not worth saying. Everything explanatory on this page is a link to somewhere it can be said properly.
 */
export const Landing = () => (
  <main className="land">
    <header className="land-head">
      <img src="/assets/mark.svg" alt="" width="36" height="36" />
      <span className="land-mark t-label">Perch</span>
    </header>

    <div className="land-body">
      <p className="t-label land-eyebrow">A Trip Planner That Keeps What You Did Not Choose</p>

      <h1 className="t-display land-title">
        The itinerary knows what can break it, and repairs itself from options the group already approved.
      </h1>

      <div className="land-actions">
        <Link className="land-go t-label" to="/sign-in">
          Start Planning
        </Link>
        <Link className="land-alt t-label" to="/t/yogya-nov-2026">
          Open A Shared Book
        </Link>
      </div>

      <dl className="land-facts">
        <div>
          <dt className="t-label">The Mechanic</dt>
          <dd className="t-specimen">Choosing makes a trip and a ranked bench at the same time</dd>
        </div>
        <div>
          <dt className="t-label">The Repair</dt>
          <dd className="t-specimen">A closed stop is replaced without anyone being asked</dd>
        </div>
        <div>
          <dt className="t-label">The Cost</dt>
          <dd className="t-specimen">Every change priced in travel and money, never one alone</dd>
        </div>
      </dl>
    </div>

    <div className="land-strip" aria-hidden="true">
      <span data-day="1" />
      <span data-day="2" />
      <span data-day="3" />
      <span data-day="4" />
      <span data-day="5" />
    </div>
  </main>
)
