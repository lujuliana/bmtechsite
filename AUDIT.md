# BMTech Static Site Audit — Current Rerun

Audit date: 2026-07-14  
Scope: all current HTML, CSS, JavaScript, image, and video files in the workspace. This was a static source/reference audit; no production AWS environment, analytics, external backlinks, or live form backend was available.

## Executive summary

The repository currently contains 19 HTML files, 80 local media files (74 images/SVGs and six video assets), three CSS files, and two JavaScript files. All current image and video files are referenced, all local HTML asset paths resolve, both previously unused MP4 files have been removed, and all five Japanese pages now declare `lang="ja"`.

The primary launch blocker is the contact forms. Both contact pages currently contain the original Webflow forms (`method="get"`, no backend `action`, and Webflow-specific handler classes). The custom `js/contact-form.js` file still exists but is not included by any HTML page, and no form uses its `.js-contact-form` selector. Consequently, the intended static-site/API Gateway form frontend is not active.

The largest remaining maintenance issues are 18 duplicated headers and footers, 60 duplicated product cards, repeated locale/page shells, 15 custom CSS class families absent from the HTML, and a 395 KB generated Webflow runtime containing stale interaction targets. GSAP and ScrollTrigger are active dependencies of that runtime and are not safe to remove.

## Changes resolved since earlier audits

- Seven unused responsive image derivatives were deleted.
- Two unused MP4 files were deleted: `videos/windfarm2-1.mp4` and `videos/39991-424360905_small.mp4`.
- Total documented cleanup is 34,255,472 bytes (about 32.67 MiB); see `CLEANUP.md`.
- The referenced replacement MP4 files, WebM files, and poster images remain intact.
- The former broken `windfarm2-1_mp4.mp4` reference is resolved.
- `ja/security-old.html` now correctly declares `lang="ja"`.
- The GSAP conclusion was corrected: generated `js/webflow.js` actively uses GSAP and ScrollTrigger.

## Critical: contact forms are not connected

Affected pages:

- `contact.html`
- `ja/contact.html`

Both forms currently:

- use `method="get"`;
- have no `action` endpoint;
- are wrapped in `.w-form`;
- retain `data-wf-page-id` and `data-wf-element-id` attributes;
- retain `.w-form-done` and `.w-form-fail` result containers;
- do not load `js/contact-form.js`.

This is the original Webflow export behavior. A plain AWS Lightsail/static deployment does not provide a submission backend. Without a supported handler, the forms can fail in the Webflow runtime or fall back to placing the submitted name, email, phone, subject, and message in the URL query string, browser history, and server logs.

### Orphaned custom form handler

`js/contact-form.js` exists and is 5,247 bytes, but it has zero HTML references. It searches for `.js-contact-form`; neither current contact form has that class. Its validation, JSON `fetch()` submission, request timeout, localized result handling, and API endpoint checks therefore never execute.

This file is unused by the current site, but it appears intentionally written as the static-form replacement and should not be deleted until a decision is made. Either reconnect it to both contact pages and deploy the API Gateway/Lambda backend, or remove it if a different form solution is selected.

### Required form work before launch

1. Convert both forms to `POST`, add the `.js-contact-form` hook, standardize field names, and load `js/contact-form.js` using the correct relative path.
2. Set the real HTTPS API Gateway URL as the form action.
3. Configure API Gateway CORS for the production origin, `POST`, `OPTIONS`, and `Content-Type`.
4. Validate and normalize every field in Lambda; client-side validation is not a security boundary.
5. Add spam/rate controls, delivery logging, alerting, and error handling.
6. Return 2xx only after successful processing and non-2xx for validation or delivery failures.
7. Test English and Japanese validation, success, backend rejection, network failure, and timeout paths on the deployed origin.

## Asset and reference audit

### Current result

- Source files scanned: 24 (19 HTML, three CSS, and two JavaScript files).
- Local media files checked: 80.
- Media files with zero references: **0**.
- Broken local HTML references: **0**.

The reference check included filename occurrences across HTML/CSS/JavaScript, ordinary `href` and `src` values, responsive `srcset` variants, poster attributes, and Webflow `data-video-urls` values.

### Video verification

All six remaining video-directory files exist and each filename occurs four times in the source graph:

- `videos/windfarm2-1_mp4.mp4`
- `videos/windfarm2-1_webm.webm`
- `videos/windfarm2-1_poster.0000000.jpg`
- `videos/39991-424360905_small_mp4.mp4`
- `videos/39991-424360905_small_webm.webm`
- `videos/39991-424360905_small_poster.0000000.jpg`

