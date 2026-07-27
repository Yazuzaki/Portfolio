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

    /* ---- Self-directed builds. `learned` is the point of these entries. ---- */
    coretech: {
      kind: "build",
      title: "CoreTech — PC Parts eCommerce",
      role: "Solo full-stack developer",
      org: "Personal project",
      period: "2026",
      focus: "Commerce, domain logic & authorization",
      demoLede:
        "A scaled-down version of the real compatibility engine, running right here in this page. Pick parts and it checks socket, memory, form factor and clearance, sizes the power supply, and estimates the bottleneck — the same pure-function approach the actual project uses. Try putting an ATX board in the compact case, or an AM5 chip on the AM4 board.",
      overview:
        "CoreTech is an eCommerce platform for computer components and custom PC builds. Beyond the usual catalog, cart, and checkout, it has a compatibility engine that checks a proposed build in real time — socket and chipset matching, memory and form-factor fit, GPU and cooler clearance against the case, PSU wattage with headroom, CPU-to-GPU bottleneck severity, and performance estimates. There's also a role-guarded admin dashboard where every mutation is written to an audit log.",
      challenge:
        "Two things made this harder than a tutorial storefront. The compatibility rules are real domain logic — dozens of interacting constraints that have to give the same answer whether they run on the server or in the browser. And a checkout is the one place in an app where being naive about trust actually costs money.",
      solution:
        "I kept the compatibility engine as a single pure function with no framework or database dependency, so the same code path powers instant client-side feedback and server-side validation. Checkout re-computes every price and re-validates every coupon on the server before an order is written, so client-submitted amounts are never trusted. Admin routes are guarded by role rather than by hiding UI, and each mutation appends an audit record.",
      learned: [
        "Keeping domain logic as a pure function — no framework, no database — is what let the same rules run on the server and in the browser without drifting apart. It also made the logic testable without booting anything.",
        "Never trust amounts the client sends you. The lesson landed when I realized my first checkout would happily accept a total the browser calculated; now the server recomputes prices and revalidates coupons before an order exists.",
        "Authorization belongs on the route, not in the UI. Hiding an admin button hides nothing — the redirect and the role check have to live server-side.",
        "Automated dependency fixes need reading, not running. The audit tool offered to \"solve\" my advisories by downgrading Next.js to a 2020 release that was dramatically more vulnerable. I pinned the latest 15.x instead, which cleared the critical items, and documented why the transitive ones stay.",
        "Generating product imagery locally as SVG beat hotlinking someone else's images — no broken links, no licensing question, and it loads instantly offline.",
      ],
      results: [
        { value: "Pure engine", label: "compatibility logic runs identically client & server" },
        { value: "Server-priced", label: "checkout recomputes totals and coupons" },
        { value: "RBAC + audit", label: "role-guarded admin, every mutation logged" },
      ],
      stack: ["Next.js 15 (App Router)", "React 19", "TypeScript", "Prisma", "Zod", "Tailwind CSS 4", "bcrypt"],
      note: "Private repository — happy to walk through the code or the compatibility engine on request.",
    },
    aurora: {
      kind: "build",
      title: "Aurora Flow — Productivity App",
      role: "Solo full-stack developer",
      org: "Personal project",
      period: "2026",
      focus: "Offline-first state, a11y & graceful degradation",
      demoLede:
        "The app's quick-add parser, live. Type a task the way you'd say it — priority, due date and tags come out of plain text. Completing a task awards XP exactly like the real thing.",
      overview:
        "Aurora Flow is a task, project, habit, goal, and focus-session tracker with analytics and an AI coach. It's keyboard-first — a command palette, quick-add syntax, and jump-to-page shortcuts — and it works completely offline as an installable PWA, with JSON export and import so the data stays portable.",
      challenge:
        "I wanted an app that needs no database, no account, and no API key to be genuinely useful, but still has a real upgrade path. That means all state has to live and persist client-side without turning into a tangle, and every optional feature has to have an honest answer for what happens when it isn't configured.",
      solution:
        "All state and mutations go through a single Zustand store persisted to localStorage, with a service worker caching the app shell so the whole thing runs with no network. The AI assistant calls any OpenAI-compatible endpoint when a key is present and otherwise falls back to a deterministic offline coach computed from the user's own data — the feature never just disappears. Charts are hand-rolled SVG rather than a charting dependency, and notes render through an XSS-safe Markdown renderer.",
      learned: [
        "One store, one place mutations happen. Centralizing every state change in a single Zustand store is what kept a nine-module app from becoming impossible to reason about — and made localStorage persistence a one-line concern instead of a scattered one.",
        "\"Offline-capable\" is a design constraint, not a feature you bolt on. Deciding up front that the app must work with no network shaped every data decision that followed.",
        "Optional dependencies need a real fallback, not an error state. Writing a deterministic offline coach for when there's no API key made the AI path better too — I had to define exactly what a good answer looked like before asking a model for one.",
        "Accessibility is cheap when it's early. Building the keyboard model, ARIA roles, reduced-motion handling, and never-color-alone charts from the start cost almost nothing; retrofitting any of them would have cost a rewrite.",
        "Rendering user Markdown is an XSS surface. Writing the renderer myself forced me to actually understand what I was escaping instead of trusting a dependency to have thought about it.",
        "Hand-rolling the SVG charts kept the bundle small and gave me exact control — a good reminder that a library isn't automatically the answer.",
      ],
      results: [
        { value: "Zero-setup", label: "no database, account or API key to run" },
        { value: "Offline PWA", label: "service worker shell + local persistence" },
        { value: "WCAG AA", label: "keyboard-first, reduced-motion aware" },
      ],
      stack: ["Next.js 15", "React 19", "TypeScript", "Zustand", "Tailwind CSS 4", "Service workers", "Docker"],
      note: "Private repository — happy to walk through the architecture notes or the state model on request.",
    },
    fintrack: {
      kind: "build",
      title: "Fintrack — Expense Tracker",
      role: "Solo full-stack developer",
      org: "Personal project",
      period: "2026",
      focus: "Monorepo contracts, auth & API design",
      demoLede:
        "The budget engine from Fintrack, simplified. Add spending and watch category budgets, warning thresholds, savings rate and the financial health score all recompute — the same pure finance math that's unit-tested in isolation in the real project.",
      overview:
        "Fintrack is a personal finance platform built as a pnpm workspace monorepo: a Next.js 15 app that serves both the web UI and the REST API, an Expo React Native mobile app, and a shared package holding every type and validation schema both clients use. It covers transactions, budgets with alerts, reports with CSV and JSON export, charts, an admin area, and a full auth lifecycle.",
      challenge:
        "Two clients against one API is where contracts quietly rot. Web and mobile also can't authenticate the same way — a browser wants httpOnly cookies, a mobile app wants bearer tokens in secure storage — so one API had to serve both without two sets of rules.",
      solution:
        "A shared package holds every DTO type and Zod schema; the backend validates with them and both clients import them, so a contract change is one edit in one place. The backend is layered — route → a wrapper handling auth, validation, and error mapping → a service layer → Prisma — with the pure finance math isolated so it can be unit-tested on its own. Every endpoint returns the same success/error envelope. Passwords use Argon2id, access tokens are short-lived JWTs, and refresh tokens are opaque and stored only as SHA-256 hashes. CI spins up a real Postgres and runs typecheck, lint, tests, and build on every push.",
      learned: [
        "A shared contract package is the difference between a monorepo and two projects in one folder. Types and Zod schemas in one place meant the API couldn't drift from its clients without the build telling me.",
        "Validating once, at the boundary, with the same schema the client uses is far safer than defensive checks scattered through the handlers.",
        "One API can serve two auth transports cleanly — httpOnly cookies for the browser, bearer tokens plus rotating refresh for mobile — as long as you separate 'who is this user' from 'how did they prove it'.",
        "Store refresh tokens as hashes, never in plaintext. If the database leaks, hashed refresh tokens are useless to whoever has it — the same reasoning as passwords, which I'd previously only applied to passwords.",
        "Pulling the finance math out into pure functions made it the easiest part of the codebase to trust, because it was the only part I could test without a database.",
        "A uniform response envelope pays for itself in the clients. Both apps have exactly one place that interprets an error, not one per screen.",
        "CI running against a real Postgres caught things a mocked database never would. Making typecheck, lint, test, and build a gate rather than a habit is what actually kept the branch green.",
      ],
      results: [
        { value: "1 contract", label: "shared types & Zod schemas for web + mobile" },
        { value: "2 clients", label: "Next.js web app and Expo mobile app" },
        { value: "CI gated", label: "typecheck → lint → test → build on Postgres" },
      ],
      stack: ["Next.js 15", "React Native (Expo)", "TypeScript", "PostgreSQL", "Prisma", "Zod", "Argon2id / JWT", "TanStack Query", "Vitest", "Docker"],
      note: "Private repository — happy to walk through the API design or the shared-contract setup on request.",
    },
  };

  // Prev/next navigation stays inside its own group.
  const GROUPS = [
    ["m365", "domains", "pos", "vendors"],
    ["coretech", "aurora", "fintrack"],
  ];
  const ORDER = GROUPS.flat();

  function groupOf(slug) {
    return GROUPS.find((g) => g.indexOf(slug) !== -1) || ORDER;
  }

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
    const group = groupOf(slug);
    const idx = group.indexOf(slug);
    const prev = group[(idx - 1 + group.length) % group.length];
    const next = group[(idx + 1) % group.length];

    const isBuild = p.kind === "build";
    const labels = isBuild
      ? { challenge: "The hard part", solution: "How I built it", results: "At a glance", stack: "Stack" }
      : { challenge: "Why it matters", solution: "How I handle it", results: "Scope", stack: "Tools &amp; environment" };

    const hasDemo = !!(window.PortfolioDemos && window.PortfolioDemos.has(slug));
    const demoHTML = hasDemo
      ? `<div class="cs__section">
          <h3>Try it</h3>
          <p class="cs__demo-lede">${esc(p.demoLede || "A scaled-down, self-contained version of the real thing — it runs entirely in this page.")}</p>
          <div class="demo" data-demo="${esc(slug)}"></div>
        </div>`
      : "";

    const learnedHTML = p.learned
      ? `<div class="cs__section">
          <h3>What I learned</h3>
          <ul class="cs__learned">${p.learned.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
        </div>`
      : "";
    const noteHTML = p.note ? `<p class="cs__note">${esc(p.note)}</p>` : "";

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
          <h3>${labels.challenge}</h3>
          <p>${esc(p.challenge)}</p>
        </div>
        <div class="cs__section">
          <h3>${labels.solution}</h3>
          <p>${esc(p.solution)}</p>
        </div>
        ${demoHTML}
        ${learnedHTML}
        <div class="cs__section">
          <h3>${labels.results}</h3>
          <div class="cs__results">
            ${p.results.map((r) => `<div class="cs__result"><strong>${esc(r.value)}</strong><span>${esc(r.label)}</span></div>`).join("")}
          </div>
        </div>
        <div class="cs__section">
          <h3>${labels.stack}</h3>
          <ul class="chips cs__stack">${p.stack.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          ${noteHTML}
        </div>
        <nav class="cs__nav" aria-label="Case study navigation">
          <button type="button" data-goto="${esc(prev)}">&larr; ${esc(PROJECTS[prev].title)}</button>
          <button type="button" data-goto="${esc(next)}">${esc(PROJECTS[next].title)} &rarr;</button>
        </nav>
      </div>`;
    if (window.PortfolioDemos) window.PortfolioDemos.mount(content);
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
      // Includes the form controls the interactive demos add.
      const focusables = overlay.querySelectorAll("button, [href], input, select, textarea, [tabindex='-1']");
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
