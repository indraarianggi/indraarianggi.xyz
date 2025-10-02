# MIGRATION_OVERVIEW.md

This document gives a high-level overview of migrating the existing Next.js 15 static-export site to Astro with React islands, Bun package manager, and Astro's default dev server port.

## See also

- **[ASTRO_ARCHITECTURE.md](./ASTRO_ARCHITECTURE.md)** - Target architecture and technical decisions
- **[MIGRATION_PLAN.md](./MIGRATION_PLAN.md)** - 20-phase step-by-step migration plan

---

## 1) Project summary (current stack, key features)

### Current stack (from WARP.md)

- **Framework**: Next.js 15 (App Router, React Server Components, output: "export")
- **Language**: TypeScript (strict)
- **UI**: Tailwind CSS v4, shadcn/ui (Radix UI), Lucide icons
- **Blog**: MDX-based, frontmatter-driven, custom processing (gray-matter, rehype/remark)
- **Features**: SSG fully static, MDX blog posts, reading time calculation, TOC, code syntax highlighting, SEO metadata
- **Package manager**: npm (with bun.lock present)
- **Dev server port**: 3002 (Next.js)

### Key features

- MDX blog system (frontmatter, content at `src/contents/posts/*.mdx`)
- Reading time algorithm with per-content weighting
- SEO: `generateMetadata` from frontmatter
- Dark mode with theme provider and toggler
- Syntax highlighting (rehype-pretty-code + Shiki)
- Table of contents from headings
- Social sharing buttons
- Static export to `./out`

---

## 2) Migration goals and requirements

### Goals

- Move to Astro (static site), maintain or improve current UX and performance
- Keep interactive pieces as React islands; convert static components to Astro
- Preserve all blog features (MDX, SSG, SEO, dark mode, syntax highlighting, reading time, TOC, sharing)
- Include an Experience page in the new site
- Use Bun as the package manager
- Use Astro's default dev server port (4321)
- Add test coverage: Vitest (unit) + Playwright (e2e)
- Provide robust lint/format hooks (ESLint, Prettier, Husky)
- Establish a clear migration plan with zero-error checkpoints

### Non-goals

- SSR at request time (Astro project will be statically generated)
- Maintaining Next.js-specific RSC patterns

---

## 3) Current architecture overview

### High-level

- `next@15` App Router with static export (`output: "export"`)
- Pages under `src/app/`, MDX content under `src/contents/posts/`
- Dynamic routes for blog via `generateStaticParams()`
- Infrastructure for SEO per post, reading time, syntax highlighting, TOC, social sharing

### File structure (abridged)

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    about/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
  components/
    ui/                     # shadcn components
      badge.tsx
      button.tsx
      sonner.tsx
    copy-button.tsx
    custom-image.tsx
    footer.tsx
    mdx-component.tsx
    navigation.tsx
    post-card.tsx
    share-buttons.tsx
    table-of-contents.tsx
    theme-provider.tsx
    theme-toggler.tsx
  contents/
    author.ts
    menu.ts
    posts/*.mdx
  lib/
    mdx.ts
    reading-time.ts
    utils.ts
  types/
    post.ts
public/
```

---

## 4) Pages inventory

- **Home**: `/`
- **About**: `/about`
- **Experience**: `/experience` (to be added in Astro)
- **Blog listing**: `/blog`
- **Blog post**: `/blog/[slug]`

---

## 5) Components inventory

### Primary components

- **Layout**: Root layout (theme provider, global styles)
- **Navigation** (React, interactive)
- **Footer** (static)
- **PostCard** (mostly static)
- **UI components** (shadcn/ui: Button, Badge, etc.) — mostly static
- **MDX components**: renderers for code blocks, images, links (some static, some enhanced by plugins)
- **CopyButton** (interactive)
- **CustomImage** (static)
- **TableOfContents** (interactive)
- **ShareButtons** (interactive)
- **ThemeProvider/ThemeToggler** (interactive + early theme script)

---

## 6) Features to preserve

- MDX blog content with frontmatter
- Static site generation (SSG)
- SEO: per-page metadata
- Dark mode (system preference + toggler)
- Syntax highlighting
- Reading time calculation
- TOC from headings
- Social sharing buttons

---

## 7) Technical specifications (dependencies, tooling, configuration)

### Target stack

- **Astro 4** (static generation, Vite under the hood)
- **React islands** via `@astrojs/react` for interactivity
- **TypeScript** strict mode
- **Bun** as package manager (scripts use `bun`, not `npm`)
- **Tailwind CSS v4** + PostCSS
- **MDX integration**: `@astrojs/mdx` with rehype/remark plugins
- **Content collections** for blog posts (`astro:content` + zod schema validation)
- **Testing**: Vitest (unit), Playwright (e2e)
- **Code quality**: ESLint (with eslint-plugin-astro), Prettier (with prettier-plugin-astro, prettier-plugin-tailwindcss), Husky + lint-staged
- **Dev server port**: Astro default 4321

### Planned dependency ranges (minimums; pin exact in lockfile)

- `astro`: ^4.12.0
- `@astrojs/react`: ^3.5.0
- `@astrojs/mdx`: ^3.1.0
- `typescript`: ^5.5.0
- `tailwindcss`: ^4.0.0
- `postcss`: ^8.4.0
- `autoprefixer`: ^10.4.0
- `remark-gfm`: ^3.0.0
- `rehype-slug`: ^6.0.0
- `rehype-autolink-headings`: ^7.0.0
- `rehype-pretty-code`: ^0.13.0
- `zod`: ^3.23.0
- `eslint`, `eslint-plugin-astro`, `eslint-plugin-react`, `eslint-config-prettier`
- `prettier`, `prettier-plugin-astro`, `prettier-plugin-tailwindcss`
- `vitest`: ^1.6.0
- `@playwright/test`: ^1.45.0
- `husky`: ^9.0.0
- `lint-staged`: ^15.0.0

**Note**: Use `bun add {pkg}@latest` if you prefer freshest versions; lockfile will capture exacts.

---

## 8) Component classification (static vs interactive)

### Static → convert to Astro components

- Footer
- PostCard (Card)
- Badge, Button (shadcn/ui variants as needed)
- CustomImage (migrate to `astro:assets` or keep simple img)
- Layout wrappers (BaseLayout, BlogLayout)
- MDX render wrappers that do not require runtime interactivity

### Interactive → keep as React islands

- Navigation (if it has interactive behavior, menus)
- ThemeToggler (React, but initial theme class set by inline script)
- TableOfContents (collapsible, scrollspy)
- ShareButtons (web share API, copying URLs)
- CopyButton

### Alignment to requirements

- Use Bun (not npm)
- Astro default port (4321)
- Experience page included
- Testing: Vitest + Playwright
- Zero-error checkpoints enforced in MIGRATION_PLAN.md

---

## See also

- **[ASTRO_ARCHITECTURE.md](./ASTRO_ARCHITECTURE.md)** - Target architecture and technical decisions
- **[MIGRATION_PLAN.md](./MIGRATION_PLAN.md)** - 20-phase step-by-step migration plan