Do not delete these files under the current markup.

### Referenced large assets worth optimizing

These are used and must remain until optimized replacements are referenced and tested:

| File | Size |
| --- | ---: |
| `videos/windfarm2-1_webm.webm` | 4,712,410 bytes |
| `videos/39991-424360905_small_webm.webm` | 4,526,387 bytes |
| `images/bess_compressed.jpeg` | 4,094,109 bytes |
| `images/Security.png` | 4,074,791 bytes |
| `videos/windfarm2-1_mp4.mp4` | 3,249,885 bytes |
| `images/sign-gemini.png` | 3,127,338 bytes |

Consider lower video bitrates/resolutions, AV1/VP9 where appropriate, AVIF/WebP images, and realistic maximum image dimensions.

## Duplicated HTML

### Header and navigation

The full header/navbar is copied into 18 of 19 HTML files (all except `404.html`). This includes the logo, English/Japanese navigation, language switcher, desktop/mobile contact buttons, active-page states, and Webflow component attributes.

There are 13 English header copies and five Japanese copies. Path depth and current-page differences make coordinated navigation changes error-prone.

### Footer

The full footer is also copied into 18 pages. Each copy repeats responsive logo markup, three navigation rows, email, address, and phone number. Contact details have 18 independent maintenance points.

### Product cards

There are 60 product-card blocks across 11 files:

| Location | Cards |
| --- | ---: |
| `index.html` | 7 |
| `ja/home.html` | 7 |
| `products.html` | 14 |
| `ja/products.html` | 14 |
| Seven product detail pages | 18 combined |

The product indexes repeat cards between “All” and category tab panes. Product names, descriptions, image `srcset` values, and URLs are then copied again into the home carousels and related-product sections.

### Product detail and locale shells

All seven files under `products/` repeat the head, header, product layout, consulting CTA, related-products shell, footer, and scripts. The English/Japanese home, products, contact, and security page pairs duplicate their entire structures.

### Head and dependency boilerplate

All 19 pages repeat stylesheet links, Webfont initialization, favicon declarations, inline styles, jQuery, `webflow.js`, and GSAP. Dependency changes remain page-by-page edits.

## CSS audit

All three CSS files are linked from every page:

- `css/normalize.css` — 7,772 bytes
- `css/webflow.css` — 38,838 bytes
- `css/bmtechco.webflow.css` — 67,925 bytes

None is safe to delete wholesale. The site uses Webflow navigation, tabs, slider, background video, form, input, select, button, grid, container, and utility classes.

A static class-token comparison found 15 custom CSS class names absent from all HTML:

```text
card-grid-wrap       card-list-wrap       divider-2
dropdown-toggle      empty-state          grid-2
grid-3               link-block           locale
nav-dropdown         nav-dropdown-icon    nav-dropdwon-list
nav-link-dropdown    product-h2-2         utility-page-form
```

These are strong purge candidates, including the likely typo `nav-dropdwon-list`, but remove them only after CSS-aware desktop/mobile/state coverage. Token comparison alone cannot prove that every compound or dynamic rule is unused.

The generic `css/webflow.css` also contains rules for components not present in the site. Replace used component styles deliberately before attempting to remove or deeply purge it.

## JavaScript audit

### `js/contact-form.js`

This custom file is currently unused because no HTML page includes it. It should either be reconnected as part of the required form implementation or removed after choosing another backend/frontend approach.

### `js/webflow.js`

The generated minified runtime is 395,153 bytes and is included on every page. It supplies responsive navigation, tabs, the home slider, background videos, forms/interactions, and GSAP-driven behavior. It is not safe to remove wholesale.

The bundle contains 71 interaction event definitions. Of 65 unique explicit target IDs found in its interaction data, 46 have no matching `data-w-id` in the current HTML. This is strong evidence of stale interaction configuration, but pruning the minified bundle directly is unsafe. Replace or rebuild the runtime/components with browser regression tests.

### GSAP and ScrollTrigger are active dependencies

All 19 pages load GSAP 3.15.0. `index.html` additionally loads `ScrollTrigger.min.js`. The generated `js/webflow.js` runtime actively uses them. The current evidence is:

- five `window.gsap` references;
- one direct `.gsap?.timeline` access, plus other runtime timeline construction;
- two `ScrollTrigger.create(...)` calls;
- nine `scrollTriggerConfig` references, including a home-page interaction configuration.

