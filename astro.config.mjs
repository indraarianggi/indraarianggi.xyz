// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://indraarianggi.xyz',
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: {
              dark: 'github-dark-dimmed',
              light: 'github-light',
            },
            keepBackground: false,
            defaultLang: 'plaintext',
          },
        ],
      ],
      syntaxHighlight: false,
    }),
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
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});
