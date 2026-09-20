# Swiss Poster Portfolio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the approved Swiss Poster + Analog Notebook portfolio as a fast, accessible Astro site with Markdown-managed work, articles, and books.

**Architecture:** Astro generates static routes from three type-safe content collections. Shared Astro components implement the editorial shell, while one small client-side table-of-contents controller supplies active-section tracking, desktop collapse, and the mobile dialog. Native CSS carries the visual system; no frontend framework or CMS is added.

**Tech Stack:** pnpm 11, Astro, TypeScript strict mode, Markdown content collections, native CSS, Astro ClientRouter, Astro Image, Vitest, astro-icon with Phosphor icons, local Fontsource packages, `@astrojs/sitemap`, and `@astrojs/rss`.

**Design sources:** `portfolio-swiss-poster.pen`, `DESIGN_REPORT.md`, and `docs/plans/2026-09-20-portfolio-design.md`. Access `.pen` files only through Pencil MCP. The preserved `portfolio.pen` Technical Broadsheet exploration is not an implementation source.

---

## Implementation invariants

- Primary navigation contains Home, Work, and Blog only.
- About and Read appear on Home and in the footer, never in the primary navigation.
- The homepage headline is exactly: “Making software. Learning as I go.”
- Do not describe Indra as junior.
- Do not invent projects, employment history, outcomes, metrics, contact details, articles, books, or biographical facts.
- Empty content collections must render intentional empty states.
- Read may contain books from any subject. Source data keeps Reading now, Finished, Paused, and Want to read distinct; the interface combines Paused and Want to read into one visual shelf while preserving each entry’s status label.
- Project and article detail pages use a desktop sticky right-side TOC and a mobile fixed icon button with a compact dialog.
- Collapsing the desktop TOC must not change the body reading measure.
- Light theme only. One signal-red accent. No gradients, glass effects, heavy shadows, decorative dots, rounded card grids, or oversized pills.
- Keep JavaScript limited to ClientRouter and TOC behavior.
- Every hover effect is gated by pointer capability. Every spatial animation has a reduced-motion alternative.
- No visible em dash characters in page copy.

## Reference frame map

| Surface | Desktop frame | Mobile frame |
|---|---:|---:|
| Design tokens | `O2Q7U0` | n/a |
| Components | `jsbeK` | n/a |
| Home | `kr6xD` | `e5Qi2M` |
| Work | `WfOoz` | `f2q4pQ` |
| Project detail | `vwXt4`, `QaoJb` | `PJMVE`, `FUWAx` |
| Blog | `J7lu7` | `G5E8SC` |
| Article detail | `fSlBZ`, `Zpwr9` | `lN8RY`, `Djrw3` |
| About | `uSH0W` | `AIOeh` |
| Read | `N2A23L` | `AdDXv` |
| 404 | `I0VC54` | `q2sIUc` |

Before implementing a surface, use Pencil `TakeScreenshot` on its frame IDs. Match hierarchy, proportions, spacing, type scale, rules, and interaction states. Design-only sample records in the canvas are layout references, not publishable content.

---

### Task 1: Bootstrap the Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/env.d.ts`

**Step 1: Initialize source control**

Run:

```bash
git init
```

Expected: an empty Git repository is initialized without modifying either `.pen` artifact or `DESIGN_REPORT.md`.

**Step 2: Create the minimal package manifest**

Create `package.json`:

```json
{
  "name": "indra-arianggi-portfolio",
  "private": true,
  "packageManager": "pnpm@11.20.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "pnpm check && astro build",
    "preview": "astro preview"
  }
}
```

**Step 3: Install production dependencies**

Run:

```bash
pnpm add astro@latest @astrojs/rss @astrojs/sitemap astro-icon @iconify-json/ph @fontsource-variable/archivo @fontsource/archivo-black @fontsource-variable/literata @fontsource/ibm-plex-mono
```

Expected: dependencies are recorded in `package.json` and `pnpm-lock.yaml` is created. Use `@fontsource/archivo-black` for the poster face; do not substitute a synthetic bold Archivo weight.

