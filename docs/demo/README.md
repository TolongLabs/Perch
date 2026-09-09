# The Pitcher Role

**Read this before your first take, then read [`scripts/demo/README.md`](../../scripts/demo/README.md).** This file is
the role: what you own, what state the film is in, and the ways it has broken. That one is the machine: install,
environment, every knob, every trap in the pipeline itself. They do not repeat each other, so you need both.

---

## What You Own, And What You Do Not

| Yours                                                                       | Not Yours                                                       |
| --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `scripts/demo/`, the recorder, the gate, the narration pipeline             | `v2/`, every surface the camera points at. That is the designer |
| `scripts/demo/narration.txt`, re-derived from the script, never hand-edited | `docs/demo/video-script.md`, which `pitch-smith` writes         |
| Recording, dubbing, subtitling, delivering the MP4 and its silent twin      | Tagging a release, and uploading anything anywhere              |
| Measuring what the camera actually sees, and saying so when it is wrong     | Deciding what the film says or how fast it says it              |

**The upload is never yours.** You hand over a path, a duration and an md5. The advisor puts it in the team's review
folder; the submission upload is the team leader's own action, and the rules say so explicitly. The review folder's link
is deliberately not written down in this repository.

**`narration.txt` is derived, not authored.** When the script changes, re-derive the whole file from the fenced `text`
block in `docs/demo/video-script.md` rather than editing the line that moved. Hand-editing is how the two drift, and the
drift test in `scripts/demo/pipeline.test.ts` exists because they already did once.

---

## Where It Stands

**`v2-0.3.1` is the current film**: 3:20.5, delivered at 1.5x, ten of ten claims passing, with a voice-only twin of the
same picture beside it. It carries a music bed credited to LoFi Tokyo in the MP4's own `comment` tag.

Two things are open and neither is an engineering task:

- **The leader has not listened to the bed for vocals.** No measurement can detect a vocal, which is why the listen is
  the gate. The silent twin exists so the bed can be dropped in minutes rather than re-recorded
- **The bed has no licence.** It is a compilation with no `TCOP`, no `WCOP` and no licence URL anywhere in its metadata,
  used on the leader's decision of 9 September and credited rather than cleared. The full evidence is in
  `scripts/demo/README.md` under Provenance. **Do not write a licence line for it**, because there is nothing to cite

---

## The Loop You Will Run

The film is re-shot per release, not once. Each turn of the cycle looks the same:

1. The advisor tells you the state: what merged since the last film, by shot, and that `main` is frozen
2. **Re-derive `narration.txt`** if `pitch-smith` changed the script, and run `bun test` to check the drift test
3. **Re-point anything the changes broke**, in both `record.mjs` and `check-shots.mjs`, measuring against the deployed
   site rather than reading the diff
4. **Run the gate.** Every anchor must read PRESENT and it must exit 0. A red gate before a take is a saved take
5. **Record, then narrate.** Read the claim summary before you narrate: all ten PASS, zero console errors
6. **Report** the path, the duration, the md5 and the claims. One message

**A failed claim buys one re-take.** A second failure goes back to the advisor with the beat named and a frame attached,
rather than a third attempt.

---

## The Commands

```bash
export DEMO_DIR="$HOME/.cache/perch-demo/takes/$(date +%y%m%d-%H%M%S)"
export TMPDIR="$HOME/.cache/perch-demo/tmp"          # never /tmp; it is a small tmpfs shared by three sessions
export DEMO_PLAYWRIGHT="/path/to/a/playwright/index.mjs"
export KOKORO_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/perch-video/kokoro"
mkdir -p "$DEMO_DIR" "$TMPDIR"

node scripts/demo/check-shots.mjs                     # every row PRESENT, exit 0, before anything else
node scripts/demo/record.mjs                          # capture.webm + beats.json + the claim summary

DEMO_SOURCE="$DEMO_DIR/capture.webm" \
DEMO_OUT="$HOME/Downloads/TolongLabs.mp4" \
DEMO_FONTSDIR="$HOME/.cache/perch-demo/fonts" DEMO_SUBTITLE_FONT=Quicksand \
DEMO_MUSIC="$SUITE/lofi-bgm.mp3" DEMO_MUSIC_START=161 DEMO_MUSIC_CREDIT='LoFi Tokyo' \
DEMO_FILM_SPEED=1.5 \
  bash scripts/demo/narrate.sh
```

