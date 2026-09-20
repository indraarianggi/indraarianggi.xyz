import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap(), icon({ include: { ph: ['list-bold', 'x-bold'] } })],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
