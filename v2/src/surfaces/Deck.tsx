import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { type AnimationEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Presence } from '../components/Presence'
import { ReelCard } from '../components/ReelCard'
import { Heading } from '../components/Ui'
import { isJoiner } from '../lib/joiner'
import { type Swipe, useSwipeGesture } from '../lib/useSwipeGesture'
import { finishedMembers } from '../lib/votes'
import { useTrip } from '../state'
import './Deck.css'

/** Three is enough for the stack to read as a deck; the fourth would never be seen. */
const VISIBLE = 3

/** How long the edge glow holds. Long enough to register after the card has gone, short enough not to queue. Was
 *  520, which intake 2 read as barely registering: the glow now spans the viewport edge and it is held longer to
 *  match. Kept in step with --flash in Deck.css. */
const FLASH_MS = 760

/**
 * The swiping itself, for one member. It takes `me` as a prop rather than reading it, because the queue is fixed at
 * mount and a member who is chosen after that would be handed the previous one's remaining reels; mounting this
 * fresh per voter is what makes "each member sees their own" true rather than merely intended.
 */
const Swiping = ({ me }: { me: string }) => {
  const navigate = useNavigate()
  const { trip, swipe } = useTrip()

  // Fixed at mount. Recomputing as votes land would shrink the queue under the swiper's finger and make the count lie.
  const [queue] = useState(() => Object.values(trip.options).filter((p) => trip.votes[me]?.[p.id] == null))
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState<Swipe | null>(null)
  const [flash, setFlash] = useState<Swipe | null>(null)
  // Swiping two keeps in a row sets the same flash value twice, so React would reuse the rising marks and their
  // animation would never restart. The counter is what makes the second answer a new element.
  const [flashId, setFlashId] = useState(0)
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const committing = useRef(false)

  /**
   * The edge glow runs on its own clock rather than on the card's exit. Under reduced motion that exit collapses to
   * nothing, and feedback tied to it would be gone before it was seen; here the answer stays on screen for the same
   * window whether or not it animated getting there.
   */
  const commit = useCallback((s: Swipe) => {
    if (committing.current) return
    committing.current = true
    setLeaving(s)
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
    if (place) {
      const answer = leaving === 'must' || leaving === 'skip' ? leaving : leaving === 'keep'
      swipe(me, place.id, answer)
    }
    setIndex((i) => i + 1)
    setLeaving(null)
    committing.current = false
  }

  const rest = queue.slice(index, index + VISIBLE)

  // Derived, not remembered: a Must Go is whichever place this member holds one on, so there is no second copy of
  // the fact to fall out of step with the votes.
  const mustGo = Object.values(trip.options).find((p) => trip.votes[me]?.[p.id] === 'must')
  // One per member per session, spent once. The state still demotes an older Must Go if it is ever asked to, but
  // nothing on this surface can ask: the button is gone, the arrow is gone, and the gesture no longer commits.
  const spent = mustGo !== undefined

  const { dx, dy, dragging, heading, progress, handlers } = useSwipeGesture(commit, leaving === null, !spent)

  if (rest.length === 0) {
    // Two facts, and the second is the one that decides whether the order on the next screen can be trusted yet.
    const finished = finishedMembers(trip).length
    const all = finished === trip.party.length
    return (
      <main className="deck">
        <section className="deck-done">
          <Heading as="h1">Every Reel Is Swiped</Heading>
          <p className="t-specimen">
            You have finished &middot; {finished} of {trip.party.length} have finished
          </p>
          <button type="button" className="deck-go t-label" onClick={() => navigate(`/t/${trip.id}/votes`)}>
            {all ? 'See The Tally' : 'View Current Tally'}
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="deck">
      <header className="deck-head">
        <Heading as="h1">The Deck</Heading>
        <p className="deck-count" aria-live="polite" aria-atomic="true">
          Reel {index + 1} Of {queue.length}
        </p>
      </header>

      {/* The other three, on the deck at the same time and as far through it as their votes say they are. */}
      <Presence trip={trip} />

      {/* Only where it is in doubt. Someone who came in through the invite link chose a name a moment ago and the
          rest of the screen never says it back to them; the owner opened her own trip and does not need telling. */}
      {isJoiner() && <p className="t-specimen deck-as">Voting as {trip.party.find((m) => m.id === me)?.name}</p>}

      {/* Outside the stack and fixed to the viewport, because the answer is light entering from the edge of the
          screen the card was thrown at. Inside the stack it was a 36px halo on the reel's own edge, which is what
          intake 2 saw as barely registering. */}
      <div className="deck-flash" data-flash={flash ?? undefined} aria-hidden="true" />

      <div className="deck-controls">
        {mustGo ? (
          <p className="deck-up-note">Your Must Go is on {mustGo.name}.</p>
        ) : (
          <button type="button" className="deck-direction" data-side="must" onClick={() => commit('must')}>
            <ArrowUp size={20} strokeWidth={2} aria-hidden="true" />
            <span className="t-label deck-hint-label">Must Go One Only</span>
          </button>
        )}

        <div className="deck-row">
          <button type="button" className="deck-direction" data-side="pass" onClick={() => commit('pass')}>
            <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
            <span className="t-label deck-hint-label">Pass</span>
          </button>

          <div className="deck-stack">
            {flash === 'must' && (
              <span className="deck-rise" key={flashId} aria-hidden="true">
                <Heart className="rise-heart" size={30} strokeWidth={2} />
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

          <button type="button" className="deck-direction" data-side="keep" onClick={() => commit('keep')}>
            <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
            <span className="t-label deck-hint-label">Keep</span>
          </button>
        </div>

        <button type="button" className="deck-direction" data-side="skip" onClick={() => commit('skip')}>
          <ArrowDown size={20} strokeWidth={2} aria-hidden="true" />
          <span className="t-label deck-hint-label">Skip</span>
        </button>
      </div>
    </main>
  )
}

/** Remembered for the session and not for the trip: a browser that comes back tomorrow is asked again. */
const VOTER_KEY = 'perch.voter.v1'

const storedVoter = (party: { id: string }[]): string | null => {
  try {
    const id = sessionStorage.getItem(VOTER_KEY)
    return id && party.some((p) => p.id === id) ? id : null
  } catch {
    /* A machine with storage disabled is asked once per visit rather than once per session. */
    return null
  }
}

/**
 * Who is swiping. The invite link is the same link for everyone, so a tab that opened it has no idea which member
 * it belongs to and used to vote as the owner: a friend following the link cast their answers into her column and
 * could never start their own. The owner never sees this, because she opened her own trip.
 */
export const Deck = () => {
  const { trip, setCurrentMember } = useTrip()
  const joiner = isJoiner()
  const [voter, setVoter] = useState<string | null>(() => (joiner ? storedVoter(trip.party) : null))
  const me = joiner ? voter : trip.ownerId

  // The choice is the trip's as well as the tab's, because the Tally and the dashboard read who is voting from the
  // trip. The owner's tab puts it back to her, so a friend's pick in another tab cannot follow her into her own
  // walkthrough through the store they share.
  useEffect(() => {
    if (me && me !== trip.currentMemberId) setCurrentMember(me)
  }, [me, trip.currentMemberId, setCurrentMember])

  const pick = (id: string) => {
    try {
      sessionStorage.setItem(VOTER_KEY, id)
    } catch {
      /* The choice still holds for this mount; it is only the memory of it that is lost. */
    }
    setCurrentMember(id)
    setVoter(id)
  }

  if (!me) {
    return (
      <main className="deck">
        <section className="deck-who">
          <Heading as="h1">Who Are You?</Heading>
          <p className="t-specimen">
            Everyone gets the same link, so Perch cannot tell you apart until you say. Your answers are counted under
            the name you pick.
          </p>
          <ul className="deck-wholist">
            {trip.party.map((member) => (
              <li key={member.id}>
                <button type="button" className="deck-whopick t-label" onClick={() => pick(member.id)}>
                  {member.name}
                  {member.id === trip.ownerId && <span className="deck-whoowner">Owner</span>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    )
  }

  // Keyed, so choosing a name mounts a queue built from that member's own unanswered places.
  return <Swiping key={me} me={me} />
}
