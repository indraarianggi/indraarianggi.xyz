# Indra Arianggi: Portfolio

Personal portfolio built as a static Astro site: a calm, typographic digital garden with a sidebar shell, one signature sentence on the home page, image-led project tiles, year-grouped indexes, a book cover grid, and a career timeline. Work, articles, and books are authored as Markdown, validated by type-safe content collections, and rendered into static HTML with no client framework. The approved design is `docs/plans/2026-10-20-redesign-v3-design.md`.

## Stack

| Concern | Choice |
|---|---|
| Framework | Astro 7 (`output: 'static'`) |
| Language | TypeScript, `astro/tsconfigs/strict` |
| Content | Markdown via Astro content collections (`glob` loader, Zod schemas) |
| Styling | Native CSS with custom properties in `src/styles/global.css` |
| Images | `sharp` behind `astro:assets`, WebP output with responsive widths |
| Type | Newsreader, Geist, Geist Mono (Fontsource variable packages) |
| Icons | `astro-icon` with `@iconify-json/ph` and `@iconify-json/simple-icons` |
| Feeds | `@astrojs/rss`, `@astrojs/sitemap` |
| Navigation | Static pages with cross-document View Transitions; small vanilla scripts for the TOC, Contents sheet, timeline, and code copy |
| Tests | Vitest |
| Package manager | pnpm 11 |

Astro 7 requires Node `>=22.12.0`. The pinned package manager is `pnpm@11.20.0`.

## Getting started

```bash
pnpm install
pnpm dev          # dev server on http://localhost:4321
```

| Script | Command | Purpose |
|---|---|---|
| `pnpm dev` | `astro dev` | Local dev server with hot reload |
| `pnpm check` | `astro check` | Type and template diagnostics |
| `pnpm test` | `vitest run` | Unit tests for content, date, timeline, cover, and nav helpers |
| `pnpm test:watch` | `vitest` | Watch mode |
| `pnpm build` | `pnpm check && astro build` | Type-check, then generate `dist/` |
| `pnpm preview` | `astro preview` | Serve the built output |

`pnpm-workspace.yaml` grants the `esbuild` build script the approval pnpm 11 requires.

## Environment

`SITE_URL` sets the canonical origin used by canonical links, Open Graph URLs, `sitemap-index.xml`, `robots.txt`, and the RSS feed. `.env.example` records the variable name.

```bash
SITE_URL=https://your-production-domain.example pnpm build
```

When `SITE_URL` is unset, the site falls back to `http://localhost:4321`.

`astro.config.mjs` reads `process.env.SITE_URL`, so the value must be exported in the shell or set by the CI environment. Astro loads `.env` files into `import.meta.env` through Vite and does not populate `process.env` before evaluating the config, so a `.env` file alone does not change the canonical origin. Verified by building with only `.env` present: canonical URLs stayed at `http://localhost:4321`.

## Project structure

```
.
├── astro.config.mjs          # site URL, sitemap, astro-icon include list, Shiki theme
├── src/
│   ├── config/site.ts        # name, nav, contact links, experience, toolkit
│   ├── content.config.ts     # work/blog/books schemas
│   ├── content/              # Markdown content (work/, blog/, books/)
│   ├── assets/               # avatar
│   ├── components/           # Sidebar, SiteFooter, PageHeader, IndexList, WorkTile, BookCard,
│   │                         #   CareerTimeline, Toolkit, TocList, ContentsSheet, EmptyState, SeoHead
│   ├── layouts/              # BaseLayout (sidebar shell + SEO), DetailLayout (header, TOC rail, Contents sheet)
│   ├── lib/content.ts        # draft filtering, grouping, bento order, captions, book shelves
│   ├── lib/dates.ts          # 02 Sep / 02 Sep 2026 / Sep 2026 formatters
│   ├── lib/reading-time.ts   # words-per-minute reading time
│   ├── lib/time-ago.ts       # "last tended" age and newest-date helper
│   ├── lib/nav.ts            # active-section matching
│   ├── lib/timeline.ts       # career timeline geometry (desktop and vertical)
│   ├── lib/cover.ts          # fallback book cover colours and contrast
│   ├── lib/toc.ts            # h2/h3 heading tree for the contents rail
│   ├── pages/                # routes, RSS, robots
│   ├── icons/                # local astro-icon source directory
│   └── styles/               # font imports and the design system
├── tests/                    # Vitest specs for src/lib
├── public/favicon.svg
├── .github/workflows/        # deploy.yml: test, build, push to the home server
├── deploy/                   # deployment runbook and restricted deploy-key example
├── DESIGN_REPORT.md          # earlier (v2) design specification
├── docs/plans/               # design and implementation plans
├── portfolio-v3.pen          # approved v3 design canvas
├── portfolio-swiss-poster.pen # earlier v2 design artifact
└── portfolio.pen             # preserved Technical Broadsheet exploration
```

