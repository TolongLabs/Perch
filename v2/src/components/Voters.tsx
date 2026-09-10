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
      const answered = Object.values(votes[p.id] ?? {}).filter((v) => v !== null).length
      const progress = answered === 0 ? 'not-started' : answered >= places ? 'complete' : 'in-progress'
      const progressLabel =
        progress === 'not-started' ? 'Not Started' : progress === 'in-progress' ? 'In Progress' : 'Complete'
      return (
        <li key={p.id}>
          <span className="voter" data-done={progress === 'complete'} data-progress={progress}>
            <span className="voter-name">{p.name}</span>
            {p.id === ownerId && <span className="voter-owner">Owner</span>}
            <span className="voter-progress">{progressLabel}</span>
          </span>
        </li>
      )
    })}
  </ul>
)
