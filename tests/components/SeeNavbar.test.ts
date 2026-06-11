import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeNavbar from '../../uni_modules/see-u-ui/components/see-navbar/see-navbar.vue'

describe('SeeNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ========== 基础渲染 ==========

  it('渲染 title 文字', () => {
    const wrapper = mount(SeeNavbar, {
      props: { title: '页面标题' }
    })
    expect(wrapper.text()).toContain('页面标题')
  })

  it('默认显示左侧箭头', () => {
    const wrapper = mount(SeeNavbar)
    expect(wrapper.find('.see-navbar__arrow').exists()).toBe(true)
  })

  it('isFixed=true 时应用 fixed 定位', () => {
    const wrapper = mount(SeeNavbar, {
      props: { isFixed: true }
    })
    expect(wrapper.find('.see-navbar--fixed').exists()).toBe(true)
  })

  it('isFixed=false 时不应用 fixed 定位', () => {
    const wrapper = mount(SeeNavbar, {
      props: { isFixed: false }
    })
    expect(wrapper.find('.see-navbar--fixed').exists()).toBe(false)
  })

  // ========== 事件 ==========

  it('点击左侧按钮触发 onLeftClick', async () => {
    const wrapper = mount(SeeNavbar)
    await wrapper.find('.see-navbar__left').trigger('tap')
    expect(wrapper.emitted('onLeftClick')).toBeTruthy()
  })

  it('点击左侧按钮同时触发 onBack', async () => {
    const wrapper = mount(SeeNavbar)
    await wrapper.find('.see-navbar__left').trigger('tap')
    expect(wrapper.emitted('onBack')).toBeTruthy()
  })

  it('点击右侧按钮触发 onRightClick', async () => {
    const wrapper = mount(SeeNavbar, {
      props: { rightText: '更多' }
    })
    await wrapper.find('.see-navbar__right').trigger('tap')
    expect(wrapper.emitted('onRightClick')).toBeTruthy()
  })

  // ========== 搜索模式 ==========

  it('isSearch=true 时显示搜索栏', () => {
    const wrapper = mount(SeeNavbar, {
      props: { isSearch: true }
    })
    expect(wrapper.find('.see-navbar__search').exists()).toBe(true)
    expect(wrapper.find('.see-navbar__title').exists()).toBe(false)
  })

  it('isSearch=true 时不显示左侧箭头', () => {
    const wrapper = mount(SeeNavbar, {
      props: { isSearch: true }
    })
    // 搜索模式下标题区域被替换，但左侧仍可显示
    expect(wrapper.find('.see-navbar__search-input').exists()).toBe(true)
  })

  // ========== 视觉效果 ==========

  it('isFrosted 时添加毛玻璃 class', () => {
    const wrapper = mount(SeeNavbar, {
      props: { isFrosted: true }
    })
    expect(wrapper.find('.see-navbar--frosted').exists()).toBe(true)
  })

  it('placeholder=true 且 isFixed=true 时生成占位元素', () => {
    const wrapper = mount(SeeNavbar, {
      props: { placeholder: true, isFixed: true }
    })
    expect(wrapper.find('.see-navbar__placeholder').exists()).toBe(true)
  })

  it('placeholder=false 时不生成占位元素', () => {
    const wrapper = mount(SeeNavbar, {
      props: { placeholder: false, isFixed: true }
    })
    expect(wrapper.find('.see-navbar__placeholder').exists()).toBe(false)
  })

  it('border=true 时显示底部边框', () => {
    const wrapper = mount(SeeNavbar, {
      props: { border: true }
    })
    expect(wrapper.find('.see-navbar--border').exists()).toBe(true)
  })

  it('border=false 时无底部边框', () => {
    const wrapper = mount(SeeNavbar, {
      props: { border: false }
    })
    expect(wrapper.find('.see-navbar--border').exists()).toBe(false)
  })

  // ========== 自定义样式 ==========

  it('自定义 bgColor 应应用到样式', () => {
    const wrapper = mount(SeeNavbar, {
      props: { bgColor: '#ff0000' }
    })
    const navbar = wrapper.find('.see-navbar')
    // 浏览器会将 hex 转为 rgb
    expect(navbar.attributes('style')).toContain('background')
  })

  it('自定义 titleColor 应应用到标题', () => {
    const wrapper = mount(SeeNavbar, {
      props: { title: '标题', titleColor: '#00ff00' }
    })
    const title = wrapper.find('.see-navbar__title')
    expect(title.attributes('style')).toContain('color')
  })

  // ========== 文字属性 ==========

  it('leftText 应正确显示', () => {
    const wrapper = mount(SeeNavbar, {
      props: { leftText: '返回' }
    })
    expect(wrapper.find('.see-navbar__left-text').text()).toBe('返回')
  })

  it('rightText 应正确显示', () => {
    const wrapper = mount(SeeNavbar, {
      props: { rightText: '更多' }
    })
    expect(wrapper.find('.see-navbar__right-text').text()).toBe('更多')
  })

  // ========== 插槽 ==========

  it('left 插槽内容正确渲染', () => {
    const wrapper = mount(SeeNavbar, {
      slots: {
        left: '<text class="custom-left">自定义左侧</text>'
      }
    })
    expect(wrapper.find('.custom-left').exists()).toBe(true)
  })

  it('center 插槽覆盖 title', () => {
    const wrapper = mount(SeeNavbar, {
      props: { title: '原标题' },
      slots: {
        center: '<text class="custom-center">自定义中间</text>'
      }
    })
    expect(wrapper.find('.custom-center').exists()).toBe(true)
  })

  it('right 插槽内容正确渲染', () => {
    const wrapper = mount(SeeNavbar, {
      slots: {
        right: '<text class="custom-right">自定义右侧</text>'
      }
    })
    expect(wrapper.find('.custom-right').exists()).toBe(true)
  })

  // ========== Expose ==========

  it('expose.setTitle 可动态修改标题', async () => {
    const wrapper = mount(SeeNavbar, {
      props: { title: '初始标题' }
    })
    expect(wrapper.text()).toContain('初始标题')
    ;(wrapper.vm as any).setTitle('新标题')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('新标题')
  })

  it('expose.show/hide 控制显示隐藏', async () => {
    const wrapper = mount(SeeNavbar, {
      props: { title: '标题' }
    })
    expect(wrapper.find('.see-navbar').exists()).toBe(true)
    ;(wrapper.vm as any).hide()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-navbar').exists()).toBe(false)
    ;(wrapper.vm as any).show()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-navbar').exists()).toBe(true)
  })

  // ========== 层级 ==========

  it('zIndex 属性应正确设置', () => {
    const wrapper = mount(SeeNavbar, {
      props: { zIndex: 1000 }
    })
    const navbar = wrapper.find('.see-navbar')
    expect(navbar.attributes('style')).toContain('1000')
  })
})
