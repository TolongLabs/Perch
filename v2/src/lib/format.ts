import type { Place } from '../data/types'

export const duration = (min: number): string => {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m}`
}

export const money = (rm: number): string => (rm === 0 ? 'Free' : `RM ${rm}`)

/** The specimen line for a place: ringgit first, yen beside it, so the gate price is read in the money you hold. */
export const price = (place: Pick<Place, 'costRM' | 'yen'>): string =>
  place.costRM === 0 ? 'Free' : `RM ${place.costRM} · ¥${place.yen.toLocaleString('en')}`

export const dayLabel = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
