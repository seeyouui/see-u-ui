/**
 * SeeInput 组件类型定义
 * @description 输入框组件的类型声明
 */

/** 输入框类型 */
export type InputType = 'text' | 'number' | 'password' | 'digit' | 'tel' | 'idcard'

/** 输入框尺寸 */
export type InputSize = 'small' | 'default' | 'large'

/** SeeInput Props */
export interface SeeInputProps {
  /** 绑定值 */
  modelValue?: string | number
  /** 输入类型 */
  type?: InputType
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否显示清除按钮 */
  isClearable?: boolean
  /** 最大输入长度 */
  maxlength?: number
  /** 是否显示字数统计 */
  isShowWordLimit?: boolean
  /** 前缀图标 */
  prefixIcon?: string
  /** 后缀图标 */
  suffixIcon?: string
  /** 尺寸 */
  size?: InputSize
  /** 是否显示边框 */
  isBorder?: boolean
  /** 是否自动聚焦 */
  isFocus?: boolean
  /** 自定义输入框样式 */
  inputStyle?: Record<string, any>
  /** 表单字段名 */
  name?: string
  /** 输入格式化函数 */
  formatter?: (value: string) => string
  /** 格式化内容解析函数 */
  parser?: (value: string) => string
  /** 是否显示密码切换按钮 */
  isShowPassword?: boolean
  /** 自动完成（H5） */
  autocomplete?: string
}

/** SeeInput Events */
export interface SeeInputEmits {
  /** 输入时触发 */
  onInput: (value: string | number) => void
  /** 聚焦时触发 */
  onFocus: (event: FocusEvent) => void
  /** 失焦时触发 */
  onBlur: (event: FocusEvent) => void
  /** 清除时触发 */
  onClear: () => void
  /** 值变化时触发（失焦后） */
  onChange: (value: string | number) => void
  /** 键盘确认时触发 */
  onConfirm: (value: string | number) => void
  /** 键盘高度变化时触发 */
  onKeyboardHeightChange: () => void
  /** v-model 更新 */
  'update:modelValue': (value: string | number) => void
}

/** Form 注入的上下文类型 */
export interface FormContext {
  /** 表单禁用状态 */
  isDisabled?: boolean
  /** 表单只读状态 */
  isReadonly?: boolean
  /** 表单尺寸 */
  size?: InputSize
}
