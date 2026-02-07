// --- Active nav link (safe even if nav is empty) ---
(function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
})();

// --- Work page: search + filter (only runs if elements exist) ---
(function workFilters() {
  const grid = document.querySelector("[data-grid]");
  if (!grid) return;

  const searchInput = document.querySelector("[data-search]");
  const chips = Array.from(document.querySelectorAll("[data-filter]"));
  const items = Array.from(grid.querySelectorAll("[data-item]"));

  let active = "all";
  let query = "";

  function matches(item) {
    const cat = item.getAttribute("data-category");
    const title = (item.getAttribute("data-title") || "").toLowerCase();
    const tags = (item.getAttribute("data-tags") || "").toLowerCase();
    const q = query.trim().toLowerCase();

    const okCat = active === "all" || cat === active;
    const okQuery = !q || title.includes(q) || tags.includes(q);
    return okCat && okQuery;
  }

  function render() {
    let visible = 0;
    for (const item of items) {
      const show = matches(item);
      item.style.display = show ? "" : "none";
      if (show) visible++;
    }
    const counter = document.querySelector("[data-counter]");
    if (counter) counter.textContent = `${visible} shown`;
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      active = chip.getAttribute("data-filter");
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value;
      render();
    });
  }

  render();
})();

// --- Lightbox modal for project gallery ---
(function lightbox() {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;

  const modalImg = modal.querySelector("img");
  const closeBtn = modal.querySelector("[data-close]");

  function open(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt || "Preview";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn && closeBtn.focus();
  }

  function close() {
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-lightbox]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const img = link.querySelector("img");
      if (img) open(img.src, img.alt);
    });
  });

  closeBtn && closeBtn.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") close();
  });
})();

// --- Project page: load project data from query string ---
(function projectLoader() {
  const root = document.querySelector("[data-project]");
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "leaf-2026";

  // IMPORTANT: these IDs MUST match your index.html links exactly
  const PROJECTS = {
    "leaf-2026": {
      title: "The Leaf",
      category: "Photography",
      dateLabel: "January 31, 2026",
      year: "2026",
      role: "Photographer / Editor",
      tools: "Lightroom • Photoshop",
      hero: "images/leaf.jpg",
      desc: "A minimalist set focused on texture, contrast, and quiet detail.",
      gallery: ["images/leaf.jpg"],
      videoEmbed: ""
    },

    "midnight-elegance-veronika-2026": {
      title: "Midnight Elegance — Veronika",
      category: "Photography",
      dateLabel: "January 1, 2026",
      year: "2026",
      role: "Photographer / Editor",
      tools: "Lightroom • Photoshop",
      hero: "images/midnight-elegance-veronika.jpg",
      desc: "A low-light portrait concept with clean highlights and deep shadows.",
      gallery: ["images/midnight-elegance-veronika.jpg"],
      videoEmbed: ""
    },

    "21-counting-gerezgiher-twins-2025": {
      title: "21 & Counting — Gerezgiher Twins",
      category: "Photography",
      dateLabel: "October 24, 2025",
      year: "2025",
      role: "Photographer / Editor",
      tools: "Lightroom • Photoshop",
      hero: "images/21-counting-gerezgiher-twins.jpg",
      desc: "Celebration portraits built around symmetry, styling, and storytelling.",
      gallery: ["images/21-counting-gerezgiher-twins.jpg"],
      videoEmbed: ""
    },

    "wedding-day-joyce-errol-2025": {
      title: "Wedding Day — Joyce & Errol",
      category: "Photography",
      dateLabel: "August 9, 2025",
      year: "2025",
      role: "Wedding Photographer",
      tools: "Lightroom • Photoshop",
      hero: "images/wedding-day-joyce-errol.jpg",
      desc: "Wedding day coverage with an emphasis on candid moments, details, and clean color.",
      gallery: ["images/wedding-day-joyce-errol.jpg"],
      videoEmbed: ""
    }
  };

  const p = PROJECTS[id] || PROJECTS["leaf-2026"];

  // Title/desc
  root.querySelector("[data-title]").textContent = p.title;
  root.querySelector("[data-desc]").textContent = p.desc;

  // Hero image
  const heroImg = root.querySelector("[data-hero]");
  heroImg.src = p.hero;
  heroImg.alt = p.title;

  // Meta pills
  const meta = root.querySelector("[data-meta]");
  meta.innerHTML = `
    <span class="pill">${p.category}</span>
    <span class="pill">${p.dateLabel}</span>
    <span class="pill">${p.role}</span>
    <span class="pill">${p.tools}</span>
  `;

  // Gallery
  const gallery = root.querySelector("[data-gallery]");
  gallery.innerHTML = (p.gallery || []).map((src) => `
    <a href="${src}" data-lightbox>
      <img src="${src}" alt="${p.title} image" loading="lazy" />
    </a>
  `).join("");

  // Optional embedded video
  const vidWrap = root.querySelector("[data-video-wrap]");
  if (p.videoEmbed) {
    vidWrap.innerHTML = `
      <div class="section-title">
        <h2>Video</h2>
        <p>Embedded preview</p>
      </div>
      <div class="video">
        <iframe
          src="${p.videoEmbed}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    `;
  } else {
    vidWrap.innerHTML = "";
  }

  // Re-bind lightbox for dynamically injected gallery links
  // (runs a small inline version without reloading the page)
  const modal = document.querySelector("[data-modal]");
  if (modal) {
    const modalImg = modal.querySelector("img");
    const closeBtn = modal.querySelector("[data-close]");

    function open(src, alt) {
      modalImg.src = src;
      modalImg.alt = alt || "Preview";
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn && closeBtn.focus();
    }

    document.querySelectorAll("[data-lightbox]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const img = link.querySelector("img");
        if (img) open(img.src, img.alt);
      });
    });
  }
})();
