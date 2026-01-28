# storage｜本地存储与数据演进

本模块描述 Guoman World 的 **local-first 数据体系**：本地存储键、schema 注册表、迁移策略，以及用户中心的 Data Vault 导入/导出契约。

---

## 目标

- **可演进**：存储结构变更可通过明确的 schemaVersion + 迁移落地，不依赖“手动清缓存”。
- **可诊断**：导入/导出文件携带 build 与 storageSchema 元信息，问题可定位、可复现。
- **可扩展**：为未来的 IndexedDB / Worker 后端切换预留单一入口，避免全仓库散改。

---

## 关键文件（SSOT）

- 存储键：`src/utils/dataKeys.js`
  - 统一管理所有 `localStorage` key，避免散落与冲突。
- 存储读写入口（Port）：`src/utils/storagePort.js`
  - `readStorageRaw(key)`：读取 raw string（优先读 pending write，避免读写竞态）。
  - `writeStorageRaw(key, value)`：写入 raw string（走 `storageQueue`，同 tab 广播 + 批量写入）。
  - 这是未来切换 IndexedDB/Worker 的 **唯一收敛点**。
- schema 注册表：`src/utils/storageSchemaRegistry.js`
  - 维护 `guoman.schema.registry.v1`（`STORAGE_KEYS.schemaRegistry`）的 schema 基线与迁移记录。
- 迁移入口：`src/utils/storageMigrations.js`
  - 定义迁移 ID，并执行一次性迁移（幂等）。
- 启动接入点：`src/index.tsx`
  - 首帧渲染前执行 `runStorageMigrations()`，确保后续模块读到的是新 schema。
- Data Vault（导入/导出）：`src/utils/dataVault.js`
  - 用户中心导入/导出入口，文件 schemaVersion=2。

---

## 启动时序（重要）

1. `src/index.tsx` 在首帧渲染前调用 `runStorageMigrations()`
2. `storageMigrations` 会：
   - `ensureStorageSchemaBaseline()`：为所有已知 key 写入 schema 基线（并可记录迁移历史）
   - 执行具体迁移（例如：统一 `version` → `schemaVersion`）
3. 后续的 `followingStore / watchProgress / proMembership` 等模块再读取本地数据时，不需要额外兼容逻辑。

---

## Data Vault 契约（schemaVersion=2）

由 `src/utils/dataVault.js` 负责生成/解析。

### 导出（Export）

- `schemaVersion: 2`
- `kind: "guoman-data-vault"`
- `feature: "all" | <featureKey>`
- `exportedAt`: ISO 时间
- `build`: `getBuildInfo()`（版本/sha/builtAt）
- `storageSchema`: `ensureStorageSchemaBaseline()` 的快照
- `payload`: `{ [storageKey]: string | null }`
- `redactedKeys`: 默认脱敏的 key 列表（例如同步 Token）

### 导入（Import）

- 严格校验：顶层必须为对象，必须包含 `schemaVersion/feature/payload`
- feature 必须匹配当前导入目标，否则抛出可行动错误信息（例如：文件是 `feature=favorites`，你却选择导入 `all`）
- `feature=all` 的导入只会写入 **已知 keys**（`Object.values(STORAGE_KEYS)`），未知 key 会被跳过并在 UI 成功提示中展示数量。

---

## 如何新增一次迁移（推荐流程）

1. 在 `src/utils/storageMigrations.js` 增加新的迁移 ID（字符串不可变）
2. 在迁移逻辑中只做 **可验证且幂等** 的变换（允许重复运行）
3. 必须添加/更新单测：
   - `src/utils/storageMigrations.test.js`
   - 如涉及注册表行为：`src/utils/storageSchemaRegistry.test.js`
4. 验收门禁：
   - `npm run check`
   - `npm run e2e:ci`

---

## IndexedDB / Worker 预留策略

当前所有迁移与 schema 注册表读写均通过 `src/utils/storagePort.js` 完成：

- 未来若要切到 IndexedDB 或 Worker，只需要在 `storagePort` 内部替换实现（或增加一个后端选择策略），上层模块无需大规模改动。
