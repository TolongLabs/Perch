import type { Votes } from './types'

const ids = [
  'sensoji',
  'nakamise',
  'kappabashi',
  'ueno-park',
  'tokyo-national-museum',
  'ameyoko',
  'meiji-jingu',
  'takeshita-street',
  'shibuya-crossing',
  'shinjuku-gyoen',
  'omoide-yokocho',
  'tokyo-metropolitan-building',
  'tsukiji-outer-market',
  'hama-rikyu-gardens',
  'ginza-chuo-dori',
  'imperial-palace-east-gardens',
  'tokyo-station-marunouchi',
  'nihonbashi',
  'teamlab-planets',
  'toyosu-market',
  'odaiba-beach',
  'divercity-gundam',
  'daiba-park',
  'hachitama-observatory'
]

type Answer = 'yes' | 'no' | null

/** A member's answers in fixture order. 'y' is yes, 'n' is no, '.' is not swiped yet. */
const swipes = (pattern: string): Record<string, Answer> =>
  Object.fromEntries(ids.map((id, i) => [id, pattern[i] === 'y' ? 'yes' : pattern[i] === 'n' ? 'no' : null]))

/**
 * Farah, Hana and Iman have already swiped, so the tally has percentages the moment Aisyah finishes. Sensoji and
 * Meiji Jingu are unanimous, Hama-rikyu and Daiba Park have no yes at all, and Aisyah has only swiped the four she
 * opened the app for. Read down a column to see one place: the order is the id list above.
 */
export const votes: Votes = {
  aisyah: swipes('y.....y..y........y.....'),
  farah: swipes('yynyyyyyyyynynyyynyyynny'),
  hana: swipes('yyyynyyyynyyynnyynyyyynn'),
  iman: swipes('ynnyyyyyyyyyynynyyynyynn')
}
