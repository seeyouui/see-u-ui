import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeBox from '../../uni_modules/see-u-ui/components/see-box/see-box.vue'

describe('SeeBox 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeBox, {
        slots: { default: 'box content' }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-box').exists()).toBe(true)
    })

    it('应该显示插槽内容', () => {
      const wrapper = mount(SeeBox, {
        slots: { default: '<text>测试内容</text>' }
      })
      expect(wrapper.html()).toContain('测试内容')
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeBox)
      expect(wrapper.props('padding')).toBe('0')
      expect(wrapper.props('margin')).toBe('0')
      expect(wrapper.props('width')).toBe('100%')
      expect(wrapper.props('radius')).toBe('0')
      expect(wrapper.props('border')).toBe('0')
      expect(wrapper.props('direction')).toBe('row')
      expect(wrapper.props('wrap')).toBe('nowrap')
      expect(wrapper.props('justify')).toBe('flex-start')
      expect(wrapper.props('align')).toBe('stretch')
      expect(wrapper.props('gap')).toBe('0')
    })
  })

  describe('样式属性', () => {
    it('应该应用 padding', () => {
      const wrapper = mount(SeeBox, {
        props: { padding: '20px' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('padding: 20px')
    })

    it('应该应用 margin', () => {
      const wrapper = mount(SeeBox, {
        props: { margin: '10px' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('margin: 10px')
    })

    it('应该应用 bgColor', () => {
      const wrapper = mount(SeeBox, {
        props: { bgColor: '#f5f5f5' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('background: rgb(245, 245, 245)')
    })

    it('应该应用 width', () => {
      const wrapper = mount(SeeBox, {
        props: { width: '200px' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('width: 200px')
    })

    it('应该应用 height', () => {
      const wrapper = mount(SeeBox, {
        props: { height: '100px' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('height: 100px')
    })

    it('应该应用 radius', () => {
      const wrapper = mount(SeeBox, {
        props: { radius: '12rpx' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('border-radius: 12rpx')
    })
  })

  describe('阴影效果', () => {
    it('应该应用 small 阴影', () => {
      const wrapper = mount(SeeBox, {
        props: { shadow: 'small' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('box-shadow')
    })

    it('应该应用 medium 阴影', () => {
      const wrapper = mount(SeeBox, {
        props: { shadow: 'medium' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('box-shadow')
    })

    it('应该应用 large 阴影', () => {
      const wrapper = mount(SeeBox, {
        props: { shadow: 'large' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('box-shadow')
    })

    it('没有 shadow 时应该没有 box-shadow', () => {
      const wrapper = mount(SeeBox, {
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('box-shadow: none')
    })
  })

  describe('边框', () => {
    it('应该应用 border', () => {
      const wrapper = mount(SeeBox, {
        props: { border: '1px', borderColor: '#ccc' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('border-width: 1px')
      expect(style).toContain('border-style: solid')
      expect(style).toContain('border-color: rgb(204, 204, 204)')
    })

    it('border 为 0 时不应该有边框样式', () => {
      const wrapper = mount(SeeBox, {
        props: { border: '0' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).not.toContain('border-style: solid')
    })
  })

  describe('Flex 布局', () => {
    it('应该应用 direction column', () => {
      const wrapper = mount(SeeBox, {
        props: { direction: 'column' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('flex-direction: column')
    })

    it('应该应用 direction row', () => {
      const wrapper = mount(SeeBox, {
        props: { direction: 'row' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('flex-direction: row')
    })

    it('应该应用 justify', () => {
      const wrapper = mount(SeeBox, {
        props: { justify: 'space-between' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('justify-content: space-between')
    })

    it('应该应用 align', () => {
      const wrapper = mount(SeeBox, {
        props: { align: 'center' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('align-items: center')
    })

    it('应该应用 gap', () => {
      const wrapper = mount(SeeBox, {
        props: { gap: '20rpx' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('gap: 20rpx')
    })

    it('应该应用 wrap', () => {
      const wrapper = mount(SeeBox, {
        props: { wrap: 'wrap' },
        slots: { default: 'content' }
      })
      const style = wrapper.find('.see-box').attributes('style')
      expect(style).toContain('flex-wrap: wrap')
    })
  })

  describe('CSS 类名', () => {
    it('应该有 see-box 类名', () => {
      const wrapper = mount(SeeBox)
      expect(wrapper.find('.see-box').exists()).toBe(true)
    })
  })
})
