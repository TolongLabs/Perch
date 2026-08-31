# Demo Recorder

Films the deployed site with a scripted browser, dubs it in a cloned voice, burns in subtitles, and muxes the three into
one MP4. Free, local, no account, no API key.

> **This is experimental and expected to change.** It was carried in from another project because the hard parts are
> already solved there, not because it is finished. Treat every file here as a draft to edit in place - there is no
> stable interface to preserve, and refinements are expected throughout the hackathon.

```
narration.txt ──► speak.py ──► seg/*.wav ──► schedule.py ──┐
                                        └──► subtitles.py ─┤
                                                           ├──► ffmpeg ──► demo.mp4
walk.mjs ──► record.mjs ──► capture.webm ──► assemble.sh ──┘
                         └► beats.json ────────┘
```

**Both the voice and the subtitles read the same `lines.json`**, so what is spoken and what is written cannot disagree.
**Narration is keyed to beats the capture measures, not to fixed timestamps**, so a page that gets slower moves the
narration with it rather than drifting out of sync with it.

---

## Provenance, And Why It Is Declared Here

**Carried in from `TolongLabs/MakanLah`, where it was written between 28 and 30 August 2026.** CodeNection's problem
statements were released on Kick-Off Day, 30 August, so most of it predates them: `record.mjs` and `narrate.sh` were
first committed on 28 August, two days before. The Chatterbox backend landed on 30 August itself and could fall either
side of the 10:30 AM release. Dates are from that repo's git history, not from memory.

That matters, because the competition rules say the project must be developed after the problem statements were
released, and list _"incorporating unauthorized external code without declaration"_ among the grounds for immediate
disqualification. The declaration is the mitigation, so:

|                      |                                                                                 |
| -------------------- | ------------------------------------------------------------------------------- |
| **What it is**       | Build tooling that records a video of the product. A camera, not a feature      |
| **Where it runs**    | `scripts/`, never `src/` or the deployed app. Nothing here is shipped to a user |
| **Whose it is**      | The same team's prior work, carried across openly, not third-party code         |
| **What it produces** | A video file. No line of this directory ends up in the submitted product        |

**Declare it plainly in the submission README** alongside the video, in one sentence: the walkthrough video was recorded
with a browser-automation harness the team wrote for an earlier project, and the harness is in `scripts/demo/`. That is
cheaper than being asked.

**If in doubt, ask a mentor.** It is exactly the kind of question the mentorship slots are for, it costs nothing to ask,
and the answer is worth recording in the `research` branch's `mentors/` either way.

---

## What Is Generic And What You Edit

The split is the whole design. **Two files know about our product and the rest do not.**

| File                | Changes When                                               |
| ------------------- | ---------------------------------------------------------- |
| **`walk.mjs`**      | **The product changes.** What the camera does, in order    |
| **`narration.txt`** | **The script changes.** What is said, keyed to beats       |
| `record.mjs`        | Rarely. Launches the browser, records, writes `beats.json` |
| `speak.py`          | Rarely. Text in, wav out                                   |
| `schedule.py`       | Never, ideally. Stops lines talking over each other        |
| `subtitles.py`      | Never, ideally. `lines.json` plus wav durations to SRT     |
| `narrate.sh`        | Rarely. Orchestrates the above and muxes the deliverable   |
| `assemble.sh`       | When the slide list changes                                |
| `slides/render.mjs` | Rarely. Slide HTML to PNG, with a subtitle-collision check |

---

## Install

**One-time, and none of it lands in the repo.** A browser and a 3 GB torch stack have no business in the app's
dependency tree.