**Step 4: Install development dependencies**

Run:

```bash
pnpm add -D @astrojs/check typescript vitest
```

Expected: `astro check` and Vitest are locally available.

**Step 5: Add strict Astro configuration**

Create `astro.config.mjs`:

```js
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Create `src/env.d.ts`:

```ts
/// <reference types="astro/client" />
```

Create `.env.example`:

```dotenv
SITE_URL=https://your-production-domain.example
```

Create `.gitignore` with `node_modules`, `.astro`, `dist`, `.env`, and OS/editor artifacts. Do not ignore either `.pen` artifact.

**Step 6: Verify the scaffold**

Run:

```bash
pnpm check
```

Expected: Astro completes without diagnostics.

**Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs tsconfig.json .gitignore .env.example src/env.d.ts
git commit -m "chore: bootstrap Astro portfolio"
```

---

### Task 2: Implement and test pure content helpers

**Files:**
- Create: `src/lib/content.ts`
- Create: `src/lib/toc.ts`
- Create: `tests/content.test.ts`
- Create: `tests/toc.test.ts`

These tests defend observable ordering, draft visibility, book grouping, and heading hierarchy. Do not test field copying or implementation details.

**Step 1: Write failing content helper tests**

Create `tests/content.test.ts` covering:

```ts
import { describe, expect, it } from 'vitest';
import { groupBooks, visibleNewestFirst } from '../src/lib/content';

describe('visibleNewestFirst', () => {
  it('removes drafts in production and orders newest entries first', () => {
    const entries = [
      { id: 'old', data: { draft: false, date: new Date('2025-01-01') } },
      { id: 'draft', data: { draft: true, date: new Date('2027-01-01') } },
      { id: 'new', data: { draft: false, date: new Date('2026-01-01') } },
    ];

    expect(visibleNewestFirst(entries, true).map(({ id }) => id)).toEqual(['new', 'old']);
  });
});

describe('groupBooks', () => {
  it('returns only populated states in the intended editorial order', () => {
    const books = [
      { id: 'later', data: { status: 'want-to-read' as const, order: 2 } },
      { id: 'now', data: { status: 'reading' as const, order: 1 } },
    ];

    expect(groupBooks(books).map(({ status }) => status)).toEqual(['reading', 'want-to-read']);
  });
});
```

Use a small generic entry type in the test. Do not import `astro:content` into Vitest.

**Step 2: Write failing TOC tests**

Create `tests/toc.test.ts` covering:

- `h2` headings become root items.
- `h3` headings nest beneath the nearest `h2`.
- `h1`, `h4`, and deeper headings are ignored.
- A leading `h3` is safely omitted rather than producing malformed navigation.

Representative assertion:

```ts
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
```

**Step 3: Run tests and confirm the intended failure**

Run:

```bash
pnpm test
```

Expected: failure because `src/lib/content.ts` and `src/lib/toc.ts` do not exist.

**Step 4: Implement minimal helpers**

Create `src/lib/content.ts` with:

```ts
export type BookStatus = 'reading' | 'finished' | 'paused' | 'want-to-read';

const bookStateOrder: BookStatus[] = ['reading', 'finished', 'paused', 'want-to-read'];

export function visibleNewestFirst<
  T extends { data: { draft: boolean; date: Date } },
>(entries: T[], production: boolean): T[] {
  return entries
    .filter(({ data }) => !production || !data.draft)
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function groupBooks<
  T extends { data: { status: BookStatus; order?: number } },
>(books: T[]) {
  return bookStateOrder.flatMap((status) => {
    const entries = books
      .filter(({ data }) => data.status === status)
      .toSorted((a, b) => (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER));

    return entries.length ? [{ status, entries }] : [];
  });
}
```

Create `src/lib/toc.ts` with exported `MarkdownHeading`, `TocItem`, and `buildTocTree()` types/functions. Build the tree in one pass. Only accept depths 2 and 3.

**Step 5: Run tests**

```bash
pnpm test
```

Expected: all helper tests pass.

