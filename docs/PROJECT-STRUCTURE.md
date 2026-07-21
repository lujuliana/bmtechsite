# Project structure

```text
.
|-- src/
|   |-- components/
|   |-- data/
|   |-- drafts/
|   |-- layouts/
|   `-- pages/
|       |-- products/
|       `-- ja/
|           `-- products/
|-- public/
|-- aws/contact-form/
|-- local-api/
|-- astro.config.mjs
`-- package.json
```

- `src/` contains all Astro source code and site data.
- `public/` contains static files served from root-relative URLs such as `/css/...`, `/js/...`, `/images/...`, and `/videos/...`.
- `aws/contact-form/` contains the production contact-form Lambda and its deployment dependencies and test event.
- `local-api/` contains a development-only contact endpoint and its usage notes.
- `astro.config.mjs` configures Astro for static output.
- `package.json` defines the development and build commands.

## Source directories

### `src/layouts/`

- `Layout.astro` owns the document shell, shared metadata, fonts and stylesheets, Webflow page attributes, header, footer, and shared browser scripts.
- `ProductLayout.astro` wraps `Layout.astro` with the common product-detail structure. It selects localized product content, supplies product metadata, and generates related-product cards.

### `src/components/`

- `Header.astro` renders localized navigation, active-page state, and equivalent-language links.
- `Footer.astro` renders the localized footer navigation, address, and contact information.
- `ProductCard.astro` renders a reusable localized product card and links to the matching product route.

### `src/pages/`

Astro creates public routes from files in this directory. Top-level files provide English pages, `ja/` provides Japanese pages, and each locale's `products/` directory contains minimal data-driven product routes. The `404.astro` files provide localized not-found pages.

### `src/data/`

`products.ts` is the centralized product catalog. Each product record contains its route slug, localized content, image information, category, and page metadata.

### `src/drafts/`

This directory holds preserved page drafts that are not published as routes. To preview one, temporarily move it into `src/pages/`.

## Maintenance

- Add new products in `src/data/products.ts`.
- Shared navigation is in `src/components/Header.astro`.
- Shared footer is in `src/components/Footer.astro`.
- Product pages use `ProductLayout.astro`.
