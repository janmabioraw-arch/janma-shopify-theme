# Janma — Refreshed Shopify Theme

A refreshed Online Store 2.0 theme for **Janma Care** (janma.in) — baby & junior skincare. Built to drop into an existing Shopify store while keeping the brand's "Born Pure. Made with Love." spirit intact: warm ivory canvas, organic serif headlines, sage and terracotta accents, generous whitespace.

## What's inside

```
janma-theme/
├── assets/
│   ├── theme.css        Design tokens + every component style
│   └── theme.js         Cart drawer, variant picker, gallery, qty steppers
├── config/
│   ├── settings_schema.json   Theme editor controls (colors, fonts, logo)
│   └── settings_data.json     Default brand palette
├── layout/
│   └── theme.liquid     HTML shell, fonts, cart drawer
├── locales/
│   └── en.default.json
├── sections/
│   ├── announcement-bar.liquid
│   ├── header.liquid / footer.liquid
│   ├── hero.liquid / trust-strip.liquid / categories.liquid
│   ├── featured-collection.liquid / ingredients.liquid / pillars.liquid
│   ├── about-strip.liquid / certifications.liquid / testimonials.liquid
│   ├── founder-quote.liquid / newsletter.liquid
│   ├── main-product.liquid / main-collection.liquid / main-cart.liquid
│   ├── main-page.liquid / main-search.liquid / main-404.liquid
│   └── *-group.json     (announcement, header, footer section groups)
├── snippets/
│   ├── meta-tags.liquid
│   └── product-card.liquid
└── templates/
    ├── index.json / product.json / collection.json
    ├── cart.json / page.json / search.json / 404.json
```

## How to install

### Option A — Upload as a ZIP (fastest)

1. Zip the **contents** of `janma-theme/` (not the folder itself):
   ```bash
   cd janma-theme
   zip -r ../janma-theme.zip .
   ```
2. In your Shopify admin go to **Online Store → Themes → Add theme → Upload zip file**.
3. Once uploaded, click **Customize** to set logo, menus, hero image, and to choose featured collections.
4. Connect your existing **Main menu** (the header links to `main-menu` by default) and footer menus.
5. **Publish** the theme when you're happy.

### Option B — Shopify CLI (recommended for dev)

```bash
shopify theme push --store=your-store.myshopify.com --unpublished
# or push to a development theme:
shopify theme dev --store=your-store.myshopify.com
```

## Customising in the Theme Editor

Every homepage section is editable from **Customize → Sections**:

- **Hero** — eyebrow, heading (rich text supports `<em>`), subtitle, image, two CTAs.
- **Trust strip** — add/remove badge text items.
- **Category tiles** — three default tiles for Baby Care / Hair Care / Moisturising & Protection. Drop in your category images.
- **Featured collection** — pick any collection and how many products to show. Defaults to placeholders if none selected.
- **Pillars / Ingredients / Certifications** — each block has fields for emoji-icon, title, description.
- **About strip / Founder quote / Testimonials** — rich-text fields with founder citation.
- **Newsletter** — uses Shopify's built-in `customer` form. Subscribers are tagged `newsletter`.

Global brand colors and fonts live in **Theme settings → Colors / Typography**.

## Pages to create in Shopify admin

The theme expects these standard Janma pages (paths match the existing site):

- `pages/about-us` — populate with the About content (already drafted on janma.in)
- `pages/contact` — Shopify's contact form template works here
- `collections/baby-care`, `collections/hair-care`, `collections/moisturising-protection`, `collections/all`

## Notes for engineers

- **Online Store 2.0 compliant**: uses JSON templates and section groups (announcement / header / footer).
- **Ajax cart**: `theme.js` hits `/cart.js`, `/cart/add.js`, `/cart/change.js`. No jQuery; ~5KB minified.
- **Variant picker**: parses `{{ product | json }}` and updates `name=id`, price, and CTA label on the fly.
- **Product gallery**: thumbs swap the main image client-side; full-page deep-link still works via product URL `?variant=` params.
- **No external bundlers**: drop-in vanilla, edits go live the moment you save.
- **Accessibility**: skip link, focus-visible outlines, `prefers-reduced-motion` honored, semantic landmarks.

## Brand tokens (set in CSS root)

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#FBF7F2` | Warm ivory canvas |
| `--color-text` | `#2B2118` | Deep cocoa body / heading |
| `--color-terracotta` | `#C97B5C` | Primary accent, links, CTAs |
| `--color-sage-deep` | `#6B8569` | Eyebrows, supporting text |
| `--color-gold` | `#C9A961` | Stars, footer underlines |
| `--color-blush` | `#F4DCD0` | Hero gradient, soft surfaces |

Fonts: **Fraunces** (display serif) for headings, **Manrope** for body — both loaded via Google Fonts in `layout/theme.liquid`.

— Crafted with care for Janma. Born Pure. Made with Love.
