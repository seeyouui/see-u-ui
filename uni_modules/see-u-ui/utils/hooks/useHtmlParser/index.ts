/**
 * useHtmlParser
 * @description 跨平台 HTML 富文本解析器，输出兼容 uni-app <rich-text> nodes 结构。
 * @platform H5 / App / 各家小程序
 *
 * 核心能力：
 * 1. 词法 + 语法分析，输出 nodes 数组（type: 'text' | 'node'）
 * 2. 安全过滤：移除 <script>/<style>，剥离 on* 事件属性，拦截 javascript: 协议
 * 3. HTML 实体解码（命名实体 + 数字实体）
 * 4. tagStyle 注入：可对指定标签注入额外内联样式（与原 style 合并）
 * 5. 容错：未闭合标签自动闭合、错位的关闭标签自动忽略
 */

// ==================== 类型定义 ====================
export interface ParseNodeAttrs {
  [key: string]: string | undefined
}

export interface ParseTextNode {
  type: 'text'
  text: string
}

export interface ParseElementNode {
  type: 'node'
  name: string
  attrs: ParseNodeAttrs
  children: ParseNode[]
}

export type ParseNode = ParseTextNode | ParseElementNode

export interface UseHtmlParserOptions {
  /** 标签级样式注入：{ p: 'color: red', img: 'max-width: 100%' } */
  tagStyle?: Record<string, string>
  /** 自定义允许的标签列表；不传则使用内置白名单（推荐） */
  allowedTags?: string[]
  /** 自定义允许的属性列表；不传则使用内置白名单 */
  allowedAttrs?: string[]
}

// ==================== 常量配置 ====================
/** 自闭合标签（不需要 closing tag） */
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])

/** 永远过滤的危险标签（连同其内容一起丢弃） */
const DANGEROUS_TAGS = new Set(['script', 'style', 'iframe', 'frame', 'object', 'embed', 'link', 'meta', 'base'])

/** 默认允许的标签白名单（rich-text 支持的常用 inline + block 标签） */
const DEFAULT_ALLOWED_TAGS = new Set([
  // block
  'div',
  'p',
  'section',
  'article',
  'header',
  'footer',
  'main',
  'nav',
  'aside',
  'blockquote',
  'pre',
  'hr',
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'caption',
  'colgroup',
  'col',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  // inline
  'span',
  'a',
  'b',
  'strong',
  'i',
  'em',
  'u',
  'del',
  's',
  'mark',
  'small',
  'sub',
  'sup',
  'code',
  'kbd',
  'samp',
  'var',
  'cite',
  'q',
  'time',
  'abbr',
  'br',
  // media
  'img',
  'video',
  'audio',
  'source',
  // form (rich-text 不渲染，但保留结构)
  'label',
  'fieldset',
  'legend'
])

/** 默认允许的属性白名单 */
const DEFAULT_ALLOWED_ATTRS = new Set([
  'id',
  'class',
  'style',
  'src',
  'href',
  'alt',
  'title',
  'name',
  'width',
  'height',
  'cellspacing',
  'cellpadding',
  'border',
  'align',
  'valign',
  'colspan',
  'rowspan',
  'target',
  'rel',
  'data-src',
  'data-id',
  'data-name',
  'type',
  'controls',
  'poster',
  'loop',
  'autoplay',
  'muted',
  'preload'
])

/** 命名 HTML 实体表（覆盖最常见的） */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  copy: '©',
  reg: '®',
  trade: '™',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  middot: '·',
  bull: '•',
  laquo: '«',
  raquo: '»'
}

/** 安全的链接协议前缀（小写） */
const SAFE_URL_PROTOCOLS = /^(https?:|mailto:|tel:|sms:|ftp:|\/|\.|#)/i

// ==================== 工具函数 ====================
/**
 * HTML 实体解码
 */
export function decodeEntities(input: string): string {
  if (!input) return ''
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (full, code: string) => {
    if (code[0] === '#') {
      const num = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      if (!Number.isFinite(num)) return full
      try {
        return String.fromCodePoint(num)
      } catch {
        return full
      }
    }
    return NAMED_ENTITIES[code] ?? full
  })
}

