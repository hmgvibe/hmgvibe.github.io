(() => {
  const root = document.documentElement;
  const hans = root.lang === "zh-Hans";
  const text = hans
    ? { light: "浅色模式", dark: "深色模式", switchTo: "切换至" }
    : { light: "淺色模式", dark: "深色模式", switchTo: "切換至" };

  // Language: on a first visit, follow the browser's Chinese script once.
  // After that (or after using the switch) the visitor stays where they go.
  const langKey = "hmgvibe-lang";
  const pageLang = hans ? "zh-Hans" : "zh-Hant";

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Browser storage is optional; the page works without it.
    }
  }

  function browserScript() {
    for (const tag of navigator.languages || [navigator.language]) {
      const lower = String(tag || "").toLowerCase();
      if (!lower.startsWith("zh")) continue;
      return /hant|-tw|-hk|-mo/.test(lower) ? "zh-Hant" : "zh-Hans";
    }
    return null;
  }

  function counterpartPath(target) {
    const path = location.pathname;
    return target === "zh-Hans" ? `/zh-hans${path}` : path.replace(/^\/zh-hans(?=\/)/, "");
  }

  const savedLang = readStorage(langKey);
  if (savedLang !== "zh-Hans" && savedLang !== "zh-Hant") {
    const detected = browserScript();
    writeStorage(langKey, detected ?? pageLang);
    if (detected && detected !== pageLang && /^https?:$/.test(location.protocol)) {
      location.replace(counterpartPath(detected) + location.search + location.hash);
    }
  }

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const storageKey = "hmgvibe-theme";
  let preference = null;

  const stored = readStorage(storageKey);
  if (stored === "dark" || stored === "light") preference = stored;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content =
      theme === "dark" ? "#1f4035" : "#2f5d4f";

    const button = document.querySelector(".theme-toggle");
    if (!button) return;
    const dark = theme === "dark";
    const label = dark ? text.light : text.dark;
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", `${text.switchTo}${label}`);
    button.title = `${text.switchTo}${label}`;
    button.querySelector(".theme-label").textContent = label;
  }

  function applyPreference() {
    applyTheme(preference ?? (systemTheme.matches ? "dark" : "light"));
  }

  // Runs before styles load to avoid showing the wrong theme on first paint.
  applyPreference();
  systemTheme.addEventListener("change", () => {
    if (preference === null) applyPreference();
  });

  document.addEventListener("DOMContentLoaded", () => {
    applyPreference();
    document.querySelector(".theme-toggle").addEventListener("click", () => {
      preference = root.dataset.theme === "dark" ? "light" : "dark";
      writeStorage(storageKey, preference);
      applyTheme(preference);
    });

    const langSwitch = document.querySelector(".lang-switch");
    if (langSwitch) {
      langSwitch.addEventListener("click", () => {
        writeStorage(langKey, langSwitch.dataset.lang);
        // Keep the visitor at the same section in the other language.
        if (location.hash) langSwitch.href = langSwitch.href.split("#")[0] + location.hash;
      });
    }
  });
})();
