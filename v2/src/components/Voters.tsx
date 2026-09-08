import type { Person, Votes } from '../data/types'
import './Voters.css'

/**
 * Who has finished swiping. Shared by The Tally and the Dashboard, which ask the same question of the same fixture.
 *
 * Finished means every place answered, not merely started: a member part way through has said nothing about the
 * places they have not reached, and the tally counts those as nothing rather than as a no.
 */
export const Voters = ({
  party,
  votes,
  places,
  ownerId
}: {
  party: Person[]
  votes: Votes
  /** How many places there are to answer. A member is done when their answered count reaches it. */
  places: number
  ownerId?: string
}) => (
  <ul className="voters">
    {party.map((p) => {
      const done = Object.values(votes[p.id] ?? {}).filter((v) => v !== null).length === places
      return (
        <li key={p.id}>
          <span className="voter" data-done={done}>
            {p.name}
            {p.id === ownerId && <span className="voter-owner">Owner</span>}
          </span>
        </li>
      )
    })}
  </ul>
)
