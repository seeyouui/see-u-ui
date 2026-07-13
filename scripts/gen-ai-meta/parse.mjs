// 解析器：从 vue(defineProps/defineEmits/slot) 与 type.ts 抽取 API
import fs from 'node:fs'
import path from 'node:path'

/** 提取平衡括号内容：从 startIdx(指向左括号 open) 起，返回内部文本 */
function extractBalanced(text, startIdx, open, close) {
  let depth = 0
  let i = startIdx
  for (; i < text.length; i++) {
    if (text[i] === open) depth++
    else if (text[i] === close) {
      depth--
      if (depth === 0) return { body: text.slice(startIdx + 1, i), end: i }
    }
  }
  return null
}

/** 解析形如 `/** 描述 *\/ name?: type` 的属性行块 */
function parsePropEntries(body) {
  const props = []
  // 按行扫描，累积注释，遇到 `name?: type` 收集
  const lines = body.split('\n')
  let pendingDesc = ''
  for (let raw of lines) {
    const line = raw.trim()
    if (!line) continue
    // 单行块注释 /** xxx */
    const inline = line.match(/^\/\*\*\s*(.*?)\s*\*\/$/)
    if (inline) {
      pendingDesc = inline[1]
      continue
    }
    if (line.startsWith('/**') || line.startsWith('*') || line.startsWith('//') || line.startsWith('*/')) {
      const m = line.replace(/^\/\*\*|^\*\/?|\*\/$/g, '').trim()
      if (m) pendingDesc = m
      continue
    }
    // 属性: name?: type  (type 可能含 | 和 <>，取到行尾的分号/逗号/换行前)
    const pm = line.match(/^([a-zA-Z_$][\w$]*)\s*(\?)?\s*:\s*(.+?)[;,]?$/)
    if (pm) {
      props.push({
        name: pm[1],
        required: !pm[2],
        type: pm[3].replace(/import\(['"]vue['"]\)\./g, '').trim(),
        description: pendingDesc
      })
      pendingDesc = ''
    }
  }
  return props
}

/** 顺着 import type { Iface } from '../xxx/type' 读兄弟组件 type.ts */
function resolveImportedIface(vueSrc, ifaceName, dir) {
  if (!dir) return []
  const impRe = new RegExp(
    'import\\s+type\\s*\\{[^}]*\\b' + ifaceName + '\\b[^}]*\\}\\s*from\\s*[\'"]([^\'"]+)[\'"]'
  )
  const m = vueSrc.match(impRe)
  if (!m) return []
  let rel = m[1]
  if (!/\.(ts|js)$/.test(rel)) rel += '.ts'
  const target = path.resolve(dir, rel)
  const src = readIfExists(target)
  if (!src) return []
  return parseIfaceFromType(src, ifaceName)
}

/**
 * 从 vue 源码解析 props（内联 defineProps<{...}>）或从 type.ts / import 接口解析
 * @param {string} dir 组件目录（用于跟随相对 import）
 */
export function parseProps(vueSrc, typeSrc, propsIfaceName, dir) {
  if (vueSrc) {
    const dp = vueSrc.search(/defineProps\s*</)
    if (dp !== -1) {
      const braceIdx = vueSrc.indexOf('{', dp)
      const angleClose = vueSrc.indexOf('>', dp)
      // 泛型是内联对象 {…}
      if (braceIdx !== -1 && braceIdx < angleClose + 3) {
        const b = extractBalanced(vueSrc, braceIdx, '{', '}')
        if (b) return parsePropEntries(b.body)
      }
      // 泛型引用接口 defineProps<SeeXxxProps>()：type.ts → vue 内部 → 跟随 import
      const refm = vueSrc.slice(dp).match(/defineProps\s*<\s*([A-Za-z_$][\w$]*)\s*>/)
      if (refm) {
        const fromType = typeSrc ? parseIfaceFromType(typeSrc, refm[1]) : []
        if (fromType.length) return fromType
        const fromVue = parseIfaceFromType(vueSrc, refm[1])
        if (fromVue.length) return fromVue
        const fromImport = resolveImportedIface(vueSrc, refm[1], dir)
        if (fromImport.length) return fromImport
      }
    }
  }
  if (typeSrc && propsIfaceName) {
    return parseIfaceFromType(typeSrc, propsIfaceName)
  }
  return []
}

/** 从 type.ts 抽取指定 interface 的属性 */
export function parseIfaceFromType(typeSrc, ifaceName) {
  // 支持泛型 interface Name<T = ...> { 与 type Name = { 两种
  const re = new RegExp('(?:interface|type)\\s+' + ifaceName + '\\s*(?:<[^>]*>)?\\s*=?\\s*\\{')
  const m = typeSrc.search(re)
  if (m === -1) return []
  const braceIdx = typeSrc.indexOf('{', m)
  const b = extractBalanced(typeSrc, braceIdx, '{', '}')
  if (!b) return []
  return parsePropEntries(b.body)
}

/** 解析 emits：vue 的 defineEmits<{...}> 里的 (e: 'name', ...) */
export function parseEmits(vueSrc) {
  if (!vueSrc) return []
  const de = vueSrc.search(/defineEmits\s*</)
  if (de === -1) return []
  const braceIdx = vueSrc.indexOf('{', de)
  const b = extractBalanced(vueSrc, braceIdx, '{', '}')
  if (!b) return []
  const emits = []
  const lines = b.body.split('\n')
  let pendingDesc = ''
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const inline = line.match(/^\/\*\*\s*(.*?)\s*\*\/$/)
    if (inline) { pendingDesc = inline[1]; continue }
    if (line.startsWith('/**') || line.startsWith('*')) {
      const mm = line.replace(/^\/\*\*|^\*\/?|\*\/$/g, '').trim()
      if (mm) pendingDesc = mm
      continue
    }
    const em = line.match(/\(\s*e\s*:\s*['"]([^'"]+)['"]\s*(?:,\s*(.+?))?\)\s*:/)
    if (em) {
      emits.push({ name: em[1], payload: (em[2] || '').trim(), description: pendingDesc })
      pendingDesc = ''
    }
  }
  return emits
}

/** 解析 slot：模板里的 <slot name="xxx"> 与默认 <slot> */
export function parseSlots(vueSrc) {
  if (!vueSrc) return []
  const set = new Set()
  const re = /<slot\b([^>]*)>/g
  let m
  while ((m = re.exec(vueSrc))) {
    const nameAttr = m[1].match(/name\s*=\s*["']([^"']+)["']/)
    set.add(nameAttr ? nameAttr[1] : 'default')
  }
  return [...set]
}

export function readIfExists(p) {
  try { return fs.readFileSync(p, 'utf8') } catch { return '' }
}

/** 收集 type.ts 里的联合字面量别名：`export type Name = 'a' | 'b'` → { Name: "'a' | 'b'" } */
export function collectTypeAliases(typeSrc) {
  const map = {}
  if (!typeSrc) return map
  const re = /(?:export\s+)?type\s+([A-Za-z_$][\w$]*)\s*=\s*([^;{}\n][^;]*?)(?:;|\n)/g
  let m
  while ((m = re.exec(typeSrc))) {
    const val = m[2].trim()
    // 仅内联「联合字面量」类型（含引号或纯字面量联合），避免展开复杂对象/函数类型
    if (/['"]/.test(val) && val.includes('|')) map[m[1]] = val
  }
  return map
}

/** 将 prop 类型里引用的别名替换为其联合字面量 */
export function inlineAliases(props, aliases) {
  return props.map((p) => {
    if (aliases[p.type]) return { ...p, type: aliases[p.type] }
    return p
  })
}
