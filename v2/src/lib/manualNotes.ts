import type { ManualNote, ManualSection, Trip } from '../data/types'

export const MAX_NOTE_LENGTH = 1000
export const MAX_NOTE_TITLE_LENGTH = 80

export const withManualNote = (
  trip: Trip,
  section: ManualSection,
  text: string,
  id: string,
  title = 'Trip Note'
): Trip => {
  const clean = text.trim()
  const cleanTitle = title.trim()
  if (
    clean.length === 0 ||
    clean.length > MAX_NOTE_LENGTH ||
    cleanTitle.length === 0 ||
    cleanTitle.length > MAX_NOTE_TITLE_LENGTH
  )
    return trip
  const notes: ManualNote[] = trip.manualNotes[section] ?? []
  if (notes.some((n) => n.id === id)) return trip
  const note: ManualNote = { id, title: cleanTitle, text: clean }
  const takeCare: ManualNote[] = section === 'takeCare' ? [...notes, note] : [...(trip.manualNotes.takeCare ?? [])]
  const packing: ManualNote[] = section === 'packing' ? [...notes, note] : [...(trip.manualNotes.packing ?? [])]
  return { ...trip, manualNotes: { takeCare, packing } }
}

export const withoutManualNote = (trip: Trip, section: ManualSection, id: string): Trip => {
  const notes: ManualNote[] = trip.manualNotes[section] ?? []
  const next = notes.filter((n) => n.id !== id)
  if (next.length === notes.length) return trip
  const takeCare: ManualNote[] = section === 'takeCare' ? next : [...(trip.manualNotes.takeCare ?? [])]
  const packing: ManualNote[] = section === 'packing' ? next : [...(trip.manualNotes.packing ?? [])]
  return { ...trip, manualNotes: { takeCare, packing } }
}
