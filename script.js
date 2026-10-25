(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canHover = window.matchMedia("(hover: hover)");
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Sections settle into place once when they scroll into view.
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    root.classList.add("motion-ready");
    revealItems.forEach(item => observer.observe(item));
  }

  // Tools on the mat: the screen lights up on hover or focus. Touch screens show them lit.
  // With a mouse, one tool (the newest) stays switched on until another one is touched.
  const tools = [...document.querySelectorAll(".tool")];
  const standby = document.querySelector(".tool[data-standby]");
  const active = () => tools.some(tool => tool !== standby && tool.classList.contains("is-lit"));
  function syncStandby() {
    if (!standby || !canHover.matches) return;
    const keep = !active() && !standby.closest("li").classList.contains("is-off");
    standby.classList.toggle("is-lit", keep || standby.matches(":hover, :focus-visible"));
  }
  function lightAll() {
    for (const tool of tools) tool.classList.toggle("is-lit", !canHover.matches);
    syncStandby();
  }
  for (const tool of tools) {
    const on = () => { tool.classList.add("is-lit"); syncStandby(); };
    const off = () => { tool.classList.remove("is-lit"); syncStandby(); };
    // A short pause before switching on, so sweeping across the mat doesn't flash every screen.
    let intent = 0;
    tool.addEventListener("pointerenter", event => {
      if (event.pointerType === "mouse") intent = setTimeout(on, 70);
    });
    tool.addEventListener("pointerleave", event => {
      clearTimeout(intent);
      if (event.pointerType === "mouse" && document.activeElement !== tool) off();
    });
    tool.addEventListener("focus", on);
    tool.addEventListener("blur", () => { if (canHover.matches && !tool.matches(":hover")) off(); });
  }
  lightAll();
  canHover.addEventListener("change", lightAll);

  // Platform filter: a marker block slides to the chosen platform; other tools stay put as outlines.
  const bar = document.querySelector(".filter-bar");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const count = document.querySelector("#project-count");
  const items = tools.map(tool => tool.closest("li"));
  const projects = tools.filter(tool => tool.dataset.platforms);
  const unit = "件工具";
  const pad = n => String(n).padStart(2, "0");

  for (const button of filters) {
    const key = button.dataset.filter;
    const total = key === "all" ? projects.length : projects.filter(tool => tool.dataset.platforms.split(" ").includes(key)).length;
    const badge = button.querySelector("span");
    if (badge) badge.textContent = pad(total);
  }

  function moveThumb(button, instant) {
    if (!bar || !button) return;
    bar.classList.add("has-thumb");
    bar.classList.toggle("is-instant", Boolean(instant));
    bar.style.setProperty("--thumb-x", `${button.offsetLeft}px`);
    bar.style.setProperty("--thumb-y", `${button.offsetTop}px`);
    bar.style.setProperty("--thumb-w", `${button.offsetWidth}px`);
    bar.style.setProperty("--thumb-h", `${button.offsetHeight}px`);
    if (instant) requestAnimationFrame(() => bar.classList.remove("is-instant"));
  }
  const pressed = () => filters.find(button => button.getAttribute("aria-pressed") === "true");

  // The chosen platform is kept in the address (?platform=) and for this tab,
  // so coming back from a project page shows the same selection.
  const storeKey = "hmgvibe-platform";
  // Leaving: lifted off the mat first, then only a dashed outline stays. Returning: placed back down.
  function setOff(item, off, animate) {
    const wasOff = item.dataset.off === "1";
    item.dataset.off = off ? "1" : "0";
    clearTimeout(item.liftTimer);
    if (off && !wasOff && animate) {
      item.classList.add("is-lifting");
      item.liftTimer = setTimeout(() => {
        item.classList.remove("is-lifting");
        if (item.dataset.off === "1") item.classList.add("is-off");
      }, 220);
      return;
    }
    item.classList.remove("is-lifting");
    item.classList.toggle("is-off", off);
    if (!off && wasOff && animate) {
      item.classList.remove("is-placing");
      void item.offsetWidth;
      item.classList.add("is-placing");
      item.liftTimer = setTimeout(() => item.classList.remove("is-placing"), 450);
    }
  }
  function applyFilter(button, instant) {
    const selected = button.dataset.filter;
    let visible = 0;
    for (const filter of filters) filter.setAttribute("aria-pressed", String(filter === button));
    moveThumb(button, instant || reducedMotion.matches);
    const animate = !instant && !reducedMotion.matches;
    tools.forEach((tool, index) => {
      const platforms = tool.dataset.platforms;
      const match = selected === "all" || (platforms ? platforms.split(" ").includes(selected) : false);
      if (platforms && match) visible++;
      setOff(items[index], !match, animate);
      tool.inert = !match;
    });
    if (count) count.textContent = selected === "all" ? `${pad(visible)} ${unit}` : `${pad(visible)} / ${pad(projects.length)} ${unit}`;
    syncStandby();
  }
  function remember(selected) {
    try {
      if (selected === "all") sessionStorage.removeItem(storeKey);
      else sessionStorage.setItem(storeKey, selected);
    } catch {
      // Storage is optional.
    }
    const url = new URL(location.href);
    if (selected === "all") url.searchParams.delete("platform");
    else url.searchParams.set("platform", selected);
    history.replaceState(history.state, "", url);
  }
  // On narrow screens the filter row scrolls sideways; keep the chosen platform in view.
  function revealButton(button) {
    if (bar.scrollWidth <= bar.clientWidth) return;
    const left = button.offsetLeft, right = left + button.offsetWidth;
    if (left < bar.scrollLeft || right > bar.scrollLeft + bar.clientWidth - 32) bar.scrollLeft = left - 24;
  }
  for (const button of filters) {
    button.addEventListener("click", () => {
      applyFilter(button, false);
      remember(button.dataset.filter);
      revealButton(button);
    });
  }
  if (bar) {
    let saved = new URLSearchParams(location.search).get("platform");
    if (!saved) {
      try { saved = sessionStorage.getItem(storeKey); } catch { saved = null; }
    }
    const start = filters.find(button => button.dataset.filter === saved);
    if (start) {
      applyFilter(start, true);
      remember(start.dataset.filter);
      revealButton(start);
    }
    moveThumb(pressed(), true);
    window.addEventListener("resize", () => moveThumb(pressed(), true));
    if (document.fonts) document.fonts.ready.then(() => moveThumb(pressed(), true));
  }

  // Project pages: the drawing switches on once the page has arrived.
  const detailArt = document.querySelector(".detail-visual .art");
  if (detailArt && !reducedMotion.matches) {
    detailArt.classList.remove("is-lit");
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => detailArt.classList.add("is-lit"), 260)));
  }

  // Header progress line and the active link in a project page's section nav.
  const sectionLinks = [...document.querySelectorAll(".section-links a")];
  const sections = sectionLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
  let frame = 0;
  function updateScroll() {
    frame = 0;
    const range = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--scroll-progress", String(range > 0 ? window.scrollY / range : 0));
    if (!sections.length) return;
    let current = null;
    for (const section of sections) if (section.getBoundingClientRect().top <= 210) current = section;
    for (const link of sectionLinks) {
      const active = Boolean(current) && link.hash === `#${current.id}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  window.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  }, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) revealItems.forEach(item => item.classList.add("is-revealed"));
  });
})();
