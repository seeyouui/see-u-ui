import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeNoNetwork from '../../uni_modules/see-u-ui/components/see-no-network/see-no-network.vue'

describe('SeeNoNetwork 组件测试', () => {
  const originalUni = (globalThis as any).uni
  let mockGetNetworkType: ReturnType<typeof vi.fn>
  let mockOnNetworkStatusChange: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    // 创建 mock 函数
    mockGetNetworkType = vi.fn().mockImplementation((options: any) => {
      options.success({ networkType: 'wifi' })
    })
    mockOnNetworkStatusChange = vi.fn()
    // 使用 vi.spyOn 覆盖 uni 方法，而非直接替换整个对象
    ;(globalThis as any).uni = {
      ...originalUni,
      getNetworkType: mockGetNetworkType,
      onNetworkStatusChange: mockOnNetworkStatusChange
    }
  })

  afterEach(() => {
    // 恢复原始 uni 对象
    ;(globalThis as any).uni = originalUni
  })

  describe('基本渲染', () => {
    it('show 为 true 时应该渲染组件', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: { show: true, autoCheck: false }
      })
      expect(wrapper.find('.see-no-network').exists()).toBe(true)
    })

    it('show 为 false 时不应该渲染组件', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: { show: false, autoCheck: false }
      })
      expect(wrapper.find('.see-no-network').exists()).toBe(false)
    })
  })

  describe('默认文案', () => {
    it('应该显示默认提示文案', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: { show: true, autoCheck: false }
      })
      expect(wrapper.find('.see-no-network__text').text()).toBe('网络异常，请检查网络连接')
    })

    it('应该显示默认重试按钮文案', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: { show: true, autoCheck: false }
      })
      expect(wrapper.find('.see-no-network__retry-text').text()).toBe('重新连接')
    })
  })

  describe('自定义文案', () => {
    it('应该显示自定义提示文案', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: {
          show: true,
          text: '网络连接已断开',
          autoCheck: false
        }
      })
      expect(wrapper.find('.see-no-network__text').text()).toBe('网络连接已断开')
    })

    it('应该显示自定义重试按钮文案', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: {
          show: true,
          retryText: '点击重试',
          autoCheck: false
        }
      })
      expect(wrapper.find('.see-no-network__retry-text').text()).toBe('点击重试')
    })
  })

  describe('全屏模式', () => {
    it('isFullscreen 为 true 时应该添加全屏类名', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: {
          show: true,
          isFullscreen: true,
          autoCheck: false
        }
      })
      expect(wrapper.find('.see-no-network--fullscreen').exists()).toBe(true)
    })

    it('isFullscreen 为 false 时不应该有全屏类名', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: {
          show: true,
          isFullscreen: false,
          autoCheck: false
        }
      })
      expect(wrapper.find('.see-no-network--fullscreen').exists()).toBe(false)
    })
  })

  describe('重试按钮', () => {
    it('点击重试按钮应该触发 onRetry 事件', async () => {
      const wrapper = mount(SeeNoNetwork, {
        props: {
          show: true,
          autoCheck: false
        }
      })
      await wrapper.find('.see-no-network__retry').trigger('click')
      expect(wrapper.emitted('onRetry')).toBeTruthy()
      expect(wrapper.emitted('onRetry')!.length).toBe(1)
    })

    it('多次点击应该触发多次 onRetry 事件', async () => {
      const wrapper = mount(SeeNoNetwork, {
        props: {
          show: true,
          autoCheck: false
        }
      })
      await wrapper.find('.see-no-network__retry').trigger('click')
      await wrapper.find('.see-no-network__retry').trigger('click')
      await wrapper.find('.see-no-network__retry').trigger('click')
      expect(wrapper.emitted('onRetry')!.length).toBe(3)
    })
  })

  describe('图标', () => {
    it('应该显示默认图标', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: { show: true, autoCheck: false }
      })
      expect(wrapper.find('.see-no-network__icon-text').text()).toBe('📡')
    })

    it('应该显示自定义图标', () => {
      const wrapper = mount(SeeNoNetwork, {
        props: {
          show: true,
          icon: '🌐',
          autoCheck: false
        }
      })
      expect(wrapper.find('.see-no-network__icon-text').text()).toBe('🌐')
    })
  })
})
