/**
 * Checkbox 组件类型定义
 */

/** Checkbox 尺寸 */
export type CheckboxSize = 'small' | 'default' | 'large'

/** Checkbox 组件 Props */
export interface CheckboxProps {
  /** 绑定值（v-model） */
  modelValue?: boolean
  /** 选中状态的值（用于 CheckboxGroup） */
  label?: string | number | boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 半选状态（全选场景） */
  isIndeterminate?: boolean
  /** 尺寸 */
  size?: CheckboxSize
  /** 是否显示边框 */
  isBorder?: boolean
  /** 选中时颜色 */
  checkedColor?: string
  /** 表单字段名 */
  name?: string
}

/** Checkbox 事件 */
export interface CheckboxEmits {
  /** 状态变化时触发 */
  onChange: (value: boolean) => void
}

/** CheckboxGroup 组件 Props */
export interface CheckboxGroupProps {
  /** 绑定值数组（v-model） */
  modelValue?: (string | number | boolean)[]
  /** 是否禁用整组 */
  isDisabled?: boolean
  /** 是否只读整组 */
  isReadonly?: boolean
  /** 最多可选数量 */
  max?: number
  /** 最少可选数量 */
  min?: number
  /** 尺寸 */
  size?: CheckboxSize
  /** 是否显示边框 */
  isBorder?: boolean
  /** 是否行内排列 */
  isInline?: boolean
  /** 选中时颜色 */
  checkedColor?: string
  /** 表单字段名 */
  name?: string
}

/** CheckboxGroup 事件 */
export interface CheckboxGroupEmits {
  /** 值变化时触发 */
  onChange: (values: (string | number | boolean)[]) => void
}

/** CheckboxGroup provide 的上下文类型 */
export interface CheckboxGroupContext {
  /** 当前选中的值数组 */
  modelValue: (string | number | boolean)[]
  /** 是否禁用 */
  isDisabled: boolean
  /** 是否只读 */
  isReadonly: boolean
  /** 最多可选数量 */
  max: number
  /** 最少可选数量 */
  min: number
  /** 尺寸 */
  size: CheckboxSize
  /** 是否显示边框 */
  isBorder: boolean
  /** 选中时颜色 */
  checkedColor: string
  /** 注册子 Checkbox */
  register: (label: string | number | boolean) => void
  /** 注销子 Checkbox */
  unregister: (label: string | number | boolean) => void
  /** 切换选中状态 */
  toggle: (label: string | number | boolean) => void
}

/** Form 注入的上下文类型 */
export interface FormContext {
  /** 表单禁用状态 */
  isDisabled?: boolean
  /** 表单只读状态 */
  isReadonly?: boolean
  /** 表单尺寸 */
  size?: CheckboxSize
}