**Step 6: Commit**

```bash
git add src/lib tests
git commit -m "test: define content and toc behavior"
```

---

### Task 3: Define type-safe Markdown collections

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/work/.gitkeep`
- Create: `src/content/blog/.gitkeep`
- Create: `src/content/books/.gitkeep`

**Step 1: Define collection loaders and schemas**

Use current Astro Content Layer APIs:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const imageFields = (image: () => z.ZodTypeAny) => ({
  image: image().optional(),
  imageAlt: z.string().trim().min(1).optional(),
});

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/[^_]*.md' }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    role: z.string().trim().min(1),
    status: z.enum(['building', 'shipped', 'paused', 'archived']),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    stack: z.array(z.string().trim().min(1)).default([]),
    repository: z.string().url().optional(),
    website: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    ...imageFields(image),
  }).refine((data) => !data.image || Boolean(data.imageAlt), {
    message: 'imageAlt is required when image is present',
    path: ['imageAlt'],
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.md' }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    topics: z.array(z.string().trim().min(1)).default([]),
    draft: z.boolean().default(false),
    ...imageFields(image),
  }).refine((data) => !data.image || Boolean(data.imageAlt), {
    message: 'imageAlt is required when image is present',
    path: ['imageAlt'],
  }),
});

const books = defineCollection({
  loader: glob({ base: './src/content/books', pattern: '**/[^_]*.md' }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    author: z.string().trim().min(1),
    status: z.enum(['reading', 'finished', 'paused', 'want-to-read']),
    date: z.coerce.date(),
    startedDate: z.coerce.date().optional(),
    finishedDate: z.coerce.date().optional(),
    order: z.number().int().nonnegative().optional(),
    draft: z.boolean().default(false),
    cover: image().optional(),
    coverAlt: z.string().trim().min(1).optional(),
  }).refine((data) => !data.cover || Boolean(data.coverAlt), {
    message: 'coverAlt is required when cover is present',
    path: ['coverAlt'],
  }),
});

export const collections = { work, blog, books };
```

If the installed Astro Zod type rejects the reusable `imageFields` helper, inline the two fields in each schema. Do not weaken image validation.

**Step 2: Synchronize Astro types**

Run:

```bash
pnpm exec astro sync
pnpm check
```

Expected: generated collection types exist and all schemas compile with empty content directories.

**Step 3: Commit**

```bash
git add src/content.config.ts src/content
git commit -m "feat: add portfolio content collections"
```

---

### Task 4: Build the global visual system and base layout

**Files:**
- Create: `src/styles/fonts.css`
- Create: `src/styles/global.css`
- Create: `src/config/site.ts`
- Create: `src/components/SeoHead.astro`
- Create: `src/layouts/BaseLayout.astro`

**Step 1: Load local fonts**

In `src/styles/fonts.css`, import only required weights:

```css
@import '@fontsource-variable/archivo';
@import '@fontsource/archivo-black/400.css';
@import '@fontsource-variable/literata';
@import '@fontsource/ibm-plex-mono/400.css';
@import '@fontsource/ibm-plex-mono/500.css';
```

**Step 2: Define design tokens and global rules**

Implement `src/styles/global.css` from frame `O2Q7U0`:

