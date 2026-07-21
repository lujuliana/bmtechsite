## Github Pages Site
https://lujuliana.github.io/bmtechsite

## AWS Lambda Environment Variables
| Variable | Required | Description | Value |
| --- | --- | --- | --- |
| `CONTACT_FROM_EMAIL` | Yes | SES-verified sender address. User input is never used as the sender. | `juliana.lu@bmtech.com` |
| `CONTACT_TO_EMAIL` | Yes | Address that receives contact submissions. | `juliana.lu@bmtech.com` |
| `ALLOWED_ORIGINS` | Yes | List of exact website origins allowed by CORS; omit a trailing slash. | `http://localhost:4321,http://127.0.0.1:5500,https://bmtech.com,https://www.bmtech.com` |
| `SES_REGION` | No | Region containing the SES identity. Defaults to Lambda's managed `AWS_REGION`. | `us-east-2` |
| `CONTACT_SUBJECT_PREFIX` | No | Email subject prefix. Defaults to `Website contact`. | `BMTech Website Contact` |
| `HONEYPOT_DEBUG` | No | Exactly `true` exposes the diagnostic `422` honeypot response. Any other value silently discards honeypot submissions and returns normal success. | `false` |

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
