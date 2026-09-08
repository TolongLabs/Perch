# Demo Recorder

Films the deployed site with a scripted browser, dubs it with a local synthetic voice, burns in subtitles, and muxes the
three into one MP4. Free, local, no account, no API key.

> **This is experimental and expected to change.** It was carried in from another project because the hard parts are
> already solved there, not because it is finished. Treat every file here as a draft to edit in place - there is no
> stable interface to preserve, and refinements are expected throughout the hackathon.

```
narration.txt ──► speak.py ──► narration-segments/*.wav ──► schedule.py ──┐
                                                        └──► subtitles.py ┤
                                                                          ├──► ffmpeg ──► TolongLabs.mp4
record.mjs ──► capture.webm ──► assemble.sh ──► capture-joined.mp4 ────────┘
            └► beats.json ──────────┘
```

**Both the voice and the subtitles read the same `lines.json`**, so what is spoken and what is written cannot disagree.
**Narration is keyed to beats the capture measures, not to fixed timestamps**, so a page that gets slower moves the
narration with it rather than drifting out of sync.

---

## Provenance, And Why It Is Declared Here

**This directory is the one piece of carried-in work in the repository, and its lineage has two hops.**

| When                 | What                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **28 - 30 Aug 2026** | The original harness was written in `TolongLabs/MakanLah`. `record.mjs` and `narrate.sh` were first committed on 28 August      |
| **5 Sept 2026**      | The same author ported it into `MUBA-M1KU/Cekgu` and hardened it there: Kokoro narration, shot checks, and tests                |
| **8 Sept 2026**      | That hardened copy was carried into this repository, replacing the 30 August files in place. This README was rewritten to match |

Dates are from those repositories' git histories, not from memory.

**Why the two hops are declared separately.** The competition rules require the project to be developed after the
problem statements were released on 30 August 2026, and list _"incorporating unauthorized external code without
declaration"_ among the grounds for immediate disqualification. Only the first hop predates that release; the 5
September work does not, so the originality rule does not reach it.

**The second hop is recorded because the organisation name changes and a reviewer would otherwise have to guess.**
`MUBA-M1KU/Cekgu` is not a CodeNection 2026 entry, and every commit to its `scripts/demo/` is by the same author, Hee Zi
Jie, so no outside developer is in this code and no asset crossed between competing teams. It is the team's own build
tooling throughout.

|                      |                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------- |
| **What it is**       | Build tooling that records a video of the product. A camera, not a feature         |
| **Where it runs**    | `scripts/`, never `v2/src/` or the deployed app. Nothing here ships to a user      |
| **What it produces** | A video file. No line of this directory ends up in the submitted product           |
| **What it costs**    | Nothing in `package.json`. Playwright, Kokoro and ffmpeg all live outside the repo |

**Declare it plainly in the submission README** alongside the video, in one sentence: the walkthrough video was recorded
with a browser-automation harness the team wrote for an earlier project, and the harness is in `scripts/demo/`. That is
cheaper than being asked.

**This is the one piece of prior work in the repository, and the exception is not to be widened.** If a second piece of
earlier work ever looks tempting, that is the moment to ask a mentor rather than to copy it.

---

## What Is Generic And What You Edit

The split is the whole design. **Two files know about our product and the rest do not.**

| File                                 | Changes When                                                                |
| ------------------------------------ | --------------------------------------------------------------------------- |
| **`record.mjs`**                     | **The product changes.** What the camera does, in order, and the beat names |
| **`narration.txt`**                  | **The script changes.** What is said, keyed to those beats                  |
| `check-shots.mjs`                    | With `record.mjs`. Asserts every anchor exists before a take is wasted      |
| `speak.py`                           | Rarely. Text on stdin, 16-bit PCM wav out                                   |
| `speak-chatterbox.py`                | Rarely. Same contract, cloned voice instead of a synthetic one              |
| `schedule.py`                        | Never, ideally. Stops lines talking over each other                         |
| `subtitles.py`                       | Never, ideally. `lines.json` plus wav durations to SRT                      |
| `narrate.sh`                         | Rarely. Orchestrates the above and muxes the deliverable                    |
| `assemble.sh`                        | When slides are appended to the capture                                     |
| `assemble-deck.sh`, `shoot-deck.mjs` | Only for a slides-only film with no browser capture                         |
| `slides/render.mjs`                  | Rarely. Slide HTML to PNG, with a subtitle-collision check                  |

