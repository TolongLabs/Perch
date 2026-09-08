import { Link } from 'react-router-dom'

/**
 * One footer, two mountings. The app shell fixes it behind the scrolling page and uncovers it at the end; the landing
 * puts it in flow, because a fixed footer under a page that does not scroll would never be revealed. The content and
 * the surface are the same in both, which is the whole point of sharing it.
 */
export const Footer = () => (
  <div className="foot-inner">
    <Link to="/" className="foot-brand" aria-label="Perch home">
      <img src="/assets/mark.svg" alt="" width="28" height="28" />
      <span className="foot-name">Perch</span>
    </Link>

    <p className="t-specimen foot-line">Everything you didn&rsquo;t choose is still ranked, and still waiting.</p>

    <div className="foot-links">
      <Link to="/" className="foot-link t-label">
        Landing
      </Link>
      <Link to="/trips" className="foot-link t-label">
        Your Trips
      </Link>
      <a className="foot-link t-label" href="/v1/" target="_blank" rel="noreferrer">
        v1, The Mockup
      </a>
      <a className="foot-link t-label" href="https://github.com/TolongLabs/Perch" target="_blank" rel="noreferrer">
        TolongLabs
      </a>
    </div>
  </div>
)
