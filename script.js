document.querySelector("#year").textContent = new Date().getFullYear();
const projectLinks = [...document.querySelectorAll(".project-nav a")];
const products = [...document.querySelectorAll(".product")];
function updateCurrentProject() {
  let current = products[0];
  for (const product of products) {
    if (product.getBoundingClientRect().top <= 180) current = product;
  }
  for (const link of projectLinks) {
    const active = link.hash === "#" + current.id;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}
window.addEventListener("scroll", updateCurrentProject, { passive: true });
window.addEventListener("resize", updateCurrentProject);
updateCurrentProject();