**`walk.mjs` is gone.** The older harness split the camera moves into `walk.mjs` and the recording into `record.mjs`;
this one folds both into `record.mjs`, because a beat's measured offset and the gesture that caused it have to be
written next to each other or they drift apart. Nothing else referenced it.

---

## Install

**One-time, and none of it lands in the repo.** A browser and a 3 GB torch stack have no business in the app's
dependency tree.

```bash
# 1. Playwright, outside the repo. Any checkout that already has it will do.
export DEMO_PLAYWRIGHT="/path/to/a/playwright/index.mjs"   # or leave unset to resolve 'playwright' normally

# 2. Kokoro, in its own venv. No reference clip, no account, no key.
export KOKORO_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/perch-video/kokoro"
mkdir -p "$KOKORO_HOME"
uv venv --python 3.11 "$KOKORO_HOME/.venv"
uv pip install --python "$KOKORO_HOME/.venv/bin/python" kokoro-onnx soundfile
curl -fL https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx \
  -o "$KOKORO_HOME/kokoro-v1.0.onnx"
curl -fL https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin \
  -o "$KOKORO_HOME/voices-v1.0.bin"
```

`ffmpeg` and `ffprobe` must be on `PATH`. If Kokoro is already installed elsewhere, point `KOKORO_HOME` at it rather
than installing a second copy.

**`speak-chatterbox.py` clones a real voice and is a GPU path.** On a CPU-only machine it is roughly three seconds per
sampling step against a limit of a thousand steps per line, which puts one line in the tens of minutes. `speak.py` is
the default for that reason. If you try it anyway, `torch.backends.mkldnn.enabled = False` must be set before the
`chatterbox` import and eager attention plus the `MATH` SDPA backend must both be on, or some CPUs emit all-NaN audio
that surfaces two layers away as `Audio buffer is not finite everywhere`.

---

## Run It

```bash
export DEMO_DIR="$HOME/.cache/perch-demo/take"      # real disk, never /tmp; see the tmpfs section below
export TMPDIR="$HOME/.cache/perch-demo/tmp"        # the browser's own scratch, also never /tmp
export KOKORO_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/perch-video/kokoro"
mkdir -p "$DEMO_DIR" "$TMPDIR"

node scripts/demo/check-shots.mjs      # every row must read PRESENT
node scripts/demo/record.mjs           # capture.webm + beats.json
bash scripts/demo/narrate.sh           # dub, subtitle, mux -> TolongLabs.mp4
```

`assemble.sh` sits between the last two only when slides are being appended to the capture; a walkthrough-only film
skips it and points `DEMO_SOURCE` at the normalised capture instead.

**Read `record.mjs`'s output before narrating.** It prints every beat it recorded. A line in `narration.txt` naming a
beat that never happened is dropped with a warning - the safe failure, but it means the video is missing something you
meant to show.

Everything is written to `DEMO_DIR`, never into the repo. **Do not commit the output**; `.mp4`, `.webm`, `.wav` and
`.srt` are gitignored for that reason.

### Environment

| Variable                    | Default                                    | Is                                                  |
| --------------------------- | ------------------------------------------ | --------------------------------------------------- |
| `DEMO_DIR`                  | `$TMPDIR/perch-demo`                       | Where everything is read from and written           |
| `DEMO_URL`                  | The deployed Cloud Run URL in `record.mjs` | The site to film. **Never a vite dev server**       |
| `DEMO_PLAYWRIGHT`           | `playwright`                               | Module specifier for a Playwright outside the repo  |
| `KOKORO_HOME`               | `$XDG_DATA_HOME/perch-video/kokoro`        | Model, voices, and the Kokoro venv                  |
| `DEMO_PYTHON`               | `$KOKORO_HOME/.venv/bin/python`            | Python with Kokoro installed                        |
| `DEMO_SPEAK`                | `speak.py`                                 | Swap for `speak-chatterbox.py` to clone a voice     |
| `DEMO_VOICE` / `DEMO_SPEED` | `af_heart` / `1.0`                         | Kokoro voice and speed                              |
| `DEMO_SCRIPT`               | `narration.txt`                            | Beat-keyed narration text                           |
| `DEMO_SOURCE`               | `$DEMO_DIR/capture-joined.mp4`             | The video that receives narration                   |
| `DEMO_OUT`                  | `$DEMO_DIR/TolongLabs.mp4`                 | The deliverable. The submission wants the team name |
| `DEMO_HEADLESS`             | Headless unless `false`                    | Show the recording browser                          |
| `DEMO_DECK_SWIPES`          | `6`                                        | Reels swiped on camera in the deck beat             |
| `DEMO_TOTAL_SECONDS`        | `285`                                      | Joined runtime when slides are appended             |

