# Architecture

## Overview

BMTech is an Astro static site. Astro renders all public pages at build time; production does not run an Astro or Node.js web process. Nginx serves the generated assets from `dist/`.

```text
Page and data modules
        |
        v
Shared Astro layouts and components
        |
        v
Astro static build (with data validation)
        |
        v
dist/ HTML, CSS, JavaScript, images, and videos
        |
        v
Nginx on AWS Lightsail
```

`astro.config.mjs` sets `output: 'static'` and runs site-data validation at the start of each production build.

## Routes and localization

English is the default locale; Japanese equivalents are under `/ja/`.

| Page | English | Japanese |
| --- | --- | --- |
| Home | `/` | `/ja/` |
| Security | `/security-vuln` | `/ja/security-vuln` |
| Products | `/products` | `/ja/products` |
| Product detail | `/products/<slug>` | `/ja/products/<slug>` |
| Careers | `/careers` | — |
| Career detail | `/careers/<slug>` | — |
| Contact | `/contact` | `/ja/contact` |
| Not found | `/404` | `/ja/404` |

Product and career detail routes are generated from their respective data modules. Japanese pages are available only where a Japanese route is defined; careers remain English-only.

`src/lib/routes.ts` is the single source of truth for locale-aware static routes and path behavior. It normalizes common URL variants, resolves an equivalent localized page when one exists, and supplies the active-navigation helpers used by the header and footer. It deliberately does not offer a language switcher on English-only career routes.

## Rendering composition

`src/layouts/Layout.astro` provides the document shell: metadata, alternate-language links, shared styles and fonts, Webflow attributes/scripts, header, footer, and the common scroll-reveal behavior. It also accepts page-specific `head` and `scripts` slots.

Specialized layouts build on that shell:

- `ProductLayout.astro` renders a localized product-detail page and its related-product carousel.
- `ProductCatalogLayout.astro` renders the shared product index; locale routes supply localized metadata and banner content.
- `JobLayout.astro` renders an English job detail page and its email application call to action.

Reusable components include the header, footer, page banner, button, product card/catalog/carousel, job card/list, and contact-page/form components. Public styles, media, the Webflow runtime, and contact-form client script live in `public/` and are copied to the output unchanged.

## Site data and safeguards

Product data is centralized in `src/data/products.ts`; every record supplies a shared slug and localized product content. `src/lib/product-routes.ts` converts those records into static product paths and resolves product records for detail pages.

Job data is centralized in `src/data/jobs.ts`. Each job has a slug, open/closed state, title, location, employment type, overview, responsibilities, required qualifications, and preferred qualifications. The careers index renders the data through `JobList.astro`; only open job detail routes are exposed by the locale-routing utility.

`src/data/validate.ts` runs during production builds and fails the build when it finds duplicate product or job slugs, or a related-product slug that does not exist. Update data through these modules rather than duplicating page markup.

## Metadata and client behavior

Pages provide title, description, and Open Graph values to `Layout.astro`. The layout emits `hreflang` links only when an equivalent route is available. The shared header includes an accessible language menu only on pages with a matching alternate locale.

The project preserves Webflow-compatible markup and assets. `public/js/webflow.js` handles existing Webflow interactions; the layout adds a reduced-motion-aware IntersectionObserver reveal behavior. The product carousel provides keyboard and pagination controls and recalculates its pages when its viewport changes.

## Contact form flow

```text
English or Japanese contact page
             |
             v
public/js/contact-form.js
             |
             v
API Gateway: POST /contact
             |
             v
AWS Lambda validation and email formatting
             |
             v
Amazon SES
```

1. `ContactForm.astro` renders a shared localized form and the API endpoint configured in its form action.
2. `public/js/contact-form.js` validates required fields in the browser, records the form load timestamp, applies a 15-second request timeout, and posts JSON with the locale, page URL, submission timestamp, and elapsed time to submit. The API rejects attempts submitted in under three seconds.
3. API Gateway accepts `POST /contact` and CORS preflight requests.
4. The Lambda revalidates origin, content type, body size, payload, and the honeypot field before using SES.
5. Valid submissions are sent as HTML and plain-text email. The visitor address is the SES `Reply-To`, never the sender.
6. Honeypot submissions are discarded; in the normal production-safe mode they receive the same successful response as a valid request.

`local-api/server.mjs` implements the same request contract for development and logs valid submissions without sending email. It is not automatically selected by the browser form; configure the form action intentionally when testing against it.

## Lambda configuration

The static site has no runtime environment variables. The contact Lambda reads:

| Variable | Required | Purpose |
| --- | --- | --- |
| `CONTACT_FROM_EMAIL` | Yes | SES-verified sender address |
| `CONTACT_TO_EMAIL` | Yes | Recipient for website submissions |
| `ALLOWED_ORIGINS` | Yes | Comma-separated exact browser origins allowed by the Lambda |
| `SES_REGION` | No | SES identity region; otherwise `AWS_REGION` is used |
| `CONTACT_SUBJECT_PREFIX` | No | Prefix for submitted-email subjects |
| `HONEYPOT_DEBUG` | No | Set only to `true` to return diagnostic honeypot validation errors |

Origins must be exact and must not include trailing slashes. API Gateway CORS must allow the same production origins as the Lambda.
