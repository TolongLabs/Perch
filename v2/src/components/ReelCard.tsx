import type { Place } from '../data/types'
import { duration, price } from '../lib/format'
import { CLUSTER_LABEL } from '../lib/schedule'
import './ReelCard.css'

const PLATFORM: Record<Place['reel']['platform'], string> = {
  instagram: 'Instagram',
  xhs: 'Xiaohongshu'
}

/**
 * `DESIGN.md`: 9:16, radius 24, muted autoplay loop, no shadow. The credit stays on the card because a field guide
 * labels its plate with the collector.
 *
 * `live` mounts the video. Only the top two cards in the stack get it, so a deck of 24 never has 24 decoders running.
 */
export const ReelCard = ({ place, live }: { place: Place; live: boolean }) => (
  <article className="reel">
    {live ? (
      <video
        className="reel-media"
        src={place.reel.src}
        poster={place.reel.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    ) : (
      <img className="reel-media" src={place.reel.poster} alt="" loading="lazy" />
    )}

    <div className="reel-foot">
      <div className="reel-top">
        <p className="t-name reel-name">{place.name}</p>
        <div className="reel-credit">
          <p className="reel-handle">{place.reel.creditHandle}</p>
          <p className="t-label reel-platform">{PLATFORM[place.reel.platform]}</p>
        </div>
      </div>
      {/* The specimen line is the metadata under a name, so it takes the full width under it rather than sharing a
          row with the credit, where a long creator handle squeezes it into a column. */}
      <p className="t-specimen reel-line">
        {CLUSTER_LABEL[place.cluster]} · {duration(place.dwellMin)} · {price(place)}
      </p>
    </div>
  </article>
)
