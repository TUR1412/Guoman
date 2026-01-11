# 诊断面板与性能预算（Diagnostics & Bundle Budget）

本项目坚持 **Local-first**：诊断能力也应当本地可用、默认不出网。

本篇文档覆盖两部分：

1. **诊断面板（UI + Console）**：如何生成健康快照、如何导出诊断包、如何定位常见问题
2. **性能预算（Bundle Budget）**：如何在 CI 中强制守住首屏体积阈值，避免“体验回归”

---

## 1) 诊断面板（UI）

### 入口

- 路由：`/diagnostics`
- 推荐入口：用户中心（`/profile`）→ 顶部 Actions → **诊断面板**

### 你能做什么

- **刷新快照**：即时重新抓取一次健康快照（不需要开启采样）
- **开始/停止监控**：启用/停止采样（LongTask / 内存 / 事件循环延迟），并每秒刷新一次 UI
- **复制 JSON / 下载 JSON**：生成“诊断包”并复制到剪贴板或下载成文件
- **下载 .json.gz**：在浏览器支持 gzip 时可下载压缩诊断包（体积更小，便于分享）
- **手动复制兜底**：当浏览器不允许写入剪贴板时，会打开“手动复制”窗口
- **导入诊断包**：支持从本地选择 `.json` / `.json.gz` 并解析显示摘要（用于对照排障）
- **拖拽导入**：支持将诊断包直接拖拽到导入区域（对照排障更顺手）
- **导入回放浏览**：导入成功后可直接浏览导入包中的 logs/errors（筛选/检索/展开/下载筛选结果），无需复制 JSON 手动检索
- **日志/错误浏览器**：支持关键词检索、日志级别筛选、展开查看详情（context/stack），并可下载筛选结果
- **清空错误**：清空本地错误记录（适合验证某个修复是否生效）

### 诊断包结构

UI 诊断页导出的 JSON 结构为：

- `schemaVersion`：诊断包 schema 版本（便于后续兼容升级）
- `generatedAt`：生成时间（ISO）
- `userAgent`：浏览器 UA（用于排查兼容性）
- `build`：构建元信息（版本号 / 提交 SHA / 构建时间；用于定位“线上到底跑的是哪一版”）
- `snapshot`：健康快照（见下文指标说明）
- `logs`：本地日志（local-first），用于还原关键行为线索
- `errors`：本地错误记录（脚本异常 / 未捕获 Promise 拒绝），用于快速定位问题来源

对应构建逻辑位于：`src/utils/diagnosticsBundle.js`。

> 说明：为避免文件过大，导出的 `logs`/`errors` 默认会做数量上限裁剪（可在 `buildDiagnosticsBundle({ maxLogs, maxErrors })` 中调整）。

### 导入说明（JSON / .json.gz）

诊断页支持从本地导入诊断包：

- 支持方式：拖拽导入 / 点击导入区域选择文件
- `.json`：直接解析
- `.json.gz`：在浏览器支持 `DecompressionStream('gzip')` 时自动解压后解析

> 注意：如果浏览器不支持 gzip 解压，可先在本地解压为 `.json` 再导入。

导入成功后，诊断页会显示导入包摘要，并提供“导入日志/错误浏览器”用于直接检索与定位线索。

### 日志/错误浏览器（Explorer）

诊断页提供“日志浏览器 / 错误浏览器”，用于更快定位线索：

- **关键词**：同时匹配 `message/source`，并在可用时匹配日志 `context` 或错误 `stack`
- **级别筛选**（日志）：按 `ERROR/WARN/INFO/DEBUG` 过滤
- **展开查看**：每条记录支持展开查看详情（context/stack）
- **下载筛选结果**：将当前筛选结果导出为 JSON 文件，便于分享与留档（local-first）

---

## 2) 诊断能力（Console API）

项目在启动时会安装控制台 API：

- `__GUOMAN_HEALTH__.print()`：输出“系统健康全景图”
- `__GUOMAN_HEALTH__.start()`：开始采样（LongTask / 内存 / 事件循环延迟）
- `__GUOMAN_HEALTH__.stop()`：停止采样
- `__GUOMAN_HEALTH__.snapshot()`：拿到当前快照对象（可自行保存/上报/比较）

对应实现位于：`src/utils/healthConsole.js`。

---

## 3) 常用指标解读（速查）

### 性能（Web Vitals）

来自：`src/utils/performance.js`（通过 `PerformanceObserver` 缓存到本地）

- **CLS**：布局偏移累计值（越低越好；常见目标：`<= 0.1`）
- **LCP**：最大内容绘制时间（越低越好；常见目标：`<= 2.5s`）
- **FID**：首次输入延迟（越低越好；常见目标：`<= 100ms`，更偏历史指标）
- **INP**：交互到下一次绘制（Interaction to Next Paint，越低越好；常见目标：`<= 200ms`）

> 注意：由于项目为 SPA，Vite 构建与缓存策略也会影响感知时间；请结合网络与硬件环境判断。

### 主线程压力

来自：`src/utils/healthConsole.js`

- **Long Task**：主线程长任务统计（多次、且 max 持续升高通常意味着渲染/计算尖刺）
- **事件循环延迟**：粗略反映 “任务队列堆积程度”（越高越卡；排障时关注 avg/max 的变化趋势）

### React Commit

项目在 `src/index.jsx` 中启用了 React `Profiler`：

- `Commit P95 / Max`：commit 耗时分位与最大值
- 排障建议：如果 P95 持续变大，优先检查：
  - 组件树是否出现“无意义重渲染”
  - 是否引入了高频 state 写入（如滚动/指针事件未节流）
  - 长列表是否按预期走虚拟滚动/窗口化渲染

---

## 4) 数据与隐私

诊断页导出的信息来自本地：

- `localStorage`（偏好/收藏/进度/诊断缓存）
- 本地日志与错误（不上传网络，仅用于排障；你可在 `/diagnostics` 中清空）
- 浏览器 Performance API（VItals / LongTask / memory）
- Service Worker 状态（是否接管）

默认不包含远程请求、也不会自动上传。

---

## 5) 性能预算（Bundle Budget）

### 为什么需要预算

体验回归最常见的方式不是功能坏了，而是：

- 首屏 JS 变大（加载更慢）
- vendor chunk 膨胀（缓存命中变差）
- 不小心把某个“开发期依赖”打进生产包

因此，本项目把“体积预算”作为质量闸门的一部分。

### 如何运行

`npm run check` 会在构建后自动执行预算检查。

也可以单独运行：

```bash
npm run build
npm run budget:bundle
```

### 预算如何工作

- 脚本：`scripts/bundle-budget.js`
- 配置：`scripts/bundle-budget.config.json`

预算脚本会读取 `dist/.vite/manifest.json`：

1. 找到入口（通常是 `index.html`）
2. 递归收集入口依赖链（入口 chunk + imports）
3. 汇总依赖链的 **JS gzip** 与 **CSS gzip**
4. 对关键 chunk 应用单文件阈值（例如 `vendor-react-*` / `vendor-motion-*`）

### 如何调整阈值

如果你引入了确实必要的能力导致体积上升：

1. 先用 `npm run build:report` 生成 `reports/bundle-report.html` 查看增量来源
2. 确认增量合理后，再更新 `scripts/bundle-budget.config.json` 的阈值

> 建议：阈值保持“稍有余量但不放纵”的原则，确保未来 PR 不会悄悄把首屏推到不可接受的水平。
