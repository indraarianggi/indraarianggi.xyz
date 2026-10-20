/** Muted cover colours from the Reading canvas. */
export const coverPalette = [
  '#2F3A35',
  '#D9D3C7',
  '#B5543A',
  '#C9D1C8',
  '#3B3F4A',
  '#8E9A8A',
  '#E6E0D4',
  '#CFC6B8',
  '#5C4A3D',
] as const;

const inks = ['#141414', '#F4F2EC'] as const;

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two `#RRGGBB` colours. */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Ink or paper, whichever reads better on the cover. */
export function coverInk(background: string): (typeof inks)[number] {
  return contrastRatio(background, inks[0]) >= contrastRatio(background, inks[1]) ? inks[0] : inks[1];
}

export function fallbackCover(title: string) {
  let hash = 0;
  for (const char of title) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  const background = coverPalette[hash % coverPalette.length];
  return { background, ink: coverInk(background) };
}
