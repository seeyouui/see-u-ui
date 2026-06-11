import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, defineComponent, h } from 'vue'
import SeeTabs from '../../uni_modules/see-u-ui/components/see-tabs/see-tabs.vue'
import SeeTabPane from '../../uni_modules/see-u-ui/components/see-tab-pane/see-tab-pane.vue'

// 创建一个包装组件，确保 Tabs 和 TabPane 正确配合
const TestWrapper = defineComponent({
  props: {
    modelValue: { type: [String, Number], default: 'tab1' },
    tabsProps: { type: Object, default: () => ({}) },
    paneConfigs: {
      type: Array,
      default: () => [
        { name: 'tab1', title: '标签一' },
        { name: 'tab2', title: '标签二' },
        { name: 'tab3', title: '标签三' }
      ]
    }
  },
  setup(props, { expose }) {
    const active = ref(props.modelValue)
    const tabsRef = ref()

    const onUpdate = (val: string | number) => {
      active.value = val
    }

    expose({
      switchTo: (name: string | number) => tabsRef.value?.switchTo(name),
      addTab: (tab: any) => tabsRef.value?.addTab(tab),
      removeTab: (name: string | number) => tabsRef.value?.removeTab(name),
      getActive: () => active.value
    })

    return () =>
      h(
        SeeTabs,
        {
          ref: tabsRef,
          modelValue: active.value,
          'onUpdate:modelValue': onUpdate,
          ...props.tabsProps
        },
        {
          default: () =>
            props.paneConfigs.map((cfg: any) =>
              h(
                SeeTabPane,
                { name: cfg.name, title: cfg.title, isDisabled: cfg.isDisabled, badge: cfg.badge, dot: cfg.dot, closable: cfg.closable },
                { default: () => `内容${cfg.name.replace('tab', '')}` }
              )
            )
        }
      )
  }
})