```css
:root {
  --paper: #f1efe8;
  --surface: #fffdf8;
  --ink: #0a0a0a;
  --muted: #6b6861;
  --rule: #b9b4aa;
  --red: #e33122;
  --red-soft: #f5d8d2;
  --focus-ring: #e33122;
  --font-poster: 'Archivo Black', sans-serif;
  --font-sans: 'Archivo Variable', sans-serif;
  --font-serif: 'Literata Variable', serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --measure: 68ch;
  --page-gutter: clamp(1rem, 4vw, 4rem);
  color-scheme: light;
}

html {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  scroll-padding-top: 7rem;
  text-size-adjust: 100%;
}

body {
  margin: 0;
  min-width: 20rem;
  background: var(--paper);
}

h1,
h2,
h3,
p {
  margin-block-start: 0;
}

h1,
h2,
h3 {
  text-wrap: balance;
}

p,
li {
  text-wrap: pretty;
}

button,
a {
  touch-action: manipulation;
}

button {
  font: inherit;
}

:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

Continue with the exact grid, type scale, prose, rule, image-outline, skip-link, utility, and responsive styles required by the 22 design frames. Do not add a second styling system.

**Step 3: Centralize factual site configuration**

Create `src/config/site.ts` with only known information:

```ts
export const site = {
  name: 'Indra Arianggi',
  title: 'Indra Arianggi | Software Engineer',
  description: 'Making software. Learning as I go.',
  headline: 'Making software. Learning as I go.',
  primaryNav: [
    { href: '/', label: 'Home' },
    { href: '/work/', label: 'Work' },
    { href: '/blog/', label: 'Blog' },
  ],
  secondaryNav: [
    { href: '/about/', label: 'About' },
    { href: '/read/', label: 'Read' },
  ],
  socialLinks: [],
} as const;
```

Do not infer an email address or social URL from local account data.

**Step 4: Implement metadata and the base document**

`SeoHead.astro` accepts title, description, canonical path, optional image, and article metadata. It renders canonical, Open Graph, and Twitter metadata without fake social handles.

`BaseLayout.astro` must include:

- `lang="en"`
- viewport with `viewport-fit=cover` and `interactive-widget=resizes-content`
- light theme color matching `--paper`
- `<ClientRouter />` from `astro:transitions`
- skip link
- `<slot />`
- the shared header and footer slots or components added in Task 5
- page transition CSS limited to opacity at 180ms

**Step 5: Check the base system**

Run:

```bash
pnpm check
```

Expected: no diagnostics.

**Step 6: Commit**

```bash
git add src/styles src/config src/components/SeoHead.astro src/layouts/BaseLayout.astro
git commit -m "feat: establish broadsheet design system"
```

---

### Task 5: Implement the shared editorial shell

**Files:**
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/AnalogNote.astro`
- Create: `src/components/EmptyState.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Inspect component references**

Use Pencil to capture `jsbeK`, then inspect both `kr6xD` and `e5Qi2M`. Do not export HTML from Pencil; implement semantic Astro markup.

**Step 2: Build the masthead**

`SiteHeader.astro` requirements:

- Name as a home link on the left
- Home, Work, Blog only on the right
- Active page exposed with `aria-current="page"`
- One desktop line, no wrapped navigation at 1440px
- Compact mobile arrangement matching `eUc7c`
- 44px touch targets without visually oversized controls
- Hover underline only inside `@media (hover: hover) and (pointer: fine)`

**Step 3: Build the footer**

Include About and Read, plus social links only when `site.socialLinks` is non-empty. Do not render empty link groups or invented contact data.

**Step 4: Build analog notes and empty states**

`AnalogNote.astro` takes a slot and optional mono label. It renders a restrained paper fragment with an ink outline and stays in normal document flow on mobile. Do not rotate live text enough to impair reading.

`EmptyState.astro` takes a concise message and renders text plus a rule, not a card. Use these initial messages:

- Work: “Nothing published here yet. I’m still building.”
- Blog: “No articles yet. Notes are being shaped.”
- Read: “No books recorded here yet.”

**Step 5: Integrate shell into BaseLayout**

Place header before `<main id="main-content">` and footer after it. Ensure the skip link lands on `main-content` after ClientRouter navigation.

**Step 6: Verify**

Run:

```bash
pnpm check
pnpm build
```

Expected: static output builds with shared shell and no content entries.

**Step 7: Commit**

```bash
git add src/components src/layouts/BaseLayout.astro
git commit -m "feat: add shared editorial shell"
```

---

### Task 6: Build Home, Work, and Blog indexes

**Files:**
- Create: `src/components/ProjectFeature.astro`
- Create: `src/components/ProjectIndexRow.astro`
- Create: `src/components/ArticleLead.astro`
- Create: `src/components/ArticleRow.astro`
- Create: `src/components/ReadingDesk.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/work/index.astro`
- Create: `src/pages/blog/index.astro`

**Step 1: Inspect the six index frames**

Use Pencil screenshots for `kr6xD`, `e5Qi2M`, `WfOoz`, `f2q4pQ`, `J7lu7`, and `G5E8SC`.

**Step 2: Implement Home**

Query all three collections with `getCollection()`, pass them through production draft filtering, and select:

- Up to three featured work entries
- Up to four recent articles
- One Reading now book and up to two recently finished books

When a group is empty, render its intentional empty state rather than design-only sample content. Home must retain its full editorial hierarchy even when collections are empty.

**Step 3: Implement Work index**

Render an ordered project index with title, summary, role, date/year, stack, and status. On desktop, selection or focus updates the adjacent visual stage; ordinary links remain the primary action. Do not make information hover-only. Mobile renders the visual treatment inline. Status must have a text label and must not depend on color. Use Astro `<Image>` for optional user-provided images and pass validated alt text.

**Step 4: Implement Blog index**

Render the newest entry as the lead only when one exists. Render remaining entries chronologically. Do not add filtering, search, or tag-cloud UI.

**Step 5: Verify responsive output**

Run the dev server and inspect `/`, `/work/`, and `/blog/` at 1440px and 390px. With empty collections, confirm no collapsed grids, orphaned headings, or empty containers.

**Step 6: Run static checks**

```bash
pnpm check
pnpm build
```

Expected: all three routes appear in `dist`.

**Step 7: Commit**

```bash
git add src/components src/pages/index.astro src/pages/work src/pages/blog/index.astro
git commit -m "feat: build portfolio index pages"
```

---

### Task 7: Build detail routes and the responsive table of contents

**Files:**
- Create: `src/components/TableOfContents.astro`
- Create: `src/layouts/DetailLayout.astro`
- Create: `src/pages/work/[...id].astro`
- Create: `src/pages/blog/[...id].astro`
- Modify: `src/styles/global.css`

**Step 1: Inspect all eight detail-state frames**

Use Pencil screenshots for `vwXt4`, `QaoJb`, `PJMVE`, `FUWAx`, `fSlBZ`, `Zpwr9`, `lN8RY`, and `Djrw3`.

**Step 2: Implement static detail routes**

Both dynamic routes must:

```astro
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('blog');
  return entries
    .filter(({ data }) => !import.meta.env.PROD || !data.draft)
    .map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content, headings } = await render(entry);
