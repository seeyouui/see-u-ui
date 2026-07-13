// 从 registry.json 生成 AI 产物：llms.txt / llms-full.txt / AGENTS.md
// 运行：node scripts/gen-ai-meta/gen-artifacts.mjs
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const DOC_PUBLIC = 'E:/000seeuui/see-u-ui-doc/docs/public'
const SITE = 'https://www.seeuui.cn'

const reg = JSON.parse(fs.readFileSync(path.join(__dirname, 'registry.json'), 'utf8'))

// 按分组归类
const byCat = {}
for (const c of reg.components) {
  ;(byCat[c.category] ||= []).push(c)
}
const CAT_ORDER = ['基础组件', '表单组件', '布局组件', '数据组件', '反馈组件', '导航组件', '内容解析', '业务组件', '未分类']
const cats = CAT_ORDER.filter((c) => byCat[c])

/* ---------------- llms.txt（精简索引） ---------------- */
function genLlmsTxt() {
  const L = []
  L.push('# SeeYouUI (see-u-ui)')
  L.push('')
  L.push('> 一个基于 uni-app + Vue3 + TypeScript 的跨端组件库，支持 H5、小程序、App。组件标签以 `see-` 为前缀。')
  L.push('')
  L.push('版本: ' + reg.version + ' | 组件数: ' + reg.total)
  L.push('')
  L.push('## 使用约定')
  L.push('- 组件标签前缀 `see-`，如 `<see-button>`；PascalCase 组件名如 `SeeButton`。')
  L.push('- 事件模板绑定统一 kebab-case：内部 emit `onChange` 对应模板 `@on-change`（个别如 button 为 `@click`）。布尔属性用 `is` 前缀（如 `isDisabled`）。')
  L.push('- 全局注册：`app.use(SeeYouUI)`；按需引入：`import { SeeButton } from "see-u-ui"`。')
  L.push('')
  for (const cat of cats) {
    L.push('## ' + cat)
    for (const c of byCat[cat]) {
      const zh = c.title ? ' ' + c.title : ''
      const link = c.docUrl ? ' [文档](' + SITE + c.docUrl + ')' : ''
      L.push('- `<' + c.tag + '>` ' + (c.titleEn || '') + zh + '：' + c.description + link)
    }
    L.push('')
  }
  return L.join('\n')
}

/* ---------------- llms-full.txt（全量 API） ---------------- */
function genLlmsFull() {
  const L = []
  L.push('# SeeYouUI 完整组件 API (see-u-ui v' + reg.version + ')')
  L.push('')
  L.push('基于 uni-app + Vue3 + TypeScript 的跨端组件库。以下为全部 ' + reg.total + ' 个组件的属性、事件、插槽与示例。')
  L.push('')
  for (const cat of cats) {
    L.push('## ' + cat)
    L.push('')
    for (const c of byCat[cat]) {
      L.push('### ' + (c.titleEn || c.name) + (c.title ? ' ' + c.title : '') + ' `<' + c.tag + '>`')
      L.push('')
      if (c.description) L.push(c.description)
      if (c.docUrl) L.push('文档: ' + SITE + c.docUrl)
      L.push('')
      if (c.props.length) {
        L.push('**Props**')
        L.push('')
        L.push('| 属性 | 类型 | 必填 | 说明 |')
        L.push('| --- | --- | --- | --- |')
        for (const p of c.props) {
          L.push('| ' + p.name + ' | `' + p.type.replace(/\|/g, '\\|') + '` | ' + (p.required ? '是' : '否') + ' | ' + (p.description || '') + ' |')
        }
        L.push('')
      }
      if (c.emits.length) {
        L.push('**Events**')
        L.push('')
        L.push('| 事件 | 参数 | 说明 |')
        L.push('| --- | --- | --- |')
        for (const e of c.emits) {
          L.push('| ' + e.name + ' | `' + (e.payload || '-').replace(/\|/g, '\\|') + '` | ' + (e.description || '') + ' |')
        }
        L.push('')
      }
      if (c.slots.length) {
        L.push('**Slots**: ' + c.slots.map((s) => '`' + s + '`').join(', '))
        L.push('')
      }
      if (c.examples.length) {
        L.push('**示例**')
        L.push('')
        for (const ex of c.examples) {
          L.push('```html')
          L.push(ex.code)
          L.push('```')
        }
        L.push('')
      }
    }
  }
  return L.join('\n')
}

