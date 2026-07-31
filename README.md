# BMTech Website

BMTech's public website is a static, bilingual Astro site. English pages are served at the root and Japanese pages under `/ja/`. The project retains the site's Webflow-compatible styles and interactions while using reusable Astro components and centralized site data.

## What is included

- English and Japanese home, products, security, contact, and 404 pages
- Data-driven, localized product detail pages
- English-only careers index and job detail pages
- Shared layouts, navigation, footer, banners, cards, and product carousel
- Shared route utilities for locale switching, canonical active navigation, and path normalization
- A contact form backed in production by API Gateway, Lambda, and Amazon SES
- A dependency-free local contact API that validates and logs submissions without sending email
- Build-time validation for duplicate product/job slugs and invalid related-product references

## Requirements

- Node.js 20 or later
- npm

## Install and run

```sh
git clone https://github.com/lujuliana/bmtechsite.git
cd bmtechsite
npm install
npm run dev
```

Astro prints the local URL when the development server starts.

## Checks and production build

```sh
npm run check
npm run build
```

`npm run check` runs Astro and TypeScript checks. `npm run build` first validates the product and job data, then writes the static production site to `dist/`. Do not edit `dist/` directly.

## Contact form

The deployed contact form posts to an API Gateway endpoint configured in `src/components/ContactForm.astro`. The Lambda source is in `aws/contact-form/`; its deployment is independent of the static website.

For local API behavior and manual request examples, see [local-api/README.md](local-api/README.md). The site form uses its configured production endpoint unless you deliberately change the form action for local testing.

## Deployment

The documented production environment is a static Astro build served by Nginx on AWS Lightsail. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the deployment, rollback, verification, and contact-backend configuration procedures.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — rendering model, routes, localization, data, and contact flow
- [Project structure](docs/PROJECT-STRUCTURE.md) — repository layout and maintenance ownership
- [Deployment](docs/DEPLOYMENT.md) — Lightsail/Nginx and the AWS contact backend
- [TODO](docs/TODO.md) — remaining product, content, and infrastructure work

## Generated directories

Do not edit or commit these generated directories:

- `dist/`
- `node_modules/`
- `.astro/`
