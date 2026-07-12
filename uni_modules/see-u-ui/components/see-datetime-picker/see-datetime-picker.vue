<template>
  <view class="see-datetime-picker-wrapper">
    <!-- 触发区域 -->
    <view class="see-datetime-picker" :class="pickerClasses" @click="handleOpen">
      <text v-if="displayText" class="see-datetime-picker__value" :class="{ 'see-datetime-picker__value--placeholder': !isSelected }">
        {{ displayText }}
      </text>
      <text v-else class="see-datetime-picker__value see-datetime-picker__value--placeholder">
        {{ resolvedPlaceholder }}
      </text>
      <text class="see-datetime-picker__arrow see-datetime-picker-icon-arrow"></text>
    </view>

    <!-- 弹出层 -->
    <view v-if="isVisible" class="see-datetime-picker__overlay" @click="handleCancel">
      <view class="see-datetime-picker__popup" :class="popupClasses" @click.stop>
        <!-- 工具栏 -->
        <view v-if="props.isShowToolbar" class="see-datetime-picker__toolbar">
          <text class="see-datetime-picker__toolbar-btn see-datetime-picker__toolbar-btn--cancel" @click="handleCancel">
            {{ resolvedCancelText }}
          </text>
          <text class="see-datetime-picker__toolbar-title">
            {{ props.toolbarTitle }}
          </text>
          <text class="see-datetime-picker__toolbar-btn see-datetime-picker__toolbar-btn--confirm" @click="handleConfirm">
            {{ resolvedConfirmText }}
          </text>
        </view>

        <!-- 选择器主体 -->
        <view class="see-datetime-picker__body">
          <!-- 列容器 -->
          <view class="see-datetime-picker__columns">
            <!-- 遮罩层（上） -->
            <view class="see-datetime-picker__mask see-datetime-picker__mask--top"></view>
            <!-- 选中指示器 -->
            <view class="see-datetime-picker__indicator"></view>
            <!-- 遮罩层（下） -->
            <view class="see-datetime-picker__mask see-datetime-picker__mask--bottom"></view>

            <!-- 各列 -->
            <view
              v-for="(column, colIndex) in displayColumns"
              :key="column.type"
              class="see-datetime-picker__column"
              :data-col-index="colIndex"
              @touchstart="onTouchStart($event, colIndex)"
              @touchmove.prevent="onTouchMove($event, colIndex)"
              @touchend="onTouchEnd($event, colIndex)"
            >
              <view class="see-datetime-picker__column-inner" :style="getColumnStyle(colIndex)">
                <view
                  v-for="option in column.options"
                  :key="option.value"
                  class="see-datetime-picker__item"
                  :class="{
                    'see-datetime-picker__item--selected': option.value === selectedValues[column.type]
                  }"
                >
                  <text class="see-datetime-picker__item-text">
                    {{ formatOption(column.type, option.text) }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * DatetimePicker 日期时间选择器
 * @description 用于选择日期和时间，支持多种类型和范围限制
 * @tutorial https://www.seeuui.cn/components/datetime-picker/
 *
 * @property {Date | String | Number}  modelValue       绑定值（v-model）
 * @property {String}                   type             选择器类型（默认 'datetime'）
 * @property {String}                   placeholder      占位符
 * @property {Boolean}                  isDisabled        是否禁用
 * @property {Boolean}                  isReadonly        是否只读
 * @property {Boolean}                  isShowToolbar     是否显示 toolbar（默认 true）
 * @property {String}                   toolbarTitle     toolbar 标题
 * @property {String}                   confirmText      确认按钮文字
 * @property {String}                   cancelText       取消按钮文字
 * @property {Date | String | Number}  minDate          最小日期
 * @property {Date | String | Number}  maxDate          最大日期
 * @property {Number}                   minHour          最小小时（默认 0）
 * @property {Number}                   maxHour          最大小时（默认 23）
 * @property {Number}                   minMinute        最小分钟（默认 0）
 * @property {Number}                   maxMinute        最大分钟（默认 59）
 * @property {Boolean}                  isShowSeconds    是否显示秒
 * @property {Function}                 formatter        自定义格式化函数
 * @property {Function}                 filter           自定义过滤函数
 * @property {String}                   size             尺寸
 * @property {Boolean}                  isBorder         是否显示边框（默认 true）
 * @property {String}                   name             表单字段名
 */
import { ref, computed, inject, watch, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from '../../locale'
import { formKey } from '../../utils/shared/form-keys'
import { useField } from '../../utils/hooks/useField'
import type { DatetimePickerType, DatetimePickerSize, ColumnType, ColumnOption, PickerColumn, FormContext } from './type'

defineOptions({ name: 'SeeDatetimePicker' })

const { t } = useI18n()

/** ---------- constants ---------- */
const ITEM_HEIGHT_MAP: Record<string, number> = { small: 72, default: 88, large: 100 }

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值 */
    modelValue?: Date | string | number
    /** 选择器类型 */
    type?: DatetimePickerType
    /** 占位符 */
    placeholder?: string
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 是否显示 toolbar */
    isShowToolbar?: boolean
    /** toolbar 标题 */
    toolbarTitle?: string
    /** 确认按钮文字 */
    confirmText?: string
    /** 取消按钮文字 */
    cancelText?: string
    /** 最小日期 */
    minDate?: Date | string | number
    /** 最大日期 */
    maxDate?: Date | string | number
    /** 最小小时 */
    minHour?: number
    /** 最大小时 */
    maxHour?: number
    /** 最小分钟 */
    minMinute?: number
    /** 最大分钟 */
    maxMinute?: number
    /** 是否显示秒 */
    isShowSeconds?: boolean
    /** 自定义格式化函数 */
    formatter?: (type: ColumnType, value: string) => string
    /** 自定义过滤函数 */
    filter?: (type: ColumnType, values: string[]) => string[]
    /** 尺寸 */
    size?: DatetimePickerSize
    /** 是否显示边框 */
    isBorder?: boolean
    /** 表单字段名 */
    name?: string
  }>(),
  {
    modelValue: '',
    type: 'datetime',
    placeholder: '',
    isDisabled: false,
    isReadonly: false,
    isShowToolbar: true,
    toolbarTitle: '',
    confirmText: '',
    cancelText: '',
    minDate: '',
    maxDate: '',
    minHour: 0,
    maxHour: 23,
    minMinute: 0,
    maxMinute: 59,
    isShowSeconds: false,
    formatter: undefined,
    filter: undefined,
    size: 'default',
    isBorder: true,
    name: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 值变化时触发 */
  (e: 'onChange', value: Date): void
  /** 确认时触发 */
  (e: 'onConfirm', value: Date): void
  /** 取消时触发 */
  (e: 'onCancel'): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: Date): void
}>()

