# TODO

- [ ] Replace About page photos
- [ ] Replace product photos
- [ ] Add support for multiple product images before restructuring the product detail page. Update the product data model from a single image to an images array, and create a reusable ProductGallery.astro component. Show one large primary image with thumbnails below when multiple images exist; with one image, show only the main image and no gallery controls. Preserve the current product page layout and styling as much as possible for now. Ensure the gallery is responsive and accessible, and update existing product data to the new structure without changing unrelated code
- [ ] Translate Japanese image alt text and page metadata
- [ ] Add Blog or News section
- [ ] Update the LinkedIn link
- [ ] Add factory photographs
- [ ] Replace or add product photographs
- [ ] Add the HV Box product

## Future Improvements

- [ ] Configure a custom API domain (e.g. `api.bmtech.com`)
- [ ] Review SPF and DMARC records for `bmtech.com`

## Completed

- [x] Add Careers page
- [x] Improve contact form email formatting (HTML + plain text)
- [x] Update Lambda `ALLOWED_ORIGINS` to production values
- [x] Update API Gateway CORS to allow only production origins
- [x] Migrate the website from exported Webflow pages to Astro
- [x] Create shared English and Japanese layouts and components
- [x] Centralize product content
- [x] Build localized product routes
- [x] Create localized 404 pages
- [x] Implement the contact form with AWS Lambda, API Gateway, and Amazon SES
- [x] Deploy the Astro site to AWS Lightsail
- [x] Configure Nginx to serve the production site
- [x] Change language switcher to an English-first dropdown
- [x] Add About page
