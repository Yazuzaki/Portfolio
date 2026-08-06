/* ============================================================
   Case studies + the full-screen reader.

   Two content shapes share one reader:
   - kind "build"  — shipped software. Gets figures, results,
                     a playable demo and a lessons list.
   - kind "field"  — IT ownership. Scope and approach only;
                     deliberately lighter, no invented metrics.

   Deep-linkable via #case/<slug>. Prev/next stays inside its
   own group so the two kinds never bleed into each other.
   ============================================================ */
(function () {
  "use strict";

  const CASES = {
    /* ---------------- Shipped software ---------------- */
    coretech: {
      kind: "build",
      title: "CoreTech",
      subtitle: "PC parts eCommerce with a compatibility engine",
      year: "2026",
      role: "Solo full-stack developer",
      focus: "Commerce, domain logic & authorization",
      thesis:
        "An eCommerce platform for computer components and custom builds, where the hard part isn't the storefront — it's a compatibility engine that has to give the same answer in the browser and on the server, and a checkout that treats every number the client sends as untrusted.",
      hero: { src: "img/coretech-hero.webp", alt: "The CoreTech storefront headlined “Build a PC that just works”, with a featured build card showing FPS, compatibility and future-proof ratings." },
      spec: [
        ["Type", "eCommerce platform"],
        ["Timeline", "2026 · solo"],
        ["Surface", "Web · 12+ routes"],
        ["Data", "SQLite dev, Postgres-ready"],
      ],
      overview:
        "CoreTech sells computer components and custom PCs. Alongside the catalog, search, filtering, cart and checkout you'd expect, it has a build compatibility engine: pick a CPU, board, GPU, case and power supply and it checks socket and chipset matching, memory type, form factor, GPU and cooler clearance, sizes the PSU with headroom, rates the CPU-to-GPU bottleneck, and estimates performance. Behind that sits a role-guarded admin dashboard where every mutation — price change, stock adjustment, order status, role grant — appends an audit record.",
      problem:
        "Two things made this harder than a tutorial storefront. The compatibility rules are real domain logic: dozens of interacting constraints that must produce identical results whether they run during instant client-side feedback or during server-side validation, because a disagreement between the two is a bug the user sees. And checkout is the one place in an application where being naive about trust costs real money.",
      approach:
        "The compatibility engine is a single pure function with no framework and no database dependency, so the same code path powers both the browser and the server. Checkout re-computes every price and re-validates every coupon server-side before an order row exists, so client-submitted amounts are never authoritative. Admin routes are guarded by role on the server rather than by hiding UI, and each mutation writes to an audit log. Product imagery is generated locally as SVG, so nothing hotlinks and nothing breaks offline.",
      figures: [
        { src: "img/coretech-1.webp", alt: "The CoreTech PC builder: component slots for processor, motherboard, memory and graphics card beside a live build summary with wattage and recommendations.", cap: "The builder — live compatibility, wattage and recommendations" },
        { src: "img/coretech-2.webp", alt: "The CoreTech catalog page showing filters for category, brand and price beside a grid of component cards with prices and ratings.", cap: "Catalog — URL-driven filters, sorting and instant search" },
      ],
      results: [
        { v: "1 engine", l: "one pure function serving both client and server, with no duplicated rules" },
        { v: "5 checks", l: "socket, memory, form factor, clearance and power, each with a reason string" },
        { v: "Audited", l: "every admin mutation recorded, role-guarded at the route" },
      ],
      stack: ["Next.js 15 (App Router)", "React 19", "TypeScript", "Prisma", "Zod", "Tailwind CSS 4", "bcrypt"],
      learned: [
        "Keeping domain logic as a pure function — no framework, no database — is what let the same rules run on the server and in the browser without drifting apart. It also made the logic testable without booting anything.",
        "Never trust amounts the client sends you. The lesson landed when I realised my first checkout would happily accept a total the browser calculated; now the server recomputes prices and revalidates coupons before an order exists.",
        "Authorization belongs on the route, not in the UI. Hiding an admin button hides nothing — the redirect and the role check have to live server-side.",
        "Automated dependency fixes need reading, not running. The audit tool offered to \"solve\" my advisories by downgrading Next.js to a 2020 release that was dramatically more vulnerable. I pinned the latest 15.x instead, which cleared the critical items, and documented why the transitive ones stay.",
        "Generating product imagery locally as SVG beat hotlinking someone else's images — no broken links, no licensing question, and it loads instantly offline.",
      ],
      demoLede:
        "A scaled-down version of the real compatibility engine, running right here in this page. Pick parts and it checks socket, memory, form factor and clearance, sizes the power supply, and estimates the bottleneck — the same pure-function approach the actual project uses. Try putting an ATX board in the compact case, or an AM5 chip on the AM4 board.",
      links: [
        { label: "Repository", value: "Private" },
        { label: "Live demo", value: "Interactive, below" },
        { label: "GitHub", value: "github.com/Yazuzaki", href: "https://github.com/Yazuzaki" },
      ],
      note: "Happy to walk through the code or the compatibility engine on request.",
    },

    aurora: {
      kind: "build",
      title: "Aurora Flow",
      subtitle: "An offline-first productivity system",
      year: "2026",
      role: "Solo full-stack developer",
      focus: "Offline state, accessibility & graceful degradation",
      thesis:
        "A keyboard-first task, habit, goal and focus tracker that needs no database, no account and no API key to be genuinely useful — and that has an honest answer for what happens when the optional pieces aren't configured.",
      hero: { src: "img/aurora-hero.webp", alt: "The Aurora Flow dashboard showing today's focus tasks, progress rings for the day and week, streaks and an XP level bar." },
      spec: [
        ["Type", "Productivity PWA"],
        ["Timeline", "2026 · solo"],
        ["Surface", "9 modules, installable"],
        ["Data", "Local-first, JSON portable"],
      ],
      overview:
        "Aurora Flow covers tasks, projects, habits, goals, focus sessions, notes, analytics and an AI coach, in a keyboard-first shell — a command palette, quick-add syntax, and jump-to-page shortcuts. It installs as a PWA, runs with no network, and offers JSON export and import so the data never gets trapped.",
      problem:
        "I wanted an app that's useful with zero setup but still has a real upgrade path. That means all state has to live and persist client-side without turning into a tangle, and every optional feature needs a defined behaviour when it isn't configured. \"Add your API key to continue\" is a dead end, not a feature.",
      approach:
        "All state and mutations run through a single Zustand store persisted to localStorage, with a service worker caching the app shell. The AI assistant calls any OpenAI-compatible endpoint when a key is present and otherwise falls back to a deterministic offline coach computed from the user's own data — the feature never simply disappears. Charts are hand-rolled SVG rather than a charting dependency, and notes render through an XSS-safe Markdown renderer I wrote rather than trusting a package to have thought about escaping.",
      figures: [
        { src: "img/aurora-1.webp", alt: "The Aurora Flow tasks view listing overdue, today and upcoming tasks with priority and project tags.", cap: "Tasks — list, board and Eisenhower views" },
        { src: "img/aurora-2.webp", alt: "The Aurora Flow analytics view with a completions chart, a per-project donut, productive-hours breakdown and a consistency heatmap.", cap: "Analytics — hand-rolled SVG, no charting dependency" },
        { src: "img/aurora-3.webp", alt: "The Aurora Flow focus view showing a 25 minute Pomodoro timer with session setup and a recent sessions panel.", cap: "Focus — Pomodoro and deep-work, WebAudio ambience" },
      ],
      results: [
        { v: "0 setup", l: "no database, account or API key needed to run the app" },
        { v: "Offline", l: "service worker shell plus local persistence, installable" },
        { v: "WCAG AA", l: "full keyboard model, reduced-motion aware, never colour-alone" },
      ],
      stack: ["Next.js 15", "React 19", "TypeScript", "Zustand", "Tailwind CSS 4", "Service workers", "Docker"],
      learned: [
        "One store, one place mutations happen. Centralising every state change in a single Zustand store is what kept a nine-module app from becoming impossible to reason about — and made localStorage persistence a one-line concern instead of a scattered one.",
        "\"Offline-capable\" is a design constraint, not a feature you bolt on. Deciding up front that the app must work with no network shaped every data decision that followed.",
        "Optional dependencies need a real fallback, not an error state. Writing a deterministic offline coach for when there's no API key made the AI path better too — I had to define exactly what a good answer looked like before asking a model for one.",
        "Accessibility is cheap when it's early. Building the keyboard model, ARIA roles, reduced-motion handling and never-colour-alone charts from the start cost almost nothing; retrofitting any of them would have cost a rewrite.",
        "Rendering user Markdown is an XSS surface. Writing the renderer myself forced me to actually understand what I was escaping instead of trusting a dependency to have thought about it.",
        "Hand-rolling the SVG charts kept the bundle small and gave me exact control — a good reminder that a library isn't automatically the answer.",
      ],
      demoLede:
        "The app's quick-add parser, live. Type a task the way you'd say it — priority, due date and tags come out of plain text. Completing a task awards XP exactly like the real thing.",
      links: [
        { label: "Repository", value: "Private" },
        { label: "Live demo", value: "Interactive, below" },
        { label: "GitHub", value: "github.com/Yazuzaki", href: "https://github.com/Yazuzaki" },
      ],
      note: "Happy to walk through the architecture notes or the state model on request.",
    },

    fintrack: {
      kind: "build",
      title: "Fintrack",
      subtitle: "One API, a web app and a native mobile app",
      year: "2026",
      role: "Solo full-stack developer",
      focus: "Monorepo contracts, auth & API design",
      thesis:
        "A personal finance platform built as a monorepo, where a Next.js web app and an Expo mobile app consume one REST API, one set of TypeScript types, and one set of Zod schemas — so the contract can't drift without the build saying so.",
      hero: { src: "img/fintrack-hero.webp", alt: "The Fintrack dashboard showing total balance, income and expenses, an income-versus-expenses bar chart and a financial health score dial." },
      spec: [
        ["Type", "Finance platform"],
        ["Timeline", "2026 · solo"],
        ["Surface", "Web + iOS/Android"],
        ["Data", "PostgreSQL via Prisma"],
      ],
      overview:
        "Fintrack is a pnpm workspace monorepo: a Next.js 15 app serving both the web UI and the REST API, an Expo React Native mobile app, and a shared package holding every type and validation schema both clients use. It covers transactions, budgets with warning thresholds, reports with CSV and JSON export, charts, an admin area, and a full auth lifecycle from registration through password reset.",
      problem:
        "Two clients against one API is where contracts quietly rot — the server changes a field, one client keeps working, the other breaks in production. Web and mobile also can't authenticate the same way: a browser wants httpOnly cookies, a mobile app wants bearer tokens in secure storage. One API had to serve both without maintaining two sets of rules.",
      approach:
        "A shared package holds every DTO type and Zod schema; the backend validates with them and both clients import them, so a contract change is a single edit that either compiles everywhere or fails loudly. The backend is layered — route → a wrapper handling auth, validation and error mapping → a service layer → Prisma — with the pure finance maths isolated so it can be unit-tested without a database. Every endpoint returns the same success/error envelope, so each client has exactly one place that interprets an error. Passwords use Argon2id, access tokens are short-lived JWTs, and refresh tokens are opaque and stored only as SHA-256 hashes.",
      figures: [
        { src: "img/fintrack-1.webp", alt: "The Fintrack transactions view: a searchable, filterable list of income and expense records with categories, dates and amounts.", cap: "Transactions — search, filter, sort, paginate" },
        { src: "img/fintrack-2.webp", alt: "The Fintrack reports view showing a spending-by-category donut chart with income, expense, savings and net cash flow totals and a highlights panel.", cap: "Reports — CSV and JSON export, print to PDF" },
      ],
      results: [
        { v: "1 contract", l: "shared types and Zod schemas consumed by API and both clients" },
        { v: "2 clients", l: "Next.js web app and Expo mobile app on the same endpoints" },
        { v: "4 gates", l: "typecheck, lint, test and build run on real Postgres in CI" },
      ],
      stack: ["Next.js 15", "React Native (Expo)", "TypeScript", "PostgreSQL", "Prisma", "Zod", "Argon2id / JWT", "TanStack Query", "Vitest", "Docker"],
      learned: [
        "A shared contract package is the difference between a monorepo and two projects in one folder. Types and Zod schemas in one place meant the API couldn't drift from its clients without the build telling me.",
        "Validating once, at the boundary, with the same schema the client uses is far safer than defensive checks scattered through the handlers.",
        "One API can serve two auth transports cleanly — httpOnly cookies for the browser, bearer tokens plus rotating refresh for mobile — as long as you separate \"who is this user\" from \"how did they prove it\".",
        "Store refresh tokens as hashes, never in plaintext. If the database leaks, hashed refresh tokens are useless to whoever has it — the same reasoning as passwords, which I'd previously only applied to passwords.",
        "Pulling the finance maths out into pure functions made it the easiest part of the codebase to trust, because it was the only part I could test without a database.",
        "A uniform response envelope pays for itself in the clients. Both apps have exactly one place that interprets an error, not one per screen.",
        "CI running against a real Postgres caught things a mocked database never would. Making typecheck, lint, test and build a gate rather than a habit is what actually kept the branch green.",
      ],
      demoLede:
        "The budget engine from Fintrack, simplified. Add spending and watch category budgets, warning thresholds, savings rate and the financial health score all recompute — the same pure finance maths that's unit-tested in isolation in the real project.",
      links: [
        { label: "Repository", value: "Private" },
        { label: "Live demo", value: "Interactive, below" },
        { label: "GitHub", value: "github.com/Yazuzaki", href: "https://github.com/Yazuzaki" },
      ],
      note: "Happy to walk through the API design or the shared-contract setup on request.",
    },

    /* ---------------- IT ownership ---------------- */
    m365: {
      kind: "field",
      title: "Microsoft 365 at Scale",
      subtitle: "Identity, email and licensing for 100+ users",
      year: "Mar 2026 — Present",
      role: "IT Officer",
      org: "Esquire Tech Corp",
      focus: "Identity, email & licensing",
      thesis:
        "Administering the Microsoft 365 environment that 100+ users across multiple business locations depend on every day — the full account lifecycle, from provisioning to the mailbox issue nobody wants to inherit.",
      spec: [
        ["Role", "IT Officer"],
        ["Organisation", "Esquire Tech Corp"],
        ["Period", "Mar 2026 — Present"],
        ["Scope", "100+ users, multi-site"],
      ],
      overview:
        "I administer the Microsoft 365 environment for 100+ users across multiple business locations. That covers the full account lifecycle — provisioning new users, assigning the right licences, configuring mailboxes in Exchange Online, and troubleshooting everything from Outlook connectivity to sign-in and access issues. Alongside Microsoft 365 I support Google Workspace administration and email migration activities.",
      problem:
        "In a multi-location business, email and identity are the backbone of daily operations. A provisioning mistake locks someone out on their first day; a mailbox issue can stall an entire department. The job is to make sure that never becomes the story — accounts ready before they're needed, issues resolved before they spread.",
      approach:
        "I keep provisioning, licensing and mailbox management consistent and documented: standard setup procedures for new hires, licence assignments matched to actual needs to avoid waste, and a troubleshooting-first mindset that traces problems to root cause instead of patching symptoms. Supporting two platforms means the business isn't locked into a single vendor's way of working.",
      results: [
        { v: "100+", l: "user accounts and mailboxes administered" },
        { v: "Multi-site", l: "locations supported from one admin seat" },
        { v: "2 platforms", l: "Microsoft 365 and Google Workspace" },
      ],
      stack: ["Microsoft 365 Admin", "Exchange Online", "Outlook", "Google Workspace", "Email migration"],
    },

    domains: {
      kind: "field",
      title: "Email Security & Domains",
      subtitle: "DNS, authentication and certificate lifecycles",
      year: "Mar 2026 — Present",
      role: "IT Officer",
      org: "Esquire Tech Corp",
      focus: "DNS, authentication & certificates",
      thesis:
        "Owning the domain infrastructure end to end — the records that route mail, the authentication that keeps it trusted, and the renewal calendar that stops any of it expiring quietly.",
      spec: [
        ["Role", "IT Officer"],
        ["Organisation", "Esquire Tech Corp"],
        ["Period", "Mar 2026 — Present"],
        ["Scope", "Business domains & mail flow"],
      ],
      overview:
        "I own DNS and MX records that route mail and services, the SPF, DKIM and DMARC records that keep company email trusted and out of spam folders, SSL certificates that keep sites and services secure, and the renewal calendar that makes sure none of it silently expires.",
      problem:
        "Domain and DNS work is invisible when it's done right and catastrophic when it isn't. A wrong MX record stops all inbound mail. A lapsed SSL certificate breaks customer trust overnight. Missing email authentication gets an entire domain flagged as spam. There are no small mistakes at this layer.",
      approach:
        "I treat DNS changes like production deployments: verify current records before touching anything, make one change at a time, and confirm propagation and mail flow afterward. SPF, DKIM and DMARC are configured and checked so legitimate mail authenticates and spoofing attempts fail. Certificates and domain registrations are tracked ahead of their renewal dates — an expiry surprise is a process failure, and the process is built so they don't happen.",
      results: [
        { v: "SPF·DKIM·DMARC", l: "email authentication maintained across domains" },
        { v: "DNS + MX", l: "records for business domains and mail flow" },
        { v: "SSL", l: "certificate lifecycle and domain renewals tracked" },
      ],
      stack: ["DNS management", "MX records", "SPF / DKIM / DMARC", "SSL certificates", "Domain administration"],
    },

    pos: {
      kind: "field",
      title: "POS & Retail IT Support",
      subtitle: "The systems businesses use to take money",
      year: "Dec 2024 — Present",
      role: "Technical Support Engineer → IT Officer",
      org: "APSoft · Esquire Tech Corp",
      focus: "Revenue-critical systems",
      thesis:
        "Supporting POS terminals, receipt printers, barcode scanners and back-office software — where every minute of downtime is measured in lost transactions.",
      spec: [
        ["Role", "Support Engineer → IT Officer"],
        ["Organisation", "APSoft · Esquire Tech Corp"],
        ["Period", "Dec 2024 — Present"],
        ["Model", "Onsite and remote"],
      ],
      overview:
        "Since late 2024 I've supported the systems businesses use to take money: POS terminals, receipt printers, barcode scanners, and the back-office software behind them. At APSoft I delivered onsite and remote support to business clients; at Esquire Tech Corp I continue supporting POS deployment and maintenance across our own locations.",
      problem:
        "When a POS terminal goes down, the business stops selling — every minute is measured in lost transactions and frustrated customers. Support has to be fast, but more importantly the failures have to stop happening in the first place.",
      approach:
        "Two habits define how I handle POS environments. First, disciplined installs: terminals, printers and scanners configured and tested properly the first time, with the OS and applications deployed to a known-good baseline. Second, preventive maintenance — regular diagnostics, component replacement before failure, and cleanup that catches problems while they're still cheap. When something does break, I've done enough hardware diagnostics and system reconfiguration to restore service quickly, onsite or remote.",
      results: [
        { v: "Onsite + remote", l: "support model across client sites" },
        { v: "End-to-end", l: "deploy, diagnose, repair, maintain" },
        { v: "Documented", l: "procedures and service records kept current" },
      ],
      stack: ["POS terminals", "Receipt printers", "Barcode scanners", "Windows", "Hardware diagnostics"],
    },

    vendors: {
      kind: "field",
      title: "Vendor & ISP Coordination",
      subtitle: "Single point of contact for five providers",
      year: "Mar 2026 — Present",
      role: "IT Officer",
      org: "Esquire Tech Corp",
      focus: "Connectivity & escalations",
      thesis:
        "Multi-site businesses live on their internet connections. I'm the single point of contact between the company and five telecommunications providers — and the person who knows whether the fault is theirs or ours.",
      spec: [
        ["Role", "IT Officer"],
        ["Organisation", "Esquire Tech Corp"],
        ["Period", "Mar 2026 — Present"],
        ["Providers", "PLDT, Smart, Converge, Globe, SKY"],
      ],
      overview:
        "I handle service requests, outage escalations and account management with PLDT, Smart Enterprise, Converge, Globe and SKY across all our locations, and I maintain the internal network — routers, switches, LAN/WAN configuration — that sits behind those connections.",
      problem:
        "Vendor support queues don't care that your branch is offline. Getting an ISP to move requires knowing exactly what to report, who to escalate to, and how to keep pressure on a ticket without burning the relationship — while keeping the affected site informed and working on whatever fallback exists.",
      approach:
        "I keep account details, circuit information and escalation paths documented for every provider, so an outage report is specific and actionable from the first call. Escalations get tracked to resolution, not just reported. And because I also maintain the internal network, I can tell the difference between a provider problem and an internal one before wasting anyone's time.",
      results: [
        { v: "5 providers", l: "PLDT, Smart Enterprise, Converge, Globe, SKY" },
        { v: "Multi-site", l: "connectivity across business locations" },
        { v: "First call", l: "to resolution — owned end to end" },
      ],
      stack: ["Vendor management", "Escalation handling", "LAN / WAN", "Router & switch config", "Network troubleshooting"],
    },
  };

  const GROUPS = [
    ["coretech", "aurora", "fintrack"],
    ["m365", "domains", "pos", "vendors"],
  ];
  const ALL = GROUPS.flat();

  const reader = document.getElementById("reader");
  const content = document.getElementById("rd-content");
  const seq = document.getElementById("rd-seq");
  if (!reader || !content) return;

  let active = null;
  let lastFocused = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function groupOf(slug) {
    return GROUPS.find((g) => g.indexOf(slug) !== -1) || ALL;
  }

  function section(label, inner) {
    return `<section class="rd__section grid"><h3>${label}</h3><div class="rd__body">${inner}</div></section>`;
  }

  function render(slug) {
    const c = CASES[slug];
    if (!c) return false;

    const group = groupOf(slug);
    const i = group.indexOf(slug);
    const prev = group[(i - 1 + group.length) % group.length];
    const next = group[(i + 1) % group.length];

    const kicker = [c.year, c.role, c.org, c.focus].filter(Boolean)
      .map((t) => `<span>${esc(t)}</span>`).join("");

    const hero = c.hero
      ? `<div class="rd__shot">
           <div class="frame"><img src="${esc(c.hero.src)}?v=7" alt="${esc(c.hero.alt)}" loading="lazy" decoding="async" /></div>
         </div>`
      : "";

    const spec = c.spec
      ? `<dl class="rd__spec">${c.spec.map(([k, v]) =>
          `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`
      : "";

    const figures = c.figures
      ? `<div class="rd__figures">${c.figures.map((f) =>
          `<figure>
             <div class="frame"><img src="${esc(f.src)}?v=7" alt="${esc(f.alt)}" loading="lazy" decoding="async" /></div>
             <figcaption>${esc(f.cap)}</figcaption>
           </figure>`).join("")}</div>`
      : "";

    const demo = (window.PortfolioDemos && window.PortfolioDemos.has(slug))
      ? section("Try it", `<p>${esc(c.demoLede)}</p><div class="demo" data-demo="${esc(slug)}"></div>`)
      : "";

    const learned = c.learned
      ? section("What I learned", `<ol class="rd__learned">${c.learned.map((l) =>
          `<li>${esc(l)}</li>`).join("")}</ol>`)
      : "";

    const results = `<div class="rd__results">${c.results.map((r) =>
      `<div class="rd__result"><b>${esc(r.v)}</b><span>${esc(r.l)}</span></div>`).join("")}</div>`;

    const note = c.note ? `<p class="rd__note">${esc(c.note)}</p>` : "";

    /* Links row. An entry without an href renders as status text rather
       than a dead link — these repositories are private and there is no
       public demo to point at except the one embedded in this page. */
    const links = c.links
      ? `<div class="rd__links">${c.links.map((l) => l.href
          ? `<a class="action" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer nofollow">${esc(l.value)}
               <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 11 11 5m0 0H6m5 0v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
             </a>`
          : `<span class="rd__link-fact"><b>${esc(l.label)}</b>${esc(l.value)}</span>`).join("")}</div>`
      : "";

    content.innerHTML = `
      <header class="rd__hero">
        <p class="rd__kicker">${kicker}</p>
        <h2 class="rd__title" id="rd-title">${esc(c.title)}</h2>
        <p class="rd__thesis">${esc(c.thesis)}</p>
        ${links}
      </header>
      ${hero}
      ${spec}
      ${section("Overview", `<p>${esc(c.overview)}</p>`)}
      ${section(c.kind === "build" ? "The hard part" : "Why it matters", `<p>${esc(c.problem)}</p>`)}
      ${section(c.kind === "build" ? "How I built it" : "How I handle it", `<p>${esc(c.approach)}</p>${figures}`)}
      ${demo}
      ${learned}
      ${section("Results", results)}
      ${section("Stack", `<ul class="tags">${c.stack.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>${note}`)}
      <nav class="rd__next" aria-label="Case study navigation">
        <button type="button" data-goto="${esc(prev)}">&larr; ${esc(CASES[prev].title)}</button>
        <button type="button" data-goto="${esc(next)}">${esc(CASES[next].title)} &rarr;</button>
      </nav>`;

    if (seq) seq.textContent = String(i + 1).padStart(2, "0") + " / " + String(group.length).padStart(2, "0");
    if (window.PortfolioDemos) window.PortfolioDemos.mount(content);
    return true;
  }

  function open(slug, opts) {
    const pushHash = !opts || opts.pushHash !== false;
    if (!render(slug)) return;
    active = slug;
    if (reader.hidden) {
      lastFocused = document.activeElement;
      reader.hidden = false;
      document.body.classList.add("is-locked");
      requestAnimationFrame(() => reader.classList.add("is-open"));
    }
    reader.scrollTop = 0;
    content.focus({ preventScroll: true });
    if (pushHash) history.pushState(null, "", "#case/" + slug);
  }

  function close(opts) {
    const popHash = !opts || opts.popHash !== false;
    if (reader.hidden) return;
    active = null;
    reader.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    const done = () => { reader.hidden = true; };
    matchMedia("(prefers-reduced-motion: reduce)").matches ? done() : setTimeout(done, 420);
    if (popHash && location.hash.indexOf("#case/") === 0) {
      history.pushState(null, "", location.pathname + location.search);
    }
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  }

  /* Triggers: anything carrying data-open. Anchors keep working with
     JS off because their href is the deep link. */
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open]");
    if (trigger && !reader.contains(trigger)) {
      e.preventDefault();
      open(trigger.getAttribute("data-open"));
    }
  });

  reader.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) close();
    const goto = e.target.closest("[data-goto]");
    if (goto) open(goto.getAttribute("data-goto"));
  });

  document.addEventListener("keydown", (e) => {
    if (reader.hidden) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    // Focus trap — includes the form controls the demos add.
    const list = Array.from(
      reader.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.disabled && el.offsetParent !== null);
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  function syncFromHash() {
    const m = location.hash.match(/^#case\/([\w-]+)$/);
    if (m && CASES[m[1]]) open(m[1], { pushHash: false });
    else if (active) close({ popHash: false });
  }
  window.addEventListener("popstate", syncFromHash);
  syncFromHash();
})();