`DEMO_FFMPEG`, `DEMO_FFPROBE`, `DEMO_PDFINFO` and `DEMO_PDFTOPPM` may point at non-default command locations, and
`DEMO_PRESET` and `DEMO_FPS` override the H.264 preset and frame rate.

---

## This Machine, And What It Will Not Take

Learned the hard way against the deployed site on 8 September, and every one of these is a crash rather than a warning.

| Do                                                       | Not                                                         |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| Playwright's own bundled Chromium, headless              | `channel: 'chrome'`                                         |
| `--disable-gpu --no-sandbox`                             | **`--disable-dev-shm-usage`. Read the section below first** |
| `waitUntil: 'domcontentloaded'`, then wait on a selector | `waitUntil: 'networkidle'`                                  |
| Write `DEMO_DIR` somewhere on disk                       | Leave it under `/tmp`, which here is a 1 GB tmpfs           |
| Film the deployed Cloud Run URL                          | Film `bun run dev`                                          |

### The Flag That Cost An Afternoon

**`--disable-dev-shm-usage` is the wrong advice on this machine, and it fails as a crash rather than an error.** All it
does is move Chrome's shared memory off `/dev/shm` and onto `/tmp`. That is correct inside Docker, where `/dev/shm`
defaults to 64 MB. Here the ratio is inverted:

| Filesystem | Size       | State when this was found |
| ---------- | ---------- | ------------------------- |
| `/tmp`     | 1 GB tmpfs | **99% full, 18 MB free**  |
| `/dev/shm` | 1 GB tmpfs | 95% empty, 983 MB free    |

So the flag pointed the compositor's shared memory at the one filesystem with no room in it. Starving it surfaces as
`traps: Compositor[...] trap int3 ... in chrome-headless-shell` in `dmesg`, and inside Playwright as `Page crashed`,
`Target crashed`, `ERR_INSUFFICIENT_RESOURCES` or a silently unsettled promise — **four different faces on one cause**,
which is why it took so long to see.

**Three things it explains, and every one of them was chased separately as its own bug:** the crash moving to a new
place on every run, tracking whichever allocation happened to land when `/tmp` was tightest; failures scaling with
raster area rather than with free RAM, because a bigger raster needs a bigger shm segment; and the deck being the worst
surface at every scale, because decoding reel video allocates shm on top of the raster.

**`free -m` will not show you this and `dmesg` has no OOM kill**, because it is not system memory. Check `df -h /tmp`
and `df -h /dev/shm` before you believe a memory theory.

**Two more things must be kept off `/tmp`, and both are easy to miss.** A tmpfs is RAM, so anything written there
competes with the browser it is meant to serve.

| What                               | Why it lands on `/tmp`                     | Fix                                                     |
| ---------------------------------- | ------------------------------------------ | ------------------------------------------------------- |
| The capture and the normalised MP4 | `DEMO_DIR` defaults to the system temp dir | Point `DEMO_DIR` at real disk                           |
| The browser's temporary profile    | Playwright creates it under `os.tmpdir()`  | Export `TMPDIR` to a directory on disk before recording |

`TMPDIR` is the one that will not occur to you, because nothing in this pipeline writes it and nothing names it in a
stack trace. A take that dies partway through with `Page crashed` while `/dev/shm` is empty and free RAM looks fine is
this.

**Record at 1440x900 and nothing else.** Below 900px wide the Desk's four day columns stack into one, which is correct
behaviour and the wrong shot; 1440 is also the width The Book's two-column spread is measured at, so it is the single
width that flatters both.

### The Capture Is Filmed In Segments

**The deck is the cliff.** It decodes reel video, and Playwright's in-renderer recorder on top of that exhausts the
machine partway through the swipes. Measured: with the recorder on, the tab dies at the fifth swipe; with the recorder
off, eight swipes pass without complaint. It is the recorder plus the reels together, not either alone, and the margin
is thin enough that adding two beats ahead of the deck was enough to move the crash earlier.

