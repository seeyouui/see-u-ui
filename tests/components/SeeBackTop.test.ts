import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeBackTop from '../../uni_modules/see-u-ui/components/see-backtop/see-backtop.vue'

describe('SeeBackTop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置 scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
  })

  it('默认隐藏（scrollTop < visibilityHeight）', () => {
    const wrapper = mount(SeeBackTop)
    expect(wrapper.find('.see-backtop').isVisible()).toBe(false)
  })

  it('滚动超过阈值后显示', async () => {
    const wrapper = mount(SeeBackTop, {
      props: { visibilityHeight: 200 }
    })
    // 模拟滚动
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-backtop').isVisible()).toBe(true)
  })

  it('点击触发 onClick 事件', async () => {
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    const wrapper = mount(SeeBackTop)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    await wrapper.find('.see-backtop').trigger('tap')
    expect(wrapper.emitted('onClick')).toBeTruthy()
  })

  it('点击调用 uni.pageScrollTo', async () => {
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    const wrapper = mount(SeeBackTop)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    await wrapper.find('.see-backtop').trigger('tap')
    expect(uni.pageScrollTo).toHaveBeenCalledWith(expect.objectContaining({ scrollTop: 0 }))
  })

  it('自定义 right 和 bottom 位置', () => {
    const wrapper = mount(SeeBackTop, {
      props: { right: 50, bottom: 100 }
    })
    const style = wrapper.find('.see-backtop').attributes('style') || ''
    expect(style).toContain('right: 50px')
    expect(style).toContain('bottom: 100px')
  })

  it('自定义 zIndex', () => {
    const wrapper = mount(SeeBackTop, {
      props: { zIndex: 1000 }
    })
    const style = wrapper.find('.see-backtop').attributes('style') || ''
    expect(style).toContain('1000')
  })

  it('自定义 visibilityHeight', async () => {
    const wrapper = mount(SeeBackTop, {
      props: { visibilityHeight: 500 }
    })
    // 初始状态应该隐藏
    expect(wrapper.find('.see-backtop').attributes('style')).toContain('display: none')

    // 滚动到 600（超过 500 阈值）
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    // v-show 应该移除 display: none
    const style = wrapper.find('.see-backtop').attributes('style') || ''
    expect(style).not.toContain('display: none')
  })

  it('isCustom=true 时添加自定义 class', () => {
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    const wrapper = mount(SeeBackTop, {
      props: { isCustom: true }
    })
    window.dispatchEvent(new Event('scroll'))
    expect(wrapper.find('.see-backtop--custom').exists()).toBe(true)
  })

  it('默认插槽内容渲染', () => {
    const wrapper = mount(SeeBackTop)
    expect(wrapper.find('.see-backtop__arrow').exists()).toBe(true)
  })

  it('自定义插槽内容渲染', () => {
    const wrapper = mount(SeeBackTop, {
      slots: {
        default: '<text class="custom-icon">TOP</text>'
      }
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  it('自定义 duration 应传递给 pageScrollTo', async () => {
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    const wrapper = mount(SeeBackTop, {
      props: { duration: 500 }
    })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    await wrapper.find('.see-backtop').trigger('tap')
    expect(uni.pageScrollTo).toHaveBeenCalledWith(expect.objectContaining({ duration: 500 }))
  })
})
