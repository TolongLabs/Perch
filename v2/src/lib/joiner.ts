/**
 * There is no authentication in the prototype, so "am I the owner or a joiner?" has no field in the model to answer it.
 * The invite link is the swipe link, per `TRD.md`, so the honest signal is where this tab booted: a tab that opened
 * straight onto a deck came in through an invite, and must never be shown onboarding. The owner reaches the same deck
 * by navigating from `/new`, which does not change where the tab started.
 *
 * Captured once at module load, before the router rewrites the location.
 */
const ENTRY = typeof window === 'undefined' ? '' : window.location.pathname

export const isJoiner = (): boolean => /^\/t\/[^/]+\/swipe\/?$/.test(ENTRY)
