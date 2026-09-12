# GitHub Issues Reconciliation Report

This report reconciles all 14 currently open GitHub issues in `TolongLabs/Perch` against git history, merged pull
requests, tagged releases (`v2-0.1.0` through `v2-0.5.8`), and the current codebase. It classifies each issue by its
actual state and confirms what can and cannot be closed.

---

## Active Open Issues (14 Total)

| Issue | Title                                                                                   | Classification         | Target Phase                    | Status                                        | Evidence / Resolution Note                                                                                                                                               |
| ----- | --------------------------------------------------------------------------------------- | ---------------------- | ------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| #13   | Make the repo public before submitting                                                  | Submission Checklist   | Prototype Submission (13 Sept)  | Open; pending visibility change               | Repo is still private per `gh repo view`; team leader must switch visibility to public before submission.                                                                |
| #14   | Submit via the Google Form by 13 Sept, 23:59 MYT                                        | Submission Checklist   | Prototype Submission (13 Sept)  | Open; pending team leader action              | Rules require team leader only to submit via Google Form; 15-minute early buffer is tracked in the checklist.                                                            |
| #24   | Prelim submission deliverables: the complete checklist                                  | Submission Checklist   | Prototype Submission (13 Sept)  | Open; checklist incomplete                    | Tracks all deliverables (public links, slides, demo video, README header block, submission form).                                                                        |
| #95   | Add an unused-export check for the build phase                                          | Build Phase            | Building (21 Sept - 11 Oct)     | Open; deferred to build                       | Explicitly scoped to the build phase (e.g. `knip` dead-export lint check); out of prototype scope.                                                                       |
| #108  | v2 prototype release feedback, one thread until code freeze                             | Active Feedback Thread | Prototype                       | Open; active until code freeze                | 68 comments; all feedback through v2-0.5.8 (PR #405) addressed and shipped; open until 13 Sept 11:59 MYT code freeze.                                                    |
| #113  | Refine the pitch deck: it reads good but barebones                                      | Prototype Deliverable  | Prototype                       | Open; pending file size budget                | PR #386 merged 19-slide redesign, but `docs/demo/slides.pdf` is 2.3 MB (> 2 MB ceiling) and `docs/demo/` is 3.8 MB (> 3 MB ceiling); reopened pending budget compliance. |
| #124  | Build phase idea: Before We Go as a swipe mode                                          | Build Phase            | Building (21 Sept - 11 Oct)     | Open; deferred to build                       | Explicitly declined for prototype in intake 1; kept for the build phase.                                                                                                 |
| #137  | The Desk's out-of-hours warning says why: closed that weekday, or reached after closing | Prototype Feature      | Prototype                       | Open; partial implementation                  | PR #141 merged closed-weekday rationale in `schedule.ts`, but `PoolCard` does not yet show closed days before dragging; reopened pending audit verification.             |
| #139  | Changing dates on a settled trip should not leave empty days                            | Build Phase            | Building (21 Sept - 11 Oct)     | Open; deferred to build                       | Explicitly declined for prototype in intake 1; reserved for build phase trip capacity rules.                                                                             |
| #179  | The film ships at -22 LUFS with the true peak on the ceiling                            | Demo Film Pipeline     | Prototype                       | Open; loudness normalization pending          | No `loudnorm` or LUFS normalization pass landed in `scripts/demo/narrate.sh`; audio true-peak headroom pending.                                                          |
| #195  | The 0.3.0 video carries a music bed from the BGM suite                                  | Demo Film Pipeline     | Prototype                       | Open; pipeline in place, licence gate blocked | Bed mixing pipeline implemented in PRs #208/#211, but blocked on asset license confirmation and team leader listening gate.                                              |
| #236  | Card borders are below the 3:1 non-text contrast floor                                  | Prototype Design       | Prototype / Build (post-freeze) | Open; parked until after intake               | Low-opacity `color-mix` borders in `PlacedCard.css`; issue comment explicitly parked work until intake 3 closes to avoid altering recorded demo frames.                  |
| #265  | The film demonstrates Must Go on the Deck and scrolls the Tally slowly to the footer    | Demo Film Pipeline     | Prototype                       | Open; script updated, recorder not aligned    | PR #269 updated `docs/demo/video-script.md`, but demo recorder script `scripts/demo/record.mjs` has not executed the up-swipe and slow scroll demo sequence.             |
| #374  | Synchronize Manual trip notes across members and devices                                | Build Phase            | Building (21 Sept - 11 Oct)     | Open; deferred to build                       | Multi-device shared storage and synchronization are explicitly scoped to the build phase; prototype demonstrates browser-local session state.                            |

