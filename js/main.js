/* ============================================================
   Site interactions: reveal-on-scroll, nav state, card tilt,
   stat counters, cursor glow, contact form.
   All motion respects prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    // Stagger siblings that enter together
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const parent = el.parentElement;
          const siblings = parent
            ? Array.from(parent.children).filter((c) => c.matches("[data-reveal]"))
            : [el];
          const i = Math.max(0, siblings.indexOf(el));
          el.style.setProperty("--reveal-delay", Math.min(i * 90, 450) + "ms");
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Nav: scrolled state, mobile menu, active link ---------- */
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");

  const onScroll = () => nav && nav.classList.toggle("is-scrolled", scrollY > 24);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const openNow = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!openNow));
      menu.classList.toggle("is-open", !openNow);
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      }
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__link");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Cursor glow (desktop, motion allowed) ---------- */
  const glow = document.querySelector(".cursor-glow");
  if (glow && finePointer && !reduceMotion) {
    document.body.classList.add("has-pointer");
    let raf = null;
    addEventListener(
      "pointermove",
      (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          glow.style.left = e.clientX + "px";
          glow.style.top = e.clientY + "px";
          raf = null;
        });
      },
      { passive: true }
    );
  }

  /* ---------- 3D tilt on project cards ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".project-card").forEach((card) => {
      let raf = null;
      card.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "perspective(1100px) rotateX(" + (-y * 3.2).toFixed(2) + "deg) rotateY(" + (x * 3.2).toFixed(2) + "deg) translateY(-4px)";
          raf = null;
        });
      });
      card.addEventListener("pointerleave", () => {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        card.style.transform = "";
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".btn--magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.18 + "px," + y * 0.22 + "px)";
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll(".stat__num[data-count]");
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    const dur = 1400;
    const t0 = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((c) => cio.observe(c));
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Contact form → mail client ---------- */
  const form = document.querySelector(".contact__form");
  if (form) {
    const note = form.querySelector(".contact__form-note");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.elements.name;
      const email = form.elements.email;
      const message = form.elements.message;
      let valid = true;
      [name, email, message].forEach((f) => {
        const bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.classList.toggle("is-invalid", bad);
        if (bad) valid = false;
      });
      if (!valid) {
        note.textContent = "Please fill in every field with a valid email.";
        return;
      }
      const subject = encodeURIComponent("Inquiry from " + name.value.trim() + " — via portfolio");
      const body = encodeURIComponent(message.value.trim() + "\n\n— " + name.value.trim() + " (" + email.value.trim() + ")");
      location.href = "mailto:patrickjeri.garcia@gmail.com?subject=" + subject + "&body=" + body;
      note.textContent = "Opening your email client…";
      showToast("Thanks! Your email draft is ready to send.");
      form.reset();
    });
  }

  /* ---------- Toast ---------- */
  let toastEl = null;
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add("is-shown"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-shown"), 3600);
  }
})();
