# 架构设计

## 总体架构

```mermaid
flowchart TD
  User[用户] --> Browser[浏览器]
  Browser --> App[React SPA]

  App --> Router["React Router (Hash)"]
  App --> UI["UI Components (styled-components)"]
  App --> Design["Design System (global.css tokens + Grid/Glass)"]
  App --> Motion["Motion (Framer Motion)"]

  App --> Data["Local-first Data Layer"]
  Data --> LS[(localStorage)]
  Data --> Queue["storageQueue: 合并写入/空闲刷新"]
  Data --> Vault["Data Vault (Import/Export)"]
  Data --> SavedViews["Saved Views (Search Presets)"]
  Data --> Compare["Compare Mode (max 2)"]
  Data --> Pins["Pinned Tags (Home Shortcuts)"]

  App --> Search["Search Intelligence (Filter Engine + Prefetch)"]
  App --> Api["API Client (Retry + Cache + Dedupe)"]
  App --> Insights["Content Insights (Tag Pulse / Studio Radar / Audience Pulse)"]
  App --> Planner["Watch Planner"]

  App --> Visual["Visual Settings (visualSettings.js)"]
  Visual --> LS
  Visual --> Root["documentElement: CSS vars + dataset"]

  App --> Diagnostics["Diagnostics UI (/diagnostics)"]
  Diagnostics --> Data
  Insights --> Data
  Planner --> Data

  App --> PWA[Service Worker]
  PWA --> Cache[(Cache Storage)]

  subgraph Build[构建与部署]
    Actions[GitHub Actions] --> Vite[Vite Build]
    Vite --> Dist[dist/]
    Dist --> Budget["Bundle Budget Gate\n(scripts/bundle-budget.js)"]
    Budget --> Pages[GitHub Pages]
  end
```

---

## 核心流程：Service Worker 更新提示

```mermaid
sequenceDiagram
  participant UI as UI (NetworkStatusBanner)
  participant App as App (index.jsx)
  participant SWR as ServiceWorker Registration
  participant SW as Service Worker

  App->>SWR: register(sw.js)
  SWR-->>SW: updatefound + installing
  SW-->>SWR: state=installed (waiting)
  SWR-->>UI: dispatchEvent guoman:sw:update
  UI->>SWR: postMessage SKIP_WAITING
  SW-->>SW: skipWaiting + activate + clients.claim
  SW-->>App: controllerchange
  App-->>App: reload
```

---

## 离线兜底：Offline Fallback

- `public/offline.html`：离线提示页（避免“白屏/无提示”的离线体验）
- `public/sw.js`：导航请求网络失败时，优先回退到缓存的 `index.html`，再回退到 `offline.html`

---

## 重大架构决策

完整 ADR 记录在变更方案包的 `how.md` 中；本章节仅作为概览索引（当前暂无独立 ADR 索引表）。
