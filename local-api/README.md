# Local Contact API

This dependency-free development server receives the JSON payload sent by `js/contact-form.js`. It validates submissions and prints successful messages to the terminal; it does not send email or contain AWS code.

## Requirements

- Node.js 18 or newer
- The static site served from `http://127.0.0.1:5500`

The contact forms are configured to submit to `http://localhost:3000/contact`.

## Start the API

From the project root:

```powershell
node local-api/server.mjs
```

Expected output:

```text
Local contact API listening on http://localhost:3000
Allowed browser origin: http://127.0.0.1:5500
```

Keep this terminal open. Successful form submissions are logged there as formatted JSON.

## Run the website

Serve the project at `http://127.0.0.1:5500`. For example, VS Code Live Server commonly uses that address. Open either:

- `http://127.0.0.1:5500/contact.html`
- `http://127.0.0.1:5500/ja/contact.html`

Submitting a valid form should show the page's existing success message and print the submission to the API terminal.

## Test with PowerShell

Successful request:

```powershell
$body = @{
  name = "Test User"
  email = "test@example.com"
  phone = "+1 214 555 0100"
  subject = "Inquiry"
  message = "This is a local contact form test."
  locale = "en"
  pageUrl = "http://127.0.0.1:5500/contact.html"
  submittedAt = (Get-Date).ToUniversalTime().ToString("o")
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/contact" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ Origin = "http://127.0.0.1:5500" } `
  -Body $body
```

Expected response shape:

```json
{
  "success": true,
  "message": "Contact submission received.",
  "submissionId": "generated-uuid"
}
```

Validation error example:

```powershell
$invalidBody = @{
  name = ""
  email = "not-an-email"
  phone = ""
  subject = "Invalid"
  message = "short"
  locale = "en"
} | ConvertTo-Json

try {
  Invoke-RestMethod `
    -Uri "http://localhost:3000/contact" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{ Origin = "http://127.0.0.1:5500" } `
    -Body $invalidBody
} catch {
  $_.ErrorDetails.Message
}
```

The API returns HTTP `422` with an `errors` object keyed by field name.

## Endpoint behavior

- `POST /contact` accepts JSON submissions.
- `OPTIONS /contact` handles browser CORS preflight.
- Only browser requests from `http://127.0.0.1:5500` are allowed.
- Request bodies are limited to 64 KiB.
- Invalid JSON returns `400`.
- Disallowed origins return `403`.
- Unknown routes return `404`.
- Unsupported methods return `405`.
- Non-JSON requests return `415`.
- Field validation errors return `422`.
- Valid submissions return `201` and are logged to the terminal.

## Accepted JSON fields

| Field | Validation |
| --- | --- |
| `name` | Required, 256 characters maximum |
| `email` | Required, valid email, 256 characters maximum |
| `phone` | Optional, 50 characters maximum |
| `subject` | `Inquiry`, `Career`, `Security`, or `Other` |
| `message` | Required, 10–5,000 characters |
| `locale` | `en` or `ja` |
| `pageUrl` | Optional, 2,048 characters maximum |
| `submittedAt` | Optional valid date string |

Stop the server with `Ctrl+C`.