`.pen` files are encrypted. Open them through Pencil MCP tools, never with a text reader or grep.

## Routes

| Route | Surface |
|---|---|
| `/` | Signature sentence, "last tended" line, selected work bento, year-grouped writing and reading index |
| `/work/` | Work index: featured tile plus two-up bento with summaries |
| `/work/<id>/` | Project detail: meta table, showcase image, prose, TOC rail (Contents sheet below 1100px) |
| `/blog/` | Writing index grouped by year |
| `/blog/<id>/` | Article detail: meta line, prose, TOC rail |
| `/about/` | Intro, career timeline, and toolkit |
| `/read/` | Cover grid: Reading now, Finished, Paused / Want to read |
| `/404` | Centred numeral and one line; the sidebar is the way out |
| `/rss.xml` | Blog feed, empty but valid when no articles are published |
| `/robots.txt` | Crawl policy pointing at the sitemap |
| `/sitemap-index.xml` | Generated by `@astrojs/sitemap` |

Detail routes render the contents rail only when the document has at least two `h2` sections. The rail hangs in the right gutter and does not change the reading measure.

## Writing content

Add a Markdown file to the matching collection folder. The file path minus the `.md` extension becomes the URL id, so `src/content/work/example-project.md` is published at `/work/example-project/`. Files whose name starts with `_` are ignored by the loader pattern.

Drafts (`draft: true`) render in `astro dev` and are excluded from `pnpm build` output and from the production detail routes.

Collections are ordered by `date` descending. Books are then grouped in the order reading, finished, paused, want to read; within a group, entries sort by ascending `order`, and entries without `order` come last. Paused and want to read share one visual shelf while each entry keeps its own status label.

### `work`

```yaml
---
title: Example project
summary: One line describing what the project is and why it exists.
role: Design and implementation
status: building        # building | shipped | paused | archived
date: 2026-09-01
endDate: 2026-11-30     # optional
stack: [TypeScript, Astro]
repository: https://example.com/repo   # optional
website: https://example.com           # optional
featured: true          # optional, surfaces on the homepage
draft: false            # optional
image: ./cover.png      # optional, colocated in this folder
imageAlt: Diagram of the project pipeline  # required when image is set
---
```

### `blog`

```yaml
---
title: Example note
description: One line summary used in listings, feeds, and metadata.
date: 2026-09-14
updatedDate: 2026-09-20   # optional
topics: [astro, css]
draft: false              # optional
image: ./header.png       # optional
imageAlt: Screenshot of the rendered archive  # required when image is set
---
```

### `books`

```yaml
---
title: Example book
author: Example Author
status: reading           # reading | finished | paused | want-to-read
date: 2026-09-01
startedDate: 2026-09-01   # optional
finishedDate: 2026-09-14  # optional
order: 1                  # optional, editorial order within the shelf
draft: false              # optional
cover: ./cover.png        # optional
coverAlt: Cover of Example book  # required when cover is set
---
```

Images are processed by the Astro image pipeline and must live beside the entry that references them. Set `imageAlt` (or `coverAlt` for books) whenever an image is present; the schema rejects entries that omit it.

### Markdown support

Rendered as expected: headings (`h2` and `h3` feed the contents rail), paragraphs, bold, italic, inline code, links, autolinks, blockquotes, horizontal rules, ordered and unordered lists including nesting, images referenced relatively, fenced code blocks with syntax highlighting, and GFM tables.

Not supported by the current processor:

- **Footnotes.** `[^1]` and `^[inline]` render as literal text.
- **Task lists.** `- [x]` renders as a disabled checkbox with no accessible name, which drops the detail page to a Lighthouse accessibility score of 92. Write the state in the text instead, as the sample entries do.

Both come from Astro 7 using Sätteri as the default Markdown processor. The legacy unified pipeline, which supports footnotes and would allow a rehype plugin to label task list checkboxes, needs `@astrojs/markdown-remark` installed first. Astro reports this explicitly if you add `remarkPlugins` or `rehypePlugins` to the config.

