// 为缺 meta.ts 的组件生成草稿：sidebar 抽分组/标题 + 文档抽描述/示例
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { extractSidebarMap } from './extract-sidebar.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const COMP_DIR = path.join(ROOT, 'uni_modules/see-u-ui/components')
const DOC_DIR = 'E:/000seeuui/see-u-ui-doc/docs/components'

// 子组件 -> 父组件（继承分组与文档）
const PARENT = {
  'checkbox-group': 'checkbox',
  'radio-group': 'radio',
  'form-item': 'form',
  'dropdown-item': 'dropdown',
  'dropdown-panel': 'dropdown',
  'tab-pane': 'tabs',
  'layout-item': 'layout',
  'grid-item': 'grid',
  'collapse-item': 'collapse'
}

// 未在 sidebar 的组件手动兜底分组
const FALLBACK_CAT = {
  config: '基础组件',
  badge: '基础组件',
  'navbar-mini': '导航组件'
}

function pascal(slug) {
  return slug.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('')
}

function readDoc(short) {
  const p = path.join(DOC_DIR, short, 'index.md')
  try { return fs.readFileSync(p, 'utf8') } catch { return '' }
}

function extractDesc(docSrc, fallback) {
  const fm = docSrc.match(/^---([\s\S]*?)---/)
  if (fm) {
    const d = fm[1].match(/description:\s*(.+)/)
    if (d) return d[1].trim().replace(/^["']|["']$/g, '')
  }
  return fallback
}

function extractFirstExample(docSrc) {
  // 遍历所有 html/vue 代码块，取第一个「以标签开头（非 <script）」的模板块
  const re = /```(?:html|vue)[^\n]*\n([\s\S]*?)```/g
  let m
  while ((m = re.exec(docSrc))) {
    let code = m[1].trim()
    // 去掉 <script> 段，只保留模板首段
    code = code.split(/\n<script/)[0].trim()
    if (!code || code.startsWith('<script')) continue
    // 只保留以组件/标签开头的示例
    if (!code.startsWith('<')) continue
    return code.split('\n').slice(0, 6).join('\n')
  }
  return ''
}

// 用 JSON.stringify 生成安全的 JS 字符串字面量（含所有转义）
function lit(s) {
  return JSON.stringify(String(s))
}

function main() {
  const sb = extractSidebarMap()
  const slugs = fs.readdirSync(COMP_DIR).filter((d) => fs.statSync(path.join(COMP_DIR, d)).isDirectory())
  let created = 0
  const skipped = []
  const noCat = []

  for (const slug of slugs) {
    const dir = path.join(COMP_DIR, slug)
    const metaPath = path.join(dir, 'meta.ts')
    if (fs.existsSync(metaPath)) { skipped.push(slug); continue }

    const short = slug.replace(/^see-/, '')
    let sbInfo = sb[short]
    let docShort = short
    // 子组件继承父
    if (!sbInfo && PARENT[short]) {
      sbInfo = sb[PARENT[short]]
      docShort = PARENT[short]
    }
    const category = (sbInfo && sbInfo.category) || FALLBACK_CAT[short] || '未分类'
    if (category === '未分类') noCat.push(slug)
    const titleEn = (sbInfo && sbInfo.en) || pascal(short).replace(/^See/, '')
    const title = (sbInfo && sbInfo.zh) || short

    const docSrc = readDoc(docShort)
    const description = extractDesc(docSrc, `${title}组件`)
    const example = extractFirstExample(docSrc) || `<${slug} />`

    const name = pascal(slug)
    const content = `import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** ${name} AI 元数据（草稿：分组/标题来自文档 sidebar，描述/示例来自文档，建议人工精修） */
const meta: ComponentMeta = {
  name: ${lit(name)},
  tag: ${lit(slug)},
  title: ${lit(title)},
  titleEn: ${lit(titleEn)},
  category: ${lit(category)},
  description: ${lit(description)},
  docUrl: ${lit('/components/' + docShort + '/')},
  examples: [
    {
      title: '基本使用',
      code: ${lit(example)}
    }
  ]
}

export default meta
`
    fs.writeFileSync(metaPath, content)
    created++
  }

  fs.writeFileSync(path.join(__dirname, '_draftmetrics.txt'),
    `created=${created} skipped=${skipped.length} noCat=${noCat.length} noCatList=${noCat.join(',')}`)
}

main()
