import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SeeDropdown from '../../uni_modules/see-u-ui/components/see-dropdown/see-dropdown.vue'
import SeeDropdownItem from '../../uni_modules/see-u-ui/components/see-dropdown-item/see-dropdown-item.vue'

// 创建一个包装组件
const TestWrapper = defineComponent({
  props: {
    dropdownProps: { type: Object, default: () => ({}) },
    itemConfigs: {
      type: Array,
      default: () => [
        { name: 'sort', title: '排序' },
        { name: 'filter', title: '筛选' }
      ]
    }
  },
  setup(props, { expose }) {
    const dropdownRef = ref()

    expose({
      open: (name: string) => dropdownRef.value?.open(name),
      close: (name: string) => dropdownRef.value?.close(name),
      closeAll: () => dropdownRef.value?.closeAll()
    })

    return () =>
      h(
        SeeDropdown,
        { ref: dropdownRef, ...props.dropdownProps },
        {
          menu: () =>
            props.itemConfigs.map((cfg: any) =>
              h(SeeDropdownItem, {
                name: cfg.name,
                title: cfg.title,
                isDisabled: cfg.isDisabled,
                menuType: cfg.menuType
              })
            ),
          panels: () => props.itemConfigs.map((cfg: any) => h('view', { class: `panel-${cfg.name}`, key: cfg.name }, `${cfg.title}面板内容`))
        }
      )
  }
})

import { ref } from 'vue'

describe('SeeDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基础渲染', () => {
    const wrapper = mount(TestWrapper)
    expect(wrapper.find('.see-dropdown').exists()).toBe(true)
  })

  it('渲染菜单项', () => {
    const wrapper = mount(TestWrapper)
    expect(wrapper.text()).toContain('排序')
    expect(wrapper.text()).toContain('筛选')
  })

  it('正确数量的菜单项', () => {
    const wrapper = mount(TestWrapper)
    expect(wrapper.findAll('.see-dropdown-item').length).toBe(2)
  })

  it('点击菜单项展开面板', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(true)
  })

  it('再次点击菜单项关闭面板', async () => {
    const wrapper = mount(TestWrapper)
    // 点击展开
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(true)
    // 再次点击关闭
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(false)
  })

  it('点击不同菜单项切换面板', async () => {
    const wrapper = mount(TestWrapper)
    // 点击第一个
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.panel-sort').text()).toContain('排序')
    // 点击第二个
    await wrapper.findAll('.see-dropdown-item')[1].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.panel-filter').text()).toContain('筛选')
  })

  it('展开时菜单项有 active 样式', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.see-dropdown-item')[0].classes()).toContain('see-dropdown-item--active')
  })

  it('遮罩层显示', async () => {
    const wrapper = mount(TestWrapper, {
      props: { dropdownProps: { isOverlay: true } }
    })
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__overlay').exists()).toBe(true)
  })

  it('点击遮罩层关闭面板', async () => {
    const wrapper = mount(TestWrapper, {
      props: { dropdownProps: { isOverlay: true, closeOnClickOverlay: true } }
    })
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(true)
    await wrapper.find('.see-dropdown__overlay').trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(false)
  })

  it('禁用的菜单项不响应点击', async () => {
    const wrapper = mount(TestWrapper, {
      props: {
        itemConfigs: [
          { name: 'sort', title: '排序' },
          { name: 'disabled', title: '禁用', isDisabled: true }
        ]
      }
    })
    await wrapper.findAll('.see-dropdown-item')[1].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(false)
  })

  it('禁用项有 disabled 样式', () => {
    const wrapper = mount(TestWrapper, {
      props: {
        itemConfigs: [
          { name: 'sort', title: '排序' },
          { name: 'disabled', title: '禁用', isDisabled: true }
        ]
      }
    })
    expect(wrapper.findAll('.see-dropdown-item')[1].classes()).toContain('see-dropdown-item--disabled')
  })

  it('菜单项箭头方向随展开状态变化', async () => {
    const wrapper = mount(TestWrapper)
    // 初始状态箭头向下
    expect(wrapper.find('.see-dropdown-item__arrow--up').exists()).toBe(false)
    // 展开后箭头向上
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown-item__arrow--up').exists()).toBe(true)
  })

  it('expose.open 可打开指定面板', async () => {
    const wrapper = mount(TestWrapper)
    ;(wrapper.vm as any).open('sort')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(true)
  })

  it('expose.close 可关闭指定面板', async () => {
    const wrapper = mount(TestWrapper)
    ;(wrapper.vm as any).open('sort')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(true)
    ;(wrapper.vm as any).close('sort')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(false)
  })

  it('expose.closeAll 可关闭所有面板', async () => {
    const wrapper = mount(TestWrapper)
    ;(wrapper.vm as any).open('sort')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(true)
    ;(wrapper.vm as any).closeAll()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(false)
  })

  it('单个菜单项场景', () => {
    const wrapper = mount(TestWrapper, {
      props: {
        itemConfigs: [{ name: 'only', title: '唯一选项' }]
      }
    })
    expect(wrapper.findAll('.see-dropdown-item').length).toBe(1)
    expect(wrapper.text()).toContain('唯一选项')
  })

  it('isOverlay=false 时不显示遮罩', async () => {
    const wrapper = mount(TestWrapper, {
      props: { dropdownProps: { isOverlay: false } }
    })
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.see-dropdown__overlay').exists()).toBe(false)
  })

  it('展开面板时显示选项标题', async () => {
    const wrapper = mount(TestWrapper)
    await wrapper.findAll('.see-dropdown-item')[0].trigger('tap')
    await wrapper.vm.$nextTick()
    // 面板内容应该可见
    expect(wrapper.find('.see-dropdown__panels').exists()).toBe(true)
  })
})
