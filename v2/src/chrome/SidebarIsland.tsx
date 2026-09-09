import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Compass,
  Layers,
  ListChecks,
  Map as MapIcon,
  PanelLeft,
  Pencil
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTrip } from '../state'

const OPEN_AFTER = 120
const CLOSE_AFTER = 200

/**
 * `to` is what the rail matches the current path against; `href` is where the row actually goes when it differs.
 * Only one row needs the split, and it needs it because a query string is not part of `pathname`: matching on
 * `/new?edit` would never light the row that leads to it.
 */
type Item = { to: string; href?: string; label: string; Icon: typeof MapIcon }

export const navItems = (tripId: string): Item[] => [
  { to: '/trips', label: 'Your Trips', Icon: MapIcon },
  // Not New Plan. The prototype holds one trip and this form has no create path: `start()` sets the dates on the
  // trip that already exists, so the row said one thing and did another. It is the dashboard's Edit Trip control
  // and it goes where that control goes.
  { to: '/new', href: '/new?edit', label: 'Edit Trip', Icon: Pencil },
  { to: `/t/${tripId}/swipe`, label: 'The Deck', Icon: Layers },
  { to: `/t/${tripId}/votes`, label: 'The Tally', Icon: BarChart3 },
  { to: '/desk', label: 'The Desk', Icon: CalendarDays },
  { to: '/desk/before-we-go', label: 'Before We Go', Icon: ListChecks },
  { to: `/t/${tripId}`, label: 'The Book', Icon: BookOpen },
  // Guidance rather than a second book: `BookOpen` is taken, and two open books at 20px are one shape.
  { to: `/t/${tripId}/handbook`, label: 'The Handbook', Icon: Compass }
]

/**
 * Longest prefix wins, so /desk/before-we-go lights its own row rather than The Desk's, and /t/:id, which is a
 * prefix of both the deck and the votes paths, does not light the Book on every trip route.
 */
export const currentItem = (items: Item[], pathname: string): Item | undefined =>
  items.filter((i) => pathname === i.to || pathname.startsWith(`${i.to}/`)).sort((a, b) => b.to.length - a.to.length)[0]

/**
 * A nav rail that floats clear of all four edges rather than sitting against them, so it reads as an object on the
 * page rather than a border of it. Collapsed it is icons; expanded it is icons and labels. Three things open it,
 * and they are deliberately different: a pointer dwelling on it, a keyboard arriving at it, and a pin for touch,
 * where neither of the first two exists.
 */
export const SidebarIsland = ({ expandedChanged }: { expandedChanged: (open: boolean) => void }) => {
  const { trip } = useTrip()
  const { pathname } = useLocation()
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  // One timer for both directions. Two would race: leaving and re-entering inside the close delay would leave a
  // pending close that fires after the reopen, and the rail would shut under a pointer resting on it.
  const timer = useRef<number | null>(null)

  const open = pinned || hovered || focused

  useEffect(() => {
    expandedChanged(open)
  }, [open, expandedChanged])

  useEffect(() => () => window.clearTimeout(timer.current ?? undefined), [])

  const schedule = (fn: () => void, delay: number) => {
    window.clearTimeout(timer.current ?? undefined)
    timer.current = window.setTimeout(fn, delay)
  }

  const items = navItems(trip.id)
  const current = currentItem(items, pathname)

  return (
    <nav
      className="island island-rail"
      data-open={open}
      aria-label="Perch"
      onPointerEnter={(e) => {
        if (e.pointerType === 'touch') return
        schedule(() => setHovered(true), OPEN_AFTER)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'touch') return
        schedule(() => setHovered(false), CLOSE_AFTER)
      }}
      // Only a keyboard arrival should hold the rail open. A mouse click also focuses the link it hit, and without
      // this test the rail would stay expanded after the click that navigated away from it.
      onFocus={(e) => setFocused(e.target.matches(':focus-visible'))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}
    >
      {/* Not a link. Every other row in the rail is somewhere you can go, and a mark that navigated to the landing
          page would take a signed-in reader out of the product to read marketing copy. It is the rail's head, so
          it takes no tab stop ahead of the seven destinations under it. */}
      {/* The brand row goes home, which is what a wordmark in a top-left corner has meant since the web had corners.
          It was the one mark on the rail that looked like a control and was not one. */}
      <Link className="rail-head" to="/" aria-label="Perch, the landing page">
        <img className="rail-mark" data-theme="light" src="/assets/mark.svg" alt="" width="24" height="24" />
        <img className="rail-mark" data-theme="dark" src="/assets/mark-dark.svg" alt="" width="24" height="24" />
        <span className="rail-name" aria-hidden="true">
          Perch
        </span>
      </Link>

      <ul className="rail-list">
        {items.map(({ to, href, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={href ?? to}
              className="rail-item"
              data-current={to === current?.to}
              aria-current={to === current?.to ? 'page' : undefined}
            >
              <Icon className="rail-icon" size={20} strokeWidth={1.75} aria-hidden="true" />
              <span className="rail-label t-label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="rail-pin"
        aria-pressed={pinned}
        onClick={() => setPinned((p) => !p)}
        title={pinned ? 'Unpin the rail' : 'Pin the rail open'}
      >
        <PanelLeft className="rail-icon" size={20} strokeWidth={1.75} aria-hidden="true" />
        <span className="rail-label t-label">{pinned ? 'Unpin' : 'Pin Open'}</span>
      </button>
    </nav>
  )
}

/** The same items along the bottom below the tablet breakpoint. A 64px rail on a 390px screen spends a sixth of
 *  the width on navigation, so the rail is replaced there rather than shrunk. */
export const BottomDock = () => {
  const { trip } = useTrip()
  const { pathname } = useLocation()
  const items = navItems(trip.id)
  const current = currentItem(items, pathname)

  return (
    <nav className="island island-dock" aria-label="Perch">
      <ul className="dock-list">
        {items.map(({ to, href, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={href ?? to}
              className="dock-item"
              data-action={to === '/new'}
              data-current={to === current?.to}
              aria-current={to === current?.to ? 'page' : undefined}
              aria-label={label}
            >
              <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
