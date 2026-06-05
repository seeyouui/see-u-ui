/**
 * SeePicker 组件类型定义
 * @description 选择器组件的类型声明，支持单列、多列、联动三种模式
 */

/** 选择器选项 */
export interface PickerOption {
  /** 显示文字 */
  text: string
  /** 选项值 */
  value: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 子选项（联动模式） */
  children?: PickerOption[]
}

/** 选择器列数据 */
export type PickerColumn = PickerOption[]

/** 选择器尺寸 */
export type PickerSize = 'small' | 'default' | 'large'

/** SeePicker Props */
export interface SeePickerProps {
  /** 绑定值（v-model） */
  modelValue?: string | number | (string | number)[]
  /** 选项数据 */
  columns?: PickerColumn[]
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否显示顶部 toolbar */
  isShowToolbar?: boolean
  /** toolbar 标题 */
  toolbarTitle?: string
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 是否联动模式 */
  isCascade?: boolean
  /** 值键名 */
  valueKey?: string
  /** 标签键名 */
  labelKey?: string
  /** 子选项键名 */
  childrenKey?: string
  /** 尺寸 */
  size?: PickerSize
  /** 是否显示边框 */
  isBorder?: boolean
  /** 表单字段名 */
  name?: string
  /** 可见选项数 */
  visibleItemCount?: number
  /** 是否异步加载 */
  isAsync?: boolean
}

/** SeePicker Events */
export interface SeePickerEmits {
  /** 选中值变化时触发 */
  onChange: (value: string | number | (string | number)[], index: number) => void
  /** 确认时触发 */
  onConfirm: (value: string | number | (string | number)[]) => void
  /** 取消时触发 */
  onCancel: () => void
  /** 列变化时触发（联动模式） */
  onColumnChange: (index: number) => void
  /** v-model 更新 */
  'update:modelValue': (value: string | number | (string | number)[]) => void
}

/** 滚轮状态 */
export interface WheelState {
  /** 当前偏移量 */
  offset: number
  /** 起始触摸 Y */
  startY: number
  /** 起始偏移量 */
  startOffset: number
  /** 开始时间 */
  startTime: number
  /** 是否正在触摸 */
  touching: boolean
}

export type { FormContext } from '../../utils/shared/form-types'
