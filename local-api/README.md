# Local Contact API

This dependency-free development server receives the JSON payload sent by `js/contact-form.js`. It validates submissions and prints successful messages to the terminal; it does not send email or contain AWS code.

## Requirements

- Node.js 18 or newer
- The static site served from `http://localhost:4321`

The contact forms are configured to submit to `https://r8gtx7aav7.execute-api.us-east-2.amazonaws.com/contact`.

## Start the API

From the project root:

```powershell
node local-api/server.mjs
```

Expected output:

```text
Local contact API listening on http://localhost:3000
Allowed browser origin: http://localhost:4321
```

Keep this terminal open. Successful form submissions are logged there as formatted JSON.

### Honeypot modes

The default mode is production-safe. If the hidden `website` field is filled, the API silently discards the submission, returns the same `201` success response as a legitimate submission, and logs only a privacy-safe event containing the request ID. The submitted contact data is never logged.

To expose honeypot rejection during local testing, start the API with `HONEYPOT_DEBUG=true`:

```powershell
$env:HONEYPOT_DEBUG = "true"
node local-api/server.mjs
```

In debug mode, a filled honeypot returns the existing HTTP `422` validation response. The submission is still discarded and is never included in the successful-submission log. Remove the environment variable to return to production-safe behavior:

```powershell
Remove-Item Env:HONEYPOT_DEBUG
```

## Run the website

Serve the project at `http://localhost:4321`. For example, VS Code Live Server commonly uses that address. Open either:

- `http://localhost:4321/contact`
- `http://localhost:4321/ja/contact`

Submitting a valid form should show the page's existing success message and print the submission to the API terminal.

## Test with PowerShell

Successful request:

```powershell
$body = @{
  website = ""
  name = "Test User"
  email = "test@example.com"
  phone = "+1 214 555 0100"
  subject = "Inquiry"
  message = "This is a local contact form test."
  locale = "en"
  pageUrl = "http://localhost:4321/contact"
  submittedAt = (Get-Date).ToUniversalTime().ToString("o")
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "https://r8gtx7aav7.execute-api.us-east-2.amazonaws.com/contact" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ Origin = "http://localhost:4321" } `
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
  website = ""
  name = ""
  email = "not-an-email"
  phone = ""
  subject = "Invalid"
  message = "short"
  locale = "en"
} | ConvertTo-Json

try {
  Invoke-RestMethod `
    -Uri "https://r8gtx7aav7.execute-api.us-east-2.amazonaws.com/contact" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{ Origin = "http://localhost:4321" } `
    -Body $invalidBody
} catch {
  $_.ErrorDetails.Message
}
```

The API returns HTTP `422` with an `errors` object keyed by field name.

Honeypot request for testing either mode:

```powershell
$honeypotBody = @{
  website = "https://example.invalid"
  name = "Test User"
  email = "test@example.com"
  phone = ""
  subject = "Inquiry"
  message = "This submission should be discarded."
  locale = "en"
} | ConvertTo-Json

try {
  Invoke-RestMethod `
    -Uri "https://r8gtx7aav7.execute-api.us-east-2.amazonaws.com/contact" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{ Origin = "http://localhost:4321" } `
    -Body $honeypotBody
} catch {
  $_.ErrorDetails.Message
}
```

With `HONEYPOT_DEBUG` unset, this returns the normal `201` success response. With `HONEYPOT_DEBUG=true`, it returns `422`. In both modes, the terminal receives only a honeypot event and request ID for this request, never its contact data.

## Endpoint behavior

- `POST /contact` accepts JSON submissions.
- `OPTIONS /contact` handles browser CORS preflight.
- Only browser requests from `http://localhost:4321` are allowed.
- Request bodies are limited to 64 KiB.
- Invalid JSON returns `400`.
- Disallowed origins return `403`.
- Unknown routes return `404`.
- Unsupported methods return `405`.
- Non-JSON requests return `415`.
- Field validation errors return `422`.
- A non-empty `website` honeypot is silently discarded by default while returning the normal `201` success response.
- With `HONEYPOT_DEBUG=true`, a non-empty honeypot returns the diagnostic `422` validation response.
- Honeypot submissions log only a privacy-safe event and request ID; they never enter the successful-submission log.
- Valid submissions return `201` and are logged to the terminal.

## Accepted JSON fields

| Field | Validation |
| --- | --- |
| `website` | Honeypot; must be empty |
| `name` | Required, 256 characters maximum |
| `email` | Required, valid email, 256 characters maximum |
| `phone` | Optional, 50 characters maximum |
| `subject` | `Inquiry`, `Career`, `Security`, or `Other` |
| `message` | Required, 10–5,000 characters |
| `locale` | `en` or `ja` |
| `pageUrl` | Optional, 2,048 characters maximum |
| `submittedAt` | Optional valid date string |

Stop the server with `Ctrl+C`.
