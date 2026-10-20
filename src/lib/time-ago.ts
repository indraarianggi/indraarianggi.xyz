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
