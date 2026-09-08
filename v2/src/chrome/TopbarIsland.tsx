import { Bell, Moon, Sun, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { noticesFor } from '../lib/notices'
import { applyTheme, readTheme, type Theme } from '../lib/theme'
import { useTrip } from '../state'

type Panel = 'none' | 'notices' | 'account'

/**
 * One surface holding three controls, not three floating buttons: the cluster is the object, and both panels hang
 * off its right edge rather than off the button that opened them, so they share one edge and one gap however wide
 * they are. Only one is ever open, because two panels overlapping in the same corner is a layout accident.
 */
export const TopbarIsland = () => {
  const { trip } = useTrip()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [panel, setPanel] = useState<Panel>('none')
  // Unread until the panel has been opened once. Kept in the component rather than in storage: this is a session's
  // worth of news, and a demo that has been reloaded should show it again.
  const [seen, setSeen] = useState(false)
  const cluster = useRef<HTMLDivElement>(null)

  const notices = noticesFor(trip)
  const unread = seen ? 0 : notices.length

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (panel === 'none') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanel('none')
    }
    const onDown = (e: PointerEvent) => {
      if (!cluster.current?.contains(e.target as Node)) setPanel('none')
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [panel])

  const toggle = (which: Exclude<Panel, 'none'>) => {
    setPanel((p) => (p === which ? 'none' : which))
    if (which === 'notices') setSeen(true)
  }

  const owner = trip.party.find((p) => p.id === trip.ownerId)

  return (
    <div className="island island-top" ref={cluster}>
      <div className="top-cluster">
        <button
          type="button"
          className="top-control"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label={theme === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'}
        >
          {theme === 'dark' ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
        </button>

        <button
          type="button"
          className="top-control"
          onClick={() => toggle('notices')}
          aria-expanded={panel === 'notices'}
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        >
          <Bell size={18} strokeWidth={1.75} />
          {unread > 0 && <span className="top-badge">{unread}</span>}
        </button>

        <button
          type="button"
          className="top-control"
          onClick={() => toggle('account')}
          aria-expanded={panel === 'account'}
          aria-label="Account"
        >
          <User size={18} strokeWidth={1.75} />
        </button>
      </div>

      {panel === 'notices' && (
        <div className="top-panel">
          <p className="t-label top-panel-head">Notifications</p>
          {notices.length === 0 ? (
            <p className="t-specimen top-empty">Nothing yet. It fills as the group swipes.</p>
          ) : (
            <ul className="top-notices">
              {notices.map((n) => (
                <li key={n.id} className="t-specimen" data-kind={n.kind}>
                  {n.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {panel === 'account' && (
        <div className="top-panel">
          <p className="top-who">{owner?.name ?? 'Owner'}</p>
          <p className="t-specimen top-role">Owner</p>
          <button type="button" className="top-out t-label" onClick={() => navigate('/sign-in')}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
