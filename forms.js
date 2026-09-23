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

  document.addEventListener("DOMContentLoaded", captureUtm);
})();
