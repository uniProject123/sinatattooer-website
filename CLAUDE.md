# Sina Tattooer Website — Claude Context

## Project Overview

A professional, high-conversion static website for **Sina Tattooer**, a tattoo artist based in York, UK (studio inside Mr Snips Barbers, 23 Yarburgh Way, YO10 5HD). The site drives bookings via a Tally form, showcases the artist's portfolio through a live Instagram feed, and provides detailed preparation and aftercare guides for clients.

---

## Tech Stack

- **Core**: Vanilla HTML5, CSS3, minimal Vanilla JS — no build step, no frameworks.
- **Hosting**: Cloudflare Pages — auto-deploys from `main` branch on GitHub.
- **Integrations**:
  - **Behold Widget** (`w.behold.so`) — live Instagram feed on homepage.
  - **EmbedSocial** (`embedsocial.com`) — live Google Reviews widget on homepage.
  - **Tally Forms** (`tally.so/r/LZJBLj`) — external booking intake form.
  - **Google Tag Manager** (`GTM-ND862NVQ`) — analytics/tracking on all pages.
  - **Google Ads** (`AW-17700708570`) — conversion tracking on `thank-you.html` only (direct gtag, alongside GTM).
  - **Google Maps Embed** — contact section on homepage.

---

## File Structure

```
index.html              Homepage (Hero, About, Process, Booking, FAQ, Reviews, Contact)
portfolio.html          Tattoo styles grid (6 style cards + Instagram CTA)
tattoo-preparation.html Pre-appointment guide for clients
tattoo-aftercare.html   Post-appointment healing guide
404.html                Custom 404 page (noindexed, standalone)
thank-you.html          Post-form submission confirmation (noindexed, standalone)
style.css               Global stylesheet — all design tokens + component styles
main.js                 Shared JS — nav, scroll-reveal, FAQ accordion, back-to-top
manifest.json           PWA manifest
sitemap.xml             XML sitemap (4 indexable pages)
robots.txt              Allows all crawlers, points to sitemap
_redirects              Cloudflare 301 redirects (legacy paths → clean URLs)
_headers                Cloudflare HTTP headers (security headers + noindex on hidden pages)
images/
  tattoo1.webp          Hero image (also used as OG image across all pages)
  sina-portrait.webp    Artist portrait (About section)
```

**Missing but referenced** — `portfolio.html` style cards reference 6 images that don't yet exist: `images/style-blackwork.webp`, `style-fineline.webp`, `style-watercolour.webp`, `style-oldschool.webp`, `style-geometric.webp`, `style-abstract.webp`. Cards degrade gracefully to a placeholder via `onerror`.

---

## Design System

### CSS Variables (defined in `style.css` `:root`)

**Colors**
```
--color-bg            #0e0d0c       Near-black page background
--color-surface       #161513       Slightly lighter surface (sections, cards)
--color-surface-2     #1d1b19       Raised surface (process steps, blockquotes)
--color-border        rgba(245, 240, 232, 0.12)   Subtle off-white border
--color-text          #f5f0e8       Primary text (off-white)
--color-text-muted    #a89f94       Secondary/body text
--color-text-faint    #8a7f73       Tertiary/caption text
--color-accent        #c5a55a       Gold — primary brand accent
--color-accent-hover  #dbb96e       Gold hover state
--color-contact-bg    #1a1208       Warm dark background for contact section
--color-contact-border rgba(197, 165, 90, 0.25)   Warm gold border
```

**Type scale** — all `clamp()` based, no breakpoint overrides needed:
`--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl`, `--text-hero`

**Spacing** — `--space-1` through `--space-20` (0.25rem increments up to 5rem)

**Other**: `--nav-height: 64px`, `--radius-sm/md/lg`, `--shadow-md/lg`, `--transition`

### Typography
- **Display/Headings**: Cormorant Garamond (loaded from Google Fonts)
- **Body**: Work Sans (loaded from Google Fonts)
- `h1–h4` inherit `font-family: var(--font-display)` via global rule

### Key CSS Rules to Know
- `section p` applies `color: var(--color-text-muted)` and `font-size: var(--text-base)` globally — component-level overrides need equal or higher specificity (class selectors beat element selectors, so `.my-class p` beats `section p`).
- Do **not** use `oklch(from ...)` relative color syntax — it lacks fallback support in the codebase. Use `rgba()` with the computed values from the palette above.
- Standalone pages (`404.html`, `thank-you.html`) link `style.css` and define only page-specific layout overrides in an inline `<style>` block.

