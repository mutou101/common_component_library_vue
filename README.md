# common_component_library_vue

**Vue 3 · TypeScript · Vite · DESIGN.md**

一个由 [DESIGN.md](DESIGN.md) 驱动的通用组件库。视觉规范取自
[awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 收录的 **Stripe** 设计语言分析
（靛蓝主色 `#533afd`、深海军蓝墨色 `#0d253d`、Sohne 300 细字重排版、胶囊按钮、渐变网格、tabular figures）。

> DESIGN.md 是 Google Stitch 提出的纯文本设计系统文档：把一份 markdown 放进项目根目录，
> 告诉 AI 代理 "build me a page that looks like this"，即可生成视觉一致的高质量 UI。

## 快速开始

```bash
npm install
npm run dev        # 启动组件演示页 (http://localhost:5173)
npm run build      # 类型检查 + 构建演示页
npm run build:lib  # 构建可发布的组件库 (dist-lib/, ESM + UMD)
npm run preview    # 预览构建产物
```

## 项目结构

```
common_component_library_vue/
├── DESIGN.md              # 设计规范（Stripe 风格，来自 awesome-design-md）
├── index.html             # 演示页入口
├── vite.config.ts         # 演示页构建
├── vite.lib.config.ts     # 组件库构建（lib mode）
└── src/
    ├── main.ts            # 演示页挂载
    ├── App.vue            # 组件展示页（色板/排版/全部组件）
    ├── index.ts           # 组件库导出入口（含 install 插件）
    ├── styles/
    │   ├── tokens.css     # 设计令牌：颜色/字体/圆角/间距/阴影 → CSS 变量 --cc-*
    │   └── base.css       # 全局基础样式（ss01、tnum、类型角色工具类）
    └── components/        # 15 个通用组件（前缀 Cc）
```

## 组件列表

| 组件 | 说明 | 对应 DESIGN.md token |
|---|---|---|
| `CcButton` | 胶囊按钮：primary / secondary / on-dark / ghost / link，sm·md·lg | `{button-primary-pill}`、`{button-secondary}`、`{button-on-dark}` |
| `CcInput` | 输入框：label / hint / error / prefix，聚焦换主色边框 | `{text-input}`、`{text-input-focused}` |
| `CcTextarea` | 多行文本域 | `{text-input}` 几何语言 |
| `CcSelect` | 原生 select 美化，自定义 chevron | `{text-input}` |
| `CcSwitch` | 胶囊开关 | 品牌胶囊几何 |
| `CcCheckbox` | 复选框 | 品牌色勾选 |
| `CcRadio` | 单选（共享 v-model 成组） | 品牌色圆点 |
| `CcCard` | feature / pricing / pricing-featured / cream / dashboard / plain | `{card-*}` 全套 |
| `CcTag` | 软标签 / 实心 / 深色 / 描边，支持 dot、closable | `{pill-tag-soft}` |
| `CcBadge` | 数字角标（tnum 数字，max 截断） | — |
| `CcAlert` | info / success / warning / error，可关闭 | 语义色（dashboard UI） |
| `CcModal` | 弹窗：Teleport、Esc 关闭、遮罩点击、过渡 | `{card-dashboard-mockup}` 深度 |
| `CcTooltip` | 悬浮提示：top / bottom / left / right，delay | 深海军蓝气泡 |
| `CcSpinner` | 加载指示器 | 品牌靛蓝 |
| `CcDivider` | 分割线，支持文本 | `{colors.hairline}` |

## 使用组件库

```ts
// 方式一：按需引入
import { CcButton, CcInput } from 'common_component_library_vue'
import 'common_component_library_vue/src/styles/tokens.css'

// 方式二：全量注册
import CcLibrary from 'common_component_library_vue'
app.use(CcLibrary)
```

## 设计令牌

所有 DESIGN.md token 均映射为 CSS 自定义属性（`src/styles/tokens.css`）：

- **颜色** `--cc-primary / --cc-ink / --cc-brand-dark-900 / --cc-hairline …`
- **排版** 类型层级以工具类提供：`.cc-text-display-xxl … .cc-text-micro-cap`
- **圆角** `--cc-radius-xs / sm / md / lg / xl / pill`
- **间距** `--cc-space-xxs … --cc-space-huge`（8px 基准）
- **阴影** `--cc-shadow-level-1 / level-2`

关键品牌细节（来自 DESIGN.md 的 Do's & Don'ts）：

1. **细字重是品牌**：展示级文字一律 300，配负字距（-1.4px → -0.2px），不要升到 400+。
2. **`ss01` 全局开启**，`tnum` 用在所有金额/数字单元格上。
3. **靛蓝 `{colors.primary}` 只用于 CTA 和链接**，不做正文色。
4. **按钮永远是胶囊**（`{rounded.pill}`），不要用圆角矩形替代；padding 不低于 `8px 16px`。
5. **渐变网格是营销 hero 的标配**，裸白 hero 视为偏离品牌。

## 字体说明

Sohne 是 Klim 的专有字体。按 DESIGN.md 的替代方案，本库使用开源的
[Inter](https://rsms.me/inter/)（Google Fonts 版）在 300 字重 + 负字距下近似品牌节奏，
已通过 `@fontsource/inter` 打包，离线可用。

## 许可与致谢

- DESIGN.md 由 [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)（MIT）从 Stripe 公开站点提取，本库仅作学习与演示。
- 设计令牌来自公开可见的 CSS 值，不主张对 Stripe 视觉识别的所有权。
- 代码部分 MIT。
