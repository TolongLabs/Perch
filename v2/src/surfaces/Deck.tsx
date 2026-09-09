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

/** How long the edge glow holds. Long enough to register after the card has gone, short enough not to queue. Was
 *  520, which intake 2 read as barely registering: the glow now spans the viewport edge and it is held longer to
 *  match. Kept in step with --flash in Deck.css. */
const FLASH_MS = 760

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
  // Swiping two keeps in a row sets the same flash value twice, so React would reuse the rising marks and their
  // animation would never restart. The counter is what makes the second answer a new element.
  const [flashId, setFlashId] = useState(0)
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  /**
   * The edge glow runs on its own clock rather than on the card's exit. Under reduced motion that exit collapses to
   * nothing, and feedback tied to it would be gone before it was seen; here the answer stays on screen for the same
   * window whether or not it animated getting there.
   */
  const commit = useCallback((s: Swipe) => {
    setLeaving((current) => current ?? s)
    setFlash(s)
    setFlashId((n) => n + 1)
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

      {/* Outside the stack and fixed to the viewport, because the answer is light entering from the edge of the
          screen the card was thrown at. Inside the stack it was a 36px halo on the reel's own edge, which is what
          intake 2 saw as barely registering. */}
      <div className="deck-flash" data-flash={flash ?? undefined} aria-hidden="true" />

      {/* Above the reel and off it, like the other two. It sat on the video because the gold answer used to glow
          from the card's own top edge and washed out anything in the page above it; the glow is the whole viewport
          now, so ink on the page holds. Its text carries the one piece of state the mechanic has, and it stays
          after the mark is spent, because a Must Go moves rather than being used up. */}
      <p className="deck-up">
        <ArrowUp size={20} strokeWidth={2} aria-hidden="true" />
        <span className="t-label deck-hint-label">Must Go ({mustGo ? 'Move' : '1 Left'})</span>
      </p>

      <div className="deck-stack">
        {/* Outside the reel now, in the gutter the stack leaves either side, so nothing sits on the video. The
            label is what names the direction; the chevron on its own was a glyph the reader had to guess at. */}
        <span className="deck-hint" data-side="pass" aria-hidden="true">
          <ChevronLeft size={20} strokeWidth={2} />
          <span className="t-label deck-hint-label">Pass</span>
        </span>
        <span className="deck-hint" data-side="keep" aria-hidden="true">
          <ChevronRight size={20} strokeWidth={2} />
          <span className="t-label deck-hint-label">Keep</span>
        </span>

        {/* The plumage dot is the product's own mark for "this one counts", and it is what carries the moment the
            team asked heart emoji for. One rises on a Keep, two in gold on a Must Go. */}
        {(flash === 'keep' || flash === 'must') && (
          <span className="deck-rise" key={flashId} data-rise={flash} aria-hidden="true">
            <span className="rise-dot" />
            {flash === 'must' && <span className="rise-dot" />}
          </span>
        )}

        {rest.map((place, depth) => {
          const top = depth === 0
          return (
            <div
              key={place.id}
              className="deck-card"
              data-depth={depth}
              data-leaving={top && leaving ? leaving : undefined}
              data-heading={top && dragging ? (heading ?? undefined) : undefined}
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