/** ---------- inject ---------- */
const formContext = inject<FormContext | null>(formKey, null)

/** ---------- Form 联动（useField） ---------- */
const field = useField({
  field: props.name || '',
  getValue: () => props.modelValue,
  trigger: 'change',
  onValueChange: () => {
    // 由 useField 内部管理 change 校验触发
  }
})

/** ---------- refs ----------**
 * isVisible: 弹出层是否可见
 * selectedValues: 当前选中的值 { year, month, day, hour, minute, second }
 * columnOffsets: 每列的滚动偏移量（用于动画）
 * touchState: 触摸状态追踪
 */
const isVisible = ref(false)

const selectedValues = ref<Record<ColumnType, number>>({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  hour: 0,
  minute: 0,
  second: 0
})

const columnOffsets = ref<number[]>([])
/** 是否正在触摸 */
const isTouching = ref(false)

interface TouchState {
  startY: number
  startOffset: number
  startTime: number
  lastY: number
  lastTime: number
  velocity: number
}

const touchStates = ref<TouchState[]>([])

/** 设备像素比（用于 px -> rpx 换算） */
const pixelRatio = ref(2)

try {
  const sysInfo = uni.getSystemInfoSync()
  pixelRatio.value = sysInfo.windowWidth ? 750 / sysInfo.windowWidth : 2
} catch {
  pixelRatio.value = 2
}

