# Project Structure

## Repository layout

```text
.
|-- aws/
|   `-- contact-form/
|-- docs/
|   |-- ARCHITECTURE.md
|   |-- DEPLOYMENT.md
|   `-- PROJECT-STRUCTURE.md
|-- local-api/
|-- public/
|-- src/
|   |-- components/
|   |-- data/
|   |-- drafts/
|   |-- layouts/
|   `-- pages/
|       |-- products/
|       `-- ja/
|           `-- products/
|-- TODO.md
|-- README.md
|-- astro.config.mjs
|-- package-lock.json
`-- package.json
```

## Top-level directories

### `src/`

Contains all Astro source code and site data.

### `public/`

Contains static files copied directly into the generated site.

These files are served from root-relative URLs such as:

```text
/css/...
/js/...
/images/...
/videos/...
```

### `aws/contact-form/`

Contains the production contact-form Lambda, its dependencies, configuration notes, and test event.

### `local-api/`

Contains the development-only contact endpoint and its usage notes. It validates and logs contact requests without sending email.

### `docs/`

Contains internal project documentation for architecture, deployment, and repository structure.

## Source directories

### `src/layouts/`

#### `Layout.astro`

Provides the shared page shell, including:

- metadata;
- fonts and stylesheets;
- Webflow attributes;
- header and footer;
- shared scripts; and
- common document structure.

#### `ProductLayout.astro`

Provides the shared product-detail layout. It:

- selects localized content;
- supplies product metadata;
- renders the main product page structure; and
- generates related-product cards.

### `src/components/`

#### `Header.astro`

Renders:

- localized navigation;
- active-page state; and
- links to equivalent English and Japanese routes.

#### `Footer.astro`

Renders localized footer navigation, contact information, and address content.

#### `ProductCard.astro`

Renders a reusable localized product card linked to the correct product route.

### `src/pages/`

Astro creates public routes from files in this directory.

- Top-level page files generate English routes.
- `src/pages/ja/` generates Japanese routes.
- Each locale's `products/` directory contains small data-driven product route files.
- `404.astro` and `ja/404.astro` provide localized not-found pages.

### `src/data/`

`products.ts` is the centralized product catalog.

Product records include:

- slug;
- category;
- image information;
- localized content;
- metadata; and
- related-product data.

### `src/drafts/`

Contains preserved page drafts that are not published as routes.

To preview a draft, temporarily move or copy it into `src/pages/`.

## Configuration files

### `astro.config.mjs`

Configures Astro to generate a static site.

### `package.json`

Defines project scripts and dependencies.

Common commands:

```sh
npm run dev
npm run build
```

### `package-lock.json`

Locks dependency versions for repeatable installations.

Use `npm ci` for clean or automated installations when appropriate.

## Common maintenance tasks

### Add or update a product

1. Update the product record in `src/data/products.ts`.
2. Add any required images under `public/images/`.
3. Confirm the English and Japanese product routes use the product record.
4. Run `npm run build`.
5. Review both localized pages before deployment.

### Update shared navigation

Edit:

```text
src/components/Header.astro
```

### Update the shared footer

Edit:

```text
src/components/Footer.astro
```

### Update product-page structure

Edit:

```text
src/layouts/ProductLayout.astro
```

### Update shared page metadata or scripts

Edit:

```text
src/layouts/Layout.astro
```

## Generated directories

Do not edit these directories manually:

- `dist/`
- `node_modules/`
- `.astro/`
