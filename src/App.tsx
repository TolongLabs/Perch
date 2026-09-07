import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TripProvider } from './state'
import { Book } from './surfaces/Book'
import { Desk } from './surfaces/Desk'
import { Interview } from './surfaces/Interview'

export const App = () => (
  <TripProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Desk />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/t/:tripId" element={<Book />} />
        <Route path="*" element={<Desk />} />
      </Routes>
    </BrowserRouter>
  </TripProvider>
)