---

## Shared JavaScript (`main.js`)

All four main pages (`index.html`, `portfolio.html`, `tattoo-aftercare.html`, `tattoo-preparation.html`) load `<script src="main.js">` at the bottom of `<body>`. It handles:
- **Nav**: hamburger toggle, close-on-link-click, scroll shadow on `.site-nav`
- **Scroll reveal**: `IntersectionObserver` for `.about-portrait`, `.about-text`, `.reveal`, `.reveal-stagger`
- **FAQ accordion**: open/close with `maxHeight` animation; also wires `aria-labelledby` on each answer region
- **Back-to-top**: shows after 600px scroll

Do **not** add inline `<script>` blocks to these pages for the above behaviour. If you need new interactive behaviour, add it to `main.js` with a guard (`if (!document.querySelector('.my-element')) return`).

Standalone pages (`404.html`, `thank-you.html`) do **not** use `main.js` — they have no nav or accordion.

---

## SEO & Structured Data

### Schema in `index.html`
- `LocalBusiness` + `HealthAndBeautyBusiness` (in `<head>`)
- `FAQPage` (at end of `<body>`, before `</body>`)

### Schema in sub-pages
- `portfolio.html` — `BreadcrumbList`
- `tattoo-preparation.html` — `BreadcrumbList` + `HowTo`
- `tattoo-aftercare.html` — `BreadcrumbList` + `HowTo`

When adding or updating FAQ items, update **both** the HTML accordion markup and the `FAQPage` JSON-LD schema in `index.html`.

### Clean URLs
Cloudflare serves files without `.html` extensions (e.g. `/portfolio` serves `portfolio.html`). Rules:
- Internal `<a href>` links → use `.html` extension (e.g. `href="portfolio.html"`)
- `<link rel="canonical">` and `sitemap.xml` → use clean absolute URLs (e.g. `https://sinatattooer.co.uk/portfolio`)

### Images
- Format: `.webp` only for new images
- Always include `width`, `height`, and descriptive `alt`
- Hero image: `loading="eager"` + `fetchpriority="high"` + `<link rel="preload">` in `<head>`
- All below-fold images: `loading="lazy"` + `decoding="async"`
- OG image dimensions must be included on every page: `og:image:width`, `og:image:height`, `og:image:alt`

---

## Accessibility Standards

- All interactive elements must have visible `:focus-visible` states (provided globally in `style.css`)
- Semantic HTML: `<main>`, `<section>`, `<nav aria-label>`, `<header>`, `<footer>`, `<article>` for guide pages
- Skip link (`<a class="skip-link" href="#main">`) present on all main pages
- `aria-label` on icon-only buttons; `aria-expanded` on toggles; `aria-current="page"` on active nav link
- FAQ answers use `role="region"` — `main.js` automatically wires `aria-labelledby` to the corresponding button
- `prefers-reduced-motion` handled in `style.css` globally and in JS reveal logic

---

## Adding a New Page

1. Create `pagename.html` — copy the nav, skip-link, footer, and `<script src="main.js">` from an existing page.
2. Add Twitter Card + Open Graph meta (including `og:image:width/height/alt`).
3. Add a `BreadcrumbList` JSON-LD schema block.
4. Add a `<link rel="canonical">` with the clean URL.
5. Add to `sitemap.xml`.
6. Add any redirect aliases to `_redirects`.
7. If the page should be hidden from search engines, add an `X-Robots-Tag: noindex` entry to `_headers`.

---

## Development

```bash
npx serve .          # Recommended — handles clean URLs correctly
python3 -m http.server 8000   # Alternative
```

Deploy: push to `main`. Cloudflare Pages builds automatically (no build command needed).

---

## Key Business Details

- **Booking**: Tally form at `https://tally.so/r/LZJBLj` — used in nav CTA, hero CTA, booking section, and portfolio CTA
- **Email**: `contact@sinatattooer.co.uk`
- **Pricing**: £70/hour, £400/full day
- **Deposit**: Non-refundable, deducted from final price, required to confirm
- **Response time**: Within 48 hours of enquiry
- **Instagram**: `@sinatattooer`
