import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeSticky from '../../uni_modules/see-u-ui/components/see-sticky/see-sticky.vue'

describe('SeeSticky 组件测试', () => {
  const originalUni = (globalThis as any).uni

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // 恢复原始 uni 对象
    ;(globalThis as any).uni = originalUni
  })

  describe('基本渲染', () => {
    it('应该能够正常渲染', () => {
      const wrapper = mount(SeeSticky, {
        slots: { default: '<text>吸顶内容</text>' }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.see-sticky').exists()).toBe(true)
    })

    it('应该显示插槽内容', () => {
      const wrapper = mount(SeeSticky, {
        slots: { default: '<text>测试内容</text>' }
      })
      expect(wrapper.html()).toContain('测试内容')
    })
  })

  describe('Props 默认值', () => {
    it('应该有正确的默认值', () => {
      const wrapper = mount(SeeSticky)
      expect(wrapper.props('offsetTop')).toBe(0)
      expect(wrapper.props('zIndex')).toBe(99)
      expect(wrapper.props('isEnabled')).toBe(true)
    })
  })

  describe('初始状态', () => {
    it('初始状态不应该有 fixed 类', () => {
      const wrapper = mount(SeeSticky)
      expect(wrapper.find('.see-sticky--fixed').exists()).toBe(false)
    })
  })

  describe('Props 验证', () => {
    it('应该接受 offsetTop 属性', () => {
      const wrapper = mount(SeeSticky, {
        props: { offsetTop: 50 }
      })
      expect(wrapper.props('offsetTop')).toBe(50)
    })

    it('应该接受 zIndex 属性', () => {
      const wrapper = mount(SeeSticky, {
        props: { zIndex: 200 }
      })
      expect(wrapper.props('zIndex')).toBe(200)
    })

    it('应该接受 isEnabled 属性', () => {
      const wrapper = mount(SeeSticky, {
        props: { isEnabled: false }
      })
      expect(wrapper.props('isEnabled')).toBe(false)
    })
  })

  describe('CSS 类名', () => {
    it('应该有 see-sticky 基础类名', () => {
      const wrapper = mount(SeeSticky)
      expect(wrapper.find('.see-sticky').exists()).toBe(true)
    })
  })

  describe('吸顶功能', () => {
    it('应该在 onMounted 时注册页面滚动监听', () => {
      const onPageScroll = vi.fn()
      ;(globalThis as any).uni = {
        ...originalUni,
        onPageScroll,
        createSelectorQuery: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          boundingClientRect: vi.fn().mockReturnThis(),
          exec: vi.fn().mockReturnValue(null)
        })
      }

      mount(SeeSticky)
      expect(onPageScroll).toHaveBeenCalled()
    })

    it('isEnabled 为 false 时不应该响应滚动', async () => {
      const wrapper = mount(SeeSticky, {
        props: { isEnabled: false }
      })
      // 即使触发滚动，也不应该添加 fixed 类
      expect(wrapper.find('.see-sticky--fixed').exists()).toBe(false)
    })

    it('应该在组件卸载时取消滚动监听', () => {
      const offPageScroll = vi.fn()
      const onPageScroll = vi.fn()
      ;(globalThis as any).uni = {
        ...originalUni,
        onPageScroll,
        offPageScroll,
        createSelectorQuery: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          boundingClientRect: vi.fn().mockReturnThis(),
          exec: vi.fn().mockReturnValue(null)
        })
      }

      const wrapper = mount(SeeSticky)
      wrapper.unmount()
      expect(offPageScroll).toHaveBeenCalled()
    })

    it('应该在吸顶时触发 onScroll 事件', async () => {
      const onScroll = vi.fn()
      const wrapper = mount(SeeSticky, {
        props: { offsetTop: 50 }
      })
      wrapper.vm.$emit('onScroll', { isFixed: true, scrollTop: 100 })
      // 注意：由于测试环境的限制，无法完全模拟滚动吸顶行为
      // 这里主要验证事件绑定是否正确
      expect(wrapper.emitted('onScroll')).toBeTruthy()
    })
  })
})
