import { describe, expect, it } from 'vitest';
import { contrastRatio, coverInk, coverPalette, fallbackCover } from '../src/lib/cover';

describe('contrastRatio', () => {
  it('matches the WCAG figure for the site ink on its background', () => {
    expect(contrastRatio('#141414', '#FBFBF9')).toBeCloseTo(17.8, 1);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#FBFBF9', '#141414')).toBeCloseTo(contrastRatio('#141414', '#FBFBF9'));
  });
});

describe('coverInk', () => {
  it('sets light text on dark and saturated covers', () => {
    expect(coverInk('#2F3A35')).toBe('#F4F2EC');
    expect(coverInk('#B5543A')).toBe('#F4F2EC');
  });

  it('sets ink on light and mid-tone covers', () => {
    expect(coverInk('#D9D3C7')).toBe('#141414');
    expect(coverInk('#8E9A8A')).toBe('#141414');
  });
});

describe('fallbackCover', () => {
  it('is stable for a title and always from the palette', () => {
    const cover = fallbackCover('Thinking in Systems');
    expect(fallbackCover('Thinking in Systems')).toEqual(cover);
    expect(coverPalette).toContain(cover.background);
    expect(cover.ink).toBe(coverInk(cover.background));
  });
});
