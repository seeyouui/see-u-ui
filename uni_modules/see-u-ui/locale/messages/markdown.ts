/**
 * SeeMarkdown Markdown 组件翻译 key
 */
const zhCN = {
  // Demo 页面标题
  'markdown.demo.basic': '基本使用 - 标题与段落',
  'markdown.demo.emphasis': '强调与行内格式',
  'markdown.demo.linkImage': '链接与图片',
  'markdown.demo.list': '列表（含任务列表）',
  'markdown.demo.codeBlock': '代码块（含语言标识）',
  'markdown.demo.quote': '引用',
  'markdown.demo.hr': '水平线',
  'markdown.demo.table': '表格（GFM）',
  'markdown.demo.linkify': '自动链接（linkify）',
  'markdown.demo.xss': 'XSS 防护（脚本会被转义为文本）',
  'markdown.demo.tagStyle': '自定义 tagStyle',
  'markdown.demo.empty': '空内容占位',
  'markdown.demo.dynamic': '动态更新内容',

  // Demo 按钮文字
  'markdown.demo.switchMd': '切换 Markdown',
  'markdown.demo.appendParagraph': '追加段落',
  'markdown.demo.showText': '查看纯文本',

  // Demo 占位文本
  'markdown.demo.emptyText': '暂无 Markdown 内容~',

  // Demo 提示信息
  'markdown.demo.plainText': '纯文本',

  // Demo toast 消息
  'markdown.demo.linkClicked': '点击链接: ',
  'markdown.demo.imageClicked': '点击图片',

  // Demo 演示内容
  'markdown.content.basic':
    '# 一级标题\n## 二级标题\n### 三级标题\n\n这是一个普通段落。SeeYouUI 的 Markdown 组件支持 GFM 子集，零依赖纯字符串解析。\n\n下一段是另一个段落，会被独立包裹。',
  'markdown.content.emphasis':
    '这里有 **粗体**、*斜体*、~~删除线~~、`行内代码`、还有 ***粗斜体***。\n\n可以使用 `__bold__` 与 `_italic_` 作为替代写法：__bold__ / _italic_。',
  'markdown.content.linkImg':
    '点击访问 [SeeYouUI 官网](https://www.seeuui.cn "SeeYouUI")。\n\n下方是一张图片：\n\n![logo](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-app.png "uni-app")',
  'markdown.content.list':
    '**无序列表**\n- 苹果\n- 香蕉\n- 樱桃\n\n**有序列表**\n1. 起床\n2. 写代码\n3. 摸鱼\n\n**任务列表（GFM）**\n- [x] 计划组件 API\n- [x] 编写单元测试\n- [ ] 完善文档\n- [ ] 发布 npm 版本',
  'markdown.content.code':
    '普通围栏代码：\n\n```\nconst a = 1\nconst b = 2\nconsole.log(a + b)\n```\n\n带语言标识：\n\n```js\nfunction add(a, b) {\n  return a + b\n}\n```',
  'markdown.content.quote': '> 这是一段引用文字。\n> 第二行也是引用的一部分。\n>\n> 引用中也可以包含 **粗体** 与 [链接](https://www.seeuui.cn)。',
  'markdown.content.hr': '第一段\n\n---\n\n第二段（上面是 `---`）\n\n***\n\n第三段（上面是 `***`）',
  'markdown.content.table':
    '| 列 A（左对齐）| 列 B（居中）| 列 C（右对齐）|\n|:---|:---:|---:|\n| 1 | 2 | 3 |\n| 苹果 | 香蕉 | 樱桃 |\n| 跨平台 | 零依赖 | 安全 |',
  'markdown.content.linkify': '直接粘贴裸链接 https://www.seeuui.cn 会被自动转为可点击的 a 标签。\n\n不想自动转，就在组件上设 `linkify="false"`。',
  'markdown.content.xss': "正常文字 ✅\n\n下面的脚本会被作为纯文本展示，不会执行：\n\n链接 [恶意](javascript:alert('xss')) 的 href 已被拦截。",
  'markdown.content.styled': '# 蓝色标题\n## 红色二级\n普通段落\n> 黄色引用块',
  'markdown.content.dynamicInitial': '## 初始内容\n当前时间：**{time}**',
  'markdown.content.dynamicScreen2': '## 第二屏\n- 列表项 1\n- 列表项 2\n- 列表项 3',
  'markdown.content.dynamicScreen3': '## 第三屏\n> 来自姐姐的引用：宝宝代码写得真棒~',
  'markdown.content.dynamicScreen4': '## 第四屏\n```ts\nconst hi: string = "Hello SeeYouUI"\nconsole.log(hi)\n```',
  'markdown.content.appended': '\n\n_追加于 {time}_'
}

