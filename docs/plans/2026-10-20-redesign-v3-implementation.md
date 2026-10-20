# Redesign v3 (Digital Garden) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the "title sequence" motion-graphics site with the v3 digital-garden design: a calm, typographic site with a sidebar shell, a signature home sentence, image-led bento, year-grouped indexes, a cover grid, a career timeline, and one ink-sweep interaction.

**Architecture:** Astro 7 static site, no client framework. All derived values (dates, timeline geometry, fallback cover colours, groupings) come from small pure TypeScript helpers in `src/lib/`, written test-first with Vitest. Components stay thin: they map helper output to markup and scoped CSS. One stylesheet (`src/styles/global.css`) owns tokens, the layout shell, prose, code blocks, and the ink sweep. Page navigation uses native cross-document View Transitions, so Astro's `ClientRouter` and every `astro:page-load` listener go away; component scripts run once per page load.

**Tech Stack:** Astro 7.3, TypeScript (strict), Vitest 5, `astro-icon` with `@iconify-json/ph` and `@iconify-json/simple-icons`, Fontsource variable fonts (Newsreader, Geist, Geist Mono), pnpm 11.

**Source of truth:** `docs/plans/2026-10-20-redesign-v3-design.md` (the approved design) and the canvas `portfolio-v3.pen` (frame ids in the design doc's canvas index). When the two disagree, the canvas wins for measurements and this plan says so where it matters.

---

## Before you start

- Read the design doc end to end. It is short.
- `.pen` files are encrypted: open them with the Pencil MCP tools (`mcp__pencil__execute` with `Get`/`TakeScreenshot`), never with Read or grep.
- Breakpoints used everywhere:
  - desktop: `min-width: 68.75rem` (1100 px)
  - tablet: `max-width: 68.6875rem` (≤ 1099 px)
  - mobile: `max-width: 47.9375rem` (≤ 767 px)
- Commands: `pnpm test` (Vitest), `pnpm check` (astro check), `pnpm build` (check + build), `pnpm dev` (http://localhost:4321).
- Pages you have not reached yet will look broken in the middle of the plan once the old stylesheet is replaced (Task 10). That is expected; each page is rebuilt in its own task. `pnpm build` must still pass at every commit.

### Canvas values this plan relies on (already extracted)

| Thing | Value |
|---|---|
| Sidebar | 160 wide, 56 px gap to content, avatar 56 r10 with 1 px `--rule` outline, gap 20 between avatar / identity / nav / contact; nav item pitch 23–24 px; contact group has a 1 px `--rule` top border, 14 px padding, 22 px pitch |
| Page content padding | top 96, bottom 120 (detail pages top 72) |
| Section headings (`Experience`, `Reading now`, year headings) | Geist Mono 12, ink, 10 px bottom padding, **1 px ink bottom border** |
| Index rows | 1 px `--rule` bottom border; home rows padding 13/0 gap 24; writing rows padding 20/0 gap 32 |
| Home bento | featured 416 × 420 image, right column 288 wide, gap 16; caption gap 12 |
| Work bento | featured 720 × 400; half tiles 352 wide, image 260 tall; row gap 32, column gap 16 |
| Fallback tile | `--tile` slot, radius 16, padding 28, title Newsreader 72 (full) / 44 (half), line-height 1.05 |
| Timeline | 80 px per year at 720; bars 32 tall r6, lanes 40 px apart (72 total); 4 px gap between touching bars; ticks 1 × 6 `#CFCBC2`; part-time bar `#F6F5F1` with 1 px `#DEDBD3`; full-time `#ECEAE4`; current `--accent` with white label; panel has 2 px rust left rule, padding 20 |
| Timeline (mobile) | 56 px per year, axis x = 40, bars 10 wide r3 at x = 46 (lane 2 at x = 60), details at x = 86, bars `#DCD9D1`; label blocks stacked at least 66 px apart |
| Toolkit | group label column 88 + 16 gap; tiles 68 × 76 r10, gap 8, icon 24, name Geist 9.5–10 muted; Laravel tile has 1 px rust outline |
| Book covers | 162 × 243 (2:3), radius 4, 1 px `#00000014` border; fallback palette below; cover text `#141414` or `#F4F2EC` |
| Contents sheet | radius 18 18 0 0, padding 10 20 28, grabber 36 × 4 `#D6D2C9`; items Geist 15 (H3 14 muted, 16 indent); active = rust + 2 × 16 rust marker; scrim `#1414144D` |
| 404 | numeral Newsreader 300, `#ECEAE4`, line-height 0.9; line Newsreader **32** on canvas (the doc's type table says 40; follow the canvas) |

---

## Task 0: Branch and baseline

**Files:** none changed.

**Step 1: Create the branch**

```bash
git switch -c redesign-v3
```

**Step 2: Commit the approved design and canvas** (ask the user first if they have not already approved committing them)

```bash
git add docs/plans/2026-10-20-redesign-v3-design.md docs/plans/2026-10-20-redesign-v3-implementation.md portfolio-v3.pen
git commit -m "docs: add v3 digital garden design, canvas, and implementation plan"
```

Leave `docs/home-server*.md` alone; they are unrelated.

**Step 3: Record the baseline**

Run: `pnpm install && pnpm test && pnpm build`
Expected: all tests pass, build succeeds. If not, stop and report; do not start on a red baseline.

---

## Task 1: Swap fonts and add the brand icon set

**Files:**
- Modify: `package.json` (via pnpm)
- Modify: `src/styles/fonts.css`

**Step 1: Swap dependencies**

```bash
pnpm remove @fontsource-variable/archivo @fontsource-variable/literata @fontsource/ibm-plex-mono
pnpm add @fontsource-variable/newsreader @fontsource-variable/geist @fontsource-variable/geist-mono @iconify-json/simple-icons
```

**Step 2: Replace `src/styles/fonts.css`**

```css
/* Newsreader's optical-size axis gives the 300px 404 numeral and the 18px
   prose their own cuts from one file. */
@import '@fontsource-variable/newsreader/opsz.css';
@import '@fontsource-variable/newsreader/opsz-italic.css';
@import '@fontsource-variable/geist';
@import '@fontsource-variable/geist-mono';
```

The families these register are `'Newsreader Variable'`, `'Geist Variable'`, and `'Geist Mono Variable'`.

**Step 3: Verify**

Run: `pnpm build`
Expected: PASS (the old stylesheet still names Archivo/Literata, which now fall back to system fonts; that is fine until Task 10).

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/styles/fonts.css
git commit -m "build: swap to Newsreader, Geist, and Geist Mono; add Simple Icons"
```

---

## Task 2: Date formatters

The v3 design uses mixed-case dates in three shapes: `02 Sep` (index rows, year is the group heading), `02 Sep 2026` (article meta), `Sep 2026` (books, roles, project status). The old `formatDate` (`14 SEP 2026`) moves out of `content.ts`.

**Files:**
- Create: `src/lib/dates.ts`
- Create: `tests/dates.test.ts`
- Modify: `src/lib/content.ts` (remove `formatDate`)
- Modify: `tests/content.test.ts` (remove the `formatDate` block)
- Modify: `src/pages/blog/[...id].astro` (import path)

**Step 1: Write the failing test** — `tests/dates.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { formatDate, formatDay, formatMonth } from '../src/lib/dates';

describe('formatDay', () => {
  it('pads the day and uses a short month, for rows under a year heading', () => {
    expect(formatDay(new Date('2026-09-02'))).toBe('02 Sep');
  });
});

describe('formatDate', () => {
  it('adds the year', () => {
    expect(formatDate(new Date('2026-09-14'))).toBe('14 Sep 2026');
  });

  it('reads the date in UTC, so a late-evening timestamp does not slip a day', () => {
    expect(formatDate(new Date('2026-08-05T23:30:00Z'))).toBe('05 Aug 2026');
  });
});

describe('formatMonth', () => {
  it('drops the day', () => {
    expect(formatMonth(new Date('2026-10-01'))).toBe('Oct 2026');
  });
});
```

**Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/dates.test.ts`
Expected: FAIL, cannot resolve `../src/lib/dates`.

**Step 3: Implement** — `src/lib/dates.ts`

```ts
const month = (date: Date) => date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
const day = (date: Date) => String(date.getUTCDate()).padStart(2, '0');

/** `02 Sep`: for rows that already sit under a year heading. */
export function formatDay(date: Date): string {
  return `${day(date)} ${month(date)}`;
}

/** `02 Sep 2026` */
export function formatDate(date: Date): string {
  return `${formatDay(date)} ${date.getUTCFullYear()}`;
}

/** `Sep 2026` */
export function formatMonth(date: Date): string {
  return `${month(date)} ${date.getUTCFullYear()}`;
}
```

**Step 4: Remove the old formatter**

- In `src/lib/content.ts`, delete the `formatDate` function.
- In `tests/content.test.ts`, delete the `describe('formatDate', …)` block and drop `formatDate` from the import.
- In `src/pages/blog/[...id].astro`, change the import to:
  ```ts
  import { visibleNewestFirst } from '../../lib/content';
  import { formatDate } from '../../lib/dates';
  ```

**Step 5: Run tests and check**

Run: `pnpm test && pnpm check`
Expected: PASS.

**Step 6: Commit**

```bash
git add src/lib/dates.ts tests/dates.test.ts src/lib/content.ts tests/content.test.ts "src/pages/blog/[...id].astro"
git commit -m "feat: add mixed-case date formatters for v3"
```

---

## Task 3: `readingTime()` helper

The design replaces `src/lib/timecode.ts` with a small reading-time helper. Only `readingMinutes` survives; the rest of `timecode.ts` dies with the HUD in Task 11.

**Files:**
- Create: `src/lib/reading-time.ts`
- Create: `tests/reading-time.test.ts`
- Modify: `src/lib/timecode.ts` (remove `readingMinutes`)
- Modify: `tests/timecode.test.ts` (remove the `readingMinutes` block)
- Modify: `src/pages/work/[...id].astro`, `src/pages/blog/[...id].astro`

**Step 1: Write the failing test** — `tests/reading-time.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { readingTime } from '../src/lib/reading-time';

describe('readingTime', () => {
  it('never reports less than one minute', () => {
    expect(readingTime('')).toBe(1);
    expect(readingTime(undefined)).toBe(1);
  });

  it('rounds to the nearest minute at 220 words per minute', () => {
    expect(readingTime(Array(660).fill('word').join(' '))).toBe(3);
  });

  it('ignores runs of whitespace', () => {
    expect(readingTime('one\n\n  two\tthree', 1)).toBe(3);
  });
});
```

**Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/reading-time.test.ts`
Expected: FAIL, module not found.

**Step 3: Implement** — `src/lib/reading-time.ts`

```ts
/** Rough reading time for a Markdown body, in whole minutes (minimum 1). */
export function readingTime(body: string | undefined, wordsPerMinute = 220): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
```

**Step 4: Switch callers and remove the old copy**

- `src/pages/work/[...id].astro` and `src/pages/blog/[...id].astro`: replace `import { readingMinutes } from '../../lib/timecode';` with `import { readingTime } from '../../lib/reading-time';` and `readingMinutes(` with `readingTime(`.
- `src/lib/timecode.ts`: delete `readingMinutes`.
- `tests/timecode.test.ts`: delete the `readingMinutes` block and its import name.

**Step 5: Run tests and check**

Run: `pnpm test && pnpm check`
Expected: PASS.

**Step 6: Commit**

```bash
git add src/lib/reading-time.ts tests/reading-time.test.ts src/lib/timecode.ts tests/timecode.test.ts src/pages
git commit -m "refactor: move reading time into its own helper"
```

---

## Task 4: "Last tended" helpers

The home page says `last tended 3 days ago`. The site is static, so the build renders an age and a three-line client script recomputes it from the `<time datetime>` on load. Both sides use the same function.

**Files:**
- Create: `src/lib/time-ago.ts`
- Create: `tests/time-ago.test.ts`

**Step 1: Write the failing test** — `tests/time-ago.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { latest, timeAgo } from '../src/lib/time-ago';

const now = new Date('2026-10-20T15:00:00Z');
const daysBefore = (days: number) => new Date(now.getTime() - days * 86_400_000);

describe('timeAgo', () => {
  it('counts calendar days, not 24-hour blocks', () => {
    expect(timeAgo(new Date('2026-10-20T01:00:00Z'), now)).toBe('today');
    expect(timeAgo(new Date('2026-10-19T23:00:00Z'), now)).toBe('yesterday');
  });

  it('uses days for the first two weeks', () => {
    expect(timeAgo(daysBefore(3), now)).toBe('3 days ago');
    expect(timeAgo(daysBefore(13), now)).toBe('13 days ago');
  });

  it('switches to weeks, then months, then years', () => {
    expect(timeAgo(daysBefore(14), now)).toBe('2 weeks ago');
    expect(timeAgo(daysBefore(59), now)).toBe('8 weeks ago');
    expect(timeAgo(daysBefore(60), now)).toBe('2 months ago');
    expect(timeAgo(daysBefore(364), now)).toBe('12 months ago');
    expect(timeAgo(daysBefore(365), now)).toBe('a year ago');
    expect(timeAgo(daysBefore(800), now)).toBe('2 years ago');
  });

  it('treats a future date as today', () => {
    expect(timeAgo(new Date('2026-11-01'), now)).toBe('today');
  });
});

describe('latest', () => {
  it('returns the newest date and skips missing ones', () => {
    const newest = new Date('2026-10-01');
    expect(latest([undefined, new Date('2025-01-01'), newest])).toBe(newest);
  });

  it('returns undefined for nothing', () => {
    expect(latest([])).toBeUndefined();
  });
});
```

**Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/time-ago.test.ts`
Expected: FAIL, module not found.

**Step 3: Implement** — `src/lib/time-ago.ts`

```ts
const DAY = 86_400_000;
const utcDay = (date: Date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

/** A short, human age such as `3 days ago`, counted in calendar days (UTC). */
export function timeAgo(from: Date, now: Date): string {
  const days = Math.max(0, Math.round((utcDay(now) - utcDay(from)) / DAY));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  const years = Math.floor(days / 365);
  return years === 1 ? 'a year ago' : `${years} years ago`;
}

/** The newest of a set of optional dates. */
export function latest(dates: Array<Date | undefined>): Date | undefined {
  return dates.reduce<Date | undefined>((max, date) => (date && (!max || date > max) ? date : max), undefined);
}
```

**Step 4: Run the test**

Run: `pnpm vitest run tests/time-ago.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/time-ago.ts tests/time-ago.test.ts
git commit -m "feat: add timeAgo and latest helpers for the last-tended line"
```

---

## Task 5: Content helpers (grouping, bento order, captions, shelves)

**Files:**
- Modify: `src/lib/content.ts`
- Modify: `tests/content.test.ts`

**Step 1: Write the failing tests** — append to `tests/content.test.ts` (and extend its import line to: `import { arrangeWork, articleMeta, bookDate, bookMeta, bookShelves, groupBooks, groupByYear, visibleNewestFirst, workCaption, workStatusLine, workStatusLabels } from '../src/lib/content';`)

```ts
describe('groupByYear', () => {
  it('groups newest first and keeps each year newest first', () => {
    const items = [
      { id: 'a', date: new Date('2025-03-01') },
      { id: 'b', date: new Date('2026-09-02') },
      { id: 'c', date: new Date('2026-05-30') },
    ];
    expect(groupByYear(items, (item) => item.date)).toEqual([
      { year: 2026, items: [items[1], items[2]] },
      { year: 2025, items: [items[0]] },
    ]);
  });
});

describe('arrangeWork', () => {
  it('leads with the first featured entry and keeps the rest in order', () => {
    const entries = [
      { id: 'new', data: { featured: false } },
      { id: 'star', data: { featured: true } },
      { id: 'old', data: { featured: true } },
    ];
    const { featured, rest } = arrangeWork(entries);
    expect(featured?.id).toBe('star');
    expect(rest.map(({ id }) => id)).toEqual(['new', 'old']);
  });

  it('falls back to the newest entry when nothing is featured', () => {
    const entries = [{ id: 'a', data: { featured: false } }, { id: 'b', data: { featured: false } }];
    expect(arrangeWork(entries).featured?.id).toBe('a');
  });

  it('handles an empty collection', () => {
    expect(arrangeWork([])).toEqual({ featured: undefined, rest: [] });
  });
});

describe('work captions', () => {
  it('captions a tile with status and start year', () => {
    expect(workCaption({ status: 'building', date: new Date('2026-08-14') })).toBe('building · 2026');
  });

  it('describes an open project from its start month', () => {
    expect(workStatusLine({ status: 'building', date: new Date('2026-08-14') })).toBe('building · since Aug 2026');
  });

  it('describes a closed project as a month range', () => {
    expect(
      workStatusLine({ status: 'shipped', date: new Date('2026-03-02'), endDate: new Date('2026-06-30') }),
    ).toBe('shipped · Mar 2026 – Jun 2026');
  });
});

describe('books', () => {
  const base = { date: new Date('2026-01-01') };

  it('dates a book by when it was finished, else started, else added', () => {
    expect(bookDate({ ...base, status: 'finished', finishedDate: new Date('2026-09-01') })).toEqual(new Date('2026-09-01'));
    expect(bookDate({ ...base, status: 'reading', startedDate: new Date('2026-10-01') })).toEqual(new Date('2026-10-01'));
    expect(bookDate({ ...base, status: 'want-to-read' })).toEqual(base.date);
  });

  it('labels each state the way the cover grid shows it', () => {
    expect(bookMeta({ ...base, status: 'reading', startedDate: new Date('2026-10-03') })).toBe('since Oct 2026');
    expect(bookMeta({ ...base, status: 'finished', finishedDate: new Date('2026-09-20') })).toBe('Sep 2026');
    expect(bookMeta({ ...base, status: 'paused' })).toBe('paused');
    expect(bookMeta({ ...base, status: 'want-to-read' })).toBe('want to read');
  });

  it('shelves paused and want-to-read together, paused first', () => {
    const books = [
      { id: 'later', data: { status: 'want-to-read' as const } },
      { id: 'now', data: { status: 'reading' as const } },
      { id: 'stalled', data: { status: 'paused' as const } },
    ];
    expect(bookShelves(books).map(({ label, entries }) => [label, entries.map(({ id }) => id)])).toEqual([
      ['Reading now', ['now']],
      ['Paused / Want to read', ['stalled', 'later']],
    ]);
  });
});

describe('articleMeta', () => {
  it('joins date, same-year update, reading time, and topics', () => {
    expect(
      articleMeta(
        { date: new Date('2026-09-02'), updatedDate: new Date('2026-09-11'), topics: ['Practice', 'Reading'] },
        4,
      ),
    ).toBe('02 Sep 2026 · updated 11 Sep · 4 min read · Practice, Reading');
  });

  it('keeps the year on an update from a later year and skips empty parts', () => {
    expect(articleMeta({ date: new Date('2025-12-30'), updatedDate: new Date('2026-01-04'), topics: [] }, 1)).toBe(
      '30 Dec 2025 · updated 04 Jan 2026 · 1 min read',
    );
  });
});
```

**Step 2: Run them to see them fail**

Run: `pnpm vitest run tests/content.test.ts`
Expected: FAIL, the new names are not exported.

**Step 3: Implement** — add to `src/lib/content.ts` (keep `visibleNewestFirst`, `groupBooks`, `BookStatus`, and `workStatusLabels` for now; `workStatusLabels` is removed in Task 20)

```ts
import { formatDate, formatDay, formatMonth } from './dates';

export type WorkStatus = 'building' | 'shipped' | 'paused' | 'archived';

/** One row in a year-grouped index (home garden index, writing index). */
export type IndexRow = {
  href: string;
  title: string;
  date: Date;
  description?: string;
  kind?: 'note' | 'book';
};

export function groupByYear<T>(items: T[], dateOf: (item: T) => Date): Array<{ year: number; items: T[] }> {
  const groups: Array<{ year: number; items: T[] }> = [];
  for (const item of items.toSorted((a, b) => dateOf(b).getTime() - dateOf(a).getTime())) {
    const year = dateOf(item).getUTCFullYear();
    const last = groups.at(-1);
    if (last?.year === year) last.items.push(item);
    else groups.push({ year, items: [item] });
  }
  return groups;
}

/** The bento leads with a featured project (or the newest one); the rest follow in order. */
export function arrangeWork<T extends { data: { featured: boolean } }>(entries: T[]) {
  const featured = entries.find(({ data }) => data.featured) ?? entries[0];
  return { featured, rest: entries.filter((entry) => entry !== featured) };
}

type WorkDates = { status: WorkStatus; date: Date; endDate?: Date };

/** Tile caption: `building · 2026`. */
export function workCaption({ status, date }: WorkDates): string {
  return `${status} · ${date.getUTCFullYear()}`;
}

/** Detail meta table: `building · since Aug 2026` or `shipped · Mar 2026 – Jun 2026`. */
export function workStatusLine({ status, date, endDate }: WorkDates): string {
  return endDate
    ? `${status} · ${formatMonth(date)} – ${formatMonth(endDate)}`
    : `${status} · since ${formatMonth(date)}`;
}

type BookDates = { status: BookStatus; date: Date; startedDate?: Date; finishedDate?: Date };

export function bookDate({ date, startedDate, finishedDate }: BookDates): Date {
  return finishedDate ?? startedDate ?? date;
}

export function bookMeta(book: BookDates): string {
  switch (book.status) {
    case 'reading':
      return `since ${formatMonth(book.startedDate ?? book.date)}`;
    case 'finished':
      return formatMonth(book.finishedDate ?? book.date);
    case 'paused':
      return 'paused';
    case 'want-to-read':
      return 'want to read';
  }
}

const shelfLabels: Record<BookStatus, string> = {
  reading: 'Reading now',
  finished: 'Finished',
  paused: 'Paused / Want to read',
  'want-to-read': 'Paused / Want to read',
};

/** Cover-grid sections: paused and want-to-read share one shelf. */
export function bookShelves<T extends { data: { status: BookStatus; order?: number } }>(books: T[]) {
  const shelves: Array<{ label: string; entries: T[] }> = [];
  for (const { status, entries } of groupBooks(books)) {
    const label = shelfLabels[status];
    const shelf = shelves.find((existing) => existing.label === label);
    if (shelf) shelf.entries.push(...entries);
    else shelves.push({ label, entries: [...entries] });
  }
  return shelves;
}

/** Article meta line: `02 Sep 2026 · updated 11 Sep · 4 min read · Practice, Reading`. */
export function articleMeta(
  { date, updatedDate, topics }: { date: Date; updatedDate?: Date; topics: string[] },
  minutes: number,
): string {
  const updated =
    updatedDate && (updatedDate.getUTCFullYear() === date.getUTCFullYear() ? formatDay(updatedDate) : formatDate(updatedDate));
  return [formatDate(date), updated && `updated ${updated}`, `${minutes} min read`, topics.join(', ')]
    .filter(Boolean)
    .join(' · ');
}
```

**Step 4: Run tests**

Run: `pnpm test`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/content.ts tests/content.test.ts
git commit -m "feat: add grouping, bento, caption, and shelf helpers"
```

---

## Task 6: Active navigation helper

**Files:**
- Create: `src/lib/nav.ts`
- Create: `tests/nav.test.ts`

**Step 1: Write the failing test** — `tests/nav.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { isActive } from '../src/lib/nav';

describe('isActive', () => {
  it('matches Home only on the root', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/', '/work/')).toBe(false);
  });

  it('keeps a section active on its detail pages', () => {
    expect(isActive('/work/', '/work/atlas-index/')).toBe(true);
    expect(isActive('/blog/', '/blog/reading-code-slowly/')).toBe(true);
  });

  it('tolerates a missing trailing slash', () => {
    expect(isActive('/blog/', '/blog')).toBe(true);
  });

  it('does not match a section that only shares a prefix', () => {
    expect(isActive('/read/', '/reading-list/')).toBe(false);
  });
});
```

**Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/nav.test.ts`
Expected: FAIL, module not found.

**Step 3: Implement** — `src/lib/nav.ts`

```ts
/** Whether a nav item (`/`, `/work/`, …) is the current section for a pathname. */
export function isActive(href: string, pathname: string): boolean {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return href === '/' ? path === '/' : path.startsWith(href);
}
```

**Step 4: Run the test**

Run: `pnpm vitest run tests/nav.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/nav.ts tests/nav.test.ts
git commit -m "feat: add isActive nav helper"
```

---

## Task 7: Career timeline geometry

Bars are positioned by `--from` / `--to` custom properties measured in **years since the axis origin (2018)**. The same numbers drive layout and the grow animation. On mobile the timeline turns vertical (newest on top) and the detail blocks beside the bars must not overlap; that collision pass is a pure function too.

Real data note: Warung Pintar ends May 2022 and eFishery starts May 2022, so two same-lane bars overlap by a handover month. The earlier bar yields.

**Files:**
- Create: `src/lib/timeline.ts`
- Create: `tests/timeline.test.ts`

**Step 1: Write the failing test** — `tests/timeline.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { buildTimeline, monthToYears, roleDates, stackLabels, verticalLayout, type Role } from '../src/lib/timeline';

const role = (company: string, start: string, end: string | null, type: Role['type'] = 'full-time'): Role => ({
  company,
  role: 'Engineer',
  start,
  end,
  type,
  summary: '',
});

const roles = [
  role('Indorelawan', '2018-08', '2020-12'),
  role('FishGo', '2020-01', '2020-12', 'part-time'),
  role('Warung Pintar', '2021-01', '2022-05'),
  role('eFishery', '2022-05', '2024-08'),
  role('ADW Consulting', '2024-11', null),
];
const today = new Date('2026-10-20');

describe('monthToYears', () => {
  it('places a month at its first day, or just after its last day', () => {
    expect(monthToYears('2018-08')).toBeCloseTo(2018 + 7 / 12);
    expect(monthToYears('2018-08', 'end')).toBeCloseTo(2018 + 8 / 12);
  });
});

describe('buildTimeline', () => {
  const timeline = buildTimeline(roles, today);

  it('spans whole years from the origin to now', () => {
    expect(timeline.origin).toBe(2018);
    expect(timeline.now).toBeCloseTo(8.8, 1);
    expect(timeline.span).toBe(9);
  });

  it('orders bars oldest first and runs the current role to now', () => {
    expect(timeline.bars.map((bar) => bar.role.company)).toEqual([
      'Indorelawan',
      'FishGo',
      'Warung Pintar',
      'eFishery',
      'ADW Consulting',
    ]);
    const current = timeline.bars.at(-1)!;
    expect(current.current).toBe(true);
    expect(current.from).toBeCloseTo(6 + 10 / 12);
    expect(current.to).toBeCloseTo(timeline.now);
  });

  it('puts part-time work on the second lane', () => {
    expect(timeline.bars.find((bar) => bar.role.company === 'FishGo')!.lane).toBe(2);
    expect(timeline.bars.find((bar) => bar.role.company === 'eFishery')!.lane).toBe(1);
  });

  it('trims a same-lane handover month so bars never overlap', () => {
    const warung = timeline.bars.find((bar) => bar.role.company === 'Warung Pintar')!;
    const efishery = timeline.bars.find((bar) => bar.role.company === 'eFishery')!;
    expect(warung.to).toBeCloseTo(efishery.from);
  });
});

describe('roleDates', () => {
  it('collapses a full calendar year', () => {
    expect(roleDates({ start: '2020-01', end: '2020-12' })).toBe('2020');
  });

  it('shows a month range, open-ended for the current role', () => {
    expect(roleDates({ start: '2022-05', end: '2024-08' })).toBe('May 2022 — Aug 2024');
    expect(roleDates({ start: '2024-11', end: null })).toBe('Nov 2024 — now');
  });
});

describe('stackLabels', () => {
  it('pushes a label down until it clears the one above', () => {
    expect(stackLabels([0, 121, 252, 327, 327], 66)).toEqual([0, 121, 252, 327, 393]);
  });
});

describe('verticalLayout', () => {
  it('puts the newest role on top and keeps labels apart', () => {
    const layout = verticalLayout(buildTimeline(roles, today));
    const adw = layout[4];
    const fishgo = layout[1];
    const indorelawan = layout[0];
    expect(adw.barTop).toBe(0);
    expect(fishgo.labelTop).toBe(fishgo.barTop);
    expect(indorelawan.labelTop).toBe(fishgo.labelTop + 66);
  });
});
```

**Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/timeline.test.ts`
Expected: FAIL, module not found.

**Step 3: Implement** — `src/lib/timeline.ts`

```ts
import { formatMonth } from './dates';

export type Role = {
  company: string;
  role: string;
  /** First month in the role, `YYYY-MM`. */
  start: string;
  /** Last month in the role, `YYYY-MM`; `null` while it is the current role. */
  end: string | null;
  type: 'full-time' | 'part-time';
  summary: string;
};

export type TimelineBar = {
  role: Role;
  /** Years since the origin. */
  from: number;
  to: number;
  lane: 1 | 2;
  current: boolean;
};

export type Timeline = { origin: number; span: number; now: number; bars: TimelineBar[] };

const parseMonth = (month: string) => month.split('-').map(Number) as [number, number];

/** Fractional years for a `YYYY-MM` month: its first day, or (edge `end`) the day after it ends. */
export function monthToYears(month: string, edge: 'start' | 'end' = 'start'): number {
  const [year, m] = parseMonth(month);
  return year + (m - 1 + (edge === 'end' ? 1 : 0)) / 12;
}

function dateToYears(date: Date): number {
  return date.getUTCFullYear() + (date.getUTCMonth() + (date.getUTCDate() - 1) / 31) / 12;
}

export function buildTimeline(roles: Role[], today: Date, origin = 2018): Timeline {
  const now = dateToYears(today) - origin;
  const bars: TimelineBar[] = roles
    .map((role) => ({
      role,
      from: monthToYears(role.start) - origin,
      to: role.end ? monthToYears(role.end, 'end') - origin : now,
      lane: role.type === 'part-time' ? (2 as const) : (1 as const),
      current: role.end === null,
    }))
    .toSorted((a, b) => a.from - b.from);

  // A handover month would draw two same-lane bars on top of each other: the earlier one yields.
  for (const lane of [1, 2]) {
    const inLane = bars.filter((bar) => bar.lane === lane);
    for (let i = 1; i < inLane.length; i++) {
      inLane[i - 1].to = Math.min(inLane[i - 1].to, inLane[i].from);
    }
  }

  return { origin, span: Math.max(1, Math.ceil(now)), now, bars };
}

/** `May 2022 — Aug 2024`, `Nov 2024 — now`, or `2020` for one full calendar year. */
export function roleDates({ start, end }: Pick<Role, 'start' | 'end'>): string {
  if (end && start.endsWith('-01') && end.endsWith('-12') && start.slice(0, 4) === end.slice(0, 4)) {
    return start.slice(0, 4);
  }
  const label = (month: string) => {
    const [year, m] = parseMonth(month);
    return formatMonth(new Date(Date.UTC(year, m - 1)));
  };
  return `${label(start)} — ${end ? label(end) : 'now'}`;
}

/** Pushes each label (in top-to-bottom order) down until it is at least `minGap` below the one before. */
export function stackLabels(tops: number[], minGap: number): number[] {
  const placed: number[] = [];
  for (const top of tops) {
    const previous = placed.at(-1);
    placed.push(previous === undefined ? top : Math.max(top, previous + minGap));
  }
  return placed;
}

/** Mobile geometry in px, indexed like `timeline.bars`: newest on top, labels kept apart. */
export function verticalLayout(timeline: Timeline, pxPerYear = 56, labelGap = 66) {
  const order = timeline.bars
    .map((bar, index) => ({ index, top: Math.round((timeline.now - bar.to) * pxPerYear), from: bar.from }))
    // Bars ending together: the one that started later sits higher.
    .toSorted((a, b) => a.top - b.top || b.from - a.from);
  const labelTops = stackLabels(order.map(({ top }) => top), labelGap);

  const layout: Array<{ barTop: number; barHeight: number; labelTop: number }> = [];
  order.forEach(({ index, top }, k) => {
    const bar = timeline.bars[index];
    layout[index] = { barTop: top, barHeight: Math.round((bar.to - bar.from) * pxPerYear), labelTop: labelTops[k] };
  });
  return layout;
}
```

**Step 4: Run the test**

Run: `pnpm vitest run tests/timeline.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/timeline.ts tests/timeline.test.ts
git commit -m "feat: add career timeline geometry helpers"
```

---

## Task 8: Fallback book covers

Books without a `cover` get a muted colour block picked from the canvas palette by title, with text in whichever of ink or paper reads better on it.

**Files:**
- Create: `src/lib/cover.ts`
- Create: `tests/cover.test.ts`

**Step 1: Write the failing test** — `tests/cover.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { contrastRatio, coverInk, coverPalette, fallbackCover } from '../src/lib/cover';

describe('contrastRatio', () => {
  it('matches the WCAG figure for the site ink on its background', () => {
    expect(contrastRatio('#141414', '#FBFBF9')).toBeCloseTo(17.8, 1);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#FBFBF9', '#141414')).toBeCloseTo(contrastRatio('#141414', '#FBFBF9'));
  });
});

describe('coverInk', () => {
  it('sets light text on dark and saturated covers', () => {
    expect(coverInk('#2F3A35')).toBe('#F4F2EC');
    expect(coverInk('#B5543A')).toBe('#F4F2EC');
  });

  it('sets ink on light and mid-tone covers', () => {
    expect(coverInk('#D9D3C7')).toBe('#141414');
    expect(coverInk('#8E9A8A')).toBe('#141414');
  });
});

describe('fallbackCover', () => {
  it('is stable for a title and always from the palette', () => {
    const cover = fallbackCover('Thinking in Systems');
    expect(fallbackCover('Thinking in Systems')).toEqual(cover);
    expect(coverPalette).toContain(cover.background);
    expect(cover.ink).toBe(coverInk(cover.background));
  });
});
```

**Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/cover.test.ts`
Expected: FAIL, module not found.

**Step 3: Implement** — `src/lib/cover.ts`

```ts
/** Muted cover colours from the Reading canvas. */
export const coverPalette = [
  '#2F3A35',
  '#D9D3C7',
  '#B5543A',
  '#C9D1C8',
  '#3B3F4A',
  '#8E9A8A',
  '#E6E0D4',
  '#CFC6B8',
  '#5C4A3D',
] as const;

const inks = ['#141414', '#F4F2EC'] as const;

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two `#RRGGBB` colours. */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Ink or paper, whichever reads better on the cover. */
export function coverInk(background: string): (typeof inks)[number] {
  return contrastRatio(background, inks[0]) >= contrastRatio(background, inks[1]) ? inks[0] : inks[1];
}

export function fallbackCover(title: string) {
  let hash = 0;
  for (const char of title) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  const background = coverPalette[hash % coverPalette.length];
  return { background, ink: coverInk(background) };
}
```

**Step 4: Run the test**

Run: `pnpm vitest run tests/cover.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/cover.ts tests/cover.test.ts
git commit -m "feat: add fallback book cover colours"
```

---

## Task 9: Site data (nav, contact, experience, toolkit)

Experience comes from Indra's CV (`~/Downloads/CV - Indra Arianggi Suryaatmaja.pdf`). The ADW summary is the approved canvas copy; the others are condensed from the CV bullets. **Ask the user to review the four condensed summaries before merging.**

Brand colours come from Simple Icons. TanStack's own hex (`#ECE8D1`) disappears on `--bg`, so it uses TanStack Query's red. Next.js, Express, and Radix UI are black brands, so their hover shows no change; that is correct, not a bug.

**Files:**
- Modify: `src/config/site.ts`
- Create: `tests/site.test.ts`
- Modify: `astro.config.mjs`

**Step 1: Write the failing test** — `tests/site.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { icons } from '@iconify-json/simple-icons';
import { experience, site, toolGroups, toolkit } from '../src/config/site';

describe('nav', () => {
  it('lists five peers and keeps the old URLs', () => {
    expect(site.nav.map(({ href }) => href)).toEqual(['/', '/work/', '/blog/', '/read/', '/about/']);
    expect(site.nav.map(({ label }) => label)).toEqual(['Home', 'Work', 'Writing', 'Reading', 'About']);
  });
});

describe('experience', () => {
  it('has exactly one current role', () => {
    expect(experience.filter(({ end }) => end === null)).toHaveLength(1);
  });

  it('uses YYYY-MM months that run forwards', () => {
    for (const { start, end } of experience) {
      expect(start).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      if (end) {
        expect(end).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        expect(end >= start).toBe(true);
      }
    }
  });
});

describe('toolkit', () => {
  it('only names icons that Simple Icons ships, or draws a monogram', () => {
    for (const tool of toolkit) {
      if (tool.icon) expect(icons.icons[tool.icon], tool.name).toBeDefined();
      else expect(tool.monogram, tool.name).toMatch(/^\S{1,2}$/);
    }
  });

  it('puts every tool in a known group', () => {
    for (const tool of toolkit) expect(toolGroups).toContain(tool.group);
  });
});
```

**Step 2: Run it to see it fail**

Run: `pnpm vitest run tests/site.test.ts`
Expected: FAIL, `experience` / `toolkit` / `site.nav` missing.

**Step 3: Replace `src/config/site.ts`**

The old `primaryNav`, `secondaryNav`, and `socialLinks` keys stay until Task 11 removes the header and footer that read them.

```ts
import type { Role } from '../lib/timeline';

export const site = {
  name: 'Indra Arianggi',
  role: 'Software engineer',
  title: 'Indra Arianggi | Software Engineer',
  description: 'I build to understand. I write to remember. I read because useful ideas rarely stay inside one field.',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/work/', label: 'Work' },
    { href: '/blog/', label: 'Writing' },
    { href: '/read/', label: 'Reading' },
    { href: '/about/', label: 'About' },
  ],
  contact: [
    { href: 'https://github.com/indraarianggi', label: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/indraarianggi', label: 'LinkedIn', external: true },
    { href: '/rss.xml', label: 'RSS', external: false },
  ],
  /** @deprecated Removed with SiteHeader in Task 11. */
  primaryNav: [
    { href: '/', label: 'Home' },
    { href: '/work/', label: 'Work' },
    { href: '/blog/', label: 'Blog' },
  ],
  /** @deprecated Removed with SiteFooter in Task 11. */
  secondaryNav: [
    { href: '/about/', label: 'About' },
    { href: '/read/', label: 'Read' },
  ],
  /** @deprecated Removed with SiteFooter in Task 11. */
  socialLinks: [] as ReadonlyArray<{ href: string; label: string }>,
} as const;

/** Oldest first. */
export const experience: Role[] = [
  {
    company: 'Indorelawan',
    role: 'Full Stack Engineer',
    start: '2018-08',
    end: '2020-12',
    type: 'full-time',
    summary:
      'Migrated the legacy codebase from AngularJS to React, built a custom CMS for creating and managing events, and redesigned the site to grow registrations and engagement.',
  },
  {
    company: 'FishGo',
    role: 'Backend Engineer',
    start: '2020-01',
    end: '2020-12',
    type: 'part-time',
    summary: 'Designed and built the RESTful APIs behind the mobile app, and the database schemas they ran on.',
  },
  {
    company: 'Warung Pintar',
    role: 'Software Engineer, Frontend',
    start: '2021-01',
    end: '2022-05',
    type: 'full-time',
    summary:
      "Shipped features for the React Native app and the React internal dashboard, reviewed teammates' code, and tracked down bugs to keep the app stable.",
  },
  {
    company: 'eFishery',
    role: 'Software Engineer, Frontend',
    start: '2022-05',
    end: '2024-08',
    type: 'full-time',
    summary:
      'Built a real-time dashboard for SLA and operational metrics, internal tools that replaced manual admin work, asset tracking to cut stock discrepancies, diagnostic tools for field technicians, and an automated complaint workflow.',
  },
  {
    company: 'ADW Consulting',
    role: 'Frontend Engineer',
    start: '2024-11',
    end: null,
    type: 'full-time',
    summary:
      "Building and maintaining the team's internal UI component library with React, TypeScript, Tailwind CSS, Radix UI and Storybook. Planned and built the mobile-responsive version of a Next.js web app. Leading pull request reviews, and building full-stack features with Hono, NestJS, TanStack Start and PostgreSQL.",
  },
];

export const toolGroups = ['Languages', 'Frontend', 'Backend'] as const;

export type Tool = {
  name: string;
  group: (typeof toolGroups)[number];
  /** Simple Icons slug. Omit when Simple Icons has no mark; `monogram` is drawn instead. */
  icon?: string;
  monogram?: string;
  /** Brand colour revealed on hover, without `#`. */
  brandHex?: string;
  learning?: boolean;
};

export const toolkit: Tool[] = [
  { name: 'TypeScript', group: 'Languages', icon: 'typescript', brandHex: '3178C6' },
  { name: 'JavaScript', group: 'Languages', icon: 'javascript', brandHex: 'F7DF1E' },
  { name: 'HTML', group: 'Languages', icon: 'html5', brandHex: 'E34F26' },
  { name: 'CSS', group: 'Languages', icon: 'css', brandHex: '663399' },
  { name: 'React', group: 'Frontend', icon: 'react', brandHex: '61DAFB' },
  { name: 'Next.js', group: 'Frontend', icon: 'nextdotjs', brandHex: '000000' },
  { name: 'React Native', group: 'Frontend', icon: 'react', brandHex: '61DAFB' },
  // TanStack's own #ECE8D1 vanishes on the page background; TanStack Query's red reads.
  { name: 'TanStack', group: 'Frontend', icon: 'tanstack', brandHex: 'FF4154' },
  { name: 'Zustand', group: 'Frontend', monogram: 'Zu' },
  { name: 'Tailwind', group: 'Frontend', icon: 'tailwindcss', brandHex: '06B6D4' },
  { name: 'Radix UI', group: 'Frontend', icon: 'radixui', brandHex: '161618' },
  { name: 'Storybook', group: 'Frontend', icon: 'storybook', brandHex: 'FF4785' },
  { name: 'Node.js', group: 'Backend', icon: 'nodedotjs', brandHex: '5FA04E' },
  { name: 'Hono', group: 'Backend', icon: 'hono', brandHex: 'E36002' },
  { name: 'NestJS', group: 'Backend', icon: 'nestjs', brandHex: 'E0234E' },
  { name: 'Express', group: 'Backend', icon: 'express', brandHex: '0A0A0A' },
  { name: 'PostgreSQL', group: 'Backend', icon: 'postgresql', brandHex: '4169E1' },
  { name: 'Laravel', group: 'Backend', icon: 'laravel', brandHex: 'FF2D20', learning: true },
];
```

**Step 4: Register the icons** — in `astro.config.mjs`, import the toolkit and derive the include list (astro-icon only bundles listed icons). Keep the two `-bold` Phosphor icons until the old table of contents is removed in Task 15.

```js
import { toolkit } from './src/config/site.ts';
// …
  integrations: [
    sitemap(),
    icon({
      include: {
        ph: ['list', 'x', 'list-bold', 'x-bold'],
        'simple-icons': [...new Set(toolkit.flatMap((tool) => (tool.icon ? [tool.icon] : [])))],
      },
    }),
  ],
```

**Step 5: Run tests and build**

Run: `pnpm test && pnpm build`
Expected: PASS.

**Step 6: Commit**

```bash
git add src/config/site.ts tests/site.test.ts astro.config.mjs
git commit -m "feat: add v3 site data for nav, contact, experience, and toolkit"
```

---

## Task 10: Global stylesheet

Replace `src/styles/global.css` wholesale. It owns tokens, base elements, the layout shell, the ink sweep, prose, code blocks, view transitions, and the reduced-motion rule. Components own everything else in scoped `<style>` blocks.

Rules to keep in mind while writing CSS anywhere in this plan:
- Animate only `opacity` and `transform` (and `background-size` for wrapping prose links). Never `transition: all`.
- Rust (`--accent`) only marks something active or current.
- No text lighter than `--muted`.

**Files:**
- Modify (replace): `src/styles/global.css`

**Step 1: Write the stylesheet**

```css
/*
  v3: a digital garden. Ink on near-white; rust only marks what is active or
  current. Type does the work: Newsreader for the voice, Geist for UI, Geist
  Mono for dates and labels.
*/

:root {
  --bg: #fbfbf9;
  --ink: #141414;
  --muted: #6e6a62;
  --rule: #e7e5e0;
  --tile: #f0efea;
  --accent: #a4502f;
  --accent-wash: #a4502f2e;

  /* Supporting surfaces, all taken from the canvas. */
  --code-bg: #f2f1ed;
  --bar: #eceae4; /* timeline bars and the 404 numeral */
  --bar-strong: #dcd9d1; /* narrow mobile bars */
  --bar-part: #f6f5f1;
  --bar-part-edge: #dedbd3;
  --tick: #cfcbc2;
  --scrim: rgb(20 20 20 / 0.3);

  --font-serif: 'Newsreader Variable', Georgia, serif;
  --font-ui: 'Geist Variable', system-ui, sans-serif;
  --font-mono: 'Geist Mono Variable', ui-monospace, monospace;

  --ease-out: cubic-bezier(0.22, 0.7, 0.28, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);

  --content: 45rem; /* 720 */
  --measure: 38.75rem; /* 620, about 70 characters of prose */
  --gutter: 2rem;
  color-scheme: light;
}

@media (max-width: 47.9375rem) {
  :root {
    --gutter: 1.25rem;
  }
}

/* ---- Base ---- */

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-ui);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  text-size-adjust: 100%;
  scroll-padding-top: 2rem;
}

@media (prefers-reduced-motion: no-preference) {
  html:focus-within {
    scroll-behavior: smooth;
  }
}

/* The contents sheet is modal; the page behind it should not scroll. */
html:has(dialog[open]) {
  overflow: hidden;
}

body {
  margin: 0;
  min-width: 20rem;
  background: var(--bg);
}

h1,
h2,
h3,
p,
figure,
dl,
dd {
  margin: 0;
}

h1,
h2,
h3 {
  font-weight: 400;
  text-wrap: balance;
}

p,
li {
  text-wrap: pretty;
}

a {
  color: inherit;
}

a,
button {
  touch-action: manipulation;
}

button {
  font: inherit;
  color: inherit;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}

::selection {
  background: var(--accent-wash);
  color: var(--ink);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 60;
  padding: 0.75rem 1rem;
  background: var(--ink);
  color: var(--bg);
  font-size: 0.8125rem;
  text-decoration: none;
  transform: translateY(-200%);
}

.skip-link:focus-visible {
  transform: none;
}

/* ---- Shared type ---- */

/* Mono labels: section names, year headings. */
.label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;
}

