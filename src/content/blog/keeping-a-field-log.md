---
title: Keeping a field log
description: Why one append only file per project beats a perfect note system, and what to put in it.
date: 2026-07-21
topics: [Writing, Practice]
draft: false
image: ./field-log-cover.png
imageAlt: Poster-style cover with a black ground, a red band, and two paper blocks
---

*Placeholder article. Replace this with real writing before publishing.*

Every project I have abandoned left the same residue: a folder of notes arranged by a scheme I invented and stopped following. The field log is the reaction to that. One file, appended to, in the order things happened.

It is not a knowledge base. It is a record of what I did and what I was thinking, and its main value is showing up at week six when I have forgotten why a decision was made.

## The shape of it

One file per project, one entry per working session. Nothing is edited and nothing is moved.

- **Header.** Date, and one line about the intent of the session.
- **Body.** What I tried, what happened, and what I would try next.
- **Tags.** A short list at the end, for grepping later.

The format is genuinely this small. Notes that demand structure get abandoned at the first busy week.

```bash
# The only rule that matters: append, never rewrite.
printf '\n## %s\n\n%s\n' "$(date +%F)" "$(pbpaste)" >> field-log.md
```

## What goes in it

The temptation is to record conclusions. Record the path instead, because the path is the part that gets forgotten.

1. **Decisions and their reasons.** Not "used SQLite" but "used SQLite because the dataset fits in memory and I want one copyable file".
2. **Dead ends.** The most valuable entries. They stop me from rediscovering the same wall.
3. **Numbers with conditions.** "The build took four seconds" is useless without the machine and the dataset.
4. **Open questions.** Written as questions, so they can be answered later.
5. **What surprised me.** Surprise marks a gap between my model and reality, which is exactly where the next session should start.

What stays out:

- Todo lists. They belong somewhere that tracks state.
- Long explanations. Link out instead, or write a separate document.
- Anything copied wholesale from a terminal transcript.

## Reading it back

The log is written for one reader: me, three months later, slightly annoyed. That reader wants the shortest path to context, in this order:

| Question | Where to look |
|---|---|
| What was I doing? | Session headers, skimmed in order |
| Why this choice? | Decision entries |
| What already failed? | Dead end entries |
| What is next? | The last entry, always |

A log that answers those four questions has done its job, even if it is ugly.

> The best note system is the one that survives a bad week. Everything else is a hobby.

![Stacked rules standing for a sequence of appended log entries](./field-log-spread.png)

## Habits that keep it alive

- **Append during the work, not after.** The entry written at the end of a session is a summary, and summaries lose the interesting parts.
- **Write the next step first.** Starting an entry with the next action makes the following session cheap to begin.
- **Keep one file per project.** Splitting by topic recreates the filing problem the log exists to avoid.
- **Do not format it for anyone else.** Markdown is enough, and headings are the only structure needed.
- **Let entries be short.** Three lines is a complete entry. The average length rises on its own once the habit holds.

## The part that is hard

Appending every session fails in exactly two situations:

- When the work is going badly, because writing down a failure costs more than moving on.
- When the work is going well, because stopping to write feels like breaking flow.

Both are the same mistake in different clothes: treating the log as a report rather than as a tool. A log entry is a message to your future self, and your future self is the person who has to restart this project cold, with no memory of the good week or the bad one.

*Placeholder article. Replace this with real writing before publishing.*
