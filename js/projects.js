/* ============================================================
   Case study data + overlay
   Each project card on the page opens a full case study in an
   accessible dialog. Deep-linkable via #case/<slug>.
   ============================================================ */
(function () {
  "use strict";

  const PROJECTS = {
    lumina: {
      title: "Lumina Analytics",
      tagline: "From data noise to decision clarity",
      role: "Lead Product Designer & Engineer",
      year: "2025",
      client: "Meridian Labs",
      duration: "9 months",
      overview:
        "Lumina is a B2B analytics platform used by 12,000+ teams. The product was powerful but overwhelming — dashboards averaged 30+ widgets, and new users churned before reaching their first insight. I led a ground-up redesign of the information architecture, visual system, and onboarding flow, then built the new front-end alongside the platform team.",
      challenge:
        "Power users loved the density; new users drowned in it. We had to simplify the first-run experience without dumbing down the tool — and ship incrementally against a live product with zero downtime.",
      solution:
        "We introduced a progressive-disclosure dashboard model: an opinionated “insights feed” for newcomers that gradually unlocks the full canvas as usage matures. I designed the system in Figma, built the component library in React + TypeScript, and rebuilt the charting layer on D3 with a custom theming engine so every visualization inherited the new design language automatically.",
      results: [
        { value: "+38%", label: "activation rate (first insight in <10 min)" },
        { value: "−41%", label: "time-to-first-dashboard" },
        { value: "62 → 90", label: "SUS usability score" },
      ],
      stack: ["React", "TypeScript", "D3.js", "Storybook", "Figma", "Framer Motion"],
    },
    atlas: {
      title: "Atlas Commerce",
      tagline: "A storefront rebuilt for speed",
      role: "Product Designer → Design Engineer",
      year: "2024",
      client: "Atlas Commerce",
      duration: "6 months",
      overview:
        "Atlas serves 400+ merchants on a headless commerce platform. Their flagship storefront theme was visually dated and slow — a 6.2s mobile LCP was quietly killing conversion. I redesigned the storefront and checkout, then rebuilt it as a statically-rendered Next.js app on the platform’s APIs.",
      challenge:
        "Every design decision carried a performance budget. The brief was explicit: nothing ships that pushes Largest Contentful Paint past 1 second on a mid-range Android device — including imagery, fonts, and motion.",
      solution:
        "We designed mobile-first around a strict performance budget: system-font first paint, aggressive image pipelines, and a single-page checkout that collapses five steps into one adaptive form. Motion was implemented entirely with CSS transforms and the View Transitions API, so the experience feels rich at effectively zero JavaScript cost.",
      results: [
        { value: "2.1×", label: "checkout conversion rate" },
        { value: "0.8s", label: "mobile LCP (was 6.2s)" },
        { value: "98", label: "Lighthouse performance score" },
      ],
      stack: ["Next.js", "Shopify Hydrogen", "Tailwind CSS", "Vercel", "Sanity"],
    },
    pulse: {
      title: "Pulse Health",
      tagline: "Health data that feels human",
      role: "Product Designer & Motion Lead",
      year: "2024",
      client: "Pulse (seed-stage startup)",
      duration: "7 months",
      overview:
        "Pulse turns wearable data into a daily wellness companion. The founding team had the science; they needed a product people would actually open every morning. I owned design end-to-end — brand, app UI, and the motion system — and worked in-repo with the two founding engineers.",
      challenge:
        "Health apps live or die on retention. Raw biometrics feel clinical and judgmental; we needed the app to read like a supportive coach, not a lab report — while staying honest about the data.",
      solution:
        "We built the experience around a single adaptive “readiness ring” with plain-language coaching, and used Rive to give every metric a living, breathing quality — animations respond to your actual data. Onboarding asks one question per screen and produces a personalized plan in under a minute.",
      results: [
        { value: "120k", label: "downloads in first 6 months" },
        { value: "4.8★", label: "App Store rating (3.1k reviews)" },
        { value: "58%", label: "day-30 retention (industry avg ≈ 27%)" },
      ],
      stack: ["React Native", "Swift", "Rive", "Firebase", "Figma"],
    },
    nova: {
      title: "Nova Studio",
      tagline: "Brand, type, and code as one system",
      role: "Senior Creative Developer",
      year: "2023",
      client: "Studio Nova",
      duration: "4 months",
      overview:
        "Studio Nova — a motion design studio — needed a site that proved its craft the moment it loaded. Working with their creative director, I built an identity system and a WebGL-driven site where the brand’s custom typeface literally bends light: every page is rendered through a real-time refraction shader.",
      challenge:
        "Show-off WebGL sites are usually slow, inaccessible, and unusable on mobile. The bar was: full 60fps on a three-year-old phone, complete keyboard navigation, and a no-WebGL fallback that still feels designed.",
      solution:
        "The scene budget was ruthless — one shader, one mesh, instanced particles. All content lives in semantic HTML that the WebGL layer samples for positioning, so screen readers and search engines see a normal site. A static-gradient fallback ships in the same bundle and activates automatically below a GPU capability threshold.",
      results: [
        { value: "SOTD", label: "Awwwards Site of the Day + Developer Award" },
        { value: "60fps", label: "sustained on 2020 mid-range devices" },
        { value: "+340%", label: "inbound project inquiries for the studio" },
      ],
      stack: ["Three.js", "GLSL", "GSAP", "Astro", "Blender"],
    },
  };

  const ORDER = ["lumina", "atlas", "pulse", "nova"];

  const overlay = document.getElementById("case-study");
  const panel = overlay ? overlay.querySelector(".case-study__panel") : null;
  const content = document.getElementById("cs-content");
  if (!overlay || !panel || !content) return;

  let activeSlug = null;
  let lastFocused = null;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function render(slug) {
    const p = PROJECTS[slug];
    if (!p) return false;
    const idx = ORDER.indexOf(slug);
    const prev = ORDER[(idx - 1 + ORDER.length) % ORDER.length];
    const next = ORDER[(idx + 1) % ORDER.length];

    content.innerHTML = `
      <div class="cs__hero" data-art="${esc(slug)}">
        <h2 class="cs__hero-title" id="cs-title">${esc(p.title)}</h2>
      </div>
      <div class="cs__body">
        <dl class="cs__meta">
          <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
          <div><dt>Client</dt><dd>${esc(p.client)}</dd></div>
          <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
          <div><dt>Duration</dt><dd>${esc(p.duration)}</dd></div>
        </dl>
        <div class="cs__section">
          <h3>Overview</h3>
          <p>${esc(p.overview)}</p>
        </div>
        <div class="cs__section">
          <h3>The challenge</h3>
          <p>${esc(p.challenge)}</p>
        </div>
        <div class="cs__section">
          <h3>The solution</h3>
          <p>${esc(p.solution)}</p>
        </div>
        <div class="cs__section">
          <h3>Results</h3>
          <div class="cs__results">
            ${p.results.map((r) => `<div class="cs__result"><strong>${esc(r.value)}</strong><span>${esc(r.label)}</span></div>`).join("")}
          </div>
        </div>
        <div class="cs__section">
          <h3>Stack</h3>
          <ul class="chips cs__stack">${p.stack.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </div>
        <nav class="cs__nav" aria-label="Case study navigation">
          <button type="button" data-goto="${esc(prev)}">← ${esc(PROJECTS[prev].title)}</button>
          <button type="button" data-goto="${esc(next)}">${esc(PROJECTS[next].title)} →</button>
        </nav>
      </div>`;
    return true;
  }

  function open(slug, { pushHash = true } = {}) {
    if (!render(slug)) return;
    activeSlug = slug;
    if (overlay.hidden) {
      lastFocused = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add("overlay-open");
      requestAnimationFrame(() => overlay.classList.add("is-open"));
    }
    panel.scrollTop = 0;
    panel.focus({ preventScroll: true });
    if (pushHash) {
      history.pushState(null, "", "#case/" + slug);
    }
  }

  function close({ popHash = true } = {}) {
    if (overlay.hidden) return;
    activeSlug = null;
    overlay.classList.remove("is-open");
    document.body.classList.remove("overlay-open");
    const done = () => { overlay.hidden = true; };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    reduced ? done() : setTimeout(done, 420);
    if (popHash && location.hash.startsWith("#case/")) {
      history.pushState(null, "", location.pathname + location.search);
    }
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  }

  // Card triggers (click + keyboard, since cards are role="button")
  document.querySelectorAll("[data-project]").forEach((card) => {
    const slug = card.getAttribute("data-project");
    card.addEventListener("click", () => open(slug));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(slug);
      }
    });
  });

  // Close: backdrop, X button, Escape
  overlay.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) close();
    const goto = e.target.closest("[data-goto]");
    if (goto) open(goto.getAttribute("data-goto"));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) close();
    // Rudimentary focus trap
    if (e.key === "Tab" && !overlay.hidden) {
      const focusables = overlay.querySelectorAll("button, [href], [tabindex='-1']");
      const list = Array.from(focusables).filter((el) => !el.disabled);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Deep links: #case/<slug> opens directly; back/forward keeps state in sync
  function syncFromHash() {
    const m = location.hash.match(/^#case\/([\w-]+)$/);
    if (m && PROJECTS[m[1]]) {
      open(m[1], { pushHash: false });
    } else if (activeSlug) {
      close({ popHash: false });
    }
  }
  window.addEventListener("popstate", syncFromHash);
  syncFromHash();
})();
