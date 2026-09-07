# Source Material

Raw organiser inputs, kept verbatim so we cite them instead of relying on memory. This is the record we check when a
summary and reality disagree.

---

## What's Here

| File                                                               | Source                                       | Captured   |
| ------------------------------------------------------------------ | -------------------------------------------- | ---------- |
| [`kickoff-day-transcript.md`](kickoff-day-transcript.md)           | Kick-Off Day recording, 30 Aug, 46 min       | 2026-09-01 |
| [`kickoff-day-slides.md`](kickoff-day-slides.md)                   | Kick-Off Day deck, 30 slides                 | 2026-09-01 |
| [`problem-statements.md`](problem-statements.md)                   | Organiser problem-statement handout          | 2026-09-01 |
| [`prototype-judging-rubrics.md`](prototype-judging-rubrics.md)     | Organiser prototype rubric handout           | 2026-09-01 |
| [`submission-template.md`](submission-template.md)                 | Organiser README and video template          | 2026-09-06 |
| [`mentor-session-1-transcript.md`](mentor-session-1-transcript.md) | Mentor session 1, Zach Khong, 7 Sept, 38 min | 2026-09-07 |

**The deck is the authority on dates, the rubric weightings, the prize table and the submission checklist.** The public
information page was not updated after Kick-Off Day and disagrees in several places; every disagreement is recorded in
[`../brief.md`](../brief.md#where-the-sources-disagree).

---

## Conventions

| Rule                     | Detail                                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Append-only**          | Never rewrite these to match later beliefs. Corrections go in `../brief.md`                                                                                |
| **Transcribe**           | Do not summarise. Summaries belong in `../brief.md`                                                                                                        |
| **One file per source**  | `<topic>.md`, or `<topic>-<YYYY-MM-DD>.md` when the same source recurs                                                                                     |
| **Head with provenance** | What the source was, how it was captured, when. **Name the tool, not your path to it** - a teammate does not have your `~/CS/...` or `C:\Users\...` layout |
| **Mark uncertainty**     | `[inaudible]` rather than a guess. Record ASR name corrections in a key                                                                                    |
| **Note the speaker**     | Where organiser vs mentor vs participant changes the weight                                                                                                |

Audio and video are gitignored. **Commit the transcript, not the recording.**

---

## Transcribing A Recording

Whisper runs locally, so a recording never leaves the machine and there is no per-minute cost.

```bash
transcriber <recording> -o docs/source/ -f txt -m medium -l en
```

Two things worth doing every time:

- **Pass `--context`** with the names, organisations and product terms you expect. Whisper mangles proper nouns badly,
  and this is what fixes most of them in one pass
- **Record every correction you make by hand** in a key at the top of the transcript, so a reader can tell an ASR
  artifact from something the speaker actually said

Speakers are inferred from content, not detected: Whisper does not diarise. Say so in the file's header rather than
implying the attribution is certain.

**Use `medium`, not the `small` default.** On the Kick-Off recording, `small` misheard "CodeNection" on 11 of 16
occurrences and garbled two phrases past reading; `medium` got all 15 right and segmented finer, 620 lines against 404.

**Corrected 2026-09-07: `medium` does fit in 4 GB of VRAM.** This file previously said it did not and told you to force
CPU. Transcribing the 38-minute mentor session on an RTX 3050 Ti Laptop GPU peaked at **3.86 GB of 4 GB** and finished
in roughly twenty minutes, so leave CUDA enabled. `large` is the one that will not fit.