/** ---------- computed ---------- */

/** 翻译回退 */
const resolvedPlaceholder = computed(() => props.placeholder || t('picker.placeholder'))
const resolvedConfirmText = computed(() => props.confirmText || t('picker.confirm'))
const resolvedCancelText = computed(() => props.cancelText || t('picker.cancel'))

/** 实际禁用状态（考虑 Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || field.isDisabled.value || false
})

/** 实际只读状态（考虑 Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || field.isReadonly.value || false
})

/** 实际尺寸（考虑 Form 联动） */
const mergedSize = computed(() => {
  return props.size || formContext?.props?.size || 'default'
})

/** 当前选项高度（rpx），根据 size 动态计算 */
const itemHeight = computed(() => ITEM_HEIGHT_MAP[mergedSize.value] || 88)

/** 解析后的最小日期 */
const parsedMinDate = computed(() => {
  if (!props.minDate) return getDefaultMinDate()
  return parseToDate(props.minDate)
})

/** 解析后的最大日期 */
const parsedMaxDate = computed(() => {
  if (!props.maxDate) return getDefaultMaxDate()
  return parseToDate(props.maxDate)
})

/** 是否已选择值 */
const isSelected = computed(() => {
  return !!props.modelValue && String(props.modelValue).length > 0
})

/** 根据 type 决定显示哪些列 */
const columnTypes = computed<ColumnType[]>(() => {
  switch (props.type) {
    case 'date':
      return ['year', 'month', 'day']
    case 'time':
      return props.isShowSeconds ? ['hour', 'minute', 'second'] : ['hour', 'minute']
    case 'datetime':
      return props.isShowSeconds ? ['year', 'month', 'day', 'hour', 'minute', 'second'] : ['year', 'month', 'day', 'hour', 'minute']
    case 'year-month':
      return ['year', 'month']
    case 'month-day':
      return ['month', 'day']
    default:
      return ['year', 'month', 'day']
  }
})

/** 生成各列的选项 */
const displayColumns = computed<PickerColumn[]>(() => {
  const columns: PickerColumn[] = []

  for (const type of columnTypes.value) {
    let options: ColumnOption[] = []

    switch (type) {
      case 'year':
        options = generateYearOptions()
        break
      case 'month':
        options = generateMonthOptions()
        break
      case 'day':
        options = generateDayOptions()
        break
      case 'hour':
        options = generateHourOptions()
        break
      case 'minute':
        options = generateMinuteOptions()
        break
      case 'second':
        options = generateSecondOptions()
        break
    }

    // 应用 filter
    if (props.filter) {
      const stringValues = options.map((opt) => String(opt.value))
      const filtered = props.filter(type, stringValues)
      options = options.filter((opt) => filtered.includes(String(opt.value)))
    }

    columns.push({ type, options })
  }

  return columns
})

/** 显示的文本 */
const displayText = computed(() => {
  if (!isSelected.value) return ''

  const date = parseToDate(props.modelValue)
  return formatDateForDisplay(date)
})

/** picker CSS 类 */
const pickerClasses = computed(() => {
  const classes: string[] = [`see-datetime-picker--${mergedSize.value}`]
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (props.isBorder) classes.push('is-border')
  if (isSelected.value) classes.push('is-selected')
  return classes
})

/** popup CSS 类 */
const popupClasses = computed(() => {
  return [`see-datetime-picker__popup--${mergedSize.value}`]
})

/** ---------- methods ----------**

/**
 * @title 解析日期
 * @description 将 Date/string/number 转换为 Date 对象
 */