GSAP and ScrollTrigger are not currently safe to remove. Keep their CDN tags until the dependent Webflow interactions are replaced or rebuilt and tested.

### jQuery and Webfont

Every page loads jQuery 3.5.1 before `webflow.js`; treat it as coupled to the current runtime. The Google Webfont loader is actively called by inline `WebFont.load(...)` code. Self-hosting fonts and replacing Webflow components could eventually remove these third-party dependencies.

## Webflow-generated and obsolete files

### No further confirmed-unused media

No current image or video file is a safe zero-reference deletion candidate.

### Generated, but keep until replaced

- `css/normalize.css`
- `css/webflow.css`
- `css/bmtechco.webflow.css`
- `js/webflow.js`
- responsive image variants referenced in `srcset`
- current GSAP and ScrollTrigger CDN tags
- Webflow attributes/classes used by active components

### Likely obsolete pages, pending redirect and analytics check

- `security-old.html`
- `ja/security-old.html`

No current page links to these except the old pages linking to each other. Check production analytics, search indexing, and backlinks before deletion, then configure permanent redirects to the matching `security-vuln.html` pages.

## Locale and SEO findings

- All five `ja/*.html` pages now declare `lang="ja"`.
- English pages remain `lang="en"`.
- No canonical or `hreflang` tags were found.
- Open Graph image metadata on 15 pages still points to Webflow's CDN.
- `404.html` loads its illustration from Webflow's CloudFront CDN.
- Reciprocal `en`/`ja` alternates should be added once the production hostname and canonical URL scheme are fixed.

## Other deployment and maintenance findings

- The site depends on Google Webfont, Google Fonts, Webflow's jQuery CDN, Webflow/website-files assets, and GSAP/ScrollTrigger CDN libraries.
- There is no build/template system, dependency manifest, automated link check, deployment configuration, cache policy, Lambda implementation, or infrastructure-as-code configuration.
- `README.md` contains only the previous GitHub Pages URL.
- Relative paths vary by page depth (`images/...` versus `../images/...`).
- The same `data-w-id` is reused by many product cards, tying their behavior to global generated interaction data.

## Opportunities to reduce maintenance

1. Add a small static-site build layer while preserving the public `.html` URLs.
2. Extract locale-aware header, footer, head, and dependency partials.
3. Store product data once and generate product indexes, home cards, related cards, and detail pages.
4. Centralize locale content so structural fixes apply to English and Japanese together.
5. Reconnect or replace the orphaned form handler and document its AWS contract.
6. Replace Webflow components incrementally, then remove their matching runtime/CSS dependencies only after regression testing.
7. Add automated broken-reference, unused-asset, HTML validity, JavaScript syntax, accessibility, and form smoke tests.
8. Add image/video optimization, hashing, compression, and cache headers to the deployment process.

## Prioritized improvement plan

### P0 — required before public launch

1. Restore a working `POST` implementation for both contact forms and connect it to a real API Gateway/Lambda backend.
2. Add server-side validation, CORS, spam/rate controls, delivery logging, alerting, and localized end-to-end tests.
3. Configure HTTPS, the production hostname, security headers, server-level 404 handling, and redirects for retired URLs.

### P1 — high-value maintenance

4. Decide whether to reconnect `js/contact-form.js` or delete it in favor of another solution; do not leave it orphaned.
5. Extract shared head/header/footer/dependency templates.
6. Centralize product data and generate the 60 cards and seven detail pages.
7. Decide whether the two old security pages will be retained or permanently redirected.
8. Add canonical URLs and reciprocal `hreflang` metadata.

### P2 — performance and decoupling

9. Re-encode the remaining large referenced videos and images.
10. Replace Webflow interactions/components incrementally; then remove stale interaction data, jQuery, unused CSS, and `webflow.js` only after browser regression testing.
11. Retain GSAP and ScrollTrigger until their Webflow runtime usage has been removed and verified.
12. Self-host deliberate font/social/404 assets where independence from Webflow and Google CDNs is required.
13. Document and automate Lightsail build, deploy, rollback, caching, monitoring, and smoke tests.

## Audit limitations

This rerun used static source and reference analysis. It did not inspect live AWS configuration, Webflow project settings, production logs, analytics, search indexing, backlinks, actual form delivery, or rendered behavior. CSS and interaction cleanup beyond zero-reference findings requires browser coverage and regression testing.
