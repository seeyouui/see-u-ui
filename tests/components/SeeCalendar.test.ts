import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeeCalendar from '../../uni_modules/see-u-ui/components/see-calendar/see-calendar.vue'

/**
 * 工具：构造一个基准日期（避免依赖系统时间的不稳定）
 * 选择 2026-06-15（周一）作为锚点，便于测试一周布局
 */
const ANCHOR = new Date(2026, 5, 15) // 2026-06-15

const buildDate = (y: number, m: number, d: number) => new Date(y, m - 1, d)

describe('SeeCalendar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================
  // 基础渲染
  // ============================================================

  it('基础渲染', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR }
    })
    expect(wrapper.find('.see-calendar').exists()).toBe(true)
  })

  it('渲染顶部标题与默认文案', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR }
    })
    expect(wrapper.find('.see-calendar__header').exists()).toBe(true)
    expect(wrapper.text()).toContain('Date Selection')
  })

  it('isShowTitle=false 时不渲染标题', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR, isShowTitle: false }
    })
    expect(wrapper.find('.see-calendar__title').exists()).toBe(false)
  })

  it('渲染星期头（默认周日开始）', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR }
    })
    const weekdays = wrapper.findAll('.see-calendar__weekday')
    expect(weekdays.length).toBe(7)
    expect(weekdays[0].text()).toBe('Su')
    expect(weekdays[6].text()).toBe('Sa')
  })

  it('firstDayOfWeek=1 时星期头从周一开始', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR, firstDayOfWeek: 1 }
    })
    const weekdays = wrapper.findAll('.see-calendar__weekday')
    expect(weekdays[0].text()).toBe('Mo')
    expect(weekdays[6].text()).toBe('Su')
  })

  it('isShowSubtitle=false 时不渲染星期头', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR, isShowSubtitle: false }
    })
    expect(wrapper.find('.see-calendar__weekdays').exists()).toBe(false)
  })

  it('monthsCount 决定渲染的月份数', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR, monthsCount: 3 }
    })
    const months = wrapper.findAll('.see-calendar__month')
    expect(months.length).toBe(3)
  })

  it('月份标题展示年月', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR, monthsCount: 1 }
    })
    expect(wrapper.text()).toContain('2026')
    expect(wrapper.text()).toContain('6')
  })

  // ============================================================
  // 单选模式
  // ============================================================

  it('单选：点击日期触发 onSelect', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'single', defaultDate: ANCHOR, monthsCount: 1, isShowConfirm: false }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    expect(days.length).toBeGreaterThan(0)
    await days[10].trigger('tap')
    expect(wrapper.emitted('onSelect')).toBeTruthy()
  })

  it('单选：选中后该日期带 selected 类', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'single', defaultDate: ANCHOR, monthsCount: 1, modelValue: buildDate(2026, 6, 15) }
    })
    await nextTick()
    const selected = wrapper.find('.see-calendar__day--selected')
    expect(selected.exists()).toBe(true)
    expect(selected.text()).toContain('15')
  })

  it('单选：isShowConfirm=false 时点击立即触发 update:modelValue', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'single', defaultDate: ANCHOR, monthsCount: 1, isShowConfirm: false }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[5].trigger('tap')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('单选：isShowConfirm=true 时点击日期不触发 update:modelValue，点击确认才触发', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'single', defaultDate: ANCHOR, monthsCount: 1, isShowConfirm: true }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[5].trigger('tap')
    // 选中态触发了 onSelect，但还未 confirm
    expect(wrapper.emitted('onSelect')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    // 点击确认按钮
    const confirmBtn = wrapper.find('.see-calendar__confirm')
    expect(confirmBtn.exists()).toBe(true)
    await confirmBtn.trigger('tap')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('onConfirm')).toBeTruthy()
  })

  // ============================================================
  // 多选模式
  // ============================================================

  it('多选：多次点击累加', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'multiple', defaultDate: ANCHOR, monthsCount: 1, isShowConfirm: false }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[2].trigger('tap')
    await days[5].trigger('tap')
    await days[10].trigger('tap')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    const last = events![events!.length - 1][0] as Date[]
    expect(Array.isArray(last)).toBe(true)
    expect(last.length).toBe(3)
  })

  it('多选：再次点击已选日期则取消选中', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'multiple', defaultDate: ANCHOR, monthsCount: 1, isShowConfirm: false }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[5].trigger('tap')
    await days[5].trigger('tap')
    const events = wrapper.emitted('update:modelValue')!
    const last = events[events.length - 1][0] as Date[]
    expect(last.length).toBe(0)
  })

  it('多选：modelValue 数组渲染多个 selected 类', async () => {
    const wrapper = mount(SeeCalendar, {
      props: {
        mode: 'multiple',
        defaultDate: ANCHOR,
        monthsCount: 1,
        modelValue: [buildDate(2026, 6, 10), buildDate(2026, 6, 12)]
      }
    })
    await nextTick()
    const selected = wrapper.findAll('.see-calendar__day--selected')
    expect(selected.length).toBe(2)
  })

  // ============================================================
  // 范围模式
  // ============================================================

  it('范围：先点开始再点结束', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'range', defaultDate: ANCHOR, monthsCount: 1, isShowConfirm: false }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[5].trigger('tap')
    await days[10].trigger('tap')
    const events = wrapper.emitted('update:modelValue')!
    const last = events[events.length - 1][0] as Date[]
    expect(last.length).toBe(2)
    expect(last[0].getTime()).toBeLessThan(last[1].getTime())
  })

  it('范围：选中起止后中间日期带 middle 类', async () => {
    const wrapper = mount(SeeCalendar, {
      props: {
        mode: 'range',
        defaultDate: ANCHOR,
        monthsCount: 1,
        modelValue: [buildDate(2026, 6, 10), buildDate(2026, 6, 15)]
      }
    })
    await nextTick()
    const middles = wrapper.findAll('.see-calendar__day--middle')
    expect(middles.length).toBeGreaterThan(0)
  })

  it('范围：start 与 end 带对应类', async () => {
    const wrapper = mount(SeeCalendar, {
      props: {
        mode: 'range',
        defaultDate: ANCHOR,
        monthsCount: 1,
        modelValue: [buildDate(2026, 6, 10), buildDate(2026, 6, 15)]
      }
    })
    await nextTick()
    expect(wrapper.find('.see-calendar__day--start').exists()).toBe(true)
    expect(wrapper.find('.see-calendar__day--end').exists()).toBe(true)
  })

  it('范围：超过 maxRange 触发 onOverRange', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'range', defaultDate: ANCHOR, monthsCount: 1, maxRange: 3, isShowConfirm: false }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[5].trigger('tap') // start
    await days[12].trigger('tap') // 跨越 7 天，超过 maxRange=3
    expect(wrapper.emitted('onOverRange')).toBeTruthy()
  })

  it('范围：allowSameDay=false 时同一天会被视作起点（重置）', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'range', defaultDate: ANCHOR, monthsCount: 1, isShowConfirm: false, allowSameDay: false }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[5].trigger('tap')
    await days[5].trigger('tap')
    // 不应有完整范围
    const events = wrapper.emitted('update:modelValue') || []
    const last = events[events.length - 1]?.[0] as Date[] | undefined
    expect(!last || last.length < 2).toBe(true)
  })

  it('范围：allowSameDay=true 时允许同一天起止', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'range', defaultDate: ANCHOR, monthsCount: 1, isShowConfirm: false, allowSameDay: true }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[5].trigger('tap')
    await days[5].trigger('tap')
    const events = wrapper.emitted('update:modelValue')!
    const last = events[events.length - 1][0] as Date[]
    expect(last.length).toBe(2)
    expect(last[0].getTime()).toBe(last[1].getTime())
  })

  // ============================================================
  // 最小最大日期 / 禁用
  // ============================================================

  it('minDate / maxDate 范围外日期禁用', () => {
    const wrapper = mount(SeeCalendar, {
      props: {
        defaultDate: ANCHOR,
        monthsCount: 1,
        minDate: buildDate(2026, 6, 10),
        maxDate: buildDate(2026, 6, 20)
      }
    })
    const disabled = wrapper.findAll('.see-calendar__day--disabled')
    expect(disabled.length).toBeGreaterThan(0)
  })

  it('点击禁用日期不触发 onSelect 但触发 onClickDay', async () => {
    const wrapper = mount(SeeCalendar, {
      props: {
        mode: 'single',
        defaultDate: ANCHOR,
        monthsCount: 1,
        minDate: buildDate(2026, 6, 10),
        maxDate: buildDate(2026, 6, 20),
        isShowConfirm: false
      }
    })
    const disabled = wrapper.findAll('.see-calendar__day--disabled')
    expect(disabled.length).toBeGreaterThan(0)
    await disabled[0].trigger('tap')
    expect(wrapper.emitted('onSelect')).toBeFalsy()
    expect(wrapper.emitted('onClickDay')).toBeTruthy()
  })

  // ============================================================
  // formatter
  // ============================================================

  it('formatter 可以注入 topInfo / bottomInfo / className', () => {
    const wrapper = mount(SeeCalendar, {
      props: {
        defaultDate: ANCHOR,
        monthsCount: 1,
        formatter: (day: any) => {
          if (day.date && day.date.getDate() === 1) {
            day.topInfo = '初一'
            day.bottomInfo = '休'
            day.className = 'see-test-holiday'
          }
          return day
        }
      }
    })
    expect(wrapper.text()).toContain('初一')
    expect(wrapper.text()).toContain('休')
    expect(wrapper.find('.see-test-holiday').exists()).toBe(true)
  })

  it('formatter 可以将日期标记为禁用', async () => {
    const wrapper = mount(SeeCalendar, {
      props: {
        mode: 'single',
        defaultDate: ANCHOR,
        monthsCount: 1,
        isShowConfirm: false,
        formatter: (day: any) => {
          if (day.date && day.date.getDate() === 15) {
            day.isDisabled = true
          }
          return day
        }
      }
    })
    const disabled = wrapper.findAll('.see-calendar__day--disabled')
    // 至少包含日期 15 这一天
    const has15 = disabled.some((d) => d.text().includes('15'))
    expect(has15).toBe(true)
  })

  // ============================================================
  // 只读
  // ============================================================

  it('isReadonly=true 时点击不触发选中', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'single', defaultDate: ANCHOR, monthsCount: 1, isShowConfirm: false, isReadonly: true }
    })
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[5].trigger('tap')
    expect(wrapper.emitted('onSelect')).toBeFalsy()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  // ============================================================
  // 默认值 / 边界
  // ============================================================

  it('无 modelValue 且无 defaultDate 时不崩溃', () => {
    const wrapper = mount(SeeCalendar, {
      props: { monthsCount: 1 }
    })
    expect(wrapper.find('.see-calendar').exists()).toBe(true)
  })

  it('modelValue 为字符串日期可正常解析', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'single', defaultDate: ANCHOR, monthsCount: 1, modelValue: '2026-06-15' as any }
    })
    await nextTick()
    expect(wrapper.find('.see-calendar__day--selected').exists()).toBe(true)
  })

  it('modelValue 为时间戳可正常解析', async () => {
    const wrapper = mount(SeeCalendar, {
      props: {
        mode: 'single',
        defaultDate: ANCHOR,
        monthsCount: 1,
        modelValue: buildDate(2026, 6, 15).getTime() as any
      }
    })
    await nextTick()
    expect(wrapper.find('.see-calendar__day--selected').exists()).toBe(true)
  })

  it('空数组 modelValue（多选）不渲染选中态且不崩溃', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { mode: 'multiple', defaultDate: ANCHOR, monthsCount: 1, modelValue: [] as any }
    })
    await nextTick()
    expect(wrapper.findAll('.see-calendar__day--selected').length).toBe(0)
  })

  // ============================================================
  // 自定义文案
  // ============================================================

  it('自定义 title 渲染', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR, title: '请选择出行日期' }
    })
    expect(wrapper.text()).toContain('请选择出行日期')
  })

  it('自定义 confirmText 渲染', async () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR, mode: 'single', confirmText: '提交', monthsCount: 1 }
    })
    // 必须先选中日期，按钮才会切到非 disabled 文案
    const days = wrapper.findAll('.see-calendar__day:not(.see-calendar__day--disabled):not(.see-calendar__day--placeholder)')
    await days[5].trigger('tap')
    expect(wrapper.text()).toContain('提交')
  })

  it('confirmDisabledText 在未选中时展示', () => {
    const wrapper = mount(SeeCalendar, {
      props: { defaultDate: ANCHOR, mode: 'single', confirmText: '提交', confirmDisabledText: '请先选日期' }
    })
    expect(wrapper.text()).toContain('请先选日期')
  })

  // ============================================================
  // 范围模式：跨月份选择
  // ============================================================

  it('范围：跨月份正确显示中间高亮', async () => {
    const wrapper = mount(SeeCalendar, {
      props: {
        mode: 'range',
        defaultDate: ANCHOR,
        monthsCount: 3,
        modelValue: [buildDate(2026, 6, 28), buildDate(2026, 7, 5)]
      }
    })
    await nextTick()
    expect(wrapper.find('.see-calendar__day--start').exists()).toBe(true)
    expect(wrapper.find('.see-calendar__day--end').exists()).toBe(true)
    expect(wrapper.findAll('.see-calendar__day--middle').length).toBeGreaterThan(0)
  })
})
