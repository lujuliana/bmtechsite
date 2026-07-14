import http from "node:http";
import { randomUUID } from "node:crypto";

const PORT = 3000;
const ALLOWED_ORIGIN = "http://127.0.0.1:5500";
const MAX_BODY_BYTES = 64 * 1024;
const SUBJECTS = new Set(["Inquiry", "Career", "Security", "Other"]);
const HONEYPOT_DEBUG = process.env.HONEYPOT_DEBUG === "true";

const setCorsHeaders = (response, origin) => {
  response.setHeader("Vary", "Origin");
  if (origin === ALLOWED_ORIGIN) {
    response.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Max-Age", "600");
  }
};

const sendJson = (response, statusCode, payload, origin) => {
  setCorsHeaders(response, origin);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
};

const readJsonBody = (request) => new Promise((resolve, reject) => {
  let body = "";
  let byteLength = 0;
  let tooLarge = false;

  request.setEncoding("utf8");
  request.on("data", (chunk) => {
    byteLength += Buffer.byteLength(chunk, "utf8");
    if (byteLength > MAX_BODY_BYTES) {
      tooLarge = true;
      return;
    }
    body += chunk;
  });

  request.on("end", () => {
    if (tooLarge) {
      reject(Object.assign(new Error("Request body is too large."), { statusCode: 413 }));
      return;
    }

    try {
      resolve(JSON.parse(body));
    } catch (_error) {
      reject(Object.assign(new Error("Request body must contain valid JSON."), { statusCode: 400 }));
    }
  });

  request.on("error", reject);
});

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

const server = http.createServer(async (request, response) => {
  const requestId = randomUUID();
  const origin = request.headers.origin || "";
  const url = new URL(request.url || "/", "http://localhost");

  if (origin && origin !== ALLOWED_ORIGIN) {
    sendJson(response, 403, {
      success: false,
      error: "Origin is not allowed.",
      requestId
    }, origin);
    return;
  }

  if (request.method === "OPTIONS") {
    if (url.pathname !== "/contact") {
      sendJson(response, 404, {
        success: false,
        error: "Route not found.",
        requestId
      }, origin);
      return;
    }

    setCorsHeaders(response, origin);
    response.writeHead(204);
    response.end();
    return;
  }

  if (url.pathname !== "/contact") {
    sendJson(response, 404, {
      success: false,
      error: "Route not found.",
      requestId
    }, origin);
    return;
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    sendJson(response, 405, {
      success: false,
      error: "Method not allowed. Use POST.",
      requestId
    }, origin);
    return;
  }

  const contentType = request.headers["content-type"] || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    sendJson(response, 415, {
      success: false,
      error: "Content-Type must be application/json.",
      requestId
    }, origin);
    return;
  }

  try {
    const payload = await readJsonBody(request);
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
        sendJson(response, 201, {
          success: true,
          message: "Contact submission received.",
          submissionId: randomUUID()
        }, origin);
        return;
      }
    }

    const { errors, submission } = validateSubmission(payload);

    if (Object.keys(errors).length > 0) {
      sendJson(response, 422, {
        success: false,
        error: "Validation failed.",
        errors,
        requestId
      }, origin);
      return;
    }

    const submissionId = randomUUID();
    console.log("\nContact submission received:");
    console.log(JSON.stringify({
      submissionId,
      receivedAt: new Date().toISOString(),
      ...submission
    }, null, 2));

    sendJson(response, 201, {
      success: true,
      message: "Contact submission received.",
      submissionId
    }, origin);
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    sendJson(response, statusCode, {
      success: false,
      error: statusCode === 500 ? "Internal server error." : error.message,
      requestId
    }, origin);

    if (statusCode === 500) {
      console.error("Unexpected contact API error:", error);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Local contact API listening on http://localhost:${PORT}`);
  console.log(`Allowed browser origin: ${ALLOWED_ORIGIN}`);
});
