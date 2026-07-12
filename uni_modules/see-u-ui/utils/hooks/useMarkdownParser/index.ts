/**
 * useMarkdownParser
 * @description 零依赖的轻量 Markdown 解析器，输出安全的 HTML 字符串
 * @platform H5 / App / 各家小程序（纯字符串处理，跨平台无差异）
 *
 * 支持的语法（GFM 子集）：
 *   - 标题：# ~ ######
 *   - 强调：**bold** / __bold__ / *italic* / _italic_ / ~~del~~ / `code`
 *   - 链接：[text](url "title")    自动 linkify 裸 URL（可关闭）
 *   - 图片：![alt](src "title")
 *   - 代码块：``` ```（fenced），支持语言标识 + 自定义 highlight
 *   - 引用：> quote
 *   - 列表：- / * / + 无序，1. 有序，- [ ] / - [x] 任务列表
 *   - 水平线：---  ***  ___
 *   - 表格（GFM）：含对齐
 *   - HTML 实体转义 & 反斜杠转义
 *
 * 安全：
 *   - 普通文本中的 < > & " 全部转义
 *   - 链接/图片 src/href 拒绝 javascript:/vbscript:/data:text/html 协议
 *   - HTML 不直接透传（要透传的话上层再用 see-parse 的 allowedTags 控制）
 *   - highlight 回调输出经 sanitizeHtml 清洗（剥离危险标签与 on* 事件），保留高亮 span
 */

import { sanitizeHtml } from '../useHtmlParser'

// ==================== 类型定义 ====================
export interface MarkdownParserOptions {
  /** 段落内单换行是否转为 <br>（GFM 风格） */
  breaks?: boolean
  /** 是否自动把裸 URL 转为链接 */
  linkify?: boolean
  /** 是否启用 GFM 扩展（表格 / 删除线 / 任务列表） */
  gfm?: boolean
  /** 代码块语法高亮回调；返回的 HTML 会原样嵌入 <code> 内部 */
  highlight?: (code: string, lang: string) => string
}

interface ResolvedOptions {
  breaks: boolean
  linkify: boolean
  gfm: boolean
  highlight?: (code: string, lang: string) => string
}

const DEFAULT_OPTIONS: ResolvedOptions = {
  breaks: false,
  linkify: true,
  gfm: true
}

// ==================== 公共工具 ====================
/** HTML 实体转义 */
function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/** 校验 URL 协议是否安全 */
function isSafeUrl(url: string): boolean {
  if (!url) return false
  const trimmed = String(url).trim().toLowerCase()
  // 仅拦截明确危险的协议；相对路径、锚点、http(s)、mailto、tel 等放行
  if (/^javascript:/i.test(trimmed)) return false
  if (/^vbscript:/i.test(trimmed)) return false
  if (/^data:text\/html/i.test(trimmed)) return false
  return true
}

