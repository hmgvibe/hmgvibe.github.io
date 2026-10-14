(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const storageKey = "hmgvibe-theme";
  let preference = null;

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light") preference = stored;
  } catch {
    // The switch still works when browser storage is unavailable.
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content =
      theme === "dark" ? "#0c1015" : "#f5f4ef";

    const button = document.querySelector(".theme-toggle");
    if (!button) return;
    const dark = theme === "dark";
    const label = dark ? "淺色模式" : "深色模式";
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", `切換至${label}`);
    button.title = `切換至${label}`;
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
      try {
        localStorage.setItem(storageKey, preference);
      } catch {
        // Keep the selected theme for this page even without persistence.
      }
      applyTheme(preference);
    });
  });
})();
