import { describe, expect, it } from 'vitest';
import { groupBooks, visibleNewestFirst } from '../src/lib/content';

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
