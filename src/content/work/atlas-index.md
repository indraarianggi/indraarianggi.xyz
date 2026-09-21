---
title: Atlas index
summary: A searchable index over a personal archive of documents, screenshots, and unfinished notes.
role: Design and build
status: building
date: 2026-08-14
stack: [TypeScript, SQLite, Astro]
repository: https://example.com/atlas-index
featured: true
draft: false
image: ./atlas-index-cover.png
imageAlt: Poster-style cover with a black column, a red field, and two rules on warm paper
---

*Placeholder project. Replace this entry with real material before publishing.*

The archive started as one folder named `notes/`. It now holds several thousand files, and the only way to find anything is to remember roughly when it was written. **Atlas index** is a small tool that reads that folder, extracts text, and answers questions about it.

It is deliberately boring: no accounts, no sync service, no model in the loop. The whole thing runs on one machine, and the index is a single SQLite file that can be copied, archived, or deleted without ceremony.

## Context

Searching a folder is easy until the folder stops fitting in your head. The problems show up in a predictable order:

- Filenames lie. `final-v3-notes.md` is rarely final and rarely about the topic it claims.
- Formats are mixed. Plain Markdown sits next to PDFs, screenshots, and exported chat logs.
- Older is not worse. A four year old decision log is often the most useful document in the folder.
- Manual organisation decays. Every folder scheme I tried survived about six weeks.

A text index over extracted content outlives all of it, because it does not depend on me maintaining anything.

## How it works

The pipeline has three stages, and each one can be re-run on its own.

### Ingest

Walk the tree, hash every file, and skip anything already indexed with the same hash. Text is extracted per format, normalised to plain UTF-8, and stored next to the original path rather than replacing it.

```ts
type Document = {
  path: string;
  hash: string;
  modified: Date;
  text: string;
  kind: 'markdown' | 'pdf' | 'image' | 'plain';
};

async function ingest(root: string, db: Database): Promise<Document[]> {
  const seen = await db.knownHashes();
  const fresh: Document[] = [];

  for await (const file of walk(root)) {
    const hash = await digest(file);
    if (seen.has(hash)) continue;

    fresh.push({
      path: file,
      hash,
      modified: await stat(file).then((s) => s.mtime),
      text: await extractText(file),
      kind: classify(file),
    });
  }

  return fresh;
}
```

### Query

Queries are plain SQLite full text queries, which means the ranking behaviour is documented and predictable. Typing three words means "all three, in any order"; quoting them means a phrase.

```sql
SELECT path, snippet(documents, 2, '<mark>', '</mark>', ' ... ', 12) AS excerpt
FROM documents
WHERE documents MATCH :query
ORDER BY rank
LIMIT 20;
```

### Ranking

Relevance is a blend of text rank and file recency, with a small bonus for documents I have opened before. The weights are constants at the top of one file, and the comments explain why each one has the value it does.

![Three boxes connected left to right, standing for ingest, query, and ranking](./atlas-index-flow.png)

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Storage | One SQLite file | Copyable, inspectable with `sqlite3`, no server to run |
| Text extraction | Library per format | Fewer surprises than shelling out to converters |
| Incremental work | Content hash | Renames and moves cost nothing to re-index |
| Ranking | Full text rank plus recency | Recency alone buries old decisions worth keeping |
| Interface | Local web page | Keyboard driven, and it works on the phone over the LAN |

## What is left

Working today:

- Ingest Markdown, plain text, and PDF
- Incremental re-index by content hash
- Keyboard driven search with a preview pane

Still to build:

- Extract text from screenshots with an offline model
- Detect near duplicate notes and show them side by side
- Export a reading list of everything unread in the last year

> A search index is a promise that the archive will still be readable when the tool that produced it is gone. Any format that breaks that promise is the wrong format.

## Open questions

1. Should near duplicates be merged, or only flagged?
2. Is a screenshot worth indexing when the text is barely legible?
3. What happens to the index when the archive moves to a new machine with a different path prefix?

The first two are interesting. The third is a bug waiting to happen, and the fix is to store paths relative to the archive root. That change is small enough to land this month.

*Placeholder project. Replace this entry with real material before publishing.*
