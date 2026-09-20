# Swiss Poster + Analog Notebook Design Specification

**Artifact**: `/Users/indraarianggi/Documents/Projects/personal-website/portfolio-swiss-poster.pen`  
**Preserved exploration**: `/Users/indraarianggi/Documents/Projects/personal-website/portfolio.pen`  
**Target**: Indra Arianggi portfolio design system and responsive screen definitions  
**Design environment**: pen.dev / Pencil MCP  
**Theme**: Light theme only, Swiss Poster + Analog Notebook  
**Date**: September 2026

---

## 1. Executive summary

The approved artifact is a 22-frame responsive portfolio system built from oversized Swiss poster typography, asymmetric black and signal-red fields, and restrained analog field notes. The primary palette is warm paper (`#F1EFE8`), white paper (`#FFFDF8`), near-black ink (`#0A0A0A`), muted ink (`#6B6861`), structural gray (`#B9B4AA`), signal red (`#E33122`), and soft red (`#F5D8D2`).

Archivo Black carries poster headlines. Archivo handles navigation and index interfaces. Literata provides reflective and long-form contrast. IBM Plex Mono carries metadata and field-note labels.

Every required route has a 1440-pixel desktop frame and 390-pixel mobile frame. Project and article detail pages include expanded and collapsed desktop contents rails, plus mobile trigger and open-dialog states. All fabricated records are design-only layout references and must not ship.

---

## 2. Canvas frame inventory

| Frame ID | Frame name | Dimensions | Purpose |
|---|---|---:|---|
| `O2Q7U0` | V2 Design System - Swiss Poster + Analog Notebook | 1440 × 1180 | Palette, type hierarchy, interactive-index sample, and analog note language. |
| `jsbeK` | V2 Reusable Component Library | 1440 × 1340 | Mastheads, section poster, project row, TOC states, analog note, and footer. |
| `kr6xD` | V2 Home Desktop - Swiss Poster | 1440 × 2100 | Split poster hero, selected-work index and visual stage, writing, reading desk, and closing statement. |
| `e5Qi2M` | V2 Home Mobile - Swiss Poster | 390 × 1500 | Single-column poster hero, explicit work summaries, reading desk, and secondary links. |
| `WfOoz` | V2 Work Desktop - Interactive Index | 1440 × 1600 | Selectable project index paired with a large photographic visual stage. |
| `f2q4pQ` | V2 Work Mobile - Inline Visual Index | 390 × 1280 | Project rows with explicit inline visual treatment and no hover dependency. |
| `vwXt4` | V2 Project Detail Desktop - Expanded TOC | 1440 × 1620 | Poster title, metadata field, reading column, diagram, analog note, and 280-pixel TOC. |
| `QaoJb` | V2 Project Detail Desktop - Collapsed TOC | 1440 × 1620 | Same reading measure with a 64-pixel collapsed TOC control. |
| `fSlBZ` | V2 Article Detail Desktop - Expanded TOC | 1440 × 1660 | Literata title and prose with metadata field, diagram, note, and expanded TOC. |
| `Zpwr9` | V2 Article Detail Desktop - Collapsed TOC | 1440 × 1660 | Stable article measure with collapsed TOC. |
| `PJMVE` | V2 Project Detail Mobile - TOC Trigger | 390 × 900 | Mobile project reading view with 48-pixel contents trigger. |
| `FUWAx` | V2 Project Detail Mobile - TOC Overlay | 390 × 900 | Dimmed project view with open bottom contents dialog. |
| `lN8RY` | V2 Article Detail Mobile - TOC Trigger | 390 × 900 | Mobile article reading view with 48-pixel contents trigger. |
| `Djrw3` | V2 Article Detail Mobile - TOC Overlay | 390 × 900 | Dimmed article view with open bottom contents dialog. |
| `J7lu7` | V2 Blog Desktop - Poster Archive | 1440 × 1480 | “Blog / Field Notes” poster lead plus ruled chronological archive. |
| `G5E8SC` | V2 Blog Mobile - Poster Archive | 390 × 1280 | Stacked lead poster, older notes, footer, and design-only notice. |
| `uSH0W` | V2 About Desktop - Learning Poster | 1440 × 1400 | “I learn by making things” poster, practice statement, and analog principles. |
| `AIOeh` | V2 About Mobile - Learning Poster | 390 × 1200 | Mobile learning poster and three field-note principles. |
| `N2A23L` | V2 Read Desktop - Curiosity Shelf | 1440 × 1540 | Reading now, Finished, and shared Paused / Want to read shelves. |
| `AdDXv` | V2 Read Mobile - Curiosity Shelf | 390 × 1260 | Mobile shelves with distinct per-book status labels and design-only notice. |
| `I0VC54` | V2 404 Desktop - Misprint Poster | 1440 × 820 | Oversized `404`, red message panel, and direct recovery links. |
| `q2sIUc` | V2 404 Mobile - Misprint Poster | 390 × 650 | Stacked mobile misprint poster and recovery links. |

