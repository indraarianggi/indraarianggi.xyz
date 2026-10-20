# Redesign v3: Digital Garden Design

Status: approved design, ready for implementation planning.
Canvas source: `portfolio-v3.pen` (see [Canvas index](#canvas-index)).
Replaces: the "title sequence" motion-graphics design (`f821a19`, `6081a86`) and supersedes `2026-09-20-portfolio-design.md`.

## Purpose

Redesign indraarianggi.xyz as a clean, minimalist **personal home / digital garden** that still leaves a strong impression. Work, writing, and reading are peers; the site is not a hiring pitch. The impression comes from typography, space, and a few precise interactions rather than decoration or motion.

## Principles

1. **One voice, set large.** The homepage sentence carries the site's personality.
2. **Colour is a state.** The page rests in ink on near-white. Rust appears only for something active or current.
3. **Encode real data.** Visual elements (timeline bars, tiles, bento slots) derive from content, never from ornament.
4. **Nothing hidden.** Navigation is always visible; no hamburger menus.
5. **No invented content.** Placeholder material is labelled as such until replaced.

## Information architecture

| Label | Route | Source |
|---|---|---|
| Home | `/` | all collections |
| Work | `/work/`, `/work/[slug]` | `work` |
| Writing | `/blog/`, `/blog/[slug]` | `blog` |
| Reading | `/read/` | `books` |
| About | `/about/` | `src/config/site.ts` (new `experience` and `toolkit` arrays) |
| 404 | `/404` | — |

Labels change ("Blog" → Writing, "Read" → Reading) but **URLs stay**, preserving existing links, RSS, and search results. Primary and secondary navigation merge into one list of five peers. Contact links: **GitHub** (`github.com/indraarianggi`), **LinkedIn** (`linkedin.com/in/indraarianggi`), and **RSS**. No email or phone number is published; no CV download for now.

## Design tokens

```css
:root {
  --bg:          #FBFBF9;  /* near-white, warm; comfortable for long reading */
  --ink:         #141414;  /* text; ~18:1 on --bg */
  --muted:       #6E6A62;  /* secondary text, metadata */
  --rule:        #E7E5E0;  /* hairlines, dividers */
  --tile:        #F0EFEA;  /* fallback tiles and covers */
  --accent:      #C2410C;  /* deep orange — text, lines, outlines, markers, focus rings */
  --accent-soft: #F9B98A;  /* pastel orange — fills behind ink text */
  --accent-wash: #F9B98AB3;/* ~70% pastel orange — link sweep background */

  --font-serif: "Newsreader", serif;  /* voice, titles, prose */
  --font-ui:    "Geist", sans-serif;  /* navigation, UI, descriptions */
  --font-mono:  "Geist Mono", monospace; /* dates, labels, metadata */

  --ease-out:  cubic-bezier(.22, .7, .28, 1);
}
```

Replace `@fontsource-variable/archivo`, `@fontsource-variable/literata`, and `@fontsource/ibm-plex-mono` with Newsreader, Geist, and Geist Mono.

### Type scale

| Role | Font | Size / line-height |
|---|---|---|
| Home sentence | Newsreader | 40 / 1.18, −0.8 tracking (mobile 30) |
| Page title, 404 line | Newsreader | 40 (mobile 32) |
| H2 / H3 in prose | Newsreader | 26 / 20 (mobile 23 / 19) |
| Prose | Newsreader | 18 / 1.65 (mobile 17) |
| List titles | Newsreader | 18–20 |
| UI, nav, descriptions | Geist | 12–14 |
| Metadata, labels | Geist Mono | 10–12 |

Avoid mid sizes (24–32 px) outside titles; the gap between 40 and 18 is what makes the page feel confident.

## Layout shell

**Desktop (≥ 1100 px)** — a three-track grid: `grid-template-columns: 1fr minmax(0, 720px) 1fr`.

- The **content column** (720 px) is centred on the page axis.
- The **sidebar** lives in the left gutter, aligned to its right edge with a 56 px gap to content. It is sticky, full viewport height, and vertically centred: portrait (56 px rounded square, radius 10), name (Newsreader 16), role (Geist 12), nav (Geist 13), contact group separated by a hairline (Geist 12).
- The **right gutter** stays empty except on detail pages, where it holds the sticky table of contents, also vertically centred.
- Prose is capped at **620 px** (~70 characters); images, code, and bento span the full 720.

**Tablet (768–1099 px)** — single centred column (max 720, side padding). The sidebar becomes a one-row header: identity left, nav right. TOC moves to the floating Contents pill.

**Mobile (< 768 px)** — header becomes two rows: identity (30 px avatar + name), then the always-visible nav row (`Home · Work · Writing · Reading · About`). Contact links move to a page footer. Content padding 20 px.

All three are one `<aside>` re-styled by media queries; there is no second navigation component.

## Pages

### Home

1. **Signature sentence**, four lines: *I build to understand. / I write to remember. / I read because useful ideas / rarely stay inside one field.* The verbs **build**, **write**, **read** are underlined links to `/work/`, `/blog/`, `/read/`.
2. **"Last tended" line** (mono, muted): time since the most recent content update · current book (status `reading`). Omit the reading half when no book is in progress.
3. **Selected work — bento.** Image-led tiles: a rounded (16 px) showcase image with a caption below (serif title left, mono `status · year` right). Desktop: one large featured tile (416 wide) left, two stacked tiles right. Mobile: featured full width, then two-up.
4. **Index** of writing and reading only (work appears in the bento), grouped by year: serif title, mono kind and date, hairline rows.

### Work (`/work/`)

Header ("Work" + "Things I've built, or am still building."), then a bento of all projects: the `featured: true` project full width (400 px image), remaining projects two-up, repeating. Captions add the one-line `summary`.

**Fallback tile** (project without `image`): warm-grey `--tile` slot, the title in large Newsreader (72 px full width, 44 px half width) bottom-left; caption unchanged.

### Detail layout (Work and Writing)

One `DetailLayout` with optional slots.

- `← Work` / `← Writing` back link, title (40), summary or description (Newsreader 20, muted).
- **Work:** metadata table (mono keys: Role, Status, Stack, Links). **Writing:** one mono line (`date · updated · N min read · topics`).
- **1 px `--rule` divider** between the header block and content.
- Work only: 720 px showcase image.
- Prose (620 max), code blocks (`#F2F1ED`, radius 12, language label + Copy).
- **TOC** when ≥ 2 headings. Desktop: right gutter, "On this page", H3s indented, current section in rust. Tablet and mobile: floating **Contents** pill (ink, bottom-right, appears after the header scrolls away) opening a bottom sheet (`<dialog>`) with the same outline, current section in rust with a marker.

Reading time replaces `src/lib/timecode.ts` with a small `readingTime()` helper.

### Writing (`/blog/`)

Header ("Writing" + intro line). Year-grouped ruled list: serif title (20), Geist description (14, muted), mono date right.

### Reading (`/read/`)

**Cover grid.** Sections: Reading now, Finished, Paused / Want to read. Four columns of 2:3 covers (162 × 243) on desktop, two on mobile; title, author, and mono date or state below. Books without `cover` get a **typographic fallback cover**: a muted colour block with title and author set in the cover, text colour chosen by luminance.

### About

1. "Hi, I'm Indra." (40) + "A software engineer in Yogyakarta, Indonesia, building web applications for 7+ years." (18, muted).
2. Two first-person paragraphs condensed from the CV.
3. **Experience — career timeline.** Bars proportional to tenure on a 2018 → now axis; FishGo (part-time) on a second lane with a lighter outlined style; current role (ADW Consulting) in rust with a rust "now" line. Selecting a bar shows a detail panel (rust left rule, dates, role, company, description). Desktop: horizontal, 80 px per year. Mobile: vertical, newest on top, 56 px per year, details beside each bar.
4. **Toolkit.** Rows grouped as Languages, Frontend, Backend. Each tool is a bare brand icon (Simple Icons) plus name, **monochrome ink at rest**; hover or focus reveals the real brand colour. Laravel is outlined in rust (currently learning). Zustand has no Simple Icon and uses a serif fallback (`Zu`). Mobile: five tiles per row, group label above.

Education, CV download, and an "Elsewhere" block are intentionally omitted.

### 404

Content vertically centred in the viewport: a 300 px Newsreader **"404"** in pale `#ECEAE4` (`aria-hidden`), then the `<h1>` line **"You've wandered past the edge of the garden."** No links; the sidebar is the way out.

## Interaction and motion

Motion level: **functional plus one signature moment.** Animate only `opacity` and `transform` (or `background-size` for wrapping links); never `transition: all`.

| Element | Behaviour |
|---|---|
| **Home sentence** | Every visit: each line fades in and rises 6 px, 420 ms `--ease-out`, 90 ms stagger (~0.8 s total). |
| **Timeline bars** | Grow from start date to full length on first view, 420 ms, 60 ms stagger oldest → newest; "now" bar last. Driven by the same `--start` / `--end` custom properties as the layout. |
| **Page navigation** | Cross-document View Transitions crossfade (~180 ms); the sidebar has its own `view-transition-name` so it stays still. |
| **Links and nav — ink sweep** | `--accent-wash` grows left → right (scaleX or `background-size` 0 → 100 %, origin left), 240 ms `--ease-out`; shrinks back in 160 ms. Rotated −0.6° with uneven radius for a highlighter feel; text stays ink. Active nav item keeps the wash drawn. Applies to sentence verbs, nav, index row titles (on row hover), and prose links (which also keep a thin underline at rest). Single-line items use a `::before` scale; wrapping links use `background-size` with `box-decoration-break: clone`. |
| Toolkit icons | Ink → brand colour, 200 ms; `@media (hover: hover)` for hover, `:focus-visible` and tap for touch. |
| Bento images | Scale 1.02 on hover, 240 ms. |
| Contents pill | Appears after the header leaves the viewport (fade + 8 px rise, 200 ms); press scale 0.96. |
| Contents sheet | Slides up 260 ms decelerate; backdrop fades 200 ms; closes 200 ms accelerate. |
| Timeline panel | Content crossfade 160 ms, no movement. |

**Reduced motion:** no spatial movement; the sentence and bars appear immediately, the ink sweep appears without sweeping, state changes remain.

## Accessibility

- One `<h1>` per page; semantic landmarks; skip link; visible focus rings.
- Text contrast meets WCAG AA on `--bg`: ink 17.8:1, muted 5.2:1, deep orange 5.0:1; ink on the wash 12.6:1 and on the pastel bar 10.8:1. No text lighter than `--muted` (hints and captions included); the pale 404 numeral is decorative and `aria-hidden`.
- Timeline is an `<ol>` of roles; bars are `<button>`s with `aria-controls` on the detail panel.
- Contents sheet uses `<dialog>` with `showModal()`; focus returns to the pill on close.
- Decorative numerals and stand-in visuals are `aria-hidden`; images keep the existing `imageAlt` / `coverAlt` requirement.
- Touch targets ≥ 44 px; layouts readable at 200 % zoom.

## Content and data changes

- `work.image`, `books.cover`: stay optional; fallbacks are designed for both.
- New `site.ts` data: `contact` (GitHub, LinkedIn, RSS), `experience` (`company, role, start, end, type: 'full-time' | 'part-time', summary`), `toolkit` (`name, icon, brandHex, group, learning?`).
- New dependency: `@iconify-json/simple-icons` (alongside the existing `astro-icon`).
- Remove film-sequence components: `Clapper`, `SceneSlate`, `SceneWipe`, `TimelineHud`, `KineticText`, `WorkReel`, `WorkDeck`, `UpNext`, `ReadingDesk`, and `src/lib/timecode.ts` (with its test).

## Open items

- **Real imagery:** the three bento images (`generated*.png`) are AI stand-ins and the current work covers are off-brand posters. Replace with real project screenshots sharing one art direction (soft neutral backdrop, natural light).
- **Placeholder content:** all three projects and articles are placeholders; the `books` collection is empty (Reading uses sample titles in the canvas).
- **Portrait:** `public/avatar.png` is the illustrated placeholder supplied during design.

## Canvas index

Row 1 — final desktop pages (y = 0): Home `h9LzvX`, Work `ViFvY`, Work detail `jTli2`, Writing `AxLK8`, Writing detail `z6PKO`, Reading `jlntv`, About `G9BpM`, 404 `I5hoK`.

Row 2 — states, components, mobile (y = 2400): Home verb hover `s4T28q`, Fallback tile `ckl6K`, Home mobile `bYuF5`, Work detail mobile `Al4ch`, Contents sheet open `M7VSdT`, About mobile `l9G1D`, Link & nav ink sweep `kLLsQ`.

Row 3 — explorations, not chosen (y = 3840): Typography options `RX2uH`, Accent options `fKjtP`, Reading option A `v4cRf`, Home mobile option A `HcXUx`, 404 options A / C / D (`EvO7F`, `Aui0w`, `ag7cz`), and the original empty frame `bi8Au`.
