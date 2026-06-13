import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeIndexList from '../../uni_modules/see-u-ui/components/see-index-list/see-index-list.vue'

const mockData = [
  { index: 'A', name: 'Alice' },
  { index: 'A', name: 'Andy' },
  { index: 'B', name: 'Bob' },
  { index: 'C', name: 'Charlie' },
  { index: 'D', name: 'David' }
]

describe('SeeIndexList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基础渲染', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData }
    })
    expect(wrapper.find('.see-index-list').exists()).toBe(true)
  })

  it('渲染数据项', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData }
    })
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
  })

  it('按索引分组', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData }
    })
    // 应该有 A, B, C, D 四个分组标题
    expect(wrapper.findAll('.see-index-list__header').length).toBe(4)
  })

  it('分组标题显示正确', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData }
    })
    const headers = wrapper.findAll('.see-index-list__header-text')
    expect(headers[0].text()).toBe('A')
    expect(headers[1].text()).toBe('B')
  })

  it('分组内项目数量正确', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData }
    })
    // A 组有 2 个项目
    const items = wrapper.findAll('.see-index-list__item')
    expect(items.length).toBe(5)
  })

  it('右侧导航条渲染', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData }
    })
    expect(wrapper.find('.see-index-list__nav').exists()).toBe(true)
    expect(wrapper.findAll('.see-index-list__nav-item').length).toBe(4)
  })

  it('点击项目触发 onSelect', async () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData }
    })
    await wrapper.find('.see-index-list__item').trigger('tap')
    expect(wrapper.emitted('onSelect')).toBeTruthy()
    expect(wrapper.emitted('onSelect')![0]).toEqual([mockData[0]])
  })

  it('搜索框显示', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData, isShowSearch: true }
    })
    expect(wrapper.find('.see-index-list__search').exists()).toBe(true)
  })

  it('搜索框隐藏', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData, isShowSearch: false }
    })
    expect(wrapper.find('.see-index-list__search').exists()).toBe(false)
  })

  it('空数据显示', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: [] }
    })
    expect(wrapper.find('.see-index-list__empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('No Data')
  })

  it('单分组场景', () => {
    const singleGroupData = [
      { index: 'A', name: 'Alice' },
      { index: 'A', name: 'Andy' }
    ]
    const wrapper = mount(SeeIndexList, {
      props: { data: singleGroupData }
    })
    expect(wrapper.findAll('.see-index-list__header').length).toBe(1)
  })

  it('自定义索引列表', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData, indexList: ['A', 'B', 'C', 'D', 'E'] }
    })
    expect(wrapper.findAll('.see-index-list__nav-item').length).toBe(5)
  })

  it('分组标题吸顶', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData, isStickyHeader: true }
    })
    expect(wrapper.find('.see-index-list__header--sticky').exists()).toBe(true)
  })

  it('自定义高度', () => {
    const wrapper = mount(SeeIndexList, {
      props: { data: mockData, height: '500px' }
    })
    const style = wrapper.find('.see-index-list').attributes('style') || ''
    expect(style).toContain('500px')
  })

  it('按拼音排序', () => {
    const pinyinData = [
      { index: 'Z', name: '张三' },
      { index: 'A', name: '李四' },
      { index: 'B', name: '王五' }
    ]
    const wrapper = mount(SeeIndexList, {
      props: { data: pinyinData }
    })
    const headers = wrapper.findAll('.see-index-list__header-text')
    // 应该按 A, B, Z 排序
    expect(headers[0].text()).toBe('A')
    expect(headers[1].text()).toBe('B')
    expect(headers[2].text()).toBe('Z')
  })

  it('大量数据渲染', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      index: String.fromCharCode(65 + (i % 26)),
      name: `Item ${i}`
    }))
    const wrapper = mount(SeeIndexList, {
      props: { data: largeData }
    })
    expect(wrapper.findAll('.see-index-list__item').length).toBe(100)
  })
})
