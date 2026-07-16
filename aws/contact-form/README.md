# Contact Form Lambda Deployment

This directory contains the AWS Lambda backend for the static contact forms. The handler accepts API Gateway HTTP API payload format `2.0`, validates the existing JSON contract, and sends valid submissions through Amazon SES.

## Files

- `index.mjs` — Lambda handler exported as `index.handler`.
- `package.json` — production dependency and syntax-check script.
- `test-event.json` — API Gateway HTTP API v2 event for Lambda console testing.

## Prerequisites

- An AWS account and AWS CLI credentials if deploying from the command line.
- Node.js 20 or newer and npm for packaging.
- A verified Amazon SES email or domain identity.
- An IAM execution role trusted by `lambda.amazonaws.com`.

Use the same AWS Region for Lambda and the SES identity unless `SES_REGION` explicitly points Lambda to the identity's Region.

## Environment variables

Configure these under **Lambda → Configuration → Environment variables**. Do not place AWS access keys in environment variables; Lambda obtains temporary credentials from its execution role.

| Variable | Required | Description |
| --- | --- | --- |
| `CONTACT_FROM_EMAIL` | Yes | SES-verified sender address. User input is never used as the sender. |
| `CONTACT_TO_EMAIL` | Yes | Address that receives contact submissions. |
| `ALLOWED_ORIGIN` | Yes | Exact website origin allowed by CORS, such as `https://www.example.com`; omit a trailing slash. |
| `SES_REGION` | No | Region containing the SES identity. Defaults to Lambda's managed `AWS_REGION`. |
| `CONTACT_SUBJECT_PREFIX` | No | Email subject prefix. Defaults to `Website contact`. |
| `HONEYPOT_DEBUG` | No | Exactly `true` exposes the diagnostic `422` honeypot response. Any other value silently discards honeypot submissions and returns normal success. |

Start with `HONEYPOT_DEBUG=false` or leave it unset in production.

## SES setup

1. Open **Amazon SES** in the deployment Region.
2. Under **Configuration → Identities**, create and verify a domain identity (recommended) or an email identity.
3. Set `CONTACT_FROM_EMAIL` to an address covered by that verified identity.
4. If the SES account is still in the sandbox, verify `CONTACT_TO_EMAIL` too. Sandbox accounts can send only to verified recipients or the SES mailbox simulator.
5. Request production access from **Account dashboard** before sending to unverified recipients.

The submitted contact address is used as SES `ReplyToAddresses`; it is not used as the message source and does not need to be an SES verified identity.

AWS reference: [Creating and verifying identities in Amazon SES](https://docs.aws.amazon.com/ses/latest/dg/verify-addresses-and-domains.html).

## IAM permissions

The Lambda execution role needs CloudWatch Logs permissions and permission to call SES `SendEmail`.

Attach the AWS-managed `AWSLambdaBasicExecutionRole` policy for logs. Then add this least-privilege inline policy, replacing the Region, account ID, and identity name with the verified SES identity used by `CONTACT_FROM_EMAIL`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SendContactEmail",
      "Effect": "Allow",
      "Action": "ses:SendEmail",
      "Resource": "arn:aws:ses:us-east-1:123456789012:identity/example.com"
    }
  ]
}
```

For an email identity, use the complete email address after `identity/`. The role's trust policy must allow the Lambda service to assume it:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

AWS references: [SES actions and resource types](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonses.html) and [Lambda execution roles](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html).

## Package the function

AWS recommends including the AWS SDK v3 clients used by a function in its deployment package. From this directory:

```powershell
npm install --omit=dev
npm run check
Compress-Archive `
  -Path index.mjs, package.json, node_modules `
  -DestinationPath contact-form-lambda.zip `
  -Force
```

The ZIP root must contain `index.mjs`, `package.json`, and `node_modules`; do not zip the parent `contact-form` directory itself.

AWS reference: [Deploy Node.js Lambda functions with ZIP archives](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html).

