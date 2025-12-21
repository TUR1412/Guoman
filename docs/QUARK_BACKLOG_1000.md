# 夸克级 1000 微任务清单

> 说明：本清单用于规划 1000 条可独立拆分的原子级优化项，涵盖视觉、交互、可访问性、性能与业务扩展。
> 规则：每条任务可单独实施/回滚，方便分批落地与版本演进。

## A. 视觉系统（200）

1.  [视觉] 全局背景：补齐暗/亮主题 tokens
2.  [视觉] 主题色板：补齐暗/亮主题 tokens
3.  [视觉] 文字层级：补齐暗/亮主题 tokens
4.  [视觉] 按钮体系：补齐暗/亮主题 tokens
5.  [视觉] 卡片层级：补齐暗/亮主题 tokens
6.  [视觉] 阴影与高光：补齐暗/亮主题 tokens
7.  [视觉] 边框/分割线：补齐暗/亮主题 tokens
8.  [视觉] 图标/徽章：补齐暗/亮主题 tokens
9.  [视觉] 表单控件：补齐暗/亮主题 tokens
10. [视觉] 滚动条：补齐暗/亮主题 tokens
11. [视觉] 空状态容器：补齐暗/亮主题 tokens
12. [视觉] 导航栏：补齐暗/亮主题 tokens
13. [视觉] 页脚：补齐暗/亮主题 tokens
14. [视觉] Banner 英雄区：补齐暗/亮主题 tokens
15. [视觉] Bento 卡片：补齐暗/亮主题 tokens
16. [视觉] 详情页海报：补齐暗/亮主题 tokens
17. [视觉] 资讯卡片：补齐暗/亮主题 tokens
18. [视觉] 排行榜模块：补齐暗/亮主题 tokens
19. [视觉] 搜索页头部：补齐暗/亮主题 tokens
20. [视觉] 登录页：补齐暗/亮主题 tokens
21. [视觉] Toast 提示：补齐暗/亮主题 tokens
22. [视觉] 404 页面：补齐暗/亮主题 tokens
23. [视觉] PageShell 容器：补齐暗/亮主题 tokens
24. [视觉] 标签/Chip：补齐暗/亮主题 tokens
25. [视觉] 主题切换按钮：补齐暗/亮主题 tokens
26. [视觉] 全局背景：替换硬编码颜色为 tokens
27. [视觉] 主题色板：替换硬编码颜色为 tokens
28. [视觉] 文字层级：替换硬编码颜色为 tokens
29. [视觉] 按钮体系：替换硬编码颜色为 tokens
30. [视觉] 卡片层级：替换硬编码颜色为 tokens
31. [视觉] 阴影与高光：替换硬编码颜色为 tokens
32. [视觉] 边框/分割线：替换硬编码颜色为 tokens
33. [视觉] 图标/徽章：替换硬编码颜色为 tokens
34. [视觉] 表单控件：替换硬编码颜色为 tokens
35. [视觉] 滚动条：替换硬编码颜色为 tokens
36. [视觉] 空状态容器：替换硬编码颜色为 tokens
37. [视觉] 导航栏：替换硬编码颜色为 tokens
38. [视觉] 页脚：替换硬编码颜色为 tokens
39. [视觉] Banner 英雄区：替换硬编码颜色为 tokens
40. [视觉] Bento 卡片：替换硬编码颜色为 tokens
41. [视觉] 详情页海报：替换硬编码颜色为 tokens
42. [视觉] 资讯卡片：替换硬编码颜色为 tokens
43. [视觉] 排行榜模块：替换硬编码颜色为 tokens
44. [视觉] 搜索页头部：替换硬编码颜色为 tokens
45. [视觉] 登录页：替换硬编码颜色为 tokens
46. [视觉] Toast 提示：替换硬编码颜色为 tokens
47. [视觉] 404 页面：替换硬编码颜色为 tokens
48. [视觉] PageShell 容器：替换硬编码颜色为 tokens
49. [视觉] 标签/Chip：替换硬编码颜色为 tokens
50. [视觉] 主题切换按钮：替换硬编码颜色为 tokens
51. [视觉] 全局背景：增强对比度达到 WCAG AA
52. [视觉] 主题色板：增强对比度达到 WCAG AA
53. [视觉] 文字层级：增强对比度达到 WCAG AA
54. [视觉] 按钮体系：增强对比度达到 WCAG AA
55. [视觉] 卡片层级：增强对比度达到 WCAG AA
56. [视觉] 阴影与高光：增强对比度达到 WCAG AA
57. [视觉] 边框/分割线：增强对比度达到 WCAG AA
58. [视觉] 图标/徽章：增强对比度达到 WCAG AA
59. [视觉] 表单控件：增强对比度达到 WCAG AA
60. [视觉] 滚动条：增强对比度达到 WCAG AA
61. [视觉] 空状态容器：增强对比度达到 WCAG AA
62. [视觉] 导航栏：增强对比度达到 WCAG AA
63. [视觉] 页脚：增强对比度达到 WCAG AA
64. [视觉] Banner 英雄区：增强对比度达到 WCAG AA
65. [视觉] Bento 卡片：增强对比度达到 WCAG AA
66. [视觉] 详情页海报：增强对比度达到 WCAG AA
67. [视觉] 资讯卡片：增强对比度达到 WCAG AA
68. [视觉] 排行榜模块：增强对比度达到 WCAG AA
69. [视觉] 搜索页头部：增强对比度达到 WCAG AA
70. [视觉] 登录页：增强对比度达到 WCAG AA
71. [视觉] Toast 提示：增强对比度达到 WCAG AA
72. [视觉] 404 页面：增强对比度达到 WCAG AA
73. [视觉] PageShell 容器：增强对比度达到 WCAG AA
74. [视觉] 标签/Chip：增强对比度达到 WCAG AA
75. [视觉] 主题切换按钮：增强对比度达到 WCAG AA
76. [视觉] 全局背景：加入玻璃拟态层级
77. [视觉] 主题色板：加入玻璃拟态层级
78. [视觉] 文字层级：加入玻璃拟态层级
79. [视觉] 按钮体系：加入玻璃拟态层级
80. [视觉] 卡片层级：加入玻璃拟态层级
81. [视觉] 阴影与高光：加入玻璃拟态层级
82. [视觉] 边框/分割线：加入玻璃拟态层级
83. [视觉] 图标/徽章：加入玻璃拟态层级
84. [视觉] 表单控件：加入玻璃拟态层级
85. [视觉] 滚动条：加入玻璃拟态层级
86. [视觉] 空状态容器：加入玻璃拟态层级
87. [视觉] 导航栏：加入玻璃拟态层级
88. [视觉] 页脚：加入玻璃拟态层级
89. [视觉] Banner 英雄区：加入玻璃拟态层级
90. [视觉] Bento 卡片：加入玻璃拟态层级
91. [视觉] 详情页海报：加入玻璃拟态层级
92. [视觉] 资讯卡片：加入玻璃拟态层级
93. [视觉] 排行榜模块：加入玻璃拟态层级
94. [视觉] 搜索页头部：加入玻璃拟态层级
95. [视觉] 登录页：加入玻璃拟态层级
96. [视觉] Toast 提示：加入玻璃拟态层级
97. [视觉] 404 页面：加入玻璃拟态层级
98. [视觉] PageShell 容器：加入玻璃拟态层级
99. [视觉] 标签/Chip：加入玻璃拟态层级
100.  [视觉] 主题切换按钮：加入玻璃拟态层级
101.  [视觉] 全局背景：加入墨韵纹理/纸张质感
102.  [视觉] 主题色板：加入墨韵纹理/纸张质感
103.  [视觉] 文字层级：加入墨韵纹理/纸张质感
104.  [视觉] 按钮体系：加入墨韵纹理/纸张质感
105.  [视觉] 卡片层级：加入墨韵纹理/纸张质感
106.  [视觉] 阴影与高光：加入墨韵纹理/纸张质感
107.  [视觉] 边框/分割线：加入墨韵纹理/纸张质感
108.  [视觉] 图标/徽章：加入墨韵纹理/纸张质感
109.  [视觉] 表单控件：加入墨韵纹理/纸张质感
110.  [视觉] 滚动条：加入墨韵纹理/纸张质感
111.  [视觉] 空状态容器：加入墨韵纹理/纸张质感
112.  [视觉] 导航栏：加入墨韵纹理/纸张质感
113.  [视觉] 页脚：加入墨韵纹理/纸张质感
114.  [视觉] Banner 英雄区：加入墨韵纹理/纸张质感
115.  [视觉] Bento 卡片：加入墨韵纹理/纸张质感
116.  [视觉] 详情页海报：加入墨韵纹理/纸张质感
117.  [视觉] 资讯卡片：加入墨韵纹理/纸张质感
118.  [视觉] 排行榜模块：加入墨韵纹理/纸张质感
119.  [视觉] 搜索页头部：加入墨韵纹理/纸张质感
120.  [视觉] 登录页：加入墨韵纹理/纸张质感
121.  [视觉] Toast 提示：加入墨韵纹理/纸张质感
122.  [视觉] 404 页面：加入墨韵纹理/纸张质感
123.  [视觉] PageShell 容器：加入墨韵纹理/纸张质感
124.  [视觉] 标签/Chip：加入墨韵纹理/纸张质感
125.  [视觉] 主题切换按钮：加入墨韵纹理/纸张质感
126.  [视觉] 全局背景：优化光晕与渐变过渡
127.  [视觉] 主题色板：优化光晕与渐变过渡
128.  [视觉] 文字层级：优化光晕与渐变过渡
129.  [视觉] 按钮体系：优化光晕与渐变过渡
130.  [视觉] 卡片层级：优化光晕与渐变过渡
131.  [视觉] 阴影与高光：优化光晕与渐变过渡
132.  [视觉] 边框/分割线：优化光晕与渐变过渡
133.  [视觉] 图标/徽章：优化光晕与渐变过渡
134.  [视觉] 表单控件：优化光晕与渐变过渡
135.  [视觉] 滚动条：优化光晕与渐变过渡
136.  [视觉] 空状态容器：优化光晕与渐变过渡
137.  [视觉] 导航栏：优化光晕与渐变过渡
138.  [视觉] 页脚：优化光晕与渐变过渡
139.  [视觉] Banner 英雄区：优化光晕与渐变过渡
140.  [视觉] Bento 卡片：优化光晕与渐变过渡
141.  [视觉] 详情页海报：优化光晕与渐变过渡
142.  [视觉] 资讯卡片：优化光晕与渐变过渡
143.  [视觉] 排行榜模块：优化光晕与渐变过渡
144.  [视觉] 搜索页头部：优化光晕与渐变过渡
145.  [视觉] 登录页：优化光晕与渐变过渡
146.  [视觉] Toast 提示：优化光晕与渐变过渡
147.  [视觉] 404 页面：优化光晕与渐变过渡
148.  [视觉] PageShell 容器：优化光晕与渐变过渡
149.  [视觉] 标签/Chip：优化光晕与渐变过渡
150.  [视觉] 主题切换按钮：优化光晕与渐变过渡
151.  [视觉] 全局背景：统一圆角等级
152.  [视觉] 主题色板：统一圆角等级
153.  [视觉] 文字层级：统一圆角等级
154.  [视觉] 按钮体系：统一圆角等级
155.  [视觉] 卡片层级：统一圆角等级
156.  [视觉] 阴影与高光：统一圆角等级
157.  [视觉] 边框/分割线：统一圆角等级
158.  [视觉] 图标/徽章：统一圆角等级
159.  [视觉] 表单控件：统一圆角等级
160.  [视觉] 滚动条：统一圆角等级
161.  [视觉] 空状态容器：统一圆角等级
162.  [视觉] 导航栏：统一圆角等级
163.  [视觉] 页脚：统一圆角等级
164.  [视觉] Banner 英雄区：统一圆角等级
165.  [视觉] Bento 卡片：统一圆角等级
166.  [视觉] 详情页海报：统一圆角等级
167.  [视觉] 资讯卡片：统一圆角等级
168.  [视觉] 排行榜模块：统一圆角等级
169.  [视觉] 搜索页头部：统一圆角等级
170.  [视觉] 登录页：统一圆角等级
171.  [视觉] Toast 提示：统一圆角等级
172.  [视觉] 404 页面：统一圆角等级
173.  [视觉] PageShell 容器：统一圆角等级
174.  [视觉] 标签/Chip：统一圆角等级
175.  [视觉] 主题切换按钮：统一圆角等级
176.  [视觉] 全局背景：统一阴影体系
177.  [视觉] 主题色板：统一阴影体系
178.  [视觉] 文字层级：统一阴影体系
179.  [视觉] 按钮体系：统一阴影体系
180.  [视觉] 卡片层级：统一阴影体系
181.  [视觉] 阴影与高光：统一阴影体系
182.  [视觉] 边框/分割线：统一阴影体系
183.  [视觉] 图标/徽章：统一阴影体系
184.  [视觉] 表单控件：统一阴影体系
185.  [视觉] 滚动条：统一阴影体系
186.  [视觉] 空状态容器：统一阴影体系
187.  [视觉] 导航栏：统一阴影体系
188.  [视觉] 页脚：统一阴影体系
189.  [视觉] Banner 英雄区：统一阴影体系
190.  [视觉] Bento 卡片：统一阴影体系
191.  [视觉] 详情页海报：统一阴影体系
192.  [视觉] 资讯卡片：统一阴影体系
193.  [视觉] 排行榜模块：统一阴影体系
194.  [视觉] 搜索页头部：统一阴影体系
195.  [视觉] 登录页：统一阴影体系
196.  [视觉] Toast 提示：统一阴影体系
197.  [视觉] 404 页面：统一阴影体系
198.  [视觉] PageShell 容器：统一阴影体系
199.  [视觉] 标签/Chip：统一阴影体系
200.  [视觉] 主题切换按钮：统一阴影体系

