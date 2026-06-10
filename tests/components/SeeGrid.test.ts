import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeGrid from '../../uni_modules/see-u-ui/components/see-grid/see-grid.vue'
import SeeGridItem from '../../uni_modules/see-u-ui/components/see-grid/see-grid-item.vue'

describe('SeeGrid 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeGrid, {
        slots: { default: '<text>内容</text>' }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-grid').exists()).toBe(true)
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeGrid)
      expect(wrapper.props('columns')).toBe(4)
      expect(wrapper.props('gap')).toBe(0)
      expect(wrapper.props('border')).toBe(false)
      expect(wrapper.props('isSquare')).toBe(false)
      expect(wrapper.props('isClickable')).toBe(false)
    })
  })

  describe('样式', () => {
    it('应该应用 gap', () => {
      const wrapper = mount(SeeGrid, {
        props: { gap: 16 }
      })
      const style = wrapper.find('.see-grid').attributes('style')
      expect(style).toContain('gap: 16rpx')
    })

    it('应该应用字符串 gap', () => {
      const wrapper = mount(SeeGrid, {
        props: { gap: '20rpx' }
      })
      const style = wrapper.find('.see-grid').attributes('style')
      expect(style).toContain('gap: 20rpx')
    })

    it('border=true 应该添加边框', () => {
      const wrapper = mount(SeeGrid, {
        props: { border: true }
      })
      expect(wrapper.find('.see-grid--border').exists()).toBe(true)
      const style = wrapper.find('.see-grid').attributes('style')
      expect(style).toContain('border-top')
      expect(style).toContain('border-left')
    })
  })

  describe('CSS 类名', () => {
    it('isSquare=true 应该添加 square 类', () => {
      const wrapper = mount(SeeGrid, {
        props: { isSquare: true }
      })
      expect(wrapper.find('.see-grid--square').exists()).toBe(true)
    })
  })
})

describe('SeeGridItem 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeGridItem)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-grid-item').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('应该渲染 icon', () => {
      const wrapper = mount(SeeGridItem, {
        props: { icon: '📱' }
      })
      expect(wrapper.find('.see-grid-item__icon').text()).toBe('📱')
    })

    it('应该渲染 text', () => {
      const wrapper = mount(SeeGridItem, {
        props: { text: '宫格项' }
      })
      expect(wrapper.find('.see-grid-item__text').text()).toBe('宫格项')
    })

    it('应该应用自定义 iconSize', () => {
      const wrapper = mount(SeeGridItem, {
        props: { icon: '📱', iconSize: '60rpx' }
      })
      const icon = wrapper.find('.see-grid-item__icon')
      expect(icon.attributes('style')).toContain('font-size: 60rpx')
    })
  })

  describe('事件', () => {
    it('点击应该触发 onClick 事件', async () => {
      const wrapper = mount(SeeGridItem, {
        props: { index: 2 }
      })
      await wrapper.find('.see-grid-item').trigger('click')
      expect(wrapper.emitted('onClick')).toBeTruthy()
      expect(wrapper.emitted('onClick')![0]).toEqual([2])
    })
  })

  describe('插槽', () => {
    it('应该渲染 default 插槽', () => {
      const wrapper = mount(SeeGridItem, {
        slots: { default: '<text>自定义内容</text>' }
      })
      expect(wrapper.html()).toContain('自定义内容')
    })

    it('应该渲染 icon 插槽', () => {
      const wrapper = mount(SeeGridItem, {
        slots: { icon: '<text>自定义图标</text>' }
      })
      expect(wrapper.html()).toContain('自定义图标')
    })

    it('应该渲染 text 插槽', () => {
      const wrapper = mount(SeeGridItem, {
        slots: { text: '<text>自定义文字</text>' }
      })
      expect(wrapper.html()).toContain('自定义文字')
    })
  })
})
