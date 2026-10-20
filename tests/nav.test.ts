import { describe, expect, it } from 'vitest';
import { isActive } from '../src/lib/nav';

describe('isActive', () => {
  it('matches Home only on the root', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/', '/work/')).toBe(false);
  });

  it('keeps a section active on its detail pages', () => {
    expect(isActive('/work/', '/work/atlas-index/')).toBe(true);
    expect(isActive('/blog/', '/blog/reading-code-slowly/')).toBe(true);
  });

  it('tolerates a missing trailing slash', () => {
    expect(isActive('/blog/', '/blog')).toBe(true);
  });

  it('does not match a section that only shares a prefix', () => {
    expect(isActive('/read/', '/reading-list/')).toBe(false);
  });
});
