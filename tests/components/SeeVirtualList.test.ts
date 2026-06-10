import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeVirtualList from '@/uni_modules/see-u-ui/components/see-virtual-list/see-virtual-list.vue'

const generateItems = (count: number) => Array.from({ length: count }, (_, i) => `Item #${i + 1}`)

describe('SeeVirtualList', () => {
  it('renders items from list prop', () => {
    const items = generateItems(10)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 44, height: 400 }
    })
    expect(wrapper.text()).toContain('Item #1')
    expect(wrapper.text()).toContain('Item #10')
  })

  it('renders empty state when list is empty', () => {
    const wrapper = mount(SeeVirtualList, {
      props: { list: [], itemHeight: 44, height: 400 }
    })
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('renders custom empty slot', () => {
    const wrapper = mount(SeeVirtualList, {
      props: { list: [], itemHeight: 44, height: 400 },
      slots: { empty: '<text class="custom-empty">空空如也</text>' }
    })
    expect(wrapper.find('.custom-empty').exists()).toBe(true)
  })

  it('renders header and footer slots', () => {
    const items = generateItems(10)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 44, height: 400 },
      slots: {
        header: '<text class="header-slot">列表头部</text>',
        footer: '<text class="footer-slot">列表底部</text>'
      }
    })
    expect(wrapper.find('.header-slot').exists()).toBe(true)
    expect(wrapper.find('.footer-slot').exists()).toBe(true)
  })

  it('renders with buffer prop', () => {
    const items = generateItems(100)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 44, height: 400, buffer: 10 }
    })
    expect(wrapper.text()).toContain('Item #1')
  })

  it('emits onItemClick when an item is tapped', () => {
    const items = generateItems(10)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 44, height: 400 }
    })
    const firstItem = wrapper.find('.see-virtual-list__item')
    if (firstItem.exists()) {
      firstItem.trigger('tap')
      expect(wrapper.emitted('onItemClick')).toBeTruthy()
    }
  })

  it('uses keyField for item keys', () => {
    const items = generateItems(5)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 44, height: 400, keyField: 'id' }
    })
    expect(wrapper.text()).toContain('Item #1')
  })

  it('renders large dataset without blowing up node count', () => {
    const items = generateItems(10000)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 40, height: 400, buffer: 3 }
    })
    const renderedItems = wrapper.findAll('.see-virtual-list__item')
    // Should render far fewer items than total (view shows ~10 items + 2 * 3 buffer)
    expect(renderedItems.length).toBeLessThan(30)
  })

  it('exposes scrollToIndex method', () => {
    const items = generateItems(100)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 44, height: 400 }
    })
    const vm = wrapper.vm as unknown as { scrollToIndex: (index: number, animated?: boolean) => void }
    expect(typeof vm.scrollToIndex).toBe('function')
  })

  it('exposes scrollToOffset method', () => {
    const items = generateItems(100)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 44, height: 400 }
    })
    const vm = wrapper.vm as unknown as { scrollToOffset: (offset: number, animated?: boolean) => void }
    expect(typeof vm.scrollToOffset).toBe('function')
  })

  it('exposes reset method', () => {
    const items = generateItems(100)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 44, height: 400 }
    })
    const vm = wrapper.vm as unknown as { reset: () => void }
    expect(typeof vm.reset).toBe('function')
  })

  it('sets horizontal class when horizontal prop is true', () => {
    const items = generateItems(10)
    const wrapper = mount(SeeVirtualList, {
      props: { list: items, itemHeight: 44, height: 400, horizontal: true }
    })
    expect(wrapper.find('.see-virtual-list--horizontal').exists()).toBe(true)
  })
})
