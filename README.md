# BMTech Website

BMTech's public website is a statically generated, bilingual site built with Astro.

The project supports English and Japanese pages, shared layouts and components, reusable product data, and a contact form backed by AWS API Gateway, Lambda, and Amazon SES.

## Features

- English routes at the site root
- Japanese routes under `/ja/`
- Shared Astro layouts, navigation, footer, and product cards
- Centralized product content in `src/data/products.ts`
- Static production output generated in `dist/`
- Webflow-compatible markup, styling, and browser interactions
- Local contact-form development server
- Production contact-form backend on AWS

## Requirements

- Node.js 20 or later
- npm

The current production server uses Node.js 22 to build the site.

## Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/lujuliana/bmtechsite.git
cd bmtechsite
npm install
```

## Development

Start the Astro development server:

```sh
npm run dev
```

Astro prints the local development URL in the terminal.

## Production build

Create the static production site:

```sh
npm run build
```

The generated site is written to:

```text
dist/
```

The `dist/` directory is generated and should not be edited manually.

## Production deployment

Production is hosted on AWS Lightsail and served by Nginx. Deployment is currently performed manually from the repository clone on the server.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the complete deployment, rollback, and contact-backend configuration process.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — application design, localization, and contact-form flow
- [`docs/PROJECT-STRUCTURE.md`](docs/PROJECT-STRUCTURE.md) — repository layout and common maintenance tasks
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Lightsail, Nginx, Lambda, API Gateway, SES, and production procedures
- [`TODO.md`](TODO.md) — remaining production, content, and infrastructure work

## Generated directories

The following directories are generated and should not be committed or edited manually:

- `dist/`
- `node_modules/`
- `.astro/`