---

## Recently Confirmed Closed Issues (8 Total)

These eight issues were confirmed resolved in merged code and closed on GitHub:

| Issue | Title                                               | Resolution PR / Commit | Verification Note                                                                                                   |
| ----- | --------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| #377  | Book page number resets to 1 on the second spread   | PR #385 (`c1ce62a`)    | Single `BookFlip` host for the entire trip; page numbers run 1..N across all spreads in `Book.test.tsx`.            |
| #378  | Dark theme page-flip is stuck and unresponsive      | PR #385 (`c1ce62a`)    | Full white `--page` token and `BookFlip.css` background set to `var(--page)` ensures flip animation in dark theme.  |
| #379  | Book PDF prints only the destination spreads        | PR #385, PR #404       | `@media print` in `Book.css` isolates 2-page spreads; refined in PR #404 to exactly 7 landscape spreads (14 pages). |
| #380  | Redesign or remove the scuffed pin head             | PR #385 (`c1ce62a`)    | Scuffed pin head removed; minimap pinned note refined cleanly without skewed pin heads (PRs #398, #399, #404).      |
| #381  | Deck reel small and off-centre on mobile            | PR #385, PR #403       | Reel centred clear of voter controls; responsive mobile scaling up to 380px without jump on scroll.                 |
| #382  | Scale up the drawn calendar numbers                 | PR #385 (`c1ce62a`)    | `DateRangePicker.css` day cells set to 40px with 16px figures, shared across Landing and Desk.                      |
| #383  | Manual PDF keeps only the header and three sections | PR #385 (`c1ce62a`)    | `@media print` in `Handbook.css` suppresses sharing notices, note forms, and footer; keeps core advisory sections.  |
| #384  | Add a Skip All button to the swipe page             | PR #385 (`c1ce62a`)    | `Deck.tsx` exposes `.deck-skip-all` button and `votingSession.ts` implements `skipRemaining`.                       |

---

## Reconciliation Summary: What Can And Cannot Be Closed

### What Can Be Closed Right Now

**None of the 14 remaining open issues can be closed immediately.** Every issue that has been resolved in code has
already been closed. Closing any of the remaining 14 issues prematurely would violate submission rules, bypass mandatory
human review gates, or misrepresent the build schedule.

### Breakdown of Why the 14 Issues Must Remain Open

1. **Submission Gates and Checklists (#13, #14, #24):**
   - Must remain open until the team leader physically executes repository visibility changes and Google Form submission
     on 13 September.
2. **Build Phase Deferred Scope (#95, #124, #139, #374):**
   - Must remain open under `phase:build`. Per `AGENTS.md`, implementing or closing build-phase items during the
     prototype phase is strictly forbidden.
3. **Active Prototype Feedback Thread (#108):**
   - Must remain open until code freeze (13 September, 11:59 MYT). All feedback up to `v2-0.5.8` is resolved and
     deployed.
4. **Pitch Deck File Size Ceiling (#113):**
   - Rework was merged in PR #386, but the issue was reopened because `slides.pdf` (2.3 MB) and `docs/demo/` (3.8 MB)
     exceed the hard 2 MB and 3 MB budget caps. Remains open until assets are compressed.
5. **Desk Closed Days Tag (#137):**
   - Schedule evaluation rationale is complete, but displaying closed days on the unplaced `PoolCard` before dragging
     remains open per audit.
6. **Card Border Contrast (#236):**
   - Explicitly parked until after intake 3 closes so video recording frames are not disturbed.
7. **Demo Film Recording & Audio Pipeline (#179, #195, #265):**
   - Video recording and audio mastering assets (`narrate.sh`, BGM licensing gate, slow scroll and Must Go gesture
     recording) must be completed by the pitcher/leader before closing.
