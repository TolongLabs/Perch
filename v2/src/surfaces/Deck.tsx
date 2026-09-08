import { type AnimationEvent, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReelCard } from '../components/ReelCard'
import { Heading } from '../components/Ui'
import { type Swipe, useSwipeGesture } from '../lib/useSwipeGesture'
import { useTrip } from '../state'
import './Deck.css'

/** Three is enough for the stack to read as a deck; the fourth would never be seen. */
const VISIBLE = 3

export const Deck = () => {
  const navigate = useNavigate()
  const { trip, swipe } = useTrip()

  // The prototype has one identity and it is the owner's, so her swipe is the one the tally weights at 1.5.
  const me = trip.ownerId

  // Fixed at mount. Recomputing as votes land would shrink the queue under the swiper's finger and make the count lie.
  const [queue] = useState(() => Object.values(trip.options).filter((p) => trip.votes[me]?.[p.id] == null))
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState<Swipe | null>(null)

  const commit = useCallback((s: Swipe) => setLeaving((current) => current ?? s), [])

  // The card that left tells us when it has gone, so the queue advances on the animation rather than on a timer that
  // has to guess its length. `prefers-reduced-motion` collapses the animation to nothing and this still fires.
  const gone = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || !leaving) return
    const place = queue[index]
    if (place) swipe(me, place.id, leaving === 'keep')
    setIndex((i) => i + 1)
    setLeaving(null)
  }

  const { dx, dragging, progress, handlers } = useSwipeGesture(commit, leaving === null)
  const rest = queue.slice(index, index + VISIBLE)

  if (rest.length === 0) {
    return (
      <main className="deck">
        <section className="deck-done">
          <Heading as="h1">Every Reel Is Swiped</Heading>
          <p className="t-specimen">Your votes are in. See how the group is leaning.</p>
          <button type="button" className="deck-go t-label" onClick={() => navigate(`/t/${trip.id}/votes`)}>
            See The Tally
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="deck">
      <header className="deck-head">
        <Heading as="h1">The Deck</Heading>
        <p className="deck-count">
          Reel {index + 1} Of {queue.length}
        </p>
      </header>

      <div className="deck-stack">
        {rest.map((place, depth) => {
          const top = depth === 0
          return (
            <div
              key={place.id}
              className="deck-card"
              data-depth={depth}
              data-leaving={top && leaving ? leaving : undefined}
              style={
                top && dragging
                  ? { transform: `translateX(${dx}px) rotate(${dx * 0.03}deg)`, opacity: 1 - progress * 0.35 }
                  : undefined
              }
              onAnimationEnd={top ? gone : undefined}
              {...(top ? handlers : {})}
            >
              {/* Only the top two decode video. The rest hold their poster frame, so a 24-card deck stays flat. */}
              <ReelCard place={place} live={depth < 2} />
            </div>
          )
        })}
      </div>

      <div className="deck-acts">
        <button type="button" className="deck-pass t-label" onClick={() => commit('pass')}>
          Pass
        </button>
        <button type="button" className="deck-keep t-label" onClick={() => commit('keep')}>
          Keep
        </button>
      </div>
    </main>
  )
}
