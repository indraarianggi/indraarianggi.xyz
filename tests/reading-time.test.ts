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