---
```

Use the corresponding collection in each file. Pass `headings` through `buildTocTree()`. Render the TOC only when there are at least two `h2` root items or a total of two meaningful items.

**Step 3: Implement DetailLayout**

The layout exposes named slots for metadata, hero image, analog note, body, and after-content links. Its desktop grid permanently reserves the TOC area, so body width remains stable when the rail is collapsed.

The prose system must style headings, paragraphs, lists, blockquotes, code, tables, links, and images without generic boxed callouts. Project detail preserves the approved section sequence through author-provided Markdown headings; do not synthesize missing sections.

**Step 4: Implement desktop TOC markup**

`TableOfContents.astro` renders:

- `<nav aria-label="Table of contents">`
- Nested `h2` and `h3` links from the pure TOC tree
- Active signal-red rule, text, and soft-red selection field
- Hide button with `aria-expanded` and at least a 40px desktop hit area
- Collapsed 64px Contents control
- Stable rail width in both states

**Step 5: Implement mobile TOC dialog**

Use `astro-icon` with a Phosphor list icon. Use native `<dialog>` and a fixed 48px icon button. Requirements:

- Trigger appears only after the introduction sentinel leaves the viewport
- `showModal()` opens the dialog
- Close button, Escape, backdrop click, and link selection close it
- Focus returns to the trigger
- Dialog content scrolls independently and remains below `70dvh`
- Bottom and right offsets include `env(safe-area-inset-*)`
- Background scrolling is locked only while the modal is open

**Step 6: Implement active heading tracking**

Use one `IntersectionObserver` over the rendered heading IDs. Update all desktop and mobile links with matching fragments. Set `aria-current="location"` on the active link and expose the same state through a data attribute for styling.

Initialize on `astro:page-load`. Guard initialization with a component data flag and disconnect observers before a swapped page is discarded. Do not use `window.addEventListener('scroll')`.

**Step 7: Implement motion and reduced motion**

- Desktop rail controls: 150ms opacity/color transition
- Mobile dialog: 220ms opacity plus 8px translation
- No bouncing or springs
- Under reduced motion, remove translation and smooth scrolling
- Do not use `transition: all`

**Step 8: Run checks**

```bash
pnpm test
pnpm check
pnpm build
```

Expected: helper tests pass, both route templates type-check, and the empty production build succeeds.

**Step 9: Commit**

```bash
git add src/components/TableOfContents.astro src/layouts/DetailLayout.astro src/pages/work src/pages/blog src/styles/global.css
git commit -m "feat: add long-form detail layouts and toc"
```

---

### Task 8: Build About, Read, 404, RSS, and robots

**Files:**
- Create: `src/components/BookEntry.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/read.astro`
- Create: `src/pages/404.astro`
- Create: `src/pages/rss.xml.ts`
- Create: `src/pages/robots.txt.ts`

**Step 1: Inspect secondary frames**

Use Pencil screenshots for `uSH0W`, `AIOeh`, `N2A23L`, `AdDXv`, `I0VC54`, and `q2sIUc`.

**Step 2: Implement About without invented biography**

Use only established copy:

- Indra is a software engineer.
- He learns by making things and reflecting through projects, questions, writing, and books from many fields.
- This site records work in progress and the lessons kept near the work.

Do not copy sample timelines, employers, tools, interests, or contact channels from the design-only canvas data. Render contact links only when configured later.

**Step 3: Implement Read**

Fetch visible books and retain the four source statuses. Render Reading now and Finished as their own shelves, then render Paused and Want to read inside one shared visual shelf while preserving the individual status label on every entry. Render optional Markdown notes with `render(book)`. Book cover images remain secondary and require validated alt text.

**Step 4: Implement 404**

Match the erratum composition but use direct copy. Provide ordinary links to Home, Work, and Blog. Do not use diagnostic fiction, fake error IDs, or version strings.

**Step 5: Implement RSS**

Use `@astrojs/rss` and visible blog entries. Titles, descriptions, dates, and `/blog/${entry.id}/` links come from collection data. Empty feeds must still produce valid XML.

**Step 6: Implement robots response**

Return plain text using `Astro.site` for the sitemap URL. Allow normal crawling and avoid hard-coded production domains.

**Step 7: Verify**

```bash
pnpm check
pnpm build
```

Confirm the build contains `/about/`, `/read/`, `/404.html`, `/rss.xml`, `/robots.txt`, and `/sitemap-index.xml` or the integration’s current equivalent.

**Step 8: Commit**

```bash
git add src/components/BookEntry.astro src/pages/about.astro src/pages/read.astro src/pages/404.astro src/pages/rss.xml.ts src/pages/robots.txt.ts
git commit -m "feat: complete secondary portfolio pages"
```

---

### Task 9: Exercise detail behavior with temporary content

**Files:**
- Temporarily create: `src/content/work/smoke-project.md`
- Temporarily create: `src/content/blog/smoke-article.md`
- Temporarily create: `src/content/books/smoke-book.md`
- Remove all three before commit

This is a smoke-test fixture, not publishable portfolio content.

**Step 1: Add a temporary project**

Create a valid project entry whose body contains all six approved `h2` sections and at least two `h3` subsections. Mark every title and paragraph clearly as smoke-test content. Do not add fake metrics or external links.

**Step 2: Add a temporary article**

Create a valid article with at least four `h2` headings, two nested `h3` headings, a long heading that wraps in the TOC, a list, a code block, a blockquote, and an inline link.

**Step 3: Add a temporary book**

Create one Reading now entry with a short note and no cover. This verifies the optional image path.

**Step 4: Launch the actual site**

Run:

```bash
pnpm dev -- --host 0.0.0.0
```

Use the managed browser, not a source inspection, for the remaining steps.

**Step 5: Verify desktop at 1440px**

Exercise:

- Home, Work, Blog, About, Read, and 404
- Project and article detail routes
- TOC active-section updates while scrolling
- Hide and show controls
- Stable body width before and after collapse
- Fragment URLs after selecting headings
- Sticky rail stops before the footer
- Visible focus states through keyboard-only navigation

Capture representative screenshots and compare them with the matching Pencil frames.

**Step 6: Verify mobile at 390px**

Exercise:

- Every route without horizontal overflow
- Primary navigation on one compact line or approved mobile arrangement
- TOC trigger remains 44px and respects safe-area offsets
- Trigger appears after the introduction
- Dialog opens, scrolls, closes with Escape and backdrop, closes after selection, and restores focus
- No stuck hover state
- Read groups and book rows remain legible

**Step 7: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`. Confirm spatial translation and smooth scrolling are removed while focus, active section, and dialog state remain clear.

