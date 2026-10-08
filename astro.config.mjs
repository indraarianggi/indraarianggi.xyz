import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { codeBlockTransformer } from './src/lib/code-block.ts';

const site = process.env.SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap(), icon({ include: { ph: ['list-bold', 'x-bold'] } })],
  markdown: {
    // github-light ships token colors such as #e36209 that measure 3.48:1 on
    // the code surface, below the 4.5:1 the rest of the site holds to.
    shikiConfig: {
      theme: 'github-light-high-contrast',
      // Header slate with the language and a copy button on every block.
      transformers: [codeBlockTransformer()],
    },
  },
});