const en = {
  // Demo page titles
  'markdown.demo.basic': 'Basic Usage - Headings & Paragraphs',
  'markdown.demo.emphasis': 'Emphasis & Inline Formatting',
  'markdown.demo.linkImage': 'Links & Images',
  'markdown.demo.list': 'Lists (incl. Task Lists)',
  'markdown.demo.codeBlock': 'Code Blocks (with Language)',
  'markdown.demo.quote': 'Blockquotes',
  'markdown.demo.hr': 'Horizontal Rules',
  'markdown.demo.table': 'Tables (GFM)',
  'markdown.demo.linkify': 'Auto Links (Linkify)',
  'markdown.demo.xss': 'XSS Protection (scripts escaped)',
  'markdown.demo.tagStyle': 'Custom Tag Styles',
  'markdown.demo.empty': 'Empty Content Placeholder',
  'markdown.demo.dynamic': 'Dynamic Content Update',

  // Demo button labels
  'markdown.demo.switchMd': 'Switch Markdown',
  'markdown.demo.appendParagraph': 'Append Paragraph',
  'markdown.demo.showText': 'View Plain Text',

  // Demo placeholder text
  'markdown.demo.emptyText': 'No Markdown content~',

  // Demo info
  'markdown.demo.plainText': 'Plain Text',

  // Demo toast messages
  'markdown.demo.linkClicked': 'Link clicked: ',
  'markdown.demo.imageClicked': 'Image clicked',

  // Demo content data
  'markdown.content.basic':
    '# Heading 1\n## Heading 2\n### Heading 3\n\nThis is a regular paragraph. SeeYouUI Markdown component supports GFM subset with zero-dependency pure string parsing.\n\nHere is another paragraph, wrapped independently.',
  'markdown.content.emphasis':
    'Here is **bold**, *italic*, ~~strikethrough~~, `inline code`, and ***bold italic***.\n\nYou can also use `__bold__` and `_italic_` as alternative syntax: __bold__ / _italic_.',
  'markdown.content.linkImg':
    'Visit [SeeYouUI Website](https://www.seeuui.cn "SeeYouUI").\n\nBelow is an image:\n\n![logo](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-app.png "uni-app")',
  'markdown.content.list':
    '**Unordered List**\n- Apple\n- Banana\n- Cherry\n\n**Ordered List**\n1. Wake up\n2. Write code\n3. Slack off\n\n**Task List (GFM)**\n- [x] Plan component API\n- [x] Write unit tests\n- [ ] Improve documentation\n- [ ] Publish npm version',
  'markdown.content.code':
    'Fenced code block:\n\n```\nconst a = 1\nconst b = 2\nconsole.log(a + b)\n```\n\nWith language identifier:\n\n```js\nfunction add(a, b) {\n  return a + b\n}\n```',
  'markdown.content.quote':
    '> This is a blockquote.\n> The second line is also part of the quote.\n>\n> It can also contain **bold** and [links](https://www.seeuui.cn).',
  'markdown.content.hr': 'First paragraph\n\n---\n\nSecond paragraph (`---` above)\n\n***\n\nThird paragraph (`***` above)',
  'markdown.content.table':
    '| Column A (Left) | Column B (Center) | Column C (Right) |\n|:---|:---:|---:|\n| 1 | 2 | 3 |\n| Apple | Banana | Cherry |\n| Cross-platform | Zero-dependency | Secure |',
  'markdown.content.linkify':
    'Paste a bare link https://www.seeuui.cn and it will be auto-converted to a clickable anchor tag.\n\nTo disable, set `linkify="false"` on the component.',
  'markdown.content.xss':
    "Normal text ✅\n\nThe script below will be displayed as plain text and will NOT execute:\n\nLink [malicious](javascript:alert('xss')) href is blocked.",
  'markdown.content.styled': '# Blue Heading\n## Red Subheading\nNormal paragraph\n> Yellow blockquote',
  'markdown.content.dynamicInitial': '## Initial Content\nCurrent time: **{time}**',
  'markdown.content.dynamicScreen2': '## Screen 2\n- Item 1\n- Item 2\n- Item 3',
  'markdown.content.dynamicScreen3': '## Screen 3\n> A quote from big sister: Baby, your code is amazing~',
  'markdown.content.dynamicScreen4': '## Screen 4\n```ts\nconst hi: string = "Hello SeeYouUI"\nconsole.log(hi)\n```',
  'markdown.content.appended': '\n\n_Appended at {time}_'
}

export default { 'zh-CN': zhCN, en }
