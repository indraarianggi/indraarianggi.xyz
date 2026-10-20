import { describe, expect, it } from 'vitest';
import { arrangeWork, articleMeta, bookDate, bookMeta, bookShelves, groupBooks, groupByYear, visibleNewestFirst, workCaption, workStatusLine } from '../src/lib/content';

type ContentEntry<Data> = {
  id: string;
  data: Data;
};

describe('visibleNewestFirst', () => {
  it('removes drafts in production and orders newest entries first', () => {
    const entries: ContentEntry<{ draft: boolean; date: Date }>[] = [
      { id: 'old', data: { draft: false, date: new Date('2025-01-01') } },
      { id: 'draft', data: { draft: true, date: new Date('2027-01-01') } },
      { id: 'new', data: { draft: false, date: new Date('2026-01-01') } },
    ];

    expect(visibleNewestFirst(entries, true).map(({ id }) => id)).toEqual(['new', 'old']);
  });

  it('keeps drafts outside production while preserving newest-first order', () => {
    const entries: ContentEntry<{ draft: boolean; date: Date }>[] = [
      { id: 'old', data: { draft: false, date: new Date('2025-01-01') } },
      { id: 'draft', data: { draft: true, date: new Date('2027-01-01') } },
      { id: 'new', data: { draft: false, date: new Date('2026-01-01') } },
    ];

    expect(visibleNewestFirst(entries, false).map(({ id }) => id)).toEqual(['draft', 'new', 'old']);
  });
});

describe('groupBooks', () => {
  it('returns only populated states in the intended editorial order', () => {
    const books: ContentEntry<{ status: 'reading' | 'want-to-read'; order?: number }>[] = [
      { id: 'later', data: { status: 'want-to-read', order: 2 } },
      { id: 'now', data: { status: 'reading', order: 1 } },
    ];

    expect(groupBooks(books).map(({ status }) => status)).toEqual(['reading', 'want-to-read']);
  });

  it('orders books inside each populated state by editorial order', () => {
    const books: ContentEntry<{ status: 'finished'; order?: number }>[] = [
      { id: 'unordered', data: { status: 'finished' } },
      { id: 'second', data: { status: 'finished', order: 2 } },
      { id: 'first', data: { status: 'finished', order: 1 } },
    ];

    expect(groupBooks(books)[0]?.entries.map(({ id }) => id)).toEqual(['first', 'second', 'unordered']);
  });
});

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
