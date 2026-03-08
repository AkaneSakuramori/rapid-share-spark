

## Redesign: Utility-First Image Hosting UI

The current site is a marketing landing page with hero headlines, feature grids, and a large footer. The user wants a **tool-first** interface like ImgBB/Catbox — upload front and center, no fluff.

### Changes Overview

**1. Strip marketing content**
- Remove `Features.tsx` from Index
- Replace marketing `Footer.tsx` with a minimal single-line footer (API docs, Terms, Privacy, Abuse)
- Remove hero headline/subheadline marketing copy

**2. Redesign Navbar (`Navbar.tsx`)**
- Simplify to: Logo | Upload | API | GitHub (external link icon) | Theme toggle (sun/moon)
- Remove "Sign up free", "Log in", "Features/Pricing/FAQ" links
- Keep sticky glass effect but make it more compact

**3. Redesign Upload Interface (`HeroUpload.tsx`)**
- Remove `min-h-screen`, background gradient blobs, trust bar, and marketing text
- Center a large clean dropzone in the page (not full viewport, just prominent)
- Simpler text: "Drop images here or click to upload" + format/size note
- Keep drag-and-drop, clipboard paste, URL upload — but make the URL input inline inside the dropzone or directly below it
- Cleaner file queue cards

**4. Redesign Results Panel (inside `HeroUpload.tsx`)**
- After upload, show image preview (larger thumbnail or actual preview)
- Show link formats in a clean table/list: Direct Link, Markdown, HTML, BBCode, Delete Link
- Each row has a Copy button
- Add "Upload more" button to reset
- Remove confetti/celebration — just clean instant results

**5. New minimal Footer (`Footer.tsx`)**
- Single row: `API · Terms · Privacy · Abuse · © 2026 Rapidx.me`
- No multi-column grid, no social icons, no brand description

**6. Index page (`Index.tsx`)**
- Remove `<Features />` component import
- Just: `Navbar` → `HeroUpload` → `Footer`

**7. Theme toggle**
- Add a sun/moon toggle button in the navbar using `next-themes` (already installed)
- Wire up dark/light class switching

**8. Minor style tweaks**
- Default to dark mode (already set up in CSS)
- Ensure the `dark` class is applied by default on `<html>`

### Files to modify
- `src/pages/Index.tsx` — remove Features import
- `src/components/Navbar.tsx` — simplify nav links, add theme toggle
- `src/components/HeroUpload.tsx` — strip marketing, utility-focused layout
- `src/components/Footer.tsx` — minimal single-line footer
- `index.html` — add `class="dark"` to `<html>` tag

### Files to potentially delete
- `src/components/Features.tsx` — no longer needed (or just unused)

