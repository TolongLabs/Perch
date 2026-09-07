# Inbox

**Dump here. Do not organise. That is the whole point.**

An idea you have to file before you can write down is an idea you will not write down. So this folder takes anything,
in any state: half a sentence, a voice-note transcript, a link with no comment, three unrelated thoughts in one
paragraph, something you are not sure is even good.

## The Two Ways In

**Say it to the agent.** Easiest, and what this is built for. Open Claude Code in this folder and just talk:

```
/dump the thing about students not knowing they're overloaded until finals week,
and something about how nobody uses a planner twice
```

It writes the raw text down first, unedited, then files the pieces into `ideas/`, `users/`, `market/` and the rest, and
tells you where each one went.

**Or write a file yourself.** Name it `YYYY-MM-DD-<anything>.md` and type. Run `/tidy` later and the agent will file it.

## What Happens To A Dump

| Step | What                                                                            |
| ---- | --------------------------------------------------------------------------------- |
| 1    | **The raw text is saved here, word for word.** Nothing is cleaned up or dropped  |
| 2    | The pieces are copied out into the folder that scores them                       |
| 3    | The dump gets a `Filed:` line at the top saying where each piece went            |

**The raw dump is never edited or deleted**, even when the idea in it turns out to be wrong. Dead ends are worth marks,
and a dump you wrote on 2 September is proof you were thinking on 2 September. Both of those are things the judges
score and neither can be recreated later.

## What Not To Worry About

- **Spelling, grammar, structure.** Nobody reads this folder but you and the agent
- **Whether the idea is good.** That is what `/tidy` and the `sparring-partner` agent are for
- **Repeating yourself.** The same idea arriving three times is a signal, not a mistake
- **Contradicting yourself.** Two dumps that disagree is exactly the material `decisions/iteration-log.md` wants