## Create and configure Lambda

### AWS console

1. Open **Lambda → Create function → Author from scratch**.
2. Select a supported Node.js runtime, preferably Node.js 22.x or newer.
3. Select the execution role configured above.
4. Create the function and upload `contact-form-lambda.zip` under **Code → Upload from → .zip file**.
5. Confirm the handler is `index.handler` under **Runtime settings**.
6. Add the environment variables listed above.
7. Set the timeout to at least 10 seconds and save.

### AWS CLI

Replace the placeholders before running:

```powershell
$FunctionName = "bmtech-contact-form"
$Region = "us-east-1"
$RoleArn = "arn:aws:iam::123456789012:role/bmtech-contact-form-lambda"

aws lambda create-function `
  --function-name $FunctionName `
  --region $Region `
  --runtime nodejs22.x `
  --handler index.handler `
  --role $RoleArn `
  --timeout 10 `
  --zip-file fileb://contact-form-lambda.zip
```

Configure environment variables in the Lambda console to avoid shell-quoting mistakes. For later code deployments:

```powershell
aws lambda update-function-code `
  --function-name $FunctionName `
  --region $Region `
  --zip-file fileb://contact-form-lambda.zip
```

## Test Lambda directly

Before testing, change the `origin` values in `test-event.json` and `ALLOWED_ORIGIN` to the same deployed website origin. Also use an inbox allowed by the current SES sandbox status.

In the Lambda console, open **Test**, create a new event, paste `test-event.json`, and invoke it. A successful invocation returns status `201` and a JSON body containing `success: true` and a `submissionId`. Confirm delivery and inspect `/aws/lambda/<function-name>` in CloudWatch Logs.

CLI equivalent:

```powershell
aws lambda invoke `
  --function-name $FunctionName `
  --region $Region `
  --cli-binary-format raw-in-base64-out `
  --payload file://test-event.json `
  lambda-response.json

Get-Content lambda-response.json
```

## API Gateway HTTP API setup

The handler owns CORS and `OPTIONS` responses. Leave API Gateway managed CORS **disabled**; enabling it causes API Gateway to ignore CORS headers returned by the Lambda integration.

1. Open **API Gateway → Create API → HTTP API → Build**.
2. Add this Lambda function as an integration.
3. Create a `POST /contact` route using the Lambda integration.
4. Create an `OPTIONS /contact` route using the same integration.
5. Confirm the integration payload format version is `2.0`.
6. Create a `$default` stage with automatic deployment, or deploy to a named stage.
7. Do not enable API Gateway's CORS configuration.
8. If the console does not add it automatically, grant API Gateway permission to invoke the Lambda function.

The endpoint is:

```text
https://API_ID.execute-api.REGION.amazonaws.com/contact
```

For a named stage, include the stage name before `/contact`. Test preflight and submission after deployment:

```powershell
$ApiUrl = "https://API_ID.execute-api.REGION.amazonaws.com/contact"
$Origin = "https://www.example.com"

Invoke-WebRequest `
  -Uri $ApiUrl `
  -Method Options `
  -Headers @{
    Origin = $Origin
    "Access-Control-Request-Method" = "POST"
    "Access-Control-Request-Headers" = "content-type"
  }
```

AWS references: [Lambda proxy integrations for HTTP APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html) and [HTTP API CORS behavior](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html).

## Final checks

- SES sender identity is verified in `SES_REGION`.
- SES production access is approved, or the recipient is verified while in the sandbox.
- Execution role has `AWSLambdaBasicExecutionRole` and restricted `ses:SendEmail` access.
- Lambda handler is `index.handler` and payload format is `2.0`.
- `ALLOWED_ORIGIN` exactly matches the site's browser origin.
- API Gateway managed CORS is disabled and both routes target Lambda.
- `HONEYPOT_DEBUG` is not `true` in production.
- The deployed frontend form action is updated separately to the API Gateway `/contact` URL.
