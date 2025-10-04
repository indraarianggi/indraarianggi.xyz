# ASTRO_ARCHITECTURE.md

Target Astro architecture for migrating the Next.js site. This document codifies structure, routing, component strategy, MDX setup, and technical decisions.

## See also

- **[MIGRATION_OVERVIEW.md](./MIGRATION_OVERVIEW.md)** - High-level migration overview
- **[MIGRATION_PLAN.md](./MIGRATION_PLAN.md)** - 20-phase step-by-step migration plan

---

## 1) Astro project structure (proposed)

```
.
├─ astro.config.mjs
├─ tsconfig.json
├─ postcss.config.js
├─ tailwind.config.ts                # optional for v4 (plugins/custom theme)
├─ package.json
├─ src/
│  ├─ pages/
│  │  ├─ index.astro                 # Home
│  │  ├─ about.astro                 # About
│  │  ├─ experience.astro            # Experience
│  │  ├─ blog/
│  │  │  ├─ index.astro             # Blog listing
│  │  │  └─ [slug].astro            # Blog post dynamic route
│  ├─ layouts/
│  │  ├─ BaseLayout.astro
│  │  └─ BlogLayout.astro
│  ├─ components/
│  │  ├─ astro/
│  │  │  ├─ Seo.astro
│  │  │  ├─ footer.astro
│  │  │  ├─ post-card.astro
│  │  │  ├─ badge.astro
│  │  │  ├─ button.astro
│  │  │  └─ card.astro
│  │  ├─ react/
│  │  │  ├─ navigation.tsx
│  │  │  ├─ theme-toggler.tsx
│  │  │  ├─ table-of-contents.tsx
│  │  │  └─ share-buttons.tsx
│  │  └─ mdx/
│  │     └─ index.ts                 # re-exports MDX-friendly components if needed
│  ├─ content/
│  │  ├─ config.ts                   # collections schema (Zod)
│  │  └─ posts/
│  │     └─ *.mdx
│  ├─ styles/
│  │  ├─ tailwind.css
│  │  └─ globals.css
│  ├─ lib/
│  │  ├─ reading-time.ts
│  │  └─ utils.ts
│  ├─ types/
│  │  └─ post.ts
│  └─ data/
│     ├─ author.ts
│     └─ menu.ts
└─ public/
   └─ avatar.svg
```

---

## 2) Routing strategy

### File-based routing under `src/pages/`

- `index.astro` → `/`
- `about.astro` → `/about`
- `experience.astro` → `/experience`
- `blog/index.astro` → `/blog`
- `blog/[slug].astro` → `/blog/:slug`

### Dynamic routes

Dynamic routes use `getStaticPaths` to enumerate MDX entries from `astro:content`.

Example `getStaticPaths` for blog:

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => data.published !== false);
  return posts.map((p) => ({ params: { slug: p.slug }, props: { post: p } }));
}
---
```

---

## 3) Component architecture

### Astro components (static)

- **Layout**: BaseLayout.astro, BlogLayout.astro
- **UI**: Card/PostCard, Badge, Button, Footer, CustomImage (optional)
- **SEO**: Seo.astro for metadata management

### React islands (interactive)

- Navigation
- TableOfContents
- ShareButtons
- ThemeToggler
- CopyButton (if needed)

### Client directives strategy

- **Navigation**: `client:load` (user should see interactive nav immediately)
- **ThemeToggler**: `client:load` (paired with inline theme script for no-flash)
- **TableOfContents**: `client:visible` (hydrate when sidebar appears)
- **ShareButtons**: `client:idle` or `client:visible` (no rush)
- Any other non-critical interactivity: `client:idle`

### Usage example

```astro
---
import Navigation from '@/components/react/navigation';
import TableOfContents from '@/components/react/table-of-contents';
---
<Navigation client:load />
<TableOfContents client:visible />
```

---

## 4) MDX configuration with plugins

### `astro.config.mjs`

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

export default defineConfig({
  site: "https://your-site.example.com",
  server: { port: 4321, host: true }, // Astro default port is 4321
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          { behavior: "append", properties: { className: ["anchor"] } },
        ],
        [rehypePrettyCode, { theme: "aurora-x", keepBackground: false }],
      ],
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
```

---

## 5) Static site generation strategy

- Default Astro build produces a static site in `dist/`
- All blog routes pre-generated via `getStaticPaths`
- No server runtime assumed
- Output can be deployed to any static hosting

