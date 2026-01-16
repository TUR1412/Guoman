<div align="center">
  <img src="docs/hero.svg" alt="Guoman World" width="100%" />
  <h1>Guoman World</h1>
  <p>
    A Vercel/Apple-grade Guoman discovery hub · Frontend-only · Local-first · Detail-obsessed
  </p>
  <p>
    <a href="README.md">简体中文</a>
    ·
    <strong>English</strong>
  </p>
  <p>
    <a href="https://tur1412.github.io/Guoman/">Live Demo</a>
    ·
    <a href="#-highlights">Highlights</a>
    ·
    <a href="#-feature-matrix">Feature Matrix</a>
    ·
    <a href="#-quick-start">Quick Start</a>
    ·
    <a href="#-deployment">Deployment</a>
  </p>
  <p>
    <img alt="GitHub License" src="https://img.shields.io/github/license/TUR1412/Guoman?style=flat-square" />
    <img alt="Version" src="https://img.shields.io/github/package-json/v/TUR1412/Guoman?style=flat-square" />
    <img alt="Build" src="https://img.shields.io/github/actions/workflow/status/TUR1412/Guoman/static.yml?branch=master&style=flat-square" />
    <img alt="Quality" src="https://img.shields.io/github/actions/workflow/status/TUR1412/Guoman/quality.yml?branch=master&style=flat-square" />
    <img alt="Lighthouse" src="https://img.shields.io/github/actions/workflow/status/TUR1412/Guoman/lighthouse.yml?branch=master&style=flat-square" />
    <img alt="Last Commit" src="https://img.shields.io/github/last-commit/TUR1412/Guoman?style=flat-square" />
    <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square" />
    <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000&style=flat-square" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=fff&style=flat-square" />
    <img alt="Vitest" src="https://img.shields.io/badge/Vitest-tested-6E9F18?style=flat-square" />
    <img alt="ESLint" src="https://img.shields.io/badge/ESLint-enabled-4B32C3?style=flat-square" />
  </p>
</div>

---

## ✨ Highlights

- **Vercel/Apple-style design language**: neutral surfaces, spectral mesh, glass layers, precision typography, and physics-based micro-interactions (hover-safe guardrails + pointer glow + button sheen overlay + stable scrollbar gutter + thumb states).
- **Content insights**: Tag Pulse, Studio Radar, Audience Pulse summaries.
- **Watch Planner**: turns progress + following status into daily viewing budgets and ETA.
- **Match score + reasons**: recommendations are explainable and transparent.
- **Command Palette upgrades**: jump to titles / `#tags` / categories / pages; search stays as a fallback item, and highlighted targets are idle-prefetched for snappier navigation.
- **Local-first**: favorites, progress, taste profile, and visual settings are persisted in `localStorage`.
- **Discovery loop upgrades**: Saved Views (search presets), Compare Mode (side-by-side), Pinned Tags (home shortcuts), and SparkBar mini year distribution insights.
- **PWA & diagnostics**: offline caching + update prompt + `/diagnostics` local health snapshot.
- **Observability**: local logs + local analytics events + diagnostics replay (logs/errors/events), with INP tracked for interaction debugging.
- **Crash recovery**: ErrorBoundary provides one-click copy/download diagnostics bundles (logs + errors + health snapshot), with manual-copy fallback and optional `.json.gz` export.
- **Diagnostics replay**: import `.json` / `.json.gz` bundles via drag-and-drop (or click the import zone) to inspect summaries locally, browse imported logs/errors/events with query/level/name filters, use local/imported aggregated timeline (breadcrumbs) views, and drill down from timeline entries to the corresponding explorers (no upload).
- **Resilient lazy loading**: automatic retry for dynamic-import failures (flaky networks, stale caches, or chunk mismatch).

---

## 🎬 Demo

> Demo GIF / screenshots placeholders (PRs welcome).

- Search Pro: advanced filters + Saved Views (search presets)
- Compare Mode: side-by-side comparison (rating/popularity/year/tags)
- Pinned Tags: pin/unpin tags, home shortcuts
- Mini Insights: Tag page year distribution SparkBar (lightweight SVG)

<details>
<summary>📷 Screenshot placeholders</summary>

- Home / Pinned Tags
- Search / Saved Views
- Compare / Side-by-side
- Tag / Year Distribution

</details>

---

## ✅ Feature Matrix

| Module                | Capabilities                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Explore & Recommend   | Taste profile, local recommendations, match explanations, tag momentum, Saved Views, Compare Mode |
| Follow & Plan         | Following reminders, watch progress, Watch Planner, remaining-time estimation                     |
| Insights & Analytics  | Studio Radar, Audience Pulse, viewing history, achievements                                       |
| Visual Experience     | Vercel/Apple themes, glassmorphism, micro-interactions, motion guardrails                         |
| Data Management       | Favorites/groups/import/export/Data Vault, Saved Views/Compare/Pinned Tags, local usage metrics   |
| Quality & Reliability | PWA, diagnostics, bundle budget gate, error boundaries                                            |

---

## ⌨️ Command Palette Tips

- Open: **Ctrl/⌘ + K**
- Type an anime title to jump to details (e.g. `斗罗大陆`)
- Type `#tag` to jump to a Tag page (e.g. `#玄幻`)
- Type `category` / `分类` / `action` etc. to jump to Category pages
- Search action is always available as the last item when a query is present

---

## 🧩 Tech Stack

| Area   | Tech                                                         |
| ------ | ------------------------------------------------------------ |
| UI     | React 18 + styled-components + Design Tokens (CSS Variables) |
| Router | React Router (Hash Router)                                   |
| Motion | Framer Motion                                                |
| Build  | Vite 6                                                       |
| Tests  | Vitest + Testing Library                                     |
| PWA    | Web App Manifest + Service Worker                            |
| Deploy | GitHub Actions → GitHub Pages                                |

---

## 🚀 Quick Start

> Node.js v18+ recommended (aligned with GitHub Actions).

```bash
npm ci
npm run dev
```

Common scripts:

- `npm run check`: format/lint/test/build/budget in one shot
- `npm run test:watch`: local TDD (Vitest watch)
- `npm run storybook`: UI component playground

---

## ✅ Quality Gates

```bash
npm run check
```

Runs: Prettier → ESLint → Vitest → Build → Bundle Budget.

---

## 🚢 Deployment

- `vite.config.js` auto-resolves the Vite `base` for Pages (prefers `VITE_BASE/BASE_PATH/PUBLIC_URL`, falls back to `GITHUB_REPOSITORY` / `package.json.homepage`).
- Routing uses **Hash Router** with a `404.html` deep-link fallback (no refresh 404s on Pages).
- GitHub Actions builds and publishes `dist/` on every push to the default branch.
- Enable Pages: `Settings → Pages → GitHub Actions`

---

## 📚 Docs

- `docs/ARCHITECTURE.md` — architecture notes and decisions
- `docs/DESIGN_TOKENS.md` — design tokens and UI conventions
- `docs/DIAGNOSTICS.md` — diagnostics & performance budget
- `docs/LIGHTHOUSE_BASELINE.md` — Lighthouse baseline instructions
- `docs/QUARK_AUDIT.md` — quark-level audit and improvement backlog
- `docs/ITERATIONS.md` — atomic iteration records

---

## 🤝 Contributing & Security

- Contributing guide: `CONTRIBUTING.md`
- Code of conduct: `CODE_OF_CONDUCT.md`
- Security policy: `SECURITY.md`

---

## 📄 License

MIT
