/**
 * SeeDatetimePicker 组件类型定义
 * @description 日期时间选择器的类型声明
 */

/** 选择器类型 */
export type DatetimePickerType = 'date' | 'time' | 'datetime' | 'year-month' | 'month-day'

/** 选择器尺寸 */
export type DatetimePickerSize = 'small' | 'default' | 'large'

/** 滚轮列类型 */
export type ColumnType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'

/** 列选项 */
export interface ColumnOption {
  /** 显示文本 */
  text: string
  /** 实际值 */
  value: number
}

/** 列定义 */
export interface PickerColumn {
  /** 列类型 */
  type: ColumnType
  /** 选项列表 */
  options: ColumnOption[]
}

/** SeeDatetimePicker Props */
export interface SeeDatetimePickerProps {
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
  formatter?: (type: string, value: string) => string
  /** 自定义过滤函数 */
  filter?: (type: string, values: string[]) => string[]
  /** 尺寸 */
  size?: DatetimePickerSize
  /** 是否显示边框 */
  isBorder?: boolean
  /** 表单字段名 */
  name?: string
}

/** SeeDatetimePicker Events */
export interface SeeDatetimePickerEmits {
  /** 值变化时触发 */
  onChange: (value: Date) => void
  /** 确认时触发 */
  onConfirm: (value: Date) => void
  /** 取消时触发 */
  onCancel: () => void
  /** v-model 更新 */
  'update:modelValue': (value: Date) => void
}

export type { FormContext } from '../../utils/shared/form-types'
