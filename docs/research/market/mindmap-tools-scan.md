# Scan: does "ideas → mind map" / "talk → graph" already exist?

**Date:** 2026-09-06. **Question asked:** is there already a product that turns ideas into a mind map, or
draws a graph from someone telling a story? **Answer: yes, in three separate layers, all crowded.**

## Layer 1 — text in, mind map out (commodity, free, no sign-up)

This is a solved and free category. Named products seen:

| Product | Note |
| --- | --- |
| [Mapify](https://mapify.so/) | Widest input set found: prompt, document, PDF, YouTube video, web page |
| [NoteGPT AI Mind Map Generator](https://notegpt.io/ai-mind-map-generator) | Free, no sign-up, runs on GPT-4 / Claude |
| [mindmapai.app](https://mindmapai.app/text-to-mindmap) | Free, no sign-up, text → map |
| [AmyMind](https://amymind.com/) | Text, markdown and documents → map |
| [Venngage](https://venngage.com/ai-tools/mind-map-generator) | Branches, sub-ideas, connections |
| [EdrawMind](https://edrawmind.wondershare.com/ai-tools/ai-mind-map-generator.html) | Prompt → map inside an existing mind-map suite |

Implication: "paste text, get a mind map" is not a product. It is a free web tool with at least six
interchangeable versions.

## Layer 2 — speak, and it draws while you speak

Closer to the "tell it a story and it draws" framing, and already occupied:

- **[TalkGraph](https://talkgraph.ai/)** — the closest match found. Browser app, early access, free to start.
  Draws speech in real time as a connected map of **typed cards** (decision, action, fact, question, risk,
  idea, praise), each attributed to whoever said it. Maps link across conversations into one personal
  "Brain" you can query with citations back to the source card. 50+ languages, imports old transcripts and
  PDFs, no bot joins the call.
- **[Newton](https://www.newtongraph.com/)** — transcribes speech and builds a structured knowledge graph of
  concepts, speakers and topics from recordings.
- **[VoiceDiagram](https://voicediagram.com/)** and **[VoiceDraw](https://voicedraw.com/)** — speak, watch a
  flowchart / mind map / architecture diagram assemble as you talk, any language.
- **[Mindlify](https://mindlify.co/)** — turns your *AI chat history* into a searchable visual brain.

## Layer 3 — narrative / prose → structured diagram

- **[Napkin AI](https://napkin.ai/)** — visual storytelling; prose in, infographic-style visuals out.
- **[Lucidchart AI](https://lucidchart.com/pages/use-cases/diagram-with-AI)**, **[Visily](https://www.visily.ai/diagram-ai/)**,
  **[Diagramming AI](https://diagrammingai.com/)** (Mermaid, PlantUML, GraphViz, D2, Excalidraw).
- Legacy whiteboards — Miro, Mural, FigJam — have all bolted AI generation onto an existing canvas, which
  means any new entrant is fighting incumbents with the distribution already built.
- Narrative-from-chart is separately **patented** (Narrative Science / Salesforce,
  [US 11,232,268](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11232268) and
  [US 11,222,184](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11222184)) — the reverse
  direction, but worth knowing the space has IP in it.

## The uncomfortable bit

**There is no white space here.** Every phrasing of the idea — text→map, voice→map, story→diagram — returns
a named, shipping, mostly-free product, and TalkGraph in particular has already taken the most defensible
version of it (typed cards + speaker attribution + cross-session graph + cited retrieval). A CodeNection
submission in this space would be a worse TalkGraph built in three weeks, and judges who have seen "a lot of
to-do apps" have certainly seen AI mind maps.

**What would have to be true for it to still be worth doing:** the wedge cannot be the drawing. It has to be
a *specific user in a specific moment* whose thinking is currently lost and for whom none of the above is
reachable — and that claim needs a named user, not a category. `[not verified]` whether any such gap exists;
what would settle it is talking to five people who think out loud and asking what they do with the notes now.

## Also worth saying

The agent in this repo already does the core move. `/mindmap` writes an Obsidian Canvas file you can drag
around and export, and published Artifacts render Mermaid natively with no library. So "an AI that turns my
thinking into a diagram" is not a thing we would need to build — it is a thing we already have running.

**Sources:** all links above, gathered 2026-09-06.