```bash
# 1. Playwright, into the scratch directory the pipeline works in.
export DEMO_DIR="${TMPDIR:-/tmp}/codenection-demo"
mkdir -p "$DEMO_DIR" && cd "$DEMO_DIR"
bun add -d playwright
bunx playwright install chromium          # or skip, and use the system Chrome

# 2. Chatterbox, in its own venv. It needs torch, which the rest of this does not.
export CHATTERBOX_HOME="$HOME/.local/share/codenection-demo/chatterbox"
mkdir -p "$CHATTERBOX_HOME" && cd "$CHATTERBOX_HOME"
uv venv --python 3.11 .venv
uv pip install --python .venv/bin/python chatterbox-tts torchaudio

# 3. The reference clip the voice is cloned from.
#    10-20 seconds of clean speech, one speaker, no music, no room echo.
cp /path/to/your/recording.wav "$CHATTERBOX_HOME/reference.wav"
```

`ffmpeg` must be on `PATH`. Everything else is resolved from `DEMO_DIR`.

**Kokoro is the fallback** and needs no reference clip, if you want a synthetic voice or Chatterbox is misbehaving:

```bash
mkdir -p ~/.local/share/codenection-demo && cd $_
uv venv --python 3.11 .venv && uv pip install --python .venv/bin/python kokoro-onnx soundfile
curl -sLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -sLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
# then: DEMO_TTS=kokoro bash scripts/demo/narrate.sh
```

---

## Run It

```bash
export DEMO_DIR="${TMPDIR:-/tmp}/codenection-demo"
export DEMO_WEB="https://our-deployed-site"     # the prod URL, not localhost

node scripts/demo/record.mjs                    # capture.webm + beats.json
node scripts/demo/slides/render.mjs             # optional: slide PNGs
bash scripts/demo/assemble.sh                   # optional: join slides onto the capture
bash scripts/demo/narrate.sh                    # dub, subtitle, mux -> demo.mp4
```

**Read `record.mjs`'s output before narrating.** It prints every beat it recorded and every surface it failed to film. A
line in `narration.txt` naming a beat that never happened is dropped with a warning - which is the safe failure, but it
means the video is missing something you meant to show.

Everything is written to `DEMO_DIR`, never into the repo. **Do not commit the output**; `.mp4`, `.webm` and `.srt` are
gitignored for that reason.

### Environment

| Variable                    | Default                                      | Is                                                   |
| --------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `DEMO_DIR`                  | `$TMPDIR/codenection-demo`                   | Where everything is read from and written            |
| `DEMO_WEB`                  | `http://127.0.0.1:5173`                      | The site to film                                     |
| `DEMO_TTS`                  | `chatterbox`                                 | Or `kokoro`                                          |
| `CHATTERBOX_HOME`           | `~/.local/share/codenection-demo/chatterbox` | The venv and the reference clip                      |
| `CHATTERBOX_REF`            | `$CHATTERBOX_HOME/reference.wav`             | The voice to clone                                   |
| `KOKORO_HOME`               | `~/.local/share/codenection-demo`            | Kokoro's model files                                 |
| `DEMO_VOICE` / `DEMO_SPEED` | `jf_nezumi` / `1.0`                          | Kokoro only                                          |
| `DEMO_PAD`                  | `#111111`                                    | Pillarbox colour. **Set this** from `docs/DESIGN.md` |
| `DEMO_SLIDES`               | `arch:20 close:24`                           | `name:seconds`, in order, after the capture          |
| `DEMO_OUT`                  | `$DEMO_DIR/demo.mp4`                         | The deliverable                                      |
| `DEMO_CHANNEL`              | `chrome`                                     | Unset to use Playwright's own Chromium               |

---

## Chatterbox: The One Trap That Will Cost You An Evening

**The attention setting in `speak.py` is not optional and must not be "cleaned up".**

On some CPUs the fused attention kernel emits **all-NaN audio** - every sample, silently - and the failure surfaces two
layers away as `Audio buffer is not finite everywhere`, raised by librosa inside the Perth watermarker. It reads exactly
like a watermarker bug and is not one. The tell is `Could not initialize NNPACK! Reason: Unsupported hardware` in the
startup log.

Two things fix it and **you need both**; disabling either one alone still yields silence:

