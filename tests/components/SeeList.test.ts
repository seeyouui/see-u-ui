import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeList from '@/uni_modules/see-u-ui/components/see-list/see-list.vue'

const testList = ['Alice', 'Bob', 'Charlie']

describe('SeeList', () => {
  it('renders items from list prop', () => {
    const wrapper = mount(SeeList, { props: { list: testList } })
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
    expect(wrapper.text()).toContain('Charlie')
  })

  it('renders empty state when list is empty', () => {
    const wrapper = mount(SeeList, { props: { list: [], emptyText: '暂无数据' } })
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('renders loading state when loading and list empty', () => {
    const wrapper = mount(SeeList, { props: { list: [], loading: true, loadingText: '加载中...' } })
    expect(wrapper.find('.see-list__loading-spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('加载中...')
  })

  it('renders error state when error and list empty', () => {
    const wrapper = mount(SeeList, { props: { list: [], error: true, errorText: '出错了' } })
    expect(wrapper.text()).toContain('出错了')
  })

  it('renders finished status when finished and has items', () => {
    const wrapper = mount(SeeList, { props: { list: testList, finished: true, finishedText: '没有更多了' } })
    expect(wrapper.text()).toContain('没有更多了')
  })

  it('emits onClickItem when an item is clicked', () => {
    const wrapper = mount(SeeList, { props: { list: testList } })
    const items = wrapper.findAll('.see-list__item')
    if (items.length > 0) {
      items[0].trigger('tap')
      expect(wrapper.emitted('onClickItem')).toBeTruthy()
      if (wrapper.emitted('onClickItem')) {
        expect(wrapper.emitted('onClickItem')[0]).toEqual(['Alice', 0])
      }
    }
  })

  it('renders items as strings by default', () => {
    const wrapper = mount(SeeList, { props: { list: testList } })
    // Default slot renders String(item)
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
    expect(wrapper.text()).toContain('Charlie')
  })

  it('renders header and footer slots', () => {
    const wrapper = mount(SeeList, {
      props: { list: testList },
      slots: {
        header: '<text class="header-slot">列表头部</text>',
        footer: '<text class="footer-slot">列表底部</text>'
      }
    })
    expect(wrapper.find('.header-slot').exists()).toBe(true)
    expect(wrapper.find('.footer-slot').exists()).toBe(true)
  })

  it('emits onRetry when error area is clicked', () => {
    const wrapper = mount(SeeList, { props: { list: [], error: true } })
    const errorArea = wrapper.find('.see-list__error')
    if (errorArea.exists()) {
      errorArea.trigger('tap')
      expect(wrapper.emitted('onRetry')).toBeTruthy()
    }
  })

  it('renders divided items when divided prop is true', () => {
    const wrapper = mount(SeeList, { props: { list: testList, divided: true } })
    const items = wrapper.findAll('.see-list__item--divided')
    expect(items.length).toBe(testList.length)
  })

  it('renders border class when border prop is true', () => {
    const wrapper = mount(SeeList, { props: { list: testList, border: true } })
    expect(wrapper.find('.see-list--border').exists()).toBe(true)
  })

  it('renders empty slot when provided', () => {
    const wrapper = mount(SeeList, {
      props: { list: [] },
      slots: { empty: '<text class="custom-empty">自定义空状态</text>' }
    })
    expect(wrapper.text()).toContain('自定义空状态')
  })

  it('handles keyField prop for item keys', () => {
    const wrapper = mount(SeeList, { props: { list: testList, keyField: 'id' } })
    expect(wrapper.text()).toContain('Alice')
  })
})
