# Swiss Poster + Analog Notebook Portfolio Design

## Purpose

Build a personal portfolio for Indra Arianggi with three equal goals: support hiring conversations, build a public body of work, and make collaboration easy. The voice is curious, grounded, and honest. The site presents a software engineer who learns through making, writing, reading, and examining the questions that emerge from the work.

The approved homepage statement is:

> Making software. Learning as I go.

The site must not describe Indra as a junior or make inflated claims about expertise, results, or impact.

## Information architecture

Primary navigation contains only:

- Home
- Work
- Blog

Secondary destinations remain discoverable from the homepage and footer:

- About
- Read

Routes:

```text
/
/work
/work/[slug]
/blog
/blog/[slug]
/about
/read
/404
```

An RSS feed and sitemap support discovery but do not appear as primary navigation destinations.

## Content model

Three Markdown content collections provide type-safe source content:

- `work`: title, summary, role, status, dates, technologies, links, optional image, featured state, draft state, and long-form case study
- `blog`: title, description, publication and update dates, topics, optional image, draft state, and article body
- `books`: title, author, reading state, dates, optional cover, optional personal note, and draft state

Read is a personal reading record, not a software-engineering recommendation list. Books may cover any subject. Source data retains four states: Reading now, Finished, Paused, and Want to read. The interface presents three shelves: Reading now, Finished, and a shared Paused / Want to read shelf. Entries in the shared shelf keep their individual status label. The page has no ratings, rankings, affiliate links, or forced reviews.

## Visual direction

The visual language is **Swiss Poster + Analog Notebook**: bold editorial posters provide the primary structure, while restrained field-note details keep the work personal and unfinished in a deliberate way.

Core tokens:

- Paper: `#F1EFE8`
- White paper: `#FFFDF8`
- Ink: `#0A0A0A`
- Muted ink: `#6B6861`
- Structural rule: `#B9B4AA`
- Signal red: `#E33122`
- Soft red field: `#F5D8D2`

Typography:

- Archivo Black for poster headlines, section numbers, and forceful labels
- Archivo for navigation, index rows, controls, and supporting interface copy
- Literata for long-form reading, reflective statements, and editorial contrast
- IBM Plex Mono for dates, states, technical metadata, and field-note labels

The system uses sharp geometry, oversized type, black and red fields, asymmetric splits, visible rules, and generous negative space. It avoids rounded card grids, gradients, glass effects, heavy shadows, decorative dots, and ornamental motion. Long-form content stays near 65 to 70 characters per line.

The signature secondary device is an analog field note: a white or soft-red paper fragment with a thin ink outline, mono reference label, and short Literata observation. It remains subordinate to the main hierarchy. On mobile, notes stay in normal document flow.

## Shared shell

The desktop masthead uses the name on the left and Home, Work, and Blog on the right. The active route is a compact signal-red block. The mobile masthead preserves the same three destinations in a 62-pixel-high strip.

The black footer contains Indra's name plus secondary links. About and Read remain secondary. Email and GitHub appear only when factual values are configured.

## Page composition

### Home

The page opens as a split poster: a black headline field paired with a signal-red statement panel. The headline is “Making software. Learning as I go.” Selected work follows as an interactive index with a large visual stage on desktop and explicit inline summaries on mobile. Recent writing and the reading desk share the next desktop band. The page closes with “Still learning. Still making.” and links to About and Read.

### Work

The desktop page is an interactive index rather than a ledger table. A vertical project list controls a large adjacent visual stage; the selected row uses a soft-red field and red rail. The experience must not rely on hover: keyboard focus, selection state, and ordinary links expose the same information. Mobile replaces the stage interaction with inline black visual panels and readable metadata.

Project detail begins with an oversized title and signal-red metadata panel. The body follows Context, Problem, Decisions, Implementation, What changed, and What I learned. A black system diagram and analog note provide visual punctuation. The site never invents metrics.

### Blog

