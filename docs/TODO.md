# Todo

## Production Deployment
- [ ] Change `CONTACT_FROM_EMAIL` to `info@bmtech.com`
- [ ] Change `CONTACT_TO_EMAIL` to `info@bmtech.com`
- [ ] Remove local development origins from `ALLOWED_ORIGINS` and API Gateway's CORS origin
- [ ] Deploy latest site to Lightsail/Nginx
- [ ] Perform final production contact form test

## Website Updates
- [ ] Change alt txt and metadata on japanese pages to japanese
- [ ] Add blog/events, about, & careers page
- [ ] Change linkedin link
- [ ] Add factory (工場) location + pictures
- [ ] Add new product pictures
- [ ] Add HV box product

## Future Improvements
- [ ] Add API rate limiting or AWS WAF if spam becomes an issue
- [ ] Add automated end-to-end contact form tests
- [ ] Configure a custom API domain (e.g. `api.bmtech.com`)
- [ ] Review the existing SPF and DMARC records for `bmtech.com`
- [ ] Add or improve DMARC as needed
- [ ] Add CI checks (HTML validation, link checking, Lambda syntax checks)