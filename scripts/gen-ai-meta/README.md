# AI 元数据生成器

将组件库转化为 AI 友好的结构化产物。**单一数据源，一次维护、多处生成**。

## 数据流

```
组件 type.ts / *.vue (props/emits/slots)  ┐
组件 meta.ts (分组/描述/示例)              ├─► build-registry ─► registry.json (SSOT)
文档 sidebar.ts + index.md (草稿来源)      ┘                          │
                                                    gen-artifacts ─────┤
                                                                       ▼
                                          llms.txt · llms-full.txt · AGENTS.md
                                          .cursorrules · CLAUDE.md
```

## 命令

| 命令                | 作用                                                         |
| ------------------- | ------------------------------------------------------------ |
| `pnpm ai:gen`       | 一键重生成（registry + 全部产物），**日常用这个**            |
| `pnpm ai:registry`  | 仅解析组件 → `registry.json` + `report.json` + `metrics.txt` |
| `pnpm ai:artifacts` | 从 registry 生成 llms.txt / llms-full.txt / AGENTS.md 等     |
| `pnpm ai:drafts`    | 为**缺 meta.ts** 的新组件生成草稿（新增组件时用）            |

## 产物

| 文件                       | 位置                | 面向                          |
| -------------------------- | ------------------- | ----------------------------- |
| `llms.txt`                 | 库根 + `doc/public` | LLM 抓取（精简索引）          |
| `llms-full.txt`            | 库根 + `doc/public` | LLM 抓取（全量 API）          |
| `AGENTS.md`                | 库根                | Cursor / Claude Code 等 Agent |
| `.cursorrules` `CLAUDE.md` | 库根                | 同上（各工具约定文件名）      |

## 维护约定

- **新增组件**：写好 `type.ts`（导出 `SeeXxxProps` 接口）与 `.vue` 后，跑 `pnpm ai:drafts` 生成 `meta.ts` 草稿，再精修 description / examples，最后 `pnpm ai:gen`。
- **meta.ts 只写抽不出来的信息**：分组、一句话描述、典型示例。props/emits/slots 由生成器自动从代码抽取，不要手写。
- **一致性校验**：`report.json` 会列出 `missingMeta`（缺元数据）、`metaError`（语法错误）、`noProps`（未解析到属性）。`noProps` 里的 `see-config`（配置提供者）、`see-icon`（占位）为合理无属性组件。
- 联合字面量类型（如 `type ButtonSize = 'default' | ...`）会自动内联到 registry，AI 可直接看到合法取值。

## 技术说明

- 生成器用 Node 原生解析（`--experimental-strip-types` 直接 import `meta.ts`），零重型依赖。
- `parse.mjs` 支持三种 props 写法：内联 `defineProps<{...}>`、引用本地/vue 内接口 `defineProps<SeeXxxProps>`、以及跟随 `import type` 到父组件 type.ts（子组件如 dropdown-item）。
