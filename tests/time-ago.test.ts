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