/* ---------------- AGENTS.md（Agent 规则） ---------------- */
function genAgents() {
  const L = []
  L.push('# SeeYouUI 组件库 · AI 协作规则')
  L.push('')
  L.push('本项目使用 **SeeYouUI (see-u-ui)** —— 基于 uni-app + Vue3 + TypeScript 的跨端组件库。生成代码时请遵循以下约定。')
  L.push('')
  L.push('## 核心约定')
  L.push('')
  L.push('- **标签前缀**：所有组件以 `see-` 开头，如 `<see-button>`、`<see-input>`。')
  L.push('- **组件名**：PascalCase，如 `SeeButton`、`SeeInput`。')
  L.push('- **布尔属性**：以 `is` 前缀命名，如 `isDisabled`、`isReadonly`、`isClearable`、`isHollow`。')
  L.push('- **事件**：模板绑定名统一 kebab-case，内部 emit `onXxx` 对应模板 `@on-xxx`，如 `<see-input @on-change="fn" />`；个别原生语义事件保持原名，如 `<see-button @click="fn" />`。')
  L.push('- **双向绑定**：表单类组件支持 `v-model`，如 `<see-input v-model="value" />`。')
  L.push('')
  L.push('## 引入方式')
  L.push('')
  L.push('```ts')
  L.push('// 全局注册（main.ts）')
  L.push('import SeeYouUI from "see-u-ui"')
  L.push('app.use(SeeYouUI)')
  L.push('')
  L.push('// 或按需引入')
  L.push('import { SeeButton, SeeInput } from "see-u-ui"')
  L.push('```')
  L.push('')
  L.push('> uni_modules 用户：组件已自动全局注册，模板直接用 `<see-xxx>` 即可，无需手动 import。')
  L.push('')
  L.push('## 组件清单（' + reg.total + ' 个）')
  L.push('')
  for (const cat of cats) {
    L.push('### ' + cat)
    for (const c of byCat[cat]) {
      const ex = c.examples[0] ? '  例：`' + c.examples[0].code.split('\n')[0] + '`' : ''
      L.push('- `<' + c.tag + '>` — ' + c.description + ex)
    }
    L.push('')
  }
  L.push('## 完整 API')
  L.push('')
  L.push('每个组件的完整 props / events / slots 见 `llms-full.txt` 或官方文档 ' + SITE + '。')
  L.push('')
  return L.join('\n')
}

function writeOut(file, content, dirs) {
  for (const d of dirs) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
    fs.writeFileSync(path.join(d, file), content)
  }
}

const llms = genLlmsTxt()
const full = genLlmsFull()
const agents = genAgents()

// llms.txt / llms-full.txt → 文档站 public（对外抓取）+ 库根（本地参考）
writeOut('llms.txt', llms, [DOC_PUBLIC, ROOT])
writeOut('llms-full.txt', full, [DOC_PUBLIC, ROOT])
// AGENTS.md + 复制为 .cursorrules / CLAUDE.md → 库根
writeOut('AGENTS.md', agents, [ROOT])
fs.writeFileSync(path.join(ROOT, '.cursorrules'), agents)
fs.writeFileSync(path.join(ROOT, 'CLAUDE.md'), agents)

fs.writeFileSync(path.join(__dirname, '_artifacts.txt'),
  'llms=' + llms.length + ' full=' + full.length + ' agents=' + agents.length + ' cats=' + cats.length)
