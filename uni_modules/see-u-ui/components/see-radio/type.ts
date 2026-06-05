/**
 * Radio 组件类型定义
 */

/** Radio 尺寸 */
export type RadioSize = 'small' | 'default' | 'large'

/** Radio 组件 Props */
export interface RadioProps {
  /** 选项值 */
  label?: string | number | boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 尺寸 */
  size?: RadioSize
  /** 是否显示边框 */
  isBorder?: boolean
  /** 选中时颜色 */
  checkedColor?: string
  /** 表单字段名 */
  name?: string
}

/** Radio 事件 */
export interface RadioEmits {
  /** 状态变化时触发 */
  onChange: (value: string | number | boolean) => void
}

/** RadioGroup 组件 Props */
export interface RadioGroupProps {
  /** 绑定值（v-model） */
  modelValue?: string | number | boolean
  /** 是否禁用整组 */
  isDisabled?: boolean
  /** 是否只读整组 */
  isReadonly?: boolean
  /** 尺寸 */
  size?: RadioSize
  /** 是否显示边框 */
  isBorder?: boolean
  /** 是否行内排列 */
  isInline?: boolean
  /** 选中时颜色 */
  checkedColor?: string
  /** 表单字段名 */
  name?: string
}

/** RadioGroup 事件 */
export interface RadioGroupEmits {
  /** 值变化时触发 */
  onChange: (value: string | number | boolean) => void
}

/** RadioGroup provide 的上下文类型 */
export interface RadioGroupContext {
  /** 当前选中的值 */
  modelValue: string | number | boolean
  /** 是否禁用 */
  isDisabled: boolean
  /** 是否只读 */
  isReadonly: boolean
  /** 尺寸 */
  size: RadioSize
  /** 是否显示边框 */
  isBorder: boolean
  /** 选中时颜色 */
  checkedColor: string
  /** 更新选中值 */
  updateValue: (label: string | number | boolean) => void
}

export type { FormContext } from '../../utils/shared/form-types'