The index is labeled “Blog / Field Notes.” The newest article receives a black poster panel with a large question mark and an adjacent Literata headline on desktop. Older articles form ruled chronological rows. Mobile stacks the lead poster and archive without adding filters until the archive is large enough to justify them.

Article detail uses the calmest reading treatment. Literata carries the article title and prose; signal red is reserved for metadata and current section state. The body width remains stable when the desktop contents rail collapses.

### About

About is a short learning poster rather than a résumé rendered as a page. The primary statement is “I learn by making things.” Supporting copy may state that Indra is a software engineer who learns through projects, questions, writing, and books from many fields. Three analog principles reinforce the current practice: make the question smaller, keep failure visible, and write down what changed. Unknown biography, employers, timelines, and tools are omitted rather than invented.

### Read

The page is labeled “Read / Curiosity.” It presents books as editorial shelves, not recommendation cards. Reading now uses a signal-red shelf marker; Finished and Paused / Want to read use black shelf markers. Each entry shows title, author, and its individual state. Cover art is optional and secondary.

### 404

The error page is a misprint poster: an oversized black `404` paired with a signal-red message panel. It provides direct links to Home, Work, and Blog without fictional diagnostics.

## Table of contents

Project and article detail pages support a generated table of contents when at least two meaningful `h2` or `h3` headings exist.

Desktop:

- A 280-pixel expanded rail sits beside a stable reading measure.
- The rail stays sticky while respecting the masthead and footer.
- The current section uses a soft-red field plus red text or rule.
- The Hide control collapses the rail into a 64-pixel black control.
- Collapsing the rail does not change the body measure or reflow body text.

Mobile:

- A safe-area-aware 48 by 48 pixel red icon button appears after the introduction leaves the viewport.
- The button opens a bottom dialog no taller than 70 dynamic viewport height units.
- The dialog shows the complete heading hierarchy, current section, 48 by 48 close control, backdrop, and visible keyboard focus.
- Focus moves into the dialog on open and returns to the trigger on close.
- Escape, backdrop interaction, and section selection close it.

## Motion

Motion stays functional and infrequent:

- Link and active-state color changes: 150ms ease-out
- Page opacity transition: 180ms ease
- Analog note entrance, when used: opacity plus at most 8 pixels of translation
- Mobile contents dialog: opacity plus 8 pixels of upward translation over 220ms
- Button press feedback: `scale(0.96)` where it does not disturb reading

Hover effects only apply to fine pointers. Reduced-motion preferences remove spatial translation and smooth scrolling while retaining necessary state changes. No implementation uses `transition: all`.

## Accessibility and responsive requirements

- Semantic landmarks and one logical `h1` per page
- Skip navigation and visible focus rings
- WCAG AA text contrast
- Descriptive image alt text, with empty alt text for decorative images
- Complete keyboard operation for navigation, interactive work index, TOC, and dialog
- No information conveyed by motion or color alone
- At least 44-pixel touch targets; the mobile TOC controls are 48 pixels
- Readable layouts at 200 percent browser zoom
- Stable mobile viewport and safe-area handling
- Balanced heading wraps and pretty body-text wraps
- Tabular numerals for dates and changing metadata

## Content and error states

Production builds exclude drafts. Invalid frontmatter fails type checking or the build. Empty collections render direct, intentional copy rather than fabricated projects, articles, or books. An empty shelf is omitted. Design-only canvas records are layout references and never ship.

The two Unsplash photographs in the Home and Work frames are design references. Production uses user-provided optimized assets with factual alt text, or removes the image field without collapsing the surrounding hierarchy.

## Approved design artifact

The editable source is `portfolio-swiss-poster.pen`. The earlier `portfolio.pen` Technical Broadsheet exploration remains preserved but is not an implementation source.

`DESIGN_REPORT.md` inventories the 22 current root frames and nine reusable components. Desktop frames are 1440 pixels wide; mobile frames are 390 pixels wide. The latest Pencil audit found 22 ready root frames, no placeholders, no pending generated images, and no clipping or overflow problems.
