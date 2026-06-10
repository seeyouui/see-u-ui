import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeLayout from '../../uni_modules/see-u-ui/components/see-layout/see-layout.vue'
import SeeLayoutItem from '../../uni_modules/see-u-ui/components/see-layout/see-layout-item.vue'

describe('SeeLayout 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeLayout, {
        slots: { default: '<text>内容</text>' }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-layout').exists()).toBe(true)
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeLayout)
      expect(wrapper.props('direction')).toBe('row')
      expect(wrapper.props('wrap')).toBe('wrap')
      expect(wrapper.props('justify')).toBe('flex-start')
      expect(wrapper.props('align')).toBe('flex-start')
      expect(wrapper.props('gap')).toBe(0)
    })
  })

  describe('样式', () => {
    it('应该应用 direction', () => {
      const wrapper = mount(SeeLayout, { props: { direction: 'column' } })
      const style = wrapper.find('.see-layout').attributes('style')
      expect(style).toContain('flex-direction: column')
    })

    it('应该应用 wrap', () => {
      const wrapper = mount(SeeLayout, { props: { wrap: 'nowrap' } })
      const style = wrapper.find('.see-layout').attributes('style')
      expect(style).toContain('flex-wrap: nowrap')
    })

    it('应该应用 justify', () => {
      const wrapper = mount(SeeLayout, { props: { justify: 'center' } })
      const style = wrapper.find('.see-layout').attributes('style')
      expect(style).toContain('justify-content: center')
    })

    it('应该应用 align', () => {
      const wrapper = mount(SeeLayout, { props: { align: 'stretch' } })
      const style = wrapper.find('.see-layout').attributes('style')
      expect(style).toContain('align-items: stretch')
    })

    it('数字 gap 应该转为 rpx', () => {
      const wrapper = mount(SeeLayout, { props: { gap: 16 } })
      const style = wrapper.find('.see-layout').attributes('style')
      expect(style).toContain('gap: 16rpx')
    })

    it('字符串 gap 应该直接使用', () => {
      const wrapper = mount(SeeLayout, { props: { gap: '20px' } })
      const style = wrapper.find('.see-layout').attributes('style')
      expect(style).toContain('gap: 20px')
    })
  })
})

describe('SeeLayoutItem 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeLayoutItem, {
        slots: { default: '<text>内容</text>' }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-layout-item').exists()).toBe(true)
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeLayoutItem)
      expect(wrapper.props('span')).toBe(24)
      expect(wrapper.props('offset')).toBe(0)
    })
  })

  describe('宽度计算', () => {
    it('span=24 应该是 100%', () => {
      const wrapper = mount(SeeLayoutItem, { props: { span: 24 } })
      const style = wrapper.find('.see-layout-item').attributes('style')
      expect(style).toContain('width: 100%')
    })

    it('span=12 应该是 50%', () => {
      const wrapper = mount(SeeLayoutItem, { props: { span: 12 } })
      const style = wrapper.find('.see-layout-item').attributes('style')
      expect(style).toContain('width: 50%')
    })

    it('span=8 应该是 33.33%', () => {
      const wrapper = mount(SeeLayoutItem, { props: { span: 8 } })
      const style = wrapper.find('.see-layout-item').attributes('style')
      expect(style).toContain('width: 33.33')
    })

    it('span=6 应该是 25%', () => {
      const wrapper = mount(SeeLayoutItem, { props: { span: 6 } })
      const style = wrapper.find('.see-layout-item').attributes('style')
      expect(style).toContain('width: 25%')
    })
  })

  describe('偏移', () => {
    it('offset=12 应该有 50% 的 marginLeft', () => {
      const wrapper = mount(SeeLayoutItem, { props: { span: 12, offset: 12 } })
      const style = wrapper.find('.see-layout-item').attributes('style')
      expect(style).toContain('margin-left: 50%')
    })

    it('offset=0 不应该有 marginLeft', () => {
      const wrapper = mount(SeeLayoutItem, { props: { span: 12, offset: 0 } })
      const style = wrapper.find('.see-layout-item').attributes('style')
      expect(style).not.toContain('margin-left')
    })
  })

  describe('Flex 模式', () => {
    it('设置 flex 时应该使用 flex 而非 width', () => {
      const wrapper = mount(SeeLayoutItem, { props: { flex: 2 } })
      const style = wrapper.find('.see-layout-item').attributes('style')
      expect(style).toContain('flex: 2')
      expect(style).not.toContain('width')
    })
  })
})
