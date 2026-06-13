/**
 * SeeParse 富文本解析器翻译 key
 */
const zhCN = {
  // Demo 页面标题
  'parse.demo.basic': '基本使用',
  'parse.demo.imageLink': '含图片与链接',
  'parse.demo.tagStyle': 'tagStyle 自定义标签样式',
  'parse.demo.xss': 'XSS 安全过滤（脚本与事件属性会被丢弃）',
  'parse.demo.empty': '空内容占位',
  'parse.demo.dynamic': '动态更新内容',
  'parse.demo.table': '表格与代码块',
  'parse.demo.selectable': '可选中文本（rich-text 平台生效）',

  // Demo 按钮文字
  'parse.demo.switchContent': '切换内容',
  'parse.demo.appendParagraph': '追加段落',
  'parse.demo.showText': '查看纯文本',

  // Demo 占位文本
  'parse.demo.emptyText': '暂无内容，请稍后再试~',

  // Demo 提示信息
  'parse.demo.plainText': '纯文本',

  // Demo toast 消息
  'parse.demo.linkClicked': '点击链接: ',
  'parse.demo.imageClicked': '点击图片',

  // Demo 演示内容
  'parse.content.basic':
    '<h3>欢迎使用 SeeYouUI Parse</h3><p>这是一段<b>富文本内容</b>，支持 <i>斜体</i>、<u>下划线</u>、<del>删除线</del>、<mark>高亮</mark> 等常用标签。</p><blockquote>引用：跨平台 HTML 解析器，让富文本在 H5 / App / 小程序一致呈现。</blockquote>',
  'parse.content.rich': '<p>下面是一张图片：</p><p>...</p><p>点击 <a href="https://www.seeuui.cn">SeeYouUI 官网</a> 了解更多。</p>',
  'parse.content.styled': '<h3>带自定义样式的标题</h3><p>第一段文字 - 这段会被注入红色加大字号。</p><p>第二段也是。</p>',
  'parse.content.xss': '<p>正常文字 ✅</p><div>点我没事（onclick 已被过滤）</div><p><a href="javascript:alert(\'xss\')">恶意链接（被拦截）</a></p>',
  'parse.content.dynamicInitial': '<p>初始内容：当前时间是 <b>{time}</b></p>',
  'parse.content.dynamicScreen2': '<h4>第二屏内容</h4><p>这是切换后的<b>新内容</b>，颜色 <span style="color:#37d497">绿绿的</span>。</p>',
  'parse.content.dynamicScreen3': '<h4>第三屏内容</h4><ul><li>列表项一</li><li>列表项二</li><li>列表项三</li></ul>',
  'parse.content.dynamicScreen4': '<h4>第四屏内容</h4><p style="text-align:center;color:#ffb645">居中文字 + 警示色</p>',
  'parse.content.appended': '<p>追加于 {time}</p>',
  'parse.content.table':
    '<h4>支持的标签清单</h4><table border="1" cellspacing="0" cellpadding="6"><thead><tr><th>类别</th><th>标签</th></tr></thead><tbody><tr><td>块级</td><td>div / p / h1~h6 / blockquote / pre / ul / ol</td></tr><tr><td>内联</td><td>span / a / b / i / em / strong / code</td></tr><tr><td>媒体</td><td>img / video / audio</td></tr></tbody></table><p>行内代码： <code>const see = \'you-ui\'</code></p><pre>function add(a, b) {\n  return a + b\n}</pre>'
}

const en = {
  // Demo page titles
  'parse.demo.basic': 'Basic Usage',
  'parse.demo.imageLink': 'With Images & Links',
  'parse.demo.tagStyle': 'Custom Tag Styles',
  'parse.demo.xss': 'XSS Security Filtering (scripts & event attrs stripped)',
  'parse.demo.empty': 'Empty Content Placeholder',
  'parse.demo.dynamic': 'Dynamic Content Update',
  'parse.demo.table': 'Tables & Code Blocks',
  'parse.demo.selectable': 'Selectable Text (rich-text platform)',

  // Demo button labels
  'parse.demo.switchContent': 'Switch Content',
  'parse.demo.appendParagraph': 'Append Paragraph',
  'parse.demo.showText': 'View Plain Text',

  // Demo placeholder text
  'parse.demo.emptyText': 'No content yet, please try again later~',

  // Demo info
  'parse.demo.plainText': 'Plain Text',

  // Demo toast messages
  'parse.demo.linkClicked': 'Link clicked: ',
  'parse.demo.imageClicked': 'Image clicked',

  // Demo content data
  'parse.content.basic':
    '<h3>Welcome to SeeYouUI Parse</h3><p>This is <b>rich text content</b> supporting <i>italic</i>, <u>underline</u>, <del>strikethrough</del>, <mark>highlight</mark> and more.</p><blockquote>A cross-platform HTML parser for consistent rendering on H5 / App / Mini Programs.</blockquote>',
  'parse.content.rich': '<p>Here is an image:</p><p>...</p><p>Visit <a href="https://www.seeuui.cn">SeeYouUI Website</a> to learn more.</p>',
  'parse.content.styled':
    '<h3>Custom Styled Heading</h3><p>First paragraph - this text will have red color and larger font.</p><p>Second paragraph as well.</p>',
  'parse.content.xss':
    '<p>Normal text ✅</p><div>Click me safely (onclick filtered)</div><p><a href="javascript:alert(\'xss\')">Malicious link (blocked)</a></p>',
  'parse.content.dynamicInitial': '<p>Initial content: current time is <b>{time}</b></p>',
  'parse.content.dynamicScreen2': '<h4>Screen 2</h4><p>This is the <b>new content</b> with <span style="color:#37d497">green color</span>.</p>',
  'parse.content.dynamicScreen3': '<h4>Screen 3</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
  'parse.content.dynamicScreen4': '<h4>Screen 4</h4><p style="text-align:center;color:#ffb645">Centered text in warning color</p>',
  'parse.content.appended': '<p>Appended at {time}</p>',
  'parse.content.table':
    '<h4>Supported Tags</h4><table border="1" cellspacing="0" cellpadding="6"><thead><tr><th>Category</th><th>Tags</th></tr></thead><tbody><tr><td>Block</td><td>div / p / h1~h6 / blockquote / pre / ul / ol</td></tr><tr><td>Inline</td><td>span / a / b / i / em / strong / code</td></tr><tr><td>Media</td><td>img / video / audio</td></tr></tbody></table><p>Inline code: <code>const see = &apos;you-ui&apos;</code></p><pre>function add(a, b) {\n  return a + b\n}</pre>'
}

export default { 'zh-CN': zhCN, en }
