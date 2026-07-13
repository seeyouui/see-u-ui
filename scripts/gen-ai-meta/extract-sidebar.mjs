// 从文档 sidebar.ts 抽取 slug -> {category, en, zh}
import fs from 'node:fs'

const SIDEBAR = 'E:/000seeuui/see-u-ui-doc/docs/.vitepress/sidebar.ts'

export function extractSidebarMap() {
  const src = fs.readFileSync(SIDEBAR, 'utf8')
  const lines = src.split('\n')
  const map = {}
  let curCategory = ''
  let pendingText = ''

  const catRe = /text:\s*["'](基础组件|表单组件|布局组件|数据组件|反馈组件|导航组件|内容解析|业务组件)["']/
  // 组件条目 text: "Button 按钮" 形式（英文+中文）
  const compTextRe = /text:\s*["']([A-Za-z][\w]*)\s+([^"']+)["']/
  const linkRe = /link:\s*["']\/components\/([a-z0-9-]+)\//

  for (const line of lines) {
    const cat = line.match(catRe)
    if (cat) {
      curCategory = cat[1]
      pendingText = ''
      continue
    }
    const ct = line.match(compTextRe)
    if (ct) {
      pendingText = JSON.stringify({ en: ct[1], zh: ct[2].trim() })
    }
    const lk = line.match(linkRe)
    if (lk && pendingText) {
      const { en, zh } = JSON.parse(pendingText)
      map[lk[1]] = { category: curCategory || '未分类', en, zh }
      pendingText = ''
    }
  }
  return map
}

// 直接运行时输出到文件
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const map = extractSidebarMap()
  fs.writeFileSync(new URL('./sidebar-map.json', import.meta.url), JSON.stringify(map, null, 2))
  fs.writeFileSync(new URL('./_sbcount.txt', import.meta.url), 'entries=' + Object.keys(map).length)
}
