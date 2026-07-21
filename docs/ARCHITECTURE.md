# Architecture

## Overview

The website is built with Astro in static output mode.

```text
Localized page data
        |
        v
Astro pages and layouts
        |
        v
Shared components
        |
        v
Static HTML, CSS, JavaScript, images, and videos
        |
        v
Nginx on AWS Lightsail
```

Astro assembles the site at build time. The production server does not run an Astro or Node.js application process; Nginx serves the files generated in `dist/`.

## Routing and localization

English routes have no locale prefix. Japanese equivalents use `/ja`.

| Page | English | Japanese |
| --- | --- | --- |
| Home | `/` | `/ja/` |
| Security | `/security-vuln` | `/ja/security-vuln` |
| Products | `/products` | `/ja/products` |
| Product detail | `/products/<slug>` | `/ja/products/<slug>` |
| Contact | `/contact` | `/ja/contact` |

The shared header receives the current locale and path so it can:

- render localized navigation text;
- indicate the active page; and
- link to the equivalent route in the other language.

Localized pages should pass the correct `locale` and `currentPath` values to the shared layout.

## Page composition

`Layout.astro` provides the shared document shell:

- metadata;
- font and stylesheet loading;
- Webflow page attributes;
- header and footer;
- shared browser scripts; and
- page-level layout structure.

`ProductLayout.astro` builds product-detail pages from the centralized product catalog. Product route files remain small and primarily select a product record and locale.

## Product data

Product content is centralized in:

```text
src/data/products.ts
```

Each product record contains shared identifiers and localized page content, including:

- route slug;
- English and Japanese text;
- product image information;
- category;
- metadata; and
- related-product information.

This avoids duplicating complete product-page markup across English and Japanese routes.

## Contact form flow

```text
English or Japanese contact page
                |
                v
        /js/contact-form.js
                |
                v
       API Gateway /contact
                |
                v
      AWS Lambda validation
                |
                v
          Amazon SES email
```

1. The English and Japanese contact pages render the same Webflow-compatible form structure.
2. `/js/contact-form.js` performs localized browser validation, prevents normal form submission, reads the honeypot field, and sends JSON to the configured API Gateway endpoint.
3. The request payload includes form fields, locale, page URL, and submission time.
4. API Gateway handles `POST /contact` and CORS preflight requests.
5. The Lambda validates the request origin and payload again.
6. Honeypot submissions are silently discarded in production.
7. Accepted submissions are sent through Amazon SES.
8. The visitor's email address is used as `Reply-To`, never as the SES sender.

The development helper in `local-api/` accepts the same request format, validates submissions, and logs them without sending email.

## Lambda configuration

The static website itself does not require environment variables.

The contact-form Lambda uses the following variables:

| Variable | Required | Purpose | Production value |
| --- | --- | --- | --- |
| `CONTACT_FROM_EMAIL` | Yes | SES-verified sender address | `info@bmtech.com` |
| `CONTACT_TO_EMAIL` | Yes | Recipient for website submissions | `info@bmtech.com` |
| `ALLOWED_ORIGINS` | Yes | Comma-separated exact browser origins allowed by the Lambda | `https://bmtech.com,https://www.bmtech.com` |
| `SES_REGION` | No | Region containing the SES identity; defaults to `AWS_REGION` | `us-east-2` |
| `CONTACT_SUBJECT_PREFIX` | No | Prefix added to contact-email subjects | `BMTech Website Contact` |
| `HONEYPOT_DEBUG` | No | When exactly `true`, returns diagnostic honeypot errors instead of silent success | `false` |

Origins must be exact and must not include a trailing slash.

API Gateway CORS settings must allow the same production origins as the Lambda.