function parseToDate(value: Date | string | number): Date {
  if (value instanceof Date) return value
  if (typeof value === 'number') return new Date(value)
  if (typeof value === 'string' && value) {
    // 处理常见的日期格式
    const date = new Date(value.replace(/-/g, '/'))
    if (!isNaN(date.getTime())) return date
  }
  return new Date()
}

/**
 * @title 获取默认最小日期
 */
function getDefaultMinDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear() - 10, 0, 1)
}

/**
 * @title 获取默认最大日期
 */
function getDefaultMaxDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear() + 10, 11, 31, 23, 59, 59)
}

/**
 * @title 生成年份选项
 */
function generateYearOptions(): ColumnOption[] {
  const minYear = parsedMinDate.value.getFullYear()
  const maxYear = parsedMaxDate.value.getFullYear()
  const options: ColumnOption[] = []

  for (let year = minYear; year <= maxYear; year++) {
    options.push({ text: String(year), value: year })
  }

  return options
}

/**
 * @title 生成月份选项
 */
function generateMonthOptions(): ColumnOption[] {
  const options: ColumnOption[] = []
  let minMonth = 1
  let maxMonth = 12

  // 限制月份范围
  const selYear = selectedValues.value.year
  const minYear = parsedMinDate.value.getFullYear()
  const maxYear = parsedMaxDate.value.getFullYear()

  if (selYear === minYear) {
    minMonth = parsedMinDate.value.getMonth() + 1
  }
  if (selYear === maxYear) {
    maxMonth = parsedMaxDate.value.getMonth() + 1
  }

  for (let month = minMonth; month <= maxMonth; month++) {
    options.push({ text: String(month), value: month })
  }

  return options
}

/**
 * @title 生成日期选项
 */
function generateDayOptions(): ColumnOption[] {
  const options: ColumnOption[] = []
  const selYear = selectedValues.value.year
  const selMonth = selectedValues.value.month

  // 获取当月天数
  const daysInMonth = new Date(selYear, selMonth, 0).getDate()
  let minDay = 1
  let maxDay = daysInMonth

  // 限制日期范围
  const minDateVal = parsedMinDate.value
  const maxDateVal = parsedMaxDate.value

  if (selYear === minDateVal.getFullYear() && selMonth === minDateVal.getMonth() + 1) {
    minDay = minDateVal.getDate()
  }
  if (selYear === maxDateVal.getFullYear() && selMonth === maxDateVal.getMonth() + 1) {
    maxDay = maxDateVal.getDate()
  }

  for (let day = minDay; day <= maxDay; day++) {
    options.push({ text: String(day), value: day })
  }

  return options
}

/**
 * @title 生成小时选项
 */
function generateHourOptions(): ColumnOption[] {
  const options: ColumnOption[] = []

  for (let hour = props.minHour; hour <= props.maxHour; hour++) {
    options.push({ text: String(hour), value: hour })
  }

  return options
}

/**
 * @title 生成分钟选项
 */
function generateMinuteOptions(): ColumnOption[] {
  const options: ColumnOption[] = []

  for (let minute = props.minMinute; minute <= props.maxMinute; minute++) {
    options.push({ text: String(minute), value: minute })
  }

  return options
}

/**
 * @title 生成秒选项
 */
function generateSecondOptions(): ColumnOption[] {
  const options: ColumnOption[] = []

  for (let second = 0; second <= 59; second++) {
    options.push({ text: String(second), value: second })
  }

  return options
}

/**
 * @title 格式化选项显示
 */
function formatOption(type: ColumnType, value: string): string {
  if (props.formatter) {
    return props.formatter(type, value)
  }
  // 默认两位补零
  if (type !== 'year') {
    return value.padStart(2, '0')
  }
  return value
}

/**
 * @title 格式化日期用于显示
 */
