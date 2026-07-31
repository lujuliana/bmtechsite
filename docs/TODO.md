# TODO

- [ ] Strengthen contact form spam filters (API rate limiting or AWS WAF)
- [ ] Translate Japanese image alt text and page metadata
- [ ] Add About page
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
