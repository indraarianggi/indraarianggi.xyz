# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Quick Start

```bash
npm i
npm run dev  # http://localhost:3002
```

- Main site: http://localhost:3002
- Blog listing: http://localhost:3002/blog
- Individual posts: http://localhost:3002/blog/[slug]

## Essential Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on port 3002)
npm run dev

# Build static site for production
npm run build

# Linting
npm run lint

# Formatting
npm run format        # Check formatting
npm run format:fix    # Fix formatting issues

# Start production build
npm start
```

Package manager notes:

- This project uses `npm` and includes a `bun.lock` file (likely uses Bun for faster operations)
- Git hooks use `bun run lint-staged` for performance

## Architecture Overview

This is a **Next.js 15** project using the **App Router** with **static export** mode.

### Key Architectural Decisions

- **Static Site Generation (SSG)**: Configured with `output: "export"` to generate a fully static site in `/out`
- **App Router**: Uses Next.js 15's file-based routing under `src/app/`
- **React Server Components**: Default rendering model for server-side processing
- **MDX Blog System**: Frontmatter-driven blog posts with custom MDX processing
- **Static Export Limitations**: No server-side runtime at request time; all dynamic content must be pre-rendered

### Dynamic Routes & Static Generation

Blog posts use dynamic routing with static pre-generation:

- `src/app/blog/[slug]/page.tsx` implements `generateStaticParams()` to pre-render all blog post routes
- `generateMetadata()` creates SEO metadata from frontmatter
- Posts are loaded from `src/contents/posts/*.mdx` at build time

## Key Project Characteristics

### MDX Blog System

- **Content Location**: `src/contents/posts/*.mdx`
- **Frontmatter Processing**: Uses `gray-matter` for parsing YAML frontmatter
- **Reading Time**: Custom algorithm accounting for text, code blocks, and images
- **Components**: Table of Contents, Share Buttons, syntax highlighting

### Design System

- **Tailwind CSS**: Utility-first CSS framework with Tailwind CSS v4
- **shadcn/ui**: Component library with Radix UI primitives
- **Dark/Light Mode**: Theme provider with system preference detection
- **Icons**: Lucide React icon set

### TypeScript Configuration

- **Strict Mode**: Full TypeScript strictness enabled
- **Path Aliases**: `@/*` maps to `src/*`, `@/components`, `@/lib`, `@/contents`
- **Import Conventions**: Absolute imports using path aliases throughout

## File Structure

```
src/
  app/
    layout.tsx           # Root layout with theme provider
    page.tsx            # Homepage
    globals.css         # Tailwind CSS imports
    about/
      page.tsx
    blog/
      page.tsx          # Blog listing
      [slug]/
        page.tsx        # Dynamic blog post (generateStaticParams)
        loading.tsx     # Loading UI
  components/
    ui/                 # shadcn/ui components
      badge.tsx
      button.tsx
      sonner.tsx
    copy-button.tsx
    custom-image.tsx
    footer.tsx
    mdx-component.tsx   # MDX renderer with custom components
    navigation.tsx
    post-card.tsx
    share-buttons.tsx   # Social sharing
    table-of-contents.tsx
    theme-provider.tsx
    theme-toggler.tsx
  contents/
    author.ts           # Author information and skills
    posts/
      *.mdx            # Blog posts with frontmatter
  lib/
    mdx.ts              # MDX file processing, frontmatter parsing
    reading-time.ts     # Custom reading time calculation
    utils.ts           # Utility functions (cn, etc.)
  types/
    post.ts            # TypeScript types for blog posts
public/
  avatar.svg          # Author avatar
  # Static assets, images, favicons
out/                   # Generated static site (after build)
```

## Development Workflow

### Code Quality & Formatting

**Pre-commit hooks** (Husky + lint-staged):

- Formats code with Prettier (includes Tailwind class sorting)
- Lints with ESLint and auto-fixes issues
- Runs on staged files for performance

**Manual commands**:

```bash
npm run lint          # ESLint check
npm run format        # Prettier check
npm run format:fix    # Prettier write
```

### Lint-staged Configuration

Located in `.lintstagedrc.json`:

- `*.{js,jsx,ts,tsx}`: Prettier format → ESLint fix → ESLint check
- `*.{json,md,yml}`: Prettier format

### CI/CD Recommendations

For continuous integration, run:

```bash
npm run lint
npm run format
npm run build
```

## Key Dependencies

### Core Framework

- **next@15.3.3**: App Router, React Server Components, static export
- **react@19**: Latest React with concurrent features
- **typescript@5**: Type system with strict configuration

### Styling & UI

- **tailwindcss@4**: Latest Tailwind CSS version
- **@tailwindcss/typography**: Prose styling for blog content
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Intelligent Tailwind class merging
- **@radix-ui/react-\***: Accessible UI primitives (dialog, slot, visually-hidden)
- **lucide-react**: Icon library (ArrowLeft, Calendar, Clock, etc.)

### MDX Processing

- **@next/mdx**: Next.js MDX integration
- **@mdx-js/react**: MDX React renderer
- **next-mdx-remote**: Remote MDX processing
- **gray-matter**: Frontmatter parsing
- **rehype-pretty-code**: Syntax highlighting with Shiki
- **rehype-slug**: Heading anchor generation
- **remark-gfm**: GitHub Flavored Markdown support

### Development Tools

- **eslint-config-next**: Next.js ESLint rules
- **prettier + prettier-plugin-tailwindcss**: Code formatting with Tailwind class sorting
- **husky + lint-staged**: Git hooks for code quality

## Blog System Architecture

### Content Structure

**Blog posts** live in `src/contents/posts/*.mdx` with this frontmatter structure:

```yaml
---
title: "Post Title"
excerpt: "Short description for SEO and previews"
tags: ["nextjs", "mdx", "tutorial"]
coverImage: "/blog/my-post/cover.jpg"
author:
  name: "Author Name"
  occupation: "Job Title"
  avatar: "/images/author.jpg"
time:
  created: "2025-01-15T10:00:00Z"
  updated: "2025-01-18T10:00:00Z"
published: true
---
```

### Build-Time Processing

1. **MDX Loading** (`src/lib/mdx.ts`):

   - Reads `.mdx` files from posts directory
   - Parses frontmatter with `gray-matter`
   - Calculates reading time using custom algorithm
   - Returns typed `Post[]` array

2. **Reading Time Calculation** (`src/lib/reading-time.ts`):

   - 225 WPM for regular text
   - 100 WPM for code blocks
   - 10 seconds per image
   - Minimum 1 minute read time

3. **Static Generation**:
   - `generateStaticParams()` creates routes for all published posts
   - `generateMetadata()` sets SEO metadata from frontmatter

### Rendering Components

- **MDX Component**: Custom components for enhanced markdown (code blocks, images, etc.)
- **Table of Contents**: Auto-generated from headings with anchor links
- **Share Buttons**: Social media sharing (Twitter, LinkedIn, etc.)
- **Post Metadata**: Author info, publish date, reading time, tags

### Content Authoring Workflow

1. Create new `.mdx` file in `src/contents/posts/`
2. Add required frontmatter (see template above)
3. Place images in `public/blog/[post-slug]/`
4. Run `npm run dev` and visit `/blog/[slug]`
5. Commit (pre-commit hooks will format and lint)

## Static Export & Deployment

### Build Configuration

The project is configured for static export in `next.config.ts`:

```typescript
const nextConfig = {
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  pageExtensions: ["md", "mdx", "tsx", "ts", "jsx", "js"],
};
```

### Build Process

```bash
npm run build           # Generates static site in ./out
npx serve out          # Preview locally
```

### Deployment Options

- **GitHub Pages/Netlify/Cloudflare Pages**: Deploy `./out` directory
- **Vercel**: Can deploy static export or remove `output: "export"` for SSR
- **Custom CDN**: Upload `./out` contents to any static hosting

### Static Export Caveats

- No server-side runtime per request
- All dynamic routes must be pre-rendered via `generateStaticParams`
- Images work without optimization (suitable for static deployment)
- API routes not supported in export mode

## Troubleshooting

### Common Issues

**MDX Build Errors**:

- Ensure frontmatter YAML is valid
- Check for JSX import conflicts in MDX files
- Verify all required frontmatter fields are present

**Images Not Loading After Export**:

- Images should use absolute paths starting with `/`
- Place images in `public/` directory
- For external images, ensure CORS allows loading

**Table of Contents Missing**:

- Verify MDX content has proper heading structure (`# ## ###`)
- Check that rehype-slug plugin is configured for anchor generation

**Formatting/Linting Issues**:

- Run `npm run format:fix` to auto-fix formatting
- Check `.prettierignore` and `.eslintrc` configuration
- Ensure Prettier Tailwind plugin is sorting classes correctly

**Development Server Issues**:

- Port 3002 is used instead of default 3000
- Clear `.next` cache: `rm -rf .next && npm run dev`

### Performance Tips

- Use `next/image` component for optimized images
- Implement proper loading states for async components
- Keep MDX bundle sizes reasonable (split large posts)
- Consider implementing pagination for blog listing

## Theme & Styling

### Tailwind CSS Configuration

- Uses Tailwind CSS v4 with PostCSS integration
- CSS variables for theme colors (supports dark/light mode)
- Typography plugin for blog post content styling
- Custom gradient utilities defined in CSS

### Theme Provider Setup

- `next-themes` for dark/light mode management
- System preference detection
- Smooth transitions between themes
- Theme toggle component in navigation

### Component Patterns

- Uses `cn()` utility for conditional class merging
- shadcn/ui component variants with `class-variance-authority`
- Consistent spacing and typography scale
- Responsive design patterns throughout
