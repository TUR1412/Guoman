# 技术设计: 诊断包构建元信息（Build Info）

## 技术方案

### 核心技术

- Vite `define`：在构建时将常量内联到前端代码（避免运行时读取文件）
- `src/utils/buildInfo.js`：提供统一的 build info 读取接口，并做短 SHA 计算

### 实现要点

- `vite.config.js`
  - 注入 `__APP_VERSION__`：来自 `package.json.version`
  - 注入 `__BUILD_SHA__`：优先读取 `GITHUB_SHA`（GitHub Actions 默认注入），无则为 `null`
  - 注入 `__BUILD_TIME__`：仅在 build 时写入 ISO 时间串，无则为 `null`
- `eslint.config.js`
  - 将 `__APP_VERSION__ / __BUILD_SHA__ / __BUILD_TIME__` 声明为只读全局常量，避免 no-undef 误报
- `src/utils/buildInfo.js`
  - 统一返回 `{ version, sha, shortSha, builtAt }`
  - 在常量缺失时安全 fallback 为 `null`（避免运行时报错）
- `src/utils/diagnosticsBundle.js`
  - 增加 `build: getBuildInfo()` 字段
- `src/pages/DiagnosticsPage.jsx`
  - “系统”卡片展示版本、build shortSha 与构建时间

## 安全与性能

- **安全:** build info 不包含用户隐私，只包含版本与构建信息；诊断包仍保持“默认不出网”原则。
- **性能:** `define` 常量为编译期内联，不引入额外运行时 IO；诊断包只是增加一个小对象字段。

## 测试与部署

- 单测：`diagnosticsBundle.test.js` mock `buildInfo`，确保 bundle 结构稳定
- CI：无需额外环境变量配置；GitHub Actions 默认提供 `GITHUB_SHA`