/**
 * 字符串级安全过滤：移除危险标签和事件属性
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return ''
  let s = input
  // 移除 <script>...</script> / <style>...</style> / <iframe>...</iframe> 整块
  s = s.replace(/<(script|style|iframe|frame|object)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  // 移除自闭合危险标签
  s = s.replace(/<(script|style|iframe|frame|object|embed|link|meta|base)\b[^>]*\/?>/gi, '')
  // 移除 HTML 注释
  s = s.replace(/<!--[\s\S]*?-->/g, '')
  // 移除标签内的 on* 事件属性（容忍单/双引号、无引号）
  // 前置分隔符放宽为「空白 或 /」，防止 <img/onerror=alert(1) src=x> 这类用 / 分隔的绕过
  s = s.replace(/[\s/]+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  return s
}

/**
 * 从字符串提取所有 <img src="..."> 的 src
 */
export function extractImgSrc(input: string): string[] {
  if (!input || typeof input !== 'string') return []
  const out: string[] = []
  const re = /<img\b[^>]*?\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(input))) {
    const src = m[1] || m[2] || m[3] || ''
    if (src) out.push(src)
  }
  return out
}

/**
 * 剥离所有 HTML 标签，返回纯文本（自动解码实体）
 */
export function stripHtml(input: string): string {
  if (!input || typeof input !== 'string') return ''
  const noTags = sanitizeHtml(input).replace(/<[^>]+>/g, '')
  return decodeEntities(noTags).replace(/\s+/g, ' ').trim()
}

/**
 * 判断 href 是否安全（拦截 javascript: 等危险协议）
 */
function isSafeUrl(url: string): boolean {
  if (!url) return false
  const trimmed = url.trim().toLowerCase()
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:text/html') || trimmed.startsWith('vbscript:')) {
    return false
  }
  // 允许相对路径、http(s)、mailto 等；其它未知协议放行（避免误伤）
  if (SAFE_URL_PROTOCOLS.test(trimmed)) return true
  // 无协议（如 "www.x.com"）也放行
  if (!/^[a-z][a-z0-9+\-.]*:/i.test(trimmed)) return true
  return false
}

// ==================== 属性解析 ====================
/** 解析单个标签内部的属性字符串 */
function parseAttrs(attrStr: string, allowedAttrs: Set<string>): ParseNodeAttrs {
  const attrs: ParseNodeAttrs = {}
  if (!attrStr) return attrs
  const re = /([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(attrStr))) {
    const rawName = m[1]
    const name = rawName.toLowerCase()
    // 过滤 on* 事件属性（双保险，sanitizeHtml 应已移除）
    if (name.startsWith('on')) continue
    if (!allowedAttrs.has(name)) continue
    const value = m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : m[5] !== undefined ? m[5] : ''
    const decoded = decodeEntities(value)
    // href/src 协议校验
    if ((name === 'href' || name === 'src') && decoded && !isSafeUrl(decoded)) {
      attrs[name] = ''
      continue
    }
    attrs[name] = decoded
  }
  return attrs
}

// ==================== 主 parser ====================
/**
 * 解析 HTML 字符串为 rich-text 兼容的 nodes 树。
 * 不依赖 DOM，纯 JS 实现，所有平台可用。
 */
