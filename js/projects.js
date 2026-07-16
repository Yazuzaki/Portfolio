/* ============================================================
   Case study data + overlay
   Each card opens a full case study in an accessible dialog.
   Deep-linkable via #case/<slug>. Content reflects real roles
   and responsibilities — scope facts, not invented metrics.
   ============================================================ */
(function () {
  "use strict";

  const PROJECTS = {
    m365: {
      title: "Microsoft 365 at Scale",
      role: "IT Officer",
      org: "Esquire Tech Corp",
      period: "Mar 2026 — Present",
      focus: "Identity, email & licensing",
      overview:
        "At Esquire Tech Corp I administer the Microsoft 365 environment that 100+ users across multiple business locations depend on every day. That covers the full account lifecycle — provisioning new users, assigning the right licenses, configuring mailboxes in Exchange Online, and troubleshooting everything from Outlook connectivity to sign-in and access issues.",
      challenge:
        "In a multi-location business, email and identity are the backbone of daily operations. A provisioning mistake locks someone out on their first day; a mailbox issue can stall an entire department. The job is to make sure that never becomes the story — accounts ready before they're needed, issues resolved before they spread.",
      solution:
        "I keep provisioning, licensing, and mailbox management consistent and documented: standard setup procedures for new hires, license assignments matched to actual needs to avoid waste, and a troubleshooting-first mindset that traces problems to root cause instead of patching symptoms. Alongside Microsoft 365, I support Google Workspace administration and email migration activities, so the business isn't locked to a single platform's way of working.",
      results: [
        { value: "100+", label: "user accounts and mailboxes administered" },
        { value: "Multi-site", label: "locations supported from one admin seat" },
        { value: "2 platforms", label: "Microsoft 365 and Google Workspace" },
      ],
      stack: ["Microsoft 365 Admin", "Exchange Online", "Outlook", "Google Workspace", "Email migration"],
    },
    domains: {
      title: "Email Security & Domains",
      role: "IT Officer",
      org: "Esquire Tech Corp",
      period: "Mar 2026 — Present",
      focus: "DNS, authentication & certificates",
      overview:
        "I own the company's domain infrastructure end to end: DNS and MX records that route mail and services, the SPF, DKIM, and DMARC records that keep our email trusted and out of spam folders, SSL certificates that keep sites and services secure, and the renewal calendar that makes sure none of it silently expires.",
      challenge:
        "Domain and DNS work is invisible when it's done right and catastrophic when it isn't — a wrong MX record stops all inbound mail, a lapsed SSL certificate breaks customer trust overnight, and missing email authentication gets a whole domain flagged as spam. There are no small mistakes at this layer.",
      solution:
        "I treat DNS changes like production deployments: verify current records before touching anything, make one change at a time, and confirm propagation and mail flow afterward. SPF, DKIM, and DMARC are configured and checked so legitimate mail authenticates and spoofing attempts fail. Certificates and domain registrations are tracked ahead of their renewal dates — expiry surprises are a process failure, and the process is built so they don't happen.",
      results: [
        { value: "SPF·DKIM·DMARC", label: "email authentication maintained" },
        { value: "DNS + MX", label: "records for business domains and mail flow" },
        { value: "SSL", label: "certificate lifecycle and domain renewals" },
      ],
      stack: ["DNS management", "MX records", "SPF / DKIM / DMARC", "SSL certificates", "Domain administration"],
    },
    pos: {
      title: "POS & Retail IT Support",
      role: "Technical Support Engineer → IT Officer",
      org: "APSoft · Esquire Tech Corp",
      period: "Dec 2024 — Present",
      focus: "Revenue-critical systems",
      overview:
        "Since late 2024 I've supported the systems businesses use to take money: POS terminals, receipt printers, barcode scanners, and the back-office software behind them. At APSoft I delivered onsite and remote support to business clients; at Esquire Tech Corp I continue supporting POS deployment and maintenance across our own locations.",
      challenge:
        "When a POS terminal goes down, the business stops selling — every minute is measured in lost transactions and frustrated customers. Support has to be fast, but more importantly the failures have to stop happening in the first place.",
      solution:
        "Two habits define how I handle POS environments. First, disciplined installs: terminals, printers, and scanners configured and tested properly the first time, with the OS and applications deployed to a known-good baseline. Second, preventive maintenance: regular diagnostics, component replacement before failure, and cleanup that catches problems while they're still cheap. When something does break, I've done enough hardware diagnostics and system reconfiguration to restore service quickly — onsite or remote.",
      results: [
        { value: "Onsite + remote", label: "support model across client sites" },
        { value: "End-to-end", label: "deploy, diagnose, repair, maintain" },
        { value: "Documented", label: "procedures and service records kept" },
      ],
      stack: ["POS terminals", "Receipt printers", "Barcode scanners", "Windows", "Hardware diagnostics"],
    },
    vendors: {
      title: "Vendor & ISP Coordination",
      role: "IT Officer",
      org: "Esquire Tech Corp",
      period: "Mar 2026 — Present",
      focus: "Connectivity & escalations",
      overview:
        "Multi-site businesses live on their internet connections, and those connections come from vendors. I'm the single point of contact between the company and five telecommunications providers — PLDT, Smart Enterprise, Converge, Globe, and SKY — handling service requests, outage escalations, and account management across all our locations.",
      challenge:
        "Vendor support queues don't care that your branch is offline. Getting an ISP to move requires knowing exactly what to report, who to escalate to, and how to keep pressure on a ticket without burning the relationship — while keeping the affected site informed and working on whatever fallback exists.",
      solution:
        "I keep account details, circuit information, and escalation paths documented for every provider, so an outage report is specific and actionable from the first call. Escalations get tracked to resolution, not just reported. And because I also maintain the internal network — routers, switches, LAN/WAN configuration — I can tell the difference between a provider problem and an internal one before wasting anyone's time.",
      results: [
        { value: "5 providers", label: "PLDT, Smart, Converge, Globe, SKY" },
        { value: "Multi-site", label: "connectivity across business locations" },
        { value: "First call", label: "to resolution — owned end to end" },
      ],
      stack: ["Vendor management", "Escalation handling", "LAN / WAN", "Router & switch config", "Network troubleshooting"],
    },
  };

  const ORDER = ["m365", "domains", "pos", "vendors"];

  const overlay = document.getElementById("case-study");
  const panel = overlay ? overlay.querySelector(".case-study__panel") : null;
  const content = document.getElementById("cs-content");
  if (!overlay || !panel || !content) return;

  let activeSlug = null;
  let lastFocused = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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
          <div><dt>Organization</dt><dd>${esc(p.org)}</dd></div>
          <div><dt>Period</dt><dd>${esc(p.period)}</dd></div>
          <div><dt>Focus</dt><dd>${esc(p.focus)}</dd></div>
        </dl>
        <div class="cs__section">
          <h3>Overview</h3>
          <p>${esc(p.overview)}</p>
        </div>
        <div class="cs__section">
          <h3>Why it matters</h3>
          <p>${esc(p.challenge)}</p>
        </div>
        <div class="cs__section">
          <h3>How I handle it</h3>
          <p>${esc(p.solution)}</p>
        </div>
        <div class="cs__section">
          <h3>Scope</h3>
          <div class="cs__results">
            ${p.results.map((r) => `<div class="cs__result"><strong>${esc(r.value)}</strong><span>${esc(r.label)}</span></div>`).join("")}
          </div>
        </div>
        <div class="cs__section">
          <h3>Tools &amp; environment</h3>
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
