# Cleanup Plan - Remove Next.js Files

## Files/Directories to Remove:

### 1. Next.js App Directory (Replaced by Astro pages)
- src/app/ (entire directory)

### 2. Old Next.js Components (Replaced by Astro/React)
- src/components/navigation.tsx (replaced by src/components/react/Navigation.tsx)
- src/components/theme-provider.tsx (replaced by src/components/react/ThemeProvider.tsx)
- src/components/theme-toggler.tsx (replaced by src/components/react/ThemeToggler.tsx)
- src/components/table-of-contents.tsx (replaced by src/components/react/TableOfContents.tsx)
- src/components/share-buttons.tsx (replaced by src/components/react/ShareButtons.tsx)
- src/components/footer.tsx (replaced by src/components/astro/Footer.astro)
- src/components/post-card.tsx (replaced by src/components/astro/PostCard.astro)
- src/components/mdx-component.tsx (replaced by src/components/MdxComponents.astro)
- src/components/custom-image.tsx (no longer needed)
- src/components/copy-button.tsx (not used in Astro version)
- src/components/no-posts.tsx (not used)

### 3. Old UI Components (Replaced by Astro or React versions)
- src/components/ui/badge.tsx (replaced by src/components/astro/ui/Badge.astro)
- src/components/ui/button.tsx (replaced by src/components/react/ui/Button.tsx)
- src/components/ui/card.tsx (not used)
- src/components/ui/dialog.tsx (not used)
- src/components/ui/input.tsx (not used)
- src/components/ui/skeleton.tsx (not used)
- src/components/ui/sonner.tsx (replaced by src/components/react/Toaster.tsx)

### 4. Next.js Config Files
- next.config.ts
- next-env.d.ts

### 5. Build Directories
- .next/
- out/

### 6. Old Content Structure
- src/contents/ (replaced by src/content/ for Astro content collections)
  - Keep author.ts and menu.ts but move to src/data/

### 7. Package Dependencies to Remove
- next
- @next/mdx
- @mdx-js/loader
- @mdx-js/react
- next-mdx-remote
- eslint-config-next

### 8. ESLint Config Updates
- Remove Next.js specific rules from eslint.config.mjs
- Update .eslintignore

## Files/Directories to Keep:
- src/data/ (author.ts, menu.ts)
- src/content/ (Astro content collections)
- src/components/astro/ (Astro components)
- src/components/react/ (React islands)
- All Astro config and pages
