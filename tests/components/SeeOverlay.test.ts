import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeOverlay from '../../uni_modules/see-u-ui/components/see-overlay/see-overlay.vue'

describe('SeeOverlay 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基本渲染', () => {
    it('show=false 时不应该渲染', () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: false }
      })
      expect(wrapper.find('.see-overlay').exists()).toBe(false)
    })

    it('show=true 时应该渲染', () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true }
      })
      expect(wrapper.find('.see-overlay').exists()).toBe(true)
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeOverlay)
      expect(wrapper.props('show')).toBe(false)
      expect(wrapper.props('zIndex')).toBe(1000)
      expect(wrapper.props('background')).toBe('rgba(0, 0, 0, 0.6)')
      expect(wrapper.props('opacity')).toBe(1)
      expect(wrapper.props('clickable')).toBe(true)
      expect(wrapper.props('isAnimated')).toBe(true)
      expect(wrapper.props('duration')).toBe(300)
    })
  })

  describe('样式属性', () => {
    it('应该应用自定义 zIndex', () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true, zIndex: 2000 }
      })
      const style = wrapper.find('.see-overlay').attributes('style')
      expect(style).toContain('z-index: 2000')
    })

    it('应该应用自定义背景色', () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true, background: 'rgba(255, 0, 0, 0.5)' }
      })
      const style = wrapper.find('.see-overlay').attributes('style')
      expect(style).toContain('background-color: rgba(255, 0, 0, 0.5)')
    })

    it('show=true 时应该应用 opacity', () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true, opacity: 0.5 }
      })
      const style = wrapper.find('.see-overlay').attributes('style')
      expect(style).toContain('opacity: 0.5')
    })

    it('应该应用 position: fixed', () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true }
      })
      const style = wrapper.find('.see-overlay').attributes('style')
      expect(style).toContain('position: fixed')
    })
  })

  describe('插槽', () => {
    it('应该渲染默认插槽内容', () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true },
        slots: { default: '<text>遮罩内容</text>' }
      })
      expect(wrapper.html()).toContain('遮罩内容')
    })
  })

  describe('事件', () => {
    it('点击时应该触发 onClick 事件', async () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true, clickable: false }
      })
      await wrapper.find('.see-overlay').trigger('click')
      expect(wrapper.emitted('onClick')).toBeTruthy()
    })

    it('clickable=true 时点击应该触发 update:show', async () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true, clickable: true }
      })
      await wrapper.find('.see-overlay').trigger('click')
      expect(wrapper.emitted('update:show')).toBeTruthy()
      expect(wrapper.emitted('update:show')![0]).toEqual([false])
    })

    it('clickable=false 时点击不应该触发 update:show', async () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true, clickable: false }
      })
      await wrapper.find('.see-overlay').trigger('click')
      expect(wrapper.emitted('update:show')).toBeFalsy()
    })
  })

  describe('CSS 类名', () => {
    it('显示时应该有 see-overlay--active 类', () => {
      const wrapper = mount(SeeOverlay, {
        props: { show: true }
      })
      expect(wrapper.find('.see-overlay--active').exists()).toBe(true)
    })
  })
})