## B. 组件与布局（250）

201.  [组件] Header：梳理布局层级并优化主视觉焦点
202.  [组件] Banner：梳理布局层级并优化主视觉焦点
203.  [组件] AnimeCard：梳理布局层级并优化主视觉焦点
204.  [组件] AnimeGrid：梳理布局层级并优化主视觉焦点
205.  [组件] AnimeList：梳理布局层级并优化主视觉焦点
206.  [组件] AnimeDetail：梳理布局层级并优化主视觉焦点
207.  [组件] RecentlyViewed：梳理布局层级并优化主视觉焦点
208.  [组件] ContinueWatching：梳理布局层级并优化主视觉焦点
209.  [组件] Features：梳理布局层级并优化主视觉焦点
210.  [组件] About：梳理布局层级并优化主视觉焦点
211.  [组件] Footer：梳理布局层级并优化主视觉焦点
212.  [组件] PageShell：梳理布局层级并优化主视觉焦点
213.  [组件] Login：梳理布局层级并优化主视觉焦点
214.  [组件] ForgotPassword：梳理布局层级并优化主视觉焦点
215.  [组件] SearchPage：梳理布局层级并优化主视觉焦点
216.  [组件] RankingsPage：梳理布局层级并优化主视觉焦点
217.  [组件] NewsPage：梳理布局层级并优化主视觉焦点
218.  [组件] NewsDetail：梳理布局层级并优化主视觉焦点
219.  [组件] Favorites：梳理布局层级并优化主视觉焦点
220.  [组件] ToastProvider：梳理布局层级并优化主视觉焦点
221.  [组件] EmptyState：梳理布局层级并优化主视觉焦点
222.  [组件] AppErrorBoundary：梳理布局层级并优化主视觉焦点
223.  [组件] StaticPage：梳理布局层级并优化主视觉焦点
224.  [组件] CategoryPage：梳理布局层级并优化主视觉焦点
225.  [组件] TagPage：梳理布局层级并优化主视觉焦点
226.  [组件] Header：加入 BENTO 栅格并设置跨度规则
227.  [组件] Banner：加入 BENTO 栅格并设置跨度规则
228.  [组件] AnimeCard：加入 BENTO 栅格并设置跨度规则
229.  [组件] AnimeGrid：加入 BENTO 栅格并设置跨度规则
230.  [组件] AnimeList：加入 BENTO 栅格并设置跨度规则
231.  [组件] AnimeDetail：加入 BENTO 栅格并设置跨度规则
232.  [组件] RecentlyViewed：加入 BENTO 栅格并设置跨度规则
233.  [组件] ContinueWatching：加入 BENTO 栅格并设置跨度规则
234.  [组件] Features：加入 BENTO 栅格并设置跨度规则
235.  [组件] About：加入 BENTO 栅格并设置跨度规则
236.  [组件] Footer：加入 BENTO 栅格并设置跨度规则
237.  [组件] PageShell：加入 BENTO 栅格并设置跨度规则
238.  [组件] Login：加入 BENTO 栅格并设置跨度规则
239.  [组件] ForgotPassword：加入 BENTO 栅格并设置跨度规则
240.  [组件] SearchPage：加入 BENTO 栅格并设置跨度规则
241.  [组件] RankingsPage：加入 BENTO 栅格并设置跨度规则
242.  [组件] NewsPage：加入 BENTO 栅格并设置跨度规则
243.  [组件] NewsDetail：加入 BENTO 栅格并设置跨度规则
244.  [组件] Favorites：加入 BENTO 栅格并设置跨度规则
245.  [组件] ToastProvider：加入 BENTO 栅格并设置跨度规则
246.  [组件] EmptyState：加入 BENTO 栅格并设置跨度规则
247.  [组件] AppErrorBoundary：加入 BENTO 栅格并设置跨度规则
248.  [组件] StaticPage：加入 BENTO 栅格并设置跨度规则
249.  [组件] CategoryPage：加入 BENTO 栅格并设置跨度规则
250.  [组件] TagPage：加入 BENTO 栅格并设置跨度规则
251.  [组件] Header：统一字体/字号/行高
252.  [组件] Banner：统一字体/字号/行高
253.  [组件] AnimeCard：统一字体/字号/行高
254.  [组件] AnimeGrid：统一字体/字号/行高
255.  [组件] AnimeList：统一字体/字号/行高
256.  [组件] AnimeDetail：统一字体/字号/行高
257.  [组件] RecentlyViewed：统一字体/字号/行高
258.  [组件] ContinueWatching：统一字体/字号/行高
259.  [组件] Features：统一字体/字号/行高
260.  [组件] About：统一字体/字号/行高
261.  [组件] Footer：统一字体/字号/行高
262.  [组件] PageShell：统一字体/字号/行高
263.  [组件] Login：统一字体/字号/行高
264.  [组件] ForgotPassword：统一字体/字号/行高
265.  [组件] SearchPage：统一字体/字号/行高
266.  [组件] RankingsPage：统一字体/字号/行高
267.  [组件] NewsPage：统一字体/字号/行高
268.  [组件] NewsDetail：统一字体/字号/行高
269.  [组件] Favorites：统一字体/字号/行高
270.  [组件] ToastProvider：统一字体/字号/行高
271.  [组件] EmptyState：统一字体/字号/行高
272.  [组件] AppErrorBoundary：统一字体/字号/行高
273.  [组件] StaticPage：统一字体/字号/行高
274.  [组件] CategoryPage：统一字体/字号/行高
275.  [组件] TagPage：统一字体/字号/行高
276.  [组件] Header：整理间距并统一 padding/spacing tokens
277.  [组件] Banner：整理间距并统一 padding/spacing tokens
278.  [组件] AnimeCard：整理间距并统一 padding/spacing tokens
279.  [组件] AnimeGrid：整理间距并统一 padding/spacing tokens
280.  [组件] AnimeList：整理间距并统一 padding/spacing tokens
281.  [组件] AnimeDetail：整理间距并统一 padding/spacing tokens
282.  [组件] RecentlyViewed：整理间距并统一 padding/spacing tokens
283.  [组件] ContinueWatching：整理间距并统一 padding/spacing tokens
284.  [组件] Features：整理间距并统一 padding/spacing tokens
285.  [组件] About：整理间距并统一 padding/spacing tokens
286.  [组件] Footer：整理间距并统一 padding/spacing tokens
287.  [组件] PageShell：整理间距并统一 padding/spacing tokens
288.  [组件] Login：整理间距并统一 padding/spacing tokens
289.  [组件] ForgotPassword：整理间距并统一 padding/spacing tokens
290.  [组件] SearchPage：整理间距并统一 padding/spacing tokens
291.  [组件] RankingsPage：整理间距并统一 padding/spacing tokens
292.  [组件] NewsPage：整理间距并统一 padding/spacing tokens
293.  [组件] NewsDetail：整理间距并统一 padding/spacing tokens
294.  [组件] Favorites：整理间距并统一 padding/spacing tokens
295.  [组件] ToastProvider：整理间距并统一 padding/spacing tokens
296.  [组件] EmptyState：整理间距并统一 padding/spacing tokens
297.  [组件] AppErrorBoundary：整理间距并统一 padding/spacing tokens
298.  [组件] StaticPage：整理间距并统一 padding/spacing tokens
299.  [组件] CategoryPage：整理间距并统一 padding/spacing tokens
300.  [组件] TagPage：整理间距并统一 padding/spacing tokens
301.  [组件] Header：增加卡片/列表分割标记
302.  [组件] Banner：增加卡片/列表分割标记
303.  [组件] AnimeCard：增加卡片/列表分割标记
304.  [组件] AnimeGrid：增加卡片/列表分割标记
305.  [组件] AnimeList：增加卡片/列表分割标记
306.  [组件] AnimeDetail：增加卡片/列表分割标记
307.  [组件] RecentlyViewed：增加卡片/列表分割标记
308.  [组件] ContinueWatching：增加卡片/列表分割标记
309.  [组件] Features：增加卡片/列表分割标记
310.  [组件] About：增加卡片/列表分割标记
311.  [组件] Footer：增加卡片/列表分割标记
312.  [组件] PageShell：增加卡片/列表分割标记
313.  [组件] Login：增加卡片/列表分割标记
314.  [组件] ForgotPassword：增加卡片/列表分割标记
315.  [组件] SearchPage：增加卡片/列表分割标记
316.  [组件] RankingsPage：增加卡片/列表分割标记
317.  [组件] NewsPage：增加卡片/列表分割标记
318.  [组件] NewsDetail：增加卡片/列表分割标记
319.  [组件] Favorites：增加卡片/列表分割标记
320.  [组件] ToastProvider：增加卡片/列表分割标记
321.  [组件] EmptyState：增加卡片/列表分割标记
322.  [组件] AppErrorBoundary：增加卡片/列表分割标记
323.  [组件] StaticPage：增加卡片/列表分割标记
324.  [组件] CategoryPage：增加卡片/列表分割标记
325.  [组件] TagPage：增加卡片/列表分割标记
326.  [组件] Header：优化移动端响应式断点
327.  [组件] Banner：优化移动端响应式断点
328.  [组件] AnimeCard：优化移动端响应式断点
329.  [组件] AnimeGrid：优化移动端响应式断点
330.  [组件] AnimeList：优化移动端响应式断点
331.  [组件] AnimeDetail：优化移动端响应式断点
332.  [组件] RecentlyViewed：优化移动端响应式断点
333.  [组件] ContinueWatching：优化移动端响应式断点
334.  [组件] Features：优化移动端响应式断点
335.  [组件] About：优化移动端响应式断点
336.  [组件] Footer：优化移动端响应式断点
337.  [组件] PageShell：优化移动端响应式断点
338.  [组件] Login：优化移动端响应式断点
339.  [组件] ForgotPassword：优化移动端响应式断点
340.  [组件] SearchPage：优化移动端响应式断点
341.  [组件] RankingsPage：优化移动端响应式断点
342.  [组件] NewsPage：优化移动端响应式断点
343.  [组件] NewsDetail：优化移动端响应式断点
344.  [组件] Favorites：优化移动端响应式断点
345.  [组件] ToastProvider：优化移动端响应式断点
346.  [组件] EmptyState：优化移动端响应式断点
347.  [组件] AppErrorBoundary：优化移动端响应式断点
348.  [组件] StaticPage：优化移动端响应式断点
349.  [组件] CategoryPage：优化移动端响应式断点
350.  [组件] TagPage：优化移动端响应式断点
351.  [组件] Header：补齐 hover/active/disabled 状态
352.  [组件] Banner：补齐 hover/active/disabled 状态
353.  [组件] AnimeCard：补齐 hover/active/disabled 状态
354.  [组件] AnimeGrid：补齐 hover/active/disabled 状态
355.  [组件] AnimeList：补齐 hover/active/disabled 状态
356.  [组件] AnimeDetail：补齐 hover/active/disabled 状态
357.  [组件] RecentlyViewed：补齐 hover/active/disabled 状态
358.  [组件] ContinueWatching：补齐 hover/active/disabled 状态
359.  [组件] Features：补齐 hover/active/disabled 状态
360.  [组件] About：补齐 hover/active/disabled 状态
361.  [组件] Footer：补齐 hover/active/disabled 状态
362.  [组件] PageShell：补齐 hover/active/disabled 状态
363.  [组件] Login：补齐 hover/active/disabled 状态
364.  [组件] ForgotPassword：补齐 hover/active/disabled 状态
365.  [组件] SearchPage：补齐 hover/active/disabled 状态
366.  [组件] RankingsPage：补齐 hover/active/disabled 状态
367.  [组件] NewsPage：补齐 hover/active/disabled 状态
368.  [组件] NewsDetail：补齐 hover/active/disabled 状态
369.  [组件] Favorites：补齐 hover/active/disabled 状态
370.  [组件] ToastProvider：补齐 hover/active/disabled 状态
371.  [组件] EmptyState：补齐 hover/active/disabled 状态
372.  [组件] AppErrorBoundary：补齐 hover/active/disabled 状态
373.  [组件] StaticPage：补齐 hover/active/disabled 状态
374.  [组件] CategoryPage：补齐 hover/active/disabled 状态
375.  [组件] TagPage：补齐 hover/active/disabled 状态
376.  [组件] Header：加入主题切换适配
377.  [组件] Banner：加入主题切换适配
378.  [组件] AnimeCard：加入主题切换适配
379.  [组件] AnimeGrid：加入主题切换适配
380.  [组件] AnimeList：加入主题切换适配
381.  [组件] AnimeDetail：加入主题切换适配
382.  [组件] RecentlyViewed：加入主题切换适配
383.  [组件] ContinueWatching：加入主题切换适配
384.  [组件] Features：加入主题切换适配
385.  [组件] About：加入主题切换适配
386.  [组件] Footer：加入主题切换适配
387.  [组件] PageShell：加入主题切换适配
388.  [组件] Login：加入主题切换适配
389.  [组件] ForgotPassword：加入主题切换适配
390.  [组件] SearchPage：加入主题切换适配
391.  [组件] RankingsPage：加入主题切换适配
392.  [组件] NewsPage：加入主题切换适配
393.  [组件] NewsDetail：加入主题切换适配
394.  [组件] Favorites：加入主题切换适配
395.  [组件] ToastProvider：加入主题切换适配
396.  [组件] EmptyState：加入主题切换适配
397.  [组件] AppErrorBoundary：加入主题切换适配
398.  [组件] StaticPage：加入主题切换适配
399.  [组件] CategoryPage：加入主题切换适配
400.  [组件] TagPage：加入主题切换适配
401.  [组件] Header：减少 DOM 嵌套并提升可读性
402.  [组件] Banner：减少 DOM 嵌套并提升可读性
403.  [组件] AnimeCard：减少 DOM 嵌套并提升可读性
404.  [组件] AnimeGrid：减少 DOM 嵌套并提升可读性
405.  [组件] AnimeList：减少 DOM 嵌套并提升可读性
406.  [组件] AnimeDetail：减少 DOM 嵌套并提升可读性
407.  [组件] RecentlyViewed：减少 DOM 嵌套并提升可读性
408.  [组件] ContinueWatching：减少 DOM 嵌套并提升可读性
409.  [组件] Features：减少 DOM 嵌套并提升可读性
410.  [组件] About：减少 DOM 嵌套并提升可读性
411.  [组件] Footer：减少 DOM 嵌套并提升可读性
412.  [组件] PageShell：减少 DOM 嵌套并提升可读性
413.  [组件] Login：减少 DOM 嵌套并提升可读性
414.  [组件] ForgotPassword：减少 DOM 嵌套并提升可读性
415.  [组件] SearchPage：减少 DOM 嵌套并提升可读性
416.  [组件] RankingsPage：减少 DOM 嵌套并提升可读性
417.  [组件] NewsPage：减少 DOM 嵌套并提升可读性
418.  [组件] NewsDetail：减少 DOM 嵌套并提升可读性
419.  [组件] Favorites：减少 DOM 嵌套并提升可读性
420.  [组件] ToastProvider：减少 DOM 嵌套并提升可读性
421.  [组件] EmptyState：减少 DOM 嵌套并提升可读性
422.  [组件] AppErrorBoundary：减少 DOM 嵌套并提升可读性
423.  [组件] StaticPage：减少 DOM 嵌套并提升可读性
424.  [组件] CategoryPage：减少 DOM 嵌套并提升可读性
425.  [组件] TagPage：减少 DOM 嵌套并提升可读性
426.  [组件] Header：修复潜在的可访问性冲突
427.  [组件] Banner：修复潜在的可访问性冲突
428.  [组件] AnimeCard：修复潜在的可访问性冲突
429.  [组件] AnimeGrid：修复潜在的可访问性冲突
430.  [组件] AnimeList：修复潜在的可访问性冲突
431.  [组件] AnimeDetail：修复潜在的可访问性冲突
432.  [组件] RecentlyViewed：修复潜在的可访问性冲突
433.  [组件] ContinueWatching：修复潜在的可访问性冲突
434.  [组件] Features：修复潜在的可访问性冲突
435.  [组件] About：修复潜在的可访问性冲突
436.  [组件] Footer：修复潜在的可访问性冲突
437.  [组件] PageShell：修复潜在的可访问性冲突
438.  [组件] Login：修复潜在的可访问性冲突
439.  [组件] ForgotPassword：修复潜在的可访问性冲突
440.  [组件] SearchPage：修复潜在的可访问性冲突
441.  [组件] RankingsPage：修复潜在的可访问性冲突
442.  [组件] NewsPage：修复潜在的可访问性冲突
443.  [组件] NewsDetail：修复潜在的可访问性冲突
444.  [组件] Favorites：修复潜在的可访问性冲突
445.  [组件] ToastProvider：修复潜在的可访问性冲突
446.  [组件] EmptyState：修复潜在的可访问性冲突
447.  [组件] AppErrorBoundary：修复潜在的可访问性冲突
448.  [组件] StaticPage：修复潜在的可访问性冲突
449.  [组件] CategoryPage：修复潜在的可访问性冲突
450.  [组件] TagPage：修复潜在的可访问性冲突

