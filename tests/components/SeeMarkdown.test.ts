import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeMarkdown from '../../uni_modules/see-u-ui/components/see-markdown/see-markdown.vue'
import { markdownToHtml, stripMarkdown, extractMarkdownImages } from '../../uni_modules/see-u-ui/utils/hooks/useMarkdownParser'

/* =========================================================================
 * useMarkdownParser 工具函数测试
 * ========================================================================= */
describe('useMarkdownParser - markdownToHtml', () => {
  describe('基础与边界', () => {
    it('空字符串返回空串', () => {
      expect(markdownToHtml('')).toBe('')
      expect(markdownToHtml('   \n  \n')).toBe('')
    })

    it('非字符串输入返回空串', () => {
      expect(markdownToHtml(null as any)).toBe('')
      expect(markdownToHtml(undefined as any)).toBe('')
      expect(markdownToHtml(123 as any)).toBe('')
    })

    it('纯文本应包裹为 <p>', () => {
      const out = markdownToHtml('hello world')
      expect(out).toContain('<p>hello world</p>')
    })
  })

  describe('标题 (ATX)', () => {
    it('# 一级到 ###### 六级标题应正确生成 h1-h6', () => {
      for (let i = 1; i <= 6; i++) {
        const md = `${'#'.repeat(i)} Title ${i}`
        const html = markdownToHtml(md)
        expect(html).toContain(`<h${i}>Title ${i}</h${i}>`)
      }
    })

    it('超过六个 # 应回退为纯文本', () => {
      const html = markdownToHtml('####### Too many')
      expect(html).not.toContain('<h7')
      expect(html).toContain('####### Too many')
    })

    it('# 后必须有空格才被认为是标题', () => {
      const html = markdownToHtml('#NotHeading')
      expect(html).not.toContain('<h1')
    })

    it('标题内可包含粗体/链接等内联格式', () => {
      const html = markdownToHtml('# **Bold** title')
      expect(html).toMatch(/<h1>.*<strong>Bold<\/strong>.*<\/h1>/)
    })
  })

  describe('段落与硬换行', () => {
    it('空行分隔的两段应生成两个 <p>', () => {
      const html = markdownToHtml('first paragraph\n\nsecond paragraph')
      expect((html.match(/<p>/g) || []).length).toBe(2)
    })

    it('breaks=true 时段内单换行应生成 <br>', () => {
      const html = markdownToHtml('line1\nline2', { breaks: true })
      expect(html).toContain('line1<br')
      expect(html).toContain('line2')
    })

    it('breaks=false 时段内单换行不应生成 <br>', () => {
      const html = markdownToHtml('line1\nline2', { breaks: false })
      expect(html).not.toContain('<br')
    })
  })

  describe('内联格式 - 粗体/斜体/删除线/行内代码', () => {
    it('**bold** 应生成 <strong>', () => {
      expect(markdownToHtml('**bold**')).toContain('<strong>bold</strong>')
    })

    it('__bold__ 应生成 <strong>', () => {
      expect(markdownToHtml('__bold__')).toContain('<strong>bold</strong>')
    })

    it('*italic* 应生成 <em>', () => {
      expect(markdownToHtml('*italic*')).toContain('<em>italic</em>')
    })

    it('_italic_ 应生成 <em>', () => {
      expect(markdownToHtml('_italic_')).toContain('<em>italic</em>')
    })

    it('~~del~~ 应生成 <del>', () => {
      expect(markdownToHtml('~~strike~~')).toContain('<del>strike</del>')
    })

    it('`code` 应生成 <code>', () => {
      expect(markdownToHtml('use `npm install` to install')).toContain('<code>npm install</code>')
    })

    it('行内代码中的特殊字符应被转义不被解析', () => {
      const html = markdownToHtml('`<script>x</script>`')
      expect(html).toContain('<code>&lt;script&gt;x&lt;/script&gt;</code>')
    })

    it('粗体+斜体混合 ***x*** 应生成嵌套', () => {
      const html = markdownToHtml('***mix***')
      expect(html).toMatch(/<(strong|em)>.*<(strong|em)>mix<\/(strong|em)>.*<\/(strong|em)>/)
    })
  })

  describe('链接与图片', () => {
    it('[text](url) 应生成 <a>', () => {
      const html = markdownToHtml('[SeeYouUI](https://www.seeuui.cn)')
      expect(html).toContain('<a href="https://www.seeuui.cn">SeeYouUI</a>')
    })

    it('![alt](src) 应生成 <img>', () => {
      const html = markdownToHtml('![logo](https://a.com/x.png)')
      expect(html).toMatch(/<img[^>]*src="https:\/\/a\.com\/x\.png"[^>]*alt="logo"[^>]*\/?>/)
    })

    it('链接 javascript: 协议应被拦截', () => {
      const html = markdownToHtml('[bad](javascript:alert(1))')
      expect(html).not.toContain('javascript:')
    })

    it('linkify=true 时裸 URL 应自动转链', () => {
      const html = markdownToHtml('visit https://www.seeuui.cn now', { linkify: true })
      expect(html).toContain('<a href="https://www.seeuui.cn">https://www.seeuui.cn</a>')
    })

    it('linkify=false 时裸 URL 不转链', () => {
      const html = markdownToHtml('visit https://www.seeuui.cn now', { linkify: false })
      expect(html).not.toMatch(/<a[^>]*href="https:\/\/www\.seeuui\.cn"/)
    })

    it('链接 title 应被保留', () => {
      const html = markdownToHtml('[X](https://a.com "tooltip")')
      expect(html).toContain('title="tooltip"')
    })
  })

  describe('代码块', () => {
    it('``` 围栏代码块应生成 <pre><code>', () => {
      const md = '```\nconst a = 1\n```'
      const html = markdownToHtml(md)
      expect(html).toContain('<pre><code')
      expect(html).toContain('const a = 1')
      expect(html).toContain('</code></pre>')
    })

    it('围栏代码块支持语言标识', () => {
      const md = '```js\nconst a = 1\n```'
      const html = markdownToHtml(md)
      expect(html).toMatch(/<code class="language-js">/)
    })

    it('围栏代码块中的 HTML 应被转义', () => {
      const md = '```\n<script>alert(1)</script>\n```'
      const html = markdownToHtml(md)
      expect(html).toContain('&lt;script&gt;')
      expect(html).not.toContain('<script>alert(1)</script>')
    })

    it('围栏代码块中的 Markdown 语法不应被解析', () => {
      const md = '```\n**bold** *italic*\n```'
      const html = markdownToHtml(md)
      expect(html).not.toContain('<strong>')
      expect(html).toContain('**bold**')
    })

    it('围栏 ~~~ 也应支持', () => {
      const md = '~~~\nplain code\n~~~'
      const html = markdownToHtml(md)
      expect(html).toContain('<pre><code')
      expect(html).toContain('plain code')
    })

    it('未闭合的代码块应吞至文末', () => {
      const md = '```\nunterminated'
      const html = markdownToHtml(md)
      expect(html).toContain('<pre><code')
      expect(html).toContain('unterminated')
    })

    it('highlight 回调应被调用以渲染代码', () => {
      const fn = vi.fn((code: string) => `<span class="hl">${code}</span>`)
      const html = markdownToHtml('```js\nconst x = 1\n```', { highlight: fn })
      expect(fn).toHaveBeenCalledWith('const x = 1\n', 'js')
      expect(html).toContain('class="hl"')
    })
  })

  describe('引用', () => {
    it('> quote 应生成 <blockquote>', () => {
      const html = markdownToHtml('> hello')
      expect(html).toMatch(/<blockquote>[\s\S]*hello[\s\S]*<\/blockquote>/)
    })

    it('多行引用应合并为同一个 blockquote', () => {
      const html = markdownToHtml('> line 1\n> line 2')
      expect((html.match(/<blockquote>/g) || []).length).toBe(1)
      expect(html).toContain('line 1')
      expect(html).toContain('line 2')
    })

    it('引用内可嵌入粗体/链接', () => {
      const html = markdownToHtml('> **bold** text')
      expect(html).toContain('<strong>bold</strong>')
    })
  })

  describe('列表', () => {
    it('无序列表 - 应生成 <ul><li>', () => {
      const html = markdownToHtml('- a\n- b\n- c')
      expect(html).toContain('<ul>')
      expect((html.match(/<li>/g) || []).length).toBe(3)
    })

    it('无序列表 * 与 + 同样支持', () => {
      expect(markdownToHtml('* a\n* b')).toContain('<ul>')
      expect(markdownToHtml('+ a\n+ b')).toContain('<ul>')
    })

    it('有序列表 1. 2. 3. 应生成 <ol>', () => {
      const html = markdownToHtml('1. a\n2. b\n3. c')
      expect(html).toContain('<ol>')
      expect((html.match(/<li>/g) || []).length).toBe(3)
    })

    it('任务列表 - [ ] / - [x] 应生成 checkbox', () => {
      const html = markdownToHtml('- [ ] task 1\n- [x] task 2')
      expect(html).toContain('type="checkbox"')
      expect(html).toMatch(/checked/)
    })
  })

  describe('水平线', () => {
    it('--- 应生成 <hr', () => {
      expect(markdownToHtml('---')).toContain('<hr')
    })
    it('*** 应生成 <hr', () => {
      expect(markdownToHtml('***')).toContain('<hr')
    })
    it('___ 应生成 <hr', () => {
      expect(markdownToHtml('___')).toContain('<hr')
    })
  })

  describe('表格 (GFM)', () => {
    it('应正确解析三列表格', () => {
      const md = '| A | B | C |\n|---|---|---|\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |'
      const html = markdownToHtml(md, { gfm: true })
      expect(html).toContain('<table')
      expect(html).toContain('<thead')
      expect(html).toContain('<tbody')
      expect((html.match(/<th[\s>]/g) || []).length).toBe(3)
      expect((html.match(/<td[\s>]/g) || []).length).toBe(6)
    })

    it('表格对齐 :---/---:/:---: 应反映在 align 属性', () => {
      const md = '| L | C | R |\n|:---|:---:|---:|\n| 1 | 2 | 3 |'
      const html = markdownToHtml(md, { gfm: true })
      expect(html).toMatch(/align="left"|text-align:\s*left/)
      expect(html).toMatch(/align="center"|text-align:\s*center/)
      expect(html).toMatch(/align="right"|text-align:\s*right/)
    })

    it('gfm=false 时不解析表格', () => {
      const md = '| A | B |\n|---|---|\n| 1 | 2 |'
      const html = markdownToHtml(md, { gfm: false })
      expect(html).not.toContain('<table')
    })
  })

  describe('安全过滤 (XSS)', () => {
    it('Markdown 中的 <script> 应被转义为文本', () => {
      const html = markdownToHtml('hello <script>alert(1)</script> world')
      expect(html).not.toContain('<script>alert(1)</script>')
    })

    it('图片 onerror 属性不会被生成', () => {
      const html = markdownToHtml('![x](a.jpg)')
      expect(html).not.toContain('onerror')
    })

    it('链接 vbscript: 协议被拦截', () => {
      const html = markdownToHtml('[X](vbscript:msgbox)')
      expect(html).not.toContain('vbscript:')
    })
  })

  describe('字符转义', () => {
    it('& < > " 在普通文本中应转义', () => {
      const html = markdownToHtml('A & B < C > D " E')
      expect(html).toContain('&amp;')
      expect(html).toContain('&lt;')
      expect(html).toContain('&gt;')
    })

    it('反斜杠转义：\\* 不应被解析为斜体', () => {
      const html = markdownToHtml('\\*not italic\\*')
      expect(html).not.toContain('<em>')
      expect(html).toContain('*not italic*')
    })
  })
})

