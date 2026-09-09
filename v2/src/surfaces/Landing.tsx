import { Link } from 'react-router-dom'
import { base } from '../data/reels'
import './Landing.css'

/* Reduced motion is answered by not fetching the clip at all rather than by pausing it: a 1.4 MB video downloaded
   and held still is the cost without the effect. Read once at render, because this is a client-only app and the
   setting does not change mid-visit in any way this page needs to follow. */
const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * One screen, no scroll. `DESIGN.md`: the hero carries no caption, because the display line either says it or it was
 * not worth saying. Everything explanatory on this page is a link to somewhere it can be said properly.
 */
export const Landing = () => (
  <main className="land">
    {/* The ground, not a banner: the clip runs behind the whole screen with a paper veil over it, so the page still
        reads as paper and the title still holds its contrast over any frame. WebM first because it is a third
        smaller and every browser that can play it prefers it; the MP4 is what Safari takes. */}
    <div className="land-film" aria-hidden="true">
      {still ? (
        <img className="land-frame" src={`${base}hero.jpg`} alt="" />
      ) : (
        <video className="land-frame" poster={`${base}hero.jpg`} autoPlay loop muted playsInline preload="metadata">
          <source src={`${base}hero.webm`} type="video/webm" />
          <source src={`${base}hero.mp4`} type="video/mp4" />
        </video>
      )}
      <div className="land-veil" />
    </div>

    <header className="land-head">
      <img src="/assets/mark.svg" alt="" width="36" height="36" />
      <span className="land-mark t-label">Perch</span>
    </header>

    <div className="land-body">
      {/* A label mounted on the page rather than text laid over a picture. It is what lets the veil come off the
          clip: the type carries its own ground, so its contrast is a property of the plate and not of whichever
          frame happens to be playing. */}
      <div className="land-plate">
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
      </div>

      {/* Three because the product is three surfaces, not because three sits nicely. `PRODUCT.md`: one interaction,
          three surfaces, and the feature list is deliberately this short. */}
      <dl className="land-facts land-band">
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
