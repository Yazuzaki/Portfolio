# Patrick Garcia — IT Officer Portfolio

Personal portfolio of **Patrick Garcia**, an IT Officer specializing in Microsoft 365 administration, Exchange Online, networking, domain management, and multi-site infrastructure support.

Built from scratch with no frameworks, no build step, and no dependencies — fast, accessible HTML, CSS, and vanilla JavaScript, deployed to GitHub Pages.

**Live site:** https://yazuzaki.github.io/Portfolio/

## Sections

- **Hero** — headline, professional summary, and verifiable scope stats (100+ users, 5 certifications, 5 ISP/telecom vendors)
- **Core capabilities** — Microsoft 365 & Cloud, Networking & Domains, Systems & Hardware, Web Development
- **Experience** — outcome-focused timeline: Esquire Tech Corp, APSoft, Alorica, SDCA internship
- **Case studies** — four real areas of ownership, each opening a deep-linkable dialog (`#case/m365`, `#case/domains`, `#case/pos`, `#case/vendors`) with context, approach, scope, and tools
- **Builds** — three self-directed engineering projects, each opening a deep-linkable dialog (`#case/coretech`, `#case/aurora`, `#case/fintrack`) with the problem, the approach, a playable mini-demo, and a "What I learned" section
- **Technical skills** — ATS-friendly grouped skill lists matching the resume
- **Credentials** — certifications (Cisco ×3, ITS HTML/CSS, TOEIC), education, and achievements
- **Contact** — email, GitHub, and a form that drafts an email

## Engineering notes

- **Interactive demos** — each build case study embeds a self-contained, dependency-free mini-version of that project's signature feature (compatibility engine, quick-add parser, budget engine). They build their DOM with `textContent` only and run entirely in-page, so nothing is fetched and nothing is injected.
- **Performance** — zero JS dependencies, deferred scripts, self-hosted variable fonts (latin subset, preloaded), CSS-drawn artwork for the IT case-study cards, GPU-friendly transforms, IntersectionObserver-driven reveals. The build cards carry real app screenshots as lazy-loaded WebP with intrinsic `width`/`height` set (no layout shift) — ~105 KB for all three.
- **Accessibility** — semantic landmarks, skip link, ARIA dialog with focus trapping and Escape-to-close, visible focus states, `prefers-reduced-motion` respected everywhere
- **ATS-friendly** — all resume content is real text in semantic HTML with standard section names and exact keyword phrasing
- **Responsive** — fluid type/spacing via `clamp()`, adaptive grids, glass mobile menu, no horizontal overflow

## Security

The site ships a strict Content-Security-Policy and referrer policy via `<meta>` tags, keeps the
contact email out of the page source (runtime-decoded), and guards the form with a honeypot and
timing checks. To add HTTP-header-level protections (header CSP with `frame-ancestors`, HSTS,
`X-Content-Type-Options`, `Permissions-Policy`) via a custom domain on Cloudflare, see
[`docs/security-headers.md`](docs/security-headers.md).

## Run locally

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Structure

```
├── index.html      # All sections
├── css/
│   ├── fonts.css   # Self-hosted Inter + Sora (variable, latin subset)
│   └── style.css   # Design tokens + full design system
├── fonts/          # woff2 files
├── img/            # WebP screenshots of the live build projects
└── js/
    ├── main.js     # Reveals, nav, tilt, counters, form, toast
    ├── demos.js    # Interactive mini-demos for the build case studies
    └── projects.js # Case-study data + accessible overlay with hash routing
```

## Updating content

- **Experience / skills / credentials** — edit the matching sections in `index.html`
- **Case studies** — cards live in `index.html` (`#work`); full stories live in `js/projects.js` (`PROJECTS` object)
- **Builds** — cards live in `index.html` (`#builds`); write-ups live in the same `PROJECTS` object with `kind: "build"`, and their playable demos live in `js/demos.js` (one builder per slug, registered in `BUILDERS`)
- **Build card screenshots** — `img/*-card.webp` are captures of each project running locally. To refresh one: start that project, screenshot it at 1440x900 with a dark colour scheme, then crop to the card ratio (21/9 for the wide card, 16/10 for the rest) and export as WebP at quality ~82. Bump the `?v=` on the `<img>` so caches pick it up.
- **Colors** — design tokens at the top of `css/style.css` (`--accent-1..3`, `--gradient`)

Deployment is automatic: any push to `main` (or the active feature branch) triggers the GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.