---

## 3. Reusable components

| Component ID | Component | Resolved size |
|---|---|---:|
| `byABj` | Desktop Masthead | 1328 × 72 |
| `D9PdU` | Mobile Masthead | 358 × 62 |
| `X5DgS3` | Section Poster | 1328 × 138 |
| `wRgO2` | Project Index Row | 1328 × 92 |
| `ftANP` | Desktop TOC Expanded | 280 × 500 |
| `RiJCF` | Desktop TOC Collapsed | 64 × 500 |
| `BGDbS` | Mobile TOC Button | 48 × 48 |
| `gBOid` | Analog Note | approximately 364 × 207 |
| `vVURq` | Desktop Footer | 1328 × 92 |

The desktop and mobile mastheads expose only Home, Work, and Blog. The footer carries About and Read as secondary destinations. Email and GitHub are conditional production links, not facts supplied by the canvas.

---

## 4. Design variables

The cleaned artifact contains only variables used by the V2 frames:

- `$paper`: `#F1EFE8`
- `$white`: `#FFFDF8`
- `$ink`: `#0A0A0A`
- `$muted`: `#6B6861`
- `$rule`: `#B9B4AA`
- `$red`: `#E33122`
- `$red-soft`: `#F5D8D2`
- `$font-poster`: `Archivo Black`
- `$font-sans`: `Archivo`
- `$font-serif`: `Literata`
- `$font-mono`: `IBM Plex Mono`

Unused Technical Broadsheet variables were removed to prevent two competing visual systems in implementation.

---

## 5. Content and interaction contracts

- Homepage statement: “Making software. Learning as I go.”
- About statement: “I learn by making things.”
- Primary navigation: Home, Work, Blog.
- Secondary navigation: About, Read.
- Work desktop uses an interactive index and visual stage; mobile exposes equivalent information inline.
- Read retains four source statuses but combines Paused and Want to read into one visual shelf. Every entry keeps its individual status label.
- Desktop TOC uses 280-pixel expanded and 64-pixel collapsed states without body reflow.
- Mobile TOC uses 48-pixel open and close controls and a bottom dialog.
- No visible em dashes or emoji are present in canvas copy.
- No user-facing claim may be inferred from design-only projects, articles, dates, books, metadata, images, email addresses, or social links.

The Home and Work photographs are credited Unsplash design references. Production must use user-provided optimized assets with factual alt text or omit the image without breaking layout.

---

## 6. Thorough review evidence

The adjusted artifact was reviewed screen by screen across all 22 root frames:

- Foundations: design system and reusable component library
- Home and Work: desktop and mobile
- Project detail: expanded desktop, collapsed desktop, mobile trigger, and mobile dialog
- Article detail: expanded desktop, collapsed desktop, mobile trigger, and mobile dialog
- Blog, About, Read, and 404: desktop and mobile

Structural visitor results after cleanup:

- Root frames: 22
- V2 root frames: 22
- Placeholder frames: 0
- Pending image generations: 0
- Clipped or overflowing nodes: 0
- Visible em dashes: 0
- Emoji: 0

Review corrections applied:

1. Removed unused Technical Broadsheet variables from the V2 artifact.
2. Clarified Paused and Want to read as distinct per-book states inside the shared shelf.
3. Added explicit design-only sample notices to Blog Mobile and Read Mobile.

The original `portfolio.pen` remains a separate preserved exploration and is not the source for implementation.