/** 处理反斜杠转义：把 \X 临时替换为占位符，最后统一还原 */
const ESCAPE_MAP: Record<string, string> = {}
let escapeCounter = 0
function protectBackslashEscapes(src: string): string {
  return src.replace(/\\([\\`*_{}[\]()#+\-.!~>|])/g, (_, ch) => {
    const key = ` ESC${escapeCounter++} `
    ESCAPE_MAP[key] = ch
    return key
  })
}
function restoreBackslashEscapes(src: string): string {
  return src.replace(/ ESC(\d+) /g, (full) => {
    const ch = ESCAPE_MAP[full]
    return ch != null ? escapeHtml(ch) : full
  })
}

// ==================== 内联解析 ====================
/**
 * 行内解析：处理 code/img/link/strong/em/del/autolink/换行
 * 输入应已经过 protectBackslashEscapes 预处理
 *
 * 处理顺序设计（防止 raw HTML 透传）：
 *   1) 把所有需保留为 HTML 的"产物" (code/img/link/autolink/linkify) 占位
 *   2) 对剩余 src 做 smart escape（占位符里不含 <>"& 安全）
 *   3) 做强调替换 ** _ ~~ → <strong>/<em>/<del>
 *   4) 处理换行 → <br>
 *   5) 还原占位符
 */
function parseInline(src: string, opts: ResolvedOptions): string {
  if (!src) return ''

  const stubs: string[] = []
  const stub = (html: string): string => {
    const i = stubs.length
    stubs.push(html)
    return ` STUB${i} `
  }

  // 1. 行内代码 `code`，内容不再解析（且需 escape）
  src = src.replace(/(`+)([\s\S]+?)\1/g, (_, _ticks, code) => stub(`<code>${escapeHtml(code)}</code>`))

  // 2. 图片 ![alt](src "title")，先于普通链接
  src = src.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, url, title) => {
    if (!isSafeUrl(url)) return ''
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
    return stub(`<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}"${titleAttr} />`)
  })

  // 3. 链接 [text](url "title")
  src = src.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, text, url, title) => {
    if (!isSafeUrl(url)) return parseInline(text, opts)
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
    const inner = parseInline(text, opts)
    return stub(`<a href="${escapeHtml(url)}"${titleAttr}>${inner}</a>`)
  })

  // 4. 自动链接 <https://...>（需在 smart escape 之前）
  src = src.replace(/<((?:https?|mailto|tel):[^>\s]+)>/gi, (_, url) => {
    if (!isSafeUrl(url)) return ''
    return stub(`<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`)
  })

  // 5. linkify 裸 URL（http/https）
  if (opts.linkify) {
    src = src.replace(/(^|[^"'>=\]\w])(https?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]])/g, (_, prefix, url) => {
      if (!isSafeUrl(url)) return `${prefix}${url}`
      return `${prefix}${stub(`<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`)}`
    })
  }

  // 6. smart escape: 普通文本里的 < > & " 转义为实体（占位符里没有这些字符，安全）
  src = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  // 7. 粗体+斜体 ***x*** / ___x___
  src = src.replace(/\*\*\*([^*\n]+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  src = src.replace(/___([^_\n]+?)___/g, '<strong><em>$1</em></strong>')

  // 8. 粗体 **x** / __x__
  src = src.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
  src = src.replace(/__([^_\n]+?)__/g, '<strong>$1</strong>')

  // 9. 斜体 *x* / _x_
  src = src.replace(/(^|[^*\w])\*([^*\s][^*\n]*?[^*\s]|[^*\s])\*(?!\w)/g, '$1<em>$2</em>')
  src = src.replace(/(^|[^_\w])_([^_\s][^_\n]*?[^_\s]|[^_\s])_(?!\w)/g, '$1<em>$2</em>')

  // 10. 删除线 ~~x~~（GFM）
  if (opts.gfm) {
    src = src.replace(/~~([^~\n]+?)~~/g, '<del>$1</del>')
  }

  // 11. 硬换行（行末两空格 或 \）
  src = src.replace(/(  +|\\)\n/g, '<br/>\n')

  // 12. breaks：段内单换行 → <br>
  if (opts.breaks) {
    src = src.replace(/\n(?!$)/g, '<br/>\n')
  }

  // 13. 还原占位
  src = src.replace(/ STUB(\d+) /g, (_, i) => stubs[+i] || '')

  return src
}

// ==================== 块级解析 ====================
/** 表格行 split：处理转义的 \| */
function splitTableRow(row: string): string[] {
  const cleaned = row.replace(/^\s*\|/, '').replace(/\|\s*$/, '')
  // 用占位符避开 \|
  const parts = cleaned.replace(/\\\|/g, ' PIPE ').split('|')
  return parts.map((c) => c.trim().replace(/ PIPE /g, '|'))
}

/** 解析对齐说明行：返回 ('left'|'center'|'right'|null)[] */
function parseAlignRow(row: string): (string | null)[] {
  const cells = splitTableRow(row)
  return cells.map((c) => {
    const t = c.trim()
    if (!/^:?-+:?$/.test(t)) return null
    const left = t.startsWith(':')
    const right = t.endsWith(':')
    if (left && right) return 'center'
    if (right) return 'right'
    if (left) return 'left'
    return null
  })
}

/** 渲染单元格（带对齐属性） */
function renderCell(tag: 'th' | 'td', content: string, align: string | null, opts: ResolvedOptions): string {
  const inner = parseInline(content, opts)
  if (!align) return `<${tag}>${inner}</${tag}>`
  return `<${tag} align="${align}" style="text-align: ${align}">${inner}</${tag}>`
}

/** 检查一行是否为表格分割线 */
function isTableSepLine(line: string): boolean {
  if (!line || !line.includes('|')) return false
  const cells = splitTableRow(line)
  if (cells.length === 0) return false
  return cells.every((c) => /^:?-+:?$/.test(c.trim()))
}

/** 单层列表项渲染（支持任务列表） */
function renderListItem(content: string, opts: ResolvedOptions): string {
  // 任务列表 [ ] / [x]
  if (opts.gfm) {
    const taskMatch = content.match(/^\[( |x|X)\]\s+([\s\S]*)$/)
    if (taskMatch) {
      const checked = taskMatch[1].toLowerCase() === 'x'
      const inner = parseInline(taskMatch[2], opts)
      return `<li><input type="checkbox" disabled${checked ? ' checked' : ''}/> ${inner}</li>`
    }
  }
  return `<li>${parseInline(content, opts)}</li>`
}

/**
 * 主入口：把 Markdown 文本转换为 HTML 字符串
 */
export function markdownToHtml(input: string, options: MarkdownParserOptions = {}): string {
  if (typeof input !== 'string' || !input.trim()) return ''
  const opts: ResolvedOptions = { ...DEFAULT_OPTIONS, ...options }

  // 1. 反斜杠转义保护
  let src = protectBackslashEscapes(input)
  // 统一换行
  src = src.replace(/\r\n?/g, '\n')

  const lines = src.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 空行：跳过
    if (!line.trim()) {
      i++
      continue
    }

    // 围栏代码块 ``` / ~~~
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})\s*([\w+-]*)\s*$/)
    if (fenceMatch) {
      const fence = fenceMatch[2][0] // ` 或 ~
      const fenceLen = fenceMatch[2].length
      const lang = fenceMatch[3] || ''
      const codeLines: string[] = []
      i++
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)(`{3,}|~{3,})\s*$/)
        if (m && m[2][0] === fence && m[2].length >= fenceLen) {
          i++
          break
        }
        codeLines.push(lines[i])
        i++
      }
      const codeText = codeLines.join('\n') + (codeLines.length ? '\n' : '')
      let codeBody: string
      if (opts.highlight) {
        try {
          // highlight 返回的 HTML 会原样嵌入 <code>，先经 sanitizeHtml 清洗防 XSS
          codeBody = sanitizeHtml(opts.highlight(codeText, lang))
        } catch {
          codeBody = escapeHtml(codeText)
        }
      } else {
        codeBody = escapeHtml(codeText)
      }
      const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : ''
      out.push(`<pre><code${langClass}>${codeBody}</code></pre>`)
      continue
    }

    // 标题 # （# 后必须有空格）
    const hMatch = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (hMatch) {
      const level = hMatch[1].length
      out.push(`<h${level}>${parseInline(hMatch[2], opts)}</h${level}>`)
      i++
      continue
    }

    // 水平线 --- / *** / ___
    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      out.push('<hr/>')
      i++
      continue
    }

    // 引用 >  连续 > 行合并
    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      const inner = markdownToHtml(quoteLines.join('\n'), options)
      out.push(`<blockquote>${inner}</blockquote>`)
      continue
    }

    // 表格（GFM） 至少两行：表头 + 分隔
    if (opts.gfm && line.includes('|') && i + 1 < lines.length && isTableSepLine(lines[i + 1])) {
      const headerCells = splitTableRow(line)
      const aligns = parseAlignRow(lines[i + 1])
      i += 2
      const bodyRows: string[][] = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        bodyRows.push(splitTableRow(lines[i]))
        i++
      }
      const thead = `<thead><tr>${headerCells.map((c, idx) => renderCell('th', c, aligns[idx] || null, opts)).join('')}</tr></thead>`
      const tbody = bodyRows.length
        ? `<tbody>${bodyRows
            .map((row) => `<tr>${row.map((c, idx) => renderCell('td', c, aligns[idx] || null, opts)).join('')}</tr>`)
            .join('')}</tbody>`
        : ''
      out.push(`<table>${thead}${tbody}</table>`)
      continue
    }

    // 列表（无序 / 有序）
    const ulMatch = line.match(/^(\s*)([-*+])\s+(.+)$/)
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/)
    if (ulMatch || olMatch) {
      const isOrdered = !!olMatch
      const tag = isOrdered ? 'ol' : 'ul'
      const items: string[] = []
      const re = isOrdered ? /^(\s*)(\d+)\.\s+(.+)$/ : /^(\s*)([-*+])\s+(.+)$/
      const baseIndent = (isOrdered ? olMatch![1] : ulMatch![1]).length

      while (i < lines.length) {
        const cur = lines[i]
        const m = cur.match(re)
        if (m && m[1].length === baseIndent) {
          // 收集当前项的所有续行（缩进至少 baseIndent + 2）
          const itemLines: string[] = [m[3]]
          i++
          while (i < lines.length) {
            const next = lines[i]
            if (!next.trim()) break
            if (re.test(next) && (next.match(/^\s*/)?.[0].length ?? 0) === baseIndent) break
            if ((next.match(/^\s*/)?.[0].length ?? 0) > baseIndent) {
              itemLines.push(next.replace(new RegExp(`^\\s{0,${baseIndent + 2}}`), ''))
              i++
              continue
            }
            break
          }
          items.push(renderListItem(itemLines.join('\n'), opts))
        } else {
          break
        }
      }
      out.push(`<${tag}>${items.join('')}</${tag}>`)
      continue
    }

    // 段落：累积非空行直到空行/特殊块
    const para: string[] = [line]
    i++
    while (i < lines.length) {
      const next = lines[i]
      if (!next.trim()) break
      if (/^#{1,6}\s+/.test(next)) break
      if (/^(\s*)(`{3,}|~{3,})/.test(next)) break
      if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(next)) break
      if (/^\s*>\s?/.test(next)) break
      if (/^(\s*)([-*+])\s+/.test(next)) break
      if (/^(\s*)(\d+)\.\s+/.test(next)) break
      para.push(next)
      i++
    }
    const paraText = para.join('\n')
    out.push(`<p>${parseInline(paraText, opts)}</p>`)
  }

  // 还原反斜杠转义
  return restoreBackslashEscapes(out.join('\n'))
}