describe('useMarkdownParser - stripMarkdown', () => {
  it('移除标题/粗体/链接，保留可读文本', () => {
    expect(stripMarkdown('# Hello **World**')).toBe('Hello World')
    expect(stripMarkdown('[See](https://a)')).toBe('See')
    expect(stripMarkdown('![x](a.jpg)')).toBe('')
  })

  it('去掉代码块围栏，保留代码体', () => {
    const out = stripMarkdown('```\nconst a = 1\n```')
    expect(out).toContain('const a = 1')
    expect(out).not.toContain('```')
  })

  it('空输入返回空串', () => {
    expect(stripMarkdown('')).toBe('')
    expect(stripMarkdown(null as any)).toBe('')
  })
})

describe('useMarkdownParser - extractMarkdownImages', () => {
  it('提取所有图片 src', () => {
    const md = '![a](https://a.com/1.png)\ntext\n![b](https://b.com/2.png)'
    expect(extractMarkdownImages(md)).toEqual(['https://a.com/1.png', 'https://b.com/2.png'])
  })

  it('忽略代码块内的图片语法', () => {
    const md = '```\n![not-img](nope.png)\n```\n![real](real.png)'
    expect(extractMarkdownImages(md)).toEqual(['real.png'])
  })

  it('空输入返回空数组', () => {
    expect(extractMarkdownImages('')).toEqual([])
  })
})

