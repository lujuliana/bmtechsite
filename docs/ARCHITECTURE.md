# Architecture

## English and Japanese routing

English routes have no locale prefix. Japanese equivalents use `/ja`:

| Page | English | Japanese |
| --- | --- | --- |
| Home | `/` | `/ja/` |
| Security | `/security-vuln` | `/ja/security-vuln` |
| Products | `/products` | `/ja/products` |
| Product detail | `/products/<slug>` | `/ja/products/<slug>` |
| Contact | `/contact` | `/ja/contact` |

The shared header maps each route to its equivalent page in the other language. Page components must pass the matching `locale` and `currentPath` values to the layout so links and active-page styling remain correct.

## Contact form architecture

1. The English and Japanese contact pages render the same Webflow-compatible form structure and load `/js/contact-form.js`.
2. The shared browser script performs localized validation, blocks normal form submission, reads the honeypot field, and sends a JSON request to the form's configured API Gateway endpoint. The payload includes the form fields, locale, page URL, and submission time.
3. API Gateway forwards `POST /contact` and CORS preflight requests to `aws/contact-form/index.mjs`.
4. The Lambda verifies the request origin against the comma-separated `ALLOWED_ORIGINS` environment variable, validates the JSON payload again, silently handles honeypot submissions by default, and sends accepted messages through Amazon SES.
5. The sender and recipient are configured through Lambda environment variables. The visitor's email is used only as the SES reply-to address.

The development helper in `local-api/` can validate and log compatible requests without sending email. Production configuration and environment-variable notes are maintained in the repository's root `README.md`.

## Environment

The static website itself does not require environment variables.

The contact-form Lambda uses:

| Variable | Required | Description | Target Val | Lambda Val |
| --- | -- | ---- | -- | -- |
| `CONTACT_FROM_EMAIL` | Yes | SES-verified sender address. User input is never used as the sender. | `info@bmtech.com` |`juliana.lu@bmtech.com` |
| `CONTACT_TO_EMAIL` | Yes | Address that receives contact submissions. | `info@bmtech.com` | `juliana.lu@bmtech.com` |
| `ALLOWED_ORIGINS` | Yes | List of exact website origins allowed by CORS; omit a trailing slash. | `https://bmtech.com, https://www.bmtech.com` | `http://localhost:4321, http://127.0.0.1:5500, https://bmtech.com, https://www.bmtech.com` |
| `SES_REGION` | No | Region containing the SES identity. Defaults to Lambda's managed `AWS_REGION`. | `us-east-2` | `us-east-2` |
| `CONTACT_SUBJECT_PREFIX` | No | Email subject prefix. Defaults to `Website contact`. | `BMTech Website Contact` | `BMTech Website Contact` |
| `HONEYPOT_DEBUG` | No | Exactly `true` exposes the diagnostic `422` honeypot response. Any other value silently discards honeypot submissions and returns normal success. | `false` | `false` |