## C. 动效与交互（150）

451.  [动效] 首页：加入分层入场动效（Stagger）
452.  [动效] 推荐页：加入分层入场动效（Stagger）
453.  [动效] 排行榜：加入分层入场动效（Stagger）
454.  [动效] 资讯列表：加入分层入场动效（Stagger）
455.  [动效] 资讯详情：加入分层入场动效（Stagger）
456.  [动效] 搜索：加入分层入场动效（Stagger）
457.  [动效] 收藏：加入分层入场动效（Stagger）
458.  [动效] 登录/注册：加入分层入场动效（Stagger）
459.  [动效] 找回密码：加入分层入场动效（Stagger）
460.  [动效] 关于我们：加入分层入场动效（Stagger）
461.  [动效] 首页：为核心卡片添加细微浮动与阴影过渡
462.  [动效] 推荐页：为核心卡片添加细微浮动与阴影过渡
463.  [动效] 排行榜：为核心卡片添加细微浮动与阴影过渡
464.  [动效] 资讯列表：为核心卡片添加细微浮动与阴影过渡
465.  [动效] 资讯详情：为核心卡片添加细微浮动与阴影过渡
466.  [动效] 搜索：为核心卡片添加细微浮动与阴影过渡
467.  [动效] 收藏：为核心卡片添加细微浮动与阴影过渡
468.  [动效] 登录/注册：为核心卡片添加细微浮动与阴影过渡
469.  [动效] 找回密码：为核心卡片添加细微浮动与阴影过渡
470.  [动效] 关于我们：为核心卡片添加细微浮动与阴影过渡
471.  [动效] 首页：增加滚动视差的轻量版本
472.  [动效] 推荐页：增加滚动视差的轻量版本
473.  [动效] 排行榜：增加滚动视差的轻量版本
474.  [动效] 资讯列表：增加滚动视差的轻量版本
475.  [动效] 资讯详情：增加滚动视差的轻量版本
476.  [动效] 搜索：增加滚动视差的轻量版本
477.  [动效] 收藏：增加滚动视差的轻量版本
478.  [动效] 登录/注册：增加滚动视差的轻量版本
479.  [动效] 找回密码：增加滚动视差的轻量版本
480.  [动效] 关于我们：增加滚动视差的轻量版本
481.  [动效] 首页：加入点击反馈缩放与弹性回弹
482.  [动效] 推荐页：加入点击反馈缩放与弹性回弹
483.  [动效] 排行榜：加入点击反馈缩放与弹性回弹
484.  [动效] 资讯列表：加入点击反馈缩放与弹性回弹
485.  [动效] 资讯详情：加入点击反馈缩放与弹性回弹
486.  [动效] 搜索：加入点击反馈缩放与弹性回弹
487.  [动效] 收藏：加入点击反馈缩放与弹性回弹
488.  [动效] 登录/注册：加入点击反馈缩放与弹性回弹
489.  [动效] 找回密码：加入点击反馈缩放与弹性回弹
490.  [动效] 关于我们：加入点击反馈缩放与弹性回弹
491.  [动效] 首页：优化路由切换 Layout 动画
492.  [动效] 推荐页：优化路由切换 Layout 动画
493.  [动效] 排行榜：优化路由切换 Layout 动画
494.  [动效] 资讯列表：优化路由切换 Layout 动画
495.  [动效] 资讯详情：优化路由切换 Layout 动画
496.  [动效] 搜索：优化路由切换 Layout 动画
497.  [动效] 收藏：优化路由切换 Layout 动画
498.  [动效] 登录/注册：优化路由切换 Layout 动画
499.  [动效] 找回密码：优化路由切换 Layout 动画
500.  [动效] 关于我们：优化路由切换 Layout 动画
501.  [动效] 首页：尊重 prefers-reduced-motion
502.  [动效] 推荐页：尊重 prefers-reduced-motion
503.  [动效] 排行榜：尊重 prefers-reduced-motion
504.  [动效] 资讯列表：尊重 prefers-reduced-motion
505.  [动效] 资讯详情：尊重 prefers-reduced-motion
506.  [动效] 搜索：尊重 prefers-reduced-motion
507.  [动效] 收藏：尊重 prefers-reduced-motion
508.  [动效] 登录/注册：尊重 prefers-reduced-motion
509.  [动效] 找回密码：尊重 prefers-reduced-motion
510.  [动效] 关于我们：尊重 prefers-reduced-motion
511.  [动效] 首页：为关键按钮添加轻量 shimmer
512.  [动效] 推荐页：为关键按钮添加轻量 shimmer
513.  [动效] 排行榜：为关键按钮添加轻量 shimmer
514.  [动效] 资讯列表：为关键按钮添加轻量 shimmer
515.  [动效] 资讯详情：为关键按钮添加轻量 shimmer
516.  [动效] 搜索：为关键按钮添加轻量 shimmer
517.  [动效] 收藏：为关键按钮添加轻量 shimmer
518.  [动效] 登录/注册：为关键按钮添加轻量 shimmer
519.  [动效] 找回密码：为关键按钮添加轻量 shimmer
520.  [动效] 关于我们：为关键按钮添加轻量 shimmer
521.  [动效] 首页：加入页面载入时的聚焦引导
522.  [动效] 推荐页：加入页面载入时的聚焦引导
523.  [动效] 排行榜：加入页面载入时的聚焦引导
524.  [动效] 资讯列表：加入页面载入时的聚焦引导
525.  [动效] 资讯详情：加入页面载入时的聚焦引导
526.  [动效] 搜索：加入页面载入时的聚焦引导
527.  [动效] 收藏：加入页面载入时的聚焦引导
528.  [动效] 登录/注册：加入页面载入时的聚焦引导
529.  [动效] 找回密码：加入页面载入时的聚焦引导
530.  [动效] 关于我们：加入页面载入时的聚焦引导
531.  [动效] 首页：改进骨架屏淡入
532.  [动效] 推荐页：改进骨架屏淡入
533.  [动效] 排行榜：改进骨架屏淡入
534.  [动效] 资讯列表：改进骨架屏淡入
535.  [动效] 资讯详情：改进骨架屏淡入
536.  [动效] 搜索：改进骨架屏淡入
537.  [动效] 收藏：改进骨架屏淡入
538.  [动效] 登录/注册：改进骨架屏淡入
539.  [动效] 找回密码：改进骨架屏淡入
540.  [动效] 关于我们：改进骨架屏淡入
541.  [动效] 首页：优化动效性能与 fps
542.  [动效] 推荐页：优化动效性能与 fps
543.  [动效] 排行榜：优化动效性能与 fps
544.  [动效] 资讯列表：优化动效性能与 fps
545.  [动效] 资讯详情：优化动效性能与 fps
546.  [动效] 搜索：优化动效性能与 fps
547.  [动效] 收藏：优化动效性能与 fps
548.  [动效] 登录/注册：优化动效性能与 fps
549.  [动效] 找回密码：优化动效性能与 fps
550.  [动效] 关于我们：优化动效性能与 fps
551.  [动效] 首页：新增滚动定位的柔性过渡
552.  [动效] 推荐页：新增滚动定位的柔性过渡
553.  [动效] 排行榜：新增滚动定位的柔性过渡
554.  [动效] 资讯列表：新增滚动定位的柔性过渡
555.  [动效] 资讯详情：新增滚动定位的柔性过渡
556.  [动效] 搜索：新增滚动定位的柔性过渡
557.  [动效] 收藏：新增滚动定位的柔性过渡
558.  [动效] 登录/注册：新增滚动定位的柔性过渡
559.  [动效] 找回密码：新增滚动定位的柔性过渡
560.  [动效] 关于我们：新增滚动定位的柔性过渡
561.  [动效] 首页：为图像加载增加渐显
562.  [动效] 推荐页：为图像加载增加渐显
563.  [动效] 排行榜：为图像加载增加渐显
564.  [动效] 资讯列表：为图像加载增加渐显
565.  [动效] 资讯详情：为图像加载增加渐显
566.  [动效] 搜索：为图像加载增加渐显
567.  [动效] 收藏：为图像加载增加渐显
568.  [动效] 登录/注册：为图像加载增加渐显
569.  [动效] 找回密码：为图像加载增加渐显
570.  [动效] 关于我们：为图像加载增加渐显
571.  [动效] 首页：加入分层入场动效（Stagger）
572.  [动效] 推荐页：加入分层入场动效（Stagger）
573.  [动效] 排行榜：加入分层入场动效（Stagger）
574.  [动效] 资讯列表：加入分层入场动效（Stagger）
575.  [动效] 资讯详情：加入分层入场动效（Stagger）
576.  [动效] 搜索：加入分层入场动效（Stagger）
577.  [动效] 收藏：加入分层入场动效（Stagger）
578.  [动效] 登录/注册：加入分层入场动效（Stagger）
579.  [动效] 找回密码：加入分层入场动效（Stagger）
580.  [动效] 关于我们：加入分层入场动效（Stagger）
581.  [动效] 首页：为核心卡片添加细微浮动与阴影过渡
582.  [动效] 推荐页：为核心卡片添加细微浮动与阴影过渡
583.  [动效] 排行榜：为核心卡片添加细微浮动与阴影过渡
584.  [动效] 资讯列表：为核心卡片添加细微浮动与阴影过渡
585.  [动效] 资讯详情：为核心卡片添加细微浮动与阴影过渡
586.  [动效] 搜索：为核心卡片添加细微浮动与阴影过渡
587.  [动效] 收藏：为核心卡片添加细微浮动与阴影过渡
588.  [动效] 登录/注册：为核心卡片添加细微浮动与阴影过渡
589.  [动效] 找回密码：为核心卡片添加细微浮动与阴影过渡
590.  [动效] 关于我们：为核心卡片添加细微浮动与阴影过渡
591.  [动效] 首页：增加滚动视差的轻量版本
592.  [动效] 推荐页：增加滚动视差的轻量版本
593.  [动效] 排行榜：增加滚动视差的轻量版本
594.  [动效] 资讯列表：增加滚动视差的轻量版本
595.  [动效] 资讯详情：增加滚动视差的轻量版本
596.  [动效] 搜索：增加滚动视差的轻量版本
597.  [动效] 收藏：增加滚动视差的轻量版本
598.  [动效] 登录/注册：增加滚动视差的轻量版本
599.  [动效] 找回密码：增加滚动视差的轻量版本
600.  [动效] 关于我们：增加滚动视差的轻量版本

