# [GUOMAN-WORLD1-20251218-R1] 任务看板

> **环境**: Windows 11 + pwsh (-NoLogo -NoProfile wrapper) | **框架**: React + Vite | **档位**: 4档 (架构重构)
> **已激活矩阵**: [模块 A: 视觉矫正] + [模块 B: 逻辑直通] + [模块 E: 幽灵防御] + [模块 F: 需求镜像/靶向验证]

## 1. 需求镜像 (Requirement Mirroring)

> **我的理解**: 对 `TUR1412/Guoman` 做“原子级审计 → 修复 → 升级扩展”，目标是更稳健（安全/无障碍/兼容性/性能）与更工程化（Lint/Test/CI/协作模板），并保持 GitHub Pages 可部署。完成后 **推送到** `origin/master`，随后 **安全删除本地克隆目录**（以你的本机实际路径为准，例如：`C:\Users\Kong\Downloads\Guoman`）。
> **不做什么**: 不后台启动长期驻留服务（dev server）；不抢占端口；不在主 UI 裸露 JSON/错误堆栈；不提交敏感信息；不引入必须依赖后端的功能（保持静态站可独立运行）。

## 2. 审计发现 (Atomic Findings)

- [!] **安全**：`npm audit`（使用 `https://registry.npmjs.org`）提示 `vite/esbuild` 存在 _moderate_ 风险（影响 dev server），需要升级到 `vite >= 6.1.7`。
- [!] **稳健**：多处对 `localStorage/sessionStorage` 的访问仅用了 `?.`，但未 `try/catch`（在隐私模式/禁用存储/安全策略下可能抛错并导致白屏）。
- [!] **体验**：`SearchPage` 输入框的内部 state 不会随 URL `q` 变化而同步（回退/前进时表现不一致）。
- [!] **无障碍/规范**：少量 `button` 缺少 `type="button"`；部分列表渲染使用 `index` 作为 key。
- [!] **工程化**：缺少 ESLint/Prettier/测试基线；CI 仅 build 部署，缺少 lint/test 闸门。
- [!] **协作与可持续性**：缺少 Issue/PR 模板与安全政策（反馈与披露流程不清晰）。
- [!] **数据可迁移**：收藏为本地存储，但缺少“导出/导入”能力（换设备/重装易丢）。
- [!] **效率体验**：缺少全局快捷键（例如 Ctrl/⌘+K 聚焦搜索）。

## 3. 执行清单 (Execution)

- [x] 升级 Vite 到 v6（保持 Node 18 兼容）并消除 audit 风险
- [x] 新增 `storage` 工具层并替换调用点（theme/tab/sort/intro 等）
- [x] a11y/稳定性修复（button type、稳定 key、URL 状态同步）
- [x] 新增 ESLint + Prettier + Vitest（最小可用基线）
- [x] 更新 GitHub Actions：增加 lint/test，再 build & deploy
- [x] 有限热同步验证：`npm ci` → `npm run lint` → `npm run test` → `npm run build`
- [x] 轮询迭代（10 次原子级提交）：见 `docs/ITERATIONS.md`
- [x] 收藏备份：收藏页新增导出/导入（合并/覆盖）+ 解析与测试基线
- [x] 快捷键：Ctrl/⌘+K 聚焦搜索（桌面/移动外接键盘）
- [x] 协作模板：新增 Issue/PR 模板、`SECURITY.md`、`CODE_OF_CONDUCT.md`