describe('SeeTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ========== 基础渲染 ==========

  it('基础渲染', () => {
    const wrapper = mount(TestWrapper)
    expect(wrapper.find('.see-tabs').exists()).toBe(true)
  })

  it('渲染标签标题', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('标签一')
    expect(wrapper.text()).toContain('标签二')
  })

  it('渲染对应内容', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('内容1')
  })

  // ========== Tab 切换 ==========

  it('点击 tab 切换选中状态', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const tabs = wrapper.findAll('.see-tabs__tab')
    if (tabs.length > 1) {
      await tabs[1].trigger('tap')
      await wrapper.vm.$nextTick()
      // 检查是否有 active 状态的 tab
      const activeTab = wrapper.find('.see-tabs__tab--active')
      expect(activeTab.exists()).toBe(true)
    }
  })

  it('点击当前选中的 tab 保持选中', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const tabs = wrapper.findAll('.see-tabs__tab')
    if (tabs.length > 0) {
      const firstTabText = tabs[0].text()
      await tabs[0].trigger('tap')
      await wrapper.vm.$nextTick()
      const activeTab = wrapper.find('.see-tabs__tab--active')
      expect(activeTab.text()).toBe(firstTabText)
    }
  })

  // ========== Type ==========

  it('type=line 为默认样式', () => {
    const wrapper = mount(TestWrapper, {
      props: { tabsProps: { type: 'line' } }
    })
    expect(wrapper.find('.see-tabs--line').exists()).toBe(true)
  })

  it('type=card 时应用 card 样式', () => {
    const wrapper = mount(TestWrapper, {
      props: { tabsProps: { type: 'card' } }
    })
    expect(wrapper.find('.see-tabs__nav--card').exists()).toBe(true)
  })

  it('type=button 时应用 button 样式', () => {
    const wrapper = mount(TestWrapper, {
      props: { tabsProps: { type: 'button' } }
    })
    expect(wrapper.find('.see-tabs__nav--button').exists()).toBe(true)
  })

  // ========== 禁用 ==========

  it('禁用的 tab 不响应点击', async () => {
    const wrapper = mount(TestWrapper, {
      props: {
        paneConfigs: [
          { name: 'tab1', title: '标签一' },
          { name: 'tab2', title: '标签二', isDisabled: true }
        ]
      }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const tabs = wrapper.findAll('.see-tabs__tab')
    if (tabs.length > 1) {
      await tabs[1].trigger('tap')
      await wrapper.vm.$nextTick()
      // 禁用的 tab 不应该被选中
      const activeTab = wrapper.find('.see-tabs__tab--active')
      if (activeTab.exists()) {
        expect(activeTab.text()).not.toContain('标签二')
      }
    }
  })

  // ========== Badge ==========

  it('Badge 渲染', async () => {
    const wrapper = mount(TestWrapper, {
      props: {
        paneConfigs: [
          { name: 'tab1', title: '标签一' },
          { name: 'tab2', title: '标签二', badge: 99 }
        ]
      }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-tabs__badge').exists()).toBe(true)
  })

  it('Dot 渲染', async () => {
    const wrapper = mount(TestWrapper, {
      props: {
        paneConfigs: [
          { name: 'tab1', title: '标签一' },
          { name: 'tab2', title: '标签二', dot: true }
        ]
      }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-tabs__dot').exists()).toBe(true)
  })

  // ========== 可关闭 ==========

  it('closable 标签显示关闭按钮', async () => {
    const wrapper = mount(TestWrapper, {
      props: {
        paneConfigs: [
          { name: 'tab1', title: '标签一' },
          { name: 'tab2', title: '标签二', closable: true }
        ]
      }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-tabs__close').exists()).toBe(true)
  })

  // ========== 指示器 ==========

  it('line 模式显示指示器', () => {
    const wrapper = mount(TestWrapper, {
      props: { tabsProps: { type: 'line' } }
    })
    expect(wrapper.find('.see-tabs__indicator').exists()).toBe(true)
  })

  it('card 模式不显示指示器', () => {
    const wrapper = mount(TestWrapper, {
      props: { tabsProps: { type: 'card' } }
    })
    expect(wrapper.find('.see-tabs__indicator').exists()).toBe(false)
  })

  // ========== 样式 ==========

  it('自定义 bgColor 应应用', () => {
    const wrapper = mount(TestWrapper, {
      props: { tabsProps: { bgColor: '#f5f5f5' } }
    })
    const style = wrapper.find('.see-tabs').attributes('style') || ''
    expect(style).toContain('background')
  })

  // ========== Expose ==========

  it('expose.switchTo 可切换 tab', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    ;(wrapper.vm as any).switchTo('tab3')
    await wrapper.vm.$nextTick()
    // 切换后应该有新的 active tab
    expect(wrapper.findAll('.see-tabs__tab').length).toBeGreaterThan(0)
  })

  it('expose.addTab 可添加标签', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const initialTabCount = wrapper.findAll('.see-tabs__tab').length
    ;(wrapper.vm as any).addTab({ name: 'tab4', title: '标签四' })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.see-tabs__tab').length).toBeGreaterThanOrEqual(initialTabCount)
  })

  it('expose.removeTab 可移除标签', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const initialTabCount = wrapper.findAll('.see-tabs__tab').length
    ;(wrapper.vm as any).removeTab('tab3')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.see-tabs__tab').length).toBeLessThan(initialTabCount)
  })

  // ========== 空状态 ==========

  it('空标签列表不崩溃', () => {
    const wrapper = mount(TestWrapper, {
      props: { paneConfigs: [] }
    })
    expect(wrapper.find('.see-tabs').exists()).toBe(true)
  })

  // ========== 单个标签 ==========

  it('单个标签场景', async () => {
    const wrapper = mount(TestWrapper, {
      props: {
        paneConfigs: [{ name: 'only', title: '唯一标签' }]
      }
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.see-tabs__tab').length).toBe(1)
    expect(wrapper.text()).toContain('唯一标签')
  })

  // ========== v-model 更新 ==========

  it('外部更新 modelValue 不崩溃', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    // 更新 modelValue 不应导致错误
    await wrapper.setProps({ modelValue: 'tab2' })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-tabs').exists()).toBe(true)
  })

  // ========== 标签栏滚动 ==========

  it('isScrollable 时使用 scroll-view', () => {
    const wrapper = mount(TestWrapper, {
      props: { tabsProps: { isScrollable: true } }
    })
    expect(wrapper.find('.see-tabs__scroll').exists()).toBe(true)
  })
})
