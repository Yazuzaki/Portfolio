# Patrick Garcia — Portfolio

A premium, motion-driven portfolio website built entirely from scratch — no frameworks, no build step, no dependencies. Just fast, accessible HTML, CSS, and vanilla JavaScript.

## ✨ Highlights

- **Project-first design** — featured work leads the page with large gradient artwork, interactive cards, and full case-study overlays (challenge → solution → measurable results).
- **Modern aesthetic** — dark premium theme, glassmorphism, gradient accents, bold display typography (Sora + Inter).
- **Motion design** — scroll-triggered reveals with stagger, 3D card tilt, magnetic buttons, cursor glow, animated counters, marquee, ambient gradient blobs, and smooth dialog transitions. Every animation respects `prefers-reduced-motion`.
- **Case studies** — deep-linkable (`#case/lumina`), keyboard accessible dialogs with focus trapping, Escape-to-close, and prev/next navigation.
- **Fully responsive** — fluid type and spacing via `clamp()`, adaptive grid layouts, and a glass mobile menu.
- **Accessible** — semantic landmarks, skip link, ARIA on all interactive patterns, visible focus states, WCAG-conscious contrast.
- **Fast** — zero JS dependencies, deferred scripts, CSS-only marquee/blobs, GPU-friendly transforms, `IntersectionObserver` instead of scroll handlers. Total payload is a few dozen KB plus two fonts.

## 🗂 Structure

```
├── index.html      # All sections: hero, work, about, skills, experience, testimonials, contact
├── css/style.css   # Design tokens + full design system
└── js/
    ├── main.js     # Reveals, nav, tilt, counters, slider, form, toast
    └── projects.js # Case study data + accessible overlay with hash routing
```

## 🚀 Run locally

Any static server works:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## ✏️ Make it yours

All project, testimonial, and experience content is **placeholder** — realistic but fictional, shaped for easy replacement:

1. **Projects** — edit the cards in `index.html` (section `#work`) and the matching entries in `js/projects.js` (`PROJECTS` object). Card art is pure CSS; change the per-project gradients via the `[data-art="…"]` variables in `css/style.css`.
2. **Name / branding** — search-and-replace "Patrick Garcia", update the monogram, and swap the contact email + social links in the `#contact` section.
3. **Colors** — everything derives from the design tokens at the top of `css/style.css` (`--accent-1..4`, `--gradient`).
