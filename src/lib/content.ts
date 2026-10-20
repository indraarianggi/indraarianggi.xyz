import { formatDate, formatDay, formatMonth } from './dates';

export type BookStatus = 'reading' | 'finished' | 'paused' | 'want-to-read';

const bookStateOrder: BookStatus[] = ['reading', 'finished', 'paused', 'want-to-read'];

export function visibleNewestFirst<
  T extends { data: { draft: boolean; date: Date } },
>(entries: T[], production: boolean): T[] {
  return entries
    .filter(({ data }) => !production || !data.draft)
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function groupBooks<
  T extends { data: { status: BookStatus; order?: number } },
>(books: T[]) {
  return bookStateOrder.flatMap((status) => {
    const entries = books
      .filter(({ data }) => data.status === status)
      .toSorted((a, b) => (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER));

    return entries.length ? [{ status, entries }] : [];
  });
}

export const workStatusLabels = {
  building: 'Building',
  shipped: 'Shipped',
  paused: 'Paused',
  archived: 'Archived',
} as const;

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
