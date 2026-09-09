import type { Place } from '../data/types'
import './PlateThumb.css'

/**
 * The Book's plate at list size, for a place named in a list rather than shown as a reel. After swiping twenty
 * videos a name alone is hard to put a face to, and this is the same still the Book prints.
 *
 * Square-cornered, because radius is the mechanic and a photograph is plate material wherever it appears; at 48px
 * the Desk's own 24 would draw a circle, which is a device for a person and not for a place. Cropped above centre
 * for the reason the Book states: a reel burns its caption into the lower third of the frame, so a centred square
 * of a 9:16 still lands that band across the middle of the picture.
 */
export const PlateThumb = ({ place }: { place: Place }) => (
  <img className="plate-thumb" src={place.reel.poster} alt="" loading="lazy" width={40} height={40} />
)
