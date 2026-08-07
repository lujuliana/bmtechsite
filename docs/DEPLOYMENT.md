# Deployment

## Production environment

The documented production configuration is:

| Component | Configuration |
| --- | --- |
| Hosting | AWS Lightsail |
| Operating system | Debian 12 |
| Web server | Nginx |
| AWS region | `us-east-2` |
| Repository | `/home/admin/bmtechsite` |
| Build output | `/home/admin/bmtechsite/dist` |
| Nginx document root | `/usr/share/nginx/html/bmtechco.webflow` |

The production deployment consists of two locations:

- **Repository:** `/home/admin/bmtechsite` contains the Astro source code, Git repository, and build tools. All Git operations and builds are performed here.
- **Document root:** `/usr/share/nginx/html/bmtechco.webflow` is the directory served by Nginx. It should contain only the generated contents of `dist/`.

The production build is generated on the Lightsail server using Node.js 20 or later. Nginx serves the static files produced by Astro.

## Server prerequisites

The deployment commands assume the following tools are installed on the Lightsail server:

- Git
- Node.js 20+
- npm
- rsync
- curl
- Nginx

Verify the required tools:

```sh
command -v git node npm rsync curl nginx
```

## Routine static-site deployment

Commit and push the intended revision first. On the Lightsail server, deploy from the production branch (main) unless intentionally deploying a different revision.

```sh
cd /home/admin/bmtechsite

git fetch origin
git checkout main
git pull --ff-only origin main

git show --stat --oneline HEAD                                        # shows latest commit msg + changes

npm ci
npm run check                                                         # optional. ignore returned hints
npm run build

sudo rsync -ai --delete dist/ /usr/share/nginx/html/bmtechco.webflow/

sudo nginx -t                                                        # expected: success msgs
sudo systemctl reload nginx

curl -Ik --resolve bmtech.com:443:127.0.0.1 https://bmtech.com/      # expected: successful HTTP 200 response

git log -1 --oneline                                                 # optional; records deployed revision
```

`rsync --delete` synchronizes the Nginx document root with the latest build and removes obsolete files from previous deployments.

`npm ci` is appropriate for every production deployment because it installs exactly what `package-lock.json` specifies. A dependency-only change still requires a new build and file copy.

## Deployment verification

Verify at least these routes:

- `/` and `/ja/`
- `/products` and `/ja/products`
- at least one English and one Japanese product detail page
- `/careers` and one open career detail page
- `/contact` and `/ja/contact`
- `/security-vuln` and `/ja/security-vuln`
- an unknown URL, confirming the not-found experience

Also verify:

- The language menu only appears when an equivalent localized page exists.
- Active navigation state.
- Product carousel controls.
- Reduced-motion behavior.
- Browser console/network requests for missing assets or JavaScript errors.

Submit a contact-form test only if the production backend is intended to receive it.

## Backup and rollback

Before a risky deployment, create a timestamped copy outside the live document root:

```sh
sudo cp -a /usr/share/nginx/html/bmtechco.webflow /usr/share/nginx/html/bmtechco.webflow-backup-$(date +%Y%m%d-%H%M%S)
```

List backups:

```sh
ls -d /usr/share/nginx/html/bmtechco.webflow-backup-*
```

To restore a selected backup, first confirm the exact backup directory, then replace the live root. Replace `YYYYMMDD-HHMMSS` with the backup's timestamp:

```sh
BACKUP=/usr/share/nginx/html/bmtechco.webflow-backup-YYYYMMDD-HHMMSS

sudo test -d "$BACKUP" || exit 1
sudo rm -rf /usr/share/nginx/html/bmtechco.webflow
sudo cp -a "$BACKUP" /usr/share/nginx/html/bmtechco.webflow

sudo nginx -t
sudo systemctl reload nginx

curl -Ik --resolve bmtech.com:443:127.0.0.1 https://bmtech.com/
```

## Contact-form backend

The contact backend is deployed independently from the static site:

```text
Website -> API Gateway (POST /contact) -> Lambda -> Amazon SES
```

The frontend endpoint is configured in `src/components/ContactForm.astro`. If that endpoint changes, update the frontend and redeploy the static site. Lambda-only or API Gateway-only changes do not require a static-site deployment.

### Lambda configuration

Configure the production Lambda with these documented values:

```text
CONTACT_FROM_EMAIL=info@bmtech.com
CONTACT_TO_EMAIL=info@bmtech.com
ALLOWED_ORIGINS=https://bmtech.com,https://www.bmtech.com
SES_REGION=us-east-2
CONTACT_SUBJECT_PREFIX=BMTech Website Contact
HONEYPOT_DEBUG=false
```

`CONTACT_FROM_EMAIL` must be verified in SES. Keep `ALLOWED_ORIGINS` as exact comma-separated origins, with no trailing slash; the handler trims incidental spaces but deployment configuration should remain unambiguous. Ensure the Lambda execution role can send through the configured SES identity in `SES_REGION`.

### API Gateway CORS

Allow these origins:

```text
https://bmtech.com
https://www.bmtech.com
```

Allow methods `POST` and `OPTIONS`, and the `Content-Type` request header. Keep API Gateway CORS aligned with the Lambda's `ALLOWED_ORIGINS` list.

### Backend verification

After changing Lambda or API Gateway:

1. Run the Lambda package check in `aws/contact-form/` with `npm run check` before deployment.
2. Confirm CORS preflight succeeds from an allowed origin.
3. Submit a valid English and Japanese contact form.
4. Confirm each response succeeds, the email reaches `info@bmtech.com`, and replies target the visitor address.
5. Confirm an unapproved origin is rejected and a filled honeypot does not deliver email.

## Documentation-only changes

Documentation is not included in the generated site. Updating only repository documentation requires only updating the server clone if desired; no build, file copy, or Nginx reload is necessary.