**`DEMO_STOP_AFTER=shot-3` stops a run after a named beat**, so an entry can be proven without paying for a full take.
The segment still closes and `beats.json` is still written for what was filmed.

**`DEMO_FILM_SPEED` is the film's speed. `DEMO_SPEED` is Kokoro's speaking rate**, and setting the wrong one applies
both. See the trap below.

---

## How This Film Breaks

**Every expensive mistake in this film has had the same shape: a check that passed while the picture was wrong.**
Nothing threw, nothing went red, and the failure was only ever visible in a frame. Assume that shape and you will find
things early.

| What Looked Fine                            | What Was Actually Happening                                                        |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| Ten of ten claims PASS                      | Shot 10 filmed reel posters for twenty seconds. The claim counted DOM nodes        |
| A beat framed by `nth(1)` and `nth(2)`      | A panel was inserted upstream, so the camera framed the wrong two and still passed |
| `scrollIntoViewIfNeeded` on a spread        | It scrolls the _minimum_, leaving a tall element's top 193px above the fold        |
| A rail item pressed at its own bounding box | The rail is clipped until hovered, so the press landed on the page behind it       |
| Every rect in frame after a rail press      | The rail was open with a scrim over the page. Blur is paint, not layout            |
| A locator on `.check-label`'s first child   | That child is an empty span, so it matched every row and ticked one five times     |
| Grepping the deployed bundle for a string   | Minifiers split strings and non-entry chunks are never fetched. Drive the page     |
| A map element present in the DOM            | Its tiles were still in flight and it filmed as bare tint                          |

**Four rules fall out of that list, and they are the whole job.**

- **Address everything by name, never by position.** Legends, labels, exact strings. Positional indices have broken this
  recorder four times and each time the claim still passed
- **Assert what the camera sees, not what the page contains.** Bounding boxes against the viewport, a rail's width, a
  tile's loaded count. A node's existence proves nothing about the frame
- **Measure against the deployed site, never against a diff or a local build.** The deploy fires on push and queues, so
  a burst of merges can leave minutes between the last merge and the live page settling
- **Judge stills at film scale.** `scripts/demo/film-scale.sh` renders a screenshot the way the film does and then
  through the film's own encoder. A screen judged at 1440 in a pane has not been judged

---

## Standing Constraints

| Rule                                                                               | Why                                                          |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Never call the scheduler AI**, on screen or in narration. It is a heuristic      | The script says so, and the product claim has to stay honest |
| **3 to 5 minutes is a floor as well as a ceiling**                                 | Under three is as disqualifying as over five                 |
| **Record the deployed prototype, never `vite dev`**                                | The film has to show what a judge can open                   |
| **Media never enters the repository.** `.mp4`, `.webm`, `.wav`, `.srt` are ignored | The deliverable is a file you hand over, not a commit        |
| **Nothing is added to `package.json` for this**                                    | Playwright, Kokoro and ffmpeg all live outside the repo      |

---

## What Is Still Filed

- **[#179](https://github.com/TolongLabs/Perch/issues/179)** — the film ships around -22 LUFS. A `loudnorm` pass to
  about -16 with a -1 dBTP ceiling is proposed and deferred; it must sit _after_ the music mix or the ducking is
  measured against the wrong reference. It changes the deliverable rather than fixing a bug, so it is not deployment
  phase work
- **[#195](https://github.com/TolongLabs/Perch/issues/195)** — the bed, still open on the listen described above
- **[#108](https://github.com/TolongLabs/Perch/issues/108)** — the release feedback thread the whole cycle runs on

---

## Handing Over Again

**Leave the next pitcher a repository that measures rather than remembers.** Every trap in the table above is in the
code as a comment or an assertion, not only here, because a comment beside the line is read at the moment it matters and
a document is read once. If you find a new one, put it beside the code that would otherwise repeat it, and add a row
here.
