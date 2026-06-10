import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeLine from '../../uni_modules/see-u-ui/components/see-line/see-line.vue'

describe('SeeLine 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeLine)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-line').exists()).toBe(true)
    })

    it('应该渲染为 view 元素', () => {
      const wrapper = mount(SeeLine)
      expect(wrapper.find('.see-line').exists()).toBe(true)
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeLine)
      expect(wrapper.props('direction')).toBe('horizontal')
      expect(wrapper.props('color')).toBe('var(--see-border-color)')
      expect(wrapper.props('size')).toBe('1px')
      expect(wrapper.props('margin')).toBe('0')
      expect(wrapper.props('isDashed')).toBe(false)
      expect(wrapper.props('length')).toBe('100%')
    })
  })

  describe('方向属性', () => {
    it('默认应该渲染为水平线', () => {
      const wrapper = mount(SeeLine)
      expect(wrapper.find('.see-line--horizontal').exists()).toBe(true)
    })

    it('direction=vertical 应该渲染为垂直线', () => {
      const wrapper = mount(SeeLine, {
        props: { direction: 'vertical' }
      })
      expect(wrapper.find('.see-line--vertical').exists()).toBe(true)
    })

    it('水平线应该有正确的宽度和高度', () => {
      const wrapper = mount(SeeLine, {
        props: { length: '80%', size: '2px' }
      })
      const style = wrapper.find('.see-line').attributes('style')
      expect(style).toContain('width: 80%')
      expect(style).toContain('height: 2px')
    })

    it('垂直线应该有正确的宽度和高度', () => {
      const wrapper = mount(SeeLine, {
        props: { direction: 'vertical', length: '50px', size: '2px' }
      })
      const style = wrapper.find('.see-line').attributes('style')
      expect(style).toContain('width: 2px')
      expect(style).toContain('height: 50px')
    })
  })

  describe('虚线样式', () => {
    it('isDashed=false 时不应该有 dashed 类', () => {
      const wrapper = mount(SeeLine, {
        props: { isDashed: false }
      })
      expect(wrapper.find('.see-line--dashed').exists()).toBe(false)
    })

    it('isDashed=true 时应该有 dashed 类', () => {
      const wrapper = mount(SeeLine, {
        props: { isDashed: true }
      })
      expect(wrapper.find('.see-line--dashed').exists()).toBe(true)
    })
  })

  describe('自定义样式', () => {
    it('应该应用自定义颜色', () => {
      const wrapper = mount(SeeLine, {
        props: { color: '#ff0000' }
      })
      const style = wrapper.find('.see-line').attributes('style')
      expect(style).toContain('background-color: rgb(255, 0, 0)')
    })

    it('应该应用自定义外边距', () => {
      const wrapper = mount(SeeLine, {
        props: { margin: '10px 0' }
      })
      const style = wrapper.find('.see-line').attributes('style')
      expect(style).toContain('margin: 10px 0px')
    })

    it('应该应用自定义长度', () => {
      const wrapper = mount(SeeLine, {
        props: { length: '50%' }
      })
      const style = wrapper.find('.see-line').attributes('style')
      expect(style).toContain('width: 50%')
    })

    it('应该应用自定义粗细', () => {
      const wrapper = mount(SeeLine, {
        props: { size: '4px' }
      })
      const style = wrapper.find('.see-line').attributes('style')
      expect(style).toContain('height: 4px')
    })
  })

  describe('CSS 类名', () => {
    it('应该有 see-line 基础类名', () => {
      const wrapper = mount(SeeLine)
      expect(wrapper.find('.see-line').exists()).toBe(true)
    })

    it('应该根据 direction 添加对应类名', () => {
      const horizontal = mount(SeeLine)
      expect(horizontal.find('.see-line--horizontal').exists()).toBe(true)

      const vertical = mount(SeeLine, { props: { direction: 'vertical' } })
      expect(vertical.find('.see-line--vertical').exists()).toBe(true)
    })
  })
})
