import { Link } from 'react-router-dom'
import { HeroFilm } from '../components/HeroFilm'
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
    {/* The ground, not a banner: the clips run behind the whole screen with paper fading in off its edges, so the
        page still reads as paper and every line still holds its contrast over any frame. */}
    <div className="land-film" aria-hidden="true">
      <HeroFilm still={still} />
      <div className="land-veil" />
    </div>

    {/* The way in sits in the top row rather than under the argument: a reader who already knows what this is should
        not have to read the line again to find the door. It is still the page's one solid button. */}
    <header className="land-head">
      <img src="/assets/mark.svg" alt="" width="36" height="36" />
      <span className="land-mark t-label">Perch</span>
      <Link className="land-go t-label" to="/sign-in">
        Start Planning
      </Link>
    </header>

    <div className="land-body">
      {/* No plate. Set on a paper ground the type read as a card laid on a photograph; the ground is a fade off the
          page's own edge instead, so the picture is one surface with the paper rather than two stacked ones. */}
      <div className="land-plate">
        <p className="t-label land-eyebrow">A Trip Planner The Group Actually Answers</p>

        <h1 className="t-display land-title">Swipe together. Land the trip.</h1>
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
