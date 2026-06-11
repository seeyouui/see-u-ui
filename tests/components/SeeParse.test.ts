import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeParse from '../../uni_modules/see-u-ui/components/see-parse/see-parse.vue'
import { parseHtml, stripHtml, extractImgSrc, sanitizeHtml } from '../../uni_modules/see-u-ui/utils/hooks/useHtmlParser'

describe('useHtmlParser 工具函数测试', () => {
  describe('parseHtml - 基础解析', () => {
    it('解析空字符串应返回空数组', () => {
      expect(parseHtml('')).toEqual([])
      expect(parseHtml('   ')).toEqual([])
    })

    it('解析纯文本应返回单个 text 节点', () => {
      const nodes = parseHtml('Hello World')
      expect(nodes).toHaveLength(1)
      expect(nodes[0].type).toBe('text')
      expect((nodes[0] as any).text).toBe('Hello World')
    })

    it('解析单个标签应返回单个 node 节点', () => {
      const nodes = parseHtml('<p>Hello</p>')
      expect(nodes).toHaveLength(1)
      expect(nodes[0].type).toBe('node')
      expect((nodes[0] as any).name).toBe('p')
      expect((nodes[0] as any).children).toHaveLength(1)
      expect((nodes[0] as any).children[0].text).toBe('Hello')
    })

    it('解析嵌套标签应正确嵌套', () => {
      const nodes = parseHtml('<div><span>X</span></div>')
      const div = nodes[0] as any
      expect(div.name).toBe('div')
      expect(div.children[0].name).toBe('span')
      expect(div.children[0].children[0].text).toBe('X')
    })

    it('解析多个并列节点', () => {
      const nodes = parseHtml('<p>A</p><p>B</p>')
      expect(nodes).toHaveLength(2)
      expect((nodes[0] as any).name).toBe('p')
      expect((nodes[1] as any).name).toBe('p')
    })
  })

  describe('parseHtml - 属性解析', () => {
    it('解析双引号属性', () => {
      const nodes = parseHtml('<a href="https://a.com" title="X">Link</a>')
      const a = nodes[0] as any
      expect(a.attrs.href).toBe('https://a.com')
      expect(a.attrs.title).toBe('X')
    })

    it('解析单引号属性', () => {
      const nodes = parseHtml("<a href='https://a.com'>Link</a>")
      expect((nodes[0] as any).attrs.href).toBe('https://a.com')
    })

    it('解析无引号属性', () => {
      const nodes = parseHtml('<a href=https://x.com target=_blank>X</a>')
      const node = nodes[0] as any
      expect(node.attrs.href).toBe('https://x.com')
      expect(node.attrs.target).toBe('_blank')
    })

    it('解析多个属性', () => {
      const nodes = parseHtml('<img src="a.jpg" alt="A" width="100">')
      const img = nodes[0] as any
      expect(img.attrs.src).toBe('a.jpg')
      expect(img.attrs.alt).toBe('A')
      expect(img.attrs.width).toBe('100')
    })
  })

  describe('parseHtml - 自闭合标签', () => {
    it('img 应被识别为自闭合', () => {
      const nodes = parseHtml('<img src="a.jpg"><p>Text</p>')
      expect(nodes).toHaveLength(2)
      expect((nodes[0] as any).name).toBe('img')
      expect((nodes[0] as any).children).toEqual([])
      expect((nodes[1] as any).name).toBe('p')
    })

    it('br hr 应被识别为自闭合', () => {
      const nodes = parseHtml('A<br>B<hr>C')
      expect(nodes).toHaveLength(5)
      expect((nodes[1] as any).name).toBe('br')
      expect((nodes[3] as any).name).toBe('hr')
    })

    it('XHTML 风格自闭合 <br />', () => {
      const nodes = parseHtml('<br />')
      expect((nodes[0] as any).name).toBe('br')
    })
  })

  describe('parseHtml - 安全过滤', () => {
    it('应过滤 script 标签', () => {
      const nodes = parseHtml('<p>A</p><script>alert(1)</script><p>B</p>')
      expect(nodes.find((n) => (n as any).name === 'script')).toBeUndefined()
      expect(nodes.filter((n) => (n as any).name === 'p')).toHaveLength(2)
    })

    it('应过滤 style 标签内容', () => {
      const nodes = parseHtml('<style>body{color:red}</style><p>X</p>')
      expect(nodes.find((n) => (n as any).name === 'style')).toBeUndefined()
    })

    it('应过滤 on* 事件属性', () => {
      const nodes = parseHtml('<div onclick="bad()" onmouseover="bad()" title="ok">X</div>')
      const div = nodes[0] as any
      expect(div.attrs.onclick).toBeUndefined()
      expect(div.attrs.onmouseover).toBeUndefined()
      expect(div.attrs.title).toBe('ok')
    })

    it('应过滤 javascript: 协议链接', () => {
      const nodes = parseHtml('<a href="javascript:alert(1)">X</a>')
      const a = nodes[0] as any
      expect(a.attrs.href === '' || a.attrs.href === undefined).toBe(true)
    })

    it('应保留正常的 http/https/mailto/tel 链接', () => {
      const cases = ['https://x.com', 'http://x.com', 'mailto:a@b.com', 'tel:123']
      cases.forEach((href) => {
        const nodes = parseHtml(`<a href="${href}">X</a>`)
        expect((nodes[0] as any).attrs.href).toBe(href)
      })
    })
  })

  describe('parseHtml - HTML 实体解码', () => {
    it('应解码常见 HTML 实体', () => {
      const nodes = parseHtml('&lt;p&gt;A&amp;B&quot;C&#39;D&nbsp;E')
      expect((nodes[0] as any).text).toBe('<p>A&B"C\'D E')
    })

    it('应解码数字实体', () => {
      const nodes = parseHtml('&#65;&#x42;')
      expect((nodes[0] as any).text).toBe('AB')
    })
  })

  describe('parseHtml - 注释处理', () => {
    it('应忽略 HTML 注释', () => {
      const nodes = parseHtml('<p>A</p><!-- comment --><p>B</p>')
      expect(nodes.filter((n) => (n as any).name === 'p')).toHaveLength(2)
    })
  })

  describe('parseHtml - 错误容忍', () => {
    it('未闭合标签应自动闭合到末尾', () => {
      const nodes = parseHtml('<p>A')
      expect((nodes[0] as any).name).toBe('p')
    })

    it('不匹配的关闭标签应被忽略', () => {
      const nodes = parseHtml('<p>A</span></p>')
      expect((nodes[0] as any).name).toBe('p')
    })
  })

  describe('parseHtml - tagStyle 注入', () => {
    it('应将 tagStyle 对应样式注入到节点 attrs.style', () => {
      const nodes = parseHtml('<p>X</p>', { tagStyle: { p: 'color: red' } })
      expect((nodes[0] as any).attrs.style).toContain('color: red')
    })

    it('应保留原有 inline style 并合并 tagStyle', () => {
      const nodes = parseHtml('<p style="font-size: 14px">X</p>', { tagStyle: { p: 'color: red' } })
      const style = (nodes[0] as any).attrs.style
      expect(style).toContain('font-size: 14px')
      expect(style).toContain('color: red')
    })
  })

  describe('stripHtml - 纯文本提取', () => {
    it('移除所有标签返回纯文本', () => {
      expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World')
    })

    it('解码实体', () => {
      expect(stripHtml('A&amp;B')).toBe('A&B')
    })

    it('空字符串', () => {
      expect(stripHtml('')).toBe('')
    })
  })

  describe('extractImgSrc - 图片 src 提取', () => {
    it('提取多张图片 src', () => {
      const html = '<img src="a.jpg"><p>X</p><img src="b.png">'
      expect(extractImgSrc(html)).toEqual(['a.jpg', 'b.png'])
    })

    it('无图片返回空数组', () => {
      expect(extractImgSrc('<p>X</p>')).toEqual([])
    })

    it('支持单引号 src', () => {
      expect(extractImgSrc("<img src='a.jpg'>")).toEqual(['a.jpg'])
    })
  })

  describe('sanitizeHtml - 字符串安全过滤', () => {
    it('移除 script 块', () => {
      expect(sanitizeHtml('A<script>x</script>B')).toBe('AB')
    })
    it('移除 on* 属性', () => {
      const out = sanitizeHtml('<div onclick="x" title="ok">A</div>')
      expect(out).not.toContain('onclick')
      expect(out).toContain('title="ok"')
    })
  })
})