**Step 8: Verify browser diagnostics**

Confirm no console errors, uncaught promise rejections, failed asset requests, layout shifts caused by local fonts, or accessibility-name failures on icon buttons.

**Step 9: Remove temporary content**

Delete all three smoke Markdown files. Rebuild and confirm the intentional empty states return.

```bash
pnpm build
```

Expected: production output contains no smoke content and still builds successfully.

**Step 10: Commit real fixes only**

Commit any source corrections found by the smoke test. Never commit the smoke Markdown files.

```bash
git add src
if ! git diff --cached --quiet; then git commit -m "fix: polish responsive portfolio behavior"; fi
```

---

### Task 10: Final verification and delivery

**Files:**
- Modify only files implicated by verification failures
- Do not modify either `.pen` artifact unless implementation exposes a genuine design ambiguity that the user approves

**Step 1: Run the focused verification suite**

```bash
pnpm test
pnpm check
SITE_URL=https://portfolio.invalid pnpm build
```

Expected:

- Vitest reports all behavior tests passing.
- Astro reports zero diagnostics.
- Static build completes with every route, feed, robots response, and sitemap.

`.invalid` is reserved for non-production verification. Deployment must provide the real `SITE_URL`.

**Step 2: Inspect generated output**

Confirm no design-only sample titles or fake records appear in `dist`. Confirm drafts are absent. Confirm canonical URLs use the supplied `SITE_URL`.