function formatDateForDisplay(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  switch (props.type) {
    case 'date':
      return `${year}-${month}-${day}`
    case 'time':
      return props.isShowSeconds ? `${hour}:${minute}:${second}` : `${hour}:${minute}`
    case 'datetime':
      return props.isShowSeconds ? `${year}-${month}-${day} ${hour}:${minute}:${second}` : `${year}-${month}-${day} ${hour}:${minute}`
    case 'year-month':
      return `${year}-${month}`
    case 'month-day':
      return `${month}-${day}`
    default:
      return `${year}-${month}-${day}`
  }
}

/**
 * @title 根据 modelValue 初始化选中值
 */
function initSelectedValues() {
  if (!props.modelValue) {
    // 使用当前日期作为默认值
    const now = new Date()
    selectedValues.value = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      hour: 0,
      minute: 0,
      second: 0
    }
    // 默认值可能越界（now 在 min/max 之外），先 clamp 到范围内
    // 再由后续 initColumnOffsets 计算偏移，避免 offset 与实际年不符
    validateAndFixDate()
    return
  }

  const date = parseToDate(props.modelValue)
  selectedValues.value = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds()
  }
}

/**
 * @title 根据选中值生成 Date 对象
 */
function buildDate(): Date {
  return new Date(
    selectedValues.value.year,
    selectedValues.value.month - 1,
    selectedValues.value.day,
    selectedValues.value.hour,
    selectedValues.value.minute,
    selectedValues.value.second
  )
}

/**
 * @title 初始化列的滚动偏移
 */
function initColumnOffsets() {
  columnOffsets.value = displayColumns.value.map((column) => {
    const selectedVal = selectedValues.value[column.type]
    const index = column.options.findIndex((opt) => opt.value === selectedVal)
    if (index <= 0) return 0
    // 每个选项 itemHeight rpx，向上滚动为负值
    return -index * itemHeight.value
  })

  // 初始化触摸状态
  touchStates.value = displayColumns.value.map(() => ({
    startY: 0,
    startOffset: 0,
    startTime: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0
  }))
}

/**
 * @title 同步所有列的滚动偏移
 * @description 依据 selectedValues 重新计算每一列的 columnOffsets，
 * 用于日期被修正（validateAndFixDate / 联动限制）后保持滚轮与实际值一致
 */
function syncColumnOffsets() {
  displayColumns.value.forEach((column, colIndex) => {
    const selectedVal = selectedValues.value[column.type]
    const index = column.options.findIndex((opt) => opt.value === selectedVal)
    columnOffsets.value[colIndex] = index <= 0 ? 0 : -index * itemHeight.value
  })
}

/**
 * @title 获取列的滚动样式
 */
function getColumnStyle(colIndex: number): Record<string, string> {
  const offset = columnOffsets.value[colIndex] || 0
  return {
    transform: `translateY(${offset}rpx)`,
    transition: isTouching.value ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)'
  }
}

/**
 * @title 限制滚动范围
 */
function clampOffset(colIndex: number, offset: number): number {
  const column = displayColumns.value[colIndex]
  if (!column) return offset

  const maxOffset = 0
  const minOffset = -(column.options.length - 1) * itemHeight.value

  return Math.max(minOffset, Math.min(maxOffset, offset))
}

/**
 * @title 吸附到最近的选项
 */
function snapToNearest(colIndex: number) {
  const column = displayColumns.value[colIndex]
  if (!column || column.options.length === 0) return

  const offset = columnOffsets.value[colIndex] || 0
  const index = Math.round(-offset / itemHeight.value)
  const clampedIndex = Math.max(0, Math.min(column.options.length - 1, index))

  columnOffsets.value[colIndex] = -clampedIndex * itemHeight.value

  // 更新选中值
  const selectedOption = column.options[clampedIndex]
  if (selectedOption) {
    selectedValues.value[column.type] = selectedOption.value
    // 验证日期有效性并修正
    validateAndFixDate()
    // 修正可能改动了所有字段（day/年月范围 clamp），同步刷新所有列偏移
    nextTick(() => {
      syncColumnOffsets()
    })
  }
}