## D. 无障碍与语义（150）

601.  [A11y] Header：补齐 aria-label/aria-describedby
602.  [A11y] Banner：补齐 aria-label/aria-describedby
603.  [A11y] AnimeCard：补齐 aria-label/aria-describedby
604.  [A11y] AnimeGrid：补齐 aria-label/aria-describedby
605.  [A11y] AnimeList：补齐 aria-label/aria-describedby
606.  [A11y] AnimeDetail：补齐 aria-label/aria-describedby
607.  [A11y] RecentlyViewed：补齐 aria-label/aria-describedby
608.  [A11y] ContinueWatching：补齐 aria-label/aria-describedby
609.  [A11y] Features：补齐 aria-label/aria-describedby
610.  [A11y] About：补齐 aria-label/aria-describedby
611.  [A11y] Footer：补齐 aria-label/aria-describedby
612.  [A11y] PageShell：补齐 aria-label/aria-describedby
613.  [A11y] Login：补齐 aria-label/aria-describedby
614.  [A11y] ForgotPassword：补齐 aria-label/aria-describedby
615.  [A11y] SearchPage：补齐 aria-label/aria-describedby
616.  [A11y] RankingsPage：补齐 aria-label/aria-describedby
617.  [A11y] NewsPage：补齐 aria-label/aria-describedby
618.  [A11y] NewsDetail：补齐 aria-label/aria-describedby
619.  [A11y] Favorites：补齐 aria-label/aria-describedby
620.  [A11y] ToastProvider：补齐 aria-label/aria-describedby
621.  [A11y] EmptyState：补齐 aria-label/aria-describedby
622.  [A11y] AppErrorBoundary：补齐 aria-label/aria-describedby
623.  [A11y] StaticPage：补齐 aria-label/aria-describedby
624.  [A11y] CategoryPage：补齐 aria-label/aria-describedby
625.  [A11y] TagPage：补齐 aria-label/aria-describedby
626.  [A11y] Header：为按钮补齐 aria-pressed 状态
627.  [A11y] Banner：为按钮补齐 aria-pressed 状态
628.  [A11y] AnimeCard：为按钮补齐 aria-pressed 状态
629.  [A11y] AnimeGrid：为按钮补齐 aria-pressed 状态
630.  [A11y] AnimeList：为按钮补齐 aria-pressed 状态
631.  [A11y] AnimeDetail：为按钮补齐 aria-pressed 状态
632.  [A11y] RecentlyViewed：为按钮补齐 aria-pressed 状态
633.  [A11y] ContinueWatching：为按钮补齐 aria-pressed 状态
634.  [A11y] Features：为按钮补齐 aria-pressed 状态
635.  [A11y] About：为按钮补齐 aria-pressed 状态
636.  [A11y] Footer：为按钮补齐 aria-pressed 状态
637.  [A11y] PageShell：为按钮补齐 aria-pressed 状态
638.  [A11y] Login：为按钮补齐 aria-pressed 状态
639.  [A11y] ForgotPassword：为按钮补齐 aria-pressed 状态
640.  [A11y] SearchPage：为按钮补齐 aria-pressed 状态
641.  [A11y] RankingsPage：为按钮补齐 aria-pressed 状态
642.  [A11y] NewsPage：为按钮补齐 aria-pressed 状态
643.  [A11y] NewsDetail：为按钮补齐 aria-pressed 状态
644.  [A11y] Favorites：为按钮补齐 aria-pressed 状态
645.  [A11y] ToastProvider：为按钮补齐 aria-pressed 状态
646.  [A11y] EmptyState：为按钮补齐 aria-pressed 状态
647.  [A11y] AppErrorBoundary：为按钮补齐 aria-pressed 状态
648.  [A11y] StaticPage：为按钮补齐 aria-pressed 状态
649.  [A11y] CategoryPage：为按钮补齐 aria-pressed 状态
650.  [A11y] TagPage：为按钮补齐 aria-pressed 状态
651.  [A11y] Header：修复键盘 Tab 顺序与焦点可见性
652.  [A11y] Banner：修复键盘 Tab 顺序与焦点可见性
653.  [A11y] AnimeCard：修复键盘 Tab 顺序与焦点可见性
654.  [A11y] AnimeGrid：修复键盘 Tab 顺序与焦点可见性
655.  [A11y] AnimeList：修复键盘 Tab 顺序与焦点可见性
656.  [A11y] AnimeDetail：修复键盘 Tab 顺序与焦点可见性
657.  [A11y] RecentlyViewed：修复键盘 Tab 顺序与焦点可见性
658.  [A11y] ContinueWatching：修复键盘 Tab 顺序与焦点可见性
659.  [A11y] Features：修复键盘 Tab 顺序与焦点可见性
660.  [A11y] About：修复键盘 Tab 顺序与焦点可见性
661.  [A11y] Footer：修复键盘 Tab 顺序与焦点可见性
662.  [A11y] PageShell：修复键盘 Tab 顺序与焦点可见性
663.  [A11y] Login：修复键盘 Tab 顺序与焦点可见性
664.  [A11y] ForgotPassword：修复键盘 Tab 顺序与焦点可见性
665.  [A11y] SearchPage：修复键盘 Tab 顺序与焦点可见性
666.  [A11y] RankingsPage：修复键盘 Tab 顺序与焦点可见性
667.  [A11y] NewsPage：修复键盘 Tab 顺序与焦点可见性
668.  [A11y] NewsDetail：修复键盘 Tab 顺序与焦点可见性
669.  [A11y] Favorites：修复键盘 Tab 顺序与焦点可见性
670.  [A11y] ToastProvider：修复键盘 Tab 顺序与焦点可见性
671.  [A11y] EmptyState：修复键盘 Tab 顺序与焦点可见性
672.  [A11y] AppErrorBoundary：修复键盘 Tab 顺序与焦点可见性
673.  [A11y] StaticPage：修复键盘 Tab 顺序与焦点可见性
674.  [A11y] CategoryPage：修复键盘 Tab 顺序与焦点可见性
675.  [A11y] TagPage：修复键盘 Tab 顺序与焦点可见性
676.  [A11y] Header：补齐 role=list/listitem 语义
677.  [A11y] Banner：补齐 role=list/listitem 语义
678.  [A11y] AnimeCard：补齐 role=list/listitem 语义
679.  [A11y] AnimeGrid：补齐 role=list/listitem 语义
680.  [A11y] AnimeList：补齐 role=list/listitem 语义
681.  [A11y] AnimeDetail：补齐 role=list/listitem 语义
682.  [A11y] RecentlyViewed：补齐 role=list/listitem 语义
683.  [A11y] ContinueWatching：补齐 role=list/listitem 语义
684.  [A11y] Features：补齐 role=list/listitem 语义
685.  [A11y] About：补齐 role=list/listitem 语义
686.  [A11y] Footer：补齐 role=list/listitem 语义
687.  [A11y] PageShell：补齐 role=list/listitem 语义
688.  [A11y] Login：补齐 role=list/listitem 语义
689.  [A11y] ForgotPassword：补齐 role=list/listitem 语义
690.  [A11y] SearchPage：补齐 role=list/listitem 语义
691.  [A11y] RankingsPage：补齐 role=list/listitem 语义
692.  [A11y] NewsPage：补齐 role=list/listitem 语义
693.  [A11y] NewsDetail：补齐 role=list/listitem 语义
694.  [A11y] Favorites：补齐 role=list/listitem 语义
695.  [A11y] ToastProvider：补齐 role=list/listitem 语义
696.  [A11y] EmptyState：补齐 role=list/listitem 语义
697.  [A11y] AppErrorBoundary：补齐 role=list/listitem 语义
698.  [A11y] StaticPage：补齐 role=list/listitem 语义
699.  [A11y] CategoryPage：补齐 role=list/listitem 语义
700.  [A11y] TagPage：补齐 role=list/listitem 语义
701.  [A11y] Header：为表单补齐 label 关联
702.  [A11y] Banner：为表单补齐 label 关联
703.  [A11y] AnimeCard：为表单补齐 label 关联
704.  [A11y] AnimeGrid：为表单补齐 label 关联
705.  [A11y] AnimeList：为表单补齐 label 关联
706.  [A11y] AnimeDetail：为表单补齐 label 关联
707.  [A11y] RecentlyViewed：为表单补齐 label 关联
708.  [A11y] ContinueWatching：为表单补齐 label 关联
709.  [A11y] Features：为表单补齐 label 关联
710.  [A11y] About：为表单补齐 label 关联
711.  [A11y] Footer：为表单补齐 label 关联
712.  [A11y] PageShell：为表单补齐 label 关联
713.  [A11y] Login：为表单补齐 label 关联
714.  [A11y] ForgotPassword：为表单补齐 label 关联
715.  [A11y] SearchPage：为表单补齐 label 关联
716.  [A11y] RankingsPage：为表单补齐 label 关联
717.  [A11y] NewsPage：为表单补齐 label 关联
718.  [A11y] NewsDetail：为表单补齐 label 关联
719.  [A11y] Favorites：为表单补齐 label 关联
720.  [A11y] ToastProvider：为表单补齐 label 关联
721.  [A11y] EmptyState：为表单补齐 label 关联
722.  [A11y] AppErrorBoundary：为表单补齐 label 关联
723.  [A11y] StaticPage：为表单补齐 label 关联
724.  [A11y] CategoryPage：为表单补齐 label 关联
725.  [A11y] TagPage：为表单补齐 label 关联
726.  [A11y] Header：优化颜色对比度
727.  [A11y] Banner：优化颜色对比度
728.  [A11y] AnimeCard：优化颜色对比度
729.  [A11y] AnimeGrid：优化颜色对比度
730.  [A11y] AnimeList：优化颜色对比度
731.  [A11y] AnimeDetail：优化颜色对比度
732.  [A11y] RecentlyViewed：优化颜色对比度
733.  [A11y] ContinueWatching：优化颜色对比度
734.  [A11y] Features：优化颜色对比度
735.  [A11y] About：优化颜色对比度
736.  [A11y] Footer：优化颜色对比度
737.  [A11y] PageShell：优化颜色对比度
738.  [A11y] Login：优化颜色对比度
739.  [A11y] ForgotPassword：优化颜色对比度
740.  [A11y] SearchPage：优化颜色对比度
741.  [A11y] RankingsPage：优化颜色对比度
742.  [A11y] NewsPage：优化颜色对比度
743.  [A11y] NewsDetail：优化颜色对比度
744.  [A11y] Favorites：优化颜色对比度
745.  [A11y] ToastProvider：优化颜色对比度
746.  [A11y] EmptyState：优化颜色对比度
747.  [A11y] AppErrorBoundary：优化颜色对比度
748.  [A11y] StaticPage：优化颜色对比度
749.  [A11y] CategoryPage：优化颜色对比度
750.  [A11y] TagPage：优化颜色对比度

