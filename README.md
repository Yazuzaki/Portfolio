# Patrick Garcia — Portfolio

Personal portfolio of **Patrick Garcia** — IT Officer running Microsoft 365, networking and
domain infrastructure for 100+ users across multiple sites, and a full-stack developer
shipping production-architecture web and mobile applications.

Built from scratch: no frameworks, no build step, no dependencies. Semantic HTML, a
hand-written CSS design system, and vanilla JavaScript, deployed to GitHub Pages.

**Live site:** https://yazuzaki.github.io/Portfolio/

## Design language

The page is set up as an engineering document rather than a landing page. Three principles
hold it together:

- **Three typefaces, three jobs.** Instrument Serif carries statements and never body copy;
  Inter carries anything read in quantity; JetBrains Mono carries instrumentation — labels,
  indices, dates and figures. A face never crosses into another's role.
- **One accent, earned.** Amber (`--accent`) marks something interactive or genuinely
  primary, nothing decorative. A separate signal green appears only for operational status
  and is used three times on the whole page.
- **Hairlines over boxes.** Structure comes from rules and grid position. Cards are the
  exception, not the default, so the few real cards actually read as objects.

Every section positions against the same 12-column field but takes a **different span and
composition** — an index, a ledger, alternating case rows, a register, a matrix. The
variation is the point; a uniform stack is what makes a page look generated.

## Sections

| Section | Treatment |
|---|---|
| **Opening** | Asymmetric split: an editorial statement against a mono scope readout that gives the stats a job |
| **Disciplines** | A four-row index with hover-revealed detail — no cards, no icons |
| **Selected work** | Three software case studies in alternating full-width compositions, each opening a full-screen reader |
| **Field notes** | IT ownership as a dense register — deliberately lighter weight than shipped product |
| **Trajectory** | A ledger with a sticky year rail that tracks the entry in view |
| **Toolkit** | A grouped matrix with honest annotations where depth is introductory |
| **Credentials** | Certifications as a numbered list; education and recognition as an editorial aside |
| **Contact** | Full-bleed statement, oversized email link with copy-to-clipboard, and a form |

## Case study reader

`#case/<slug>` opens a full-screen reader, deep-linkable and back-button aware. Two content
shapes share it, driven by `kind` in `js/projects.js`:

- `kind: "build"` — hero image, spec table, overview, the hard part, how it was built,
  a screenshot gallery, a **playable demo**, a numbered lessons list, results and stack.
- `kind: "field"` — scope and approach only. No demo, no figures, no invented metrics.

Prev/next navigation stays inside its own group, so the two kinds never bleed together.

## Motion

Motion is treated as part of the design system, not decoration. `js/motion.js`
runs **one** rAF loop for everything scroll-linked — parallax, velocity skew,
progress, masthead state — and pointer effects write CSS custom properties
through CSSOM (inline `style` attributes are blocked by the CSP).

| Layer | What it does |
|---|---|
| **Entrance** | A counter and curtain, once per session (`sessionStorage`), then the hero rides in line by line. `motion.js` fires `pg:ready`; `main.js` holds its reveal observer until then so nothing animates behind the curtain. |
| **Reveals** | Nine variants — `rise`, `fall`, `left`, `right`, `scale`, `blur`, `rotate`, `iris`, `curtain` — chosen per section via `data-fx`, plus word-mask splits on headings via `data-split`. No two sections enter the same way. |
| **Pointer** | A trailing cursor ring that grows and takes a label from `data-cursor`, magnetic links, card tilt with cursor-tracked lighting, spotlight surfaces, and a hero whose grid and orbit drift against the mouse. |
| **Ambient** | Two slow aurora masses, a grain plate, and a canvas tint that shifts as each `data-tone` section takes over. |

Two constraints shaped the implementation:

- **No `filter: blur()` on animated elements.** The aurora originally used a 90 px
  blur and measured **11.8 fps** during scroll. A multi-stop radial gradient looks
  the same and composites for free — it is 60 fps with zero dropped frames.
- **A reveal that never fires leaves content invisible**, which is far worse than a
  missed animation. IntersectionObserver samples at frame boundaries, so a fast
  flick or an End keypress can skip an element — and an element clipped to zero
  width reports `intersectionRatio: 0` and never crosses a threshold at all.
  Containers are observed rather than clipped children, and a scroll sweep reveals
  anything already passed.

## Interactive demos