/**
 * @title 验证并修正日期
 * @description 当年月变化时，确保日不超过当月最大天数
 */
function validateAndFixDate() {
  const year = selectedValues.value.year
  const month = selectedValues.value.month
  const daysInMonth = new Date(year, month, 0).getDate()

  if (selectedValues.value.day > daysInMonth) {
    selectedValues.value.day = daysInMonth
  }

  // 限制到日期范围内
  const minDateVal = parsedMinDate.value
  const maxDateVal = parsedMaxDate.value
  const currentDate = buildDate()

  if (currentDate < minDateVal) {
    selectedValues.value.year = minDateVal.getFullYear()
    selectedValues.value.month = minDateVal.getMonth() + 1
    selectedValues.value.day = minDateVal.getDate()
    selectedValues.value.hour = minDateVal.getHours()
    selectedValues.value.minute = minDateVal.getMinutes()
    selectedValues.value.second = minDateVal.getSeconds()
  } else if (currentDate > maxDateVal) {
    selectedValues.value.year = maxDateVal.getFullYear()
    selectedValues.value.month = maxDateVal.getMonth() + 1
    selectedValues.value.day = maxDateVal.getDate()
    selectedValues.value.hour = maxDateVal.getHours()
    selectedValues.value.minute = maxDateVal.getMinutes()
    selectedValues.value.second = maxDateVal.getSeconds()
  }
}

/**
 * @title 触摸开始
 */
function onTouchStart(event: TouchEvent, colIndex: number) {
  if (mergedDisabled.value || mergedReadonly.value) return

  isTouching.value = true
  const touch = event.touches[0]
  touchStates.value[colIndex] = {
    startY: touch.clientY,
    startOffset: columnOffsets.value[colIndex] || 0,
    startTime: Date.now(),
    lastY: touch.clientY,
    lastTime: Date.now(),
    velocity: 0
  }
}

/**
 * @title 触摸移动
 */
function onTouchMove(event: TouchEvent, colIndex: number) {
  if (mergedDisabled.value || mergedReadonly.value) return

  const touch = event.touches[0]
  const state = touchStates.value[colIndex]
  if (!state) return

  const deltaY = touch.clientY - state.startY
  // 将 px 转换为 rpx
  const deltaRpx = deltaY * pixelRatio.value
  const newOffset = clampOffset(colIndex, state.startOffset + deltaRpx)

  // 更新速度
  const now = Date.now()
  const dt = now - state.lastTime
  if (dt > 0) {
    state.velocity = (((touch.clientY - state.lastY) * pixelRatio.value) / dt) * 1000
  }
  state.lastY = touch.clientY
  state.lastTime = now

  columnOffsets.value[colIndex] = newOffset
}

/**
 * @title 触摸结束
 */
function onTouchEnd(event: TouchEvent, colIndex: number) {
  if (mergedDisabled.value || mergedReadonly.value) return

  const state = touchStates.value[colIndex]
  if (!state) return

  // 根据速度添加惯性滚动
  const velocity = state.velocity
  const currentOffset = columnOffsets.value[colIndex] || 0
  let targetOffset = currentOffset + velocity * 0.3 // 惯性系数

  // 限制范围
  targetOffset = clampOffset(colIndex, targetOffset)

  // 吸附
  columnOffsets.value[colIndex] = targetOffset
  isTouching.value = false
  nextTick(() => {
    snapToNearest(colIndex)
  })
}

/**
 * @title 打开选择器
 */
function handleOpen() {
  if (mergedDisabled.value || mergedReadonly.value) return

  initSelectedValues()
  isVisible.value = true

  nextTick(() => {
    initColumnOffsets()
  })
}

/**
 * @title 取消选择
 */
function handleCancel() {
  isVisible.value = false
  emit('onCancel')
}

/**
 * @title 确认选择
 */
