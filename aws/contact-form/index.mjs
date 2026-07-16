import { randomUUID } from "node:crypto";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const MAX_BODY_BYTES = 64 * 1024;
const SUBJECTS = new Set(["Inquiry", "Career", "Security", "Other"]);

const AWS_REGION = process.env.SES_REGION || process.env.AWS_REGION;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "";
const CONTACT_SUBJECT_PREFIX = process.env.CONTACT_SUBJECT_PREFIX || "Website contact";
const HONEYPOT_DEBUG = process.env.HONEYPOT_DEBUG === "false";

const ses = new SESClient(AWS_REGION ? { region: AWS_REGION } : {});

const responseHeaders = (origin) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    Vary: "Origin"
  };

  if (origin && origin === ALLOWED_ORIGIN) {
    headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "600";
  }

  return headers;
};

const jsonResponse = (statusCode, payload, origin, extraHeaders = {}) => ({
  statusCode,
  headers: {
    ...responseHeaders(origin),
    ...extraHeaders
  },
  body: JSON.stringify(payload)
});

const emptyResponse = (statusCode, origin) => ({
  statusCode,
  headers: responseHeaders(origin),
  body: ""
});

const normalizedHeaders = (headers = {}) => Object.fromEntries(
  Object.entries(headers).map(([name, value]) => [name.toLowerCase(), value])
);

const parseJsonBody = (event) => {
  const encodedBody = event.body == null ? "" : String(event.body);
  const body = event.isBase64Encoded
    ? Buffer.from(encodedBody, "base64").toString("utf8")
    : encodedBody;

  if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
    throw Object.assign(new Error("Request body is too large."), { statusCode: 413 });
  }

  try {
    return JSON.parse(body);
  } catch (_error) {
    throw Object.assign(new Error("Request body must contain valid JSON."), { statusCode: 400 });
  }
};

const validateSubmission = (payload) => {
  const errors = {};

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      errors: { body: "The request body must be a JSON object." },
      submission: null
    };
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const website = payload.website == null ? "" : String(payload.website);
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const subject = typeof payload.subject === "string" ? payload.subject : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const locale = typeof payload.locale === "string" ? payload.locale : "en";
  const pageUrl = typeof payload.pageUrl === "string" ? payload.pageUrl : "";
  const submittedAt = typeof payload.submittedAt === "string" ? payload.submittedAt : "";

  if (website) {
    errors.website = "Submission rejected.";
  }

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > 256) {
    errors.name = "Name must be 256 characters or fewer.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (email.length > 256 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "A valid email address is required.";
  }

  if (phone.length > 50) {
    errors.phone = "Phone must be 50 characters or fewer.";
  }

  if (!SUBJECTS.has(subject)) {
    errors.subject = "Subject must be Inquiry, Career, Security, or Other.";
  }

  if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (message.length > 5000) {
    errors.message = "Message must be 5,000 characters or fewer.";
  }

  if (locale !== "en" && locale !== "ja") {
    errors.locale = "Locale must be en or ja.";
  }

  if (pageUrl.length > 2048) {
    errors.pageUrl = "Page URL is too long.";
  }

  if (submittedAt && Number.isNaN(Date.parse(submittedAt))) {
    errors.submittedAt = "submittedAt must be a valid ISO date string.";
  }

  return {
    errors,
    submission: {
      name,
      email,
      phone,
      subject,
      message,
      locale,
      pageUrl,
      submittedAt
    }
  };
};

const configurationErrors = () => {
  const missing = [];

  if (!CONTACT_FROM_EMAIL) missing.push("CONTACT_FROM_EMAIL");
  if (!CONTACT_TO_EMAIL) missing.push("CONTACT_TO_EMAIL");
  if (!ALLOWED_ORIGIN) missing.push("ALLOWED_ORIGIN");

  return missing;
};

