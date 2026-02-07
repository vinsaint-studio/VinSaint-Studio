// ===== Mobile nav =====
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

menuBtn?.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(a => {
  a.addEventListener("click", () => nav.classList.remove("open"));
});

// ===== Active nav highlighting =====
(() => {
  const file = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    const hrefFile = href.split("/").pop();
    const onWork = location.pathname.includes("/work/");
    const isWorkLink = href.includes("work");

    if (hrefFile === file) a.classList.add("active");
    if (onWork && isWorkLink) a.classList.add("active");
  });
})();

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("is-in");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ===== Page transition overlay =====
const overlay = document.querySelector(".transition");
function go(url){
  if (!overlay) { location.href = url; return; }
  overlay.classList.add("on");
  setTimeout(() => location.href = url, 220);
}

document.querySelectorAll("a[data-go]").forEach(a => {
  a.addEventListener("click", (e) => {
    const url = a.getAttribute("href");
    if (!url) return;
    if (/^https?:\/\//i.test(url) || url.startsWith("mailto:")) return; // external
    e.preventDefault();
    go(url);
  });
});

// Remove overlay on load
window.addEventListener("pageshow", () => overlay?.classList.remove("on"));

// ===== Cursor blob (desktop) =====
const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", (e) => {
  cursor?.classList.add("on");
  if (!cursor) return;
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.querySelectorAll("a, button, .card, .tile, .social").forEach(el => {
  el.addEventListener("mouseenter", () => cursor?.classList.add("big"));
  el.addEventListener("mouseleave", () => cursor?.classList.remove("big"));
});

// If touch device, hide cursor
window.addEventListener("touchstart", () => cursor?.classList.remove("on"));