function handleConfirm() {
  // 确认前先修正，保证不 emit 越界日期（如默认值未经触摸直接确认的场景）
  validateAndFixDate()
  const date = buildDate()
  emit('update:modelValue', date)
  emit('onChange', date)
  emit('onConfirm', date)
  field.handleChange(date)
  isVisible.value = false
}

/** ---------- watch ----------**

/** 监听 modelValue 变化，同步内部状态 */
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      initSelectedValues()
    }
  },
  { immediate: true }
)

/** 监听 type 变化，重新初始化 */
watch(
  () => props.type,
  () => {
    initSelectedValues()
  }
)

/** 监听选中值变化，更新列选项（处理范围限制联动） */
watch(
  () => selectedValues.value.year,
  () => {
    // 年变化可能导致月/日范围变化
    nextTick(() => {
      // 重新检查月和日的有效性
      const monthCol = displayColumns.value.find((c) => c.type === 'month')
      if (monthCol && !monthCol.options.find((opt) => opt.value === selectedValues.value.month)) {
        selectedValues.value.month = monthCol.options[0]?.value || 1
      }
      const dayCol = displayColumns.value.find((c) => c.type === 'day')
      if (dayCol && !dayCol.options.find((opt) => opt.value === selectedValues.value.day)) {
        selectedValues.value.day = dayCol.options[0]?.value || 1
      }
      // 联动修正 month/day 后同步刷新所有列偏移，避免滚轮与值脱钩
      syncColumnOffsets()
    })
  }
)

watch(
  () => selectedValues.value.month,
  () => {
    // 月变化可能导致日范围变化
    nextTick(() => {
      const dayCol = displayColumns.value.find((c) => c.type === 'day')
      if (dayCol && !dayCol.options.find((opt) => opt.value === selectedValues.value.day)) {
        selectedValues.value.day = dayCol.options[dayCol.options.length - 1]?.value || 1
      }
      // 联动修正 day 后同步刷新所有列偏移，避免滚轮与值脱钩
      syncColumnOffsets()
    })
  }
)

/** ---------- lifecycle ---------- */

/** 组件卸载时清理 */
onBeforeUnmount(() => {
  field.resetField()
})

/** ---------- expose ---------- */
defineExpose({
  /** 打开选择器 */
  open: handleOpen,
  /** 关闭选择器 */
  close: handleCancel,
  /** 是否打开中 */
  isVisible: () => isVisible.value,
  /** 校验状态 */
  validateStatus: field.validateStatus,
  /** 校验信息 */
  validateMessage: field.validateMessage,
  /** 校验该字段 */
  validate: field.validate,
  /** 重置该字段 */
  resetField: field.resetField,
  /** 清除校验状态 */
  clearValidate: field.clearValidate
})
</script>

<style lang="scss" scoped>
/* ---------- CSS 变量（组件级覆盖） ---------- */
.see-datetime-picker-wrapper {
  --picker-height-small: 56rpx;
  --picker-height-default: 72rpx;
  --picker-height-large: 88rpx;
  --picker-font-size-small: 24rpx;
  --picker-font-size-default: 28rpx;
  --picker-font-size-large: 32rpx;
  --picker-padding-h: 24rpx;
  --picker-border-radius: 8rpx;
  --picker-popup-radius: 24rpx;
  --picker-item-height: 88rpx;
  --picker-visible-count: 5;
  --picker-column-height: calc(var(--picker-item-height) * var(--picker-visible-count));
}

