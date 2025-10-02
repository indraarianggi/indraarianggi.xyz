// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://indraarianggi.xyz',
  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: false, // We'll use rehype-pretty-code instead
  },
  output: 'static',
  build: {
    format: 'directory',
  },
  server: {
    port: 4321,
  },
});
