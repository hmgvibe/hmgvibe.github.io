(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.06, rootMargin: "0px 0px -16px 0px" });
    root.classList.add("motion-ready");
    revealItems.forEach((item, index) => {
      if (item.closest(".hero-copy")) item.style.transitionDelay = `${Math.min(index, 4) * 65}ms`;
      observer.observe(item);
    });
  }

  const cards = [...document.querySelectorAll(".project-card")];
  const filters = [...document.querySelectorAll("[data-filter]")];
  const count = document.querySelector("#project-count");
  for (const button of filters) {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;
      let visible = 0;
      for (const filter of filters) filter.setAttribute("aria-pressed", String(filter === button));
      for (const card of cards) {
        const show = selected === "all" || card.dataset.platforms.split(" ").includes(selected);
        card.hidden = !show;
        if (show) {
          visible++;
          card.classList.add("is-revealed");
          if (!reducedMotion.matches) card.animate(
            [{ opacity: 0.35, translate: "0 12px" }, { opacity: 1, translate: "0 0" }],
            { duration: 350, easing: "cubic-bezier(.22,1,.36,1)" }
          );
        }
      }
      if (count) count.textContent = `${String(visible).padStart(2, "0")} ${root.lang === "zh-Hans" ? "个项目" : "個項目"}`;
    });
  }

  const sectionLinks = [...document.querySelectorAll(".section-links a")];
  const sections = sectionLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
  const header = document.querySelector(".site-header");
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const range = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--scroll-progress", String(range > 0 ? window.scrollY / range : 0));
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
    if (sections.length) {
      let current = sections[0];
      for (const section of sections) if (section.getBoundingClientRect().top <= 210) current = section;
      for (const link of sectionLinks) {
        const active = link.hash === `#${current.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }
  }
  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

  function pointerEffect(element, handler, reset) {
    let frame = 0;
    let pointer = null;
    element.addEventListener("pointermove", event => {
      if (reducedMotion.matches || !finePointer.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        if (pointer) handler(pointer, element.getBoundingClientRect());
      });
    }, { passive: true });
    element.addEventListener("pointerleave", () => {
      pointer = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      reset();
    });
  }

  for (const card of cards) pointerEffect(card, (pointer, bounds) => {
    card.style.setProperty("--pointer-x", `${pointer.x - bounds.left}px`);
    card.style.setProperty("--pointer-y", `${pointer.y - bounds.top}px`);
  }, () => {
    card.style.removeProperty("--pointer-x");
    card.style.removeProperty("--pointer-y");
  });

  const object = document.querySelector("[data-parallax]");
  if (object) {
    pointerEffect(object, (pointer, bounds) => {
      object.style.setProperty("--tilt-x", `${3 - ((pointer.y - bounds.top) / bounds.height - .5) * 5}deg`);
      object.style.setProperty("--tilt-y", `${-7 + ((pointer.x - bounds.left) / bounds.width - .5) * 9}deg`);
    }, () => {
      object.style.removeProperty("--tilt-x");
      object.style.removeProperty("--tilt-y");
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(entries => {
        object.classList.toggle("is-offscreen", !entries[0].isIntersecting);
      }).observe(object);
    }
  }
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      revealItems.forEach(item => item.classList.add("is-revealed"));
      cards.forEach(card => card.getAnimations().forEach(animation => animation.cancel()));
      if (object) {
        object.style.removeProperty("--tilt-x");
        object.style.removeProperty("--tilt-y");
      }
    }
  });
})();
