import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeeCityLocate from '../../uni_modules/see-u-ui/components/see-city-locate/see-city-locate.vue'
import { builtinCities, defaultHotCities } from '../../uni_modules/see-u-ui/components/see-city-locate/city-data'

describe('SeeCityLocate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('基础渲染', () => {
    const wrapper = mount(SeeCityLocate)
    expect(wrapper.find('.see-city-locate').exists()).toBe(true)
  })

  it('搜索框显示', () => {
    const wrapper = mount(SeeCityLocate, {
      props: { isShowSearch: true }
    })
    expect(wrapper.find('.see-city-locate__search').exists()).toBe(true)
  })

  it('搜索框隐藏', () => {
    const wrapper = mount(SeeCityLocate, {
      props: { isShowSearch: false }
    })
    expect(wrapper.find('.see-city-locate__search').exists()).toBe(false)
  })

  it('定位区域显示', () => {
    const wrapper = mount(SeeCityLocate, {
      props: { isShowLocation: true }
    })
    expect(wrapper.find('.see-city-locate__location').exists()).toBe(true)
  })

  it('定位区域隐藏', () => {
    const wrapper = mount(SeeCityLocate, {
      props: { isShowLocation: false }
    })
    expect(wrapper.find('.see-city-locate__location').exists()).toBe(false)
  })

  it('热门城市渲染', () => {
    const wrapper = mount(SeeCityLocate)
    expect(wrapper.find('.see-city-locate__hot').exists()).toBe(true)
    expect(wrapper.text()).toContain('北京')
    expect(wrapper.text()).toContain('上海')
  })

  it('自定义热门城市', () => {
    const customHot = [
      { id: 'custom1', name: '自定义1', level: 'city' as const },
      { id: 'custom2', name: '自定义2', level: 'city' as const }
    ]
    const wrapper = mount(SeeCityLocate, {
      props: { hotCities: customHot }
    })
    expect(wrapper.text()).toContain('自定义1')
    expect(wrapper.text()).toContain('自定义2')
  })

  it('城市列表渲染', () => {
    const wrapper = mount(SeeCityLocate)
    expect(wrapper.text()).toContain('北京')
    expect(wrapper.text()).toContain('上海')
    expect(wrapper.text()).toContain('广州')
  })

  it('按字母分组', () => {
    const wrapper = mount(SeeCityLocate)
    // 应该有分组标题
    expect(wrapper.findAll('.see-city-locate__group-header').length).toBeGreaterThan(0)
  })

  it('右侧索引导航条', () => {
    const wrapper = mount(SeeCityLocate)
    expect(wrapper.find('.see-city-locate__nav').exists()).toBe(true)
    expect(wrapper.findAll('.see-city-locate__nav-item').length).toBeGreaterThan(0)
  })

  it('点击城市触发 onSelect', async () => {
    const wrapper = mount(SeeCityLocate)
    await wrapper.find('.see-city-locate__city-item').trigger('tap')
    expect(wrapper.emitted('onSelect')).toBeTruthy()
  })

  it('点击热门城市触发 onSelect', async () => {
    const wrapper = mount(SeeCityLocate)
    await wrapper.find('.see-city-locate__hot-item').trigger('tap')
    expect(wrapper.emitted('onSelect')).toBeTruthy()
  })

  it('自定义城市数据', () => {
    const customCities = [
      { id: 'c1', name: '城市A', firstLetter: 'A', level: 'city' as const },
      { id: 'c2', name: '城市B', firstLetter: 'B', level: 'city' as const }
    ]
    const wrapper = mount(SeeCityLocate, {
      props: { cities: customCities }
    })
    expect(wrapper.text()).toContain('城市A')
    expect(wrapper.text()).toContain('城市B')
  })

  it('自定义搜索占位文字', () => {
    const wrapper = mount(SeeCityLocate, {
      props: { searchPlaceholder: '输入城市名' }
    })
    const input = wrapper.find('.see-city-locate__search-input')
    expect(input.attributes('placeholder')).toBe('输入城市名')
  })

  it('自定义定位文字', () => {
    const wrapper = mount(SeeCityLocate, {
      props: { locateText: '获取位置...' }
    })
    expect(wrapper.text()).toContain('获取位置...')
  })

  it('空城市数据不崩溃', () => {
    const wrapper = mount(SeeCityLocate, {
      props: { cities: [], hotCities: [] }
    })
    expect(wrapper.find('.see-city-locate').exists()).toBe(true)
  })

  it('最近访问区域显示', () => {
    const wrapper = mount(SeeCityLocate, {
      props: { isShowHistory: true }
    })
    // 初始状态没有最近访问
    expect(wrapper.find('.see-city-locate__history').exists()).toBe(false)
  })

  it('内置城市数据加载', () => {
    expect(builtinCities.length).toBeGreaterThan(0)
    expect(defaultHotCities.length).toBeGreaterThan(0)
  })

  it('城市数据包含必要字段', () => {
    const city = builtinCities[0]
    expect(city).toHaveProperty('id')
    expect(city).toHaveProperty('name')
    expect(city).toHaveProperty('pinyin')
    expect(city).toHaveProperty('firstLetter')
    expect(city).toHaveProperty('level')
  })
})
