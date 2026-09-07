import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TripProvider } from './state'
import { Book } from './surfaces/Book'
import { Dashboard } from './surfaces/Dashboard'
import { Desk } from './surfaces/Desk'
import { Interview } from './surfaces/Interview'
import { NewPlan } from './surfaces/NewPlan'

export const App = () => (
  <TripProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewPlan />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/desk" element={<Desk />} />
        <Route path="/t/:tripId" element={<Book />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </TripProvider>
)