---

## 6) Content collections for blog posts

### `src/content/config.ts`

```ts
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    author: z
      .object({
        name: z.string(),
        occupation: z.string().optional(),
        avatar: z.string().optional(),
      })
      .optional(),
    time: z.object({
      created: z.string().or(z.date()),
      updated: z.string().or(z.date()).optional(),
    }),
    published: z.boolean().default(true),
  }),
});

export const collections = { posts };
```

### Reading entry and headings in `[slug].astro`

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import BlogLayout from '@/layouts/BlogLayout.astro';
import TableOfContents from '@/components/react/table-of-contents';
import ShareButtons from '@/components/react/share-buttons';
import { readingTime } from '@/lib/reading-time';

const { post } = Astro.props;
const { Content, headings } = await post.render();
const rt = readingTime(post.body ?? '');
---
<BaseLayout title={post.data.title} description={post.data.excerpt}>
  <BlogLayout frontmatter={post.data} readingTime={rt}>
    <article class="prose dark:prose-invert max-w-none">
      <Content />
    </article>
    <aside>
      <TableOfContents headings={headings} client:visible />
      <ShareButtons url={Astro.url.href} title={post.data.title} client:idle />
    </aside>
  </BlogLayout>
</BaseLayout>
```

---

## 7) SEO and metadata handling

Use a lightweight `Seo.astro` component that sets `<title>`, meta description, Open Graph, and Twitter tags.

### `src/components/astro/Seo.astro`

```astro
---
import { author } from '@/data/author';

export interface Props {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const siteTitle = `${author.name} - ${author.occupation}`;
const siteDescription = author.description;
const { title, description, image, url } = Astro.props;
const fullTitle = title ? `${title} | ${author.name}` : siteTitle;
---

<title>{fullTitle}</title>
<meta name="description" content={description ?? siteDescription} />
<meta property="og:title" content={title ?? siteTitle} />
<meta property="og:description" content={description ?? siteDescription} />
{url && <meta property="og:url" content={url} />}
{image && <meta property="og:image" content={image} />}
<meta name="twitter:card" content="summary_large_image" />
```

---

## 8) Dark mode implementation

### No-FOUC inline script

Place in `BaseLayout.astro` to set `documentElement.classList` before paint:

```astro
<script is:inline>
try {
  const stored = localStorage.getItem('theme');
  const preferred = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', preferred === 'dark');
} catch {}
</script>
```

### ThemeToggler React island

Updates localStorage and toggles class. Hydrate with `client:load` to pair with the inline script.

---

## 9) Styling approach (Tailwind CSS v4)

### PostCSS configuration

`postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Tailwind CSS entry

`src/styles/tailwind.css`:

```css
@import "tailwindcss";
```

### Optional Tailwind config (for plugins)

`tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{astro,ts,tsx,js,jsx,md,mdx}"],
  plugins: [typography],
} satisfies Config;
```

### Import styles in BaseLayout

```astro
---
import '@/styles/tailwind.css';
import '@/styles/globals.css';
---
```

---

## 10) Build and deployment configuration

- **Build**: `bun run build` → `dist/`
- **Preview**: `bun run preview` (Astro built-in)
- **Deploy**: Any static host (Netlify, Cloudflare Pages, GitHub Pages, Vercel static)
- **Site URL**: Configure `site` in `astro.config.mjs` for correct absolute URLs

---

## 11) Performance optimizations

- React islands hydrate only where necessary (client directives)
- Minimize client JS: prefer Astro components for static UI
- Use `astro:assets` for optimized local images where applicable
- Keep MDX bundle sizes reasonable
- Prefetch key routes via Astro's `<a data-astro-prefetch>`

---

## 12) Testing strategy

### Unit tests

- **Vitest** + happy-dom for islands and utilities
- Coverage for `reading-time.ts` and other pure functions
- Component snapshots for static Astro components

### E2E tests

- **Playwright** using `webServer` to boot Astro dev at port 4321
- Happy-path navigation tests
- Blog post rendering verification

### Example `playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "bunx --bun astro dev",
    port: 4321,
    reuseExistingServer: true,
  },
  use: { baseURL: "http://localhost:4321" },
});
```

---

## See also

- **[MIGRATION_OVERVIEW.md](./MIGRATION_OVERVIEW.md)** - High-level migration overview
- **[MIGRATION_PLAN.md](./MIGRATION_PLAN.md)** - 20-phase step-by-step migration plan
