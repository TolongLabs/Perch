import { spawnSync } from 'node:child_process'
import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const DEFAULT_URL = 'https://prototype-yskhynz4la-as.a.run.app'
const SHOT_NAMES = Array.from({ length: 10 }, (_, index) => `shot-${index + 1}`)
const REQUIRED_BEATS = [...SHOT_NAMES, 'end']

export function assertCompleteTake(beats) {
  for (const name of REQUIRED_BEATS) {
    if (!beats.some((beat) => beat.name === name)) throw new Error(`take is missing required beat ${name}`)
  }

  const ordered = REQUIRED_BEATS.map((name) => beats.find((beat) => beat.name === name))
  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index].ms <= ordered[index - 1].ms) throw new Error('required beats must be strictly increasing')
  }
}

export function normalizedBeatOffsets(beats) {
  assertCompleteTake(beats)
  const first = beats.find((beat) => beat.name === 'shot-1').ms
  return beats.filter((beat) => beat.ms >= first).map((beat) => ({ ...beat, ms: beat.ms - first }))
}

function exactText(value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^\\s*${escaped}\\s*$`, 'i')
}

async function installCursor(page) {
  await page.addInitScript(() => {
    const attach = () => {
      if (document.querySelector('#perch-demo-cursor')) return
      const style = document.createElement('style')
      style.textContent = `
        #perch-demo-cursor {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 2147483647;
          width: 22px;
          height: 22px;
          border: 2px solid rgba(18, 24, 31, 0.92);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 1px 4px rgba(18, 24, 31, 0.24);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: width 120ms ease, height 120ms ease, background 120ms ease;
        }
        #perch-demo-cursor[data-down='true'] {
          width: 16px;
          height: 16px;
          background: rgba(18, 24, 31, 0.28);
        }
      `
      const cursor = document.createElement('div')
      cursor.id = 'perch-demo-cursor'
      document.head.append(style)
      document.body.append(cursor)
      document.addEventListener('mousemove', (event) => {
        cursor.style.left = `${event.clientX}px`
        cursor.style.top = `${event.clientY}px`
      })
      document.addEventListener('mousedown', () => {
        cursor.dataset.down = 'true'
      })
      document.addEventListener('mouseup', () => {
        delete cursor.dataset.down
      })
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach, { once: true })
    else attach()
  })
}

async function gesture(page, from, to, steps = 14, stepMs = 22) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps
    await page.mouse.move(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t)
    await page.waitForTimeout(stepMs)
  }
  await page.mouse.up()
}

async function centerOf(locator, scroll = true) {
  if (scroll) await locator.first().scrollIntoViewIfNeeded()
  const box = await locator.first().boundingBox()
  if (!box) throw new Error('target has no bounding box')
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

export async function recordDemo(options = {}) {
  const baseUrl = options.baseUrl ?? process.env.DEMO_URL ?? DEFAULT_URL
  const demoDir = options.demoDir ?? process.env.DEMO_DIR ?? join(tmpdir(), 'perch-demo')
  const timeout = Number(options.timeout ?? process.env.DEMO_TIMEOUT_MS ?? 30_000)
  const headless = process.env.DEMO_HEADLESS !== 'false'
  const specifier = process.env.DEMO_PLAYWRIGHT || 'playwright'

  const videoDir = join(demoDir, 'playwright-video')
  const capturePath = join(demoDir, 'capture.webm')

  mkdirSync(demoDir, { recursive: true })
  rmSync(videoDir, { recursive: true, force: true })
  rmSync(capturePath, { force: true })
  mkdirSync(videoDir, { recursive: true })

  const { chromium } = await import(specifier)
  const browser = await chromium.launch({
    headless,
    // `--disable-dev-shm-usage` is deliberately NOT here. It redirects Chrome's shared memory from /dev/shm to /tmp,
    // and on this machine /tmp is a 1 GB tmpfs that runs full while /dev/shm is empty. Starving the compositor of shm
    // surfaces as an int3 trap in chrome-headless-shell, which reads like a memory problem and is not one.
    args: ['--disable-gpu', '--no-sandbox', '--renderer-process-limit=2']
  })

  const beats = []
  const errors = []
  const segments = []
  const segmentSpans = []
  const deadRanges = []
  let context = null
  let page = null
  let video = null
  let segmentStarted = 0
  let elapsedBefore = 0
  let pointer = { x: 1300, y: 820 }
  let failure = null

  const probeDurationMs = (path) => {
    const probe = spawnSync(
      process.env.DEMO_FFPROBE ?? 'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
      { encoding: 'utf8' }
    )
    const seconds = Number.parseFloat(probe.stdout ?? '')
    if (!Number.isFinite(seconds)) throw new Error(`could not measure segment duration: ${path}`)
    return Math.round(seconds * 1_000)
  }

  const openSegment = async (storageState, resetFixture = false) => {
    segmentSpans.push({ start: elapsedBefore, first: null, last: null, end: null })
    context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      // The app falls back to the OS theme, and headless Chromium resolves prefers-color-scheme on its own, so an
      // unpinned take can come out entirely in dark. Nothing throws and nothing appears in the log; the film simply
      // looks wrong ten minutes later. The demo is light because the field-guide direction is printed paper.
      colorScheme: 'light',
      storageState,
      recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } }
    })
    // Only the first segment clears the fixture. A sentinel cannot do this job: storageState carries cookies and
    // localStorage between segments but NOT sessionStorage, so a sessionStorage guard is absent in every later
    // context, the script fires again, and the trip the walkthrough built is wiped. That reads as The Book printing
    // placeholder plates and the checklist saying "nothing on the calendar yet", two beats after the real cause.
    if (resetFixture) {
      await context.addInitScript(() => {
        try {
          localStorage.removeItem('perch.trip.v1')
        } catch {}
      })
    }
    page = await context.newPage()
    // The recorder starts with the page, so the beat clock has to start here rather than after the cursor is injected,
    // or every beat is reported a second or two earlier than it appears and the narration runs ahead of the picture.
    segmentStarted = Date.now()
    page.setDefaultTimeout(timeout)
    page.on('pageerror', (error) => errors.push(String(error).slice(0, 240)))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text().slice(0, 240))
    })
    await installCursor(page)
    video = page.video()
  }

  const closeSegment = async () => {
    if (!context) return
    const recorder = video
    // Closing the context takes seconds and the recorder keeps filming through it, so the last scripted moment has to
    // be stamped before the close rather than inferred from the video length afterwards.
    const span = segmentSpans.at(-1)
    if (span) span.last = elapsed()
    await context.close()
    context = null
    if (!recorder) return
    const path = join(videoDir, `segment-${String(segments.length + 1).padStart(2, '0')}.webm`)
    renameSync(await recorder.path(), path)
    segments.push(path)
    const measured = probeDurationMs(path)
    if (span) span.end = span.start + measured
    elapsedBefore += measured
  }

  // The deck decodes reel video, and Playwright's in-renderer recorder on top of that exhausts this machine partway
  // through the swipes. A fresh context hands the renderer back its memory; the segments are concatenated at the end
  // and the beat clock carries the measured duration of everything already filmed.
  const nextSegment = async () => {
    const storageState = await context.storageState()
    await closeSegment()
    await openSegment(storageState)
  }

  // Every segment after the first opens on a page load nobody narrates over, because the recorder starts filming when
  // the page is created and the beat is not marked until its anchor is on screen. Left in, those loads put the film
  // over the 5:00 submission ceiling and read as stalls. This cuts them and slides the later beats back by what it cut.
  const tighten = (raw) => {
    const cuts = [...deadRanges.filter((range) => range.to - range.from > 400)]
    for (const [index, span] of segmentSpans.entries()) {
      if (index > 0 && span.first !== null && span.first - 350 - span.start > 400) {
        cuts.push({ from: span.start, to: span.first - 350 })
      }
      if (span.last !== null && span.end !== null && span.end - (span.last + 350) > 400) {
        cuts.push({ from: span.last + 350, to: span.end })
      }
    }
    cuts.sort((a, b) => a.from - b.from)
    if (cuts.length === 0) {
      renameSync(raw, capturePath)
      return
    }
    const total = probeDurationMs(raw)
    const keeps = []
    let cursor = 0
    for (const cut of cuts) {
      if (cut.from > cursor) keeps.push([cursor, cut.from])
      cursor = cut.to
    }
    keeps.push([cursor, total])
    const expr = keeps.map(([a, b]) => `between(t,${(a / 1000).toFixed(3)},${(b / 1000).toFixed(3)})`).join('+')
    const trimmed = spawnSync(
      process.env.DEMO_FFMPEG ?? 'ffmpeg',
      // biome-ignore format: the filter graph reads worse wrapped
      ['-v', 'error', '-y', '-i', raw, '-vf', `select='${expr}',setpts=N/FRAME_RATE/TB`, '-an', '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-deadline', 'realtime', '-cpu-used', '8', '-row-mt', '1', '-threads', '2', capturePath],
      { encoding: 'utf8' }
    )
    if (trimmed.status !== 0) {
      failure = failure ?? new Error(`could not tighten capture: ${trimmed.stderr}`)
      renameSync(raw, capturePath)
      return
    }
    // Shifts are computed against each beat's original position. Applying them cut by cut against positions that have
    // already moved double-counts, which silently steals picture from a beat in the middle of the take.
    const original = beats.map((beat) => beat.ms)
    for (const [index, beat] of beats.entries()) {
      let shift = 0
      for (const cut of cuts) {
        if (original[index] >= cut.to) shift += cut.to - cut.from
        else if (original[index] > cut.from) shift += original[index] - cut.from
      }
      beat.ms = original[index] - shift
    }
    const removed = cuts.reduce((sum, cut) => sum + (cut.to - cut.from), 0)
    console.log(`tightened: cut ${(removed / 1000).toFixed(1)}s of unscripted picture at ${cuts.length} segment edges`)
  }

  // Every beat asserts, at the moment its narration makes its claim, the DOM state that claim depends on. Two defects
  // shipped in 0.1.0 were the same shape -- the picture contradicting the voice at the instant of the claim -- and
  // neither an anchor gate nor a frame check caught them, because the anchors were present and the frames I sampled
  // were not the ones that lied. A take fails if any claim fails.
  const claims = []
  const claim = async (beat, statement, check) => {
    let ok = false
    let detail = ''
    try {
      const result = await check()
      ok = result === true || (typeof result === 'number' && result > 0)
      if (typeof result === 'string') {
        ok = false
        detail = result
      }
    } catch (error) {
      detail = error instanceof Error ? error.message.split('\n')[0].slice(0, 80) : String(error)
    }
    claims.push({ beat, statement, ok, detail })
  }
  const countOf = (selector) => page.locator(selector).count()

  await openSegment(undefined, true)

  const elapsed = () => elapsedBefore + (Date.now() - segmentStarted)
  const pause = (ms) => page.waitForTimeout(ms)
  const must = async (locator, name) => {
    try {
      await locator.first().waitFor({ state: 'visible', timeout })
    } catch {
      throw new Error(`required recording anchor is absent: ${name}`)
    }
    return locator
  }
  const mark = async (name) => {
    const ms = elapsed()
    const span = segmentSpans.at(-1)
    if (span && span.first === null) span.first = ms
    beats.push({ name, ms })
    console.log(`${String(ms).padStart(6)}ms  ${name}`)
  }
  const finishShot = async (name, durationMs) => {
    const start = beats.find((beat) => beat.name === name)?.ms
    if (start === undefined) throw new Error(`cannot pace missing beat ${name}`)
    const remaining = start + durationMs - elapsed()
    if (remaining > 0) await pause(remaining)
  }
  const moveTo = async (locator, duration = 480) => {
    const target = await centerOf(locator)
    const steps = Math.max(1, Math.round(duration / 24))
    const origin = pointer
    for (let step = 1; step <= steps; step += 1) {
      const ratio = step / steps
      const eased = ratio < 0.5 ? 2 * ratio * ratio : 1 - (-2 * ratio + 2) ** 2 / 2
      const x = origin.x + (target.x - origin.x) * eased
      const y = origin.y + (target.y - origin.y) * eased
      await page.mouse.move(x, y)
      await pause(24)
    }
    pointer = target
  }
  const click = async (locator, after = 450) => {
    await moveTo(locator)
    await pause(320)
    await page.mouse.down()
    await pause(110)
    await page.mouse.up()
    await pause(after)
  }
  const type = async (locator, text) => {
    await click(locator, 250)
    await page.keyboard.type(text, { delay: 70 })
    await pause(500)
  }
  const scrollTo = async (locator, settleMs = 1_050) => {
    await must(locator, 'scroll target')
    await locator.first().scrollIntoViewIfNeeded()
    await pause(settleMs)
  }

  // Cards are injected as an overlay on the live page rather than replacing the document. `setContent` detaches the
  // frame, and the next navigation then fails with ERR_ABORTED; an overlay also keeps the already-loaded Quicksand and
  // Newsreader faces, so the card sits in the same typographic register as the app. Nothing is added to v2/ for this.
  const showCard = async (eyebrow, display, specimen, aside = '') => {
    await page.evaluate(
      ({ eyebrow, display, specimen, aside }) => {
        document.getElementById('demo-card')?.remove()
        const el = document.createElement('div')
        el.id = 'demo-card'
        el.innerHTML = `
          <style>
            #demo-card { position: fixed; inset: 0; z-index: 2147483000; background: #FBF8F2; color: #2E261F;
              font-family: 'Quicksand', 'Helvetica Neue', Arial, sans-serif;
              display: flex; flex-direction: column; justify-content: center; padding: 0 120px }
            #demo-card .eyebrow { font-size: 13px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
              opacity: 0.62; margin: 0 }
            #demo-card .display { font-size: 124px; font-weight: 300; letter-spacing: -0.01em; line-height: 1.02;
              margin: 22px 0 0 }
            #demo-card .rule { width: 124px; height: 1px; background: #2E261F; opacity: 0.22; margin: 40px 0 }
            #demo-card .specimen { font-family: 'Newsreader', Georgia, serif; font-style: italic; font-size: 26px;
              line-height: 1.62; max-width: 760px; margin: 0 }
            #demo-card .aside { font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
              opacity: 0.62; margin: 56px 0 0 }
          </style>
          <p class="eyebrow"></p>
          <p class="display"></p>
          <div class="rule"></div>
          <p class="specimen"></p>
          ${aside ? '<p class="aside"></p>' : ''}
        `
        el.querySelector('.eyebrow').textContent = eyebrow
        el.querySelector('.display').textContent = display
        el.querySelector('.specimen').textContent = specimen
        if (aside) el.querySelector('.aside').textContent = aside
        document.body.append(el)
        const pointer = document.getElementById('perch-demo-cursor')
        if (pointer) pointer.style.display = 'none'
      },
      { eyebrow, display, specimen, aside }
    )
    await pause(700)
  }

  const hideCard = async () => {
    await page.evaluate(() => {
      document.getElementById('demo-card')?.remove()
      const pointer = document.getElementById('perch-demo-cursor')
      if (pointer) pointer.style.display = ''
    })
    await pause(500)
  }

  try {
    await page.goto(new URL('/', baseUrl).href, { waitUntil: 'domcontentloaded' })

    await must(page.locator('main'), 'landing surface')
    await showCard(
      'TolongLabs',
      'Perch',
      'The group swipes. What wins lands on the calendar. The trip prints as The Book.'
    )
    await mark('open')
    await finishShot('open', 13_000)

    await hideCard()
    await mark('landing')
    await finishShot('landing', 16_000)

    await nextSegment()

    await page.goto(new URL('/new', baseUrl).href, { waitUntil: 'domcontentloaded' })
    const heading = page.getByRole('heading', { name: /Plan A New Trip/ })
    await must(heading, 'shot 1 heading')
    await page.mouse.move(pointer.x, pointer.y)
    await pause(1_000)
    await mark('shot-1')

    await click(page.getByRole('button', { name: exactText('20 November 2026') }))
    await click(page.getByRole('button', { name: exactText('23 November 2026') }))
    await page.getByText('4 days, 3 nights').waitFor()

    const whatYouWant = page.locator('input[placeholder="Tell Perch what you want out of this trip"]')
    await scrollTo(page.locator('.ob-section').nth(1))
    await type(whatYouWant, 'temples and snacks, early starts')
    await click(page.getByRole('button', { name: exactText('Food') }))
    await click(page.getByRole('button', { name: exactText('Temples') }))
    await click(page.getByRole('button', { name: exactText('Shopping') }))

    await scrollTo(page.locator('.ob-section').nth(2))
    await type(page.locator('input[placeholder="Name a city"]'), 'Tokyo')
    // Start Swiping really does navigate, to the deck, which belongs to shot-3 and is showing a reel that has not
    // finished loading. The beat is padded on the finished form before the press, and everything from the moment
    // onboarding is left until the dashboard is on screen is recorded as dead and cut from the film.
    await claim(
      'shot-1',
      'the range reads four days and three nights',
      async () => (await page.getByText('4 days, 3 nights').count()) > 0
    )
    await finishShot('shot-1', 15_000)
    await click(page.getByRole('button', { name: exactText('Start Swiping') }), 0)
    const leftOnboarding = elapsed()
    await page.waitForURL(/\/t\/tokyo-nov-2026\/swipe/)

    await page.goto(new URL('/trips', baseUrl).href, { waitUntil: 'domcontentloaded' })
    await must(page.locator('.dash-trip'), 'shot 2 trip card')
    deadRanges.push({ from: leftOnboarding, to: elapsed() })
    await mark('shot-2')
    await must(page.locator('.voters'), 'shot 2 voters')
    await must(page.locator('.dash-invite'), 'shot 2 invite')
    await claim(
      'shot-2',
      'three friends have voted and the invite link is on screen',
      async () => (await countOf('.voters .voter')) >= 3 && (await countOf('.dash-invite')) > 0
    )
    await finishShot('shot-2', 13_000)

    await nextSegment()

    await page.goto(new URL('/t/tokyo-nov-2026/swipe', baseUrl).href, { waitUntil: 'domcontentloaded' })
    const counter = page.locator('.deck-count')
    await must(counter, 'shot 3 deck counter')
    await page.getByText(exactText('Reel 1 Of 20')).waitFor()
    await mark('shot-3')
    await claim(
      'shot-3',
      'the deck opens on the first of twenty reels',
      async () =>
        ((await counter.textContent()) ?? '').trim() === 'Reel 1 Of 20' || `counter read ${await counter.textContent()}`
    )

    // The deck decodes reel video, and on a memory-tight machine the in-renderer recorder crashes the tab around the
    // fifth card. The counter tells the viewer the rest, so the take is tunable rather than fixed.
    // The first reel opens on the creator's own burned-in title card, still typing itself on, and the card stack is
    // still animating in. Both read as a broken render if the camera moves before they settle.
    await pause(4_000)
    const swipePlan = ['keep', 'keep', 'pass', 'keep', 'pass', 'keep']
    const swipes = swipePlan.slice(0, Number(process.env.DEMO_DECK_SWIPES ?? 6))
    for (const direction of swipes) {
      const topCard = page.locator('.deck-card[data-depth="0"]')
      await must(topCard, `deck card to ${direction}`)
      const from = await centerOf(topCard)
      const deltaX = direction === 'keep' ? 260 : -260
      const to = { x: from.x + deltaX, y: from.y }
      const before = await counter.textContent()
      await gesture(page, from, to)
      pointer = to
      await page.waitForFunction(
        (sel, text) => {
          const el = document.querySelector(sel)
          return el && el.textContent !== text
        },
        '.deck-count',
        before,
        { timeout }
      )
      // A swipe every half second is a blur of half-dissolved cards. The reel is the vote, so each one has to be seen.
      await pause(2_200)
    }
    await finishShot('shot-3', 21_000)

    await page.goto(new URL('/t/tokyo-nov-2026/votes', baseUrl).href, { waitUntil: 'domcontentloaded' })
    await must(page.locator('.tally-row'), 'shot 4 tally rows')
    await mark('shot-4')
    await pause(3_000)
    const eliminated = page.locator('.tally-row[data-out="true"]').first()
    await scrollTo(eliminated, 2_500)
    await claim(
      'shot-4',
      'twenty-four places ranked, three of them unanimous',
      // Scoped to the tally. Unscoped, this counted every gold chip on the page and passed on a state where no row
      // was unanimous at all, which is the claim the narration actually makes.
      async () => (await countOf('.tally-row')) >= 20 && (await countOf('.tally-row[data-state="gold"]')) >= 3
    )
    await finishShot('shot-4', 53_000)

    await nextSegment()

    await page.goto(new URL('/desk', baseUrl).href, { waitUntil: 'domcontentloaded' })
    await must(page.locator('.desk-day'), 'shot 5 day columns')
    await must(page.locator('.desk-pool'), 'shot 5 sidebar')
    await mark('shot-5')
    // Read the shape off the board rather than asserting twelve. Since #136 a day's period can hold a second slot,
    // so twelve is the opening state, not a property of the calendar. What the narration actually claims is that
    // every day starts empty with a slot per period and the sidebar holds what won.
    await claim('shot-5', 'a slot for every period of every day, all empty, beside a sidebar of what won', async () => {
      const days = await countOf('.desk-day')
      const slots = await countOf('.slot-drop')
      const filled = await countOf('.card-placed')
      const waiting = await countOf('.desk-poollist .card-pool')
      if (days < 1) return 'no day columns on the board'
      if (slots !== days * 3) return `${slots} slots across ${days} days, expected ${days * 3}`
      if (filled !== 0) return `${filled} slots already filled, the board is not empty`
      if (waiting < 1) return 'the sidebar holds nothing'
      return true
    })
    await finishShot('shot-5', 11_000)

    await mark('shot-6')
    await must(page.locator('.desk-poollist .card-pool'), 'shot 6 sidebar cards')
    const targets = [
      { day: 0, slot: 0 },
      { day: 1, slot: 0 },
      { day: 2, slot: 0 },
      { day: 3, slot: 0 },
      { day: 0, slot: 1 }
    ]
    await page.locator('.desk-grid').scrollIntoViewIfNeeded()
    for (const target of targets) {
      const card = page.locator('.desk-poollist .card-pool').first()
      const slot = page.locator('.desk-day').nth(target.day).locator('.slot-drop').nth(target.slot)
      const from = await centerOf(card)
      const to = await centerOf(slot, false)
      await gesture(page, from, to)
      pointer = to
      await pause(600)
    }
    await claim(
      'shot-6',
      'she has dragged winners into the days herself',
      async () => (await countOf('.card-placed')) >= 4
    )
    await finishShot('shot-6', 12_000)

    await mark('shot-7')
    await click(page.locator('.desk-apply'), 500)
    await page.locator('.card-placed').first().waitFor()
    await page.locator('.desk-dayhead .state-chip').first().waitFor()
    await pause(3_000)

    // Apply lays each day out in the scheduler's own order, so every day it fills is green by construction. Gold is
    // only reachable when the order is not the scheduler's, and the cheapest way there is to swap a day's afternoon
    // and evening stops: same three places, same cluster, worse route. On Sensoji's day that costs 15 minutes over
    // the heuristic order, which clears the 1.25 GOLD_SLACK in v2/src/lib/schedule.ts.
    //
    // Nothing here names a place or a day index. Which day Sensoji lands on depends on the order shot-6 dragged the
    // pool into, and which stops share it depends on how Aisyah swiped, so both are read off the board at the time.
    let goldDayIndex = -1
    const dayCount = await page.locator('.desk-day').count()
    for (let index = 0; index < dayCount; index += 1) {
      const onThisDay = await page
        .locator('.desk-day')
        .nth(index)
        .locator('.card-placed')
        .filter({ hasText: 'Sensoji' })
      if ((await onThisDay.count()) > 0) {
        goldDayIndex = index
        break
      }
    }
    if (goldDayIndex < 0) throw new Error('required recording anchor is absent: shot 7 Sensoji day')
    const goldDay = page.locator('.desk-day').nth(goldDayIndex)
    // Since #136 a .desk-slot is a period group holding one or two cells, not a single slot, and a day can run to
    // six. Addressing a period by its index within the day is therefore a guess about shape. Address it by the
    // heading it carries instead, and take the first cell inside it, which is the one the scheduler filled.
    const periodGroup = (label) => goldDay.locator('.desk-slot').filter({ has: page.getByText(exactText(label)) })
    const afternoon = periodGroup('Afternoon')
    const evening = periodGroup('Evening')
    await must(afternoon, 'shot 7 afternoon period')
    await must(evening, 'shot 7 evening period')
    const afternoonName = (await afternoon.locator('.card-placed').first().innerText()).split('\n')[0]

    // A card dropped on an occupied slot evicts the occupant to the sidebar rather than trading places with it, so
    // the swap is two gestures: move the evening stop up, then bring the evicted afternoon stop back down.
    const eveningGrip = evening.locator('.card-placed .card-grip').first()
    await must(eveningGrip, 'shot 7 evening card')
    await moveTo(eveningGrip)
    const target = await centerOf(afternoon.locator('.slot-drop').first())
    await gesture(page, await centerOf(eveningGrip), target)
    pointer = target
    await pause(1_600)

    // The chip cannot turn gold yet. Halfway through the swap the day holds two stops, not three, and two stops in
    // either order are the scheduler's own order, so it is still green. Gold is a property of the finished swap, and
    // asserting it here is what broke the beat: the day is measured against its own best route, not against Apply's.
    const displaced = page.locator('.desk-poollist .card-pool').filter({ hasText: afternoonName })
    await must(displaced, 'shot 7 displaced card')
    const backTo = await centerOf(evening.locator('.slot-drop').first())
    await moveTo(displaced.first())
    await gesture(page, await centerOf(displaced.first()), backTo)
    pointer = backTo
    const goldChip = goldDay.locator('.state-chip[data-state="gold"]')
    await must(goldChip, 'shot 7 gold day chip')
    await pause(3_200)
    // The info dot opens on mouseenter and its click handler toggles, so Playwright's click closes the bubble it just
    // opened. Hovering is what a person does, and it is what leaves the rationale on screen.
    await moveTo(goldDay.locator('.desk-fit .info-dot'))
    await goldDay.locator('.desk-fit .info-dot').hover()
    await must(page.locator('.info-bubble'), 'shot 7 gold rationale')
    await pause(4_500)
    await claim('shot-7', 'twelve slots filled, exactly one day gold, its rationale on screen', async () => {
      const filled = await countOf('.card-placed')
      const gold = await countOf('.state-chip[data-state="gold"]')
      const bubble = await countOf('.info-bubble')
      if (filled !== 12) return `${filled} slots filled, expected 12`
      if (gold !== 1) return `${gold} gold days, expected 1`
      if (bubble < 1) return 'the gold rationale is not on screen'
      return true
    })
    await finishShot('shot-7', 48_000)

    await mark('shot-8')
    const sensoji = page.locator('.card-placed').filter({ hasText: 'Sensoji' })
    await must(sensoji, 'shot 8 Sensoji card')
    const pin = sensoji.locator('.card-act[aria-pressed]')
    await click(pin, 500)
    await click(page.locator('.desk-apply'), 500)
    await page.locator('.card-placed[data-pinned="true"]').first().waitFor()
    await page.locator('.desk-dayhead .state-chip').first().waitFor()
    await pause(1_500)
    await claim(
      'shot-8',
      'Sensoji is pinned and the day rebuilt around it',
      async () => (await page.locator('.card-placed').filter({ hasText: 'Sensoji' }).getByText('Unpin').count()) > 0
    )
    await finishShot('shot-8', 11_000)

    await nextSegment()

    await page.goto(new URL('/desk/before-we-go', baseUrl).href, { waitUntil: 'domcontentloaded' })
    await must(page.locator('.bwg-row'), 'shot 9 checklist rows')
    await mark('shot-9')
    await click(page.locator('.bwg-row').nth(0).locator('.check-label'), 500)
    await click(page.locator('.bwg-row').nth(1).locator('.check-label'), 500)
    await click(page.locator('.bwg-row').nth(2).locator('.check-label'), 500)
    await claim('shot-9', 'the checklist is derived from a calendar that has stops on it', async () => {
      const text = await page.locator('.bwg-list').innerText()
      return /not on the calendar yet|nothing on the calendar yet/i.test(text)
        ? 'the checklist is reading an empty calendar'
        : true
    })
    await finishShot('shot-9', 18_000)

    await page.goto(new URL('/t/tokyo-nov-2026', baseUrl).href, { waitUntil: 'domcontentloaded' })
    const spreads = page.locator('.day-spread')
    await must(spreads.first(), 'shot 10 book day plates')
    await mark('shot-10')
    const count = await spreads.count()
    for (let i = 0; i < count; i += 1) {
      await spreads.nth(i).scrollIntoViewIfNeeded()
      await pause(2_500)
    }
    await claim('shot-10', 'four plates, each drawing its route, each with a Transit Route link', async () => {
      const maps = await countOf('a[href*="google.com/maps"]')
      const drawn = await countOf('.day-spread svg path')
      if (maps !== 4) return `${maps} Transit Route links, expected 4`
      if (drawn < 4) return `${drawn} drawn routes, expected at least 4 -- plates are placeholders`
      return true
    })
    await finishShot('shot-10', 21_000)

    await showCard(
      'Built With',
      'React 19',
      'React Router, dnd-kit for the drag surface, TypeScript, Vite, deployed on Cloud Run. No backend and no API key: the only call that leaves the browser is the reel video.',
      'Build phase &middot; 21 Sept to 11 Oct'
    )
    await mark('stack')
    await finishShot('stack', 20_000)

    await showCard('TolongLabs', 'Perch', 'Built for the one friend who always ends up planning it.')
    await mark('close')
    await finishShot('close', 17_000)

    await mark('end')
    assertCompleteTake(beats)
  } catch (error) {
    failure = error
  } finally {
    try {
      await closeSegment()
    } catch (error) {
      failure = failure ?? error
    }
    await browser.close()
    if (segments.length === 1) {
      tighten(segments[0])
    } else if (segments.length > 1) {
      const list = join(videoDir, 'segments.txt')
      writeFileSync(list, `${segments.map((path) => `file '${path}'`).join('\n')}\n`)
      const raw = join(videoDir, 'joined.webm')
      const joined = spawnSync(
        process.env.DEMO_FFMPEG ?? 'ffmpeg',
        ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', raw],
        { encoding: 'utf8' }
      )
      if (joined.status !== 0) failure = failure ?? new Error(`could not join capture segments: ${joined.stderr}`)
      else tighten(raw)
    }
    writeFileSync(join(demoDir, 'beats.json'), `${JSON.stringify(beats, null, 2)}\n`)
  }

  if (claims.length > 0) {
    console.log('\nclaim checks, one per beat, asserted where the narration makes its claim:')
    for (const entry of claims) {
      const mark_ = entry.ok ? 'PASS' : 'FAIL'
      console.log(`  ${mark_}  ${entry.beat.padEnd(8)} ${entry.statement}${entry.detail ? ` -- ${entry.detail}` : ''}`)
    }
    const failed = claims.filter((entry) => !entry.ok)
    if (failed.length > 0) {
      failure = failure ?? new Error(`${failed.length} claim check(s) failed: ${failed.map((e) => e.beat).join(', ')}`)
    }
  }

  console.log(`video: ${capturePath}`)
  console.log(`beats: ${join(demoDir, 'beats.json')}`)
  console.log(`console errors: ${errors.length}`)
  for (const error of errors.slice(0, 5)) console.log(`  ! ${error}`)
  if (failure) throw failure
  return { capturePath, beats, errors }
}

async function main() {
  try {
    await recordDemo()
  } catch (error) {
    console.error(`recording failed: ${error instanceof Error ? error.message : String(error)}`)
    process.exitCode = 1
  }
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (entry === import.meta.url) await main()
