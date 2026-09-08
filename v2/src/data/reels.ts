import manifest from './reels.json'
import type { Reel } from './types'

type ManifestEntry = { place: string; src: string; poster: string; platform: string; credit: string; source: string }

const isPlatform = (value: string): value is Reel['platform'] => value === 'instagram' || value === 'xhs'

const entries: ManifestEntry[] = manifest.reels
const base: string = manifest.base

/** The manifest is a JSON boundary, so the platform string is narrowed here rather than cast. */
export const reels: Record<string, Reel> = Object.fromEntries(
  entries.map((entry) => [
    entry.place,
    {
      src: base + entry.src,
      poster: base + entry.poster,
      platform: isPlatform(entry.platform) ? entry.platform : 'instagram',
      creditHandle: entry.credit,
      sourceUrl: entry.source
    }
  ])
)

export const reel = (placeId: string): Reel => {
  const found = reels[placeId]
  if (!found) throw new Error(`No reel in the manifest for ${placeId}`)
  return found
}
