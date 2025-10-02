# MIGRATION_PLAN.md

This plan migrates the Next.js 15 static-export site to Astro (SSG) with React islands, Bun, Tailwind v4, MDX, and testing. Each phase has objectives, files to change, commands, verification, expected output, and rollback instructions.

## See also

- **[MIGRATION_OVERVIEW.md](./MIGRATION_OVERVIEW.md)** - High-level migration overview
- **[ASTRO_ARCHITECTURE.md](./ASTRO_ARCHITECTURE.md)** - Target architecture and technical decisions

---

## Prerequisites and setup requirements

- **Bun installed** (`bun --version`)
- **Node 18+** (for tooling compatibility)
- **Git branch created**: `docs/astro-migration`
- **Ensure no uncommitted changes** before starting
- **Confirm ability to run Playwright install** if e2e is required (`bunx playwright install`)

### Global conventions

- Use **Bun**, not npm
- Astro default dev port: **4321**
- Proceed only when verification passes with **zero errors**

---

## Phase 1 — Environment setup and backup

### Objective

Ensure safe rollback and reproducible environment.

### Files to create/modify

None

### Commands

```bash
git tag pre-astro-migration
git status
```

### Verification

- Tag exists: `git tag --list | grep pre-astro-migration`

### Expected output

Repo tagged for recovery

### Rollback

```bash
git reset --hard pre-astro-migration
```

---

## Phase 2 — Initialize Astro project with React integration

### Objective

Scaffold Astro with React islands enabled.

### Files

- `astro.config.mjs`
- `package.json`
- `src/**` (initial scaffold)

### Commands

```bash
mkdir astro-temp
cd astro-temp
bunx create-astro@latest . --template minimal --no-install --yes
cd ..
# Review generated files before integrating
```

### Installation commands

```bash
bun add astro@latest
bun add -D @astrojs/react @astrojs/mdx
bun add react react-dom
bun add remark-gfm rehype-slug rehype-autolink-headings rehype-pretty-code shiki
```

### Verification

