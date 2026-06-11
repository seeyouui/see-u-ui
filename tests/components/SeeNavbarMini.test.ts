import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeNavbarMini from '../../uni_modules/see-u-ui/components/see-navbar-mini/see-navbar-mini.vue'

describe('SeeNavbarMini', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基础渲染', () => {
    const wrapper = mount(SeeNavbarMini)
    expect(wrapper.find('.see-navbar-mini').exists()).toBe(true)
  })

  it('渲染 title 文字', () => {
    const wrapper = mount(SeeNavbarMini, {
      props: { title: '子页面标题' }
    })
    expect(wrapper.text()).toContain('子页面标题')
  })

  it('默认显示返回按钮', () => {
    const wrapper = mount(SeeNavbarMini)
    expect(wrapper.find('.see-navbar-mini__back').exists()).toBe(true)
  })

  it('isShowBack=false 时隐藏返回按钮', () => {
    const wrapper = mount(SeeNavbarMini, {
      props: { isShowBack: false }
    })
    expect(wrapper.find('.see-navbar-mini__back').exists()).toBe(false)
  })

  it('点击返回按钮触发 onBack 事件', async () => {
    const wrapper = mount(SeeNavbarMini)
    await wrapper.find('.see-navbar-mini__left').trigger('tap')
    expect(wrapper.emitted('onBack')).toBeTruthy()
  })

  it('自定义 height 应应用到样式', () => {
    const wrapper = mount(SeeNavbarMini, {
      props: { height: '80px' }
    })
    const navbar = wrapper.find('.see-navbar-mini')
    const style = navbar.attributes('style') || ''
    expect(style).toContain('80px')
  })

  it('自定义 bgColor 应应用到样式', () => {
    const wrapper = mount(SeeNavbarMini, {
      props: { bgColor: '#f5f5f5' }
    })
    const navbar = wrapper.find('.see-navbar-mini')
    const style = navbar.attributes('style') || ''
    expect(style).toContain('background')
  })

  it('left 插槽内容正确渲染', () => {
    const wrapper = mount(SeeNavbarMini, {
      slots: {
        left: '<text class="custom-left">自定义左侧</text>'
      }
    })
    expect(wrapper.find('.custom-left').exists()).toBe(true)
  })

  it('center 插槽覆盖 title', () => {
    const wrapper = mount(SeeNavbarMini, {
      props: { title: '原标题' },
      slots: {
        center: '<text class="custom-center">自定义中间</text>'
      }
    })
    expect(wrapper.find('.custom-center').exists()).toBe(true)
  })

  it('right 插槽内容正确渲染', () => {
    const wrapper = mount(SeeNavbarMini, {
      slots: {
        right: '<text class="custom-right">操作</text>'
      }
    })
    expect(wrapper.find('.custom-right').exists()).toBe(true)
  })
})
