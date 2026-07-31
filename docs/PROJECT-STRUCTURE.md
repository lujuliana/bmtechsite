# Project Structure

## Repository layout

```text
.
|-- aws/
|   `-- contact-form/       # Lambda source, package lock, and test event
|-- docs/                   # Project and operational documentation
|-- local-api/              # Dependency-free local contact API
|-- public/                 # Files copied unchanged to the site root
|   |-- css/
|   |-- images/
|   |-- js/
|   `-- videos/
|-- src/
|   |-- components/
|   |-- data/
|   |-- drafts/
|   |-- layouts/
|   |-- lib/
|   `-- pages/
|       |-- careers/
|       |-- ja/
|       `-- products/
|-- astro.config.mjs
|-- package.json
|-- package-lock.json
|-- README.md
`-- tsconfig.json
```

Generated directories (`dist/`, `node_modules/`, and `.astro/`) are intentionally excluded from this layout and must not be edited.

## Source ownership

### `src/pages/`

Astro creates routes from this directory. Top-level pages are English; `src/pages/ja/` contains Japanese routes. Product detail pages use locale-specific `[slug].astro` dynamic routes. `careers/[slug].astro` creates English job detail pages, and the locale-specific `404.astro` files provide not-found pages.

### `src/layouts/`

- `Layout.astro`: document shell, metadata, alternate-language tags, shared assets/scripts, header, footer, and scroll reveals.
- `ProductLayout.astro`: localized product detail structure and related products.
- `ProductCatalogLayout.astro`: shared products-index structure.
- `JobLayout.astro`: English job detail content and application call to action.

### `src/components/`

Shared presentational and interactive UI. The main families are:

- navigation: `Header.astro`, `Footer.astro`, `Button.astro`;
- page building: `PageBanner.astro`;
- products: `ProductCatalog.astro`, `ProductCard.astro`, `ProductCarousel.astro`; and
- careers/contact: `JobCard.astro`, `JobList.astro`, `ContactPage.astro`, `ContactForm.astro`.

### `src/data/`

- `products.ts`: product records and localized content.
- `jobs.ts`: careers data and open/closed status.
- `validate.ts`: production-build validation of slugs and related products.

### `src/lib/`

- `routes.ts`: locale route mapping, path normalization, language-switch resolution, and active-link utilities.
- `product-routes.ts`: static-path generation and product lookup for dynamic product pages.

### `src/drafts/`

Unpublished Astro page drafts. Files in this directory do not create public routes. Move or copy a draft under `src/pages/` only when it is ready to publish.

## Static and backend code

### `public/`

Contains root-served files such as `/css/...`, `/js/...`, `/images/...`, and `/videos/...`. `contact-form.js` implements browser-side validation and submission; `webflow.js` is the preserved Webflow interaction runtime.

### `aws/contact-form/`

Contains the deployable ESM Lambda (`index.mjs`), its isolated npm dependency lockfile, and `test-event.json`. Run its syntax check from this directory with `npm run check` after changing the handler.

### `local-api/`

Contains `server.mjs`, a dependency-free local implementation of the contact API contract, and its usage guide. It is separate from the production Lambda and never sends email.

## Configuration and commands

`astro.config.mjs` selects static output and registers the build-start data validation hook. The root `package.json` defines:

```sh
npm run dev    # Start Astro development server
npm run check  # Run Astro/TypeScript checks
npm run build  # Validate data and generate dist/
```

Use `npm ci` instead of `npm install` for clean, repeatable installations such as a production deployment.

## Common maintenance tasks

### Add or update a product

1. Edit the record in `src/data/products.ts`, including both locale values and valid related-product slugs.
2. Add required assets under `public/images/`.
3. Run `npm run check` and `npm run build`.
4. Review the English and Japanese index and detail pages.

### Add or update a job

1. Edit `src/data/jobs.ts`; set `isOpen` to control whether the detail route is available to the routing utility.
2. Run `npm run check` and `npm run build`.
3. Review `/careers` and the job detail URL. Careers do not have Japanese routes.

### Change routes or language-switch behavior

Update `src/lib/routes.ts`, then verify navigation, footer links, active state, and `hreflang` output on each affected locale route.

### Change shared page chrome

- Navigation or language menu: `src/components/Header.astro`
- Footer links and details: `src/components/Footer.astro`
- Site-wide metadata, scripts, or document structure: `src/layouts/Layout.astro`

### Change the contact form

Keep `ContactForm.astro`, `public/js/contact-form.js`, `local-api/server.mjs`, and `aws/contact-form/index.mjs` aligned on fields and validation. Test the local API and production API separately; changing Lambda/API Gateway code does not rebuild the static site unless the frontend is also changed.