const emailBody = (submission, submissionId, requestId) => [
  "A contact form submission was received.",
  "",
  `Submission ID: ${submissionId}`,
  `Request ID: ${requestId}`,
  `Name: ${submission.name}`,
  `Email: ${submission.email}`,
  `Phone: ${submission.phone || "Not provided"}`,
  `Subject: ${submission.subject}`,
  `Locale: ${submission.locale}`,
  `Page URL: ${submission.pageUrl || "Not provided"}`,
  `Submitted at: ${submission.submittedAt || "Not provided"}`,
  "",
  "Message:",
  submission.message
].join("\n");

const sendContactEmail = async (submission, submissionId, requestId) => {
  const command = new SendEmailCommand({
    Source: CONTACT_FROM_EMAIL,
    Destination: {
      ToAddresses: [CONTACT_TO_EMAIL]
    },
    ReplyToAddresses: [submission.email],
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: `${CONTACT_SUBJECT_PREFIX}: ${submission.subject}`
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: emailBody(submission, submissionId, requestId)
        }
      }
    }
  });

  return ses.send(command);
};

export const handler = async (event, context) => {
  const requestId = event?.requestContext?.requestId
    || context?.awsRequestId
    || randomUUID();
  const headers = normalizedHeaders(event?.headers);
  const origin = headers.origin || "";
  const method = event?.requestContext?.http?.method || "";
  const path = event?.rawPath || event?.requestContext?.http?.path || "";

  if (origin && origin !== ALLOWED_ORIGIN) {
    return jsonResponse(403, {
      success: false,
      error: "Origin is not allowed.",
      requestId
    }, origin);
  }

  if (method === "OPTIONS") {
    if (path !== "/contact") {
      return jsonResponse(404, {
        success: false,
        error: "Route not found.",
        requestId
      }, origin);
    }

    return emptyResponse(204, origin);
  }

  if (path !== "/contact") {
    return jsonResponse(404, {
      success: false,
      error: "Route not found.",
      requestId
    }, origin);
  }

  if (method !== "POST") {
    return jsonResponse(405, {
      success: false,
      error: "Method not allowed. Use POST.",
      requestId
    }, origin, { Allow: "POST, OPTIONS" });
  }

  const contentType = headers["content-type"] || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(415, {
      success: false,
      error: "Content-Type must be application/json.",
      requestId
    }, origin);
  }

  try {
    const payload = parseJsonBody(event);
    const honeypotFilled = payload
      && typeof payload === "object"
      && !Array.isArray(payload)
      && payload.website != null
      && String(payload.website).length > 0;

    if (honeypotFilled) {
      console.warn(JSON.stringify({
        event: "honeypot_submission",
        requestId
      }));

      if (!HONEYPOT_DEBUG) {
        return jsonResponse(201, {
          success: true,
          message: "Contact submission received.",
          submissionId: randomUUID()
        }, origin);
      }
    }

    const { errors, submission } = validateSubmission(payload);

    if (Object.keys(errors).length > 0) {
      return jsonResponse(422, {
        success: false,
        error: "Validation failed.",
        errors,
        requestId
      }, origin);
    }

    const missingConfiguration = configurationErrors();
    if (missingConfiguration.length > 0) {
      console.error(JSON.stringify({
        event: "contact_configuration_error",
        requestId,
        missing: missingConfiguration
      }));

      return jsonResponse(500, {
        success: false,
        error: "Internal server error.",
        requestId
      }, origin);
    }

    const submissionId = randomUUID();
    const sesResponse = await sendContactEmail(submission, submissionId, requestId);

    console.log(JSON.stringify({
      event: "contact_email_sent",
      requestId,
      submissionId,
      sesMessageId: sesResponse.MessageId
    }));

    return jsonResponse(201, {
      success: true,
      message: "Contact submission received.",
      submissionId
    }, origin);
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;

    if (statusCode === 500) {
      console.error(JSON.stringify({
        event: "contact_handler_error",
        requestId,
        errorName: error?.name || "Error"
      }));
    }

    return jsonResponse(statusCode, {
      success: false,
      error: statusCode === 500 ? "Internal server error." : error.message,
      requestId
    }, origin);
  }
};
