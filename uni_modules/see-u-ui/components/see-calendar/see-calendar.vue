<template>
  <view class="see-calendar" :class="calendarClasses">
    <!-- 顶部标题 -->
    <view v-if="isShowTitle" class="see-calendar__header">
      <slot name="title">
        <view class="see-calendar__title">{{ resolvedTitle }}</view>
      </slot>
      <slot name="subtitle">
        <view v-if="subtitle" class="see-calendar__subtitle">{{ subtitle }}</view>
      </slot>
    </view>

    <!-- 星期标题 -->
    <view v-if="isShowSubtitle" class="see-calendar__weekdays">
      <text v-for="(w, i) in weekdays" :key="i" class="see-calendar__weekday">{{ w }}</text>
    </view>

    <!-- 月份列表 -->
    <scroll-view class="see-calendar__body" scroll-y>
      <view v-for="month in months" :key="month.key" class="see-calendar__month">
        <view class="see-calendar__month-title">{{ month.title }}</view>
        <view v-if="isShowMark" class="see-calendar__mark">{{ month.markText }}</view>
        <view class="see-calendar__days">
          <view
            v-for="(day, idx) in month.days"
            :key="idx"
            class="see-calendar__day"
            :class="getDayClass(day)"
            :style="dayStyle"
            @tap="onDayClick(day)"
          >
            <template v-if="day.type !== 'placeholder'">
              <text v-if="day.topInfo" class="see-calendar__day-top">{{ day.topInfo }}</text>
              <text class="see-calendar__day-text">{{ day.text }}</text>
              <text v-if="day.bottomInfo" class="see-calendar__day-bottom">{{ day.bottomInfo }}</text>
            </template>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部 -->
    <view v-if="hasFooterSlot" class="see-calendar__footer">
      <slot name="footer" :value="denormalizedValue" />
    </view>
    <view v-else-if="isShowConfirm" class="see-calendar__footer">
      <view class="see-calendar__confirm" :class="{ 'see-calendar__confirm--disabled': isConfirmDisabled }" @tap="onConfirmClick">
        {{ resolvedConfirmButtonText }}
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Calendar 日历
 * @description 平铺式日历组件，支持单选、多选、范围选择，支持范围限制、自定义日期格子、表单接入
 * @tutorial https://www.seeuui.cn/components/calendar/
 *
 * @property {Date | String | Number | Array} modelValue        绑定值（v-model）
 * @property {String}                          mode              选择模式（single / multiple / range）
 * @property {Date | String | Number}          minDate           最小可选日期
 * @property {Date | String | Number}          maxDate           最大可选日期
 * @property {Date | String | Number}          defaultDate       默认展示月份（无值时）
 * @property {Number}                          firstDayOfWeek    一周起始日（0=日，1=一，...，6=六）
 * @property {Function}                        formatter         自定义日期格子
 * @property {Number}                          maxRange          范围模式最大可选天数
 * @property {Boolean}                         allowSameDay      范围模式允许起止同一天
 * @property {Number | String}                 rowHeight         日期行高（rpx）
 * @property {Boolean}                         isShowMark        是否显示月份水印（默认 true）
 * @property {Boolean}                         isShowTitle       是否显示顶部标题（默认 true）
 * @property {Boolean}                         isShowSubtitle    是否显示星期标题（默认 true）
 * @property {Boolean}                         isReadonly        是否只读
 * @property {String}                          name              表单字段名
 * @property {String}                          title             顶部主标题
 * @property {String}                          subtitle          顶部副标题
 * @property {String}                          confirmText       确认按钮文字
 * @property {String}                          confirmDisabledText 范围未选完时按钮文字
 * @property {Boolean}                         isShowConfirm     是否显示确认按钮（默认 true）
 * @property {Number}                          monthsCount       渲染月份数量（默认 6）
 *
 * @event {Function} update:modelValue v-model 更新
 * @event {Function} onSelect          选中变化
 * @event {Function} onConfirm         点击确认按钮
 * @event {Function} onClickDay        点击任意日期格子
 * @event {Function} onOverRange       范围选择超出 maxRange
 * @event {Function} onMonthShow       滚动到某月（保留接口）
 */