So `record.mjs` closes its browser context immediately before the deck and opens a fresh one, which hands the renderer
its memory back. Three things make that invisible in the finished film:

| Concern                         | How it is handled                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| The trip built so far           | `context.storageState()` is carried into the new context, so the walkthrough continues where it stopped |
| The beat clock                  | Each closed segment is measured with `ffprobe` and its duration becomes the offset for the next         |
| Two video files rather than one | They share a codec and size, so `ffmpeg -f concat -c copy` joins them without re-encoding               |

**`DEMO_DECK_SWIPES` tunes the deck beat**, six by default. Fewer swipes is a smaller cliff, and the counter in the
corner tells the viewer the rest of the deck exists.

**If the crash moves, move the split.** `nextSegment()` can be called between any two beats, and calling it more often
costs only a few seconds of browser startup that never reaches the film.

---

## The State Trap

**An init script that mutates storage re-runs on every page load, not once per context.** The take starts by clearing
`perch.trip.v1` so the date picker is live and the deck opens at reel one. Registered unguarded through
`context.addInitScript`, that clear fires again on every navigation, so each beat after the Desk reads a store that was
emptied a moment earlier.

**It does not fail where it happens.** The Desk still fills, because that all occurs inside one page load. The symptom
appears two beats later, as The Book rendering a cluster title with no stops under it, no route drawing and no Transit
Route link — which reads exactly like a Book bug and is not one. Hours went into reporting it as one.

Guard the clear with a sentinel that survives navigation within the take:

```js
await context.addInitScript(() => {
  try {
    if (sessionStorage.getItem('perch.demo.reset')) return
    localStorage.removeItem('perch.trip.v1')
    sessionStorage.setItem('perch.demo.reset', '1')
  } catch {}
})
```

**The general rule: anything a film's later beats depend on must be set up once, and the setup must prove it ran once.**
`page.reload()` would be the obvious alternative and is unavailable here, because it is one of the two reliable ways to
crash the tab on this machine.

---

## The Cleanup Trap

**A cleanup line that throws turns every success into a reported failure, and the symptom points away from the cause.**
Found by the session shooting the README screens, and it cost this one two takes through the memory contention it
created.

`browser.process()` does not exist in every `playwright-core` build. Called inside a `finally` as a defensive reap, it
throws `TypeError: browser.process is not a function` **after** the capture has already succeeded. The surrounding
`catch` then records the whole shot as failed and retries it — and because the throw happened before `browser.close()`
could run, each retry launches another browser while the previous one is still standing. Three retries a screen, twelve
browsers alive, every capture correct and every capture reported broken.

**The reading that costs you the afternoon is "my captures are failing and something is leaking browsers", because the
captures are fine.** The safe form calls nothing exotic and cannot hang:

```js
} finally {
  await Promise.race([browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 4_000))])
}
```

**Several Playwright calls carry no default timeout, `page.evaluate` among them**, so a wedged renderer hangs with
nothing to interrupt it and a stall becomes a pile-up. Race the whole capture body against an explicit deadline.

**And when you go counting browsers, `ps -eo comm --no-headers -C chrome-headless` does not filter.** `-e` unions with
`-C` rather than intersecting, so it returns every process on the machine — it reported 352 where the truth was 11, and
very nearly justified a kill list aimed at every session on the box. `ps -C chrome-headless --no-headers | wc -l` is the
form that works, and `pgrep -c chrome-headless` is shorter.

---

## The Gesture Trap

**`locator.dragTo()` does not work on either interactive surface**, and it fails silently: the drop does nothing and the
card snaps back, so a take looks like it worked until you watch it.

`@dnd-kit`'s collision detection needs more pointer moves than `dragTo` fires, and the swipe deck reads its travel on
`pointerup`. One helper drives both - real `page.mouse` calls, about fourteen interpolated moves roughly 20ms apart,
then up. Verified against the live site: a card landed on the calendar, and the deck advanced from `Reel 1 Of 20` to
`Reel 2 Of 20`.

**Do not reach for synthetic `PointerEvent` dispatch instead.** The swipe deck calls `setPointerCapture`, which throws
on a pointer id that no real pointer owns.

The deck's commit threshold is 96 pixels horizontal; travel about 260 from the card's centre, right to keep and left to
pass, and wait for the leaving animation before the next swipe.

---

