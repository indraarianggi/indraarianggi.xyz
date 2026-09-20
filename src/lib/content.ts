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
