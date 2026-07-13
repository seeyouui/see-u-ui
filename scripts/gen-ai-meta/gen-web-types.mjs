// 从 registry.json 生成 JetBrains web-types.json（IDE 自动补全）
// 运行：node scripts/gen-ai-meta/gen-web-types.mjs
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const PKG_DIR = path.join(ROOT, 'uni_modules/see-u-ui')
// npm 发布根的 src/（= uni_modules 镜像，files:["src"] 会带上发布）；仅在存在时写入
const NPM_SRC = 'E:/000seeuui/see-u-ui-npm/src'
const SITE = 'https://www.seeuui.cn'

const reg = JSON.parse(fs.readFileSync(path.join(__dirname, 'registry.json'), 'utf8'))

// onXxx -> on-xxx（整体驼峰转 kebab，保留 on 前缀，对齐模板绑定 @on-xxx）
function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// 从 description 中拆出 @default 值与真实说明
function splitDefault(desc) {
  if (!desc) return { def: undefined, text: '' }
  const m = desc.match(/@default\s+(\S+)/)
  const def = m ? m[1] : undefined
  const text = desc.replace(/@default\s+\S+/, '').trim()
  return { def, text }
}

function mapProp(p) {
  const { def, text } = splitDefault(p.description)
  const attr = {
    name: p.name,
    value: { kind: 'expression', type: p.type }
  }
  if (text) attr.description = text
  if (def !== undefined) attr.default = def
  if (p.required) attr.required = true
  return attr
}

function mapTag(c) {
  const tag = {
    name: c.tag,
    description: c.description || c.title || c.name,
    'doc-url': c.docUrl ? SITE + c.docUrl : SITE,
    attributes: c.props.map(mapProp),
    events: c.emits.map((e) => {
      const ev = { name: toKebab(e.name) }
      if (e.description) ev.description = e.description
      return ev
    }),
    slots: c.slots.map((s) => ({ name: s }))
  }
  return tag
}

const webTypes = {
  $schema: 'https://json.schemastore.org/web-types',
  name: reg.library,
  version: reg.version,
  'js-types-syntax': 'typescript',
  'description-markup': 'markdown',
  framework: 'vue',
  'framework-config': {
    'enable-when': {
      'node-packages': [reg.library]
    }
  },
  contributions: {
    html: {
      tags: reg.components.map(mapTag)
    }
  }
}

const json = JSON.stringify(webTypes, null, 2) + '\n'

// 目标1：uni_modules 包（HBuilderX 场景 + src 镜像源）
const out = path.join(PKG_DIR, 'web-types.json')
fs.writeFileSync(out, json)
// 目标2：npm 发布根 src/（IDE 补全实际触达路径，发布根 package.json 注册 ./src/web-types.json）
const written = [out]
if (fs.existsSync(NPM_SRC)) {
  const npmOut = path.join(NPM_SRC, 'web-types.json')
  fs.writeFileSync(npmOut, json)
  written.push(npmOut)
}

// 单值指标取证
const tags = webTypes.contributions.html.tags
const attrTotal = tags.reduce((n, t) => n + t.attributes.length, 0)
const evTotal = tags.reduce((n, t) => n + t.events.length, 0)
const slotTotal = tags.reduce((n, t) => n + t.slots.length, 0)
fs.writeFileSync(
  path.join(__dirname, '_web-types.txt'),
  'tags=' + tags.length + ' attrs=' + attrTotal + ' events=' + evTotal + ' slots=' + slotTotal + ' bytes=' + fs.statSync(out).size + ' targets=' + written.length
)
