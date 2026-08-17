(function () {
  "use strict";

  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  var STORAGE_KEY = "scc_utm";

  function captureUtm() {
    var params = new URLSearchParams(window.location.search);
    var hasUtm = UTM_KEYS.some(function (key) {
      return params.has(key);
    });
    if (!hasUtm) return;

    var stored = {};
    UTM_KEYS.forEach(function (key) {
      if (params.has(key)) stored[key] = params.get(key);
    });
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (e) {
      /* localStorage unavailable, ignore */
    }
  }

  function getStoredUtm() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function setFormMessage(form, text, isError) {
    var msg = form.querySelector(".form-status-message");
    if (!msg) {
      msg = document.createElement("p");
      msg.className = "form-status-message";
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.color = isError ? "#b3261e" : "#0d2b45";
    msg.style.marginTop = "0.75rem";
  }

  function handleSubmit(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      var utm = getStoredUtm();
      data.utm_source = utm.utm_source || "";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (response) {
          return response.json().then(function (json) {
            return { ok: response.ok, json: json };
          });
        })
        .then(function (result) {
          if (result.ok) {
            window.location.href = "/thank-you/";
            return;
          }
          setFormMessage(form, result.json && result.json.error ? result.json.error : "Something went wrong. Please call us instead.", true);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
          }
        })
        .catch(function () {
          setFormMessage(form, "Something went wrong. Please call (866) 958-8773 instead.", true);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
          }
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    captureUtm();
    document.querySelectorAll("form[data-lead-form]").forEach(handleSubmit);
  });
})();
