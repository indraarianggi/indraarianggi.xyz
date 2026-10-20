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
