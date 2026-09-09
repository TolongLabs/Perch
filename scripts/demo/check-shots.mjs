import { pathToFileURL } from 'node:url'

const DEFAULT_URL = 'https://prototype-yskhynz4la-as.a.run.app'
const TRIP_ID = 'tokyo-nov-2026'

export function exactText(value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^\\s*${escaped}\\s*$`, 'i')
}

export function exitCodeFor(results) {
  return results.some((result) => result.status === 'ABSENT') ? 1 : 0
}

export async function locatorIsVisible(locator, timeout) {
  try {
    await locator.first().waitFor({ state: 'visible', timeout })
    return true
  } catch {
    return false
  }
}

export function formatCheckTable(results) {
  const headings = ['SHOT', 'ANCHOR', 'STATUS', 'RESOLVED SELECTOR']
  const rows = results.map((result) => [String(result.shot), result.anchor, result.status, result.selector])
  const widths = headings.map((heading, index) =>
    Math.max(heading.length, ...rows.map((row) => row[index]?.length ?? 0))
  )
  const render = (row) => row.map((cell, index) => cell.padEnd(widths[index])).join(' | ')
  return [render(headings), widths.map((width) => '-'.repeat(width)).join('-|-'), ...rows.map(render)].join('\n')
}

export async function runShotChecks(options = {}) {
  const baseUrl = options.baseUrl ?? process.env.DEMO_URL ?? DEFAULT_URL
  const timeout = Number(options.timeout ?? process.env.DEMO_TIMEOUT_MS ?? 30_000)

  // Playwright is deliberately not a dependency of the repo, so it is imported only when the gate actually runs.
  const specifier = process.env.DEMO_PLAYWRIGHT || 'playwright'
  const { chromium } = await import(specifier)

  const browser = await chromium.launch({
    headless: true,
    // `--disable-dev-shm-usage` is deliberately NOT here. It redirects Chrome's shared memory from /dev/shm to /tmp,
    // and on this machine /tmp is a 1 GB tmpfs that runs full while /dev/shm is empty. Starving the compositor of shm
    // surfaces as an int3 trap in chrome-headless-shell, which reads like a memory problem and is not one.
    args: ['--disable-gpu', '--no-sandbox', '--renderer-process-limit=2']
  })
  // Pinned light for the same reason the recorder is: the gate has to see the theme the film is shot in, or it
  // passes on a screen nobody will ever record.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' })

  // Clear any saved fixture so the gate sees a cold state, exactly as the demo video would start.
  // Clears the saved fixture once, not on every navigation. An unguarded init script re-runs on each page load and
  // wipes the trip the walkthrough just built, which reads as The Book rendering empty plates.
  await context.addInitScript(() => {
    try {
      if (sessionStorage.getItem('perch.demo.reset')) return
      localStorage.removeItem('perch.trip.v1')
      sessionStorage.setItem('perch.demo.reset', '1')
    } catch {}
  })

  const page = await context.newPage()
  page.setDefaultTimeout(timeout)

  const results = []
  const add = (shot, anchor, present, selector) => {
    results.push({ shot, anchor, status: present ? 'PRESENT' : 'ABSENT', selector })
  }
  const check = async (shot, anchor, selector, locator, predicate) => {
    if (!(await locatorIsVisible(locator, timeout))) {
      add(shot, anchor, false, selector)
      return false
    }
    const present = predicate ? await predicate(locator).catch(() => false) : true
    add(shot, anchor, present, selector)
    return present
  }
  const go = (path) => page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' })

  try {
    await go('/new')
    // The recorder waits on this heading before it touches anything on the page, so the gate has to read the same
    // string. It did not, which is why #226 turning /new into an edit surface reached a run rather than a check:
    // every anchor here stayed PRESENT while the take died on the first thing it looked for.
    await check(
      1,
      'The onboarding heading the recorder waits on',
      'heading matching Plan A New Trip',
      page.getByRole('heading', { name: /Plan A New Trip/ })
    )
    await check(1, 'November 2026 month grid', '.dr', page.locator('.dr'), async (locator) => {
      const month = await locator.locator('.dr-month').textContent()
      return typeof month === 'string' && month.includes('November 2026')
    })
    await check(1, 'Activity and destination chips', '.chip', page.locator('.chip'), async (locator) => {
      const chips = await locator.allTextContents()
      return (
        chips.length >= 10 &&
        chips.some((text) => /Tokyo/i.test(text ?? '')) &&
        chips.some((text) => /Food/i.test(text ?? ''))
      )
    })
    await check(
      1,
      'Start Swiping button',
      'button.ob-go',
      page.locator('button.ob-go', { hasText: exactText('Start Swiping') })
    )
    // Shot 1 is framed by scrolling to these four headings by name, and nothing else in this gate reads them, so a
    // rename would cost a take rather than a check. Pinned to .ob-legend rather than to the text alone: the chip
    // fieldsets nested inside carry their own <legend>, so a bare text match finds an element on this page whichever
    // string it is given and passes no matter what.
    await check(
      1,
      'The four onboarding headings, in order',
      '.ob-section .ob-legend',
      page.locator('.ob-legend'),
      async (locator) => {
        const found = (await locator.allTextContents()).map((text) => text.trim())
        return JSON.stringify(found) === JSON.stringify(['When', 'Who Is Coming', 'What You Are After', 'Where'])
      }
    )
    // Start Swiping waits on the owner's name and the take never types one, so it rides on the fixture's prefill.
    // Without this the failure is a click that times out and says nothing about why.
    await check(
      1,
      'The owner row is prefilled',
      'input labelled Your name',
      page.getByLabel('Your name'),
      async (l) => ((await l.inputValue()) ?? '').trim().length > 0
    )

    await go('/trips')
    await check(2, 'Tokyo trip card', 'section.dash-trip', page.locator('section.dash-trip', { hasText: 'Tokyo' }))
    await check(2, 'Invite link', '.dash-code', page.locator('.dash-code'), async (locator) => {
      const text = await locator.textContent()
      return typeof text === 'string' && text.includes(`/t/${TRIP_ID}/swipe`)
    })
    await check(
      2,
      'Row of voters',
      '.voters .voter',
      page.locator('.voters .voter'),
      async (locator) => (await locator.count()) >= 4
    )

    // The film reaches the Deck the owner's way, by pressing Open The Deck on the dashboard, so the gate does too.
    // A tab that lands directly on the swipe link is an invited joiner: it renders no chrome and, since #189, opens
    // a Who Are You? step. A gate that navigates straight to the link passes on a route the film never takes.
    await go('/trips')
    const openDeck = page.locator('button.dash-go', { hasText: exactText('Open The Deck') })
    await check(3, 'Open The Deck control', 'button.dash-go', openDeck)
    await openDeck.click()
    await page.waitForURL(new RegExp(`/t/${TRIP_ID}/swipe`)).catch(() => {})
    // The rail is what separates the two routes, and the reel card renders on both, so pin it.
    await check(3, 'The owner chrome, not the joiner view', '.island-rail', page.locator('.island-rail'))
    await check(3, 'Top reel card', '.deck-card[data-depth="0"]', page.locator('.deck-card[data-depth="0"]'))
    await check(3, 'Reel counter', '.deck-count', page.locator('.deck-count'), async (locator) => {
      const text = await locator.textContent()
      return typeof text === 'string' && /^Reel 1 Of \d+$/i.test(text.trim())
    })

    await go(`/t/${TRIP_ID}/votes`)
    await check(
      4,
      'At least 20 tally rows',
      '.tally-row',
      page.locator('.tally-row'),
      async (locator) => (await locator.count()) >= 20
    )
    await check(
      4,
      'At least three unanimous rows',
      '.tally-row[data-state="gold"]',
      page.locator('.tally-row[data-state="gold"]'),
      async (locator) => (await locator.count()) >= 3
    )

    await go('/desk')
    await check(
      5,
      '12 drop targets',
      '.slot-drop',
      page.locator('.slot-drop'),
      async (locator) => (await locator.count()) === 12
    )
    await check(
      5,
      'At least 10 sidebar cards',
      '.desk-poollist .card-pool',
      page.locator('.desk-poollist .card-pool'),
      async (locator) => (await locator.count()) >= 10
    )
    await check(
      6,
      'Draggable sidebar cards',
      '.desk-poollist .card-pool[role="button"]',
      page.locator('.desk-poollist .card-pool[role="button"]'),
      async (locator) => (await locator.count()) >= 10
    )
    // Pinned to the visible label on purpose. A gate that passes on the class while the word on screen has changed
    // is not a gate, and the narration says this button's name out loud.
    await check(
      7,
      'Optimize Plan control',
      '.desk-apply',
      page.locator('.desk-apply', { hasText: exactText('Optimize Plan') })
    )
    await check(
      8,
      'Sensoji sidebar card',
      '.desk-poollist .card-pool:has-text("Sensoji")',
      page.locator('.desk-poollist .card-pool', { hasText: 'Sensoji' })
    )

    // Optimize the plan before going on. The Book draws a route and a Transit Route link per day only once that day holds
    // stops, so a gate that walks straight from a cold Desk to The Book can only ever check the frame around empty
    // plates. That is the hole the 0.1.0 film went through, and it is closed by planning here rather than by
    // weakening what The Book is asked to prove. The fixture clear is guarded, so this state survives the
    // navigations below.
    await page.locator('.desk-apply').click()
    await page
      .locator('.card-placed')
      .first()
      .waitFor({ timeout })
      .catch(() => {})
    // Reported against shot 8 rather than 7 because it has to run after shot 8's sidebar check: optimizing moves
    // Sensoji out of the sidebar and onto the board, which is the card shot 8 then pins.
    await check(
      8,
      'Optimize Plan fills every slot',
      '.card-placed',
      page.locator('.card-placed'),
      async (locator) => (await locator.count()) === 12
    )

    await go('/desk/before-we-go')
    await check(
      9,
      'Six checklist rows',
      '.bwg-row',
      page.locator('.bwg-row'),
      async (locator) => (await locator.count()) === 6
    )
    await check(
      9,
      'Print The Book button',
      'button.bwg-print',
      page.locator('button.bwg-print', { hasText: exactText('Print The Book') })
    )
    // Shot 9 ends by pressing this, and shot 10 starts from where it lands, so a rename costs both beats.
    await check(
      9,
      'The Handbook button',
      'button named The Handbook',
      page.getByRole('button', { name: exactText('The Handbook') })
    )
    // Five rows are ticked by title. The sixth, JR Pass, starts ticked and is never clicked, so it is not listed.
    for (const title of [
      'Passport valid for the whole trip',
      'Suica or Welcome Suica card',
      'teamLab ticket booked in advance',
      'Yen cash for the smaller shops',
      'Travel insurance'
    ]) {
      await check(
        9,
        `Checklist row: ${title}`,
        `.bwg-row holding ${title}`,
        page.locator('.bwg-row').filter({ has: page.locator('.check-name', { hasText: exactText(title) }) })
      )
    }

    // Shot 10 enters through the rail rather than by URL, so the item it presses is an anchor like any other.
    await check(
      10,
      'The Book rail item',
      '.rail-item holding The Book',
      page.locator('.rail-item', { hasText: exactText('The Book') })
    )

    await go(`/t/${TRIP_ID}`)
    // The days were planned above, so The Book is asked to prove it prints a real trip rather than an empty frame:
    // a drawn route and a Transit Route link for each of the four days. Counting the four day sections alone passed
    // on placeholder plates.
    await check(
      10,
      'A drawn route and a Transit Route link per day',
      'a.day-route[href*="google.com/maps"] (4) + .day-spread:has(.spread-pin svg path) (4)',
      page.locator('.day-spread'),
      async () => {
        const maps = await page.locator('a.day-route[href*="google.com/maps"]').count()
        // Per day, not a total: four paths spread across fewer than four days would satisfy a global count while
        // some plate on screen drew nothing.
        const drawing = await page.locator('.day-spread:has(.spread-pin svg path)').count()
        return maps === 4 && drawing === 4
      }
    )
    await check(
      10,
      'Book page heading and four day sections',
      '.cover-title (Tokyo) + .day-spread (4)',
      page.locator('.cover-title'),
      async (locator) => {
        const title = await locator.textContent()
        const dayCount = await page.locator('.day-spread').count()
        return title === 'Tokyo' && dayCount === 4
      }
    )
  } finally {
    await context.close()
    await browser.close()
  }

  return results
}

async function main() {
  const results = await runShotChecks()
  console.log(formatCheckTable(results))
  const missing = results.filter((result) => result.status === 'ABSENT')
  if (missing.length > 0)
    console.error(`\n${missing.length} required shot anchor${missing.length === 1 ? '' : 's'} absent.`)
  process.exitCode = exitCodeFor(results)
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (entry === import.meta.url) await main()
