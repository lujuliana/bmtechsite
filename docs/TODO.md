# TODO

## Production

- [ ] Change `CONTACT_FROM_EMAIL` to `info@bmtech.com`
- [ ] Change `CONTACT_TO_EMAIL` to `info@bmtech.com`
- [ ] Retest the English and Japanese contact forms

## Website

- [ ] Change language switcher to an english-first dropdown
- [ ] Add a section about being an AMERICAN company
- [ ] Translate Japanese image alt text and page metadata
- [ ] Add About page
- [ ] Add Careers page
- [ ] Add Blog or News section
- [ ] Update the LinkedIn link
- [ ] Add factory photographs
- [ ] Replace or add product photographs
- [ ] Add the HV Box product

## Future Improvements

- [ ] Configure a custom API domain (e.g. `api.bmtech.com`)
- [ ] Add API rate limiting or AWS WAF if spam becomes an issue
- [ ] Review SPF and DMARC records for `bmtech.com`

## Completed

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