## E. 性能/SEO/工程（150）

751.  [工程] 构建：拆分路由 chunk 并按需预取
752.  [工程] SEO：拆分路由 chunk 并按需预取
753.  [工程] 性能：拆分路由 chunk 并按需预取
754.  [工程] 测试：拆分路由 chunk 并按需预取
755.  [工程] CI：拆分路由 chunk 并按需预取
756.  [工程] 资源：拆分路由 chunk 并按需预取
757.  [工程] 构建：为关键图片补齐 loading/decoding/fetchPriority
758.  [工程] SEO：为关键图片补齐 loading/decoding/fetchPriority
759.  [工程] 性能：为关键图片补齐 loading/decoding/fetchPriority
760.  [工程] 测试：为关键图片补齐 loading/decoding/fetchPriority
761.  [工程] CI：为关键图片补齐 loading/decoding/fetchPriority
762.  [工程] 资源：为关键图片补齐 loading/decoding/fetchPriority
763.  [工程] 构建：优化 font-display 与预连接
764.  [工程] SEO：优化 font-display 与预连接
765.  [工程] 性能：优化 font-display 与预连接
766.  [工程] 测试：优化 font-display 与预连接
767.  [工程] CI：优化 font-display 与预连接
768.  [工程] 资源：优化 font-display 与预连接
769.  [工程] 构建：加入 CLS 监控并优化占位
770.  [工程] SEO：加入 CLS 监控并优化占位
771.  [工程] 性能：加入 CLS 监控并优化占位
772.  [工程] 测试：加入 CLS 监控并优化占位
773.  [工程] CI：加入 CLS 监控并优化占位
774.  [工程] 资源：加入 CLS 监控并优化占位
775.  [工程] 构建：压缩与优化 SVG 体积
776.  [工程] SEO：压缩与优化 SVG 体积
777.  [工程] 性能：压缩与优化 SVG 体积
778.  [工程] 测试：压缩与优化 SVG 体积
779.  [工程] CI：压缩与优化 SVG 体积
780.  [工程] 资源：压缩与优化 SVG 体积
781.  [工程] 构建：优化 CSS 选择器复杂度
782.  [工程] SEO：优化 CSS 选择器复杂度
783.  [工程] 性能：优化 CSS 选择器复杂度
784.  [工程] 测试：优化 CSS 选择器复杂度
785.  [工程] CI：优化 CSS 选择器复杂度
786.  [工程] 资源：优化 CSS 选择器复杂度
787.  [工程] 构建：为图片添加尺寸占位避免抖动
788.  [工程] SEO：为图片添加尺寸占位避免抖动
789.  [工程] 性能：为图片添加尺寸占位避免抖动
790.  [工程] 测试：为图片添加尺寸占位避免抖动
791.  [工程] CI：为图片添加尺寸占位避免抖动
792.  [工程] 资源：为图片添加尺寸占位避免抖动
793.  [工程] 构建：对大列表引入虚拟滚动预案
794.  [工程] SEO：对大列表引入虚拟滚动预案
795.  [工程] 性能：对大列表引入虚拟滚动预案
796.  [工程] 测试：对大列表引入虚拟滚动预案
797.  [工程] CI：对大列表引入虚拟滚动预案
798.  [工程] 资源：对大列表引入虚拟滚动预案
799.  [工程] 构建：压缩第三方依赖体积
800.  [工程] SEO：压缩第三方依赖体积
801.  [工程] 性能：压缩第三方依赖体积
802.  [工程] 测试：压缩第三方依赖体积
803.  [工程] CI：压缩第三方依赖体积
804.  [工程] 资源：压缩第三方依赖体积
805.  [工程] 构建：对搜索结果加入缓存策略
806.  [工程] SEO：对搜索结果加入缓存策略
807.  [工程] 性能：对搜索结果加入缓存策略
808.  [工程] 测试：对搜索结果加入缓存策略
809.  [工程] CI：对搜索结果加入缓存策略
810.  [工程] 资源：对搜索结果加入缓存策略
811.  [工程] 构建：提升 SEO 结构化数据
812.  [工程] SEO：提升 SEO 结构化数据
813.  [工程] 性能：提升 SEO 结构化数据
814.  [工程] 测试：提升 SEO 结构化数据
815.  [工程] CI：提升 SEO 结构化数据
816.  [工程] 资源：提升 SEO 结构化数据
817.  [工程] 构建：优化 OG/Twitter 元信息
818.  [工程] SEO：优化 OG/Twitter 元信息
819.  [工程] 性能：优化 OG/Twitter 元信息
820.  [工程] 测试：优化 OG/Twitter 元信息
821.  [工程] CI：优化 OG/Twitter 元信息
822.  [工程] 资源：优化 OG/Twitter 元信息
823.  [工程] 构建：刷新 sitemap/robots 自动生成
824.  [工程] SEO：刷新 sitemap/robots 自动生成
825.  [工程] 性能：刷新 sitemap/robots 自动生成
826.  [工程] 测试：刷新 sitemap/robots 自动生成
827.  [工程] CI：刷新 sitemap/robots 自动生成
828.  [工程] 资源：刷新 sitemap/robots 自动生成
829.  [工程] 构建：清理未使用的 CSS
830.  [工程] SEO：清理未使用的 CSS
831.  [工程] 性能：清理未使用的 CSS
832.  [工程] 测试：清理未使用的 CSS
833.  [工程] CI：清理未使用的 CSS
834.  [工程] 资源：清理未使用的 CSS
835.  [工程] 构建：为 build 增加 bundle 可视化报告
836.  [工程] SEO：为 build 增加 bundle 可视化报告
837.  [工程] 性能：为 build 增加 bundle 可视化报告
838.  [工程] 测试：为 build 增加 bundle 可视化报告
839.  [工程] CI：为 build 增加 bundle 可视化报告
840.  [工程] 资源：为 build 增加 bundle 可视化报告
841.  [工程] 构建：增加 Lighthouse 基线
842.  [工程] SEO：增加 Lighthouse 基线
843.  [工程] 性能：增加 Lighthouse 基线
844.  [工程] 测试：增加 Lighthouse 基线
845.  [工程] CI：增加 Lighthouse 基线
846.  [工程] 资源：增加 Lighthouse 基线
847.  [工程] 构建：将关键数据预计算
848.  [工程] SEO：将关键数据预计算
849.  [工程] 性能：将关键数据预计算
850.  [工程] 测试：将关键数据预计算
851.  [工程] CI：将关键数据预计算
852.  [工程] 资源：将关键数据预计算
853.  [工程] 构建：优化 localStorage 读写频率
854.  [工程] SEO：优化 localStorage 读写频率
855.  [工程] 性能：优化 localStorage 读写频率
856.  [工程] 测试：优化 localStorage 读写频率
857.  [工程] CI：优化 localStorage 读写频率
858.  [工程] 资源：优化 localStorage 读写频率
859.  [工程] 构建：添加错误监控钩子
860.  [工程] SEO：添加错误监控钩子
861.  [工程] 性能：添加错误监控钩子
862.  [工程] 测试：添加错误监控钩子
863.  [工程] CI：添加错误监控钩子
864.  [工程] 资源：添加错误监控钩子
865.  [工程] 构建：完善日志与异常报告
866.  [工程] SEO：完善日志与异常报告
867.  [工程] 性能：完善日志与异常报告
868.  [工程] 测试：完善日志与异常报告
869.  [工程] CI：完善日志与异常报告
870.  [工程] 资源：完善日志与异常报告
871.  [工程] 构建：增加单元测试覆盖
872.  [工程] SEO：增加单元测试覆盖
873.  [工程] 性能：增加单元测试覆盖
874.  [工程] 测试：增加单元测试覆盖
875.  [工程] CI：增加单元测试覆盖
876.  [工程] 资源：增加单元测试覆盖
877.  [工程] 构建：补齐 E2E 测试清单
878.  [工程] SEO：补齐 E2E 测试清单
879.  [工程] 性能：补齐 E2E 测试清单
880.  [工程] 测试：补齐 E2E 测试清单
881.  [工程] CI：补齐 E2E 测试清单
882.  [工程] 资源：补齐 E2E 测试清单
883.  [工程] 构建：优化 ESLint 规则配置
884.  [工程] SEO：优化 ESLint 规则配置
885.  [工程] 性能：优化 ESLint 规则配置
886.  [工程] 测试：优化 ESLint 规则配置
887.  [工程] CI：优化 ESLint 规则配置
888.  [工程] 资源：优化 ESLint 规则配置
889.  [工程] 构建：完善 Prettier 规范
890.  [工程] SEO：完善 Prettier 规范
891.  [工程] 性能：完善 Prettier 规范
892.  [工程] 测试：完善 Prettier 规范
893.  [工程] CI：完善 Prettier 规范
894.  [工程] 资源：完善 Prettier 规范
895.  [工程] 构建：补齐 CI 失败提示信息
896.  [工程] SEO：补齐 CI 失败提示信息
897.  [工程] 性能：补齐 CI 失败提示信息
898.  [工程] 测试：补齐 CI 失败提示信息
899.  [工程] CI：补齐 CI 失败提示信息
900.  [工程] 资源：补齐 CI 失败提示信息

