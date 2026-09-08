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
      <p className="t-label land-eyebrow">A Trip Planner The Group Actually Answers</p>

      <h1 className="t-display land-title">
        Everyone swipes on reels. What wins lands on the calendar, and the day tells you when it stops working.
      </h1>

      <div className="land-actions">
        <Link className="land-go t-label" to="/sign-in">
          Start Planning
        </Link>
        <Link className="land-alt t-label" to="/t/tokyo-nov-2026">
          Open A Shared Book
        </Link>
      </div>

      {/* Three because the product is three surfaces, not because three sits nicely. `PRODUCT.md`: one interaction,
          three surfaces, and the feature list is deliberately this short. */}
      <dl className="land-facts">
        <div>
          <dt className="t-label">The Deck</dt>
          <dd className="t-specimen">Reels of real places, one thumb, and a tally the whole group can see</dd>
        </div>
        <div>
          <dt className="t-label">The Desk</dt>
          <dd className="t-specimen">Three slots a day. Drag what won, and each day gets ordered for you</dd>
        </div>
        <div>
          <dt className="t-label">The Book</dt>
          <dd className="t-specimen">The settled trip, printed as a field guide you keep</dd>
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
