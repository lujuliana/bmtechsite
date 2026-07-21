# BMTech Astro project

This repository contains BMTech's statically generated English and Japanese website. Astro assembles shared layouts and components at build time while retaining the site's Webflow markup, styles, and browser interactions.

Production is deployed as a static Astro site hosted on AWS Lightsail. The contact form is handled separately by API Gateway, Lambda, and Amazon SES.

https://lujuliana.github.io/bmtechsite

## Prerequisites

- Node.js 20+ (or the version you use)
- npm

## Project structure

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


## Development and build

Install dependencies once:

```sh
npm install
```

Start the Astro development server:

```sh
npm run dev
```

Create the static production site:

```sh
npm run build
```

## Deployment overview

The project uses Astro's `static` output mode. A deployment should:

1. install dependencies with `npm install` (or `npm ci` in an automated environment);
2. run `npm run build`;
3. publish the generated static site to the configured web host;
4. serve root-relative asset URLs without rewriting their paths; and
5. configure the contact Lambda and API Gateway independently, including SES identities and the production `ALLOWED_ORIGINS` values.

The repository does not currently define a deployment workflow in `package.json` or `astro.config.mjs`.

## Generated directories

These directories are generated and should not be edited manually:

- `dist/`
- `node_modules/`
- `.astro/`