- `bunx astro --version`
- `bun run dev` (visit http://localhost:4321)

### Expected output

Astro starter runs on port 4321

### Rollback

```bash
rm -rf astro-temp
```

---

## Phase 3 — Configure Bun as package manager

### Objective

Ensure Bun is authoritative for installs and scripts.

### Files

- `package.json`

### Actions

Add `packageManager` field and update scripts

### Example package.json fields

```json
{
  "packageManager": "bun@1.2.x",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --check .",
    "format:fix": "prettier --write .",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

### Verification

- `bun run dev` works
- `bun install` respects lockfile

### Expected output

Bun manages dependencies and scripts

### Rollback

Revert `package.json` changes

---

## Phase 4 — Migrate Tailwind CSS v4 with PostCSS

### Objective

Integrate Tailwind v4 for styling parity.

### Files

- `postcss.config.js`
- `tailwind.config.ts` (optional for plugins)
- `src/styles/tailwind.css`
- `src/styles/globals.css`
- `src/layouts/BaseLayout.astro`

### Commands

```bash
bun add -D tailwindcss@latest postcss autoprefixer @tailwindcss/typography
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Create `src/styles/tailwind.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@plugin "@tailwindcss/typography";
```

Optional `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{astro,ts,tsx,js,jsx,md,mdx}"],
  plugins: [typography],
} satisfies Config;
```

### Verification

- `bun run dev` compiles without Tailwind errors
- Typography classes (`prose`) render

### Expected output

Styled pages using Tailwind v4

### Rollback

Remove Tailwind-related files and deps

---

## Phase 5 — Port global styles and custom CSS

### Objective

Migrate `src/app/globals.css` and custom CSS to Astro.

### Files

- `src/styles/globals.css`

### Actions

Copy content from Next.js `globals.css`; adjust selectors to match Astro DOM if needed.

### Verification

Visual match on base styles

### Expected output

Global styles loaded site-wide

### Rollback

Restore previous `globals.css`

---

## Phase 6 — Setup MDX integration with rehype/remark plugins

### Objective

Enable MDX with existing features: GFM, slugged headings, autolink, code highlighting.

### Files

- `astro.config.mjs`

### Commands

Ensure deps installed (already added in Phase 2)

Update `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

export default defineConfig({
  site: "https://yoursite.com",
  server: { port: 4321, host: true },
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "append" }],
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

### Verification

MDX test page renders headings with anchors and highlighted code

### Expected output

MDX pipeline functional

### Rollback

Remove MDX integration from `astro.config.mjs`

---

## Phase 7 — Migrate utility functions and types

### Objective

Port utilities with minimal changes.

### Files

- `src/lib/reading-time.ts`
- `src/lib/utils.ts`
- `src/types/post.ts`

### Actions

Copy and adapt reading-time algorithm. Keep `utils.ts` (`cn` function) as-is.

Example `reading-time.ts`:

````ts
const WORDS_PER_MINUTE = 225;
const CODE_WORDS_PER_MINUTE = 100;
const IMAGE_TIME_SECONDS = 10;

export function readingTime(content: string): {
  minutes: number;
  text: string;
} {
  const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
  const images = (content.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;

  const cleanText = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "");

  const textWords = cleanText.split(/\s+/).filter(Boolean).length;
  const codeWords = codeBlocks * 50; // Estimate

  const textMinutes = textWords / WORDS_PER_MINUTE;
  const codeMinutes = codeWords / CODE_WORDS_PER_MINUTE;
  const imageMinutes = (images * IMAGE_TIME_SECONDS) / 60;

  const totalMinutes = Math.max(
    1,
    Math.ceil(textMinutes + codeMinutes + imageMinutes)
  );

  return {
    minutes: totalMinutes,
    text: `${totalMinutes} min read`,
  };
}
````

### Verification

Utils compile and are importable (unit test later in Phase 17)

### Expected output

Utils compile and are importable

### Rollback

Remove or revert utils files

---

## Phase 8 — Migrate content (author, menu, blog posts) via content collections

### Objective

Move MDX posts into `src/content/posts` and define schema.

### Files

- `src/content/config.ts`
- `src/content/posts/*.mdx`
- `src/data/author.ts`
- `src/data/menu.ts`

### Actions

1. Copy posts: `src/contents/posts` → `src/content/posts`
2. Copy data: `src/contents/author.ts` → `src/data/author.ts`
3. Copy data: `src/contents/menu.ts` → `src/data/menu.ts`
4. Create `src/content/config.ts` per ASTRO_ARCHITECTURE.md

Example `src/content/config.ts`:

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

### Commands

```bash
bunx astro check
```

### Verification

- `astro check` shows no content schema errors
- Number of posts matches source

### Expected output

Content available via `getCollection('posts')`

### Rollback

Revert changes, keep original location

---

## Phase 9 — Convert static UI components to Astro

### Objective

Port static components to `.astro` for zero-JS delivery.

### Files

- `src/components/astro/Seo.astro`
- `src/components/astro/footer.astro`
- `src/components/astro/post-card.astro`
- `src/components/astro/badge.astro`
- `src/components/astro/button.astro`
- `src/components/astro/card.astro`

### Example `post-card.astro`

```astro
---
import { Badge } from './badge.astro';

interface Props {
  href: string;
  title: string;
  excerpt?: string;
  date?: string;
  tags?: string[];
  readingTime?: string;
}

const { href, title, excerpt, date, tags = [], readingTime } = Astro.props;
---

<a
  href={href}
  class="block rounded-lg border p-6 transition-all hover:border-primary/50 hover:shadow-md"
>
  <h3 class="mb-2 text-xl font-semibold">{title}</h3>
  {excerpt && <p class="text-muted-foreground mb-4 text-sm">{excerpt}</p>}
  <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
    {date && <span>{new Date(date).toLocaleDateString()}</span>}
    {readingTime && <span>• {readingTime}</span>}
  </div>
  {tags.length > 0 && (
    <div class="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span class="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
          {tag}
        </span>
      ))}
    </div>
  )}
</a>
```

### Verification

- Components render without console errors
- No unnecessary client JS in network tab

### Expected output

Static UI shipped as HTML/CSS

### Rollback

Use React components as temporary fallback

---

## Phase 10 — Migrate React interactive components (Navigation, TOC, Share, Theme)

### Objective

Bring over interactive components as React islands with client directives.

### Files

- `src/components/react/navigation.tsx`
- `src/components/react/theme-toggler.tsx`
- `src/components/react/table-of-contents.tsx`
- `src/components/react/share-buttons.tsx`

### Actions

1. Remove Next.js-specific imports (`next/link` → regular `<a>`, `next/navigation` hooks → standard)
2. Add proper TypeScript types for Astro props
3. Keep interactive logic intact

### Example adjustments for Navigation

Replace `next/link`:

```tsx
// Before (Next.js)
import Link from 'next/link';
<Link href="/about">About</Link>

// After (Astro)
<a href="/about">About</a>
```

Replace `usePathname`:

```tsx
// Before
import { usePathname } from "next/navigation";
const pathname = usePathname();

// After
const pathname = typeof window !== "undefined" ? window.location.pathname : "";
```

### Inline theme script

Add to `BaseLayout.astro`:

```astro
<script is:inline>
try {
  const stored = localStorage.getItem('theme');
  const preferred = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', preferred === 'dark');
} catch {}
</script>
```

### Verification

- Hydration occurs without warnings
- TOC anchors scroll to headings
- Share buttons open dialogs/copy URLs
- Theme toggler works

### Expected output

Interactive islands behave as expected

### Rollback

Temporarily disable hydration directives

---

## Phase 11 — Create Astro layouts

### Objective

Add BaseLayout.astro and BlogLayout.astro to centralize head, nav, footer patterns.

### Files

- `src/layouts/BaseLayout.astro`
- `src/layouts/BlogLayout.astro`
- `src/components/astro/Seo.astro`

### Example `BaseLayout.astro`

```astro
---
import Seo from '@/components/astro/Seo.astro';
import Navigation from '@/components/react/navigation';
import Footer from '@/components/astro/footer.astro';
import '@/styles/tailwind.css';
import '@/styles/globals.css';

interface Props {
  title?: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <Seo title={title} description={description} />
    <script is:inline>
      try {
        const stored = localStorage.getItem('theme');
        const preferred = stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', preferred === 'dark');
      } catch {}
    </script>
  </head>
  <body>
    <div class="flex min-h-screen flex-col">
      <Navigation client:load />
      <main class="flex-1">
        <slot />
      </main>
      <Footer />
    </div>
  </body>
</html>
```

### Verification

- All pages correctly wrap with BaseLayout
- Blog pages wrap with BlogLayout

### Expected output

Consistent layout across pages

### Rollback

Revert to simple page-level structure

---

## Phase 12 — Migrate homepage

### Objective

Implement `/` in `index.astro` with static Astro components and Navigation island.

### Files

- `src/pages/index.astro`

### Actions

Convert `src/app/page.tsx` to Astro, keeping structure identical.

### Verification

Homepage renders content parity (titles, hero, links)

### Expected output

Functional homepage

### Rollback

Comment out sections to isolate issues

---

## Phase 13 — Migrate about page

### Objective

Implement `/about` in `about.astro`.

### Files

- `src/pages/about.astro`

### Actions

Convert `src/app/about/page.tsx` to Astro.

### Verification

About page renders

### Expected output

Functional about page

### Rollback

Revert page file

---

## Phase 14 — Create experience page

### Objective

Implement `/experience` using available data or static content.

### Files

- `src/pages/experience.astro`
- Optional: `src/data/experience.ts`

### Actions

Design and implement experience page with work history, projects, timeline.

### Verification

Experience page loads and is linked from navigation

### Expected output

Functional experience page

### Rollback

Remove route

---

## Phase 15 — Migrate blog listing page

### Objective

Implement `/blog` listing using `getCollection('posts')`.

### Files

- `src/pages/blog/index.astro`
- `src/components/astro/post-card.astro`

### Example

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@/layouts/BaseLayout.astro';
import PostCard from '@/components/astro/post-card.astro';
import { readingTime } from '@/lib/reading-time';

const posts = (await getCollection('posts'))
  .filter((post) => post.data.published !== false)
  .sort((a, b) => new Date(b.data.time.created).getTime() - new Date(a.data.time.created).getTime());
---

<BaseLayout title="Blog" description="Articles and insights">
  <div class="container mx-auto px-4 py-20">
    <h1 class="mb-12 text-4xl font-bold">Blog</h1>
    <div class="grid gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <PostCard
          href={`/blog/${post.slug}`}
          title={post.data.title}
          excerpt={post.data.excerpt}
          date={post.data.time.created}
          tags={post.data.tags}
          readingTime={readingTime(post.body).text}
        />
      ))}
    </div>
  </div>
</BaseLayout>
```

### Verification

- Post cards display correct metadata
- Links route to blog posts

### Expected output

Functional blog listing

### Rollback

Temporarily hide unpublished posts

---

## Phase 16 — Migrate blog post dynamic route

### Objective

Implement `/blog/[slug]` with `getStaticPaths` and MDX render.

### Files

- `src/pages/blog/[slug].astro`

### Example

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@/layouts/BaseLayout.astro';
import TableOfContents from '@/components/react/table-of-contents';
import ShareButtons from '@/components/react/share-buttons';
import { readingTime } from '@/lib/reading-time';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => data.published !== false);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await post.render();
const rt = readingTime(post.body);
---

<BaseLayout title={post.data.title} description={post.data.excerpt}>
  <article class="container mx-auto px-4 py-12">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-6 text-4xl font-bold">{post.data.title}</h1>
      <div class="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
        <span>{new Date(post.data.time.created).toLocaleDateString()}</span>
        <span>•</span>
        <span>{rt.text}</span>
      </div>
      <div class="prose dark:prose-invert max-w-none">
        <Content />
      </div>
      <div class="mt-12">
        <TableOfContents headings={headings} client:visible />
        <ShareButtons url={Astro.url.href} title={post.data.title} client:idle />
      </div>
    </div>
  </article>
</BaseLayout>
```

### Verification

- Each post renders with TOC, Share, reading time, syntax highlighting
- SEO metadata reflects frontmatter

### Expected output

Functional MDX post pages

### Rollback

Remove dynamic route to isolate build issues

---

## Phase 17 — Setup testing framework (Vitest, Playwright)

### Objective

Add unit and e2e testing.

### Files

- `vitest.config.ts`
- `tests/unit/reading-time.test.ts`
- `playwright.config.ts`
- `tests/e2e/navigation.spec.ts`

### Commands

```bash
bun add -D vitest happy-dom @vitest/ui
bun add -D @playwright/test
bunx playwright install
```

### Example `vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts"],
  },
});
```

### Example `reading-time.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { readingTime } from "@/lib/reading-time";

describe("readingTime", () => {
  it("returns at least 1 minute for short text", () => {
    const result = readingTime("Hello world");
    expect(result.minutes).toBeGreaterThanOrEqual(1);
  });

  it("calculates reading time for longer content", () => {
    const longText = "word ".repeat(500);
    const result = readingTime(longText);
    expect(result.minutes).toBeGreaterThan(1);
  });
});
```

### Example `playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "bunx --bun astro dev",
    port: 4321,
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:4321",
  },
  testDir: "./tests/e2e",
});
```

### Example `navigation.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("homepage loads correctly", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
});

test("can navigate to blog", async ({ page }) => {
  await page.goto("/");
  await page.click('a[href="/blog"]');
  await expect(page).toHaveURL("/blog");
});
```

### Verification

- `bun run test` (unit tests pass)
- `bun run test:e2e` (e2e tests pass)

### Expected output

Green unit and e2e tests

### Rollback

Remove test configs

---

## Phase 18 — Configure code quality tools (ESLint, Prettier, Husky)

### Objective

Enforce formatting and linting.

### Files

- `eslint.config.mjs`
- `.prettierrc`
- `.prettierignore`
- `.husky/pre-commit`
- `.lintstagedrc.json`

### Commands

```bash
bun add -D eslint eslint-plugin-astro eslint-plugin-react typescript-eslint
bun add -D prettier prettier-plugin-astro prettier-plugin-tailwindcss
bun add -D husky lint-staged
bunx husky init
```

### Example `eslint.config.mjs`

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
```

### Example `.prettierrc`

```json
{
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ],
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5"
}
```

### Example `.lintstagedrc.json`

```json
{
  "*.{js,jsx,ts,tsx,astro}": ["prettier --write", "eslint --fix"],
  "*.{md,mdx,json,yml,yaml}": ["prettier --write"]
}
```

### Example `.husky/pre-commit`

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bunx --bun lint-staged
```

### Verification

- `bun run lint` passes
- `bun run format` passes
- Pre-commit hook runs on staged files

### Expected output

Clean lint/format baseline

### Rollback

Remove tool configs and hooks

---

## Phase 19 — Final testing and optimization

### Objective

Ensure no errors and optimize before deploy.

### Commands

```bash
bunx astro check
bun run typecheck
bun run build
bun run preview
```

### Verification

- No TypeScript or Astro check errors
- Build successful
- Preview site functions correctly

### Expected output

Production-ready build in `dist/`

### Rollback

Fix regressions; revert last commits if necessary

---

## Phase 20 — Deployment preparation

### Objective

Prepare and document deployment to static hosting.

### Actions

1. Choose hosting (Netlify, Cloudflare Pages, GitHub Pages, Vercel)
2. Document CI steps:
   - `bun install`
   - `bun run build`
   - Publish `./dist`

### Example Netlify config (`netlify.toml`)

```toml
[build]
  command = "bun install && bun run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Verification

Deployed site is accessible and matches local

### Expected output

Site live with parity features

### Rollback

Roll back to previous deployment

---

## Verification gates (must pass before proceeding)

After Phases **2, 4, 6, 8, 10, 16, 17, 19**:

- Run `bunx astro check`
- Run `bun run build`
- Ensure **zero errors**

Manual QA after Phase 16:

- Verify MDX features (TOC, code highlighting, reading time, SEO)
- Test all navigation links
- Verify dark mode toggle
- Test responsive design

---

## Troubleshooting

### Tailwind not applied

- Ensure `src/styles/tailwind.css` is imported once in BaseLayout.astro
- Confirm PostCSS config exists
- Check dependency versions

### MDX build errors

- Check frontmatter validity against zod schema
- Confirm MDX plugins in `astro.config.mjs`
- Verify all required frontmatter fields are present

### Headings/TOC mismatch

- Verify `rehype-slug` and `rehype-autolink-headings` plugins
- Ensure `const { Content, headings } = await post.render();` in blog route

### Hydration warnings

- Add unique `key` props where needed
- Ensure islands don't access `window` during SSR
- Use appropriate client directives

### Dark mode FOUC

- Inline theme script must precede rendered content
- Hydrate ThemeToggler with `client:load`
- Verify localStorage access in script

### E2E flakiness

- Use `reuseExistingServer: true` in Playwright config
- Add `await page.waitForLoadState('networkidle')` where needed
- Increase timeouts if necessary

### Build performance

- Review bundle sizes with `bun run build --verbose`
- Check for large dependencies
- Consider code splitting for large islands

---

## See also

- **[MIGRATION_OVERVIEW.md](./MIGRATION_OVERVIEW.md)** - High-level migration overview
- **[ASTRO_ARCHITECTURE.md](./ASTRO_ARCHITECTURE.md)** - Target architecture and technical decisions
