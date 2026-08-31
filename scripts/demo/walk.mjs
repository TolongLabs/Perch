// The walk: what the camera does, in order. **This is the file you edit.**
// `record.mjs` is the runner and does not change as the product does.
//
// It is a placeholder right now because there is no product yet. It films the
// landing page and stops, which is enough to prove the pipeline end to end
// before there is anything worth filming.
//
// Four rules, all of them learned the expensive way on the project this came
// from. They are worth more than the code below.
//
// 1. **Be deliberately slow.** Default automation clicks and types instantly,
//    which reads as fake on camera. Hold on anything a viewer has to read.
//    Two to three seconds is normal; it feels far too long while you are editing
//    and correct when you watch it back.
//
// 2. **A beat has to outlast the line written over it.** `schedule.py` pushes any
//    narration line that would still be speaking when the next begins -- so one
//    short beat delays every line after it. If a line reads for 6.5s, the beat it
//    sits on needs about 7s of picture.
//
// 3. **`mark()` after the wait, not before.** The beat should point at the settled
//    frame, otherwise the narration starts while the page is still painting.
//
// 4. **Count what you filmed.** Set `filmed.<surface> = 1` once a surface is
//    actually on screen, and guard it with a real visibility check. A beat that
//    silently did not render leaves a shorter video that still plays, and the
//    narration reads a claim over a picture that does not show it.
//
// Wait on a state the UI exposes -- an element, a class -- never on a phrase.
// Matching a regex against page text is a check that owns its own definition of
// success: when the wording changes it waits out the full timeout, swallows it,
// and records dead frames while the app was in fact working.

export async function walk({ page, mark, beat, filmed, WEB }) {
  filmed.landing = 0

  // 1. Landing. `networkidle` rather than `load`: anything that fetches after
  //    first paint is exactly the content worth filming.
  await page.goto(WEB, { waitUntil: 'networkidle' })
  await beat(2600)
  mark('landing')
  if (
    await page
      .locator('body')
      .isVisible()
      .catch(() => false)
  ) {
    filmed.landing = 1
  }
  await beat(5600)

  // 2. Onwards. Add the real walk here as the product exists, one numbered step
  //    per beat, each ending in a mark() and a hold. A sketch of the shape:
  //
  //    const cta = page.locator('[data-demo="primary-cta"]').first()
  //    if (await cta.isVisible().catch(() => false)) {
  //      await cta.scrollIntoViewIfNeeded()
  //      await beat(1400)
  //      mark('cta')
  //      await beat(7000)
  //      filmed.cta = 1
  //    } else {
  //      console.log('  ! the primary CTA did not render -- that beat did not film')
  //    }
  //
  // Prefer a `data-demo` attribute over a CSS class or visible text. A class is a
  // styling decision that will change without anyone thinking about this file; a
  // `data-demo` hook is a promise the app makes to the camera.

  mark('end')
}