Each software case study embeds a self-contained, dependency-free reimplementation of that
project's signature feature — the compatibility engine, the quick-add parser, the budget
engine. They run entirely in-page, fetch nothing, and build their DOM with `textContent`
only, so free-text input is never an injection surface.

## Engineering notes

- **Performance** — ~300 KB and 11 requests on first load; FCP ~230 ms locally, **CLS 0**,
  and a **locked 60 fps** through a full-page scroll (median and p95 frame both 16.7 ms,
  zero frames over 20 ms). Zero JS dependencies, deferred scripts, self-hosted fonts
  (latin subset, preloaded), every image lazy-loaded WebP with intrinsic dimensions.
- **Accessibility** — WCAG AA verified by measurement, not assumption: every text/background
  pair on the page clears 4.5:1 (`--ink-3` is set to the contrast threshold, not to taste).
  Semantic landmarks, one `h1`, no skipped heading levels, skip link, a focus-trapped ARIA
  dialog that restores focus on close, and `prefers-reduced-motion` honoured throughout.
- **Degradation** — with JavaScript off, `.no-js` is never removed, so the stylesheet
  neutralises every motion start-state and drops the entrance overlay (which would
  otherwise cover the site permanently). Case study links still work as plain anchors.
  Under `prefers-reduced-motion` the whole motion layer collapses: no entrance, no
  cursor, no ambient, no transforms — the static composition, fully readable.
- **CSP-clean** — a strict `Content-Security-Policy` with no `unsafe-inline`. There are no
  inline `style` attributes anywhere; animation stagger is carried by `data-i` attributes
  that CSS maps to a custom property.
- **ATS-friendly** — all resume content is real text in semantic HTML with standard section
  names and exact keyword phrasing.
- **Responsive** — fluid type and spacing via `clamp()`, layouts that recompose rather than
  merely stack, a full-screen serif mobile menu, and no horizontal overflow at any width.

## Security

The site ships a strict Content-Security-Policy and referrer policy via `<meta>` tags, keeps
the contact email out of the page source (assembled at runtime), and guards the form with a
honeypot and a dwell-time check. To add HTTP-header-level protections (header CSP with
`frame-ancestors`, HSTS, `X-Content-Type-Options`, `Permissions-Policy`) via a custom domain
on Cloudflare, see [`docs/security-headers.md`](docs/security-headers.md).

## Run locally

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Structure

```
├── index.html      # Every section
├── css/
│   ├── fonts.css   # Instrument Serif, Inter, JetBrains Mono (latin subset)
│   └── style.css   # Tokens → primitives → components → sections → responsive
├── fonts/          # woff2 files
├── img/            # WebP screenshots of the three projects running locally
└── js/
    ├── motion.js   # Entrance, cursor, magnetism, tilt, parallax, one scroll loop
    ├── main.js     # Reveal observer + sweep, section spy, menu, counters, form
    ├── demos.js    # Playable mini-demos, one builder per project slug
    └── projects.js # Case study content + the full-screen reader
```

## Updating content

- **Experience, toolkit, credentials** — edit the matching section in `index.html`.
- **Case studies** — all copy lives in the `CASES` object in `js/projects.js`. Add
  `kind: "build"` for software (unlocks figures, results and demo) or `kind: "field"` for
  IT ownership. Register the slug in `GROUPS` so prev/next picks it up.
- **Demos** — one builder function per slug in `js/demos.js`, registered in `BUILDERS`.
  A case study only renders a "Try it" section if a builder exists for its slug.
- **Screenshots** — `img/<slug>-hero.webp` (1760×1100) and `img/<slug>-1..3.webp`
  (1000×625) are captures of each project running locally, taken at 1440×900 with a dark
  colour scheme. Re-crop to the same ratios, export WebP at quality ~80, and bump the `?v=`
  so caches pick the change up.
- **Colour and type** — the token block at the top of `css/style.css`. Changing `--accent`
  re-skins every interactive state on the page; check contrast if you move `--ink-3`.
- **Motion** — swap a section's entrance by changing its `data-fx` value; add
  `data-cursor="…"` for a cursor label, `data-magnetic`, `data-tilt`, `data-glow`,
  `data-parallax` or `data-ripple` to opt an element into a pointer effect. Anything
  new must stay on transform/opacity — re-run the frame-rate check before shipping it.

Deployment is automatic: a push to `main` triggers the GitHub Pages workflow in
`.github/workflows/deploy-pages.yml` (it can also be run manually via `workflow_dispatch`).
Feature branches do not deploy.
