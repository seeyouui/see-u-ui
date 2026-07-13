// 主生成器：遍历组件 → 合并 meta.ts + 解析 API → registry.json + 一致性报告
// 运行：node --experimental-strip-types scripts/gen-ai-meta/build-registry.mjs
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { parseProps, parseEmits, parseSlots, readIfExists, collectTypeAliases, inlineAliases } from './parse.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const COMP_DIR = path.join(ROOT, 'uni_modules/see-u-ui/components')
const OUT_DIR = __dirname

const pkg = JSON.parse(readIfExists(path.join(ROOT, 'uni_modules/see-u-ui/package.json')) || '{}')

function toPascal(slug) {
  return slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
}

async function loadMeta(dir) {
  const metaPath = path.join(dir, 'meta.ts')
  if (!fs.existsSync(metaPath)) return null
  try {
    const mod = await import(url.pathToFileURL(metaPath).href)
    return mod.default || null
  } catch (e) {
    return { __error: e.message }
  }
}

async function main() {
  const slugs = fs.readdirSync(COMP_DIR).filter((d) => fs.statSync(path.join(COMP_DIR, d)).isDirectory())
  const components = []
  const report = { missingMeta: [], metaError: [], noProps: [], noVue: [] }

  for (const slug of slugs) {
    const dir = path.join(COMP_DIR, slug)
    const pascal = toPascal(slug) // See-button -> Seebutton? 需 slug 已是 see-xxx
    const vuePath = path.join(dir, slug + '.vue')
    const vueSrc = readIfExists(vuePath)
    const typeSrc = readIfExists(path.join(dir, 'type.ts'))
    if (!vueSrc) report.noVue.push(slug)

    const meta = await loadMeta(dir)
    if (!meta) report.missingMeta.push(slug)
    else if (meta.__error) report.metaError.push({ slug, error: meta.__error })

    const name = (meta && meta.name) || pascal
    const propsIface = name + 'Props'
    let props = parseProps(vueSrc, typeSrc, propsIface, dir)
    // 内联联合字面量别名（type.ts + vue 两处别名合并），提升 AI 对合法取值的识别
    const aliases = { ...collectTypeAliases(typeSrc), ...collectTypeAliases(vueSrc) }
    props = inlineAliases(props, aliases)
    const emits = parseEmits(vueSrc)
    const slots = parseSlots(vueSrc)
    if (props.length === 0) report.noProps.push(slug)

    components.push({
      name,
      tag: (meta && meta.tag) || slug,
      title: (meta && meta.title) || '',
      titleEn: (meta && meta.titleEn) || '',
      category: (meta && meta.category) || '未分类',
      description: (meta && meta.description) || '',
      docUrl: (meta && meta.docUrl) || '',
      props,
      emits,
      slots,
      examples: (meta && meta.examples) || [],
      related: (meta && meta.related) || []
    })
  }

  components.sort((a, b) => a.tag.localeCompare(b.tag))

  const registry = {
    library: 'see-u-ui',
    version: pkg.version || '0.0.0',
    generatedAt: new Date().toISOString(),
    total: components.length,
    withMeta: components.length - report.missingMeta.length,
    components
  }

  fs.writeFileSync(path.join(OUT_DIR, 'registry.json'), JSON.stringify(registry, null, 2))
  fs.writeFileSync(path.join(OUT_DIR, 'report.json'), JSON.stringify(report, null, 2))

  // 单值指标（绕开显示层，便于校验）
  const metrics = [
    'total=' + registry.total,
    'withMeta=' + registry.withMeta,
    'missingMeta=' + report.missingMeta.length,
    'metaError=' + report.metaError.length,
    'noProps=' + report.noProps.length,
    'noVue=' + report.noVue.length
  ].join(' ')
  fs.writeFileSync(path.join(OUT_DIR, 'metrics.txt'), metrics)
}

main()
