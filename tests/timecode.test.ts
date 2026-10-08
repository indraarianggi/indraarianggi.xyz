import { describe, expect, it } from 'vitest';
import { formatTimecode, framesForScroll, labelForPath, readingMinutes } from '../src/lib/timecode';

describe('formatTimecode', () => {
  it('formats zero as an empty reel', () => {
    expect(formatTimecode(0)).toBe('00:00:00:00');
  });

  it('carries frames into seconds, minutes, and hours at 24fps', () => {
    expect(formatTimecode(23)).toBe('00:00:00:23');
    expect(formatTimecode(24)).toBe('00:00:01:00');
    expect(formatTimecode(24 * 61 + 5)).toBe('00:01:01:05');
    expect(formatTimecode(24 * 3600)).toBe('01:00:00:00');
  });

  it('clamps negative and fractional input', () => {
    expect(formatTimecode(-40)).toBe('00:00:00:00');
    expect(formatTimecode(24.9)).toBe('00:00:01:00');
  });
});

describe('framesForScroll', () => {
  it('maps a full scroll onto the runtime', () => {
    expect(formatTimecode(framesForScroll(0, 4000, 180))).toBe('00:00:00:00');
    expect(formatTimecode(framesForScroll(2000, 4000, 180))).toBe('00:01:30:00');
    expect(formatTimecode(framesForScroll(4000, 4000, 180))).toBe('00:03:00:00');
  });

  it('falls back to a one-minute reel', () => {
    expect(formatTimecode(framesForScroll(4000, 4000))).toBe('00:01:00:00');
  });

  it('clamps overscroll and handles pages that do not scroll', () => {
    expect(framesForScroll(-80, 4000, 180)).toBe(0);
    expect(formatTimecode(framesForScroll(4200, 4000, 180))).toBe('00:03:00:00');
    expect(framesForScroll(0, 0, 180)).toBe(0);
  });
});

describe('labelForPath', () => {
  it('names each section, including detail pages', () => {
    expect(labelForPath('/')).toBe('Home');
    expect(labelForPath('/work/')).toBe('Work');
    expect(labelForPath('/work/atlas-index/')).toBe('Work');
    expect(labelForPath('/blog/reading-code-slowly/')).toBe('Field notes');
    expect(labelForPath('/about/')).toBe('About');
  });

  it('falls back for unknown routes', () => {
    expect(labelForPath('/missing/page/')).toBe('Index');
  });
});

describe('readingMinutes', () => {
  it('never reports less than one minute', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes(undefined)).toBe(1);
  });

  it('rounds to the nearest minute', () => {
    expect(readingMinutes(Array(660).fill('word').join(' '))).toBe(3);
  });
});
