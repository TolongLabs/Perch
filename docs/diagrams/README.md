# Diagrams

**Worth 8% - the single largest band in the entire rubric.**

> "Rich, multi-layered mapping (mindmap **plus** problem tree or user-flow) that clearly illustrates the ideation
> process." — the rubric, 8/8 band
>
> "Single rough sketch or **a list dressed up as a diagram**. Hard to follow." — the 2-3/8 band

Read those two bands again. **An indented bullet list is not a mindmap**, and the rubric says so explicitly. The top
band needs **two different kinds** of visual, and they have to show the thinking, not just the final answer.

## What We Need

| Diagram          | Shows                                                                             |
| ---------------- | ----------------------------------------------------------------------------------- |
| **A mindmap**    | How the idea branched. **Include the branches we did not take** - that is the point |
| **A problem tree**| The problem at the top, its causes underneath, and their causes under those       |
| **A user flow**  | What the user actually does, screen by screen, start to finish                     |

Any two of those three clears the top band. All three is better.

## How To Make Them

Anything that produces an image is fine - the judges see a screenshot, not a file format. Whiteboard photos count.

| Tool                | Good For                                                        |
| ------------------- | ----------------------------------------------------------------- |
| **Excalidraw**      | Fast, hand-drawn feel, free. Good for mindmaps and problem trees |
| **Figma / FigJam**  | If we are already in Figma for the mockups                      |
| **Miro**            | Sticky-note style mindmaps, easy for a group to do together     |
| **Pen and paper**   | Genuinely fine. Photograph it. The organisers said wireframes on paper are acceptable |

Ask Claude to draft the structure first - it can lay out the branches or the cause tree as text - then draw it properly
and export it.

## Where Files Go

Exports go in `exports/`, named so it is obvious what they are and when they were made:

```
exports/
  2026-09-02-mindmap-v1.png
  2026-09-06-mindmap-v2.png
  2026-09-08-problem-tree.png
  2026-09-10-user-flow-checkin.png
```

**Keep every version.** `v1` next to `v2` is itself evidence of iteration, which is another 7 marks in `../decisions/`.
Never overwrite an old export.

Add a line to `index.md` for each one so a reader knows what they are looking at.
