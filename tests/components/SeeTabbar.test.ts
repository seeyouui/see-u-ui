import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeTabbar from '../../uni_modules/see-u-ui/components/see-tabbar/see-tabbar.vue'

const mockTabs = [
  { name: 'home', text: '首页', icon: '🏠' },
  { name: 'category', text: '分类', icon: '📂' },
  { name: 'cart', text: '购物车', icon: '🛒', badge: 3 },
  { name: 'mine', text: '我的', icon: '👤' }
]

const mockTabsWithCenter = [
  { name: 'home', text: '首页', icon: '🏠' },
  { name: 'category', text: '分类', icon: '📂' },
  { name: 'publish', text: '发布', icon: '➕', isCenter: true, centerIcon: '✚' },
  { name: 'cart', text: '购物车', icon: '🛒' },
  { name: 'mine', text: '我的', icon: '👤' }
]

describe('SeeTabbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ========== 基础渲染 ==========

  it('基础渲染', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs } })
    expect(wrapper.find('.see-tabbar').exists()).toBe(true)
  })

  it('渲染正确的 tab 数量', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs } })
    const items = wrapper.findAll('.see-tabbar__item')
    expect(items.length).toBe(4)
  })

  it('渲染 tab 文字', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs } })
    expect(wrapper.text()).toContain('首页')
    expect(wrapper.text()).toContain('分类')
  })

  // ========== Tab 切换 ==========

  it('点击 tab 触发 onChange', async () => {
    const wrapper = mount(SeeTabbar, {
      props: { tabs: mockTabs, modelValue: 'home' }
    })
    await wrapper.findAll('.see-tabbar__item')[1].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeTruthy()
    expect(wrapper.emitted('onChange')![0]).toEqual(['category', 1])
  })

  it('点击 tab 触发 update:modelValue', async () => {
    const wrapper = mount(SeeTabbar, {
      props: { tabs: mockTabs, modelValue: 'home' }
    })
    await wrapper.findAll('.see-tabbar__item')[1].trigger('tap')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['category'])
  })

  it('点击当前选中的 tab 不触发 onChange', async () => {
    const wrapper = mount(SeeTabbar, {
      props: { tabs: mockTabs, modelValue: 'home' }
    })
    await wrapper.findAll('.see-tabbar__item')[0].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  it('点击 tab 触发 onClick', async () => {
    const wrapper = mount(SeeTabbar, {
      props: { tabs: mockTabs, modelValue: 'home' }
    })
    await wrapper.findAll('.see-tabbar__item')[1].trigger('tap')
    expect(wrapper.emitted('onClick')).toBeTruthy()
  })

  // ========== Badge ==========

  it('Badge 渲染', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs } })
    const badges = wrapper.findAll('.see-tabbar__badge')
    expect(badges.length).toBe(1)
    expect(badges[0].text()).toBe('3')
  })

  it('Dot 渲染', () => {
    const tabsWithDot = [
      { name: 'home', text: '首页', icon: '🏠' },
      { name: 'msg', text: '消息', icon: '💬', dot: true }
    ]
    const wrapper = mount(SeeTabbar, { props: { tabs: tabsWithDot } })
    expect(wrapper.find('.see-tabbar__dot').exists()).toBe(true)
  })

  // ========== 中央凸起按钮 ==========

  it('中央凸起按钮渲染', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabsWithCenter } })
    expect(wrapper.find('.see-tabbar__center-btn').exists()).toBe(true)
  })

  it('点击中央按钮触发 onCenterClick', async () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabsWithCenter } })
    await wrapper.find('.see-tabbar__center-btn').trigger('tap')
    expect(wrapper.emitted('onCenterClick')).toBeTruthy()
  })

  it('点击中央按钮不触发 onChange', async () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabsWithCenter, modelValue: 'home' } })
    await wrapper.find('.see-tabbar__center-btn').trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  // ========== 禁用 ==========

  it('禁用的 tab 不响应点击', async () => {
    const tabsWithDisabled = [
      { name: 'home', text: '首页', icon: '🏠' },
      { name: 'disabled', text: '禁用', icon: '🚫', isDisabled: true }
    ]
    const wrapper = mount(SeeTabbar, {
      props: { tabs: tabsWithDisabled, modelValue: 'home' }
    })
    await wrapper.findAll('.see-tabbar__item')[1].trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  // ========== 样式 ==========

  it('isFixed=true 时 fixed 定位', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs, isFixed: true } })
    expect(wrapper.find('.see-tabbar--fixed').exists()).toBe(true)
  })

  it('isFrosted 时添加毛玻璃 class', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs, isFrosted: true } })
    expect(wrapper.find('.see-tabbar--frosted').exists()).toBe(true)
  })

  it('border=true 时显示顶部边框', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs, border: true } })
    expect(wrapper.find('.see-tabbar--border').exists()).toBe(true)
  })

  it('border=false 时无顶部边框', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs, border: false } })
    expect(wrapper.find('.see-tabbar--border').exists()).toBe(false)
  })

  it('自定义 bgColor 应应用到样式', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs, bgColor: '#f5f5f5' } })
    const tabbar = wrapper.find('.see-tabbar')
    const style = tabbar.attributes('style') || ''
    expect(style).toContain('background')
  })

  it('placeholder=true 且 isFixed=true 时生成占位元素', () => {
    const wrapper = mount(SeeTabbar, { props: { tabs: mockTabs, placeholder: true, isFixed: true } })
    expect(wrapper.find('.see-tabbar__placeholder').exists()).toBe(true)
  })

  // ========== Expose ==========

  it('expose.switchTab 可切换 tab', async () => {
    const wrapper = mount(SeeTabbar, {
      props: { tabs: mockTabs, modelValue: 'home' }
    })
    ;(wrapper.vm as any).switchTab('cart')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['cart'])
  })
})
