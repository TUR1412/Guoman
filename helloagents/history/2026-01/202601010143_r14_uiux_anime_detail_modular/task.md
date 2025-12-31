# 任务清单: R14 UI/UX - AnimeDetail 模块化与表单输入一致性

目录: `helloagents/plan/202601010143_r14_uiux_anime_detail_modular/`

---

## 1. AnimeDetail 模块化拆分

- [√] 1.1 新增 `src/components/anime/detail/` 子模块并迁移「渲染分区」，保持 `src/components/AnimeDetail.jsx` 对外导出不变，验证 why.md#需求-作品详情页稳定展示-场景-用户打开作品详情页并浏览信息
- [√] 1.2 抽取可复用常量/小组件（如评分渲染、tags/related 列表块），减少主文件噪声并保持行为一致

## 2. 输入一致性增强（TextField 落地）

- [√] 2.1 将观看进度的“当前集数”输入迁移到 `TextField`（保留 min/max/number 行为），验证 why.md#需求-观看进度记录稳定-场景-用户调整集数-拖动进度条并快速设置“看到一半-追到最新-清空”
- [√] 2.2 将评论昵称输入迁移到 `TextField`，验证 why.md#需求-评论发布与本地清理可用-场景-用户填写昵称-可选-与评论内容并提交-清空本地评论

## 3. 安全检查

- [√] 3.1 执行安全检查（输入边界、XSS/URL 参数处理、无明文密钥、无高风险命令落地）

## 4. 文档更新（知识库同步）

- [√] 4.1 更新 `helloagents/wiki/overview.md`：补充 AnimeDetail 模块化目录说明与表单 primitives 使用约定
- [√] 4.2 更新 `helloagents/CHANGELOG.md`：记录本轮重构/一致性变更

## 5. 测试与门禁

- [√] 5.1 运行 `npm run check`，确保通过
- [√] 5.2 运行 `npm audit --registry="https://registry.npmjs.org/"`，确保 0 vulnerabilities