.section-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  padding-block-end: 0.625rem;
  border-block-end: 1px solid var(--ink);
}

.stack {
  display: grid;
  gap: var(--stack-gap, 3rem);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

/* ---- Layout shell ----
   Desktop: 1fr · 720 · 1fr. The sidebar hangs in the left gutter, the table
   of contents (detail pages only) in the right. Below 1100px the sidebar
   becomes a header above one centred column. */

.page {
  display: grid;
  grid-template-columns: 1fr minmax(0, var(--content)) 1fr;
  grid-template-rows: 1fr auto;
  min-height: 100dvh;
}

.page > main {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  padding-block: 6rem 7.5rem;
}

.page > main.is-detail {
  padding-block-start: 4.5rem;
}

.page > .sidebar {
  grid-column: 1;
  grid-row: 1 / -1;
}

.page > .rail {
  grid-column: 3;
  grid-row: 1 / -1;
}

.page > .site-footer {
  grid-column: 2;
  grid-row: 2;
}

/* The table of contents mirrors the sidebar: sticky, full height, centred. */
.rail {
  padding-inline: 3.5rem 1.5rem;
}

.rail-inner {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: min(11.25rem, 100%);
  height: 100dvh;
  overflow-y: auto;
}

.rail-inner > * {
  margin-block: auto;
}

@media (max-width: 68.6875rem) {
  .page {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1fr auto;
  }

  .page > * {
    grid-column: 1;
    width: min(100%, calc(var(--content) + 2 * var(--gutter)));
    margin-inline: auto;
    padding-inline: var(--gutter);
  }

  .page > .sidebar {
    grid-row: 1;
  }

  .page > main {
    grid-row: 2;
    padding-block: 3rem 5rem;
  }

  .page > main.is-detail {
    padding-block-start: 2rem;
  }

  .page > .site-footer {
    grid-row: 3;
  }

  .page > .rail {
    display: none;
  }
}

@media (max-width: 47.9375rem) {
  .page > main {
    padding-block: 2.5rem 3.5rem;
  }

  .page > main.is-detail {
    padding-block-start: 1.5rem;
  }
}

/* ---- Ink sweep ----
   A rust wash grows under the text from the left, tilted with an uneven
   radius so it reads as a highlighter. Text stays ink. Single-line targets
   only; prose links (which wrap) use the background version below. */

.ink {
  position: relative;
  isolation: isolate;
  text-decoration: none;
}

.ink::before {
  content: '';
  position: absolute;
  inset: 0.15em -0.2em 0.05em;
  z-index: -1;
  border-radius: 7px 3px 6px 3px;
  background: var(--accent-wash);
  rotate: -0.6deg;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 160ms var(--ease-out);
}

.ink[aria-current='page']::before,
.ink:focus-visible::before,
[data-ink-row]:focus-visible .ink::before {
  transform: scaleX(1);
}

@media (hover: hover) {
  .ink:hover::before,
  [data-ink-row]:hover .ink::before {
    transform: scaleX(1);
    transition-duration: 240ms;
  }
}

/* ---- Prose ---- */

.prose {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  line-height: 1.65;
}

/* Text runs to 620; code and images use the full 720. */
.prose > :where(p, ul, ol, blockquote, h2, h3, h4, table) {
  max-width: var(--measure);
}

.prose > * + * {
  margin-block-start: 1.25rem;
}

.prose h2 {
  margin-block-start: 3rem;
  font-size: 1.625rem;
  line-height: 1.25;
  letter-spacing: -0.025rem;
}

.prose h3 {
  margin-block-start: 2rem;
  font-size: 1.25rem;
  line-height: 1.3;
}

.prose :is(h2, h3) + * {
  margin-block-start: 0.75rem;
}

.prose ul,
.prose ol {
  margin-inline: 0;
  padding-inline-start: 1.6rem;
}

.prose ul {
  list-style-type: '—\2002';
}

.prose li + li {
  margin-block-start: 0.5rem;
}

.prose li::marker {
  color: var(--muted);
}

.prose ol li::marker {
  font-family: var(--font-mono);
  font-size: 0.8em;
}

.prose blockquote {
  margin-inline: 0;
  padding-inline-start: 1.25rem;
  border-inline-start: 2px solid var(--rule);
  color: var(--muted);
}

.prose :not(pre) > code {
  padding: 0.1em 0.3em;
  border-radius: 4px;
  background: var(--code-bg);
  font-family: var(--font-mono);
  font-size: 0.85em;
}

.prose img {
  border-radius: 12px;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.prose th,
.prose td {
  padding: 0.5em 0.75em;
  border-block-end: 1px solid var(--rule);
  text-align: start;
}

.prose th {
  font-weight: 500;
  border-block-end-color: var(--ink);
}

/* Prose links wrap, so the wash is a background that follows each line. */
.prose a {
  background: linear-gradient(var(--accent-wash), var(--accent-wash)) left 60% / 0% 85% no-repeat;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  text-decoration: underline 1px var(--muted);
  text-underline-offset: 0.2em;
  transition: background-size 160ms var(--ease-out);
}

.prose a:focus-visible {
  background-size: 100% 85%;
}

@media (hover: hover) {
  .prose a:hover {
    background-size: 100% 85%;
    transition-duration: 240ms;
  }
}

@media (max-width: 47.9375rem) {
  .prose {
    font-size: 1.0625rem;
  }

  .prose h2 {
    font-size: 1.4375rem;
  }

  .prose h3 {
    font-size: 1.1875rem;
  }
}

/* ---- Code blocks (header added by src/lib/code-block.ts) ---- */

.prose .code-block {
  margin-block-start: 1.5rem;
  padding: 1.125rem 1.25rem;
  border-radius: 12px;
  background: var(--code-bg);
}

.code-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block-end: 0.625rem;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
}

.code-copy {
  display: grid;
  place-items: center end;
  min-width: 3.5rem;
  min-height: 2.75rem;
  margin-block: -0.875rem;
  margin-inline-start: auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  cursor: pointer;
  transition: transform 160ms var(--ease-out);
}

.code-copy:active {
  transform: scale(0.96);
}

/* The labels share one cell and crossfade, so the swap never shifts width. */
.code-copy-text {
  grid-area: 1 / 1;
  transition: opacity 160ms var(--ease-out);
}

.code-copy-text:not([data-for='idle']),
.code-copy[data-state] .code-copy-text[data-for='idle'] {
  opacity: 0;
}

.code-copy[data-state='copied'] .code-copy-text[data-for='copied'],
.code-copy[data-state='selected'] .code-copy-text[data-for='selected'] {
  opacity: 1;
}

.code-copy[data-state='copied'] {
  color: var(--accent);
}

@media (hover: hover) {
  .code-copy:hover {
    color: var(--ink);
  }
}

.prose pre {
  margin: 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
}

/* ---- Page transitions ----
   Cross-document view transitions: the content crossfades, the sidebar
   holds still. Browsers without support simply navigate. */

@view-transition {
  navigation: auto;
}

::view-transition-group(root) {
  animation-duration: 180ms;
}

::view-transition-old(sidebar) {
  display: none;
}

::view-transition-new(sidebar) {
  animation: none;
}

/* ---- Reduced motion ----
   No spatial movement. Entrances land on their final frame at once; state
   changes still happen, just without the sweep. */

@media (prefers-reduced-motion: reduce) {
  @view-transition {
    navigation: none;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 2: Verify**

Run: `pnpm build`
Expected: PASS. (Pages look broken until rebuilt; that is expected.)

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "style: replace the stage/paper system with v3 tokens, shell, ink sweep, and prose"
```

---

## Task 11: Layout shell (sidebar, footer, base layout)

One `<header class="sidebar">` restyled by media queries: left-gutter sidebar on desktop, one-row header on tablet, two-row header on mobile. (The design doc says `<aside>`; `<header>` is used because this is the site banner and primary navigation, not complementary content.) Contacts live in the sidebar on desktop and in a footer below 1100 px.

This task also removes the film-sequence chrome (`TimelineHud`, `SceneWipe`, `timecode.ts`) and Astro's `ClientRouter`. Native view transitions replace it.

**Files:**
- Create: `src/assets/avatar.png` (moved from `public/avatar.png`)
- Create: `src/components/Sidebar.astro`
- Modify (replace): `src/components/SiteFooter.astro`
- Modify (replace): `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/DetailLayout.astro` (stop forwarding `runtimeMinutes`)
- Modify: `src/config/site.ts` (drop deprecated keys)
- Delete: `src/components/SiteHeader.astro`, `src/components/TimelineHud.astro`, `src/components/SceneWipe.astro`, `src/lib/timecode.ts`, `tests/timecode.test.ts`

**Step 1: Move the portrait and repoint the canvas**

```bash
mkdir -p src/assets && mv public/avatar.png src/assets/avatar.png
```

The canvas fills reference `public/avatar.png`; repoint them so the canvas keeps rendering. Run with `mcp__pencil__execute` on `portfolio-v3.pen`:

```js
Get(n => n.fill && n.fill.type === "image" && n.fill.url === "public/avatar.png" && Update(n.id, { fill: { ...n.fill, url: "src/assets/avatar.png" } }))
```

**Step 2: Create `src/components/Sidebar.astro`**

```astro
---
import { Image } from 'astro:assets';
import avatar from '../assets/avatar.png';
import { site } from '../config/site';
import { isActive } from '../lib/nav';

const { pathname } = Astro.url;
---

<header class="sidebar">
  <div class="sidebar-inner">
    <div class="identity">
      <Image class="avatar" src={avatar} alt="" width={56} height={56} densities={[1, 2]} loading="eager" />
      <p class="identity-text">
        <span class="name">{site.name}</span>
        <span class="role">{site.role}</span>
      </p>
    </div>

    <nav aria-label="Primary">
      <ul class="nav">
        {
          site.nav.map((item) => (
            <li>
              <a class="nav-link ink" href={item.href} aria-current={isActive(item.href, pathname) ? 'page' : undefined}>
                {item.label}
              </a>
            </li>
          ))
        }
      </ul>
    </nav>

    <ul class="contact" aria-label="Elsewhere">
      {
        site.contact.map((link) => (
          <li>
            <a class="contact-link" href={link.href} rel={link.external ? 'me noopener' : undefined}>
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))
      }
    </ul>
  </div>
</header>

<style>
  /* Desktop: hangs in the left gutter, right-aligned 56px from the content. */
  .sidebar {
    display: flex;
    justify-content: flex-end;
    padding-inline: 1.5rem 3.5rem;
  }

  .sidebar-inner {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.25rem;
    width: min(10rem, 100%);
    height: 100dvh;
    view-transition-name: sidebar;
  }

  .identity {
    display: grid;
    gap: 1.25rem;
  }

  .avatar {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 10px;
    object-fit: cover;
    outline: 1px solid var(--rule);
    outline-offset: -1px;
  }

  .identity-text {
    display: grid;
    gap: 0.125rem;
  }

  .name {
    font-family: var(--font-serif);
    font-size: 1rem;
    line-height: 1.2;
  }

  .role {
    color: var(--muted);
    font-size: 0.75rem;
  }

  .nav {
    display: grid;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .nav-link {
    display: inline-flex;
    align-items: center;
    min-height: 1.5rem;
    color: var(--muted);
    font-size: 0.8125rem;
  }

  .nav-link[aria-current='page'] {
    color: var(--ink);
  }

  .contact {
    display: grid;
    gap: 0.375rem;
    margin: 0;
    padding: 0.875rem 0 0;
    border-top: 1px solid var(--rule);
    list-style: none;
    font-size: 0.75rem;
  }

  .contact-link {
    color: var(--muted);
    text-decoration: none;
  }

  @media (hover: hover) {
    .nav-link:hover,
    .contact-link:hover {
      color: var(--ink);
    }
  }

  /* Tablet: one row, identity left, nav right. Contacts move to the footer. */
  @media (max-width: 68.6875rem) {
    .sidebar {
      display: block;
      padding-block: 1rem;
      padding-inline: var(--gutter);
    }

    .sidebar-inner {
      position: static;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: auto;
      height: auto;
    }

    .identity {
      grid-auto-flow: column;
      align-items: center;
      gap: 0.625rem;
    }

    .avatar {
      width: 1.875rem;
      height: 1.875rem;
      border-radius: 7px;
    }

    .role,
    .contact {
      display: none;
    }

    .nav {
      grid-auto-flow: column;
      gap: 1.125rem;
    }

    .nav-link {
      min-height: 2.75rem;
    }
  }

  /* Mobile: identity, then the always-visible nav row. No hamburger. */
  @media (max-width: 47.9375rem) {
    .sidebar {
      padding-block: 0.875rem 0;
    }

    .sidebar-inner {
      flex-direction: column;
      align-items: stretch;
      gap: 0.25rem;
    }
  }
</style>
```

**Step 3: Replace `src/components/SiteFooter.astro`**

```astro
---
import { site } from '../config/site';
---

<footer class="site-footer">
  <ul class="contact" aria-label="Elsewhere">
    {
      site.contact.map((link) => (
        <li>
          <a href={link.href} rel={link.external ? 'me noopener' : undefined}>
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        </li>
      ))
    }
  </ul>
</footer>

<style>
  /* Desktop keeps contacts in the sidebar. */
  .site-footer {
    display: none;
  }

  @media (max-width: 68.6875rem) {
    .site-footer {
      display: block;
      padding-block: 1.25rem 2rem;
    }
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 0 1.125rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 0.75rem;
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    color: var(--muted);
    text-decoration: none;
  }
</style>
```

**Step 4: Replace `src/layouts/BaseLayout.astro`**

```astro
---
import SeoHead from '../components/SeoHead.astro';
import Sidebar from '../components/Sidebar.astro';
import SiteFooter from '../components/SiteFooter.astro';
import { site } from '../config/site';
import '../styles/fonts.css';
import '../styles/global.css';

type Props = {
  title: string;
  description?: string;
  path: string;
  image?: { src: string; alt: string };
  article?: {
    publishedTime?: Date;
    modifiedTime?: Date;
    tags?: string[];
  };
  /** Extra class on <main>: `is-detail` or `is-centred`. */
  mainClass?: string;
};

const { title, description, path, image, article, mainClass } = Astro.props;
const hasRail = Astro.slots.has('rail');
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#FBFBF9" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="application/rss+xml" title={site.name} href="/rss.xml" />
    <!-- Lets CSS hide play-on-view content only when a script will reveal it. -->
    <script is:inline>document.documentElement.classList.add('js');</script>
    <SeoHead title={title} description={description} path={path} image={image} article={article} />
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="page">
      <Sidebar />
      <main id="main-content" tabindex="-1" class={mainClass}>
        <slot />
      </main>
      {
        hasRail && (
          <div class="rail">
            <div class="rail-inner">
              <slot name="rail" />
            </div>
          </div>
        )
      }
      <SiteFooter />
    </div>
  </body>
</html>
```

The code-copy click handler that lived here moves to `DetailLayout` in Task 15 (only detail pages have code blocks). Until then, copy buttons on detail pages do nothing; that is acceptable mid-branch.

**Step 5: Remove the film chrome**

```bash
git rm src/components/SiteHeader.astro src/components/TimelineHud.astro src/components/SceneWipe.astro src/lib/timecode.ts tests/timecode.test.ts
```

- `src/layouts/DetailLayout.astro`: delete the `runtimeMinutes={runtimeMinutes}` line passed to `<BaseLayout>` (leave the rest; the file is rewritten in Task 15).
- `src/config/site.ts`: delete `primaryNav`, `secondaryNav`, and `socialLinks`.

**Step 6: Find stragglers**

Run: `grep -rnE "timecode|TimelineHud|SceneWipe|SiteHeader|primaryNav|secondaryNav|socialLinks|ClientRouter" src tests`
Expected: no output.

**Step 7: Verify**

Run: `pnpm test && pnpm build`
Expected: PASS.

Run `pnpm dev`, open http://localhost:4321/about/ at 1440 px wide, and compare the left gutter with canvas frame `G9BpM` (About). The sidebar should be vertically centred, right-aligned 56 px from the content column, About active with the wash drawn. Resize to 900 px (one-row header) and 390 px (two-row header, footer contacts).

**Step 8: Commit**

```bash
git add -A src tests public
git commit -m "feat: add the v3 sidebar shell and drop the film-sequence chrome"
```

---

## Task 12: Shared page pieces (page header, index list, empty state)

**Files:**
- Create: `src/components/PageHeader.astro`
- Create: `src/components/IndexList.astro`
- Modify (replace): `src/components/EmptyState.astro`

**Step 1: `src/components/PageHeader.astro`**

```astro
---
type Props = {
  title: string;
  intro: string;
};

const { title, intro } = Astro.props;
---

<header class="page-header">
  <h1 class="page-title">{title}</h1>
  <p class="page-intro">{intro}</p>
</header>

<style>
  .page-header {
    display: grid;
    gap: 0.625rem;
  }

  .page-title {
    font-family: var(--font-serif);
    font-size: 2.5rem;
    line-height: 1.1;
    letter-spacing: -0.05rem;
  }

  .page-intro {
    max-width: var(--measure);
    color: var(--muted);
    font-family: var(--font-serif);
    font-size: 1.125rem;
    line-height: 1.45;
  }

  @media (max-width: 47.9375rem) {
    .page-title {
      font-size: 2rem;
    }

    .page-intro {
      font-size: 1.0625rem;
    }
  }
</style>
```

**Step 2: `src/components/IndexList.astro`**

The whole row is the link, so hovering anywhere on it draws the sweep under the title (`data-ink-row`).

```astro
---
import type { IndexRow } from '../lib/content';
import { formatDay } from '../lib/dates';

type Props = {
  groups: Array<{ year: number; items: IndexRow[] }>;
  /** `compact`: home garden index. `roomy`: writing index with descriptions. */
  size?: 'compact' | 'roomy';
};

const { groups, size = 'compact' } = Astro.props;
---

<div class:list={['index', `index-${size}`]}>
  {
    groups.map(({ year, items }) => (
      <section aria-labelledby={`year-${year}`}>
        <h2 class="section-label" id={`year-${year}`}>
          {year}
        </h2>
        <ul class="rows">
          {items.map((row) => (
            <li>
              <a class="row" href={row.href} data-ink-row>
                <span class="row-text">
                  <span class="row-title ink">{row.title}</span>
                  {row.description && <span class="row-description">{row.description}</span>}
                </span>
                {row.kind && <span class="row-kind">{row.kind}</span>}
                <time class="row-date" datetime={row.date.toISOString().slice(0, 10)}>
                  {formatDay(row.date)}
                </time>
              </a>
            </li>
          ))}
        </ul>
      </section>
    ))
  }
</div>

<style>
  .index {
    display: grid;
    gap: 2.5rem;
  }

  .rows {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .row {
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    padding-block: 0.8125rem;
    border-block-end: 1px solid var(--rule);
    color: inherit;
    text-decoration: none;
  }

  .row-text {
    display: grid;
    flex: 1;
    gap: 0.25rem;
    min-width: 0;
  }

  .row-title {
    justify-self: start;
    font-family: var(--font-serif);
    font-size: 1.125rem;
    line-height: 1.3;
  }

  .row-description {
    color: var(--muted);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .row-kind,
  .row-date {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-variant-numeric: tabular-nums;
  }

  .row-date {
    min-width: 2.5rem;
    text-align: end;
  }

  .index-roomy .row {
    align-items: start;
    gap: 2rem;
    padding-block: 1.25rem;
  }

  .index-roomy .row-title {
    font-size: 1.25rem;
  }

  .index-roomy .row-date {
    padding-block-start: 0.3rem;
  }

  @media (max-width: 47.9375rem) {
    .row {
      gap: 1rem;
      padding-block: 0.75rem;
    }

    .row-title,
    .index-roomy .row-title {
      font-size: 1.0625rem;
    }

    .row-kind {
      display: none;
    }

    .row-date {
      font-size: 0.625rem;
    }
  }
</style>
```

**Step 3: Replace `src/components/EmptyState.astro`**

```astro
---
/* Honest empty state: says what is missing. */
type Props = {
  message: string;
};

const { message } = Astro.props;
---

<p class="empty-state">{message}</p>

<style>
  .empty-state {
    padding-block: 1.25rem;
    border-block: 1px solid var(--rule);
    color: var(--muted);
    font-size: 0.875rem;
  }
</style>
```

**Step 4: Verify**

Run: `pnpm build`
Expected: PASS (components are unused so far; this only proves they compile).

**Step 5: Commit**

```bash
git add src/components/PageHeader.astro src/components/IndexList.astro src/components/EmptyState.astro
git commit -m "feat: add page header, year-grouped index list, and quiet empty state"
```

---

## Task 13: Home page (sentence, last tended, bento, garden index)

Also swaps the off-brand poster covers for the three AI stand-in showcase images used on the canvas. They are placeholders until real screenshots exist (design doc, open items).

**Files:**
- Create: `src/content/work/atlas-index-showcase.png`, `beacon-monitor-showcase.png`, `cairn-notes-showcase.png` (moved from repo root)
- Modify: `src/content/work/atlas-index.md`, `beacon-monitor.md`, `cairn-notes.md` (frontmatter)
- Create: `src/components/WorkTile.astro`
- Modify (replace): `src/pages/index.astro`

**Step 1: Move the stand-in images and repoint the canvas**

```bash
mv generated-2.png src/content/work/atlas-index-showcase.png
mv generated.png src/content/work/beacon-monitor-showcase.png
mv generated-1.png src/content/work/cairn-notes-showcase.png
```

Canvas (via `mcp__pencil__execute` on `portfolio-v3.pen`):

```js
const moved = { "generated-2.png": "src/content/work/atlas-index-showcase.png", "generated.png": "src/content/work/beacon-monitor-showcase.png", "generated-1.png": "src/content/work/cairn-notes-showcase.png" }
Get(n => n.fill && n.fill.type === "image" && moved[n.fill.url] && Update(n.id, { fill: { ...n.fill, url: moved[n.fill.url] } }))
```

**Step 2: Update the work frontmatter** (`image` and `imageAlt` only)

`src/content/work/atlas-index.md`:
```yaml
# AI stand-in until a real screenshot exists (design doc, open items).
image: ./atlas-index-showcase.png
imageAlt: A laptop on a linen-covered table showing a document search window, beside a mug and a potted plant in window light
```

`src/content/work/beacon-monitor.md`:
```yaml
# AI stand-in until a real screenshot exists (design doc, open items).
image: ./beacon-monitor-showcase.png
imageAlt: A monitoring dashboard with system load, latency, and service health panels, on a screen beside potted succulents
```

`src/content/work/cairn-notes.md`:
```yaml
# AI stand-in until a real screenshot exists (design doc, open items).
image: ./cairn-notes-showcase.png
imageAlt: A tablet on a linen tablecloth showing a mind map branching from one project, next to a cup of coffee and a pencil
```

Leave the old `*-cover.png` files in place until Task 20.

**Step 3: Create `src/components/WorkTile.astro`**

Sizes: `feature` (home, large left), `stack` (home, right column), `full` (work page, featured), `half` (work page, two-up). Projects without `image` get the fallback slot: `--tile` block with the title set large bottom-left (decorative; the caption carries the real title).

```astro
---
import type { CollectionEntry } from 'astro:content';
import { Image } from 'astro:assets';
import { workCaption } from '../lib/content';

type Props = {
  entry: CollectionEntry<'work'>;
  size: 'feature' | 'stack' | 'full' | 'half';
  /** `sizes` attribute for the responsive image. */
  sizes: string;
  summary?: boolean;
  eager?: boolean;
};

const { entry, size, sizes, summary = false, eager = false } = Astro.props;
const { title, image, imageAlt } = entry.data;
---

<a class:list={['tile', `tile-${size}`]} href={`/work/${entry.id}/`}>
  <div class="tile-media">
    {
      image ? (
        <Image src={image} alt={imageAlt ?? ''} widths={[400, 720, 1080, 1440]} sizes={sizes} loading={eager ? 'eager' : 'lazy'} />
      ) : (
        <div class="tile-fallback" aria-hidden="true">
          <span>{title}</span>
        </div>
      )
    }
  </div>
  <span class="tile-caption">
    <span class="tile-title">{title}</span>
    <span class="tile-meta">{workCaption(entry.data)}</span>
    {summary && <span class="tile-summary">{entry.data.summary}</span>}
  </span>
</a>

<style>
  .tile {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
    color: inherit;
    text-decoration: none;
  }

  .tile-media {
    position: relative;
    overflow: clip;
    border-radius: 16px;
    background: var(--tile);
    container-type: inline-size;
  }

  .tile-stack .tile-media {
    aspect-ratio: 288 / 187;
  }

  .tile-full .tile-media {
    aspect-ratio: 720 / 400;
  }

  .tile-half .tile-media {
    aspect-ratio: 352 / 260;
  }

  /* Home: the featured tile spans both rows and its image fills the height. */
  .tile-feature {
    grid-row: span 2;
  }

  .tile-feature .tile-media {
    flex: 1;
    min-height: 0;
  }

  .tile-full {
    grid-column: 1 / -1;
  }

  .tile-media img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 240ms var(--ease-out);
  }

  @media (hover: hover) {
    .tile:hover img {
      transform: scale(1.02);
    }
  }

  .tile-fallback {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    padding: 1.75rem;
  }

  /* 72px across 720, 44px across 352. */
  .tile-fallback span {
    font-family: var(--font-serif);
    font-size: clamp(1.5rem, 7.6cqi + 1.075rem, 4.5rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  .tile-caption {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: baseline;
    gap: 0.25rem 1rem;
  }

  .tile-title {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    line-height: 1.3;
  }

  .tile-full .tile-title,
  .tile-half .tile-title {
    font-size: 1.25rem;
  }

  .tile-meta {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-variant-numeric: tabular-nums;
  }

  .tile-summary {
    grid-column: 1 / -1;
    color: var(--muted);
    font-size: 0.8125rem;
    line-height: 1.5;
  }

  @media (max-width: 47.9375rem) {
    .tile {
      gap: 0.5rem;
    }

    .tile-media {
      border-radius: 12px;
    }

    .tile-feature {
      grid-row: auto;
      grid-column: 1 / -1;
    }

    .tile-feature .tile-media {
      flex: none;
      aspect-ratio: 350 / 240;
    }

    .tile-stack .tile-media {
      aspect-ratio: 169 / 130;
    }

    .tile-caption {
      grid-template-columns: 1fr;
      gap: 0.125rem;
    }

    .tile-title {
      font-size: 1rem;
    }

    .tile-meta {
      font-size: 0.625rem;
    }
  }
</style>
```

**Step 4: Replace `src/pages/index.astro`**

The sentence is split into inline-block parts so it can break into four lines on desktop and five on mobile while each visual line still rises together. `--d` / `--m` are the line numbers at each size.

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import WorkTile from '../components/WorkTile.astro';
import IndexList from '../components/IndexList.astro';
import { site } from '../config/site';
import { arrangeWork, bookDate, groupByYear, visibleNewestFirst, type IndexRow } from '../lib/content';
import { latest, timeAgo } from '../lib/time-ago';

const production = import.meta.env.PROD;
const work = visibleNewestFirst(await getCollection('work'), production);
const notes = visibleNewestFirst(await getCollection('blog'), production);
const books = visibleNewestFirst(await getCollection('books'), production);

const { featured, rest } = arrangeWork(work);
const companions = rest.slice(0, 2);
const reading = books.find(({ data }) => data.status === 'reading');

const tended = latest([
  ...work.map(({ data }) => data.endDate ?? data.date),
  ...notes.map(({ data }) => data.updatedDate ?? data.date),
  ...books.map(({ data }) => bookDate(data)),
]);

// Work already has the bento; the index is writing and reading.
const rows: IndexRow[] = [
  ...notes.map((entry) => ({ href: `/blog/${entry.id}/`, title: entry.data.title, kind: 'note' as const, date: entry.data.date })),
  ...books
    .filter(({ data }) => data.status === 'reading' || data.status === 'finished')
    .map((entry) => ({ href: `/read/#${entry.id}`, title: entry.data.title, kind: 'book' as const, date: bookDate(entry.data) })),
];
const index = groupByYear(rows, (row) => row.date);
---

<BaseLayout title={site.title} path="/">
  <div class="home">
    <h1 class="sentence">
      <span class="part" style="--d: 0; --m: 0">I <a class="verb ink" href="/work/">build</a> to understand.</span><br />
      <span class="part" style="--d: 1; --m: 1">I <a class="verb ink" href="/blog/">write</a> to remember.</span><br />
      <span class="part" style="--d: 2; --m: 2">I <a class="verb ink" href="/read/">read</a> because useful</span><br class="br-m" />
      {' '}<span class="part" style="--d: 2; --m: 3">ideas</span><br class="br-d" />
      {' '}<span class="part" style="--d: 3; --m: 3">rarely stay</span><br class="br-m" />
      {' '}<span class="part" style="--d: 3; --m: 4">inside one field.</span>
    </h1>

    {
      tended && (
        <p class="tended">
          last tended{' '}
          <time datetime={tended.toISOString()} data-tended>
            {timeAgo(tended, new Date())}
          </time>
          {reading && (
            <>
              {' · reading — '}
              <a href={`/read/#${reading.id}`}>{reading.data.title}</a>
            </>
          )}
        </p>
      )
    }

    {
      featured && (
        <section class="selected" aria-labelledby="selected-title">
          <div class="section-head">
            <h2 class="label" id="selected-title">Selected work</h2>
            <a class="more" href="/work/">
              All work <span aria-hidden="true">→</span>
            </a>
          </div>
          <div class="bento">
            <WorkTile entry={featured} size="feature" eager sizes="(min-width: 48rem) 416px, 100vw" />
            {companions.map((entry) => (
              <WorkTile entry={entry} size="stack" sizes="(min-width: 48rem) 288px, 50vw" />
            ))}
          </div>
        </section>
      )
    }

    {
      index.length > 0 && (
        <section class="garden" aria-label="Writing and reading">
          <IndexList groups={index} />
        </section>
      )
    }
  </div>
</BaseLayout>

<script>
  import { timeAgo } from '../lib/time-ago';

  // The page is static: refresh the build-time age so it stays true between deploys.
  for (const time of document.querySelectorAll<HTMLTimeElement>('[data-tended]')) {
    time.textContent = timeAgo(new Date(time.dateTime), new Date());
  }
</script>

<style>
  .home {
    display: grid;
    gap: 1.75rem;
  }

  .sentence {
    font-family: var(--font-serif);
    font-size: 2.5rem;
    line-height: 1.18;
    letter-spacing: -0.05rem;
    text-wrap: initial;
  }

  .part {
    display: inline-block;
  }

  .br-m {
    display: none;
  }

  .verb {
    text-decoration: underline;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 0.16em;
  }

  /* The signature moment: each line rises in turn, on every visit. */
  @media (prefers-reduced-motion: no-preference) {
    .part {
      animation: rise 420ms var(--ease-out) both;
      animation-delay: calc(var(--d) * 90ms);
    }
  }

  .tended {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.75rem;
  }

  .tended a {
    text-underline-offset: 0.2em;
  }

  .selected,
  .garden {
    padding-block-start: 1rem;
  }

  .section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-block-end: 1rem;
  }

  .more {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    margin-block: -0.875rem;
    color: var(--muted);
    font-size: 0.8125rem;
    text-decoration: none;
  }

  @media (hover: hover) {
    .more:hover {
      color: var(--ink);
    }
  }

  .bento {
    display: grid;
    grid-template-columns: 416fr 288fr;
    gap: 1rem;
  }

  @media (max-width: 47.9375rem) {
    .home {
      gap: 1.5rem;
    }

    .sentence {
      font-size: 1.875rem;
      letter-spacing: -0.04rem;
    }

    .br-m {
      display: inline;
    }

    .br-d {
      display: none;
    }

    .part {
      animation-delay: calc(var(--m) * 90ms);
    }

    .tended {
      font-size: 0.6875rem;
    }

    .bento {
      grid-template-columns: 1fr 1fr;
      gap: 0.875rem 0.75rem;
    }
  }
</style>
```

**Step 5: Verify**

Run: `pnpm build`
Expected: PASS.

Run `pnpm dev` and compare http://localhost:4321/ with canvas frames `h9LzvX` (1440) and `bYuF5` (390):
- Sentence on four lines (five at 390), lines rise in turn on every reload.
- Hovering **build** sweeps the wash under it (compare frame `s4T28q` and the ink-sweep board `kLLsQ`).
- "last tended … ago" in mono. No "reading" half while the books collection is empty.
- Bento: one tall tile left, two stacked right; two-up under a full-width tile at 390.
- Index rows grouped under a 2026 heading with an ink rule; hovering a row sweeps its title.
- With DevTools "Emulate CSS prefers-reduced-motion: reduce", the sentence appears at once.

**Step 6: Commit**

```bash
git add src/components/WorkTile.astro src/pages/index.astro src/content/work
git commit -m "feat: build the v3 home page with the signature sentence and bento"
```

---

## Task 14: Work index

**Files:**
- Modify (replace): `src/pages/work/index.astro`

**Step 1: Replace the page**

Mobile is not mocked on the canvas; tiles stack one per column below 768 px so summaries stay readable.

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PageHeader from '../../components/PageHeader.astro';
import WorkTile from '../../components/WorkTile.astro';
import EmptyState from '../../components/EmptyState.astro';
import { site } from '../../config/site';
import { arrangeWork, visibleNewestFirst } from '../../lib/content';

const work = visibleNewestFirst(await getCollection('work'), import.meta.env.PROD);
const { featured, rest } = arrangeWork(work);
---

<BaseLayout title={`Work | ${site.name}`} path="/work/">
  <div class="stack">
    <PageHeader title="Work" intro="Things I've built, or am still building." />
    {
      featured ? (
        <div class="work-grid">
          <WorkTile entry={featured} size="full" summary eager sizes="(min-width: 48rem) 720px, 100vw" />
          {rest.map((entry) => (
            <WorkTile entry={entry} size="half" summary sizes="(min-width: 48rem) 352px, 100vw" />
          ))}
        </div>
      ) : (
        <EmptyState message="Nothing published here yet." />
      )
    }
  </div>
</BaseLayout>

<style>
  .work-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem 1rem;
  }

  @media (max-width: 47.9375rem) {
    .work-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

**Step 2: Check the fallback tile**

Temporarily comment out `image:` in `src/content/work/cairn-notes.md`, reload http://localhost:4321/work/, and compare the Cairn notes tile with canvas frame `ckl6K` (grey slot, title large bottom-left, same caption). Restore the line.

**Step 3: Verify**

Run: `pnpm build`
Expected: PASS. Compare http://localhost:4321/work/ with canvas frame `ViFvY`.

**Step 4: Commit**

```bash
git add src/pages/work/index.astro
git commit -m "feat: build the v3 work index bento"
```

---

## Task 15: Detail layout, table of contents, and Contents sheet

One `DetailLayout` for work and writing. Desktop puts "On this page" in the right gutter (sticky, centred). Below 1100 px a floating **Contents** pill appears once the header scrolls away and opens a bottom sheet (`<dialog>` with `showModal()`). The sheet's open and close motion is pure CSS (`@starting-style` plus `allow-discrete`); browsers without it just open and close.

**Files:**
- Create: `src/components/TocList.astro`
- Create: `src/components/ContentsSheet.astro`
- Modify (replace): `src/layouts/DetailLayout.astro`
- Modify (replace): `src/pages/work/[...id].astro`
- Modify (replace): `src/pages/blog/[...id].astro`
- Delete: `src/components/TableOfContents.astro`
- Modify: `astro.config.mjs` (drop `list-bold`, `x-bold`)

**Step 1: `src/components/TocList.astro`** — the outline plus the one script that tracks the current section for both the rail and the sheet. Both variants are styled here: restyling it from `ContentsSheet` would fight Astro's scoped-style specificity.

```astro
---
import type { TocItem } from '../lib/toc';

type Props = {
  tree: TocItem[];
  /** `rail`: desktop right gutter. `sheet`: the Contents bottom sheet, with larger targets. */
  variant: 'rail' | 'sheet';
};

const { tree, variant } = Astro.props;
---

<ol class:list={['toc-list', `toc-${variant}`]}>
  {
    tree.map((item) => (
      <li>
        <a class="toc-link" href={`#${item.slug}`} data-toc-link>
          {item.text}
        </a>
        {item.children.length > 0 && (
          <ol>
            {item.children.map((child) => (
              <li>
                <a class="toc-link" href={`#${child.slug}`} data-toc-link>
                  {child.text}
                </a>
              </li>
            ))}
          </ol>
        )}
      </li>
    ))
  }
</ol>

<script>
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
  const idOf = (link: HTMLAnchorElement) => decodeURIComponent(link.hash.slice(1));
  const headings = [...new Set(links.map(idOf))].flatMap((id) => document.getElementById(id) ?? []);

  const mark = (id: string) => {
    for (const link of links) {
      if (idOf(link) === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  // A heading becomes current once it reaches the top quarter of the screen.
  const observer = new IntersectionObserver(
    (entries) => {
      const top = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) mark(top.target.id);
    },
    { rootMargin: '0px 0px -75% 0px' },
  );
  headings.forEach((heading) => observer.observe(heading));
</script>

<style>
  .toc-list,
  .toc-list ol {
    display: grid;
    gap: 0.4375rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .toc-list ol {
    margin-block-start: 0.4375rem;
    padding-inline-start: 0.75rem;
  }

  .toc-link {
    display: block;
    color: var(--ink);
    font-size: 0.8125rem;
    line-height: 1.3;
    text-decoration: none;
  }

  .toc-list ol .toc-link {
    color: var(--muted);
    font-size: 0.75rem;
  }

  .toc-list .toc-link[aria-current='location'] {
    color: var(--accent);
    font-weight: 500;
  }

  @media (hover: hover) {
    .toc-link:hover {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
  }

  /* Sheet: 44px targets, H3s indented, a rust marker on the current section. */
  .toc-sheet,
  .toc-sheet ol {
    gap: 0.125rem;
  }

  .toc-sheet ol {
    margin: 0;
    padding-inline-start: 1rem;
  }

  .toc-sheet .toc-link {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 2.75rem;
    font-size: 0.9375rem;
  }

  .toc-sheet ol .toc-link {
    font-size: 0.875rem;
  }

  .toc-sheet .toc-link[aria-current='location'] {
    padding-inline-start: 0.75rem;
    font-weight: 400;
  }

  .toc-sheet .toc-link[aria-current='location']::before {
    content: '';
    position: absolute;
    left: 0;
    width: 2px;
    height: 1rem;
    background: var(--accent);
  }
</style>
```

**Step 2: `src/components/ContentsSheet.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
import TocList from './TocList.astro';
import type { TocItem } from '../lib/toc';

type Props = {
  tree: TocItem[];
};

const { tree } = Astro.props;
---

<button class="pill" type="button" aria-haspopup="dialog" data-contents-pill data-visible="false">
  <Icon name="ph:list" size={16} aria-hidden="true" />
  Contents
</button>

<dialog class="sheet" aria-labelledby="sheet-title" data-contents-sheet>
  <div class="sheet-body">
    <div class="grabber" aria-hidden="true"></div>
    <div class="sheet-head">
      <h2 class="sheet-title" id="sheet-title">On this page</h2>
      <button class="sheet-close" type="button" data-contents-close>
        Close <Icon name="ph:x" size={14} aria-hidden="true" />
      </button>
    </div>
    <TocList tree={tree} variant="sheet" />
  </div>
</dialog>

<script>
  const pill = document.querySelector<HTMLButtonElement>('[data-contents-pill]');
  const sheet = document.querySelector<HTMLDialogElement>('[data-contents-sheet]');
  const sentinel = document.querySelector('[data-toc-sentinel]');

  if (pill && sheet) {
    // The pill appears once the article header has scrolled away.
    if (sentinel) {
      new IntersectionObserver(([entry]) => {
        pill.dataset.visible = String(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      }).observe(sentinel);
    }

    let jumped = false;
    pill.addEventListener('click', () => sheet.showModal());
    sheet.querySelector('[data-contents-close]')?.addEventListener('click', () => sheet.close());

    sheet.addEventListener('click', (event) => {
      const target = event.target as Element;
      // The body fills the dialog, so a click on the dialog itself is the backdrop.
      if (target === sheet) sheet.close();
      if (target.closest('a')) {
        jumped = true;
        sheet.close();
      }
    });

    // Focus goes back to the pill, unless the reader jumped to a section.
    sheet.addEventListener('close', () => {
      if (!jumped) pill.focus({ preventScroll: true });
      jumped = false;
    });
  }
</script>

<style>
  .pill {
    position: fixed;
    inset-block-end: calc(1.25rem + env(safe-area-inset-bottom));
    inset-inline-end: calc(1.25rem + env(safe-area-inset-right));
    z-index: 30;
    display: none;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.75rem;
    padding: 0 1rem;
    border: 0;
    border-radius: 999px;
    background: var(--ink);
    color: var(--bg);
    font-size: 0.8125rem;
    cursor: pointer;
    transition:
      opacity 200ms var(--ease-out),
      transform 200ms var(--ease-out),
      visibility 200ms;
  }

  .pill[data-visible='false'] {
    visibility: hidden;
    opacity: 0;
    transform: translateY(8px);
  }

  .pill:active {
    transform: scale(0.96);
  }

  @media (max-width: 68.6875rem) {
    .pill {
      display: inline-flex;
    }
  }

  .sheet {
    position: fixed;
    inset: auto 0 0;
    width: 100%;
    max-width: none;
    max-height: 70dvh;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 18px 18px 0 0;
    background: var(--bg);
    color: var(--ink);
    transform: translateY(100%);
    transition:
      transform 200ms var(--ease-in),
      overlay 200ms allow-discrete,
      display 200ms allow-discrete;
  }

  .sheet[open] {
    transform: none;
    transition-duration: 260ms;
    transition-timing-function: var(--ease-out);
  }

  @starting-style {
    .sheet[open] {
      transform: translateY(100%);
    }
  }

  .sheet::backdrop {
    background: var(--scrim);
    opacity: 0;
    transition:
      opacity 200ms ease-out,
      overlay 200ms allow-discrete,
      display 200ms allow-discrete;
  }

  .sheet[open]::backdrop {
    opacity: 1;
  }

  @starting-style {
    .sheet[open]::backdrop {
      opacity: 0;
    }
  }

  .sheet-body {
    padding: 0.625rem 1.25rem 1.75rem;
  }

  .grabber {
    width: 2.25rem;
    height: 0.25rem;
    margin: 0 auto 0.875rem;
    border-radius: 2px;
    background: #d6d2c9;
  }

  .sheet-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block-end: 0.625rem;
  }

  .sheet-title {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
  }

  .sheet-close {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    min-height: 2.75rem;
    padding: 0 0 0 0.5rem;
    border: 0;
    background: none;
    font-size: 0.8125rem;
    cursor: pointer;
  }
</style>
```

**Step 3: Replace `src/layouts/DetailLayout.astro`**

```astro
---
import type { ImageMetadata } from 'astro';
import { Image } from 'astro:assets';
import BaseLayout from './BaseLayout.astro';
import TocList from '../components/TocList.astro';
import ContentsSheet from '../components/ContentsSheet.astro';
import { site } from '../config/site';
import type { TocItem } from '../lib/toc';

type Props = {
  title: string;
  summary: string;
  path: string;
  back: { href: string; label: string };
  toc: TocItem[];
  /** Work only: the 720px image between the header and the prose. */
  showcase?: { src: ImageMetadata; alt: string };
  /** Social preview when there is no showcase image. */
  ogImage?: { src: string; alt: string };
  article?: { publishedTime?: Date; modifiedTime?: Date; tags?: string[] };
};

const { title, summary, path, back, toc, showcase, ogImage, article } = Astro.props;
const hasToc = toc.length >= 2;
const image = showcase ? { src: showcase.src.src, alt: showcase.alt } : ogImage;
---

<BaseLayout title={`${title} | ${site.name}`} description={summary} path={path} image={image} article={article} mainClass="is-detail">
  <article class="detail">
    <a class="back" href={back.href}><span aria-hidden="true">←</span> <span class="sr-only">Back to </span>{back.label}</a>
    <header class="detail-head">
      <h1 class="detail-title">{title}</h1>
      <p class="detail-summary">{summary}</p>
      <slot name="meta" />
    </header>
    <slot name="meta-table" />
    <hr class="detail-rule" />
    <div data-toc-sentinel aria-hidden="true"></div>
    {
      showcase && (
        <Image class="showcase" src={showcase.src} alt={showcase.alt} widths={[720, 1080, 1440]} sizes="(min-width: 48rem) 720px, 100vw" loading="eager" />
      )
    }
    <div class="prose">
      <slot />
    </div>
  </article>

  {
    hasToc && (
      <nav slot="rail" class="toc" aria-labelledby="toc-title">
        <p class="toc-label" id="toc-title">On this page</p>
        <TocList tree={toc} variant="rail" />
      </nav>
    )
  }
  {hasToc && <ContentsSheet tree={toc} />}
</BaseLayout>

<script>
  // Copy buttons on code blocks (added at build time by the Shiki transformer).
  const copyResets = new WeakMap<HTMLElement, number>();

  document.addEventListener('click', async (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-code-copy]');
    const block = button?.closest('.code-block');
    const code = block?.querySelector('pre code');
    if (!button || !code) return;
    const status = block!.querySelector<HTMLElement>('[data-code-status]');

    let state: 'copied' | 'selected';
    try {
      await navigator.clipboard.writeText(code.textContent ?? '');
      state = 'copied';
    } catch {
      // No clipboard access (plain http, denied permission): select the code
      // so a keyboard copy still works, and say so.
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      state = 'selected';
    }

    button.dataset.state = state;
    if (status) {
      status.textContent =
        state === 'copied' ? 'Code copied' : 'Could not copy. The code is selected; press Control C or Command C.';
    }
    window.clearTimeout(copyResets.get(button));
    copyResets.set(
      button,
      window.setTimeout(() => {
        delete button.dataset.state;
        if (status) status.textContent = '';
      }, 2000),
    );
  });
</script>

<style>
  .back {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    margin-block: -0.875rem;
    color: var(--muted);
    font-size: 0.8125rem;
    text-decoration: none;
  }

  @media (hover: hover) {
    .back:hover {
      color: var(--ink);
    }
  }

  .detail-head {
    display: grid;
    gap: 0.75rem;
    padding-block: 2.5rem 2rem;
  }

  .detail-title {
    font-family: var(--font-serif);
    font-size: 2.5rem;
    line-height: 1.1;
    letter-spacing: -0.05rem;
  }

  .detail-summary {
    max-width: 37.5rem;
    color: var(--muted);
    font-family: var(--font-serif);
    font-size: 1.25rem;
    line-height: 1.45;
  }

  .detail-rule {
    margin: 2.5rem 0 0;
    border: 0;
    border-top: 1px solid var(--rule);
  }

  .detail-head + .detail-rule {
    margin-block-start: 0;
  }

  .showcase {
    width: 100%;
    margin-block-start: 2.5rem;
    aspect-ratio: 720 / 400;
    object-fit: cover;
    border-radius: 16px;
  }

  .prose {
    margin-block-start: 2.5rem;
  }

  .showcase + .prose {
    margin-block-start: 3rem;
  }

  /* Slotted from the pages. */
  :global(.meta-table) {
    display: grid;
    gap: 0.5rem;
  }

  :global(.meta-table > div) {
    display: grid;
    grid-template-columns: 4.5rem minmax(0, 1fr);
    align-items: baseline;
    gap: 1rem;
  }

  :global(.meta-table dt) {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
  }

  :global(.meta-table dd) {
    font-size: 0.8125rem;
  }

  :global(.meta-table a) {
    text-underline-offset: 0.2em;
  }

  :global(.meta-line) {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
  }

  .toc-label {
    margin-block-end: 0.875rem;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
  }

  @media (max-width: 47.9375rem) {
    .detail-head {
      gap: 0.625rem;
      padding-block: 1.5rem 1.25rem;
    }

    .detail-title {
      font-size: 2rem;
    }

    .detail-summary {
      font-size: 1.0625rem;
    }

    .detail-rule {
      margin-block-start: 1.5rem;
    }

    .showcase {
      margin-block-start: 1.5rem;
      aspect-ratio: 350 / 220;
      border-radius: 12px;
    }

    .showcase + .prose,
    .prose {
      margin-block-start: 1.75rem;
    }

    :global(.meta-table > div) {
      grid-template-columns: 3.5rem minmax(0, 1fr);
      gap: 0.75rem;
    }

    :global(.meta-table dt) {
      font-size: 0.625rem;
    }
  }
</style>
```

**Step 4: Replace `src/pages/work/[...id].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import DetailLayout from '../../layouts/DetailLayout.astro';
import { visibleNewestFirst, workStatusLine } from '../../lib/content';
import { buildTocTree } from '../../lib/toc';

export async function getStaticPaths() {
  const entries = visibleNewestFirst(await getCollection('work'), import.meta.env.PROD);
  return entries.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { data } = entry;
const { Content, headings } = await render(entry);

const links = [
  ...(data.website ? [{ href: data.website, label: 'Live site' }] : []),
  ...(data.repository ? [{ href: data.repository, label: 'Repository' }] : []),
];
---

<DetailLayout
  title={data.title}
  summary={data.summary}
  path={`/work/${entry.id}/`}
  back={{ href: '/work/', label: 'Work' }}
  toc={buildTocTree(headings)}
  showcase={data.image ? { src: data.image, alt: data.imageAlt ?? '' } : undefined}
>
  <dl slot="meta-table" class="meta-table">
    <div><dt>Role</dt><dd>{data.role}</dd></div>
    <div><dt>Status</dt><dd>{workStatusLine(data)}</dd></div>
    {data.stack.length > 0 && <div><dt>Stack</dt><dd>{data.stack.join(' · ')}</dd></div>}
    {
      links.length > 0 && (
        <div>
          <dt>Links</dt>
          <dd>
            {links.map((link, i) => (
              <>
                {i > 0 && ' · '}
                <a href={link.href} rel="noopener">
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              </>
            ))}
          </dd>
        </div>
      )
    }
  </dl>
  <Content />
</DetailLayout>
```

**Step 5: Replace `src/pages/blog/[...id].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import DetailLayout from '../../layouts/DetailLayout.astro';
import { articleMeta, visibleNewestFirst } from '../../lib/content';
import { readingTime } from '../../lib/reading-time';
import { buildTocTree } from '../../lib/toc';

export async function getStaticPaths() {
  const entries = visibleNewestFirst(await getCollection('blog'), import.meta.env.PROD);
  return entries.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { data } = entry;
const { Content, headings } = await render(entry);
---

<DetailLayout
  title={data.title}
  summary={data.description}
  path={`/blog/${entry.id}/`}
  back={{ href: '/blog/', label: 'Writing' }}
  toc={buildTocTree(headings)}
  ogImage={data.image ? { src: data.image.src, alt: data.imageAlt ?? '' } : undefined}
  article={{ publishedTime: data.date, modifiedTime: data.updatedDate, tags: data.topics }}
>
  <p slot="meta" class="meta-line">{articleMeta(data, readingTime(entry.body))}</p>
  <Content />
</DetailLayout>
```

**Step 6: Remove the old table of contents and its icons**

```bash
git rm src/components/TableOfContents.astro
```

In `astro.config.mjs`, change the Phosphor include to `ph: ['list', 'x']`.

**Step 7: Verify**

Run: `pnpm test && pnpm build`
Expected: PASS.

In `pnpm dev`, compare against the canvas:
- http://localhost:4321/work/atlas-index/ at 1440 vs `jTli2`: back link, 40 px title, serif summary, mono-key meta table, rule, 720 image, prose at 620, code block with `ts` + Copy, "On this page" in the right gutter. Scroll: the current section turns rust.
- http://localhost:4321/blog/reading-code-slowly/ vs `z6PKO`: one mono meta line inside the header, rule, prose.
- At 390 px vs `Al4ch` and `M7VSdT`: the Contents pill fades in once the header is gone; tapping opens the sheet sliding up over a scrim; Escape, Close, and a backdrop tap close it and focus returns to the pill; tapping an entry jumps to the section.
- Click Copy on a code block: label crossfades to "Copied" in rust.

**Step 8: Commit**

```bash
git add -A src astro.config.mjs
git commit -m "feat: rebuild detail pages with a gutter TOC and a Contents sheet"
```

---

## Task 16: Writing index

**Files:**
- Modify (replace): `src/pages/blog/index.astro`

**Step 1: Replace the page**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PageHeader from '../../components/PageHeader.astro';
import IndexList from '../../components/IndexList.astro';
import EmptyState from '../../components/EmptyState.astro';
import { site } from '../../config/site';
import { groupByYear, visibleNewestFirst } from '../../lib/content';

const notes = visibleNewestFirst(await getCollection('blog'), import.meta.env.PROD);
const groups = groupByYear(
  notes.map((entry) => ({
    href: `/blog/${entry.id}/`,
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
  })),
  (row) => row.date,
);
---

<BaseLayout title={`Writing | ${site.name}`} path="/blog/">
  <div class="stack">
    <PageHeader title="Writing" intro="Notes from building, reading, and figuring things out." />
    {groups.length > 0 ? <IndexList groups={groups} size="roomy" /> : <EmptyState message="No notes yet." />}
  </div>
</BaseLayout>
```

**Step 2: Verify**

Run: `pnpm build`
Expected: PASS. Compare http://localhost:4321/blog/ with canvas `AxLK8`.

**Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: build the v3 writing index"
```

---

## Task 17: Reading page (cover grid)

The `books` collection is empty, so the grid would only show the empty state. Add sample books from the canvas as **drafts** (visible in `pnpm dev`, never in production) so the grid and fallback covers can be checked. Ask the user whether to keep them as drafts or delete them after review; they are not claims about what Indra has read.

**Files:**
- Create: `src/components/BookCard.astro`
- Modify (replace): `src/pages/read.astro`
- Create (draft samples): `src/content/books/sample-thinking-in-systems.md`, `sample-a-philosophy-of-software-design.md`, `sample-the-design-of-everyday-things.md`, `sample-four-thousand-weeks.md`, `sample-sicp.md`

**Step 1: Draft sample books** (one shown; repeat with the values in the table)

`src/content/books/sample-thinking-in-systems.md`:
```markdown
---
title: Thinking in Systems
author: Donella H. Meadows
status: reading
date: 2026-10-01
startedDate: 2026-10-01
draft: true
---

Sample entry from the design canvas. Replace or delete before publishing.
```

| File | title | author | status | dates |
|---|---|---|---|---|
| `sample-a-philosophy-of-software-design.md` | A Philosophy of Software Design | John Ousterhout | finished | `date: 2026-09-15`, `finishedDate: 2026-09-15` |
| `sample-the-design-of-everyday-things.md` | The Design of Everyday Things | Don Norman | finished | `date: 2026-06-10`, `finishedDate: 2026-06-10` |
| `sample-four-thousand-weeks.md` | Four Thousand Weeks | Oliver Burkeman | finished | `date: 2026-02-20`, `finishedDate: 2026-02-20` |
| `sample-sicp.md` | Structure and Interpretation of Computer Programs | Abelson & Sussman | paused | `date: 2026-03-01` |

**Step 2: `src/components/BookCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { Image } from 'astro:assets';
import { bookMeta } from '../lib/content';
import { fallbackCover } from '../lib/cover';

type Props = {
  book: CollectionEntry<'books'>;
};

const { book } = Astro.props;
const { title, author, cover, coverAlt, status } = book.data;
const fallback = fallbackCover(title);
---

<li class="book" id={book.id}>
  {
    cover ? (
      <Image class="cover" src={cover} alt={coverAlt ?? ''} widths={[162, 324]} sizes="(min-width: 48rem) 162px, 45vw" />
    ) : (
      <div class="cover cover-fallback" style={`--cover-bg: ${fallback.background}; --cover-ink: ${fallback.ink}`} aria-hidden="true">
        <span class="cover-title">{title}</span>
        <span class="cover-author">{author}</span>
      </div>
    )
  }
  <p class="book-title">{title}</p>
  <p class="book-author">{author}</p>
  <p class:list={['book-meta', { current: status === 'reading' }]}>{bookMeta(book.data)}</p>
</li>

<style>
  .book {
    display: grid;
    align-content: start;
    gap: 0.25rem;
    min-width: 0;
    scroll-margin-top: 2rem;
  }

  .cover {
    width: 100%;
    margin-block-end: 0.375rem;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border: 1px solid rgb(0 0 0 / 0.08);
    border-radius: 4px;
  }

  .cover-fallback {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.9375rem;
    background: var(--cover-bg);
    color: var(--cover-ink);
  }

  .cover-title {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    line-height: 1.1;
  }

  .cover-author {
    opacity: 0.7;
    font-size: 0.625rem;
  }

  .book-title {
    font-family: var(--font-serif);
    font-size: 0.9375rem;
    line-height: 1.3;
  }

  .book-author {
    color: var(--muted);
    font-size: 0.75rem;
  }

  .book-meta {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.625rem;
  }

  .book-meta.current {
    color: var(--accent);
  }
</style>
```

**Step 3: Replace `src/pages/read.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHeader from '../components/PageHeader.astro';
import BookCard from '../components/BookCard.astro';
import EmptyState from '../components/EmptyState.astro';
import { site } from '../config/site';
import { bookShelves, visibleNewestFirst } from '../lib/content';

const books = visibleNewestFirst(await getCollection('books'), import.meta.env.PROD);
const shelves = bookShelves(books);
---

<BaseLayout title={`Reading | ${site.name}`} path="/read/">
  <div class="stack" style="--stack-gap: 3.5rem">
    <PageHeader title="Reading" intro="Books I'm reading, have read, or mean to. Any subject." />
    {shelves.length === 0 && <EmptyState message="No books recorded yet." />}
    {
      shelves.map((shelf, i) => (
        <section aria-labelledby={`shelf-${i}`}>
          <h2 class="section-label" id={`shelf-${i}`}>
            {shelf.label}
          </h2>
          <ul class="covers">
            {shelf.entries.map((book) => (
              <BookCard book={book} />
            ))}
          </ul>
        </section>
      ))
    }
  </div>
</BaseLayout>

<style>
  .covers {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2.25rem 1.5rem;
    margin: 1.25rem 0 0;
    padding: 0;
    list-style: none;
  }

  @media (max-width: 47.9375rem) {
    .covers {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.75rem 1rem;
    }
  }
</style>
```

**Step 4: Verify**

Run: `pnpm build`
Expected: PASS. `dist/read/index.html` shows the empty state (drafts are excluded in production builds).

In `pnpm dev`, compare http://localhost:4321/read/ with canvas `jlntv`: three sections, four covers per row, fallback covers with legible text, "since Oct 2026" in rust. The home page now shows "· reading — Thinking in Systems" and book rows in the index.

**Step 5: Commit**

```bash
git add src/components/BookCard.astro src/pages/read.astro src/content/books
git commit -m "feat: build the reading cover grid with typographic fallback covers"
```

---

## Task 18: About page (career timeline and toolkit)

**Files:**
- Create: `src/components/CareerTimeline.astro`
- Create: `src/components/Toolkit.astro`
- Modify (replace): `src/pages/about.astro`

**Step 1: `src/components/CareerTimeline.astro`**

Desktop: a horizontal track whose width is split into `--span` years (`--year` = 1/span of the container), so it keeps fitting as years pass. Mobile: vertical, newest on top, 56 px per year, with the detail block beside each bar. The bar `<button>` is the whole hit area: on desktop it is the bar itself; on mobile it is the detail block, with the narrow bar drawn by an absolutely positioned child.

The panel below holds one pre-rendered role per bar; selecting a bar unhides its role. Bars grow on first view (oldest first, current role last) via the `.js` gate set in `BaseLayout`.

"Now" is the build date. The site rebuilds on every push, which is often enough.

```astro
---
import { experience } from '../config/site';
import { buildTimeline, roleDates, verticalLayout } from '../lib/timeline';

const timeline = buildTimeline(experience, new Date());
const vertical = verticalLayout(timeline);
const years = Array.from({ length: timeline.span }, (_, i) => timeline.origin + i);
const verticalHeight = Math.max(
  timeline.span * 56,
  ...vertical.map(({ labelTop }) => labelTop + 66),
);
const whenSuffix = (bar: (typeof timeline.bars)[number]) =>
  bar.current ? ' · current role' : bar.role.type === 'part-time' ? ' · part-time' : '';
---

<section class="experience" aria-labelledby="experience-title" data-timeline-root>
  <h2 class="section-label" id="experience-title">Experience</h2>

  <div
    class="timeline"
    style={`--span: ${timeline.span}; --now: ${timeline.now}; --count: ${timeline.bars.length}; --v-height: ${verticalHeight}px`}
    data-timeline
  >
    <ol class="bars">
      {
        timeline.bars.map((bar, i) => (
          <li
            class:list={['bar-item', { current: bar.current, part: bar.role.type === 'part-time' }]}
            style={`--from: ${bar.from}; --to: ${bar.to}; --lane: ${bar.lane}; --i: ${i}; --bar-top: ${vertical[i].barTop}px; --bar-height: ${vertical[i].barHeight}px; --label-top: ${vertical[i].labelTop}px`}
          >
            <button class="bar" type="button" aria-controls="role-panel" aria-pressed={bar.current ? 'true' : 'false'} data-role={i}>
              <span class="bar-fill" aria-hidden="true" />
              <span class="bar-label">{bar.role.company}</span>
              <span class="bar-details">
                <span class="d-company">{bar.role.company}</span>
                <span class="d-role">
                  {bar.role.role}
                  {bar.role.type === 'part-time' && ' · part-time'}
                </span>
                <span class="d-when">{roleDates(bar.role)}</span>
              </span>
            </button>
          </li>
        ))
      }
    </ol>
    <span class="now-line" aria-hidden="true"></span>
    <div class="axis" aria-hidden="true">
      {years.map((year) => <span class="tick" style={`--y: ${year - timeline.origin}`}>{year}</span>)}
      <span class="now-label">now</span>
    </div>
  </div>

  <ul class="legend" aria-hidden="true">
    <li><span class="swatch" />full-time</li>
    <li><span class="swatch part" />part-time</li>
    <li class="legend-now"><span class="swatch now" />now</li>
  </ul>

  <div class="role-panel" id="role-panel" aria-live="polite">
    {
      timeline.bars.map((bar, i) => (
        <div class:list={['role', { current: bar.current }]} data-panel={i} hidden={!bar.current}>
          <p class="role-when">
            {roleDates(bar.role)}
            {whenSuffix(bar)}
          </p>
          <h3 class="role-title">
            {bar.role.role} <span class="role-company">at {bar.role.company}</span>
          </h3>
          <p class="role-summary">{bar.role.summary}</p>
        </div>
      ))
    }
  </div>

  <p class="hint" aria-hidden="true">
    <span class="hint-pointer">Select a bar to read about each role.</span>
    <span class="hint-touch">Tap a role.</span>
  </p>
</section>

<script>
  for (const root of document.querySelectorAll<HTMLElement>('[data-timeline-root]')) {
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-role]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];

    for (const button of buttons) {
      button.addEventListener('click', () => {
        for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
        for (const panel of panels) panel.hidden = panel.dataset.panel !== button.dataset.role;
      });
    }

    // Bars grow once, the first time the timeline comes into view.
    const track = root.querySelector<HTMLElement>('[data-timeline]');
    if (track) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          track.classList.add('is-visible');
          observer.disconnect();
        },
        { rootMargin: '0px 0px -15% 0px' },
      );
      observer.observe(track);
    }
  }
</script>

<style>
  .experience {
    display: grid;
    gap: 1.25rem;
  }

  /* ---- Desktop: horizontal, 80px a year at 720 ---- */

  .timeline {
    --year: calc(100cqi / var(--span));
    position: relative;
    container-type: inline-size;
    margin-block-start: 0.75rem;
  }

  .bars {
    position: relative;
    height: 4.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bar {
    position: absolute;
    top: calc((var(--lane) - 1) * 2.5rem);
    left: calc(var(--from) * var(--year));
    width: calc((var(--to) - var(--from)) * var(--year) - 4px);
    height: 2rem;
    padding: 0 0.625rem;
    overflow: hidden;
    isolation: isolate;
    border: 0;
    border-radius: 6px;
    background: none;
    text-align: start;
    cursor: pointer;
  }

  .bar-fill {
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: var(--bar);
    transform-origin: left center;
  }

  .part .bar-fill {
    background: var(--bar-part);
    box-shadow: inset 0 0 0 1px var(--bar-part-edge);
  }

  .current .bar-fill {
    background: var(--accent);
  }

  .bar[aria-pressed='true']:not(.current .bar) .bar-fill {
    box-shadow: inset 0 0 0 1.5px var(--ink);
  }

  .bar-label {
    display: block;
    overflow: hidden;
    font-size: 0.75rem;
    line-height: 2rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .part .bar-label {
    color: var(--muted);
  }

  .current .bar-label {
    color: #fff;
  }

  .bar-details {
    display: none;
  }

  .now-line {
    position: absolute;
    top: 0;
    left: calc(var(--now) * var(--year));
    width: 1px;
    height: 4.5rem;
    background: var(--accent);
  }

  .axis {
    position: relative;
    height: 1.5rem;
    margin-block-start: 2.375rem;
    border-top: 1px solid var(--rule);
  }

  .tick,
  .now-label {
    position: absolute;
    top: 0;
    padding: 0.5rem 0 0 0.25rem;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.625rem;
  }

  .tick {
    left: calc(var(--y) * var(--year));
  }

  .tick::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 6px;
    background: var(--tick);
  }

  .now-label {
    left: calc(var(--now) * var(--year));
    padding-inline: 0;
    color: var(--accent);
    transform: translateX(calc(-100% - 0.25rem));
  }

  .legend {
    display: flex;
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.625rem;
  }

  .legend li {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .legend-now {
    color: var(--accent);
  }

  .swatch {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 2px;
    background: var(--bar);
  }

  .swatch.part {
    background: var(--bar-part);
    box-shadow: inset 0 0 0 1px var(--bar-part-edge);
  }

  .swatch.now {
    width: 1px;
    border-radius: 0;
    background: var(--accent);
  }

  .role-panel {
    padding: 1.25rem;
    border-left: 2px solid var(--accent);
  }

  .role {
    display: grid;
    gap: 0.5rem;
    animation: fade 160ms var(--ease-out);
  }

  .role-when {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
  }

  .role.current .role-when {
    color: var(--accent);
  }

  .role-title {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    line-height: 1.2;
  }

  .role-company {
    color: var(--muted);
    font-family: var(--font-ui);
    font-size: 0.875rem;
  }

  .role-summary {
    max-width: 37.5rem;
    color: var(--muted);
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .hint {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.625rem;
  }

  .hint-touch {
    display: none;
  }

  /* ---- Growth on first view ---- */

  @media (prefers-reduced-motion: no-preference) {
    :global(.js) .timeline:not(.is-visible) .bar-fill {
      transform: scaleX(0);
    }

    :global(.js) .timeline:not(.is-visible) :is(.bar-label, .now-line, .now-label) {
      opacity: 0;
    }

    .timeline.is-visible .bar-fill {
      animation: grow-x 420ms var(--ease-out) calc(var(--i) * 60ms) both;
    }

    .timeline.is-visible .bar-label {
      animation: fade 200ms var(--ease-out) calc(var(--i) * 60ms + 300ms) both;
    }

    .timeline.is-visible :is(.now-line, .now-label) {
      animation: fade 200ms var(--ease-out) calc(var(--count) * 60ms + 300ms) both;
    }
  }

  @keyframes grow-x {
    from {
      transform: scaleX(0);
    }
  }

  @keyframes grow-y {
    from {
      transform: scaleY(0);
    }
  }

  /* ---- Mobile: vertical, newest on top, 56px a year ---- */

  @media (max-width: 47.9375rem) {
    .timeline {
      height: var(--v-height);
      container-type: normal;
    }

    .bars {
      height: 100%;
    }

    /* The button is the detail block; the narrow bar hangs off to its left. */
    .bar {
      top: var(--label-top);
      left: 5.375rem;
      right: 0;
      width: auto;
      height: auto;
      min-height: 2.75rem;
      padding: 0;
      overflow: visible;
    }

    .bar-fill {
      inset: auto;
      top: calc(var(--bar-top) - var(--label-top));
      left: calc(-2.5rem + (var(--lane) - 1) * 0.875rem);
      width: 0.625rem;
      height: var(--bar-height);
      border-radius: 3px;
      background: var(--bar-strong);
      transform-origin: center bottom;
    }

    .bar[aria-pressed='true']:not(.current .bar) .bar-fill {
      box-shadow: none;
    }

    .bar[aria-pressed='true'] .d-company {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }

    .bar-label {
      display: none;
    }

    .bar-details {
      display: grid;
      gap: 0.125rem;
    }

    .d-company {
      font-family: var(--font-serif);
      font-size: 1.0625rem;
    }

    .d-role {
      color: var(--muted);
      font-size: 0.75rem;
    }

    .d-when {
      color: var(--muted);
      font-family: var(--font-mono);
      font-size: 0.625rem;
    }

    .current :is(.d-company, .d-when) {
      color: var(--accent);
    }

    .now-line {
      display: none;
    }

    .axis {
      position: absolute;
      inset: 0 auto 0 0;
      width: 2.5rem;
      height: auto;
      margin: 0;
      border: 0;
      border-right: 1px solid var(--rule);
    }

    .tick {
      top: calc((var(--now) - var(--y)) * 3.5rem - 0.375rem);
      left: 0;
      padding: 0;
    }

    .tick::before {
      top: 0.375rem;
      left: 2.25rem;
      width: 5px;
      height: 1px;
    }

    .now-label {
      top: -0.125rem;
      left: 0;
      transform: none;
    }

    .hint-pointer {
      display: none;
    }

    .hint-touch {
      display: inline;
    }

    @media (prefers-reduced-motion: no-preference) {
      :global(.js) .timeline:not(.is-visible) .bar-fill {
        transform: scaleY(0);
      }

      .timeline.is-visible .bar-fill {
        animation-name: grow-y;
      }
    }
  }
</style>
```

**Step 2: `src/components/Toolkit.astro`**

Icons rest in ink; hover (or a press on touch) reveals the brand colour. Tiles are not focusable on purpose: they do nothing, and adding tab stops for colour alone would cost keyboard users. (The design doc mentions `:focus-visible`; this is the one deliberate deviation.) Laravel is outlined in rust and says "currently learning" to screen readers.

```astro
---
import { Icon } from 'astro-icon/components';
import { toolGroups, toolkit } from '../config/site';
---

<section class="toolkit" aria-labelledby="toolkit-title">
  <h2 class="section-label" id="toolkit-title">Toolkit</h2>
  {
    toolGroups.map((group) => (
      <div class="group">
        <h3 class="group-label">{group}</h3>
        <ul class="tools">
          {toolkit
            .filter((tool) => tool.group === group)
            .map((tool) => (
              <li class:list={['tool', { learning: tool.learning }]} style={tool.brandHex ? `--brand: #${tool.brandHex}` : undefined}>
                {tool.icon ? (
                  <Icon class="tool-icon" name={`simple-icons:${tool.icon}`} size={24} aria-hidden="true" />
                ) : (
                  <span class="tool-monogram" aria-hidden="true">
                    {tool.monogram}
                  </span>
                )}
                <span class="tool-name">
                  {tool.name}
                  {tool.learning && <span class="sr-only"> (currently learning)</span>}
                </span>
              </li>
            ))}
        </ul>
      </div>
    ))
  }
</section>

<style>
  .toolkit {
    display: grid;
    gap: 1.25rem;
  }

  .group {
    display: grid;
    grid-template-columns: 5.5rem minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
  }

  .group-label {
    padding-block-start: 0.5rem;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.625rem;
  }

  .tools {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tool {
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 0.5625rem;
    width: 4.25rem;
    height: 4.75rem;
    padding-block-start: 1.0625rem;
    border-radius: 10px;
  }

  .tool-icon,
  .tool-monogram {
    color: var(--ink);
    transition: color 200ms var(--ease-out);
  }

  .tool-monogram {
    height: 24px;
    font-family: var(--font-serif);
    font-size: 1.375rem;
    line-height: 24px;
  }

  .tool-name {
    color: var(--muted);
    font-size: 0.625rem;
    text-align: center;
    transition: color 200ms var(--ease-out);
  }

  .learning {
    outline: 1px solid var(--accent);
    outline-offset: -1px;
  }

  .learning .tool-name {
    color: var(--accent);
  }

  @media (hover: hover) {
    .tool:hover :is(.tool-icon, .tool-monogram) {
      color: var(--brand, var(--ink));
    }

    .tool:hover .tool-name {
      color: var(--ink);
    }
  }

  .tool:active :is(.tool-icon, .tool-monogram) {
    color: var(--brand, var(--ink));
  }

  @media (max-width: 47.9375rem) {
    .group {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .tools {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    .tool {
      width: auto;
    }
  }
</style>
```

**Step 3: Replace `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHeader from '../components/PageHeader.astro';
import CareerTimeline from '../components/CareerTimeline.astro';
import Toolkit from '../components/Toolkit.astro';
import { site } from '../config/site';
---

<BaseLayout title={`About | ${site.name}`} path="/about/">
  <div class="stack" style="--stack-gap: 3.5rem">
    <PageHeader
      title="Hi, I'm Indra."
      intro="A software engineer in Yogyakarta, Indonesia, building web applications for 7+ years."
    />
    <div class="prose">
      <p>
        I mostly work on the frontend with React, Next.js and TypeScript, and I own features end to end: planning with
        product stakeholders, building, releasing, and maintaining them afterwards — across internal tools and
        user-facing products.
      </p>
      <p>
        Along the way I've migrated legacy codebases, built real-time dashboards, and turned manual workflows into
        internal tools. These days I'm expanding into full-stack work with Node.js, Hono, NestJS and PostgreSQL.
      </p>
    </div>
    <CareerTimeline />
    <Toolkit />
  </div>
</BaseLayout>
```

**Step 4: Verify**

Run: `pnpm build`
Expected: PASS.

In `pnpm dev`, compare http://localhost:4321/about/ with `G9BpM` (1440) and `l9G1D` (390):
- Bars sit on a 2018 → now axis, FishGo on the lower lane with an outline, ADW in rust with white text, rust "now" line; a 4 px gap between Warung Pintar and eFishery.
- Scrolling the timeline into view grows bars oldest first, ADW last. Reloading mid-page with the timeline in view still plays.
- Clicking a bar crossfades the panel; ADW is selected on load.
- At 390: vertical, newest on top, details beside bars, Indorelawan's details pushed below FishGo's; tapping a block switches the panel.
- Toolkit: monochrome at rest, brand colour on hover, Laravel outlined in rust, five tiles per row on mobile.
- Keyboard: Tab reaches each bar; Enter or Space selects it; the focus ring is visible.

**Step 5: Commit**

```bash
git add src/components/CareerTimeline.astro src/components/Toolkit.astro src/pages/about.astro
git commit -m "feat: build the about page with a career timeline and toolkit"
```

---

## Task 19: 404

**Files:**
- Modify (replace): `src/pages/404.astro`

**Step 1: Replace the page**

The line is 32 px per the canvas (`I5hoK`); the design doc's type table lists 40. If the user prefers 40, change `2rem` to `2.5rem`.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { site } from '../config/site';
---

<BaseLayout title={`Page not found | ${site.name}`} path="/404/" mainClass="is-centred">
  <div class="lost">
    <p class="numeral" aria-hidden="true">404</p>
    <h1 class="line">You've wandered past the edge of the garden.</h1>
  </div>
</BaseLayout>

<style>
  /* No links: the sidebar is the way out. */
  :global(.page > main.is-centred) {
    display: grid;
    align-content: center;
  }

  .numeral {
    margin-inline-start: -0.04em;
    color: var(--bar);
    font-family: var(--font-serif);
    font-size: clamp(8rem, 40vw, 18.75rem);
    line-height: 0.9;
    letter-spacing: -0.04em;
  }

  .line {
    padding-inline-start: 0.375rem;
    font-family: var(--font-serif);
    font-size: 2rem;
    line-height: 1.2;
  }

  @media (max-width: 47.9375rem) {
    .line {
      font-size: 1.5rem;
    }
  }
</style>
```

**Step 2: Verify**

Run: `pnpm build && pnpm preview`, open http://localhost:4321/nope/ and compare with `I5hoK`: numeral and line centred vertically in the viewport, no active nav item.

**Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: build the v3 404 page"
```

---

## Task 20: Remove what is left of the old design

**Files:**
- Delete: `src/components/ArticleLead.astro`, `ArticleRow.astro`, `BookEntry.astro`, `Clapper.astro`, `KineticText.astro`, `ReadingDesk.astro`, `SceneSlate.astro`, `UpNext.astro`, `WorkDeck.astro`, `WorkReel.astro`
- Delete: old work poster covers (after checking they are unreferenced)
- Modify: `src/lib/content.ts`, `tests/content.test.ts` (drop `workStatusLabels`)
- Modify: `README.md`

**Step 1: Delete unused components**

```bash
git rm src/components/{ArticleLead,ArticleRow,BookEntry,Clapper,KineticText,ReadingDesk,SceneSlate,UpNext,WorkDeck,WorkReel}.astro
```

**Step 2: Drop `workStatusLabels`**

Delete it from `src/lib/content.ts`, and delete its `describe` block and import name from `tests/content.test.ts`.

**Step 3: Remove the old work covers**

Run: `grep -rn "cover.png" src/content/work`
Expected: no output (bodies reference only `-flow`, `-architecture`, and `-sketch` images). Then:

```bash
git rm src/content/work/{atlas-index,beacon-monitor,cairn-notes}-cover.png
```

The blog `*-cover.png` files stay: they are still the articles' social preview images (`ogImage`). Replacing them is part of the imagery open item.

**Step 4: Sweep for leftovers**

Run: `grep -rnE "KineticText|SceneSlate|Clapper|WorkReel|WorkDeck|UpNext|ReadingDesk|ArticleLead|ArticleRow|BookEntry|TableOfContents|data-play|data-scene|--signal|--chalk|--paper|astro:page-load|astro:after-swap|ClientRouter|Archivo|Literata|Plex" src`
Expected: no output.

**Step 5: Update `README.md`**

- Intro: replace "Swiss Poster + Analog Notebook visual system" and the old headline with a one-line description of the digital-garden design and a pointer to `docs/plans/2026-10-20-redesign-v3-design.md`.
- Stack table: Type → "Newsreader, Geist, Geist Mono (Fontsource variable packages)"; Icons → "`astro-icon` with `@iconify-json/ph` and `@iconify-json/simple-icons`"; Navigation → "Static pages with cross-document View Transitions; small vanilla scripts for the TOC, Contents sheet, timeline, and code copy".
- `pnpm test` row: "Unit tests for content, date, timeline, cover, and nav helpers".
- Project structure: list the new components and `src/lib` helpers; remove the deleted ones.

**Step 6: Verify**

Run: `pnpm test && pnpm build`
Expected: PASS.

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove the title-sequence components and update the README"
```

---

## Task 21: Final verification

Use @superpowers:verification-before-completion. Report results faithfully, including anything that fails.

**Step 1: Tests and build**

Run: `pnpm test && SITE_URL=https://indraarianggi.xyz pnpm build`
Expected: all tests pass; build succeeds with no warnings from `astro check`.

**Step 2: Structural checks on the output**

```bash
# Exactly one <h1> per page.
for f in $(find dist -name '*.html'); do printf '%s %s\n' "$(grep -o '<h1' "$f" | wc -l | tr -d ' ')" "$f"; done | grep -v '^1 '
# No draft sample books in production.
grep -rl "Sample entry from the design canvas" dist || echo "no samples shipped"
# Old URLs still exist.
ls dist/blog/index.html dist/read/index.html dist/work/index.html dist/about/index.html dist/rss.xml
```

Expected: the first command prints nothing; the second prints "no samples shipped"; the third lists all five files.

**Step 3: Visual comparison against the canvas**

With `pnpm preview` running, use the Chrome DevTools MCP tools (`new_page`, `resize_page`, `take_screenshot`) and the Pencil MCP (`TakeScreenshot` on frame ids) to compare side by side:

| Page | Canvas frame | Widths |
|---|---|---|
| `/` | `h9LzvX`, `bYuF5` | 1440, 900, 390 |
| `/work/` | `ViFvY` | 1440, 390 |
| `/work/atlas-index/` | `jTli2`, `Al4ch`, `M7VSdT` | 1440, 900, 390 |
| `/blog/` | `AxLK8` | 1440, 390 |
| `/blog/reading-code-slowly/` | `z6PKO` | 1440 |
| `/read/` (dev, with drafts) | `jlntv` | 1440, 390 |
| `/about/` | `G9BpM`, `l9G1D` | 1440, 390 |
| `/404` | `I5hoK` | 1440, 390 |

Also check 1100 px exactly (sidebar must not touch the window edge) and 320 px (mobile nav row fits).

**Step 4: Motion and accessibility**

- Emulate `prefers-reduced-motion: reduce`: no movement anywhere; sentence and bars appear at once; the ink sweep appears without sweeping; page navigation does not crossfade.
- Navigate Home → Work → About in Chrome: content crossfades (~180 ms), the sidebar does not move.
- Keyboard only: skip link, nav, sentence verbs, index rows (wash visible on focus), timeline bars, Contents pill and sheet (Escape closes, focus returns to the pill).
- Run `lighthouse_audit` (Chrome DevTools MCP) on `/`, `/about/`, and `/work/atlas-index/` at mobile and desktop. Target: Accessibility 100, no contrast failures.
- Zoom to 200 % at 1440: content stays readable, nothing overlaps.

**Step 5: Report**

Summarise what passed, what deviated from the canvas (with screenshots), and the open items for the user:
- Review the four condensed experience summaries (Task 9).
- Keep or delete the draft sample books (Task 17).
- 404 line at 32 (canvas) or 40 (doc type table) (Task 19).
- Real project screenshots, real articles, real books, and the final portrait (design doc, open items).
- The favicon is still the old red keyframe mark.

Then use @superpowers:finishing-a-development-branch.
