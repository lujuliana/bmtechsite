# Todo

## Production contact form

- [ ] Change `CONTACT_FROM_EMAIL` to `info@bmtech.com`
- [ ] Change `CONTACT_TO_EMAIL` to `info@bmtech.com`
- [ ] Confirm API Gateway allows both production origins
- [ ] Submit the English production contact form
- [ ] Submit the Japanese production contact form
- [ ] Confirm both messages are delivered and reply correctly to the visitor address

## Website content

- [ ] Translate Japanese image alt text and page metadata
- [ ] Add About page
- [ ] Add Careers page
- [ ] Add Blog or Events section
- [ ] Update the LinkedIn link
- [ ] Add factory photographs
- [ ] Replace or add product photographs
- [ ] Add the HV Box product

## Quality and automation

- [ ] Add automated HTML validation
- [ ] Add automated internal-link checking
- [ ] Add Lambda syntax or unit checks
- [ ] Add end-to-end contact-form tests
- [ ] Add a deployment script or CI/CD workflow
- [ ] Document a release checklist

## Infrastructure and security

- [ ] Add API rate limiting or AWS WAF if spam becomes a problem
- [ ] Configure a custom API domain such as `api.bmtech.com`
- [ ] Review the existing SPF record for `bmtech.com`
- [ ] Review and strengthen the DMARC policy when appropriate
- [ ] Review production logging and retention settings
- [ ] Define a recurring dependency-update process

## Completed

- [x] Migrate the website from exported Webflow pages to Astro
- [x] Create shared English and Japanese layouts and components
- [x] Centralize product content
- [x] Build localized product routes
- [x] Create localized 404 pages
- [x] Configure the Lambda, API Gateway, and SES contact-form backend
- [x] Deploy the Astro site to AWS Lightsail
- [x] Serve the generated site through Nginx