import { ref, computed, inject, watch, useSlots } from 'vue'
import { useI18n } from '../../locale'
import { formKey } from '../../utils/shared/form-keys'
import { useField } from '../../utils/hooks/useField'
import type { CalendarMode, CalendarDay, CalendarValue, FirstDayOfWeek, FormContext } from './type'

defineOptions({ name: 'SeeCalendar' })

const { t } = useI18n()

/** ---------- 常量 ---------- */
const WEEKDAY_LABELS = [
  t('calendar.week.sunday'),
  t('calendar.week.monday'),
  t('calendar.week.tuesday'),
  t('calendar.week.wednesday'),
  t('calendar.week.thursday'),
  t('calendar.week.friday'),
  t('calendar.week.saturday')
]
const MS_PER_DAY = 24 * 60 * 60 * 1000

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    modelValue?: CalendarValue
    mode?: CalendarMode
    minDate?: Date | string | number
    maxDate?: Date | string | number
    defaultDate?: Date | string | number
    firstDayOfWeek?: FirstDayOfWeek
    formatter?: (day: CalendarDay) => CalendarDay
    maxRange?: number
    allowSameDay?: boolean
    rowHeight?: number | string
    isShowMark?: boolean
    isShowTitle?: boolean
    isShowSubtitle?: boolean
    isReadonly?: boolean
    name?: string
    title?: string
    subtitle?: string
    confirmText?: string
    confirmDisabledText?: string
    isShowConfirm?: boolean
    monthsCount?: number
  }>(),
  {
    modelValue: '',
    mode: 'single',
    minDate: '',
    maxDate: '',
    defaultDate: '',
    firstDayOfWeek: 0,
    formatter: undefined,
    maxRange: 0,
    allowSameDay: false,
    rowHeight: 128,
    isShowMark: true,
    isShowTitle: true,
    isShowSubtitle: true,
    isReadonly: false,
    name: '',
    title: '',
    subtitle: '',
    confirmText: '',
    confirmDisabledText: '',
    isShowConfirm: true,
    monthsCount: 6
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | Date[]): void
  (e: 'onSelect', value: Date | Date[]): void
  (e: 'onConfirm', value: Date | Date[]): void
  (e: 'onClickDay', day: CalendarDay): void
  (e: 'onOverRange'): void
  (e: 'onMonthShow', info: { year: number; month: number }): void
}>()

const slots = useSlots()
const hasFooterSlot = computed(() => !!slots.footer)

/** ---------- 表单上下文 ---------- */
const formContext = inject<FormContext | null>(formKey, null)
const field = useField({
  field: props.name || '',
  getValue: () => props.modelValue,
  trigger: 'change'
})

/** ---------- 工具：日期解析 / 标准化 ---------- */
const parseToDate = (input: Date | string | number | null | undefined): Date | null => {
  if (input === null || input === undefined || input === '') return null
  if (input instanceof Date) return isNaN(input.getTime()) ? null : startOfDay(input)
  if (typeof input === 'number') {
    const d = new Date(input)
    return isNaN(d.getTime()) ? null : startOfDay(d)
  }
  if (typeof input === 'string') {
    // 兼容 "2026-06-15" 与 "2026/06/15"
    const normalized = input.replace(/-/g, '/')
    const d = new Date(normalized)
    return isNaN(d.getTime()) ? null : startOfDay(d)
  }
  return null
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function dateEquals(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function compareDate(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime()
}

function diffDays(a: Date, b: Date): number {
  return Math.abs(Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / MS_PER_DAY)) + 1
}

const TODAY = startOfDay(new Date())

/** ---------- min / max 解析 ---------- */
const parsedMinDate = computed<Date | null>(() => parseToDate(props.minDate))
const parsedMaxDate = computed<Date | null>(() => parseToDate(props.maxDate))

/** ---------- 起始月份 ---------- */
const anchorDate = computed<Date>(() => {
  // 优先取 modelValue 的第一个有效日期，再取 defaultDate，最后取今天
  const fromModel = normalizeModelToArray(props.modelValue)[0]
  if (fromModel) return fromModel
  const fromDefault = parseToDate(props.defaultDate)
  if (fromDefault) return fromDefault
  return TODAY
})

/** ---------- 标准化 modelValue → Date[] ---------- */
function normalizeModelToArray(v: CalendarValue): Date[] {
  if (v === null || v === undefined || v === '') return []
  if (Array.isArray(v)) {
    return v.map((item) => parseToDate(item as Date | string | number)).filter((d): d is Date => d !== null)
  }
  const d = parseToDate(v as Date | string | number)
  return d ? [d] : []
}

/** ---------- 内部选择状态（数组形式） ---------- */
const innerValue = ref<Date[]>(normalizeModelToArray(props.modelValue))

watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = normalizeModelToArray(val)
  },
  { deep: true }
)