## F. 业务功能（100）

901.  [业务] 观看进度：补齐数据结构与本地持久化
902.  [业务] 继续观看：补齐数据结构与本地持久化
903.  [业务] 收藏体系：补齐数据结构与本地持久化
904.  [业务] 收藏分组：补齐数据结构与本地持久化
905.  [业务] 搜索：补齐数据结构与本地持久化
906.  [业务] 推荐：补齐数据结构与本地持久化
907.  [业务] 排行榜：补齐数据结构与本地持久化
908.  [业务] 资讯：补齐数据结构与本地持久化
909.  [业务] 用户中心：补齐数据结构与本地持久化
910.  [业务] 分享海报：补齐数据结构与本地持久化
911.  [业务] 主题切换：补齐数据结构与本地持久化
912.  [业务] 快捷键：补齐数据结构与本地持久化
913.  [业务] 最近浏览：补齐数据结构与本地持久化
914.  [业务] 标签/分类：补齐数据结构与本地持久化
915.  [业务] 评论：补齐数据结构与本地持久化
916.  [业务] 消息通知：补齐数据结构与本地持久化
917.  [业务] 多端同步：补齐数据结构与本地持久化
918.  [业务] 播放入口：补齐数据结构与本地持久化
919.  [业务] 下载入口：补齐数据结构与本地持久化
920.  [业务] 反馈入口：补齐数据结构与本地持久化
921.  [业务] 观看进度：加入空状态与友好引导
922.  [业务] 继续观看：加入空状态与友好引导
923.  [业务] 收藏体系：加入空状态与友好引导
924.  [业务] 收藏分组：加入空状态与友好引导
925.  [业务] 搜索：加入空状态与友好引导
926.  [业务] 推荐：加入空状态与友好引导
927.  [业务] 排行榜：加入空状态与友好引导
928.  [业务] 资讯：加入空状态与友好引导
929.  [业务] 用户中心：加入空状态与友好引导
930.  [业务] 分享海报：加入空状态与友好引导
931.  [业务] 主题切换：加入空状态与友好引导
932.  [业务] 快捷键：加入空状态与友好引导
933.  [业务] 最近浏览：加入空状态与友好引导
934.  [业务] 标签/分类：加入空状态与友好引导
935.  [业务] 评论：加入空状态与友好引导
936.  [业务] 消息通知：加入空状态与友好引导
937.  [业务] 多端同步：加入空状态与友好引导
938.  [业务] 播放入口：加入空状态与友好引导
939.  [业务] 下载入口：加入空状态与友好引导
940.  [业务] 反馈入口：加入空状态与友好引导
941.  [业务] 观看进度：增加导入/导出机制
942.  [业务] 继续观看：增加导入/导出机制
943.  [业务] 收藏体系：增加导入/导出机制
944.  [业务] 收藏分组：增加导入/导出机制
945.  [业务] 搜索：增加导入/导出机制
946.  [业务] 推荐：增加导入/导出机制
947.  [业务] 排行榜：增加导入/导出机制
948.  [业务] 资讯：增加导入/导出机制
949.  [业务] 用户中心：增加导入/导出机制
950.  [业务] 分享海报：增加导入/导出机制
951.  [业务] 主题切换：增加导入/导出机制
952.  [业务] 快捷键：增加导入/导出机制
953.  [业务] 最近浏览：增加导入/导出机制
954.  [业务] 标签/分类：增加导入/导出机制
955.  [业务] 评论：增加导入/导出机制
956.  [业务] 消息通知：增加导入/导出机制
957.  [业务] 多端同步：增加导入/导出机制
958.  [业务] 播放入口：增加导入/导出机制
959.  [业务] 下载入口：增加导入/导出机制
960.  [业务] 反馈入口：增加导入/导出机制
961.  [业务] 观看进度：完善错误提示与兜底
962.  [业务] 继续观看：完善错误提示与兜底
963.  [业务] 收藏体系：完善错误提示与兜底
964.  [业务] 收藏分组：完善错误提示与兜底
965.  [业务] 搜索：完善错误提示与兜底
966.  [业务] 推荐：完善错误提示与兜底
967.  [业务] 排行榜：完善错误提示与兜底
968.  [业务] 资讯：完善错误提示与兜底
969.  [业务] 用户中心：完善错误提示与兜底
970.  [业务] 分享海报：完善错误提示与兜底
971.  [业务] 主题切换：完善错误提示与兜底
972.  [业务] 快捷键：完善错误提示与兜底
973.  [业务] 最近浏览：完善错误提示与兜底
974.  [业务] 标签/分类：完善错误提示与兜底
975.  [业务] 评论：完善错误提示与兜底
976.  [业务] 消息通知：完善错误提示与兜底
977.  [业务] 多端同步：完善错误提示与兜底
978.  [业务] 播放入口：完善错误提示与兜底
979.  [业务] 下载入口：完善错误提示与兜底
980.  [业务] 反馈入口：完善错误提示与兜底
981.  [业务] 观看进度：补齐埋点与统计钩子
982.  [业务] 继续观看：补齐埋点与统计钩子
983.  [业务] 收藏体系：补齐埋点与统计钩子
984.  [业务] 收藏分组：补齐埋点与统计钩子
985.  [业务] 搜索：补齐埋点与统计钩子
986.  [业务] 推荐：补齐埋点与统计钩子
987.  [业务] 排行榜：补齐埋点与统计钩子
988.  [业务] 资讯：补齐埋点与统计钩子
989.  [业务] 用户中心：补齐埋点与统计钩子
990.  [业务] 分享海报：补齐埋点与统计钩子
991.  [业务] 主题切换：补齐埋点与统计钩子
992.  [业务] 快捷键：补齐埋点与统计钩子
993.  [业务] 最近浏览：补齐埋点与统计钩子
994.  [业务] 标签/分类：补齐埋点与统计钩子
995.  [业务] 评论：补齐埋点与统计钩子
996.  [业务] 消息通知：补齐埋点与统计钩子
997.  [业务] 多端同步：补齐埋点与统计钩子
998.  [业务] 播放入口：补齐埋点与统计钩子
999.  [业务] 下载入口：补齐埋点与统计钩子
1000. [业务] 反馈入口：补齐埋点与统计钩子