// ==================== 辅助导出 ====================
/** 剥离 Markdown 标记，返回近似纯文本 */
export function stripMarkdown(input: string): string {
  if (typeof input !== 'string' || !input) return ''
  let s = input
  // 移除围栏代码块：保留代码体
  s = s.replace(/```[^\n]*\n([\s\S]*?)```/g, '$1')
  s = s.replace(/~~~[^\n]*\n([\s\S]*?)~~~/g, '$1')
  // 图片整体丢弃
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  // 链接保留文本
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  // 标题/引用/列表前缀
  s = s.replace(/^\s{0,3}#{1,6}\s+/gm, '')
  s = s.replace(/^\s*>\s?/gm, '')
  s = s.replace(/^\s*[-*+]\s+/gm, '')
  s = s.replace(/^\s*\d+\.\s+/gm, '')
  // 任务列表
  s = s.replace(/\[( |x|X)\]\s*/g, '')
  // 强调 / 代码标记
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1')
  s = s.replace(/__([^_]+)__/g, '$1')
  s = s.replace(/\*([^*]+)\*/g, '$1')
  s = s.replace(/_([^_]+)_/g, '$1')
  s = s.replace(/~~([^~]+)~~/g, '$1')
  s = s.replace(/`([^`]+)`/g, '$1')
  // 水平线
  s = s.replace(/^\s*([-*_])(?:\s*\1){2,}\s*$/gm, '')
  return s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
    .trim()
}

/** 提取 Markdown 中所有图片的 src（忽略代码块内的语法） */
export function extractMarkdownImages(input: string): string[] {
  if (typeof input !== 'string' || !input) return []
  // 先移除代码块
  const cleaned = input.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '')
  const urls: string[] = []
  const re = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(cleaned)) !== null) {
    if (isSafeUrl(m[1])) urls.push(m[1])
  }
  return urls
}
