/* ============================================================
   Motion layer.

   One rAF loop drives every scroll-linked effect — parallax,
   velocity skew, progress, masthead state. Pointer effects write
   CSS custom properties via CSSOM (allowed under the strict CSP;
   inline style attributes are not).

   Everything here is opt-in through data attributes and every
   effect is gated on prefers-reduced-motion and pointer type, so
   the page degrades to the static composition rather than to a
   broken one.
   ============================================================ */
(function () {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  /* =========================================================
     1. Split text — word masks for headings marked data-split
     ========================================================= */
  function splitWords(el) {
    if (el.dataset.split === "done") return;

    function walk(node) {
      const out = [];
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (!tok.trim()) { out.push(document.createTextNode(tok)); return; }
            const mask = document.createElement("span");
            mask.className = "w";
            const inner = document.createElement("span");
            inner.className = "w__i";
            inner.textContent = tok;
            mask.appendChild(inner);
            out.push(mask);
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // Preserve inline elements (<em>, <br>) and split inside them
          const clone = child.cloneNode(false);
          walk(child).forEach((n) => clone.appendChild(n));
          out.push(clone);
        }
      });
      return out;
    }

    const nodes = walk(el);
    el.textContent = "";
    nodes.forEach((n) => el.appendChild(n));
    el.querySelectorAll(".w__i").forEach((n, i) => n.style.setProperty("--wi", i));
    el.dataset.split = "done";
  }

  if (!reduced) document.querySelectorAll("[data-split]").forEach(splitWords);

  /* =========================================================
     2. Preloader — a short entrance, once per session
     ========================================================= */
  const loader = document.getElementById("loader");
  const SEEN = "pg.entered";

  function bootHero() {
    document.body.classList.add("is-ready");
    const title = document.querySelector(".opening__title");
    if (title) title.classList.add("is-lit");
    // main.js holds its reveal observer until this fires
    document.dispatchEvent(new CustomEvent("pg:ready"));
  }

  function runLoader() {
    if (!loader) { bootHero(); return; }

    const skip = reduced || sessionStorage.getItem(SEEN) === "1";
    if (skip) {
      loader.remove();
      bootHero();
      return;
    }

    document.body.classList.add("is-loading");
    const num = loader.querySelector(".loader__num");
    const t0 = performance.now();
    const DUR = 1150;

    function tick(t) {
      const p = Math.min((t - t0) / DUR, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (num) num.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (p < 1) { requestAnimationFrame(tick); return; }

      loader.classList.add("is-out");
      document.body.classList.remove("is-loading");
      bootHero();
      sessionStorage.setItem(SEEN, "1");
      setTimeout(() => loader.remove(), 1100);
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === "complete") runLoader();
  else addEventListener("load", runLoader, { once: true });

  /* =========================================================
     3. Cursor — a dot that tracks, a ring that trails, and a
        contextual label pulled from data-cursor
     ========================================================= */
  if (finePointer && !reduced) {
    const dot = document.createElement("div");
    dot.className = "cursor__dot";
    const ring = document.createElement("div");
    ring.className = "cursor__ring";
    ring.innerHTML = '<span class="cursor__label"></span>';
    const label = ring.querySelector(".cursor__label");
    document.body.append(dot, ring);
    document.documentElement.classList.add("has-cursor");

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let active = false;

    addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (!active) { active = true; document.documentElement.classList.add("cursor-on"); }
      dot.style.setProperty("transform", `translate3d(${mx}px, ${my}px, 0)`);
    }, { passive: true });

    addEventListener("pointerdown", () => ring.classList.add("is-down"), { passive: true });
    addEventListener("pointerup", () => ring.classList.remove("is-down"), { passive: true });
    addEventListener("pointerleave", () => document.documentElement.classList.remove("cursor-on"), { passive: true });

    // Hover intent is delegated so it also covers reader content
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor], a, button, input, textarea, select");
      if (!t) return;
      const text = t.getAttribute("data-cursor");
      ring.classList.add("is-active");
      ring.classList.toggle("is-labelled", !!text);
      if (label) label.textContent = text || "";
    });
    document.addEventListener("pointerout", (e) => {
      const t = e.target.closest("[data-cursor], a, button, input, textarea, select");
      if (!t) return;
      if (e.relatedTarget && t.contains(e.relatedTarget)) return;
      ring.classList.remove("is-active", "is-labelled");
      if (label) label.textContent = "";
    });

    (function ringLoop() {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      ring.style.setProperty("transform", `translate3d(${rx}px, ${ry}px, 0)`);
      requestAnimationFrame(ringLoop);
    })();
  }

  /* =========================================================
     4. Magnetic elements
     ========================================================= */
  if (finePointer && !reduced) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const pull = Number(el.getAttribute("data-magnetic")) || 0.3;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left - r.width / 2) * pull).toFixed(2) + "px");
        el.style.setProperty("--my", ((e.clientY - r.top - r.height / 2) * pull * 1.1).toFixed(2) + "px");
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--mx", "0px");
        el.style.setProperty("--my", "0px");
      });
    });
  }

  /* =========================================================
     5. Tilt + cursor lighting on media
     ========================================================= */
  if (finePointer && !reduced) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const max = Number(el.getAttribute("data-tilt")) || 5;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", ((px - 0.5) * max * 2).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((0.5 - py) * max * 2).toFixed(2) + "deg");
        el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* Spotlight-only surfaces (no tilt) — matrix cells, index rows */
  if (finePointer && !reduced) {
    document.querySelectorAll("[data-glow]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--gx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
      });
    });
  }

  /* =========================================================
     6. Hero pointer drift — background layers answer the mouse
     ========================================================= */
  const opening = document.querySelector(".opening");
  if (opening && finePointer && !reduced) {
    let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    opening.addEventListener("pointermove", (e) => {
      const r = opening.getBoundingClientRect();
      tx = (e.clientX - r.width / 2) / r.width;
      ty = (e.clientY - r.height / 2) / r.height;
      if (!running) { running = true; drift(); }
    }, { passive: true });
    opening.addEventListener("pointerleave", () => { tx = 0; ty = 0; }, { passive: true });

    function drift() {
      cx = lerp(cx, tx, 0.06);
      cy = lerp(cy, ty, 0.06);
      opening.style.setProperty("--px", cx.toFixed(4));
      opening.style.setProperty("--py", cy.toFixed(4));
      if (Math.abs(cx - tx) > 0.0005 || Math.abs(cy - ty) > 0.0005) requestAnimationFrame(drift);
      else running = false;
    }
  }

  /* =========================================================
     7. Scroll engine — one loop, transforms only
     ========================================================= */
  const parallaxItems = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
    el,
    speed: Number(el.getAttribute("data-parallax")) || 0.1,
  }));
  const skewItems = [...document.querySelectorAll("[data-skew]")];
  const progress = document.querySelector(".progress");
  const masthead = document.querySelector(".masthead");
  const root = document.documentElement;

  let lastY = scrollY;
  let vel = 0;
  let smoothVel = 0;
  let navHidden = false;
  let ticking = false;

  function frame() {
    const y = scrollY;
    vel = y - lastY;
    lastY = y;
    smoothVel = lerp(smoothVel, vel, 0.12);

    // Progress
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : "0");
    }

    // Masthead: solid past the fold, and hides while scrolling down
    if (masthead) {
      masthead.classList.toggle("is-stuck", y > 40);
      if (y > 420 && vel > 6 && !navHidden) { masthead.classList.add("is-away"); navHidden = true; }
      else if ((vel < -6 || y < 200) && navHidden) { masthead.classList.remove("is-away"); navHidden = false; }
    }

    // Parallax — only for elements near the viewport
    if (!reduced) {
      const vh = innerHeight;
      for (let i = 0; i < parallaxItems.length; i++) {
        const { el, speed } = parallaxItems[i];
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh * 0.4 || r.top > vh * 1.4) continue;
        const centre = r.top + r.height / 2 - vh / 2;
        el.style.setProperty("--sy", (-centre * speed).toFixed(2) + "px");
      }

      // Scroll velocity → a slight skew, capped so it never smears
      const sk = clamp(smoothVel * 0.045, -2.2, 2.2);
      for (let i = 0; i < skewItems.length; i++) {
        skewItems[i].style.setProperty("--sk", sk.toFixed(3) + "deg");
      }
      root.style.setProperty("--vel", Math.abs(sk).toFixed(3));
    }

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  frame();

  /* =========================================================
     8. Section identity — each section tints the page as it
        takes over, so scrolling feels like moving through rooms
     ========================================================= */
  const themed = document.querySelectorAll("[data-tone]");
  if (themed.length && "IntersectionObserver" in window) {
    const tones = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          root.setAttribute("data-tone", e.target.getAttribute("data-tone"));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    themed.forEach((s) => tones.observe(s));
  }

  /* =========================================================
     9. Section rail — a dot per section, current one extends
     ========================================================= */
  const rail = document.querySelector(".rail");
  if (rail) {
    const links = [...rail.querySelectorAll(".rail__dot")];
    const targets = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    if (targets.length && "IntersectionObserver" in window) {
      const railSpy = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            links.forEach((a) => a.classList.toggle("is-on", a.getAttribute("href") === "#" + e.target.id));
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      targets.forEach((t) => railSpy.observe(t));
    }
  }

  /* =========================================================
     10. Ripple on press — pointer coordinates into the element
     ========================================================= */
  if (!reduced) {
    document.addEventListener("pointerdown", (e) => {
      const el = e.target.closest("[data-ripple]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--rx-pos", (e.clientX - r.left).toFixed(1) + "px");
      el.style.setProperty("--ry-pos", (e.clientY - r.top).toFixed(1) + "px");
      el.classList.remove("is-rippling");
      void el.offsetWidth;            // restart the animation
      el.classList.add("is-rippling");
    });
  }

  /* =========================================================
     11. Marquee — duplicated track, speed answers scroll velocity
     ========================================================= */
  document.querySelectorAll(".marquee__track").forEach((track) => {
    const copy = track.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.parentElement.appendChild(copy);
  });
})();
