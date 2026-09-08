import type { Place } from '../data/types'

/**
 * A field-guide plate, drawn rather than photographed. `DESIGN.md` argues the drawn specimen over the destination hero
 * shot, and a flat vector holds at any size with no asset pipeline behind it.
 *
 * The drawing is the day itself: the stops plotted from their real coordinates and joined in the order they are
 * visited, so each plate is the shape of that day and no two are alike. A decorative plate would have been a device
 * carrying no information, which is the thing `AGENTS.md` rules out.
 */
export const Plate = ({ day, title, stops }: { day: number; title: string; stops: Place[] }) => {
  const W = 400
  const H = 260
  const PAD = 46

  const lats = stops.map((s) => s.lat)
  const lngs = stops.map((s) => s.lng)
  // A single stop, or two stops on the same line, would divide by zero. The floor keeps the drawing centred instead.
  const spanLat = Math.max(...lats) - Math.min(...lats) || 0.01
  const spanLng = Math.max(...lngs) - Math.min(...lngs) || 0.01
  const minLat = Math.min(...lats)
  const minLng = Math.min(...lngs)

  const points = stops.map((s) => ({
    // Latitude runs north, the viewBox runs down, so y is inverted.
    x: PAD + ((s.lng - minLng) / spanLng) * (W - PAD * 2),
    y: H - PAD - ((s.lat - minLat) / spanLat) * (H - PAD * 2),
    name: s.name
  }))

  const line = points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')

  return (
    <figure className="plate-figure">
      <svg
        className="plate-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Day ${day}: ${stops.map((s) => s.name).join(', then ')}`}
      >
        <rect width={W} height={H} fill="var(--ground)" />

        {/* Contours, the field-guide ground the social card already uses. Fixed, so the route reads over them. */}
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx={W / 2}
            cy={H / 2}
            rx={72 + i * 44}
            ry={46 + i * 28}
            fill="none"
            stroke="var(--tint)"
            strokeWidth="1"
            opacity={0.16 - i * 0.03}
          />
        ))}

        {points.length > 1 && (
          <path d={`M ${line}`} fill="none" stroke="var(--tint)" strokeWidth="3" strokeLinecap="round" />
        )}

        {points.map((p) => (
          <g key={p.name}>
            <circle cx={p.x} cy={p.y} r="7" fill="var(--plate)" />
            <circle cx={p.x} cy={p.y} r="7" fill="none" stroke="var(--tint)" strokeWidth="3" />
          </g>
        ))}
      </svg>
      <figcaption className="t-specimen plate-caption">
        Plate {day} &middot; {title}
      </figcaption>
    </figure>
  )
}
