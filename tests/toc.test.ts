import { describe, expect, it } from 'vitest';
import { buildTocTree } from '../src/lib/toc';

describe('buildTocTree', () => {
  it('turns h2 headings into root items', () => {
    expect(buildTocTree([
      { depth: 2, slug: 'context', text: 'Context' },
      { depth: 2, slug: 'decision', text: 'Decision' },
    ])).toEqual([
      { depth: 2, slug: 'context', text: 'Context', children: [] },
      { depth: 2, slug: 'decision', text: 'Decision', children: [] },
    ]);
  });

  it('nests h3 headings beneath the nearest h2', () => {
    expect(buildTocTree([
      { depth: 2, slug: 'context', text: 'Context' },
      { depth: 3, slug: 'constraints', text: 'Constraints' },
    ])).toEqual([
      {
        depth: 2,
        slug: 'context',
        text: 'Context',
        children: [{ depth: 3, slug: 'constraints', text: 'Constraints' }],
      },
    ]);
  });

  it('ignores h1, h4, and deeper headings', () => {
    expect(buildTocTree([
      { depth: 1, slug: 'title', text: 'Title' },
      { depth: 2, slug: 'context', text: 'Context' },
      { depth: 4, slug: 'detail', text: 'Detail' },
      { depth: 5, slug: 'deeper', text: 'Deeper' },
    ])).toEqual([
      { depth: 2, slug: 'context', text: 'Context', children: [] },
    ]);
  });

  it('omits a leading h3 instead of producing malformed navigation', () => {
    expect(buildTocTree([
      { depth: 3, slug: 'orphan', text: 'Orphan' },
      { depth: 2, slug: 'context', text: 'Context' },
    ])).toEqual([
      { depth: 2, slug: 'context', text: 'Context', children: [] },
    ]);
  });
});
