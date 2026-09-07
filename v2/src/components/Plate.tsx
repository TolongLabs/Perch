/**
 * A field-guide plate, drawn rather than photographed. `DESIGN.md` argues the drawn specimen over the destination
 * hero shot, and a flat vector holds at any size with no asset pipeline behind it.
 */
export const Plate = ({ day, title }: { day: number; title: string }) => {
  const peak = 120 + ((day * 37) % 90)
  const sun = 96 + ((day * 61) % 200)

  return (
    <figure className="plate-figure">
      <svg className="plate-svg" viewBox="0 0 400 260" role="img" aria-label={`Plate for ${title}`}>
        <rect width="400" height="260" fill="var(--ground)" />
        <circle cx={sun} cy="70" r="26" fill="var(--paper)" />

        <path
          d={`M0 260 L${peak} 96 L${peak + 74} 176 L${peak + 128} 118 L400 260 Z`}
          fill="var(--tint)"
          opacity="0.28"
        />
        <path
          d={`M0 260 L${peak - 60} 150 L${peak + 26} 208 L${peak + 150} 140 L400 260 Z`}
          fill="var(--tint)"
          opacity="0.5"
        />
        <path d="M0 260 L70 206 L168 244 L262 202 L400 250 L400 260 Z" fill="var(--tint)" />
      </svg>
      <figcaption className="t-specimen plate-caption">
        Plate {day} &middot; {title}
      </figcaption>
    </figure>
  )
}