export function parseHtml(html: string, options: UseHtmlParserOptions = {}): ParseNode[] {
  if (!html || typeof html !== 'string') return []
  const trimmed = html.trim()
  if (!trimmed) return []

  const allowedTags = options.allowedTags ? new Set(options.allowedTags.map((t) => t.toLowerCase())) : DEFAULT_ALLOWED_TAGS
  const allowedAttrs = options.allowedAttrs ? new Set(options.allowedAttrs.map((a) => a.toLowerCase())) : DEFAULT_ALLOWED_ATTRS
  const tagStyle = options.tagStyle || {}

  // 先做字符串级安全过滤
  const safe = sanitizeHtml(html)

  // 解析栈：栈顶始终是当前正在填充 children 的元素
  const root: ParseElementNode = { type: 'node', name: '#root', attrs: {}, children: [] }
  const stack: ParseElementNode[] = [root]
  const peek = () => stack[stack.length - 1]

  const TAG_RE = /<(\/)?([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*?)(\/?)>/g
  let cursor = 0
  let m: RegExpExecArray | null

  const pushText = (raw: string) => {
    if (!raw) return
    const decoded = decodeEntities(raw)
    if (!decoded) return
    peek().children.push({ type: 'text', text: decoded })
  }

  const injectTagStyle = (tagName: string, attrs: ParseNodeAttrs): ParseNodeAttrs => {
    const extra = tagStyle[tagName]
    if (!extra) return attrs
    const existing = attrs.style ? String(attrs.style).trim() : ''
    const merged = existing ? `${existing}${existing.endsWith(';') ? '' : ';'} ${extra}` : extra
    return { ...attrs, style: merged }
  }

  while ((m = TAG_RE.exec(safe))) {
    // 处理标签前的文本片段
    if (m.index > cursor) {
      pushText(safe.slice(cursor, m.index))
    }
    cursor = TAG_RE.lastIndex

    const isClosing = !!m[1]
    const tagName = m[2].toLowerCase()
    const attrStr = m[3] || ''
    const selfClosingMark = !!m[4]

    // 危险标签彻底丢弃
    if (DANGEROUS_TAGS.has(tagName)) continue

    if (isClosing) {
      // 寻找栈中最近的同名开始标签，闭合到那一层
      let idx = -1
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].name === tagName) {
          idx = i
          break
        }
      }
      if (idx > 0) {
        // 强制弹出到该层
        stack.length = idx
      }
      // 找不到则忽略（错位的关闭标签）
      continue
    }

    // 开始标签
    if (!allowedTags.has(tagName)) {
      // 未在白名单的标签：跳过开标签但保留其内容（透传子节点）
      // 注：自闭合的未知标签直接忽略
      continue
    }

    let attrs = parseAttrs(attrStr, allowedAttrs)
    attrs = injectTagStyle(tagName, attrs)

    const node: ParseElementNode = {
      type: 'node',
      name: tagName,
      attrs,
      children: []
    }
    peek().children.push(node)

    // void / 自闭合 不入栈
    if (VOID_TAGS.has(tagName) || selfClosingMark) {
      continue
    }

    stack.push(node)
  }

  // 处理尾部剩余文本
  if (cursor < safe.length) {
    pushText(safe.slice(cursor))
  }

  return root.children
}

// ==================== 安全 HTML 序列化（供 H5 v-html 使用） ====================
/** 文本节点转义（内容已 decode，序列化时重新转义防注入） */
function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** 属性值转义 */
function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** 把已过滤的 nodes 树序列化回安全 HTML 字符串 */
function nodesToHtml(nodes: ParseNode[]): string {
  let html = ''
  for (const node of nodes) {
    if (node.type === 'text') {
      html += escapeText(node.text)
      continue
    }
    const name = node.name
    let attrStr = ''
    for (const key of Object.keys(node.attrs)) {
      const val = node.attrs[key]
      if (val === undefined) continue
      attrStr += ` ${key}="${escapeAttr(String(val))}"`
    }
    if (VOID_TAGS.has(name)) {
      html += `<${name}${attrStr}/>`
    } else {
      html += `<${name}${attrStr}>${nodesToHtml(node.children)}</${name}>`
    }
  }
  return html
}

/**
 * 解析 HTML 并输出经白名单/属性过滤/协议校验后的安全 HTML 字符串。
 * 用于 H5 v-html 渲染，确保与 rich-text 平台一致的安全策略。
 */
export function parseHtmlToSafeString(html: string, options: UseHtmlParserOptions = {}): string {
  return nodesToHtml(parseHtml(html, options))
}

/**
 * Hook 形式封装（语义化用法，逻辑等价于 parseHtml）
 */
export function useHtmlParser(options: UseHtmlParserOptions = {}) {
  return {
    parse: (html: string) => parseHtml(html, options),
    strip: stripHtml,
    extractImages: extractImgSrc,
    sanitize: sanitizeHtml,
    decode: decodeEntities
  }
}
