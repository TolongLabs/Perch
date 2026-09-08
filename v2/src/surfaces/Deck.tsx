import { ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { type AnimationEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReelCard } from '../components/ReelCard'
import { Heading } from '../components/Ui'
import { type Swipe, useSwipeGesture } from '../lib/useSwipeGesture'
import { useTrip } from '../state'
import './Deck.css'

/** Three is enough for the stack to read as a deck; the fourth would never be seen. */
const VISIBLE = 3

/** How long the edge glow holds. Long enough to register after the card has gone, short enough not to queue. */
const FLASH_MS = 520

export const Deck = () => {
  const navigate = useNavigate()
  const { trip, swipe } = useTrip()

  // The prototype has one identity and it is the owner's, so her swipe is the one the tally weights at 1.5.
  const me = trip.ownerId

  // Fixed at mount. Recomputing as votes land would shrink the queue under the swiper's finger and make the count lie.
  const [queue] = useState(() => Object.values(trip.options).filter((p) => trip.votes[me]?.[p.id] == null))
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState<Swipe | null>(null)
  const [flash, setFlash] = useState<Swipe | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  /**
   * The edge glow runs on its own clock rather than on the card's exit. Under reduced motion that exit collapses to
   * nothing, and feedback tied to it would be gone before it was seen; here the answer stays on screen for the same
   * window whether or not it animated getting there.
   */
  const commit = useCallback((s: Swipe) => {
    setLeaving((current) => current ?? s)
    setFlash(s)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(null), FLASH_MS)
  }, [])

  useEffect(() => () => clearTimeout(flashTimer.current), [])

  // The card that left tells us when it has gone, so the queue advances on the animation rather than on a timer that
  // has to guess its length. `prefers-reduced-motion` collapses the animation to nothing and this still fires.
  const gone = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || !leaving) return
    const place = queue[index]
    if (place) swipe(me, place.id, leaving === 'must' ? 'must' : leaving === 'keep')
    setIndex((i) => i + 1)
    setLeaving(null)
  }

  const { dx, dy, dragging, heading, progress, handlers } = useSwipeGesture(commit, leaving === null)
  const rest = queue.slice(index, index + VISIBLE)

  // Derived, not remembered: a Must Go is whichever place this member currently holds one on, so moving it moves
  // this line with no second copy of the fact to fall out of step.
  const mustGo = Object.values(trip.options).find((p) => trip.votes[me]?.[p.id] === 'must')

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
        {/* Behind the cards, so the answer reads as light off the edge the hand threw the card at rather than as a
            panel laid over the reel. */}
        <div className="deck-flash" data-flash={flash ?? undefined} aria-hidden="true" />

        {/* On the reel rather than above it. The gold answer glows from the top, and a label sitting in the page
            above the card was washed out by it; on the reel it takes the scrim the reel's own marks take and stays
            legible against anything. Its text carries the one piece of state the mechanic has, and it stays after
            the mark is spent, because a Must Go moves rather than being used up. */}
        <p className="deck-up t-label">
          <ArrowUp size={14} strokeWidth={2} aria-hidden="true" />
          Must Go ({mustGo ? 'Move' : '1 Left'})
        </p>

        <span className="deck-hint" data-side="pass" aria-hidden="true">
          <ChevronLeft size={18} strokeWidth={2} />
        </span>
        <span className="deck-hint" data-side="keep" aria-hidden="true">
          <ChevronRight size={18} strokeWidth={2} />
        </span>

        {rest.map((place, depth) => {
          const top = depth === 0
          return (
            <div
              key={place.id}
              className="deck-card"
              data-depth={depth}
              data-leaving={top && leaving ? leaving : undefined}
              data-heading={top && dragging && progress > 0.15 ? heading : undefined}
              style={
                top && dragging
                  ? {
                      transform: `translate(${dx}px, ${dy}px) rotate(${dx * 0.03}deg)`,
                      opacity: 1 - progress * 0.35
                    }
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
        <button type="button" className="deck-must t-label" onClick={() => commit('must')}>
          Must Go
        </button>
        <button type="button" className="deck-keep t-label" onClick={() => commit('keep')}>
          Keep
        </button>
      </div>

      {/* One line, and it changes once the Must Go is spent, because "where did mine go" is the question the
          mechanic actually raises. */}
      <p className="deck-must-note">
        {mustGo ? (
          <>
            Your Must Go is on <strong>{mustGo.name}</strong>. Marking another moves it.
          </>
        ) : (
          'Swipe a reel up to make it your Must Go. You get one.'
        )}
      </p>
    </main>
  )
}
