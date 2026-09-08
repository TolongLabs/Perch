/**
 * There is no authentication in the prototype, so "am I the owner or a joiner?" has no field in the model to answer it.
 * The invite link is the swipe link, per `TRD.md`: anyone who arrives at the deck without having set the trip up is a
 * joiner, and a joiner must never be shown onboarding. The deck records that arrival; onboarding reads it.
 *
 * Session storage rather than the trip: this is a fact about the tab, not about the trip, and it must not ride along in
 * the one object `state.tsx` mirrors to localStorage.
 */
const KEY = 'perch.joiner'

export const markJoiner = () => {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    // A browser with storage blocked still gets a working deck; it just sees onboarding if it goes looking for it.
  }
}

export const isJoiner = (): boolean => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
