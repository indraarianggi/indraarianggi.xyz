---
title: Cairn notes
summary: A trail marker for long research threads, so a question can be put down and picked up months later.
role: Product design
status: paused
date: 2025-11-08
endDate: 2026-02-19
stack: [Figma, Astro, Playwright]
featured: false
draft: false
image: ./cairn-notes-cover.png
imageAlt: Poster-style cover with a red field, a black diagonal band, and a rule
---

*Placeholder project. Replace this entry with real material before publishing.*

Research threads die quietly. Not because the question was answered, but because the context needed to continue it evaporated between sessions. **Cairn notes** was an attempt to leave a durable marker at the point where thinking stopped: what was being asked, what was ruled out, and what the next concrete step was.

The project is paused. The interface worked and the habit did not survive contact with a busy month, which is the honest reason it stopped rather than any technical problem.

## The problem

Restarting a thread costs more than making progress on it. A typical restart looked like this:

- Re-read a page of notes to work out what the question actually was.
- Rediscover a dead end that had already been ruled out twice.
- Find the bookmark that made the last session productive.
- Give up and start a different thread.

Every one of those costs is a design target, and none of them are solved by taking better notes.

## What was built

Three fields, one screen, and a keyboard shortcut from anywhere.

### The marker

Each marker holds a **question**, a **state**, and a **next step**. Nothing else. Notes are attached to markers rather than living in their own hierarchy, so a thread is the unit of work and the prose is supporting detail.

| Field | Type | Notes |
|---|---|---|
| Question | One sentence | Must be answerable, not a topic |
| State | `open`, `blocked`, `parked`, `closed` | Closed keeps the marker, hidden by default |
| Next step | One sentence | Starts with a verb |
| Trail | Append-only list | Every session adds one entry |

The state names carry weight. `parked` is deliberate: it means the thread is worth resuming and the question is still open, which is different from `blocked` on something external.

### The trail

Appending one line per session is the entire habit the tool asks for. One line is small enough to survive a bad week, which is exactly when a thread would otherwise be lost.

```css
/* Trail entries stay visually quiet: the question is the headline. */
.trail-entry {
  border-inline-start: 1px solid var(--rule);
  padding-inline-start: 0.75rem;
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  color: var(--muted);
}

.trail-entry[data-session='current'] {
  border-inline-start-color: var(--red);
  color: var(--ink);
}
```

![A block of stacked rules standing for a trail of session entries](./cairn-notes-sketch.png)

## What held up

- **One screen.** Everything a restart needs fits above the fold, which was verified by testing on a phone in one hand.
- **Append only.** Nothing is editable, so there is no maintenance to avoid.
- **Explicit states.** Four states force a decision that vague notes let you postpone forever.
- **Question first.** Writing the question is the hardest part and the most valuable one.

## What did not

1. Search was never needed, which means the corpus stayed small. That is a good sign about the problem and a bad sign about adoption.
2. The trail grew long enough that appending felt like bookkeeping, and the last three sessions did not get written down.
3. Markers with no next step accumulated, and the list stopped being a prompt.

> A note taking tool does not fail because capture is hard. It fails because resuming has no obvious first move.

## If it restarts

Shipped before the project paused:

- Marker schema with question, state, and next step
- Append only trail with keyboard entry
- Archive view for closed markers

Would come next:

- Prompt for markers whose last session is older than thirty days
- Show the marker list filtered to entries with a next step
- Decide whether the trail should be time ordered or session ordered

The second item is the one that would have kept the habit alive. A list that only shows threads you can actually act on is a shorter list, and shorter lists get used.

---

*Status: paused. The lesson was worth more than the tool, and it is written down in the section above.*

*Placeholder project. Replace this entry with real material before publishing.*
