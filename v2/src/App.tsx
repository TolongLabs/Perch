import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Shell } from './chrome/Shell'
import { isJoiner } from './lib/joiner'
import { TripProvider } from './state'
import { BeforeWeGo } from './surfaces/BeforeWeGo'
import { Book } from './surfaces/Book'
import { Dashboard } from './surfaces/Dashboard'
import { Deck } from './surfaces/Deck'
import { Desk } from './surfaces/Desk'
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

export const App = () => (
  <TripProvider>
    <BrowserRouter>
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
