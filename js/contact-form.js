(() => {
  "use strict";

  const REQUEST_TIMEOUT_MS = 15000;
  const SUBJECTS = new Set(["Inquiry", "Career", "Security", "Other"]);
  const messages = {
    en: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      subject: "Please select a subject.",
      message: "Please enter a message of at least 10 characters."
    },
    ja: {
      name: "お名前を入力してください。",
      email: "有効なメールアドレスを入力してください。",
      subject: "件名を選択してください。",
      message: "お問い合わせ内容を10文字以上で入力してください。"
    }
  };

  const isConfiguredEndpoint = (endpoint) => {
    try {
      const url = new URL(endpoint);
      const hostname = url.hostname.toLowerCase();
      const isLocalDevelopment = hostname === "localhost" ||
        hostname === "127.0.0.1" || hostname === "::1";
      const usesAllowedProtocol = url.protocol === "https:" ||
        (isLocalDevelopment && url.protocol === "http:");
      return usesAllowedProtocol &&
        !hostname.includes("your_api_id") &&
        !hostname.includes("your_region");
    } catch (_error) {
      return false;
    }
  };

  const setFieldValidity = (form, locale) => {
    const copy = messages[locale] || messages.en;
    const name = form.elements.name;
    const email = form.elements.email;
    const subject = form.elements.subject;
    const message = form.elements.message;

    [name, email, subject, message].forEach((field) => field.setCustomValidity(""));

    if (!name.value.trim()) {
      name.setCustomValidity(copy.name);
    }
    if (!email.value.trim() || !email.validity.valid) {
      email.setCustomValidity(copy.email);
    }
    if (!SUBJECTS.has(subject.value)) {
      subject.setCustomValidity(copy.subject);
    }
    if (message.value.trim().length < 10) {
      message.setCustomValidity(copy.message);
    }
  };

  const setSubmitting = (form, submitting) => {
    const submit = form.querySelector('[type="submit"]');
    if (!submit) return;

    if (submitting) {
      submit.dataset.originalValue = submit.value;
      submit.value = submit.dataset.wait || submit.value;
      submit.disabled = true;
      form.setAttribute("aria-busy", "true");
    } else {
      submit.value = submit.dataset.originalValue || submit.value;
      submit.disabled = false;
      form.removeAttribute("aria-busy");
    }
  };

  const showResult = (form, successMessage, errorMessage, succeeded) => {
    successMessage.hidden = !succeeded;
    errorMessage.hidden = succeeded;

    if (succeeded) {
      form.reset();
      form.hidden = true;
      successMessage.focus();
    } else {
      errorMessage.focus();
    }
  };

  const buildPayload = (form) => ({
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    phone: form.elements.phone.value.trim(),
    subject: form.elements.subject.value,
    message: form.elements.message.value.trim(),
    locale: form.dataset.locale || document.documentElement.lang || "en",
    pageUrl: window.location.href,
    submittedAt: new Date().toISOString()
  });

  document.querySelectorAll(".js-contact-form").forEach((form) => {
    const container = form.closest(".form-main");
    const successMessage = container && container.querySelector(".success-message");
    const errorMessage = container && container.querySelector(".error-message");

    if (!successMessage || !errorMessage) return;

    form.addEventListener("input", (event) => {
      if (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        event.target.setCustomValidity("");
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      successMessage.hidden = true;
      errorMessage.hidden = true;

      const locale = form.dataset.locale || "en";
      setFieldValidity(form, locale);
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const endpoint = form.action;
      if (!isConfiguredEndpoint(endpoint)) {
        console.error("Contact form API endpoint is not configured.");
        showResult(form, successMessage, errorMessage, false);
        return;
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      setSubmitting(form, true);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          mode: "cors",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(buildPayload(form)),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Contact API returned HTTP ${response.status}.`);
        }

        showResult(form, successMessage, errorMessage, true);
      } catch (error) {
        console.error("Contact form submission failed.", error);
        showResult(form, successMessage, errorMessage, false);
      } finally {
        window.clearTimeout(timeout);
        setSubmitting(form, false);
      }
    });
  });
})();
