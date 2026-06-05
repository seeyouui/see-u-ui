/** NumberBox 组件尺寸 */
export type NumberBoxSize = 'small' | 'default' | 'large'

/** NumberBox 组件 Props */
export interface NumberBoxProps {
  /** 绑定值 */
  modelValue?: number
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否禁用输入框（仅禁用输入，按钮可用） */
  isDisabledInput?: boolean
  /** 是否禁用增加按钮 */
  isDisabledPlus?: boolean
  /** 是否禁用减少按钮 */
  isDisabledMinus?: boolean
  /** 保留小数位数 */
  decimalLength?: number
  /** 尺寸 */
  size?: NumberBoxSize
  /** 输入框宽度，默认 60 */
  inputWidth?: number
  /** 是否异步模式（外部控制值） */
  isAsync?: boolean
  /** 表单字段名 */
  name?: string
}

/** NumberBox 组件事件 */
export interface NumberBoxEmits {
  /** 值变化时触发 */
  onChange: (value: number) => void
  /** 超出限制时触发 */
  onOverlimit: () => void
  /** 点击增加按钮触发 */
  onPlus: () => void
  /** 点击减少按钮触发 */
  onMinus: () => void
  /** 输入框聚焦触发 */
  onFocus: () => void
  /** 输入框失焦触发 */
  onBlur: () => void
}

/** Form 注入的上下文类型 */
export interface FormContext {
  /** 表单禁用状态 */
  isDisabled?: boolean
  /** 表单只读状态 */
  isReadonly?: boolean
  /** 表单尺寸 */
  size?: NumberBoxSize
}