/** ---------- 反标准化：根据 mode 返回对外形态 ---------- */
const denormalizedValue = computed<Date | Date[]>(() => {
  if (props.mode === 'single') {
    return innerValue.value[0] || (null as unknown as Date)
  }
  return [...innerValue.value]
})

/** ---------- 星期标签（按 firstDayOfWeek 旋转） ---------- */
const weekdays = computed<string[]>(() => {
  const start = props.firstDayOfWeek
  return WEEKDAY_LABELS.slice(start).concat(WEEKDAY_LABELS.slice(0, start))
})

/** ---------- 月份数据生成 ---------- */
interface MonthData {
  key: string
  year: number
  month: number // 1-12
  title: string
  markText: string
  days: CalendarDay[]
}

const months = computed<MonthData[]>(() => {
  const list: MonthData[] = []
  const startYear = anchorDate.value.getFullYear()
  const startMonth = anchorDate.value.getMonth() // 0-11
  for (let i = 0; i < props.monthsCount; i++) {
    const date = new Date(startYear, startMonth + i, 1)
    const y = date.getFullYear()
    const m = date.getMonth()
    list.push({
      key: `${y}-${m}`,
      year: y,
      month: m + 1,
      title: t('dateFormat.title', { y, m: m + 1 }),
      markText: String(m + 1),
      days: buildDaysForMonth(y, m)
    })
  }
  return list
})

/** 构造一个月的日期格子（含前导 placeholder） */
function buildDaysForMonth(year: number, monthIndex: number): CalendarDay[] {
  const days: CalendarDay[] = []
  const firstDay = new Date(year, monthIndex, 1)
  const lastDay = new Date(year, monthIndex + 1, 0).getDate()
  // 前导 placeholder 数 = (firstDay.getDay() - firstDayOfWeek + 7) % 7
  const leading = (firstDay.getDay() - props.firstDayOfWeek + 7) % 7
  for (let i = 0; i < leading; i++) {
    days.push({ date: null, text: '', type: 'placeholder' })
  }
  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, monthIndex, d)
    let day: CalendarDay = {
      date,
      text: d,
      type: '',
      isToday: dateEquals(date, TODAY)
    }
    // min / max 自动禁用
    if (parsedMinDate.value && compareDate(date, parsedMinDate.value) < 0) day.isDisabled = true
    if (parsedMaxDate.value && compareDate(date, parsedMaxDate.value) > 0) day.isDisabled = true
    // 用户 formatter
    if (typeof props.formatter === 'function') {
      day = props.formatter({ ...day })
      if (!day.date) day.date = date // 保护：防止 formatter 误删
    }
    days.push(day)
  }
  return days
}

/** ---------- 计算 day 状态类 ---------- */
function getDayClass(day: CalendarDay): Record<string, boolean> {
  const classes: Record<string, boolean> = {}
  if (day.type === 'placeholder') {
    classes['see-calendar__day--placeholder'] = true
    return classes
  }
  if (day.isDisabled) {
    classes['see-calendar__day--disabled'] = true
  }
  if (day.isToday) {
    classes['see-calendar__day--today'] = true
  }
  if (day.className) {
    classes[day.className] = true
  }
  // 选中状态计算
  if (day.date && !day.isDisabled) {
    const state = getDateSelectionState(day.date)
    if (state) {
      classes[`see-calendar__day--${state}`] = true
    }
  }
  return classes
}

