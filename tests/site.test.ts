import { describe, expect, it } from 'vitest';
import { icons } from '@iconify-json/simple-icons';
import { experience, site, toolGroups, toolkit } from '../src/config/site';

describe('nav', () => {
  it('lists five peers and keeps the old URLs', () => {
    expect(site.nav.map(({ href }) => href)).toEqual(['/', '/work/', '/blog/', '/read/', '/about/']);
    expect(site.nav.map(({ label }) => label)).toEqual(['Home', 'Work', 'Writing', 'Reading', 'About']);
  });
});

describe('experience', () => {
  it('has exactly one current role', () => {
    expect(experience.filter(({ end }) => end === null)).toHaveLength(1);
  });

  it('uses YYYY-MM months that run forwards', () => {
    for (const { start, end } of experience) {
      expect(start).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      if (end) {
        expect(end).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
        expect(end >= start).toBe(true);
      }
    }
  });
});

describe('toolkit', () => {
  it('only names icons that Simple Icons ships, or draws a monogram', () => {
    for (const tool of toolkit) {
      if (tool.icon) expect(icons.icons[tool.icon], tool.name).toBeDefined();
      else expect(tool.monogram, tool.name).toMatch(/^\S{1,2}$/);
    }
  });

  it('puts every tool in a known group', () => {
    for (const tool of toolkit) expect(toolGroups).toContain(tool.group);
  });
});
