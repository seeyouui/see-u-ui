import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeTable from '@/uni_modules/see-u-ui/components/see-table/see-table.vue'
import type { SeeTableColumn } from '@/uni_modules/see-u-ui/components/see-table/type'

/**
 * 虚拟行 BUG 回归测试
 *
 * 触发条件：height 传入"纯数字字符串"（如 height="400"）
 * 原 BUG：Vue 视其为非法 CSS 值，整段 style 被丢弃，scroll-view 失去固定高度，
 *   也就不再是滚动容器，scrollTop 永远为 0，永远只能看到首屏的前几条数据，
 *   后面的内容被 spacer 撑成空白。
 */
const largeData = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  age: 20 + (i % 30)
}))

const testColumns: SeeTableColumn[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 100, align: 'right' }
]

describe('SeeTable virtual height regression', () => {
  it('virtual + height as unitless numeric string "400" → wrapper must have height: 400px', () => {
    const wrapper = mount(SeeTable, {
      props: { data: largeData, columns: testColumns, virtual: true, rowHeight: 48, height: '400' }
    })
    const style = wrapper.find('.see-table__wrapper').attributes('style') || ''
    expect(style).toMatch(/height:\s*400px/)
  })

  it('virtual + height as number 400 → wrapper must have height: 400px', () => {
    const wrapper = mount(SeeTable, {
      props: { data: largeData, columns: testColumns, virtual: true, rowHeight: 48, height: 400 }
    })
    const style = wrapper.find('.see-table__wrapper').attributes('style') || ''
    expect(style).toMatch(/height:\s*400px/)
  })

  it('virtual + height as CSS string "400px" → wrapper must have height: 400px', () => {
    const wrapper = mount(SeeTable, {
      props: { data: largeData, columns: testColumns, virtual: true, rowHeight: 48, height: '400px' }
    })
    const style = wrapper.find('.see-table__wrapper').attributes('style') || ''
    expect(style).toMatch(/height:\s*400px/)
  })

  it('virtual + maxHeight unitless numeric string "400" → wrapper must have max-height: 400px', () => {
    const wrapper = mount(SeeTable, {
      props: { data: largeData, columns: testColumns, virtual: true, rowHeight: 48, maxHeight: '400' }
    })
    const style = wrapper.find('.see-table__wrapper').attributes('style') || ''
    expect(style).toMatch(/max-height:\s*400px/)
  })

  it('non-virtual + height as unitless string "400" → wrapper must have height: 400px', () => {
    const wrapper = mount(SeeTable, {
      props: { data: largeData.slice(0, 5), columns: testColumns, height: '400' }
    })
    const style = wrapper.find('.see-table__wrapper').attributes('style') || ''
    expect(style).toMatch(/height:\s*400px/)
  })

  it('non-virtual + maxHeight as unitless string "400" → wrapper must have max-height: 400px', () => {
    const wrapper = mount(SeeTable, {
      props: { data: largeData.slice(0, 5), columns: testColumns, maxHeight: '400' }
    })
    const style = wrapper.find('.see-table__wrapper').attributes('style') || ''
    expect(style).toMatch(/max-height:\s*400px/)
  })

  it('scrolling the virtual table updates the rendered rows', async () => {
    const wrapper = mount(SeeTable, {
      props: { data: largeData, columns: testColumns, virtual: true, rowHeight: 48, height: 400 }
    })
    expect(wrapper.findAll('.see-table__row')[0].text()).toContain('用户 1')

    const scrollWrapper = wrapper.find('.see-table__wrapper')
    const event = new CustomEvent('scroll', { detail: { scrollTop: 24000, scrollLeft: 0 } })
    scrollWrapper.element.dispatchEvent(event)
    await nextTick()

    // 滚动到 24000px (= 500 行)，首条渲染行应远离开头
    const firstAfter = wrapper.findAll('.see-table__row')[0].text()
    expect(firstAfter).toMatch(/用户\s(4|5)\d\d/)
  })

  it('scrolling near the bottom renders the last rows (not blank)', async () => {
    const wrapper = mount(SeeTable, {
      props: { data: largeData, columns: testColumns, virtual: true, rowHeight: 48, height: 400 }
    })
    const scrollWrapper = wrapper.find('.see-table__wrapper')
    // 总高 1000 * 48 = 48000px，滚到底部
    const event = new CustomEvent('scroll', { detail: { scrollTop: 47600, scrollLeft: 0 } })
    scrollWrapper.element.dispatchEvent(event)
    await nextTick()

    const rows = wrapper.findAll('.see-table__row')
    expect(rows.length).toBeGreaterThan(0)
    // 最后一行应当是 用户 1000
    expect(rows[rows.length - 1].text()).toContain('用户 1000')
  })
})