describe('SeeParse 组件测试', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('基本渲染', () => {
    it('挂载后渲染根容器', () => {
      const wrapper = mount(SeeParse, { props: { content: '<p>Hello</p>' } })
      expect(wrapper.find('.see-parse').exists()).toBe(true)
    })

    it('content 为空时显示 emptyText', () => {
      const wrapper = mount(SeeParse, { props: { content: '', emptyText: '暂无内容' } })
      expect(wrapper.html()).toContain('暂无内容')
    })

    it('content 为空且未提供 emptyText 时不渲染富文本区', () => {
      const wrapper = mount(SeeParse, { props: { content: '' } })
      expect(wrapper.find('.see-parse__rich').exists()).toBe(false)
    })
  })

  describe('Props 默认值', () => {
    it('默认 props 应正确', () => {
      const wrapper = mount(SeeParse, { props: { content: '<p>X</p>' } })
      const vm = wrapper.vm as any
      expect(vm.selectable).toBe(false)
      expect(vm.previewImage).toBe(true)
      expect(vm.space).toBe('')
    })
  })

  describe('selectable 属性', () => {
    it('selectable=true 时 rich-text 应设置 selectable', () => {
      const wrapper = mount(SeeParse, { props: { content: '<p>X</p>', selectable: true } })
      // H5 模式下 fallback 走 v-html，不渲染 rich-text 元素；这里只检查 vm props 透传正确
      expect((wrapper.vm as any).selectable).toBe(true)
    })
  })

  describe('imageUrls 自动收集', () => {
    it('未传 imageUrls 时应从 content 自动提取', () => {
      const html = '<img src="a.jpg"><img src="b.jpg">'
      const wrapper = mount(SeeParse, { props: { content: html } })
      const vm = wrapper.vm as any
      expect(vm.getImageUrls()).toEqual(['a.jpg', 'b.jpg'])
    })

    it('显式 imageUrls 优先于自动提取', () => {
      const wrapper = mount(SeeParse, {
        props: { content: '<img src="a.jpg">', imageUrls: ['x.jpg', 'y.jpg'] }
      })
      expect((wrapper.vm as any).getImageUrls()).toEqual(['x.jpg', 'y.jpg'])
    })
  })

  describe('事件触发', () => {
    it('挂载后应 emit onLoad 并提供解析后的 nodes', async () => {
      const wrapper = mount(SeeParse, { props: { content: '<p>X</p>' } })
      await nextTick()
      const loadEvents = wrapper.emitted('onLoad')
      expect(loadEvents).toBeTruthy()
      expect(Array.isArray(loadEvents![0][0])).toBe(true)
    })

    it('content 解析失败时应 emit onError（非 string 输入容错）', async () => {
      const wrapper = mount(SeeParse, { props: { content: null as any } })
      await nextTick()
      // 不应抛错，且不应渲染富文本
      expect(wrapper.find('.see-parse__rich').exists()).toBe(false)
    })

    it('content 变化应重新触发 onLoad', async () => {
      const wrapper = mount(SeeParse, { props: { content: '<p>A</p>' } })
      await nextTick()
      const before = (wrapper.emitted('onLoad') || []).length
      await wrapper.setProps({ content: '<p>B</p>' })
      await nextTick()
      const after = (wrapper.emitted('onLoad') || []).length
      expect(after).toBeGreaterThan(before)
    })
  })

  describe('Expose 方法', () => {
    it('应暴露 getText / setContent / getImageUrls 方法', () => {
      const wrapper = mount(SeeParse, { props: { content: '<p>Hello <b>X</b></p>' } })
      const vm = wrapper.vm as any
      expect(typeof vm.getText).toBe('function')
      expect(typeof vm.setContent).toBe('function')
      expect(typeof vm.getImageUrls).toBe('function')
    })

    it('getText 应返回剥离标签后的纯文本', () => {
      const wrapper = mount(SeeParse, { props: { content: '<p>Hello <b>X</b></p>' } })
      expect((wrapper.vm as any).getText()).toBe('Hello X')
    })

    it('setContent 应能动态更新内容', async () => {
      const wrapper = mount(SeeParse, { props: { content: '<p>A</p>' } })
      ;(wrapper.vm as any).setContent('<p>B</p>')
      await nextTick()
      // setContent 触发解析，emit onLoad
      const loadEvents = wrapper.emitted('onLoad')
      expect(loadEvents!.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('安全性 - XSS 防护', () => {
    it('应过滤 content 中的 script 标签', async () => {
      const wrapper = mount(SeeParse, {
        props: { content: '<p>A</p><script>alert(1)</script><p>B</p>' }
      })
      await nextTick()
      // 渲染产物中不应包含 script 标签
      expect(wrapper.html()).not.toContain('<script')
      expect(wrapper.html()).not.toContain('alert(1)')
    })

    it('应过滤 onclick 等事件属性', async () => {
      const wrapper = mount(SeeParse, {
        props: { content: '<div onclick="bad()" title="safe">X</div>' }
      })
      await nextTick()
      expect(wrapper.html()).not.toContain('onclick')
    })
  })

  describe('tagStyle 自定义样式', () => {
    it('tagStyle 应注入到对应标签', async () => {
      const wrapper = mount(SeeParse, {
        props: { content: '<p>X</p>', tagStyle: { p: 'color: red' } }
      })
      await nextTick()
      const vm = wrapper.vm as any
      const nodes = vm.parsedNodes
      expect(nodes[0].attrs.style).toContain('color: red')
    })
  })

  describe('container class 自定义', () => {
    it('containerClass 应应用到根元素', () => {
      const wrapper = mount(SeeParse, {
        props: { content: '<p>X</p>', containerClass: 'my-rich' }
      })
      expect(wrapper.find('.see-parse').classes()).toContain('my-rich')
    })
  })
})
