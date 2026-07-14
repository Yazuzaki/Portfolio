# Patrick Garcia — IT Officer Portfolio

Personal portfolio of **Patrick Garcia**, an IT Officer specializing in Microsoft 365 administration, Exchange Online, networking, domain management, and multi-site infrastructure support.

Built from scratch with no frameworks, no build step, and no dependencies — fast, accessible HTML, CSS, and vanilla JavaScript, deployed to GitHub Pages.

**Live site:** https://yazuzaki.github.io/Portfolio/

## Sections

- **Hero** — headline, professional summary, and verifiable scope stats (100+ users, 5 certifications, 5 ISP/telecom vendors)
- **Core capabilities** — Microsoft 365 & Cloud, Networking & Domains, Systems & Hardware, Web Development
- **Experience** — outcome-focused timeline: Esquire Tech Corp, APSoft, Alorica, SDCA internship
- **Case studies** — four real areas of ownership, each opening a deep-linkable dialog (`#case/m365`, `#case/domains`, `#case/pos`, `#case/vendors`) with context, approach, scope, and tools
- **Technical skills** — ATS-friendly grouped skill lists matching the resume
- **Credentials** — certifications (Cisco ×3, ITS HTML/CSS, TOEIC), education, and achievements
- **Contact** — email, GitHub, and a form that drafts an email

## Engineering notes

- **Performance** — zero JS dependencies, deferred scripts, self-hosted variable fonts (latin subset, preloaded), CSS-drawn card artwork instead of images, GPU-friendly transforms, IntersectionObserver-driven reveals
- **Accessibility** — semantic landmarks, skip link, ARIA dialog with focus trapping and Escape-to-close, visible focus states, `prefers-reduced-motion` respected everywhere
- **ATS-friendly** — all resume content is real text in semantic HTML with standard section names and exact keyword phrasing
- **Responsive** — fluid type/spacing via `clamp()`, adaptive grids, glass mobile menu, no horizontal overflow

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
└── js/
    ├── main.js     # Reveals, nav, tilt, counters, form, toast
    └── projects.js # Case-study data + accessible overlay with hash routing
```

## Updating content

- **Experience / skills / credentials** — edit the matching sections in `index.html`
- **Case studies** — cards live in `index.html` (`#work`); full stories live in `js/projects.js` (`PROJECTS` object)
- **Colors** — design tokens at the top of `css/style.css` (`--accent-1..3`, `--gradient`)

Deployment is automatic: any push to `main` (or the active feature branch) triggers the GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.
