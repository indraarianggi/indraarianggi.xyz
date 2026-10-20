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
