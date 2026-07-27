/* ============================================================
   Interactive mini-demos for the build case studies.

   Each demo is a simplified, self-contained reimplementation of
   the signature feature of the real project — enough to actually
   play with, honest about being a scaled-down model. No
   dependencies, no network, no inline script (CSP-safe).

   Exposes window.PortfolioDemos.mount(root), called by
   projects.js after it renders a case study.
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- tiny DOM helpers (textContent only — never innerHTML) ---------- */
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function add(parent, ...kids) {
    kids.forEach((k) => k && parent.appendChild(k));
    return parent;
  }
  function select(id, labelText, items, selectedIdx) {
    const wrap = el("div", "demo__field");
    const label = el("label", null, labelText);
    label.setAttribute("for", id);
    const sel = el("select", "demo__select");
    sel.id = id;
    items.forEach((it, i) => {
      const o = el("option", null, it.name);
      o.value = it.id;
      if (i === (selectedIdx || 0)) o.selected = true;
      sel.appendChild(o);
    });
    add(wrap, label, sel);
    return { wrap, sel };
  }
  function byId(list, id) {
    return list.find((x) => x.id === id) || list[0];
  }
  function clamp(n, lo, hi) {
    return Math.min(hi, Math.max(lo, n));
  }
  const peso = (n) =>
    "₱" + Math.round(n).toLocaleString("en-PH");

  /* ============================================================
     1. CoreTech — build compatibility engine
     A pure analyze() over a handful of real-ish parts, mirroring
     how the actual engine runs identically on client and server.
     ============================================================ */
  const CPUS = [
    { id: "7800x3d", name: "Ryzen 7 7800X3D", socket: "AM5", mem: "DDR5", tdp: 120, tier: 92 },
    { id: "14600k", name: "Core i5-14600K", socket: "LGA1700", mem: "DDR5", tdp: 181, tier: 85 },
    { id: "5600", name: "Ryzen 5 5600", socket: "AM4", mem: "DDR4", tdp: 65, tier: 62 },
  ];
  const BOARDS = [
    { id: "b650", name: "B650 — AM5, ATX", socket: "AM5", mem: "DDR5", form: "ATX" },
    { id: "z790", name: "Z790 — LGA1700, ATX", socket: "LGA1700", mem: "DDR5", form: "ATX" },
    { id: "b550m", name: "B550M — AM4, mATX", socket: "AM4", mem: "DDR4", form: "mATX" },
  ];
  const GPUS = [
    { id: "4090", name: "RTX 4090 — 336 mm", tdp: 450, len: 336, tier: 100, fps: 148 },
    { id: "4070", name: "RTX 4070 — 244 mm", tdp: 200, len: 244, tier: 72, fps: 96 },
    { id: "7600", name: "RX 7600 — 204 mm", tdp: 165, len: 204, tier: 48, fps: 63 },
  ];
  const CASES = [
    { id: "mid", name: "Mid tower — 360 mm", maxGpu: 360, forms: ["ATX", "mATX"] },
    { id: "sff", name: "Compact mATX — 250 mm", maxGpu: 250, forms: ["mATX"] },
  ];
  const PSUS = [
    { id: "550", name: "550 W", w: 550 },
    { id: "750", name: "750 W", w: 750 },
    { id: "1000", name: "1000 W", w: 1000 },
  ];

  // Pure: no DOM, no state. The real engine works the same way.
  function analyzeBuild(cpu, board, gpu, kase, psu) {
    const needed = Math.ceil(((cpu.tdp + gpu.tdp + 90) * 1.3) / 50) * 50;
    const checks = [
      {
        ok: cpu.socket === board.socket,
        label: "CPU socket",
        detail: cpu.socket === board.socket
          ? cpu.socket + " matches the board"
          : cpu.socket + " CPU cannot seat in an " + board.socket + " board",
      },
      {
        ok: cpu.mem === board.mem,
        label: "Memory type",
        detail: cpu.mem === board.mem
          ? cpu.mem + " supported"
          : "CPU expects " + cpu.mem + ", board provides " + board.mem,
      },
      {
        ok: kase.forms.indexOf(board.form) !== -1,
        label: "Form factor",
        detail: kase.forms.indexOf(board.form) !== -1
          ? board.form + " board fits this case"
          : board.form + " board is too large for this case",
      },
      {
        ok: gpu.len <= kase.maxGpu,
        label: "GPU clearance",
        detail: gpu.len + " mm card vs " + kase.maxGpu + " mm of clearance" +
          (gpu.len <= kase.maxGpu ? " — " + (kase.maxGpu - gpu.len) + " mm to spare" : " — will not fit"),
      },
      {
        ok: psu.w >= needed,
        label: "Power supply",
        detail: psu.w >= needed
          ? psu.w + " W covers the " + needed + " W recommendation"
          : psu.w + " W is under the " + needed + " W recommended for this build",
      },
    ];

    const gap = gpu.tier - cpu.tier;
    let bottleneck;
    if (gap > 18) bottleneck = { pct: clamp(gap * 2.4, 0, 100), text: "The CPU holds this GPU back at lower resolutions." };
    else if (gap < -18) bottleneck = { pct: clamp(-gap * 2.4, 0, 100), text: "The GPU is the limit here — the CPU has headroom to spare." };
    else bottleneck = { pct: clamp(Math.abs(gap) * 2.4, 0, 100), text: "Well matched — neither part is meaningfully holding the other back." };

    const ratio = Math.min(cpu.tier / gpu.tier, 1);
    const fps = Math.round(gpu.fps * (0.62 + 0.38 * ratio));
    const blocking = checks.filter((c) => !c.ok).length;

    return { checks, needed, bottleneck, fps, blocking };
  }

  function buildCoretech(root) {
    const controls = el("div", "demo__controls");
    const cpu = select("d-cpu", "Processor", CPUS, 0);
    const board = select("d-board", "Motherboard", BOARDS, 0);
    const gpu = select("d-gpu", "Graphics card", GPUS, 0);
    const kase = select("d-case", "Case", CASES, 0);
    const psu = select("d-psu", "Power supply", PSUS, 2);
    add(controls, cpu.wrap, board.wrap, gpu.wrap, kase.wrap, psu.wrap);

    const verdict = el("p", "demo__verdict");
    verdict.setAttribute("role", "status");
    const list = el("ul", "demo__checks");
    const stats = el("div", "demo__stats");

    function update() {
      const r = analyzeBuild(
        byId(CPUS, cpu.sel.value),
        byId(BOARDS, board.sel.value),
        byId(GPUS, gpu.sel.value),
        byId(CASES, kase.sel.value),
        byId(PSUS, psu.sel.value)
      );

      verdict.className = "demo__verdict " + (r.blocking ? "is-bad" : "is-good");
      verdict.textContent = r.blocking
        ? r.blocking + (r.blocking === 1 ? " problem" : " problems") + " with this build"
        : "This build works";

      list.textContent = "";
      r.checks.forEach((c) => {
        const li = el("li", "demo__check " + (c.ok ? "is-ok" : "is-bad"));
        const mark = el("span", "demo__check-mark", c.ok ? "✓" : "✕");
        mark.setAttribute("aria-hidden", "true");
        const body = el("div", "demo__check-body");
        add(body, el("strong", null, c.label), el("span", null, c.detail));
        li.appendChild(mark);
        li.appendChild(body);
        // Status is carried by text, never by colour alone.
        li.setAttribute("aria-label", (c.ok ? "Pass: " : "Problem: ") + c.label + ". " + c.detail);
        list.appendChild(li);
      });

      stats.textContent = "";
      const psuStat = el("div", "demo__stat");
      add(psuStat, el("strong", null, r.needed + " W"), el("span", null, "recommended PSU, with headroom"));
      const fpsStat = el("div", "demo__stat");
      add(fpsStat, el("strong", null, "~" + r.fps + " fps"), el("span", null, "estimated at 1440p, high settings"));
      const bnStat = el("div", "demo__stat demo__stat--wide");
      const meter = el("div", "demo__meter");
      const fill = el("i");
      fill.style.width = r.bottleneck.pct + "%";
      meter.appendChild(fill);
      add(bnStat, el("strong", null, "Bottleneck"), meter, el("span", null, r.bottleneck.text));
      add(stats, psuStat, fpsStat, bnStat);
    }

    [cpu, board, gpu, kase, psu].forEach((f) => f.sel.addEventListener("change", update));
    add(root, controls, verdict, list, stats);
    update();
  }

  /* ============================================================
     2. Aurora Flow — quick-add parser
     The real app's keyboard-first entry: !p1–!p4 for priority,
     today/tomorrow for due date, #tag for tags.
     ============================================================ */
  const PRIORITY_LABEL = { 1: "Urgent", 2: "High", 3: "Normal", 4: "Low" };
  const XP_FOR = { 1: 30, 2: 20, 3: 15, 4: 10 };
  const LEVEL_TITLES = ["Getting started", "Finding rhythm", "In flow", "Dialled in", "Unstoppable"];

  function parseQuickAdd(raw) {
    let text = String(raw);
    let priority = 3;
    let due = null;
    const tags = [];

    text = text.replace(/!p([1-4])\b/gi, (_, d) => { priority = Number(d); return " "; });
    text = text.replace(/\b(today|tomorrow)\b/gi, (_, w) => { due = w.toLowerCase(); return " "; });
    text = text.replace(/#([\w-]+)/g, (_, t) => { tags.push(t); return " "; });

    return { title: text.replace(/\s+/g, " ").trim(), priority: priority, due: due, tags: tags };
  }

  function buildAurora(root) {
    let tasks = [
      { id: 1, title: "Rotate the SSL certificate", priority: 1, due: "today", tags: ["ops"], done: false },
      { id: 2, title: "Draft the monthly report", priority: 3, due: "tomorrow", tags: ["admin"], done: false },
    ];
    let nextId = 3;
    let xp = 45;

    const form = el("form", "demo__quickadd");
    const label = el("label", "demo__sr", "Quick add a task");
    label.setAttribute("for", "d-qa");
    const input = el("input", "demo__input");
    input.id = "d-qa";
    input.type = "text";
    input.placeholder = "Ship the release notes !p1 today #work";
    input.autocomplete = "off";
    const submit = el("button", "demo__btn", "Add");
    submit.type = "submit";
    add(form, label, input, submit);

    const hint = el("p", "demo__hint", "Try !p1–!p4 for priority, “today” or “tomorrow” for a due date, and #tag for tags.");
    const preview = el("div", "demo__preview");
    preview.setAttribute("aria-live", "polite");
    const list = el("ul", "demo__tasks");
    const levelWrap = el("div", "demo__level");

    function renderPreview() {
      preview.textContent = "";
      const v = input.value.trim();
      if (!v) {
        preview.classList.remove("is-active");
        return;
      }
      preview.classList.add("is-active");
      const p = parseQuickAdd(v);
      add(preview, el("span", "demo__preview-label", "Parsed as"));
      add(preview, el("span", "demo__tag demo__tag--p" + p.priority, PRIORITY_LABEL[p.priority]));
      if (p.due) add(preview, el("span", "demo__tag", p.due === "today" ? "Due today" : "Due tomorrow"));
      p.tags.forEach((t) => add(preview, el("span", "demo__tag", "#" + t)));
      add(preview, el("span", "demo__preview-title", p.title || "(no title yet)"));
    }

    function renderLevel() {
      const level = Math.floor(xp / 100) + 1;
      const into = xp % 100;
      levelWrap.textContent = "";
      const head = el("div", "demo__level-head");
      add(head,
        el("strong", null, "Level " + level + " · " + LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]),
        el("span", null, into + " / 100 XP")
      );
      const meter = el("div", "demo__meter");
      const fill = el("i");
      fill.style.width = into + "%";
      meter.appendChild(fill);
      add(levelWrap, head, meter);
    }

    function renderTasks() {
      list.textContent = "";
      if (!tasks.length) {
        list.appendChild(el("li", "demo__empty", "Nothing left — add one above."));
        return;
      }
      tasks.forEach((t) => {
        const li = el("li", "demo__task" + (t.done ? " is-done" : ""));
        const box = el("button", "demo__task-check");
        box.type = "button";
        box.setAttribute("aria-pressed", t.done ? "true" : "false");
        box.setAttribute("aria-label", (t.done ? "Mark incomplete: " : "Complete: ") + t.title);
        box.textContent = t.done ? "✓" : "";
        box.addEventListener("click", () => {
          t.done = !t.done;
          xp = Math.max(0, xp + (t.done ? XP_FOR[t.priority] : -XP_FOR[t.priority]));
          renderTasks();
          renderLevel();
        });

        const body = el("div", "demo__task-body");
        body.appendChild(el("span", "demo__task-title", t.title));
        const meta = el("div", "demo__task-meta");
        add(meta, el("span", "demo__tag demo__tag--p" + t.priority, PRIORITY_LABEL[t.priority]));
        if (t.due) add(meta, el("span", "demo__tag", t.due === "today" ? "Today" : "Tomorrow"));
        t.tags.forEach((tag) => add(meta, el("span", "demo__tag", "#" + tag)));
        body.appendChild(meta);

        add(li, box, body);
        list.appendChild(li);
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const p = parseQuickAdd(input.value);
      if (!p.title) return;
      tasks = tasks.concat([{ id: nextId++, title: p.title, priority: p.priority, due: p.due, tags: p.tags, done: false }]);
      input.value = "";
      renderPreview();
      renderTasks();
      input.focus();
    });
    input.addEventListener("input", renderPreview);

    add(root, form, hint, preview, list, levelWrap);
    renderTasks();
    renderLevel();
  }

  /* ============================================================
     3. Fintrack — budget tracking & health score
     Add spending, watch category budgets, alerts and the
     financial health score recompute.
     ============================================================ */
  const INCOME = 45000;
  const BASE_BUDGETS = [
    { id: "food", name: "Food & groceries", budget: 8000, spent: 5100 },
    { id: "transport", name: "Transport", budget: 3000, spent: 2450 },
    { id: "bills", name: "Bills & utilities", budget: 6000, spent: 5600 },
    { id: "fun", name: "Entertainment", budget: 2500, spent: 900 },
  ];

  function buildFintrack(root) {
    let cats = BASE_BUDGETS.map((c) => ({ ...c }));

    const form = el("form", "demo__expense");
    const amtWrap = el("div", "demo__field");
    const amtLabel = el("label", null, "Amount");
    amtLabel.setAttribute("for", "d-amt");
    const amt = el("input", "demo__input");
    amt.id = "d-amt";
    amt.type = "number";
    amt.min = "1";
    amt.step = "1";
    amt.value = "750";
    amt.inputMode = "numeric";
    add(amtWrap, amtLabel, amt);

    const cat = select("d-cat", "Category", cats, 0);
    const actions = el("div", "demo__field demo__field--action");
    const submit = el("button", "demo__btn", "Add expense");
    submit.type = "submit";
    const reset = el("button", "demo__btn demo__btn--ghost", "Reset");
    reset.type = "button";
    add(actions, submit, reset);
    add(form, amtWrap, cat.wrap, actions);

    const summary = el("div", "demo__stats");
    const alerts = el("ul", "demo__alerts");
    alerts.setAttribute("aria-live", "polite");
    const bars = el("ul", "demo__budgets");

    function render() {
      const spent = cats.reduce((s, c) => s + c.spent, 0);
      const savings = INCOME - spent;
      const savingsRate = savings / INCOME;
      const overCount = cats.filter((c) => c.spent > c.budget).length;
      const score = clamp(Math.round(savingsRate * 100 * 0.72 + (1 - overCount / cats.length) * 28), 0, 100);

      summary.textContent = "";
      const s1 = el("div", "demo__stat");
      add(s1, el("strong", null, peso(spent)), el("span", null, "spent of " + peso(INCOME) + " income"));
      const s2 = el("div", "demo__stat");
      add(s2, el("strong", null, Math.round(savingsRate * 100) + "%"), el("span", null, "savings rate this month"));
      const s3 = el("div", "demo__stat");
      add(s3, el("strong", null, score + " / 100"), el("span", null, "financial health score"));
      add(summary, s1, s2, s3);

      bars.textContent = "";
      cats.forEach((c) => {
        const pct = (c.spent / c.budget) * 100;
        const state = pct > 100 ? "is-over" : pct >= 80 ? "is-warn" : "is-ok";
        const li = el("li", "demo__budget " + state);
        const head = el("div", "demo__budget-head");
        add(head,
          el("strong", null, c.name),
          el("span", null, peso(c.spent) + " / " + peso(c.budget))
        );
        const meter = el("div", "demo__meter");
        const fill = el("i");
        fill.style.width = clamp(pct, 0, 100) + "%";
        meter.appendChild(fill);
        const foot = el("span", "demo__budget-foot",
          pct > 100
            ? "Over budget by " + peso(c.spent - c.budget)
            : peso(c.budget - c.spent) + " left · " + Math.round(pct) + "% used"
        );
        add(li, head, meter, foot);
        bars.appendChild(li);
      });

      alerts.textContent = "";
      cats.forEach((c) => {
        const pct = (c.spent / c.budget) * 100;
        if (pct > 100) alerts.appendChild(el("li", "demo__alert is-over", c.name + " is over budget by " + peso(c.spent - c.budget) + "."));
        else if (pct >= 80) alerts.appendChild(el("li", "demo__alert is-warn", c.name + " has passed its " + Math.round(pct) + "% warning threshold."));
      });
      if (!alerts.childNodes.length) {
        alerts.appendChild(el("li", "demo__alert is-ok", "Every category is comfortably within budget."));
      }
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = Number(amt.value);
      if (!isFinite(value) || value <= 0) return;
      const target = cats.find((c) => c.id === cat.sel.value);
      if (target) target.spent += value;
      render();
    });
    reset.addEventListener("click", () => {
      cats = BASE_BUDGETS.map((c) => ({ ...c }));
      render();
    });

    add(root, form, summary, alerts, bars);
    render();
  }

  /* ---------- registry + mount ---------- */
  const BUILDERS = { coretech: buildCoretech, aurora: buildAurora, fintrack: buildFintrack };

  window.PortfolioDemos = {
    has: function (slug) {
      return Object.prototype.hasOwnProperty.call(BUILDERS, slug);
    },
    mount: function (root) {
      if (!root) return;
      root.querySelectorAll("[data-demo]").forEach((node) => {
        const builder = BUILDERS[node.getAttribute("data-demo")];
        if (!builder || node.dataset.mounted === "1") return;
        node.textContent = "";
        node.dataset.mounted = "1";
        if (reduceMotion) node.classList.add("demo--still");
        builder(node);
      });
    },
  };
})();