**Step 3: Perform the final browser smoke pass**

Run `pnpm preview -- --host 0.0.0.0` and inspect the built site, not the dev server. Recheck the primary navigation, empty states, 404, RSS response, desktop and mobile layout, keyboard navigation, and console.

Detail-page interaction was already exercised with temporary content in Task 9. Do not reintroduce fixtures into the final build.

**Step 4: Run the design pre-flight**

Verify:

- One light theme and one signal-red accent
- No em dashes in visible copy
- No gradients, glass, heavy shadows, or decorative dots
- No CTA wraps on desktop
- No false hover behavior on touch
- No `transition: all`
- No horizontal overflow at 390px
- Long-form measure remains 65 to 70 characters
- TOC collapse does not reflow the body
- All icon-only controls have accessible names
- All touch targets are at least 44px; mobile TOC controls are 48px
- Reduced motion keeps state changes legible

**Step 5: Commit verification fixes**

```bash
git add .
git commit -m "chore: verify portfolio release"
```

If there are no changes after verification, do not create an empty commit.

## Completion criteria

Implementation is complete only when:

- Every approved route and responsive state exists.
- Empty collections produce intentional pages without fake content.
- The 22-frame Swiss Poster + Analog Notebook system has been translated consistently at 1440px and 390px.
- Project and article detail pages pass the full desktop and mobile TOC interaction smoke test.
- Tests, Astro diagnostics, and the production build pass.
- The final built site has no console errors or horizontal overflow.
- Temporary smoke content has been removed.
- Production deployment has a real `SITE_URL` and user-provided contact/social links before those links are displayed.