## Setting The Subtitles In The Product's Own Face

**The subtitles are the only type in every frame of the film**, so leaving them in libass's fallback puts a generic sans
over five minutes of a designed interface. `narrate.sh` takes `DEMO_SUBTITLE_FONT`, `DEMO_SUBTITLE_SIZE` and
`DEMO_FONTSDIR`; the defaults are unchanged, so this is opt-in.

**libass cannot read woff2, and the app ships nothing else.** Instance the variable Quicksand to a static TTF once, into
the scratch directory — never into the repo, it is derived from a font already in `v2/public/fonts/`:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

f = TTFont('v2/public/fonts/quicksand-variable.woff2')
f = instancer.instantiateVariableFont(f, {'wght': 500})
f.flavor = None
for rec in f['name'].names:            # the instance inherits "Quicksand Light" from the variable font
    if rec.nameID in (1, 4, 16):
        rec.string = 'Quicksand'
    elif rec.nameID == 2:
        rec.string = 'Regular'
    elif rec.nameID == 6:
        rec.string = 'Quicksand-Regular'
f.save('$DEMO_FONTSDIR/Quicksand-Medium.ttf')
```

**The name-table rewrite is the part that will catch you.** An instanced variable font keeps the family name of the axis
default, so the file reports as `Quicksand Light`. `FontName=Quicksand` then matches nothing, libass falls back to its
default face **without warning**, and the render looks exactly like a fontsdir that failed to load. Check
`getDebugName(1)` on the saved file rather than assuming.

```bash
export DEMO_FONTSDIR="$HOME/.cache/perch-demo/fonts"
export DEMO_SUBTITLE_FONT="Quicksand"
export DEMO_SUBTITLE_SIZE=13
```

---

## Why It Looks The Way It Does

Inherited reasoning, all of it learned by watching a bad render rather than by reasoning about it in advance.

**The pauses are deliberate and they feel far too long while you are editing.** Automation's instinct is to click
instantly, which reads as fake and skips the only thing worth showing. A viewer needs two to three seconds to register
anything they have to read.

**A beat has to outlast the narration line written over it.** `schedule.py` pushes any line that would still be speaking
when the next begins, so one short beat delays every line after it. If a line reads for 6.5 seconds, give its beat about
7 seconds of picture.

**Subtitles are burned in, bottom-centred, at `FontSize=14`.** Two traps, both invisible to a numeric check that looks
for dark pixels near the bottom: `FontSize` is a libass script unit rather than a pixel, so 26 renders enormous at
1080p; and under `BorderStyle=3` the box takes its colour from `OutlineColour`, so an alpha set on `BackColour` is
silently ignored and the scrim comes out fully opaque.

**Cards are split to minimise the longest line, not greedily.** A greedy wrap strands single words, and a one-word card
is a jolt that tends to land on the sentence carrying the product's claim.

---

## What Has Actually Been Verified Here

Being precise about this, because the rest of the document is inherited confidence rather than evidence from this repo.

| Stage                                | Status                                                                                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| The drag and swipe gestures          | **Run here, 2026-09-08**, against the deployed site. A card placed on the calendar; the deck advanced one reel                     |
| Browser launch and navigation limits | **Run here, 2026-09-08.** `channel: 'chrome'`, `networkidle` and `page.reload()` each crashed the page; the documented set did not |
| `schedule.py`, `subtitles.py`        | **Run here, 2026-09-01**, on a synthetic three-line fixture. Overlap detected and pushed 3760ms, five cards wrapped under 42 chars |
| `speak.py`, `narrate.sh`             | Kokoro is installed and imports here. The full narration run has not been made in this repo yet                                    |
| The whole pipeline                   | Produced a 4:45 1920x1080 video on the project it was carried from                                                                 |

**The first person to run it end to end should expect to fix something, and should write down what they fixed.**

---

## Known Gaps

- **`assemble.sh` expects `docs/demo/pitch-deck.pdf`.** That deck is `pitch-smith`'s and does not exist yet, so the
  walkthrough-only path is the one that works today. Point the assembler at the deck rather than making a second one
- **The 3-5 minute window is a floor as well as a ceiling.** `narrate.sh` prints the narration length; check it every
  run, and note that the submission template asks for 4:30 against the 5:00 ceiling
- **`slides/render.mjs` predates this refresh** and still belongs to the older harness. It is untouched and unused by
  the walkthrough path