/** 计算一个日期在当前选择中的状态 */
function getDateSelectionState(date: Date): string {
  const v = innerValue.value
  if (v.length === 0) return ''
  if (props.mode === 'single') {
    return dateEquals(date, v[0]) ? 'selected' : ''
  }
  if (props.mode === 'multiple') {
    return v.some((d) => dateEquals(d, date)) ? 'selected' : ''
  }
  // range
  if (v.length === 1) {
    if (dateEquals(date, v[0])) return 'start'
    return ''
  }
  // length === 2
  const [start, end] = v
  if (dateEquals(date, start) && dateEquals(date, end)) return 'start-end'
  if (dateEquals(date, start)) return 'start'
  if (dateEquals(date, end)) return 'end'
  if (compareDate(date, start) > 0 && compareDate(date, end) < 0) return 'middle'
  return ''
}

/** ---------- 行高样式 ---------- */
const dayStyle = computed(() => {
  const h = typeof props.rowHeight === 'number' ? `${props.rowHeight}rpx` : String(props.rowHeight)
  return { height: h }
})

/** ---------- 整体 class ---------- */
const calendarClasses = computed(() => ({
  'see-calendar--readonly': mergedReadonly.value
}))

const mergedReadonly = computed(() => props.isReadonly || field.isReadonly.value || false)
const mergedDisabled = computed(() => field.isDisabled.value || false)

/** ---------- 点击日期 ---------- */
function onDayClick(day: CalendarDay) {
  if (day.type === 'placeholder' || !day.date) return
  // 任意点击（包括禁用）都触发 onClickDay
  emit('onClickDay', day)
  if (day.isDisabled) return
  if (mergedReadonly.value || mergedDisabled.value) return
  selectDate(day.date)
}

function selectDate(date: Date) {
  if (props.mode === 'single') {
    innerValue.value = [date]
    emit('onSelect', date)
    if (!props.isShowConfirm) {
      emit('update:modelValue', date)
    }
    return
  }
  if (props.mode === 'multiple') {
    const idx = innerValue.value.findIndex((d) => dateEquals(d, date))
    if (idx >= 0) {
      innerValue.value = innerValue.value.filter((_, i) => i !== idx)
    } else {
      innerValue.value = [...innerValue.value, date]
    }
    emit('onSelect', [...innerValue.value])
    if (!props.isShowConfirm) {
      emit('update:modelValue', [...innerValue.value])
    }
    return
  }
  // range
  handleRangeSelect(date)
}

function handleRangeSelect(date: Date) {
  const v = innerValue.value
  // 完整选择（已有起止）或空 → 开启新一段
  if (v.length === 0 || v.length === 2) {
    innerValue.value = [date]
    emit('onSelect', [date])
    return
  }
  // v.length === 1：决定结束点
  const start = v[0]
  if (dateEquals(date, start)) {
    if (props.allowSameDay) {
      innerValue.value = [start, date]
      emit('onSelect', [start, date])
      if (!props.isShowConfirm) {
        emit('update:modelValue', [start, date])
      }
    } else {
      // 不允许同一天 → 视作起点不变（保持单选 start）
      innerValue.value = [date]
      emit('onSelect', [date])
    }
    return
  }
  // 自动反转
  const [s, e] = compareDate(date, start) < 0 ? [date, start] : [start, date]
  // maxRange 校验
  if (props.maxRange > 0 && diffDays(s, e) > props.maxRange) {
    emit('onOverRange')
    // 不完成选择：当前日期作为新起点
    innerValue.value = [date]
    emit('onSelect', [date])
    return
  }
  innerValue.value = [s, e]
  emit('onSelect', [s, e])
  if (!props.isShowConfirm) {
    emit('update:modelValue', [s, e])
  }
}

/** ---------- 确认按钮 ---------- */
const resolvedTitle = computed(() => props.title || t('calendar.title'))
const resolvedConfirmText = computed(() => props.confirmText || t('calendar.confirm'))
const resolvedConfirmDisabledText = computed(() => props.confirmDisabledText || t('calendar.confirmDisabled'))

const isConfirmDisabled = computed(() => {
  if (props.mode === 'range') {
    return innerValue.value.length !== 2
  }
  return innerValue.value.length === 0
})

const resolvedConfirmButtonText = computed(() => {
  if (isConfirmDisabled.value) return resolvedConfirmDisabledText.value
  return resolvedConfirmText.value
})

function onConfirmClick() {
  if (isConfirmDisabled.value) return
  const value = denormalizedValue.value
  emit('update:modelValue', value)
  emit('onConfirm', value)
}

