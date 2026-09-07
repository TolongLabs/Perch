export const duration = (min: number): string => {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m}`
}

export const money = (rm: number): string => (rm === 0 ? 'Free' : `RM ${rm}`)

export const travel = (min: number): string => (min <= 10 ? 'In town' : `${min} min out`)

export const dayLabel = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
