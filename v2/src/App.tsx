import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FlatShell, Shell } from './chrome/Shell'
import { TripProvider } from './state'
import { Book } from './surfaces/Book'
import { Dashboard } from './surfaces/Dashboard'
import { Desk } from './surfaces/Desk'
import { Landing } from './surfaces/Landing'
import { NewPlan } from './surfaces/NewPlan'
import { SignIn } from './surfaces/SignIn'

export const App = () => (
  <TripProvider>
    <BrowserRouter>
      <Routes>
        {/* The landing does not scroll, so it stands the footer on the floor rather than being uncovered by one. */}
        <Route
          path="/"
          element={
            <FlatShell>
              <Landing />
            </FlatShell>
          }
        />

        {/* Auth is the one surface with no footer. There is nowhere to go from here but in. */}
        <Route path="/sign-in" element={<SignIn />} />

        <Route
          path="/trips"
          element={
            <Shell>
              <Dashboard />
            </Shell>
          }
        />
        <Route
          path="/new"
          element={
            <Shell>
              <NewPlan />
            </Shell>
          }
        />
        <Route
          path="/desk"
          element={
            <Shell>
              <Desk />
            </Shell>
          }
        />
        <Route
          path="/t/:tripId"
          element={
            <Shell>
              <Book />
            </Shell>
          }
        />

        <Route
          path="*"
          element={
            <FlatShell>
              <Landing />
            </FlatShell>
          }
        />
      </Routes>
    </BrowserRouter>
  </TripProvider>
)
