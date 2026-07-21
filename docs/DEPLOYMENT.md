# Deployment

## Production environment

| Component | Configuration |
| --- | --- |
| Hosting | AWS Lightsail |
| Operating system | Debian 12 |
| Web server | Nginx |
| Repository clone | `/home/admin/bmtechsite` |
| Nginx document root | `/usr/share/nginx/html/bmtechco.webflow` |
| Astro build output | `dist/` |
| AWS region | `us-east-2` |

The production website is static. Node.js is used to build the site on the server, but Nginx serves the generated files directly.

## Routine deployment

Push and commit changes from the local development machine first.

On the Lightsail browser terminal:

```sh
cd ~/bmtechsite
git pull
npm run build
sudo rm -rf /usr/share/nginx/html/bmtechco.webflow/*
sudo cp -a dist/. /usr/share/nginx/html/bmtechco.webflow/
sudo nginx -t
sudo systemctl reload nginx
```

`sudo nginx -t` should report that the configuration syntax is valid before Nginx is reloaded.

## Dependency changes

Run `npm install` after `git pull` when `package.json` or `package-lock.json` has changed:

```sh
cd ~/bmtechsite
git pull
npm install
npm run build
```

For a clean, lockfile-based installation, use:

```sh
npm ci
```

## Deployment verification

After deployment, verify:

- `/`
- `/ja/`
- `/products`
- `/ja/products`
- `/contact`
- `/ja/contact`
- `/security-vuln`
- `/ja/security-vuln`
- at least one English product page;
- at least one Japanese product page; and
- an unknown URL to confirm the 404 behavior.

Also inspect the browser console and network panel for missing CSS, JavaScript, images, or videos.

## Backup

Create a timestamped backup before a risky deployment:

```sh
sudo cp -a   /usr/share/nginx/html/bmtechco.webflow   /usr/share/nginx/html/bmtechco.webflow-backup-$(date +%Y%m%d-%H%M%S)
```

## Rollback

List available backups:

```sh
ls -d /usr/share/nginx/html/bmtechco.webflow-backup-*
```

Replace `<backup-directory>` with the selected backup path:

```sh
sudo rm -rf /usr/share/nginx/html/bmtechco.webflow
sudo cp -a <backup-directory> /usr/share/nginx/html/bmtechco.webflow
sudo nginx -t
sudo systemctl reload nginx
```

## Contact-form backend

The contact backend is deployed independently from the static website.

```text
Website
  |
  v
API Gateway
  |
  v
Lambda
  |
  v
Amazon SES
```

Changing Lambda environment variables or API Gateway CORS settings does not require rebuilding or redeploying the Lightsail website.

### Lambda production values

```text
CONTACT_FROM_EMAIL=info@bmtech.com
CONTACT_TO_EMAIL=info@bmtech.com
ALLOWED_ORIGINS=https://bmtech.com,https://www.bmtech.com
SES_REGION=us-east-2
CONTACT_SUBJECT_PREFIX=BMTech Website Contact
HONEYPOT_DEBUG=false
```

Do not include spaces after commas in `ALLOWED_ORIGINS` unless the Lambda explicitly trims each value.

### API Gateway CORS

Allow these origins:

```text
https://bmtech.com
https://www.bmtech.com
```

Allow the methods required by the contact endpoint:

```text
POST
OPTIONS
```

Keep the allowed headers aligned with the browser request, including `Content-Type`.

For an HTTP API with automatic deployment enabled, saved CORS changes normally become active without a separate manual stage deployment. Confirm the stage settings in the AWS console.

## Production contact test

After updating Lambda and API Gateway:

1. Open the live English contact page.
2. Submit a valid test message.
3. Confirm the browser receives a successful response.
4. Confirm the email reaches `info@bmtech.com`.
5. Reply to verify that the visitor's address is used as `Reply-To`.
6. Repeat the test from the Japanese contact page.

No Lightsail deployment is needed unless website code or the configured API endpoint in the frontend changes.

## README-only or documentation-only changes

Documentation files are not part of the generated public website unless explicitly imported by Astro.

To update the repository clone on Lightsail after a documentation-only change:

```sh
cd ~/bmtechsite
git pull
```

A build, file copy, and Nginx reload are not required.