/* ---------- 触发区域 ---------- */
.see-datetime-picker {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--see-bg-color);
  border-radius: var(--picker-border-radius);
  cursor: pointer;

  &.is-border {
    border: 1px solid var(--see-border-four-color);
  }

  &.is-selected.is-border {
    border-color: var(--see-border-four-color);
  }

  /* ---------- 尺寸 ---------- */
  &--small {
    min-height: var(--picker-height-small);
    padding: 0 16rpx;
    font-size: var(--picker-font-size-small);
  }

  &--default {
    min-height: var(--picker-height-default);
    padding: 0 var(--picker-padding-h);
    font-size: var(--picker-font-size-default);
  }

  &--large {
    min-height: var(--picker-height-large);
    padding: 0 32rpx;
    font-size: var(--picker-font-size-large);
  }

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--see-border-four-color);
  }

  /* ---------- 只读状态 ---------- */
  &.is-readonly {
    cursor: default;
  }

  /* ---------- 值显示 ---------- */
  &__value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--see-main-color);

    &--placeholder {
      color: var(--see-tips-color);
    }
  }

  /* ---------- 箭头 ---------- */
  &__arrow {
    flex-shrink: 0;
    margin-left: 8rpx;
    color: var(--see-tips-color);
    font-size: 24rpx;
    transition: transform 0.2s ease;
  }
}

/* ---------- 弹出层 ---------- */
.see-datetime-picker__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: var(--see-mask-color, rgba(0, 0, 0, 0.5));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.see-datetime-picker__popup {
  width: 100%;
  background-color: var(--see-bg-color);
  border-radius: var(--picker-popup-radius) var(--picker-popup-radius) 0 0;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);

  &--small {
    --picker-item-height: 72rpx;
  }

  &--default {
    --picker-item-height: 88rpx;
  }

  &--large {
    --picker-item-height: 100rpx;
  }
}

/* ---------- 工具栏 ---------- */
.see-datetime-picker__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-bottom: 1px solid var(--see-border-four-color);
}

.see-datetime-picker__toolbar-title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--see-main-color);
  text-align: center;
  flex: 1;
}

.see-datetime-picker__toolbar-btn {
  font-size: 28rpx;
  padding: 8rpx 16rpx;

  &--cancel {
    color: var(--see-content-color);
  }

  &--confirm {
    color: var(--see-primary);
    font-weight: 500;
  }

  &:active {
    opacity: 0.7;
  }
}

/* ---------- 选择器主体 ---------- */
.see-datetime-picker__body {
  padding: 0 16rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.see-datetime-picker__columns {
  position: relative;
  display: flex;
  height: var(--picker-column-height);
  overflow: hidden;
}

/* ---------- 遮罩层 ---------- */
.see-datetime-picker__mask {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;

  &--top {
    top: 0;
    height: calc(var(--picker-item-height) * 2);
    background: linear-gradient(to bottom, var(--see-bg-color) 0%, transparent 100%);
  }

  &--bottom {
    bottom: 0;
    height: calc(var(--picker-item-height) * 2);
    background: linear-gradient(to top, var(--see-bg-color) 0%, transparent 100%);
  }
}

/* ---------- 选中指示器 ---------- */
.see-datetime-picker__indicator {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(var(--picker-item-height) * 2);
  height: var(--picker-item-height);
  z-index: 10;
  pointer-events: none;
  border-top: 1px solid var(--see-border-three-color);
  border-bottom: 1px solid var(--see-border-three-color);
}

/* ---------- 列 ---------- */
.see-datetime-picker__column {
  flex: 1;
  position: relative;
  z-index: 5;
}

.see-datetime-picker__column-inner {
  /* 上下各留 2 个选项的空间，使得第一个和最后一个选项也能滚动到选中位置 */
  padding-top: calc(var(--picker-item-height) * 2);
  padding-bottom: calc(var(--picker-item-height) * 2);
}

/* ---------- 选项 ---------- */
.see-datetime-picker__item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--picker-item-height);
  padding: 0 8rpx;
}

.see-datetime-picker__item-text {
  font-size: 32rpx;
  color: var(--see-content-color);
  transition:
    color 0.2s ease,
    font-weight 0.2s ease;

  .see-datetime-picker__item--selected & {
    color: var(--see-main-color);
    font-weight: 600;
    font-size: 34rpx;
  }
}

/* ---------- 内置图标字体 ---------- */
.see-datetime-picker-icon-arrow {
  &::before {
    content: '\25BE';
    font-size: 20rpx;
  }
}

/* ---------- 动画 ---------- */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
