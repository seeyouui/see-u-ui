import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SeePagination from '../../uni_modules/see-u-ui/components/see-pagination/see-pagination.vue'

describe('SeePagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ========== 基础渲染 ==========

  it('基础渲染', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 100 }
    })
    expect(wrapper.find('.see-pagination').exists()).toBe(true)
  })

  // ========== button 模式 ==========

  it('button 模式渲染页码', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 100, mode: 'button' }
    })
    expect(wrapper.find('.see-pagination__current').exists()).toBe(true)
    expect(wrapper.text()).toContain('1')
  })

  it('button 模式显示总页数', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 100, pageSize: 10, mode: 'button' }
    })
    expect(wrapper.text()).toContain('10')
  })

  // ========== simple 模式 ==========

  it('simple 模式渲染', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 100, mode: 'simple' }
    })
    expect(wrapper.find('.see-pagination__simple-text').exists()).toBe(true)
    expect(wrapper.text()).toContain('1 / 10')
  })

  // ========== number 模式 ==========

  it('number 模式渲染页码', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 100, pageSize: 10, mode: 'number' }
    })
    expect(wrapper.findAll('.see-pagination__page').length).toBeGreaterThan(0)
  })

  it('number 模式总页数少于 maxPages 时全部显示', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 50, pageSize: 10, mode: 'number', maxPages: 7 }
    })
    // 5 页全部显示
    expect(wrapper.findAll('.see-pagination__page').length).toBe(5)
  })

  it('number 模式总页数大于 maxPages 时显示省略号', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 5, total: 200, pageSize: 10, mode: 'number', maxPages: 7 }
    })
    // 应该有省略号
    const ellipsis = wrapper.findAll('.see-pagination__page--ellipsis')
    expect(ellipsis.length).toBeGreaterThan(0)
  })

  it('当前页码高亮', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 3, total: 100, pageSize: 10, mode: 'number' }
    })
    const activePage = wrapper.find('.see-pagination__page--active')
    expect(activePage.exists()).toBe(true)
    expect(activePage.text()).toBe('3')
  })

  // ========== 翻页 ==========

  it('点击下一页触发 onChange', async () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 100, pageSize: 10, mode: 'button' }
    })
    const nextBtn = wrapper.findAll('.see-pagination__btn')[1]
    await nextBtn.trigger('tap')
    expect(wrapper.emitted('onChange')).toBeTruthy()
    expect(wrapper.emitted('onChange')![0]).toEqual([2, 10])
  })

  it('点击上一页触发 onChange', async () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 5, total: 100, pageSize: 10, mode: 'button' }
    })
    const prevBtn = wrapper.findAll('.see-pagination__btn')[0]
    await prevBtn.trigger('tap')
    expect(wrapper.emitted('onChange')).toBeTruthy()
    expect(wrapper.emitted('onChange')![0]).toEqual([4, 10])
  })

  it('第一页时上一页禁用', async () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 100, pageSize: 10, mode: 'button' }
    })
    const prevBtn = wrapper.findAll('.see-pagination__btn')[0]
    expect(prevBtn.classes()).toContain('see-pagination__btn--disabled')
    await prevBtn.trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  it('最后一页时下一页禁用', async () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 10, total: 100, pageSize: 10, mode: 'button' }
    })
    const nextBtn = wrapper.findAll('.see-pagination__btn')[1]
    expect(nextBtn.classes()).toContain('see-pagination__btn--disabled')
    await nextBtn.trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  // ========== number 模式点击页码 ==========

  it('number 模式点击页码触发 onChange', async () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 50, pageSize: 10, mode: 'number' }
    })
    const pages = wrapper.findAll('.see-pagination__page')
    await pages[2].trigger('tap') // 点击第 3 页
    expect(wrapper.emitted('onChange')).toBeTruthy()
  })

  it('number 模式点击省略号不触发', async () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 5, total: 200, pageSize: 10, mode: 'number', maxPages: 7 }
    })
    const ellipsis = wrapper.find('.see-pagination__page--ellipsis')
    if (ellipsis.exists()) {
      await ellipsis.trigger('tap')
      expect(wrapper.emitted('onChange')).toBeFalsy()
    }
  })

  // ========== 总数显示 ==========

  it('isShowTotal 显示总数', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 100, isShowTotal: true }
    })
    expect(wrapper.text()).toContain('100 items')
  })

  // ========== 自定义文字 ==========

  it('自定义 prevText 和 nextText', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 5, total: 100, mode: 'button', prevText: '上一页', nextText: '下一页' }
    })
    expect(wrapper.text()).toContain('上一页')
    expect(wrapper.text()).toContain('下一页')
  })

  // ========== 禁用 ==========

  it('全局禁用不响应点击', async () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 5, total: 100, mode: 'button', isDisabled: true }
    })
    const nextBtn = wrapper.findAll('.see-pagination__btn')[1]
    await nextBtn.trigger('tap')
    expect(wrapper.emitted('onChange')).toBeFalsy()
  })

  // ========== 空状态 ==========

  it('total=0 时不崩溃', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 0 }
    })
    expect(wrapper.find('.see-pagination').exists()).toBe(true)
  })

  // ========== 分页算法验证 ==========

  it('分页算法：第一页居前显示', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 1, total: 200, pageSize: 10, mode: 'number', maxPages: 7 }
    })
    const pages = wrapper.findAll('.see-pagination__page')
    expect(pages[0].text()).toBe('1')
  })

  it('分页算法：最后一页居后显示', () => {
    const wrapper = mount(SeePagination, {
      props: { modelValue: 20, total: 200, pageSize: 10, mode: 'number', maxPages: 7 }
    })
    const pages = wrapper.findAll('.see-pagination__page')
    expect(pages[pages.length - 1].text()).toBe('20')
  })
})
