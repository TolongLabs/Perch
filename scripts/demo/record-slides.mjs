/**
 * Films the two deck slides the submission template asks for as their own
 * segment: the tech stack, and the build plan.
 *
 *     DEMO_DIR=... DEMO_PLAYWRIGHT=/path/to/playwright/index.mjs \
 *       node scripts/demo/record-slides.mjs
 *
 * A slide is a still, so the walkthrough is the camera. Each beat fits one region
 * of a slide to the frame, holds it long enough to read, and moves on; each slide
 * opens and closes pulled back, so the reader sees where the pieces sat.
 *
 * Every beat carries both a region and the exact string that has to be inside it.
 * The region is what the camera does; the string is what makes a wrong region
 * fail. Framing by position alone has broken the other recorder four times - a
 * panel inserted upstream reframes an nth() and the take still passes - so the
 * claim here is that the named label is genuinely inside the frame, at a size
 * that can be read, after the move has settled.
 *
 * Regions are in the deck's authored 1920x1080 coordinates. The zoom is derived
 * from the region rather than set by hand, so a region that grows stays framed.
 *
 * Output matches record.mjs so the two segments concatenate: 1440x900 webm, a
 * beats file of offsets, and a printed claim per beat.
 */
import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const DECK = new URL('../../docs/demo/slides.html', import.meta.url)

/** Never magnify past this, however small a region is. */
const MAX_ZOOM = 2.4
const CAMERA_MS = 1_100

/**
 * `slide` is the number the slide prints in its footer, so a reordered deck fails
 * here rather than filming the wrong page. `holds` is the exact string that must
 * end up inside the frame. `region` is in authored slide coordinates; null frames
 * the whole slide.
 */
const BEATS = [
  { name: 'stack-1', slide: 16, holds: null, region: null, hold: 4_500 },
  {
    name: 'stack-2',
    slide: 16,
    holds: 'The Prototype: In The Browser, Nowhere Else',
    region: { x: 96, y: 300, w: 750, h: 430 },
    hold: 8_000
  },
  {
    name: 'stack-3',
    slide: 16,
    holds: 'Not In The Prototype, On Purpose',
    region: { x: 840, y: 515, w: 460, h: 225 },
    hold: 6_500
  },
  {
    name: 'stack-4',
    slide: 16,
    holds: 'The Network, In Full',
    region: { x: 900, y: 300, w: 390, h: 280 },
    hold: 6_000
  },
  {
    name: 'stack-5',
    slide: 16,
    holds: 'The Build, From 21 September',
    region: { x: 1284, y: 300, w: 556, h: 480 },
    hold: 9_500
  },
  { name: 'stack-6', slide: 16, holds: 'How It Ships', region: { x: 96, y: 725, w: 1200, h: 160 }, hold: 6_500 },
  { name: 'plan-1', slide: 17, holds: null, region: null, hold: 4_500 },
  {
    // The two phases that matter, not the whole rule: a full-width timeline fits
    // the frame at 1.1x, which is not a camera move, it is a still.
    name: 'plan-2',
    slide: 17,
    holds: 'Deployment, Bug Fixes Only',
    region: { x: 552, y: 245, w: 860, h: 150 },
    hold: 7_500
  },
  { name: 'plan-3', slide: 17, holds: 'Week 1', region: { x: 88, y: 468, w: 600, h: 250 }, hold: 5_500 },
  { name: 'plan-4', slide: 17, holds: 'Week 2', region: { x: 680, y: 468, w: 600, h: 250 }, hold: 5_500 },
  { name: 'plan-5', slide: 17, holds: 'Week 3', region: { x: 1272, y: 468, w: 600, h: 250 }, hold: 5_500 },
  {
    name: 'plan-6',
    slide: 17,
    holds: 'What The Build Phase Will Not Build',
    region: { x: 80, y: 710, w: 910, h: 240 },
    hold: 6_500
  },
  {
    name: 'plan-7',
    slide: 17,
    holds: 'What We Have To Spend',
    region: { x: 972, y: 710, w: 868, h: 240 },
    hold: 6_000
  },
  { name: 'plan-8', slide: 17, holds: null, region: null, hold: 4_000 }
]