/** ---------- 暴露 ---------- */
defineExpose({
  /** 重置选择 */
  reset: () => {
    innerValue.value = []
  },
  /** 当前内部选择（数组形式） */
  getValue: () => [...innerValue.value]
})

// 防止 unused 警告
void formContext
</script>

<style lang="scss" scoped>
.see-calendar {
  display: flex;
  flex-direction: column;
  background-color: var(--see-bg-color, #ffffff);
  border-radius: 16rpx;
  overflow: hidden;

  &--readonly {
    opacity: 0.85;
  }

  &__header {
    padding: 32rpx 32rpx 16rpx;
    text-align: center;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--see-main-color, #2e2f33);
  }

  &__subtitle {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: var(--see-tips-color, #8c8e93);
  }

  &__weekdays {
    display: flex;
    padding: 16rpx 0;
    border-bottom: 1rpx solid var(--see-border-four-color, #eceff1);
  }

  &__weekday {
    flex: 1;
    text-align: center;
    font-size: 24rpx;
    color: var(--see-tips-color, #8c8e93);
  }

  &__body {
    flex: 1;
    max-height: 800rpx;
  }

  &__month {
    position: relative;
    padding: 24rpx 8rpx 16rpx;
  }

  &__month-title {
    padding: 16rpx 24rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: var(--see-content-color, #5a5c60);
  }

  &__mark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 280rpx;
    font-weight: 700;
    color: var(--see-border-four-color, #eceff1);
    opacity: 0.45;
    pointer-events: none;
    z-index: 0;
  }

  &__days {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
  }

  &__day {
    box-sizing: border-box;
    width: calc(100% / 7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: var(--see-main-color, #2e2f33);
    position: relative;
    transition: background-color 0.15s ease;

    &--placeholder {
      pointer-events: none;
    }

    &--disabled {
      color: var(--see-light-text, #aeb0b4);
      cursor: not-allowed;
    }

    &--today {
      .see-calendar__day-text {
        color: var(--see-primary, #3ca7ff);
        font-weight: 600;
      }
    }

    &--selected {
      .see-calendar__day-text {
        position: relative;
        z-index: 1;
        color: #ffffff;
      }
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 72rpx;
        height: 72rpx;
        border-radius: 50%;
        background-color: var(--see-primary, #3ca7ff);
        z-index: 0;
      }
    }

    &--start,
    &--end,
    &--start-end {
      .see-calendar__day-text {
        position: relative;
        z-index: 1;
        color: #ffffff;
      }
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 72rpx;
        height: 72rpx;
        border-radius: 50%;
        background-color: var(--see-primary, #3ca7ff);
        z-index: 0;
      }
    }

    &--start {
      background: linear-gradient(to right, transparent 50%, var(--see-primary-light, #e9f6ff) 50%);
    }

    &--end {
      background: linear-gradient(to left, transparent 50%, var(--see-primary-light, #e9f6ff) 50%);
    }

    &--start-end {
      background: transparent;
    }

    &--middle {
      background-color: var(--see-primary-light, #e9f6ff);
      .see-calendar__day-text {
        color: var(--see-primary-dark, #208ee8);
      }
    }
  }

  &__day-text {
    font-size: 28rpx;
    line-height: 1.2;
  }

  &__day-top,
  &__day-bottom {
    font-size: 20rpx;
    color: var(--see-tips-color, #8c8e93);
    line-height: 1.2;
  }

  &__day--selected &__day-top,
  &__day--selected &__day-bottom,
  &__day--start &__day-top,
  &__day--start &__day-bottom,
  &__day--end &__day-top,
  &__day--end &__day-bottom,
  &__day--start-end &__day-top,
  &__day--start-end &__day-bottom {
    color: #ffffff;
    position: relative;
    z-index: 1;
  }

  &__footer {
    padding: 24rpx 32rpx 32rpx;
    border-top: 1rpx solid var(--see-border-four-color, #eceff1);
  }

  &__confirm {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    font-size: 28rpx;
    color: #ffffff;
    background-color: var(--see-primary, #3ca7ff);
    border-radius: 40rpx;
    transition: background-color 0.15s ease;

    &--disabled {
      background-color: var(--see-primary-disabled, #a8d8ff);
      pointer-events: none;
    }
  }
}
</style>
