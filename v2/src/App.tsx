import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Shell } from './chrome/Shell'
import { isJoiner } from './lib/joiner'
import { applyTheme, readTheme } from './lib/theme'
import { TripProvider } from './state'
import { BeforeWeGo } from './surfaces/BeforeWeGo'
import { Book } from './surfaces/Book'
import { Dashboard } from './surfaces/Dashboard'
import { Deck } from './surfaces/Deck'
import { Desk } from './surfaces/Desk'
import { Handbook } from './surfaces/Handbook'
import { Landing } from './surfaces/Landing'
import { Onboarding } from './surfaces/Onboarding'
import { SignIn } from './surfaces/SignIn'
import { Tally } from './surfaces/Tally'

/**
 * A route change is a new surface, so it starts at the top. Without this the deck opens already scrolled past its
 * heading, because Start Swiping sits at the bottom of onboarding and the browser keeps the offset across a push.
 *
 * `pathname` is the effect's trigger rather than an input to its body, which is a shape the dependency rule below
 * does not model: it sees a dependency the body never reads and calls it redundant. Removing it is what would break.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()
  // biome-ignore lint/correctness/useExhaustiveDependencies: the route change is the trigger; see above
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 * Seeds the stored theme on the document element at mount, once, before any route paints. The toggle-bearing
 * surfaces (the landing and the top bar) each apply their own state, but a full load that lands on a route with
 * neither - `/sign-in` is the one - would otherwise never set the attribute and fall back to the CSS default,
 * dropping a stored dark choice. Client-side transitions need no help: `applyTheme` writes the attribute with no
 * cleanup, so a choice made on one surface survives the push to the next.
 */
const ThemeSeed = () => {
  useEffect(() => {
    applyTheme(readTheme())
  }, [])
  return null
}

export const App = () => (
  <TripProvider>
    <BrowserRouter>
      <ThemeSeed />
      <ScrollToTop />
      <Routes>
        {/* The landing folds over the footer like every other surface, so nothing of it shows until the reader
            scrolls to the end. */}
        <Route
          path="/"
          element={
            <Shell>
              <Landing />
            </Shell>
          }
        />

        {/* Auth is the one surface with no footer. There is nowhere to go from here but in. */}
        <Route path="/sign-in" element={<SignIn />} />

        <Route
          path="/trips"
          element={
            <Shell islands>
              <Dashboard />
            </Shell>
          }
        />
        <Route
          path="/new"
          element={
            <Shell islands>
              <Onboarding />
            </Shell>
          }
        />
        <Route
          path="/desk"
          element={
            <Shell islands>
              <Desk />
            </Shell>
          }
        />
        {/* The invite link is the swipe link. A joiner lands here directly, with no sign in and no onboarding. */}
        <Route
          path="/desk/before-we-go"
          element={
            <Shell islands>
              <BeforeWeGo />
            </Shell>
          }
        />

        <Route
          path="/t/:tripId/swipe"
          element={
            <Shell islands={!isJoiner()}>
              <Deck />
            </Shell>
          }
        />

        <Route
          path="/t/:tripId/votes"
          element={
            <Shell islands>
              <Tally />
            </Shell>
          }
        />

        {/* Beside the Book, and the second thing the checklist unlocks. Longer than `/t/:tripId`, so the rail's
            longest-prefix rule lights this row rather than the Book's. */}
        <Route
          path="/t/:tripId/handbook"
          element={
            <Shell islands>
              <Handbook />
            </Shell>
          }
        />

        <Route
          path="/t/:tripId"
          element={
            <Shell islands>
              <Book />
            </Shell>
          }
        />

        <Route
          path="*"
          element={
            <Shell>
              <Landing />
            </Shell>
          }
        />
      </Routes>
    </BrowserRouter>
  </TripProvider>
)
