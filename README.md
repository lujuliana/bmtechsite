## Github Pages Site
https://lujuliana.github.io/bmtechsite

## AWS Lambda Environment Variables
| Variable | Required | Description | Value |
| --- | --- | --- | --- |
| `CONTACT_FROM_EMAIL` | Yes | SES-verified sender address. User input is never used as the sender. | `juliana.lu@bmtech.com` |
| `CONTACT_TO_EMAIL` | Yes | Address that receives contact submissions. | `juliana.lu@bmtech.com` |
| `ALLOWED_ORIGIN` | Yes | Exact website origin allowed by CORS, such as `https://www.example.com`; omit a trailing slash. | `http://127.0.0.1:5500` |
| `SES_REGION` | No | Region containing the SES identity. Defaults to Lambda's managed `AWS_REGION`. | `us-east-2` |
| `CONTACT_SUBJECT_PREFIX` | No | Email subject prefix. Defaults to `Website contact`. | `BMTech Website Contact` |
| `HONEYPOT_DEBUG` | No | Exactly `true` exposes the diagnostic `422` honeypot response. Any other value silently discards honeypot submissions and returns normal success. | `false` |

# Todo

## Production Deployment

- [ ] Verify `bmtech.com` domain in Amazon SES
- [ ] Add SES DNS records in Namecheap
- [ ] Request Amazon SES production access
- [ ] Change `CONTACT_FROM_EMAIL` to `info@bmtech.com`
- [ ] Change `CONTACT_TO_EMAIL` to `info@bmtech.com`
- [ ] Change `ALLOWED_ORIGIN` to `https://bmtech.com`
- [ ] Change API Gateway's CORS origin to `https://bmtech.com`
- [ ] Deploy latest site to Lightsail/Nginx
- [ ] Perform final production contact form test

## Website Updates
- [ ] Add japanese product detail pages
- [ ] Add blog/events, about, & careers page
- [ ] Change linkedin link
- [ ] Add factory location + pictures
	- Headquarters → 本社
	- Factory      → 工場
- [ ] Add new product pictures
- [ ] Add HV box product

## Future Improvements

- [ ] Add API rate limiting or AWS WAF if spam becomes an issue
- [ ] Add automated end-to-end contact form tests
- [ ] Reduce duplicated page components (header/footer/navigation)
- [ ] Move toward a reusable templating/component workflow
- [ ] Configure a custom API domain (e.g. `api.bmtech.com`)
- [ ] Review the existing SPF and DMARC records for `bmtech.com`
- [ ] Add or improve DMARC as needed
- [ ] Add CI checks (HTML validation, link checking, Lambda syntax checks)
