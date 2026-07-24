# Deployment

## Production environment

| Component | Configuration |
| --- | --- |
| Hosting | AWS Lightsail |
| Operating system | Debian 12 |
| Web server | Nginx |
| Repository clone | `/home/admin/bmtechsite` |
| Nginx document root | `/usr/share/nginx/html` |
| Astro build output | `dist/` |
| AWS region | `us-east-2` |

The production website is a static Astro build. Node.js is used only to build the site on the server. Nginx serves the generated files directly from the document root.

---

## Routine deployment

Commit and push changes from the local development machine first.

On the Lightsail terminal:

```sh
cd ~/bmtechsite
git checkout main
git pull origin main
npm ci
npm run build
sudo rm -rf /usr/share/nginx/html/*
sudo cp -a dist/. /usr/share/nginx/html/
sudo nginx -t
sudo systemctl reload nginx
curl -Ik -H "Host: bmtech.com" https://localhost
```

Expected results:

- `sudo nginx -t`

```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

- `curl -Ik -H "Host: bmtech.com" https://localhost`

```
HTTP/1.1 200 OK
```

Optionally verify the deployed commit:

```sh
git log -1 --oneline
```

---

## Dependency changes

If `package.json` or `package-lock.json` changes:

```sh
cd ~/bmtechsite
git pull origin main
npm ci
npm run build
```

Use `npm ci` for all production deployments to ensure a clean, lockfile-based installation.

---

## Deployment verification

Verify the following pages:

- `/`
- `/ja/`
- `/products`
- `/ja/products`
- `/contact`
- `/ja/contact`
- `/security-vuln`
- `/ja/security-vuln`
- at least one English product page
- at least one Japanese product page
- an unknown URL (verify the custom 404 page)

Also verify:

- Language switcher
- Product carousel
- Contact form
- Browser console has no JavaScript errors
- Network tab shows no missing CSS, JS, images, fonts, or videos

---

## Backup

Before a risky deployment:

```sh
sudo cp -a \
/usr/share/nginx/html \
/usr/share/nginx/html-backup-$(date +%Y%m%d-%H%M%S)
```

---

## Rollback

List backups:

```sh
ls -d /usr/share/nginx/html-backup-*
```

Restore a backup:

```sh
sudo rm -rf /usr/share/nginx/html
sudo cp -a <backup-directory> /usr/share/nginx/html
sudo nginx -t
sudo systemctl reload nginx
```

Verify:

```sh
curl -Ik -H "Host: bmtech.com" https://localhost
```

---

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

Changes to Lambda or API Gateway do **not** require redeploying the Astro website unless the frontend code changes.

### Lambda production values

```text
CONTACT_FROM_EMAIL=info@bmtech.com
CONTACT_TO_EMAIL=info@bmtech.com
ALLOWED_ORIGINS=https://bmtech.com,https://www.bmtech.com
SES_REGION=us-east-2
CONTACT_SUBJECT_PREFIX=BMTech Website Contact
HONEYPOT_DEBUG=false
```

Do not include spaces after commas in `ALLOWED_ORIGINS`.

### API Gateway CORS

Allowed origins:

```text
https://bmtech.com
https://www.bmtech.com
```

Allowed methods:

```text
POST
OPTIONS
```

Allowed headers:

```text
Content-Type
```

---

## Production contact test

After updating Lambda or API Gateway:

1. Submit a test message from the English contact page.
2. Confirm the browser receives a successful response.
3. Confirm the email arrives at `info@bmtech.com`.
4. Verify replies go to the visitor's email address.
5. Repeat from the Japanese contact page.

---

## Documentation-only changes

Documentation is not included in the generated Astro site.

To update the repository clone after documentation-only changes:

```sh
cd ~/bmtechsite
git pull origin main
```

No build, deployment, or Nginx reload is required.
