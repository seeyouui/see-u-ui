import type { CSSProperties } from 'vue'

/** Textarea 组件尺寸 */
export type TextareaSize = 'small' | 'default' | 'large'

/** 键盘右下角按钮文字 */
export type ConfirmType = 'return' | 'send' | 'search' | 'next' | 'go'

/** Textarea 组件 Props */
export interface TextareaProps {
  /** 绑定值（v-model） */
  modelValue?: string
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 最大输入长度（-1 表示不限制） */
  maxlength?: number
  /** 是否显示字数统计 */
  isShowWordLimit?: boolean
  /** 行数 */
  rows?: number
  /** 是否自动增高 */
  isAutoHeight?: boolean
  /** 是否显示边框 */
  isBorder?: boolean
  /** 是否自动聚焦 */
  isFocus?: boolean
  /** 是否显示清除按钮 */
  isClearable?: boolean
  /** 尺寸 */
  size?: TextareaSize
  /** 表单字段名 */
  name?: string
  /** 自定义输入框样式 */
  inputStyle?: CSSProperties
  /** 键盘右下角按钮文字 */
  confirmType?: ConfirmType
}

/** Textarea 组件事件 */
export interface TextareaEmits {
  /** 输入时触发 */
  onInput: (value: string) => void
  /** 聚焦时触发 */
  onFocus: (event: FocusEvent) => void
  /** 失焦时触发 */
  onBlur: (event: FocusEvent) => void
  /** 清除时触发 */
  onClear: () => void
  /** 值变化时触发（失焦后） */
  onChange: (value: string) => void
  /** 键盘确认时触发 */
  onConfirm: (value: string) => void
  /** 键盘高度变化时触发 */
  onKeyboardHeightChange: (height: number) => void
  /** 行数变化时触发 */
  onLineChange: (lines: number) => void
}

export type { FormContext } from '../../utils/shared/form-types'