- `torch.backends.mkldnn.enabled = False`, set **before** the `chatterbox` import
- eager attention plus the `MATH` SDPA backend

`speak.py` also checks the output is finite before writing, so a regression here fails loudly instead of shipping a
silent video.

**Wavs are written as 16-bit PCM, not float32.** The rest of the pipeline reads them with Python's `wave` module, which
raises `unknown format: 3` on IEEE float and takes the whole narration run down with it.

**Chatterbox is slow.** Roughly forty seconds per line against Kokoro's one. For a 3-5 minute script that is minutes,
not hours, but it is long enough that you want the script settled before you start rendering.

---

## Why It Looks The Way It Does

Inherited reasoning, all of it learned by watching a bad render rather than by reasoning about it in advance.

**The pauses are deliberate and they feel far too long while you are editing.** Automation's instinct is to click
instantly, which reads as fake and skips the only thing worth showing. A viewer needs two to three seconds to register
anything they have to read.

**A beat has to outlast the narration line written over it.** `schedule.py` pushes any line that would still be speaking
when the next begins, so one short beat delays every line after it. If a line reads for 6.5 seconds, give its beat about
7 seconds of picture.

**Padded, not cropped, to 1920x1080.** The capture is 1440x900, which is 16:10. Cropping to 16:9 would cut content, so
it scales to 1728x1080 and pads with `DEMO_PAD`. Set that to the app's own background colour and the bars become
invisible.

**Subtitles are burned in, bottom-centred, at `FontSize=14`.** Two traps, both invisible to a numeric check that looks
for "dark pixels, near the bottom, centred": `FontSize` is a libass script unit rather than a pixel, so 26 renders
enormous at 1080p; and under `BorderStyle=3` the box takes its colour from `OutlineColour`, so an alpha set on
`BackColour` is silently ignored and the scrim comes out fully opaque.

**Cards are split to minimise the longest line, not greedily.** A greedy wrap strands single words -
`...the post it came` / `from.` - and a one-word card is a jolt that tends to land on the sentence carrying the
product's claim. Even line lengths also stop the per-line boxes forming a ragged stepped edge.

---

## What Has Actually Been Verified Here

Being precise about this, because the rest of the document is inherited confidence rather than evidence from this repo.

| Stage                                   | Status                                                                                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schedule.py`, `subtitles.py`           | **Run here, 2026-09-01**, on a synthetic three-line fixture. Overlap detected and pushed 3760ms, five cards wrapped to under 42 characters, no card overlap |
| `record.mjs`, `slides/render.mjs`       | **Not run here.** Neither Chrome nor Playwright is installed on this machine, and there is no site to film yet                                              |
| `speak.py`, `narrate.sh`, `assemble.sh` | **Not run here.** Syntax-checked only. The TTS venvs are not installed                                                                                      |
| The whole pipeline                      | Produced a 55.4s 1920x1080 video on the project it came from, three times                                                                                   |

**Nothing here has produced a video in this repo yet.** The first person to run it end to end should expect to fix
something, and should write down what they fixed.

---

## Known Gaps

- **There is no product to film.** `walk.mjs` is a placeholder that films a landing page and stops. It becomes real work
  once there is a deployed site
- **The prototype phase has no deployed site at all.** The organisers were explicit that the prototype phase is idea and
  UI only, so the earliest this records anything real is the building phase, 21 September. Until then its use is filming
  a clickable Figma prototype, which works but is not what it was built for
- **`DEMO_PAD` is a guess** until `docs/DESIGN.md` records a background colour
- **Slide HTML is not here.** `slides/render.mjs` turns `slides/<name>.html` into PNGs and checks nothing collides with
  the subtitle band, but the slides themselves are `pitch-smith`'s and live in `docs/demo/`. Point the renderer at them
  rather than making a second deck
- **The 3-5 minute window is a floor as well as a ceiling.** `narrate.sh` prints the narration length; check it every
  run