### Sample entries

The repository ships six placeholder entries so the layouts can be reviewed with real content: `atlas-index`, `beacon-monitor`, and `cairn-notes` under `work`, and `reading-code-slowly`, `keeping-a-field-log`, and `small-tools-that-stick` under `blog`. Each one says so at the top and bottom of its body. Replace them with real material before publishing, and the `books` collection ships five draft samples (`sample-*.md`, `draft: true`): they show in `pnpm dev` and never in production. Delete them before adding real books.

## Design system

Tokens live in `src/styles/global.css`; the design is `docs/plans/2026-10-20-redesign-v3-design.md` and the canvas `portfolio-v3.pen`.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#fbfbf9` | Page background |
| `--ink` | `#141414` | Text, section rules |
| `--muted` | `#6e6a62` | Secondary text (never lighter) |
| `--rule` | `#e7e5e0` | Row and sidebar hairlines |
| `--tile` | `#f0efea` | Fallback image slots |
| `--accent` | `#a4502f` | Rust: marks only what is active or current |

Type: Newsreader (`--font-serif`) for the voice and prose, Geist (`--font-ui`) for interface text, Geist Mono (`--font-mono`) for dates and labels.

Invariants:

- Light theme only. Animate only `opacity`, `transform`, and `background-size`; never `transition: all`. `prefers-reduced-motion` removes movement.
- The ink sweep (`.ink`) is the one hover and focus interaction; the wash hugs the text line, not the hit area. Hit targets stay at least 44px.
- Empty collections render an intentional empty state.
- Do not invent projects, employment history, metrics, articles, books, or contact details.

To use additional icons, add them to the `include` map in `astro.config.mjs`; `ph` icons are listed there and `simple-icons` are derived from `src/config/site.ts`.

## Verification

```bash
pnpm test     # unit tests for src/lib and the site data
pnpm check    # 0 errors, 0 warnings, 0 hints
pnpm build    # type-check plus static build of every route
```

The build prints an empty-collection notice for `src/content/books` only, since that collection has no entries yet. The notices for `work` and `blog` disappeared when the sample entries landed.

The built site was verified in a production preview at 1440px and 390px: zero console errors, zero failed requests, and zero horizontal overflow on every route, including the six detail pages. Lighthouse accessibility scored 100 on the home page, all three work detail pages, and a blog detail page, with no failing audits. Accessibility details worth preserving during edits:

- Normal-size red text fails WCAG AA on both paper (3.85:1) and ink (4.45:1), so small labels use `--ink` on light surfaces, `--surface` on ink fields, and `--ink-on-red` on red fields. Red remains for fields, rules, decorations, and qualifying large text.
- Code blocks use `github-light-high-contrast`, because the default `github-light` theme paints tokens such as `#e36209` at 3.48:1 on the code surface.
- The mobile masthead keeps the full name "Indra Arianggi" in the accessibility tree while showing the `IA` mark visually.
- The skip link targets `#main-content`, and `prefers-reduced-motion` disables smooth scrolling and animations.

Markdown config changes do not invalidate Astro's cached rendering of content. After editing `astro.config.mjs`, remove `.astro/` before building, or the previous output is reused and the change appears to have no effect.

## Deployment

`pnpm build` writes a static site to `dist/`. Any static host can serve it, as long as `SITE_URL` is set to the real origin so canonical URLs, the sitemap, `robots.txt`, and the feed are correct.

Production runs on a home server at `https://indraarianggi.xyz`. Every push to `main` triggers `.github/workflows/deploy.yml`, which tests and builds on a GitHub-hosted runner, then pushes `dist/` to the server through a Cloudflare Tunnel and verifies the live site. `deploy/README.md` documents what the server must provide, the required repository secrets, rollback, and troubleshooting.

## Documentation

- `docs/plans/2026-10-20-redesign-v3-design.md` and `-implementation.md` are the v3 design and its build plan. `DESIGN_REPORT.md` is the earlier v2 specification.
- `docs/plans/2026-09-20-portfolio-design.md` and `docs/plans/2026-09-20-portfolio-implementation.md` record the design decisions and the implementation tasks.
- `deploy/README.md` is the deployment runbook: server contract, GitHub secrets, deploy behavior, and rollback.
- `portfolio-v3.pen` is the implementation source of truth; `portfolio-swiss-poster.pen` and `portfolio.pen` are earlier explorations and not implementation inputs.
