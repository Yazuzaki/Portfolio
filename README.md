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

## Interactive demos

Each software case study embeds a self-contained, dependency-free reimplementation of that
project's signature feature — the compatibility engine, the quick-add parser, the budget
engine. They run entirely in-page, fetch nothing, and build their DOM with `textContent`
only, so free-text input is never an injection surface.

## Engineering notes

- **Performance** — ~265 KB and 10 requests on first load; FCP under 250 ms locally, **CLS 0**.
  Zero JS dependencies, deferred scripts, self-hosted fonts (latin subset, preloaded), and
  every image lazy-loaded WebP with intrinsic `width`/`height`.
- **Accessibility** — WCAG AA verified by measurement, not assumption: every text/background
  pair on the page clears 4.5:1 (`--ink-3` is set to the contrast threshold, not to taste).
  Semantic landmarks, one `h1`, no skipped heading levels, skip link, a focus-trapped ARIA
  dialog that restores focus on close, and `prefers-reduced-motion` honoured throughout.
- **Degradation** — with JavaScript off, `.no-js` is never removed and the stylesheet shows
  all content in its final state; case study links still work as ordinary anchors.
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
    ├── main.js     # Reveals, masthead, scroll progress, rail, counters, form
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

Deployment is automatic: a push to `main` triggers the GitHub Pages workflow in
`.github/workflows/deploy-pages.yml` (it can also be run manually via `workflow_dispatch`).
Feature branches do not deploy.