/* =========================================================================
 * SeeMarkdown 组件测试
 * ========================================================================= */
describe('SeeMarkdown 组件', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('基本渲染', () => {
    it('挂载后渲染根容器 see-markdown', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# Hello' } })
      expect(wrapper.find('.see-markdown').exists()).toBe(true)
    })

    it('内部应包含 see-parse 渲染节点', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# Hello' } })
      expect(wrapper.find('.see-parse').exists()).toBe(true)
    })

    it('content 为空且 emptyText 提供时显示占位', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '', emptyText: '暂无内容' } })
      expect(wrapper.html()).toContain('暂无内容')
    })
  })

  describe('Props 默认值', () => {
    it('默认 props 应正确', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# X' } })
      const vm = wrapper.vm as any
      expect(vm.breaks).toBe(false)
      expect(vm.linkify).toBe(true)
      expect(vm.gfm).toBe(true)
      expect(vm.selectable).toBe(false)
      expect(vm.previewImage).toBe(true)
    })
  })

  describe('content 解析', () => {
    it('# 标题应被渲染为 h1 元素', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# Hello' } })
      expect(wrapper.html()).toMatch(/<h1[^>]*>\s*Hello\s*<\/h1>/i)
    })

    it('**bold** 应被渲染为 strong 元素', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: 'go **bold**' } })
      expect(wrapper.html()).toContain('<strong>bold</strong>')
    })

    it('代码块应被渲染为 pre/code', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '```\nconst a = 1\n```' } })
      const html = wrapper.html()
      expect(html).toContain('const a = 1')
      expect(html).toMatch(/<pre/i)
    })
  })

  describe('事件触发', () => {
    it('挂载后应 emit onLoad，回调含 html 与 nodes', async () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# Hello' } })
      await nextTick()
      await nextTick()
      const events = wrapper.emitted('onLoad')
      expect(events).toBeTruthy()
      const [html, nodes] = events![events!.length - 1] as any[]
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(0)
      expect(Array.isArray(nodes)).toBe(true)
    })

    it('content 变化应重新触发 onLoad', async () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# A' } })
      await nextTick()
      await nextTick()
      const before = (wrapper.emitted('onLoad') || []).length
      await wrapper.setProps({ content: '# B' })
      await nextTick()
      await nextTick()
      const after = (wrapper.emitted('onLoad') || []).length
      expect(after).toBeGreaterThan(before)
    })

    it('非字符串 content 不应抛错且不渲染富文本', async () => {
      const wrapper = mount(SeeMarkdown, { props: { content: null as any } })
      await nextTick()
      expect(wrapper.find('.see-parse__rich').exists()).toBe(false)
    })
  })

  describe('Expose 方法', () => {
    it('应暴露 getHtml / getText / setContent / getImageUrls', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# Hi' } })
      const vm = wrapper.vm as any
      expect(typeof vm.getHtml).toBe('function')
      expect(typeof vm.getText).toBe('function')
      expect(typeof vm.setContent).toBe('function')
      expect(typeof vm.getImageUrls).toBe('function')
    })

    it('getHtml 应返回当前 Markdown 转换后的 HTML', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# Hi' } })
      const html = (wrapper.vm as any).getHtml()
      expect(html).toContain('<h1>Hi</h1>')
    })

    it('getText 应返回剥离 Markdown 后的纯文本', () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# Hello **World**' } })
      const text = (wrapper.vm as any).getText()
      expect(text).toContain('Hello')
      expect(text).toContain('World')
      expect(text).not.toContain('#')
      expect(text).not.toContain('**')
    })

    it('setContent 动态更新内容', async () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '# A' } })
      ;(wrapper.vm as any).setContent('# B')
      await nextTick()
      await nextTick()
      expect((wrapper.vm as any).getHtml()).toContain('<h1>B</h1>')
    })

    it('getImageUrls 应从 markdown 中提取图片', () => {
      const wrapper = mount(SeeMarkdown, {
        props: { content: '![a](a.jpg)\n![b](b.jpg)' }
      })
      expect((wrapper.vm as any).getImageUrls()).toEqual(['a.jpg', 'b.jpg'])
    })

    it('显式 imageUrls 优先于自动提取', () => {
      const wrapper = mount(SeeMarkdown, {
        props: { content: '![a](a.jpg)', imageUrls: ['x.jpg'] }
      })
      expect((wrapper.vm as any).getImageUrls()).toEqual(['x.jpg'])
    })
  })

  describe('XSS 防护', () => {
    it('应过滤 Markdown 内嵌的 <script>', async () => {
      const wrapper = mount(SeeMarkdown, {
        props: { content: 'hello <script>alert(1)</script> world' }
      })
      await nextTick()
      const html = wrapper.html()
      // 脚本标签应被转义为实体（不会作为可执行标签存在）
      expect(html).not.toMatch(/<script[^&]/i)
      expect(html).toContain('&lt;script&gt;')
    })

    it('链接 javascript: 协议应被拦截', async () => {
      const wrapper = mount(SeeMarkdown, { props: { content: '[bad](javascript:alert(1))' } })
      await nextTick()
      expect(wrapper.html()).not.toContain('javascript:')
    })
  })

  describe('containerClass / tagStyle 透传', () => {
    it('containerClass 应作用在根元素', () => {
      const wrapper = mount(SeeMarkdown, {
        props: { content: '# x', containerClass: 'my-md' }
      })
      expect(wrapper.find('.see-markdown').classes()).toContain('my-md')
    })

    it('tagStyle 应透传到内部解析节点', async () => {
      const wrapper = mount(SeeMarkdown, {
        props: { content: '# x', tagStyle: { h1: 'color: red' } }
      })
      await nextTick()
      // tagStyle 通过 see-parse 注入到节点 attrs.style
      expect(wrapper.html()).toMatch(/color:\s*red/)
    })
  })

  describe('parser options 透传', () => {
    it('breaks=true 时段内换行应生成 <br>', async () => {
      const wrapper = mount(SeeMarkdown, {
        props: { content: 'line1\nline2', breaks: true }
      })
      await nextTick()
      expect(wrapper.html()).toMatch(/<br/)
    })

    it('linkify=false 时裸 URL 不被自动转链', async () => {
      const wrapper = mount(SeeMarkdown, {
        props: { content: 'go https://www.seeuui.cn now', linkify: false }
      })
      await nextTick()
      expect(wrapper.html()).not.toMatch(/<a[^>]*href="https:\/\/www\.seeuui\.cn"/)
    })

    it('gfm=true 时支持表格', async () => {
      const wrapper = mount(SeeMarkdown, {
        props: { content: '| A | B |\n|---|---|\n| 1 | 2 |' }
      })
      await nextTick()
      expect(wrapper.html()).toContain('<table')
    })
  })
})
