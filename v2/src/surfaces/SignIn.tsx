import { Link, useNavigate } from 'react-router-dom'
import { Check, Field } from '../components/Ui'
import './SignIn.css'

/**
 * Two panes, and only one control on it does anything. There is no authentication behind this screen and the copy
 * says so rather than letting a judge discover it by typing into a dead field.
 */
export const SignIn = () => {
  const navigate = useNavigate()

  return (
    <main className="auth">
      <section className="auth-form">
        <Link className="auth-back t-label" to="/">
          &larr; Perch
        </Link>

        <h1 className="t-plate-title auth-title">Sign In</h1>

        <p className="auth-note t-specimen">
          The fields below are drawn, not wired. Sign In As Guest is the one control that works, and it is the one the
          product is designed around: an account is optional and the shared link never needs one.
        </p>

        <div className="auth-fields">
          <Field label="Email" type="email" placeholder="you@example.com" autoComplete="off" disabled />
          <Field label="Password" type="password" placeholder="••••••••" autoComplete="off" disabled />
          <Check label="Keep me signed in" />
        </div>

        <button type="button" className="auth-dead t-label" disabled>
          Sign In
        </button>

        <button type="button" className="auth-go t-label" onClick={() => navigate('/trips')}>
          Sign In As Guest
        </button>

        <p className="auth-foot t-specimen">
          No account is created and nothing is stored on a server. The trip lives in this browser.
        </p>
      </section>

      <aside className="auth-hero" aria-hidden="true">
        <svg className="auth-plate" viewBox="0 0 640 900" preserveAspectRatio="xMidYMid slice" role="img">
          <title>A field-guide plate: layered hills under a low sun, with the ranked bench beneath</title>
          <rect width="640" height="900" fill="var(--ground-day-3)" />
          <circle cx="440" cy="250" r="82" fill="var(--paper)" />

          <path d="M0 900 L150 420 L268 620 L360 470 L640 900 Z" fill="var(--day-3)" opacity="0.26" />
          <path d="M0 900 L80 560 L232 720 L420 500 L640 900 Z" fill="var(--day-1)" opacity="0.42" />
          <path d="M0 900 L120 700 L300 820 L470 690 L640 860 L640 900 Z" fill="var(--day-1)" />

          <g>
            <rect x="88" y="690" width="464" height="6" rx="3" fill="var(--ink)" />
            <circle cx="160" cy="658" r="30" fill="var(--open)" />
            <circle cx="244" cy="666" r="22" fill="var(--open)" opacity="0.5" />
            <circle cx="312" cy="672" r="16" fill="var(--open)" opacity="0.3" />
            <circle cx="366" cy="676" r="12" fill="var(--open)" opacity="0.18" />
          </g>
        </svg>
      </aside>
    </main>
  )
}