export async function record(options = {}) {
  const demoDir = options.demoDir ?? process.env.DEMO_DIR ?? join(tmpdir(), 'perch-demo')
  const videoDir = join(demoDir, 'video-slides')
  rmSync(videoDir, { recursive: true, force: true })
  mkdirSync(videoDir, { recursive: true })

  // A bare specifier resolves normally; an absolute path has to become a file URL
  // first, because Windows paths start with a drive letter and Node reads that as
  // an unsupported URL scheme.
  const configured = process.env.DEMO_PLAYWRIGHT || 'playwright'
  const specifier = /^(\/|[A-Za-z]:[\/])/.test(configured) ? pathToFileURL(configured).href : configured
  const { chromium } = await import(specifier)
  const browser = await chromium.launch({ channel: 'chrome', args: ['--force-color-profile=srgb'] })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 810 },
    recordVideo: { dir: videoDir, size: { width: 1440, height: 810 } }
  })
  const page = await context.newPage()

  const errors = []
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.goto(DECK.href, { waitUntil: 'networkidle' })
  // Newsreader is named only in SVG presentation attributes, so nothing requests
  // it and fonts.ready resolves without it. Film it missing and every italic
  // caption on the slide is Times.
  await page.evaluate(async () => {
    for (const face of ['300 16px Quicksand', '700 16px Quicksand', 'italic 400 16px Newsreader']) {
      await document.fonts.load(face, 'Ag')
    }
    await document.fonts.ready
  })
  await page.addStyleTag({
    content: `
      html, body { background: #2E261F; }
      .hint { display: none !important; }
      .slide { transition: transform ${CAMERA_MS}ms cubic-bezier(.4, 0, .2, 1); will-change: transform; }
    `
  })

  const started = Date.now()
  const beats = []
  const claims = []

  let onScreen = null
  let stage = null

  async function showSlide(number) {
    if (onScreen === number) return
    stage = await page.evaluate((want) => {
      const slides = [...document.querySelectorAll('.slide')]
      const index = slides.findIndex((s) => {
        const label = s.querySelector('.foot .num, .run')
        return label && label.textContent.trim().startsWith(String(want).padStart(2, '0'))
      })
      if (index === -1) return null
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index)
        s.style.transform = ''
      })
      const target = slides[index]
      target.style.transformOrigin = '0 0'
      const r = target.getBoundingClientRect()
      return { w: r.width, h: r.height }
    }, number)
    if (!stage) throw new Error(`no slide prints the number ${number}; the deck was reordered`)
    onScreen = number
    await page.waitForTimeout(450)
  }

  /** Fit `region` (authored coordinates) to the frame, or pull back if it is null. */
  async function frameOn(region) {
    return page.evaluate(
      ([box, maxZoom, stage]) => {
        const slide = document.querySelector('.slide.active')
        // The deck scales itself to the viewport, so authored units are not
        // rendered units. Everything below works in rendered ones.
        const unit = stage.w / 1920
        if (!box) {
          slide.style.transform = 'none'
          return { zoom: 1 }
        }
        const w = box.w * unit
        const h = box.h * unit
        const zoom = Math.min(window.innerWidth / w, window.innerHeight / h, maxZoom)
        const cx = (box.x + box.w / 2) * unit
        const cy = (box.y + box.h / 2) * unit
        let tx = window.innerWidth / 2 - cx * zoom
        let ty = window.innerHeight / 2 - cy * zoom
        // Never pan past the slide's own edges: paper missing off one side of the
        // frame reads as a bug, not a camera move.
        const sw = stage.w * zoom
        const sh = stage.h * zoom
        tx = sw <= window.innerWidth ? (window.innerWidth - sw) / 2 : Math.min(0, Math.max(tx, window.innerWidth - sw))
        ty = sh <= window.innerHeight ? (window.innerHeight - sh) / 2 : Math.min(0, Math.max(ty, window.innerHeight - sh))
        // The deck scales itself with CSS `zoom`, not transform, so a translate
        // written here is multiplied by that zoom before it reaches the screen.
        // Divide it back out, or every pan lands short by exactly that factor.
        slide.style.transform = `translate(${tx / unit}px, ${ty / unit}px) scale(${zoom})`
        return { zoom }
      },
      [region, MAX_ZOOM, stage]
    )
  }

  for (const beat of BEATS) {
    await showSlide(beat.slide)
    beats.push({ name: beat.name, ms: Date.now() - started })
    const { zoom } = await frameOn(beat.region)
    await page.waitForTimeout(CAMERA_MS + 200)

    // What the camera sees, not what the page contains: the named string has to
    // be wholly inside the viewport, at a size that survives the film's encoder.
    const seen = await page.evaluate(
      ([wanted]) => {
        if (!wanted) return { inFrame: true, px: 0, found: true }
        const slide = document.querySelector('.slide.active')
        const want = wanted.trim().toLowerCase()
        const hit = [...slide.querySelectorAll('*')].find(
          (el) => el.children.length === 0 && el.textContent.trim().toLowerCase() === want
        )
        if (!hit) return { inFrame: false, px: 0, found: false }
        const r = hit.getBoundingClientRect()
        const inFrame =
          r.left >= -2 && r.top >= -2 && r.right <= window.innerWidth + 2 && r.bottom <= window.innerHeight + 2
        return { inFrame, px: Math.round(r.height), found: true }
      },
      [beat.holds]
    )

    if (!seen.found) throw new Error(`${beat.name}: nothing on slide ${beat.slide} reads exactly "${beat.holds}"`)
    const pass = seen.inFrame && (beat.holds === null || seen.px >= 11)
    claims.push({ beat: beat.name, holds: beat.holds ?? 'the whole slide', pass, px: seen.px, zoom })
    if (!pass) {
      throw new Error(`${beat.name}: "${beat.holds}" is not readable inside the frame (${seen.px}px, in=${seen.inFrame})`)
    }

    await page.waitForTimeout(beat.hold)
  }

  beats.push({ name: 'end', ms: Date.now() - started })
  await page.waitForTimeout(500)

  const video = page.video()
  await context.close()
  const out = join(demoDir, 'capture-slides.webm')
  renameSync(await video.path(), out)
  await browser.close()
  writeFileSync(join(demoDir, 'beats-slides.json'), `${JSON.stringify(beats, null, 2)}\n`)

  console.log(`capture-slides.webm  ${(beats.at(-1).ms / 1000).toFixed(1)}s  ${BEATS.length} beats`)
  for (const c of claims) {
    console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.beat.padEnd(8)} x${c.zoom.toFixed(2)}  ${String(c.px).padStart(3)}px  ${c.holds}`)
  }
  console.log(`  console errors: ${errors.length}`)
  if (errors.length) throw new Error(`the deck logged ${errors.length} console errors during the take`)
  return { out, beats, claims }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await record()
}
