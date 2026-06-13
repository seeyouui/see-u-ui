/**
 * SeeCalendar 组件类型定义
 * @description 日历组件的类型声明
 */

/** 选择模式 */
export type CalendarMode = 'single' | 'multiple' | 'range'

/** 一周起始日（0=周日, 1=周一, ..., 6=周六） */
export type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** 日期格子状态 */
export type CalendarDayType = '' | 'selected' | 'start' | 'middle' | 'end' | 'disabled' | 'placeholder' | 'start-end'

/** 单个日期格子的描述 */
export interface CalendarDay {
  /** 日期对象 */
  date: Date | null
  /** 显示的文本（默认是日期数字，可被 formatter 覆盖） */
  text: string | number
  /** 上方附加文字 */
  topInfo?: string
  /** 下方附加文字 */
  bottomInfo?: string
  /** 自定义 className */
  className?: string
  /** 日期格子类型（由组件内部计算，formatter 不需要返回此字段） */
  type?: CalendarDayType
  /** 是否禁用（formatter 可主动设置） */
  isDisabled?: boolean
  /** 是否为今日 */
  isToday?: boolean
}

/** modelValue 的支持类型 */
export type CalendarValue = Date | string | number | Date[] | string[] | number[] | null | undefined | ''

/** SeeCalendar Props */
export interface SeeCalendarProps {
  /** 绑定值（v-model）：单选时为单个日期，多选/范围为数组 */
  modelValue?: CalendarValue
  /** 选择模式：single 单选 / multiple 多选 / range 范围 */
  mode?: CalendarMode
  /** 最小可选日期 */
  minDate?: Date | string | number
  /** 最大可选日期 */
  maxDate?: Date | string | number
  /** 默认展示月份（无 modelValue 时） */
  defaultDate?: Date | string | number
  /** 一周起始日 */
  firstDayOfWeek?: FirstDayOfWeek
  /** 自定义日期格子（可注入 topInfo / bottomInfo / className / isDisabled） */
  formatter?: (day: CalendarDay) => CalendarDay
  /** 范围模式最大可选天数（0 表示不限） */
  maxRange?: number
  /** 范围模式允许起止为同一天 */
  allowSameDay?: boolean
  /** 日期行高（rpx） */
  rowHeight?: number | string
  /** 是否显示月份水印 */
  isShowMark?: boolean
  /** 是否显示顶部标题 */
  isShowTitle?: boolean
  /** 是否显示星期标题 */
  isShowSubtitle?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 表单字段名 */
  name?: string
  /** 顶部主标题 */
  title?: string
  /** 顶部副标题 */
  subtitle?: string
  /** 确认按钮文字 */
  confirmText?: string
  /** 范围未选完时按钮文字 */
  confirmDisabledText?: string
  /** 是否显示底部确认按钮 */
  isShowConfirm?: boolean
  /** 渲染月份数量（向后） */
  monthsCount?: number
}

/** SeeCalendar Emits */
export interface SeeCalendarEmits {
  /** v-model 更新（点击确认或单/多选立即触发） */
  'update:modelValue': (value: Date | Date[]) => void
  /** 选中变化（实时） */
  onSelect: (value: Date | Date[]) => void
  /** 点击确认按钮 */
  onConfirm: (value: Date | Date[]) => void
  /** 点击任意日期格子（包括禁用） */
  onClickDay: (day: CalendarDay) => void
  /** 范围选择超出 maxRange */
  onOverRange: () => void
  /** 滚动到某月（保留接口） */
  onMonthShow: (info: { year: number; month: number }) => void
}

export type { FormContext } from '../../utils/shared/form-types'
