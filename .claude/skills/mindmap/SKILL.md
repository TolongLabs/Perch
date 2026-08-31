---
name: mindmap
description: "Draw the notebook as a real diagram - a mindmap, problem tree or user flow - as an Obsidian Canvas file that a person can then drag around and export as an image. Use when the ideation needs a picture, when docs/diagrams/ is empty, or after /tidy finds a structure worth showing. This is the 8% band, the largest single one in the rubric, and it explicitly does not accept a bullet list. Triggered by /mindmap."
---

# /mindmap

**8% of the total score, and the rubric names the failure mode out loud:**

> "Single rough sketch or **a list dressed up as a diagram**. Hard to follow." — the 2-3 out of 8 band
>
> "Rich, multi-layered mapping (mindmap **plus** problem tree or user-flow) that clearly illustrates the ideation
> process." — the 8 out of 8 band

So: an indented list is not a mindmap, one diagram is not the top band, and the diagram has to show **the thinking**,
not just the answer.

You write a `.canvas` file. A human opens it in Obsidian, drags the boxes until it reads well, and exports a PNG. That
split matters: the agent is good at getting the structure and the relationships right, and bad at knowing what looks
good; a person is the reverse.

---

## Which Diagram

Ask if it is not obvious. **Two of these three clears the top band.**

| Diagram          | Shows                                                          | Reach For It When                       |
| ---------------- | -------------------------------------------------------------- | --------------------------------------- |
| **Mindmap**      | How the idea branched, **including branches not taken**        | There are several ideas in `docs/ideas/`     |
| **Problem tree** | The problem, its causes, and the causes of those               | The problem is still vague              |
| **User flow**    | What a person actually does, screen by screen, start to finish | The concept is locked and needs proving |

**The mindmap must include the branches that were dropped**, drawn dimmer or off to one side, not deleted. Those
branches are simultaneously the 8% band's "ideation process" and the 7% band's "dropped directions". One diagram, two
scores. Pull them from `docs/decisions/dropped.md`.

---

## Writing The Canvas

JSON Canvas, the open format Obsidian uses. Write `docs/diagrams/<name>.canvas`.

```json
{
  "nodes": [
    {
      "id": "root",
      "type": "text",
      "text": "# Burnout goes unnoticed",
      "x": 0,
      "y": 0,
      "width": 320,
      "height": 80,
      "color": "1"
    },
    {
      "id": "c1",
      "type": "text",
      "text": "No single view of total load",
      "x": 420,
      "y": -120,
      "width": 260,
      "height": 70
    },
    {
      "id": "d1",
      "type": "text",
      "text": "~~Streaks and gamification~~\n\nDropped 4 Sept: rewards the wrong thing",
      "x": 420,
      "y": 180,
      "width": 260,
      "height": 90,
      "color": "6"
    },
    {
      "id": "src",
      "type": "file",
      "file": "docs/ideas/004-load-forecast.md",
      "x": 800,
      "y": -120,
      "width": 300,
      "height": 120
    }
  ],
  "edges": [
    {
      "id": "e1",
      "fromNode": "root",
      "fromSide": "right",
      "toNode": "c1",
      "toSide": "left"
    },
    {
      "id": "e2",
      "fromNode": "root",
      "fromSide": "right",
      "toNode": "d1",
      "toSide": "left",
      "label": "dropped"
    }
  ]
}
```

**The format, in full:**

| Field                         | Notes                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `nodes[].type`                | `text`, `file`, `link` or `group`                                            |
| `text` node                   | Needs `text`. Markdown works, including `#` headings and `~~strikethrough~~` |
| `file` node                   | Needs `file`, a vault-relative path. **Renders the note live**               |
| `x` `y` `width` `height`      | Pixels. `y` increases downward. All four required                            |
| `color`                       | `"1"`-`"6"` = red, orange, yellow, green, cyan, purple. Or `"#rrggbb"`       |
| `edges[].fromSide` / `toSide` | `top` `right` `bottom` `left`                                                |
| `edges[].label`               | Optional, and **this is where the reasoning goes**                           |

**Use `file` nodes for anything that already exists as a note.** A canvas whose boxes are live `docs/ideas/*.md` files stays
correct as the notes change, and lets a reader click through from the picture to the argument. A canvas of retyped text
is stale the day after you write it.

### Layout That Does Not Need Fixing By Hand

- **Root at `0,0`.** Branches fan right, or up and down for a tree
- **Leave 140px between siblings vertically and 400px between depth levels.** Obsidian does not auto-layout, and
  overlapping boxes are the main reason a generated canvas looks broken
- **Estimate height at ~28px per wrapped line**, min 60. Text overflowing its box is the second reason
- **Colour carries meaning or is absent.** Dropped branches one colour, live branches another, and say which is which
  in a legend node. Six colours because six colours exist is the thing the design standards call out

### Label The Edges

**An unlabelled arrow says "these are related", which the reader already assumed.** `caused by`, `dropped because`,
`led to`, `contradicts` is where the ideation process becomes visible - and "clearly illustrates the ideation process"
is the literal wording of the 8/8 band.

---

## After Writing It

Tell them, in this order:

1. **Open it.** Obsidian, this folder as the vault, then `docs/diagrams/<name>.canvas`
2. **Drag things until it reads well.** The structure is right; the placement is a judgement call and theirs
3. **Export.** Right-click the canvas → Export as image, into `docs/diagrams/exports/`, named
   `YYYY-MM-DD-<name>.png`
4. **Add a row to `docs/diagrams/index.md`** saying what it shows and what changed since the last version

**Never overwrite an old export.** `v1` beside `v2` is itself evidence of iteration, which is a different 7%.

If Obsidian is not installed, the canvas file is still valid and readable, but say plainly that it needs Obsidian to
render - and that a photographed paper drawing scores exactly the same, because it does.

---

## What Not To Do

- **Do not write a bullet list into one big node and call it a mindmap.** That is the 2-3 band by name
- **Do not delete a dropped branch to make the diagram tidy.** Tidy scores lower than complete here
- **Do not invent a branch that is not in the notebook.** The diagram is a picture of the thinking that happened
- **Do not overwrite an existing `.canvas` someone has arranged by hand.** Write a new version beside it
