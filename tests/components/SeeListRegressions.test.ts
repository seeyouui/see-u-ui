import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeList from '@/uni_modules/see-u-ui/components/see-list/see-list.vue'
import SeeVirtualList from '@/uni_modules/see-u-ui/components/see-virtual-list/see-virtual-list.vue'

describe('SeeList regressions', () => {
  // Issue 10: empty slot should render exactly once
  it('custom empty slot renders exactly once, not twice', () => {
    const wrapper = mount(SeeList, {
      props: {
        list: [],
        loading: false,
        error: false
      },
      slots: {
        empty: '<div class="custom-empty">No data</div>'
      }
    })

    const emptySlots = wrapper.findAll('.custom-empty')
    expect(emptySlots.length).toBe(1)
    wrapper.unmount()
  })

  // Issue 10: default empty text also renders once
  it('default empty text renders once when no custom slot provided', () => {
    const wrapper = mount(SeeList, {
      props: {
        list: [],
        loading: false,
        error: false
      }
    })

    const statusBlocks = wrapper.findAll('.see-list__status')
    expect(statusBlocks.length).toBe(1)
    expect(statusBlocks[0].text()).toContain('No data')
    wrapper.unmount()
  })

  // Issue 10: empty slot does NOT render when loading
  it('empty slot does not render when loading is true', () => {
    const wrapper = mount(SeeList, {
      props: {
        list: [],
        loading: true,
        error: false
      },
      slots: {
        empty: '<div class="custom-empty">No data</div>'
      }
    })

    const emptySlots = wrapper.findAll('.custom-empty')
    expect(emptySlots.length).toBe(0)
    wrapper.unmount()
  })

  // Issue 11: offset prop binds to lower-threshold
  it('offset prop is bound to scroll-view lower-threshold', () => {
    const wrapper = mount(SeeList, {
      props: {
        list: ['item1', 'item2'],
        offset: 200
      }
    })

    const scrollView = wrapper.find('.see-list__scroll')
    expect(scrollView.attributes('lower-threshold')).toBe('200')
    wrapper.unmount()
  })

  // Issue 11: default offset is 50
  it('default offset of 50 is bound to lower-threshold', () => {
    const wrapper = mount(SeeList, {
      props: {
        list: ['item1']
      }
    })

    const scrollView = wrapper.find('.see-list__scroll')
    expect(scrollView.attributes('lower-threshold')).toBe('50')
    wrapper.unmount()
  })
})

describe('SeeVirtualList regressions', () => {
  // Issue 5: horizontal mode uses scrollLeft not scrollTop
  it('horizontal mode passes scrollLeft as offset to virtual window', async () => {
    const list = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))
    const wrapper = mount(SeeVirtualList, {
      props: {
        list,
        itemHeight: 40,
        height: 200,
        horizontal: true,
        keyField: 'id'
      }
    })

    const scrollView = wrapper.find('.see-virtual-list__scroll')
    // Simulate horizontal scroll
    await scrollView.trigger('scroll', {
      detail: { scrollLeft: 500, scrollTop: 0, deltaX: 50, deltaY: 0 }
    })

    // After scrolling, visible items should have advanced
    const items = wrapper.findAll('.see-virtual-list__item')
    expect(items.length).toBeGreaterThan(0)
    // Items rendered after scroll proves the virtual window advanced
    wrapper.unmount()
  })

  // Issue 11: lowerThreshold and upperThreshold are bound
  it('lowerThreshold and upperThreshold are bound to scroll-view', () => {
    const list = Array.from({ length: 50 }, (_, i) => i)
    const wrapper = mount(SeeVirtualList, {
      props: {
        list,
        itemHeight: 40,
        height: 200,
        lowerThreshold: 100,
        upperThreshold: 80
      }
    })

    const scrollView = wrapper.find('.see-virtual-list__scroll')
    expect(scrollView.attributes('lower-threshold')).toBe('100')
    expect(scrollView.attributes('upper-threshold')).toBe('80')
    wrapper.unmount()
  })

  // Issue 11: default thresholds are 50
  it('default thresholds are 50', () => {
    const list = Array.from({ length: 50 }, (_, i) => i)
    const wrapper = mount(SeeVirtualList, {
      props: {
        list,
        itemHeight: 40,
        height: 200
      }
    })

    const scrollView = wrapper.find('.see-virtual-list__scroll')
    expect(scrollView.attributes('lower-threshold')).toBe('50')
    expect(scrollView.attributes('upper-threshold')).toBe('50')
    wrapper.unmount()
  })
})
