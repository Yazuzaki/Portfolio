/* ============================================================
   Page behaviour: reveal choreography, masthead state, scroll
   progress, section spy, trajectory rail, counters, the email
   reveal, and the contact form.

   Everything degrades: with JS off, .no-js is never removed and
   the stylesheet shows all content in its final state.
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Reveal on scroll.

     Each element declares its own entrance via data-fx, so the
     page never repeats one fade-up. Headings marked data-split
     ride in word by word. The observer starts only once the
     entrance sequence has handed over (motion.js fires pg:ready),
     otherwise the hero would animate behind the curtain.
     --------------------------------------------------------- */
  const revealables = document.querySelectorAll("[data-fx], [data-split], [data-stagger]");

  function startReveals() {
    if (reduced || !("IntersectionObserver" in window)) {
      revealables.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const pending = new Set(revealables);

    function reveal(el) {
      el.classList.add("is-in");
      pending.delete(el);
      io.unobserve(el);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    revealables.forEach((el) => io.observe(el));

    /* Safety net. IntersectionObserver samples at frame boundaries, so a
       fast flick, an End keypress, an anchor jump or a restored scroll
       position can carry an element past the viewport between samples —
       and a missed reveal leaves content permanently invisible, which is
       far worse than a missed animation. This sweeps anything the user has
       already scrolled to and stops once nothing is pending. */
    let sweeping = false;
    function catchUp() {
      if (sweeping || !pending.size) return;
      sweeping = true;
      requestAnimationFrame(() => {
        const limit = innerHeight;
        pending.forEach((el) => {
          if (el.getBoundingClientRect().top < limit) reveal(el);
        });
        sweeping = false;
        if (!pending.size) removeEventListener("scroll", catchUp);
      });
    }
    addEventListener("scroll", catchUp, { passive: true });
    catchUp();
  }

  if (document.body.classList.contains("is-ready")) startReveals();
  else document.addEventListener("pg:ready", startReveals, { once: true });

  /* ---------------------------------------------------------
     Section spy for the masthead links. Scroll progress, the
     stuck/away masthead states and the tone changes are driven
     from motion.js so there is exactly one scroll loop.
     --------------------------------------------------------- */
  const navLinks = document.querySelectorAll(".menu__link");
  const spied = document.querySelectorAll("main section[id]");
  if (navLinks.length && spied.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    spied.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("menu");
  if (burger && menu) {
    const setMenu = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("is-locked", open);
    };
    burger.addEventListener("click", () => {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") setMenu(false);
    });
  }

  /* ---------------------------------------------------------
     Trajectory rail — highlights the stint in view
     --------------------------------------------------------- */
  const stints = document.querySelectorAll("[data-stint]");
  const years = document.querySelectorAll(".path__year");
  if (stints.length && years.length && "IntersectionObserver" in window) {
    const railSpy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = entry.target.getAttribute("data-stint");
          years.forEach((y) => y.classList.toggle("is-current", y.getAttribute("data-year") === idx));
        });
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    stints.forEach((s) => railSpy.observe(s));
  }

  /* ---------------------------------------------------------
     Counters — count once, when the panel first appears
     --------------------------------------------------------- */
  const counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    const target = Number(el.getAttribute("data-count")) || 0;
    const pad = Number(el.getAttribute("data-pad")) || 0;
    const write = (n) => { el.textContent = pad ? String(n).padStart(pad, "0") : String(n); };
    if (reduced) { write(target); return; }
    const dur = 1100;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      // easeOutExpo — fast settle, no bounce
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      write(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            cio.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((c) => cio.observe(c));
    }
  }

  /* ---------------------------------------------------------
     Toast
     --------------------------------------------------------- */
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-up");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-up"), 3200);
  }

  /* ---------------------------------------------------------
     Email — kept out of the source, assembled at runtime
     --------------------------------------------------------- */
  const MAIL = ["patrickjeri", ".garcia", "@", "gmail", ".com"].join("");
  const mailLink = document.getElementById("mail-link");
  const mailText = document.getElementById("mail-text");
  let revealed = false;

  function revealMail() {
    if (revealed || !mailLink) return;
    revealed = true;
    if (mailText) mailText.textContent = MAIL;
    mailLink.setAttribute("href", "mailto:" + MAIL);
    mailLink.removeAttribute("rel");
  }
  if (mailLink) {
    mailLink.addEventListener("click", (e) => {
      if (!revealed) { e.preventDefault(); revealMail(); }
    });
    mailLink.addEventListener("focus", revealMail, { once: true });
    addEventListener("pointerdown", revealMail, { once: true, passive: true });
  }

  const copyBtn = document.getElementById("copy-mail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      revealMail();
      try {
        await navigator.clipboard.writeText(MAIL);
        toast("Email address copied");
      } catch {
        toast(MAIL);
      }
    });
  }

  /* ---------------------------------------------------------
     Contact form — drafts a mail; honeypot + dwell-time guard
     --------------------------------------------------------- */
  const form = document.getElementById("contact-form");
  if (form) {
    const loadedAt = Date.now();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (String(data.get("website") || "").trim()) return;          // bot
      if (Date.now() - loadedAt < 2500) { toast("Just a moment…"); return; }

      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();
      if (!name || !email || !message) { toast("Please fill in every field"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { toast("That email looks off"); return; }

      revealMail();
      const subject = encodeURIComponent("Portfolio enquiry — " + name);
      const body = encodeURIComponent(message + "\n\n—\n" + name + "\n" + email);
      location.href = "mailto:" + MAIL + "?subject=" + subject + "&body=" + body;
      toast("Opening your email app…");
      form.reset();
    });
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
